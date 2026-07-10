# Deployment guide

Technical setup and hosting instructions for Card Compass. If you just want to use the app, see [README.md](README.md) instead — this file is for running your own copy.

## How it's built

- `server.js` — a small Express backend. It holds your Gemini API key and calls Google's `generateContent` API with the `google_search` grounding tool enabled, so the key never reaches the browser.
- `public/index.html` — the frontend. Plain HTML, CSS, and JavaScript, no build step. It calls the backend at `/api/lookup`, `/api/chat`, `/api/salary-account`, and `/api/recommend-card`.
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

1. In `public/index.html`, find `const API_BASE = '';` near the top of the `<script>` block and set it to your invoke URL:
   ```js
   const API_BASE = 'https://abc123.execute-api.ap-south-1.amazonaws.com';
   ```
2. Create an S3 bucket, enable **Static website hosting**, and set `index.html` as the index document.
3. Upload `public/index.html` to the bucket.
4. Make the object public (a bucket policy allowing `s3:GetObject`), or better, put **CloudFront** in front of the bucket for HTTPS and a custom domain, keeping the bucket itself private. Plain S3 website endpoints are HTTP-only, so CloudFront is worth the extra step for anything public-facing.

### Before making it public either way

- **Rate limiting is built in** — each API endpoint (`/api/lookup`, `/api/chat`, `/api/salary-account`, `/api/recommend-card`) is limited to 20 requests per hour per client, so a stray script or a curious visitor can't run up unlimited Gemini charges. Adjust the `max` value in `server.js` to taste.
- Once you know your S3/CloudFront domain, restrict CORS in `server.js` from `cors()` (allow-all) to that specific origin, so other sites can't call your API from their own pages.
- Keep an eye on Gemini usage in AI Studio for the first week after going public.

## Costs to be aware of

Each lookup, chat message, salary account search, or quiz makes one Gemini API call with Google Search grounding enabled, and compare mode makes one call per card in parallel. Google Search grounding is billed per search query the model runs (it may run more than one per request if it needs to check multiple things). Check current pricing and any free-tier quota on the [Gemini API pricing page](https://ai.google.dev/gemini-api/docs/pricing), and watch usage in Google AI Studio, especially if you make this public.

The free tier caps `gemini-2.5-flash` at roughly 20 requests per minute — compare mode with 3-4 cards can use most of that in one click. Enabling billing in Google AI Studio (Settings → Billing) instantly raises this to a much higher tier if you hit it often.

## Extending it

- Add more banks or variant lists in the `variantMap` object in `public/index.html`. Verify against the bank's own site before adding — general web knowledge has produced fabricated card names in the past for this project.
- Swap `localStorage` for a real database (e.g. SQLite or Postgres) if you want saved cards to sync across devices.
- The rate limiter is in-memory per server process — if you deploy multiple instances behind a load balancer, switch to a shared store (e.g. Redis) for consistent limits across instances.
