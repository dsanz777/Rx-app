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
