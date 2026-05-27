# jetfax-nextjs

FaxJet marketing site, legal pages, and API surface.

Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript.

## Routes

| Path | Purpose |
|---|---|
| `/` | Marketing landing |
| `/privacy` | Privacy Policy (referenced by App Store Connect) |
| `/terms` | Terms of Service |
| `/support` | Support FAQ + contact |
| `/api/health` | Health check endpoint |

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

```bash
vercel --prod
```

## Companion repo

iOS app: <https://github.com/alkincakiralar1996/faxjet-expo>
