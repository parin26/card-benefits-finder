# Deployment guide

Technical setup and hosting instructions for Card Compass. If you just want to use the app, see [README.md](README.md) instead — this file is for running your own copy.

## How it's built

- `server.js` — a small Express backend. It holds your Gemini API key and calls Google's `generateContent` API with the `google_search` grounding tool enabled, so the key never reaches the browser.
- `public/` — the frontend. Now a proper multi-page site: `index.html` (home) plus one page per tool (`lookup.html`, `compare.html`, `salary.html`, `quiz.html`, `invest.html`, `wallet.html`, `saved.html`, `pro.html`). All shared logic lives in `shared.js` and shared styling in `shared.css`, loaded by every page — the navigation bar and chat widget are injected by `shared.js` so they don't need to be duplicated in each page's HTML. It calls the backend at `/api/lookup`, `/api/chat`, `/api/salary-account`, `/api/recommend-card`, `/api/compare-investments`, and `/api/optimize-wallet`.
- Saved cards, BINs, and fee-spend tracking are stored in the browser's `localStorage` — per-device, not shared, never sent to any server beyond this app's own backend.

## 1. Get an API key

Create one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Keep it secret — never put it in the frontend code or commit it to a public repo.

## 2. Run it locally

```bash
cd card-benefits-app
npm install
cp .env.example .env
```

Open `.env` and paste your key:

```
GEMINI_API_KEY=AI...
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL` is optional — it defaults to `gemini-2.5-flash`, a good balance of cost and quality. Swap in a different Gemini model name if you want, as long as it supports the `google_search` tool.

Then start the server:

```bash
npm start
```

Open `http://localhost:3000` in your browser.

## 3. Run it with Docker

If you'd rather not install Node locally, or want a container to deploy anywhere, use the included Dockerfile and docker-compose.yml.

```bash
cd card-benefits-app
cp .env.example .env
```

Add your key to `.env` as before, then:

```bash
docker compose up --build
```

Open `http://localhost:3000`. Stop it with `docker compose down`.

Without Compose, plain Docker also works:

```bash
docker build -t card-benefits-app .
docker run -p 3000:3000 --env-file .env card-benefits-app
```

The container includes a basic health check that pings the app every 30 seconds, useful if you deploy it under an orchestrator like Kubernetes, ECS, or Docker Swarm that expects one.

## 4. Deploy it

This is a standard Node/Express app (containerized or not), so any host that runs Node or Docker works.

**Deploying the container**
Most container hosts (Render, Railway, Fly.io, AWS App Runner, Google Cloud Run, DigitalOcean App Platform) can build straight from this Dockerfile — point them at your GitHub repo, and set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) as an environment variable in their dashboard rather than in `.env`, since `.env` is excluded from the image on purpose (see `.dockerignore`) so your key never gets baked into it.

**Render or Railway** (easiest for a small always-on app)
1. Push this folder to a GitHub repo.
2. Create a new web service on [Render](https://render.com) or [Railway](https://railway.app) and point it at the repo.
3. Set the build command to `npm install` and the start command to `npm start`.
4. Add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) as environment variables in the host's dashboard.
5. Deploy. You'll get a public URL.

**A VPS (DigitalOcean, EC2, etc.)**
1. Copy the folder to the server.
2. Run `npm install` and set `GEMINI_API_KEY` in the environment (or a `.env` file).
3. Run it behind a process manager like `pm2` (`pm2 start server.js`) and put Nginx in front for HTTPS.
4. Open the port you're running on (3000 by default, or 80/443 behind Nginx) in your host's firewall/security group.

**Vercel or Netlify**
These are built around serverless functions rather than a persistent server, so `server.js` would need to be split into a function under `/api`. Worth doing later for autoscaling, but Render or Railway gets you live fastest with the code as-is.

## 5. Deploying to S3 (frontend) plus Lambda (backend)

S3 only serves static files — it can't run `server.js`, since that needs a Node process to hold your Gemini key and call the API. So this splits into two pieces: **S3 for the frontend**, **Lambda + API Gateway for the backend**. More setup than Render or Railway above, but genuinely serverless and cheap at low traffic.

`lambda.js` wraps the same Express app (`server.js`) via `serverless-http`, so no logic is duplicated between the two deployment paths.

### 5a. Deploy the backend to Lambda

