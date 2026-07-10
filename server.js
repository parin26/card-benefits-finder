require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const lookupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many lookups from this device in the last hour. Try again later.' }
});
app.use('/api/lookup', lookupLimiter);

const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many questions from this device in the last hour. Try again later.' }
});
app.use('/api/chat', chatLimiter);

const salaryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many salary account lookups from this device in the last hour. Try again later.' }
});
app.use('/api/salary-account', salaryLimiter);

const quizLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many card recommendations from this device in the last hour. Try again later.' }
});
app.use('/api/recommend-card', quizLimiter);

const NETWORK_PORTAL_HINTS = {
  'Visa': 'https://www.visa.co.in/en_in/visa-offers-and-perks/',
  'Mastercard': 'https://www.mastercard.co.in/en-in/personal/offers-and-promotions.html',
  'RuPay': 'https://rupayselect.truztee.com/#/offers (only applies if this is a RuPay Select tier card)',
  'American Express': 'https://www.americanexpress.com/en-in/benefits/amex-offers/offers/',
  'Diners Club': 'https://dinersclub-offerplatform.com/'
};

const SYSTEM_PROMPT = `You are a financial data assistant specializing in Indian bank cards. Use Google Search to find current, accurate details from the official bank page, reliable comparator sites such as bankbazaar.com, cardexpert.in, or cardinsider.com, and, for network-level perks, the card network's own public benefits page. Respond with ONLY one minified JSON object. Do not use markdown code fences. Do not add any commentary before or after the JSON. Match exactly this schema: {"fees":{"joining":"","annual":"","addOnCard":"","cashWithdrawal":"","latePayment":"","interestRate":""},"feeWaiverTip":"","welcomeBenefit":"","eligibility":[""],"documentsRequired":[""],"rewards":[""],"loungeAccess":[""],"fuelSurcharge":"","insurance":[""],"forexMarkup":"","milestoneBenefits":[""],"otherPerks":[""],"maximizeTips":[""],"networkPerks":[""],"sources":[{"title":"","url":""}]}.

Field guidance:
- "feeWaiverTip": one specific, actionable sentence on how the cardholder can get the annual or renewal fee waived (for example an exact spend threshold), not a repeat of the fee numbers. If the card has no waiver path, say so plainly.
- "maximizeTips": 2 to 3 concrete, specific actions a cardholder should take to get the most value from THIS exact card (for example which portal to redeem points on for best value, which spend category to prioritize, or a milestone worth chasing). Avoid generic advice like "pay on time" or "use responsibly".
- "networkPerks": 2 to 3 benefits that come from the card's payment network program itself (Visa, Mastercard, RuPay, American Express, or Diners Club), separate from what the issuing bank itself provides, sourced from the network's own public benefits page. Leave empty if the network does not run a public benefits program for this tier of card, do not guess.
- "sources": include the publisher name and page topic in "title" (for example "HDFC Bank official Regalia Gold page", not just a bare URL), since this title is also used as a fallback search query if the link itself has stopped working. For "url", only ever copy a URL exactly as it appeared in your search results. Never construct, guess, or infer a URL from a site's typical naming pattern, even if it looks plausible — if you are not quoting a URL you actually saw, leave "url" empty rather than inventing one.
- Keep all other arrays to at most 3 short items.
- Do not include a cash withdrawal fee field's value unless the card type is a debit card or the person specifically has a use case for it; for credit cards it is rarely relevant, so only fill it if notably high or notably waived, otherwise use "Not applicable".
- If a field does not apply (for example interest rate on a debit card), use an empty array or "Not applicable". Do not guess if unsure, say the data was unavailable inside the field instead.

The JSON object is the entire response, nothing else.`;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function extractJson(rawText) {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

app.post('/api/lookup', async (req, res) => {
  const { bank, cardType, variant, network } = req.body || {};
  if (!bank || !cardType || !variant) {
    return res.status(400).json({ error: 'bank, cardType, and variant are all required' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your .env file.' });
  }

  const networkLine = network ? `Network: ${network}\n` : '';
  const portalHint = network && NETWORK_PORTAL_HINTS[network]
    ? `For the networkPerks field, check ${NETWORK_PORTAL_HINTS[network]} as the primary source for what ${network} itself offers on top of the bank's own perks.\n`
    : '';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Bank: ${bank}\nCard type: ${cardType}\nVariant: ${variant}\n${networkLine}${portalHint}Find the current details for this exact card.${network ? ' Use the details for the ' + network + ' network variant specifically where the bank issues more than one network for this card, since fees like forex markup can differ by network.' : ' If this card is issued on more than one network (for example Visa and RuPay versions), note any differences between networks inside the otherPerks field.'}`
              }
            ]
          }
        ],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        tools: [{ google_search: {} }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 1,
          thinkingConfig: { thinkingBudget: 512 }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error response:', JSON.stringify(data));

      if (response.status === 429) {
        const rawMessage = data.error?.message || '';
        const retryMatch = rawMessage.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
        const isDailyCap = /generate_content_free_tier_requests_per_day|per_day/i.test(rawMessage);

        const friendly = isDailyCap
          ? "You've hit Gemini's free daily request limit. It resets at midnight Pacific Time. Consider enabling billing in Google AI Studio to raise this cap."
          : retrySeconds
            ? `Gemini's free-tier burst limit was hit. Wait about ${retrySeconds} seconds and try again.`
            : "Gemini's rate limit was hit. Wait a moment and try again.";

        return res.status(429).json({ error: friendly, retrySeconds });
      }

      return res.status(response.status).json({ error: data.error?.message || 'Gemini API request failed' });
    }

    const candidate = data.candidates?.[0];

    if (data.promptFeedback?.blockReason) {
      console.error('Prompt blocked:', data.promptFeedback);
      return res.status(502).json({ error: `Request was blocked by Gemini: ${data.promptFeedback.blockReason}` });
    }

    if (!candidate) {
      console.error('No candidates in Gemini response:', JSON.stringify(data));
      return res.status(502).json({ error: 'Gemini returned no answer for this card. Try again.' });
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
      console.error('Unusual finish reason:', candidate.finishReason, JSON.stringify(data).slice(0, 2000));
      if (candidate.finishReason === 'MAX_TOKENS') {
        return res.status(502).json({ error: 'The response was cut off before it finished. Try again, or ask about a narrower card.' });
      }
      if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
        return res.status(502).json({ error: `Gemini declined to answer (reason: ${candidate.finishReason}). Try rephrasing the variant name.` });
      }
    }

    const parts = candidate.content?.parts || [];
    const rawText = parts.map((p) => p.text || '').join('\n');
    const jsonStr = extractJson(rawText);

    if (!jsonStr) {
      console.error('Could not find JSON in model output. Raw text was:', rawText.slice(0, 2000));
      return res.status(502).json({
        error: 'The model did not return structured data. Try again.',
        debug: rawText.slice(0, 300)
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('JSON.parse failed on extracted string:', jsonStr.slice(0, 2000));
      return res.status(502).json({
        error: 'The model returned malformed data. Try again.',
        debug: jsonStr.slice(0, 300)
      });
    }

    // The model can type out a plausible-looking but nonexistent URL from pattern memory,
    // even with search grounding on. Google's own groundingChunks metadata only ever contains
    // pages the search tool actually retrieved, so use that as the authoritative source list
    // instead of trusting whatever URL the model wrote inside its own JSON answer.
    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];
    const realSources = groundingChunks
      .map((c) => ({ title: c.web?.title || '', url: c.web?.uri || '' }))
      .filter((s) => s.url)
      .slice(0, 5);
    if (realSources.length) {
      parsed.sources = realSources;
    } else if (!Array.isArray(parsed.sources)) {
      parsed.sources = [];
    }

    res.json(parsed);
  } catch (err) {
    console.error('Unexpected error in /api/lookup:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

const SALARY_SYSTEM_PROMPT = `You are a financial advisor helping Indian salaried employees pick the best salary account for their income level. Use Google Search to find current salary account offerings from major Indian banks (HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, Yes Bank, IDFC FIRST Bank, Bank of Baroda, Punjab National Bank, Standard Chartered, Canara Bank, RBL Bank) that a person in the given monthly salary range would actually be eligible for. Recommend 3 to 4 specific, named salary account products, ranked by overall value: consider zero balance requirement, waived charges, sweep-in FD facility, debit card tier and its perks (lounge access, insurance, cashback), and any welcome benefits. If a preferred bank is given, include it if it has a genuinely suitable product for this salary range, but do not force it in if it does not fit. Respond with ONLY one minified JSON object, no markdown fences, no commentary. Match exactly this schema: {"recommendations":[{"bank":"","accountName":"","minSalaryRequirement":"","keyBenefits":["","",""],"debitCardVariant":"","whyThisFits":""}],"generalTips":["",""],"sources":[{"title":"","url":""}]}. Keep recommendations to at most 4 entries, keyBenefits to at most 3 items each, and generalTips to at most 3 items. For "whyThisFits", write one specific sentence tying the account to the person's actual salary bracket, not a generic pitch. Never construct or guess a URL; only report one you actually saw in search results, and if a bank's specific account name is not confidently known, say the tier in general terms (for example "a Regalia-tier salary account") rather than inventing a name. The JSON object is the entire response, nothing else.`;

app.post('/api/salary-account', async (req, res) => {
  const { salaryRange, preferredBank } = req.body || {};
  if (!salaryRange || typeof salaryRange !== 'string') {
    return res.status(400).json({ error: 'A salary range is required' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your .env file.' });
  }

  const bankLine = preferredBank ? `Preferred bank (only if it genuinely fits): ${preferredBank}\n` : '';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Monthly salary range: ${salaryRange}\n${bankLine}Recommend the best salary accounts for this income level.` }
            ]
          }
        ],
        systemInstruction: { parts: [{ text: SALARY_SYSTEM_PROMPT }] },
        tools: [{ google_search: {} }],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.5,
          thinkingConfig: { thinkingBudget: 512 }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error response (salary-account):', JSON.stringify(data));
      if (response.status === 429) {
        const rawMessage = data.error?.message || '';
        const retryMatch = rawMessage.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
        const isDailyCap = /generate_content_free_tier_requests_per_day|per_day/i.test(rawMessage);
        const friendly = isDailyCap
          ? "You've hit Gemini's free daily request limit. It resets at midnight Pacific Time."
          : retrySeconds
            ? `Gemini's free-tier burst limit was hit. Wait about ${retrySeconds} seconds and try again.`
            : "Gemini's rate limit was hit. Wait a moment and try again.";
        return res.status(429).json({ error: friendly, retrySeconds });
      }
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API request failed' });
    }

    const candidate = data.candidates?.[0];
    if (data.promptFeedback?.blockReason) {
      return res.status(502).json({ error: `Request was blocked by Gemini: ${data.promptFeedback.blockReason}` });
    }
    if (!candidate) {
      return res.status(502).json({ error: 'Gemini returned no answer. Try again.' });
    }
    if (candidate.finishReason === 'MAX_TOKENS') {
      return res.status(502).json({ error: 'The response was cut off before it finished. Try again.' });
    }
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      return res.status(502).json({ error: `Gemini declined to answer (reason: ${candidate.finishReason}).` });
    }

    const parts = candidate.content?.parts || [];
    const rawText = parts.map((p) => p.text || '').join('\n');
    const jsonStr = extractJson(rawText);

    if (!jsonStr) {
      console.error('Could not find JSON in salary-account output. Raw text was:', rawText.slice(0, 2000));
      return res.status(502).json({
        error: 'The model did not return structured data. Try again.',
        debug: rawText.slice(0, 300)
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('JSON.parse failed on salary-account output:', jsonStr.slice(0, 2000));
      return res.status(502).json({
        error: 'The model returned malformed data. Try again.',
        debug: jsonStr.slice(0, 300)
      });
    }

    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];
    const realSources = groundingChunks
      .map((c) => ({ title: c.web?.title || '', url: c.web?.uri || '' }))
      .filter((s) => s.url)
      .slice(0, 5);
    if (realSources.length) {
      parsed.sources = realSources;
    } else if (!Array.isArray(parsed.sources)) {
      parsed.sources = [];
    }

    res.json(parsed);
  } catch (err) {
    console.error('Unexpected error in /api/salary-account:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

const QUIZ_SYSTEM_PROMPT = `You are a financial advisor helping an Indian consumer pick the best credit card for their spending habits. Use Google Search to find current cards from major Indian banks (HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, Yes Bank, IDFC FIRST Bank, Bank of Baroda, Punjab National Bank, Standard Chartered, Canara Bank, RBL Bank, American Express India) that genuinely match the person's spending category, spend amount, lounge preference, and network preference if given. Recommend 3 specific, named cards, ranked by fit, not just popularity. Respond with ONLY one minified JSON object, no markdown fences, no commentary. Match exactly this schema: {"recommendations":[{"bank":"","cardName":"","network":"","whyThisFits":"","keyPerks":["","",""],"annualFee":""}],"sources":[{"title":"","url":""}]}. Keep recommendations to exactly 3 entries and keyPerks to at most 3 items each. For "whyThisFits", tie the recommendation to the specific spending category and amount given, not a generic pitch. Never construct or guess a URL; only report one you actually saw in search results. The JSON object is the entire response, nothing else.`;

app.post('/api/recommend-card', async (req, res) => {
  const { spendCategory, spendAmount, wantsLounge, preferredNetwork } = req.body || {};
  if (!spendCategory || !spendAmount) {
    return res.status(400).json({ error: 'Spending category and amount are required' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your .env file.' });
  }

  const networkLine = preferredNetwork ? `Preferred network: ${preferredNetwork}\n` : '';

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `Top spending category: ${spendCategory}\nTypical monthly card spend: ${spendAmount}\nWants airport lounge access: ${wantsLounge}\n${networkLine}Recommend the best credit cards for this spending profile.` }
            ]
          }
        ],
        systemInstruction: { parts: [{ text: QUIZ_SYSTEM_PROMPT }] },
        tools: [{ google_search: {} }],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.5,
          thinkingConfig: { thinkingBudget: 512 }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error response (recommend-card):', JSON.stringify(data));
      if (response.status === 429) {
        const rawMessage = data.error?.message || '';
        const retryMatch = rawMessage.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
        const isDailyCap = /generate_content_free_tier_requests_per_day|per_day/i.test(rawMessage);
        const friendly = isDailyCap
          ? "You've hit Gemini's free daily request limit. It resets at midnight Pacific Time."
          : retrySeconds
            ? `Gemini's free-tier burst limit was hit. Wait about ${retrySeconds} seconds and try again.`
            : "Gemini's rate limit was hit. Wait a moment and try again.";
        return res.status(429).json({ error: friendly, retrySeconds });
      }
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API request failed' });
    }

    const candidate = data.candidates?.[0];
    if (data.promptFeedback?.blockReason) {
      return res.status(502).json({ error: `Request was blocked by Gemini: ${data.promptFeedback.blockReason}` });
    }
    if (!candidate) {
      return res.status(502).json({ error: 'Gemini returned no answer. Try again.' });
    }
    if (candidate.finishReason === 'MAX_TOKENS') {
      return res.status(502).json({ error: 'The response was cut off before it finished. Try again.' });
    }
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      return res.status(502).json({ error: `Gemini declined to answer (reason: ${candidate.finishReason}).` });
    }

    const parts = candidate.content?.parts || [];
    const rawText = parts.map((p) => p.text || '').join('\n');
    const jsonStr = extractJson(rawText);

    if (!jsonStr) {
      console.error('Could not find JSON in recommend-card output. Raw text was:', rawText.slice(0, 2000));
      return res.status(502).json({
        error: 'The model did not return structured data. Try again.',
        debug: rawText.slice(0, 300)
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('JSON.parse failed on recommend-card output:', jsonStr.slice(0, 2000));
      return res.status(502).json({
        error: 'The model returned malformed data. Try again.',
        debug: jsonStr.slice(0, 300)
      });
    }

    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];
    const realSources = groundingChunks
      .map((c) => ({ title: c.web?.title || '', url: c.web?.uri || '' }))
      .filter((s) => s.url)
      .slice(0, 5);
    if (realSources.length) {
      parsed.sources = realSources;
    } else if (!Array.isArray(parsed.sources)) {
      parsed.sources = [];
    }

    res.json(parsed);
  } catch (err) {
    console.error('Unexpected error in /api/recommend-card:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

const CHAT_SYSTEM_PROMPT_BASE = `You are a precise, honest assistant for questions about Indian bank credit and debit card benefits. Use Google Search extensively to verify every specific claim before answering — never rely on memory alone, since banks change perks, partnerships, and eligibility often. Always search broadly across all major Indian banks and card products relevant to the question, rather than assuming the answer is limited to any particular bank or card the person may have mentioned before. Answer in plain conversational prose, 2 to 5 sentences unless a short list is clearly needed, and always name which exact card(s) and bank(s) offer what you describe rather than speaking generally. If you cannot verify something confidently after searching, say so directly rather than guessing — an honest "I couldn't confirm this" is far better than a wrong answer. If several cards across different banks qualify, list the top few rather than arbitrarily picking one. Never fabricate a URL from pattern memory; only reference sources you actually found.

Critical rule about card-specific numbers: NEVER provide a BIN (bank identification number), card number, CVV, or any other digits that claim to identify a specific card, even if asked directly and even if you can search for one. A BIN is assigned per issuance batch, not per card product, so there is no single correct BIN for "a Canara Bank RuPay debit card" or similar — different physical cards of the same product have different BINs. If asked for a BIN or any card-identifying number, explain plainly that this is unique to the person's own physical card and can only be read off the card itself or a bank statement, and that you cannot look one up or generate one. Do not offer an example number, even labeled as an example, since it gets copied and used as if real.`;

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'A message is required' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your .env file.' });
  }

  const systemPrompt = CHAT_SYSTEM_PROMPT_BASE;

  const contents = [];
  if (Array.isArray(history)) {
    history.slice(-10).forEach((turn) => {
      if (turn && turn.role && turn.text) {
        contents.push({ role: turn.role === 'assistant' ? 'model' : 'user', parts: [{ text: turn.text }] });
      }
    });
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        tools: [{ google_search: {} }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 512 }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error response (chat):', JSON.stringify(data));
      if (response.status === 429) {
        const rawMessage = data.error?.message || '';
        const retryMatch = rawMessage.match(/retry in ([\d.]+)s/i);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
        const isDailyCap = /generate_content_free_tier_requests_per_day|per_day/i.test(rawMessage);
        const friendly = isDailyCap
          ? "You've hit Gemini's free daily request limit. It resets at midnight Pacific Time."
          : retrySeconds
            ? `Gemini's free-tier burst limit was hit. Wait about ${retrySeconds} seconds and try again.`
            : "Gemini's rate limit was hit. Wait a moment and try again.";
        return res.status(429).json({ error: friendly, retrySeconds });
      }
      return res.status(response.status).json({ error: data.error?.message || 'Gemini API request failed' });
    }

    const candidate = data.candidates?.[0];
    if (data.promptFeedback?.blockReason) {
      return res.status(502).json({ error: `Request was blocked by Gemini: ${data.promptFeedback.blockReason}` });
    }
    if (!candidate) {
      return res.status(502).json({ error: 'Gemini returned no answer. Try again.' });
    }
    if (candidate.finishReason === 'MAX_TOKENS') {
      return res.status(502).json({ error: 'The answer was cut off before it finished. Try asking a narrower question.' });
    }
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      return res.status(502).json({ error: `Gemini declined to answer (reason: ${candidate.finishReason}).` });
    }

    const parts = candidate.content?.parts || [];
    const answer = parts.map((p) => p.text || '').join('\n').trim();

    if (!answer) {
      return res.status(502).json({ error: 'Gemini returned an empty answer. Try again.' });
    }

    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((c) => ({ title: c.web?.title || '', url: c.web?.uri || '' }))
      .filter((s) => s.url)
      .slice(0, 5);

    res.json({ answer, sources });
  } catch (err) {
    console.error('Unexpected error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

const PORT = process.env.PORT || 3000;
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`Card benefits app running on http://localhost:${PORT}`);
  });
}

module.exports = app;
