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

## Next up
- Hook hero CTAs to actual brief + calendaring flows
- Connect AI chat pane to OpenAI with guardrails
- Flesh out education hub content + provider forms

## Brave Search headlines
Set `BRAVE_API_KEY` in your environment (e.g., `.env.local`) with a valid Brave Search API token. Without it the hero snapshot falls back to canned headlines, but real deployments should provide a key so the snapshot refreshes every 30 minutes with live pharma + ACO pulls.
```

## AI Pharmacist chat
Set `OPENAI_API_KEY` in your environment so the `/api/chat` route can call ChatGPT (`gpt-4o-mini`). The client component posts to `/api/chat`, so local `.env.local` should include:
```
OPENAI_API_KEY=sk-...
```

## Consult form
Emails send through `/api/consult` via SMTP using `nodemailer`. Configure the following in `.env.local`:
```
CONSULT_TARGET_EMAIL=dereksanz@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-user
SMTP_PASS=your-app-password
SMTP_FROM=rx-brief@sanzsolutions.com (optional override)
```
Use a Gmail app password or any SMTP relay your org supports.

## DDInter interaction dataset
The interaction checker ships with an offline DDInter dataset (CC BY-NC-SA 4.0) so we’re no longer dependent on the NIH RxNav service. To refresh the data:

```
npm run ingest:ddinter
```

- The script downloads the eight DDInter CSVs plus builds a slug-to-slug adjacency table limited to the medications surfaced in `src/data/medications.ts`.
- Output lives in `src/data/ddinter.interactions.json` and is bundled with the app.
- Because DDInter’s TLS chain is misconfigured, the script temporarily disables certificate verification (`NODE_TLS_REJECT_UNAUTHORIZED=0`) strictly for those fetches.
- `/api/interactions` now answers exclusively from that JSON graph and includes attribution in the UI.