1. Install production dependencies and zip the backend (the frontend's `public/` folder goes to S3 instead, not into this zip):
   ```bash
   npm install --omit=dev
   zip -r function.zip server.js lambda.js node_modules package.json
   ```
2. In the AWS Console, create a Lambda function (Node.js 20.x runtime), upload `function.zip`, and set the handler to `lambda.handler`.
3. Add environment variables on the function: `GEMINI_API_KEY` (required), `GEMINI_MODEL` (optional).
4. Create an API Gateway (HTTP API is simplest) with a route `ANY /{proxy+}` pointing at this Lambda, and enable CORS for your S3 site's origin (or `*` while testing).
5. Note the invoke URL it gives you, e.g. `https://abc123.execute-api.ap-south-1.amazonaws.com`.

### 5b. Point the frontend at that API, then deploy it to S3

1. In `public/shared.js`, find `const API_BASE = '';` near the top and set it to your invoke URL:
   ```js
   const API_BASE = 'https://abc123.execute-api.ap-south-1.amazonaws.com';
   ```
2. Create an S3 bucket, enable **Static website hosting**, and set `index.html` as the index document.
3. Upload the entire `public/` folder to the bucket (all the `.html` pages plus `shared.js`, `shared.css`, and the favicon files) — everything needs to go up together, not just one file.
4. Make the object public (a bucket policy allowing `s3:GetObject`), or better, put **CloudFront** in front of the bucket for HTTPS and a custom domain, keeping the bucket itself private. Plain S3 website endpoints are HTTP-only, so CloudFront is worth the extra step for anything public-facing.

### Before making it public either way

- **Rate limiting is built in** — each API endpoint (`/api/lookup`, `/api/chat`, `/api/salary-account`, `/api/recommend-card`) is limited to 20 requests per hour per client, so a stray script or a curious visitor can't run up unlimited Gemini charges. Adjust the `max` value in `server.js` to taste.
- Once you know your S3/CloudFront domain, restrict CORS in `server.js` from `cors()` (allow-all) to that specific origin, so other sites can't call your API from their own pages.
- Keep an eye on Gemini usage in AI Studio for the first week after going public.

## Costs to be aware of

Each lookup, chat message, salary account search, or quiz makes one Gemini API call with Google Search grounding enabled, and compare mode makes one call per card in parallel. Google Search grounding is billed per search query the model runs (it may run more than one per request if it needs to check multiple things). Check current pricing and any free-tier quota on the [Gemini API pricing page](https://ai.google.dev/gemini-api/docs/pricing), and watch usage in Google AI Studio, especially if you make this public.

The free tier caps `gemini-2.5-flash` at roughly 20 requests per minute — compare mode with 3-4 cards can use most of that in one click. Enabling billing in Google AI Studio (Settings → Billing) instantly raises this to a much higher tier if you hit it often.

## Monetization

FinMitra ships with three monetization hooks, all off/inert by default. None of them require you to give Anthropic or this project any payment details — they're yours to configure with your own accounts.

### 1. Display ads

Two ad containers are already placed in the page: `#adSlotTop` (a leaderboard-style banner) and `#adSlotMid` (an in-feed unit further down). Both are just empty `<div class="ad-slot ...">` elements right now, showing a "Your ad here" placeholder.

To activate:
1. Sign up for Google AdSense (or another ad network) and get your site approved.
2. Replace the placeholder content inside each `.ad-slot` div with your ad network's embed code (for AdSense, an `<ins class="adsbygoogle">` tag plus the loader script). Ad slots currently appear on `index.html` and `lookup.html` — add more to other pages by copying the same `<div class="ad-slot leaderboard">...</div>` markup.
3. That's it — no backend changes needed.

If a visitor redeems a Pro code (see below), both ad slots are hidden automatically via `applyProStatus()` in the JS.

### 2. Affiliate "Apply now" links

Every card result has an "Apply for this card" link. Right now it points to a plain Google search for that card, so it always works even unconfigured.

To turn it into a commission-earning affiliate link:
1. Sign up with an Indian affiliate network that carries bank card offers — EarnKaro, INRDeals, and vCommission are common choices.
2. In `public/shared.js`, find the `AFFILIATE_CONFIG` object near the top:
   ```js
   const AFFILIATE_CONFIG = {
     enabled: false,
     wrapUrl: (searchUrl, bank, variant) => searchUrl
   };
   ```
3. Set `enabled: true` and replace `wrapUrl` with logic that returns your affiliate network's tracking URL (most networks give you a URL-wrapping pattern or a deep-link API — follow their integration docs for the exact format).

### 3. FinMitra Pro (lightweight, no full accounts system)

This is intentionally simple rather than a full subscription platform with logins and a database — a reasonable starting point for a solo or small operator, not enterprise-grade access control. Be aware a determined user could share a valid code, since there's no per-user identity behind it.

**How it works:**
- The Pro pricing section includes a Razorpay Payment Button (a no-backend-required embeddable button you generate from the Razorpay dashboard).
- After receiving a payment, you manually generate a unique code (any string works, e.g. `FINMITRA-A1B2C3`) and email it to the buyer — matching payments to buyers via the Razorpay dashboard.
- You list valid codes in the `PRO_CODES` environment variable, comma-separated: `PRO_CODES=FINMITRA-A1B2C3,FINMITRA-D4E5F6`.
- When someone enters a valid code in the app, it's checked against `/api/redeem-pro`, and if valid, a flag is set in that browser's `localStorage` to hide ads and show a Pro badge.

**To activate the payment button:**
1. Create a Razorpay account and set up a Payment Button (Razorpay Dashboard → Payment Buttons) for your chosen price.
2. In `public/pro.html`, find `data-payment_button_id="REPLACE_WITH_YOUR_RAZORPAY_BUTTON_ID"` and swap in your real button ID.

**Honest limitation:** the 20-requests-per-hour rate limit is enforced per-IP at the server level, and this lightweight Pro system doesn't currently raise that limit for Pro users, since doing so properly needs real per-user identity (accounts + auth), not just a shared code. Pro today buys an ad-free view and a badge, not a higher rate limit. If you want Pro to include a higher limit, that's the natural next step — it would mean adding real user accounts.

## Extending it

- Add more banks or variant lists in the `variantMap` object in `public/shared.js`. Verify against the bank's own site before adding — general web knowledge has produced fabricated card names in the past for this project.
- Swap `localStorage` for a real database (e.g. SQLite or Postgres) if you want saved cards to sync across devices.
- The rate limiter is in-memory per server process — if you deploy multiple instances behind a load balancer, switch to a shared store (e.g. Redis) for consistent limits across instances.
