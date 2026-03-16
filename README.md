# Sanz RX Brief

Bare-bones Next.js App Router project for Derek Sanz’s daily clinical brief.

## Tech stack
- Next.js 16 (App Router)
- React 19
- Tailwind v4 (using `@import "tailwindcss";` in `globals.css`)

## Local dev
```bash
npm install
npm run dev
```
App runs on http://localhost:3000.

## Harness checks (quality loop)
Run these before deploys or after medication data updates:
```bash
npm run harness:rx
npm run harness:all
```
`harness:rx` enforces medication content quality gates (no placeholder class/MOA/safety text, no label artifacts, no duplicate records).

Install local git gates:
```bash
npm run hooks:install
```
This sets `core.hooksPath=.githooks`, then:
- `pre-commit` runs `harness:rx`
- `pre-push` runs `harness:all`

Deploy/builds are also protected because `prebuild` runs `harness:rx`.

## Next up
- Hook hero CTAs to actual brief + calendaring flows
- Connect AI chat pane to OpenAI with guardrails
- Flesh out education hub content + provider forms

## Brave Search headlines
Set `BRAVE_API_KEY` in your environment (e.g., `.env.local`) with a valid Brave Search API token. Without it the hero snapshot falls back to canned headlines, but real deployments should provide a key so the snapshot refreshes every 30 minutes with live pharma + ACO pulls.
```env
BRAVE_API_KEY=your-brave-search-api-key
```
For regular fresh fetches (e.g., on every load), ensure `export const dynamic = 'force-dynamic';` is at the top of `src/app/page.tsx` (makes the page SSR). Add `cache: "no-store"` to the fetch in `src/lib/brave.ts` to prevent caching. Set the key in Vercel env vars for deployed site.

## AI Pharmacist chat
Set `OPENAI_API_KEY` in your environment so the `/api/chat` route can call ChatGPT (`gpt-4o-mini`). The route now grounds medication answers against the local medication dataset and adds DDInter interaction context when the prompt mentions multiple matched drugs. The client component posts to `/api/chat`, so local `.env.local` should include:
```env
OPENAI_API_KEY=your-openai-api-key
```

## Consult form
Emails send through `/api/consult` via SMTP using `nodemailer`. Configure the following in `.env.local`:
```env
CONSULT_TARGET_EMAIL=dereksanz@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-user
SMTP_PASS=your-app-password
SMTP_FROM=rx-brief@sanzsolutions.com (optional override)
```
Use a Gmail app password or any SMTP relay your org supports.

## DDInter interaction dataset
The interaction checker ships with an offline DDInter dataset (CC BY-NC-SA 4.0), and `/api/interactions` now serves deterministic results from that local dataset instead of generating interaction narratives with the model. To refresh the data:

```
npm run ingest:ddinter
```

## Test Edit by Rituxan
Edited on 2026-03-03 – AI pharmacist enhancement: Added support for drug interaction queries.

## Voice outreach MVP (Twilio)
New API routes:
- `POST /api/voice/outbound` → starts an outbound call via Twilio REST API
- `POST /api/voice/twiml` → TwiML call flow (press 1 transfer, 2 not now, 9 opt out)
- `POST /api/voice/status` → status callback logger

Required env vars:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+18338476396
HUMAN_TRANSFER_NUMBER=+1XXXXXXXXXX
APP_BASE_URL=https://clinpharmgpt.com
VOICE_API_KEY=optional-shared-secret-for-outbound-trigger
```

Quick test:
```bash
curl -X POST https://clinpharmgpt.com/api/voice/outbound \
  -H 'content-type: application/json' \
  -H 'x-voice-key: your-shared-secret' \
  -d '{"to":"+1YOUR_TEST_NUMBER"}'
```
