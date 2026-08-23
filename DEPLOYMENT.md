# Deploy PulseBoard on Vercel

PulseBoard runs immediately in demo mode and can be deployed without credentials. Add Supabase when you want votes, requests, and newsletter subscriptions to persist across visitors.

## 1. Create the shared database (free)

1. Create a Supabase project at [database.new](https://database.new/).
2. Open **SQL Editor** in the Supabase dashboard.
3. Copy and run [`supabase/schema.sql`](./supabase/schema.sql).
4. Open **Project Settings → API** and copy the Project URL and `service_role` key.

Never expose or commit the service role key. PulseBoard only reads it in server-side Route Handlers.

## 2. Prepare the repository

From the `pulseboard` directory:

```bash
npm install
npm run lint
npm run build
```

Push this directory to a GitHub, GitLab, or Bitbucket repository. If `pulseboard` is a subdirectory of a larger repository, set that subdirectory as the Vercel **Root Directory**.

## 3. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the Git repository.
3. Confirm the framework preset is **Next.js**.
4. Add these environment variables for Production, Preview, and Development:

```text
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-E495LVXW2H
```

5. Select **Deploy**.

GA4 is consent-gated and uses `G-E495LVXW2H` as a validated fallback. The public environment variable is optional but recommended for explicit deployment configuration.

## 4. Verify production

After deployment, test this flow in a private browser window:

1. Open `/board` and vote on a feature.
2. Open `/submit`, send a test request, and confirm it appears in Supabase `submitted_requests`.
3. Subscribe from the homepage and confirm the email appears in `newsletter_subscribers`.

## Demo mode versus live mode

- Without Supabase variables, the UI and complete flow work, but demo writes are acknowledged rather than persisted.
- With Supabase variables, votes are deduplicated per browser visitor and all submissions persist for every visitor.
- The analytics dashboard contains transparent representative portfolio data. Replace `data/analytics.ts` or connect a warehouse/GA4 Data API for live in-product reporting.

## Security checklist

- Keep `SUPABASE_SECRET_KEY` server-only. The legacy `SUPABASE_SERVICE_ROLE_KEY` name is also supported.
- Do not prefix the service key with `NEXT_PUBLIC_`.
- Keep Row Level Security enabled; the supplied schema exposes no direct anonymous table policies.
- Add CAPTCHA and rate limiting before using public forms at significant scale.
- Publish a privacy policy and consent banner before enabling advertising cookies or Google Signals.
- Run `npm run security:audit` in CI and before every production release.
