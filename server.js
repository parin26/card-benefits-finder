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

const investmentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many investment comparisons from this device in the last hour. Try again later.' }
});
app.use('/api/compare-investments', investmentLimiter);

const redeemLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many redemption attempts. Try again later.' }
});
app.use('/api/redeem-pro', redeemLimiter);

const walletLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many wallet optimization requests from this device in the last hour. Try again later.' }
});
app.use('/api/optimize-wallet', walletLimiter);

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

const FD_RD_SYSTEM_PROMPT = `You are a factual information assistant helping an Indian consumer compare Fixed Deposit (FD) or Recurring Deposit (RD) interest rates. Use Google Search to find current, specific interest rates from major Indian banks (SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, Yes Bank, IDFC FIRST Bank, Bank of Baroda, Canara Bank, Punjab National Bank) plus at least two or three small finance banks (for example AU Small Finance Bank, Equitas Small Finance Bank, Suryoday Small Finance Bank, Unity Small Finance Bank, Jana Small Finance Bank), since small finance banks often post meaningfully higher rates than larger banks and leaving them out would understate what is actually available.

Critical rule to avoid a common, serious error: several bank names have separate, differently-regulated affiliated companies that are NOT the bank itself, most often a Housing Finance Company (HFC) or NBFC that shares part of the brand name and typically offers noticeably higher rates than the bank because it is a different, higher-risk type of entity. The clearest example: "PNB Housing Finance" (pnbhousing.com) is a separate HFC, not Punjab National Bank the actual bank (pnb.bank.in or pnbindia.in) - never use PNB Housing Finance's rates when asked about Punjab National Bank, even though the name overlaps. The same caution applies to any other bank in this list: if a search result's rate seems unusually high for a listed bank, check whether the source is actually a separate NBFC/HFC subsidiary rather than the bank itself before including it. When in doubt about whether a source is the bank itself, do not include that row rather than risk misattributing an affiliate's rate to the bank.

The person has given you a specific tenure bucket, defined by exact day/month boundaries (for example "12 Months 1 Day to 15 Months"). Banks do not all slice their own tenure slabs at the same boundaries. For each bank: find the interest rate for whichever of that bank's own published tenure slabs overlaps with or most closely matches the requested range. If a bank's own slab boundaries differ from the requested range (for example the bank quotes one flat rate for "1 year to 2 years" instead of breaking it into 15/18/24/30-month slabs), say so explicitly in that row rather than silently presenting it as an exact match.

Report both the nominal annual interest rate AND the annualized yield (the effective compounded return over 12 months, sometimes published separately by banks alongside the nominal rate) where the bank publishes both. If a bank does not publish a separate annualized yield figure, leave that field empty rather than calculating or guessing one yourself.

If senior citizen is true, use the senior citizen rate for each bank instead of the general rate, and say so in generalNotes.

Present this as neutral factual comparison data, not a recommendation to choose any particular bank. Respond with ONLY one minified JSON object, no markdown fences, no commentary. Match exactly this schema: {"comparison":[{"bank":"","productName":"","interestRate":"","annualizedYield":"","tenure":"","slabNote":""}],"generalNotes":["",""],"sources":[{"title":"","url":""}]}. "slabNote" should be empty unless that bank's own slab boundaries genuinely differ from the requested range, in which case briefly state the bank's actual slab (for example "This bank's own slab is 1-2 years, quoted as one flat rate"). Include 6 to 10 banks in the comparison, prioritizing accuracy over quantity - it is fine to omit a bank if you cannot find a current, specific rate for it rather than guessing. Keep generalNotes to at most 3 short, factual items (for example how interest is compounded, or premature withdrawal penalty norms) - not recommendations. Never construct or guess a URL; only report one you actually saw in search results. The JSON object is the entire response, nothing else.`;

