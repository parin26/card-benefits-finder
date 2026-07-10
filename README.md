# Card Benefits Finder

A one-stop tool for figuring out what your Indian bank card actually gives you - without visiting six different bank websites to find out.

Pick your bank, card type, and network, and it pulls current fees, rewards, lounge access, insurance, forex markup, and eligibility straight from a live search - not a static database that goes stale the moment a bank changes its terms.

## Why this exists

Every Indian bank publishes its card benefits differently, buries the fine print in different places, and updates offers without much notice. If you've ever tried to answer "does my card actually waive its annual fee if I spend enough" or "which of these three cards has better lounge access," you've probably opened five tabs and given up halfway through. This tool exists to answer that in one place, in under a minute.

## What you can do here

**Look up one card**
Four dropdowns - bank, card type, network, variant - and you get a full breakdown: fees, how to waive them, rewards, lounge access, insurance, forex markup, milestone perks, and concrete tips on getting the most value out of that specific card.

**Compare 2 to 4 cards side by side**
Line up multiple cards at once, with a visual chart comparing annual fees and forex markup at a glance, plus a button to download or copy the full comparison.

**Find the right salary account**
Tell it your monthly salary range and it recommends accounts you'd actually qualify for, ranked by real value - zero balance requirements, sweep-in FDs, debit card tier - not just the first result a bank's marketing page pushes.

**Find my ideal card**
Answer a few questions about where you spend the most, how much, and whether lounge access matters to you, and it recommends cards that fit your actual habits instead of requiring you to already know what to search for.

**Ask anything**
A chat box for specific questions like "which card gives free Coursera access" or "which card has the lowest forex markup" - it searches live rather than answering from memory, and says so plainly when it can't confirm something rather than guessing.

**Save cards and track fee waivers**
Bookmark cards you're considering, and if a card's fee waiver depends on hitting a spend threshold, track your progress toward it right in the app.

## How to use it

1. Pick your bank from the dropdown.
2. Choose credit or debit card.
3. Pick a network (Visa, Mastercard, RuPay, etc.) - or leave it on "Any" if you're not sure.
4. Pick the specific card variant. Long lists (some banks have 50+ cards) are searchable - just start typing.
5. Hit **Find benefits**. Results are grouped into tabs: **Overview** (the essentials), **Rewards and perks**, and **Fees and eligibility** (the fine print), so you're not scrolling through everything at once.

Everything else - comparing, the salary finder, the quiz, the chat - is available from the tabs at the top of the page.

## How accurate is this, really

Worth being direct about this rather than letting it be a surprise:

- **Every result comes from a live search at the moment you ask**, not a stored database. That's the whole point - it stays current - but it also means results depend on what's publicly documented on the web right now. A benefit that's only mentioned in an in-app notification or a physical welcome kit won't show up here.
- **Source links may occasionally stop working.** They route through Google's search infrastructure, which doesn't guarantee link permanence. Every source comes with a backup search link specifically so a dead link never leaves you stuck.
- **Network availability in the dropdowns is a best-effort list**, not verified live against every bank's current catalog. If a variant you know exists isn't showing up under a particular network, it's still searchable by typing it directly.
- **Nothing here is financial advice.** Treat every result as a strong starting point for your own decision, and confirm fees, interest rates, and eligibility on the bank's own page before applying for anything.

## Frequently asked questions

**Is this affiliated with any bank?**
No. This is an independent tool that searches publicly available information. It has no relationship with HDFC, ICICI, SBI, or any other bank or card network mentioned.

**Do I need to enter my real card number?**
Never for looking up benefits. The optional "BIN" field (just the first 6-8 digits, not a full card number) exists only to make it faster to visit each network's own public offers portal (Visa, Mastercard, RuPay Select, etc.) - those portals require it themselves. The app never asks for a full card number, expiry, or CVV, and nothing you enter is sent anywhere beyond your own browser's local storage.

**Is my data safe?**
Saved cards, BINs, and spend-tracking figures are stored only in your browser's local storage on your own device. They're never uploaded to a server or shared with anyone.

**Why does it sometimes say "I couldn't confirm this"?**
Because that's the honest answer when a search doesn't turn up a clear result. The alternative - guessing - is worse than not answering, especially for something like a fee amount or eligibility rule.

## Running your own copy

This is open source. If you want to self-host it - you'll need your own free Gemini API key - see [DEPLOYMENT.md](DEPLOYMENT.md) for setup, Docker, and hosting instructions (Render, a VPS, or AWS S3 + Lambda).

## License

See [LICENSE](LICENSE).

## Disclaimer

This tool is provided for informational purposes only and does not constitute financial advice. Card benefits, fees, and eligibility criteria change frequently and are set entirely by the issuing banks and card networks - always verify details on the official bank page before making any financial decision.
