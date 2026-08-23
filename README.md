# PulseBoard

PulseBoard is a portfolio-quality product feedback platform built with Next.js App Router, TypeScript, and Tailwind CSS. It demonstrates a complete customer-led product workflow: collect ideas, validate demand, communicate roadmap status, announce releases, and analyze product health.

## Product flows

- `/` — compact product-led homepage
- `/board` — searchable, filterable feature voting portal
- `/submit` — validated feature request form
- `/roadmap` — public Under Review → Planned → In Progress roadmap
- `/products` — product portfolio and health metrics
- `/products/[slug]` — product-level adoption and demand drill-down
- `/analytics` — interactive portfolio analytics dashboard
- `/changelog` — release communication and newsletter acquisition

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Live URL - https://pulseboard-tawny.vercel.app/

## Quality checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Production data

The app works with no credentials in demo mode. For shared, persistent votes, feature requests, and subscribers:

1. Copy `.env.example` to `.env.local`.
2. Create a free Supabase project.
3. Run [`supabase/schema.sql`](./supabase/schema.sql).
4. Add the Supabase URL and server-only service role key.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete Vercel setup.

## GTM and GA4

The app includes consent-gated GA4 measurement using the official Next.js Google integration. Typed custom events exclude email addresses, feedback text, and voting identifiers. See [ANALYTICS_SETUP.md](./ANALYTICS_SETUP.md) for verification, custom dimensions, and reporting.

## Security

Run `npm run security:audit` before releases. See [SECURITY.md](./SECURITY.md) for the implemented controls and responsible disclosure guidance.