const MUTUAL_FUND_SYSTEM_PROMPT = `You are a factual, cautious information assistant helping an Indian consumer understand mutual fund categories relevant to their stated risk appetite and time horizon. You must NOT recommend or name any specific mutual fund scheme, and you must NOT state expected or guaranteed future returns. Use Google Search to find recent AMFI or SEBI category-average historical return data for the relevant category (debt, hybrid, or equity funds matching the given risk appetite), presenting it explicitly and only as historical context, never as a promise of future performance. Explain the general risk characteristics of that category factually. Respond with ONLY one minified JSON object, no markdown fences, no commentary. Match exactly this schema: {"categoryOverview":"","historicalReturnRange":"","comparison":[{"fundCategory":"","typicalRiskLevel":"","whatItInvestsIn":""}],"generalNotes":["",""],"sources":[{"title":"","url":""}]}. In "historicalReturnRange", explicitly state it is a historical category average, not a guarantee, and reference the approximate time period the data covers. Keep "comparison" to 2 to 3 sub-categories within the requested risk band (for example, within "equity", large-cap vs mid-cap vs small-cap) described generally, never a named scheme. Keep generalNotes to at most 3 items and do not include investment recommendations in them. Never construct or guess a URL; only report one you actually saw in search results. The JSON object is the entire response, nothing else.`;

const FD_RD_DISCLAIMER = 'Fixed and recurring deposits are bank deposits, not market-linked investments. The interest rate is fixed for the tenure you choose. Deposits (principal plus interest) are insured by DICGC up to ₹5 lakh per depositor per bank, combined across all your accounts at that bank. This is factual rate information, not personalized financial advice — confirm current rates directly with the bank before depositing, since rates change frequently and may differ by branch or deposit amount.';

const MUTUAL_FUND_DISCLAIMER = 'Mutual fund investments are subject to market risk. Unlike a bank deposit, there is no fixed return and no capital protection or deposit insurance — the value of your investment can go down as well as up, and equity-oriented funds carry meaningfully higher risk than debt or hybrid funds. Any historical return figures shown are category averages over a past period; they do not predict or guarantee future performance. This is general educational information, not personalized investment advice. Consider consulting a SEBI-registered investment advisor before making any investment decision, and read all scheme-related documents carefully.';

