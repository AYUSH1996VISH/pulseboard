# PulseBoard security baseline

## Implemented controls

- Google Analytics is the only approved third-party runtime script and loads only after explicit visitor consent.
- Restrictive Content Security Policy allowlists only the non-advertising Google Analytics endpoints.
- Clickjacking, MIME sniffing, unnecessary browser permissions, and cross-origin framing are blocked.
- Production browser source maps and the framework identification header are disabled.
- Secrets remain inside a `server-only` data access module.
- Supabase destinations must use HTTPS on an official `*.supabase.co` host.
- Public write APIs enforce same-origin browser requests, JSON content types, small request bodies, strict input allowlists, control-character rejection, honeypots, and per-client throttling.
- API mutation responses use `Cache-Control: no-store`.
- Database Row Level Security is enabled, and anonymous clients receive no direct table policies.
- Analytics events exclude email addresses, free text, visitor identifiers, and other PII.

## Operational requirements

1. Run `npm run security:audit`, `npm run lint`, and `npm run build` before release.
2. Store production secrets only in Vercel Environment Variables.
3. Rotate the Supabase secret/service-role key immediately if it is ever logged, committed, or shared.
4. Add distributed rate limiting and CAPTCHA before a high-traffic public launch. The built-in memory limiter is defense-in-depth for a small deployment, not a global distributed quota.
5. Review database access logs and failed API responses regularly.
6. Require code review for CSP, API routes, dependencies, and analytics changes.
7. Review any new analytics vendor, advertising feature, or CSP domain before enabling it.

## Reporting a vulnerability

Do not include secrets or personal data in a report. Document the affected route, reproduction steps, expected impact, and a minimal proof of concept, then send it through your company-approved private security channel.