app.post('/api/compare-investments', async (req, res) => {
  const { investmentType, tenure, seniorCitizen, riskAppetite, horizon } = req.body || {};
  if (!investmentType) {
    return res.status(400).json({ error: 'An investment type is required' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your .env file.' });
  }

  const isMutualFund = investmentType === 'Mutual Fund';
  const systemPrompt = isMutualFund ? MUTUAL_FUND_SYSTEM_PROMPT : FD_RD_SYSTEM_PROMPT;
  const userText = isMutualFund
    ? `Risk appetite: ${riskAppetite}\nInvestment horizon: ${horizon}\nExplain the relevant mutual fund category options for this profile.`
    : `Investment type: ${investmentType}\nTenure: ${tenure}\nSenior citizen: ${seniorCitizen ? 'Yes' : 'No'}\nCompare current interest rates across banks for this tenure.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        tools: [{ google_search: {} }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 512 }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error response (compare-investments):', JSON.stringify(data));
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
      console.error('Could not find JSON in compare-investments output. Raw text was:', rawText.slice(0, 2000));
      return res.status(502).json({
        error: 'The model did not return structured data. Try again.',
        debug: rawText.slice(0, 300)
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('JSON.parse failed on compare-investments output:', jsonStr.slice(0, 2000));
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

    // Disclaimer is hardcoded server-side and always attached, regardless of
    // what the model produced - this must never depend on the model remembering to include it.
    parsed.disclaimer = isMutualFund ? MUTUAL_FUND_DISCLAIMER : FD_RD_DISCLAIMER;
    parsed.riskLevel = isMutualFund
      ? (riskAppetite === 'High' ? 'High - market risk, no capital protection' : riskAppetite === 'Medium' ? 'Medium - some market risk' : 'Low to medium - mostly debt instruments, some market risk')
      : 'Very low - fixed, bank-guaranteed rate, DICGC insured up to ₹5 lakh';
    parsed.investmentType = investmentType;

    res.json(parsed);
  } catch (err) {
    console.error('Unexpected error in /api/compare-investments:', err);
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
});

// Simple, low-infrastructure Pro unlock: the site owner generates codes themselves (e.g. one
// per Razorpay payment, matched manually via the Razorpay dashboard) and lists them in the
// PRO_CODES environment variable, comma-separated. This is intentionally lightweight - it has
// no real user accounts, so a code just flips a client-side flag once verified. Good enough for
// a solo/small operator; swap for real auth + a database if this needs to scale or resist sharing.
app.post('/api/redeem-pro', (req, res) => {
  const { code } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: 'A code is required' });
  }
  const validCodes = (process.env.PRO_CODES || '').split(',').map((c) => c.trim()).filter(Boolean);
  if (!validCodes.length) {
    return res.status(200).json({ valid: false, error: 'Pro codes are not configured on this server yet.' });
  }
  const isValid = validCodes.includes(code.trim());
  res.json({ valid: isValid, error: isValid ? null : 'That code was not recognized.' });
});

const WALLET_SYSTEM_PROMPT = `You are a financial assistant helping an Indian consumer get the most value out of cards and accounts they ALREADY hold - this is about optimizing existing products, not recommending new ones. Use Google Search to verify each card's current, real benefits before giving advice. For each card in their list, find its actual rewards structure, fee waiver conditions, and standout perks. Then, across the whole set, work out which single card is genuinely the best choice for each common spending category (for example online shopping, dining, fuel, travel, groceries, utility bill payments, EMI/large purchases) based on which card actually rewards that category best - do not just repeat the same "best" card for everything unless it truly is best across the board. Also flag genuine inefficiencies: for example if two cards charge similar annual fees for overlapping benefits, or if a fee waiver is being missed because spend is split across cards instead of concentrated on one. Respond with ONLY one minified JSON object, no markdown fences, no commentary. Match exactly this schema: {"perCard":[{"bank":"","variant":"","topTips":["","",""]}],"categoryStrategy":[{"category":"","bestCard":"","why":""}],"walletNotes":["","",""],"sources":[{"title":"","url":""}]}. Cover 5 to 7 common spending categories in categoryStrategy if the portfolio supports it. Keep topTips to at most 3 per card and walletNotes to at most 4 items. Be specific and reference the actual bank and card name in every recommendation, never speak generically. Never construct or guess a URL; only report one you actually saw in search results. The JSON object is the entire response, nothing else.`;

app.post('/api/optimize-wallet', async (req, res) => {
  const { cards } = req.body || {};
  if (!Array.isArray(cards) || !cards.length) {
    return res.status(400).json({ error: 'At least one card or account is required' });
  }
  if (cards.length > 8) {
    return res.status(400).json({ error: 'Please limit this to 8 cards or accounts at a time' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your .env file.' });
  }

  const cardList = cards
    .map((c, i) => `${i + 1}. ${c.bank || 'Unknown bank'} ${c.cardType || 'Card'} - ${c.variant || 'Unknown variant'}${c.network ? ' (' + c.network + ')' : ''}`)
    .join('\n');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Here are the cards and accounts I already hold:\n${cardList}\n\nHelp me get the most value out of these specific products.` }] }],
        systemInstruction: { parts: [{ text: WALLET_SYSTEM_PROMPT }] },
        tools: [{ google_search: {} }],
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 512 }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error response (optimize-wallet):', JSON.stringify(data));
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
      return res.status(502).json({ error: 'The response was cut off before it finished. Try with fewer cards.' });
    }
    if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
      return res.status(502).json({ error: `Gemini declined to answer (reason: ${candidate.finishReason}).` });
    }

    const parts = candidate.content?.parts || [];
    const rawText = parts.map((p) => p.text || '').join('\n');
    const jsonStr = extractJson(rawText);

    if (!jsonStr) {
      console.error('Could not find JSON in optimize-wallet output. Raw text was:', rawText.slice(0, 2000));
      return res.status(502).json({
        error: 'The model did not return structured data. Try again.',
        debug: rawText.slice(0, 300)
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('JSON.parse failed on optimize-wallet output:', jsonStr.slice(0, 2000));
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
    console.error('Unexpected error in /api/optimize-wallet:', err);
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
