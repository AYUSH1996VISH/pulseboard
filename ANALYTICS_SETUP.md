# GA4 setup for PulseBoard

PulseBoard uses the official Next.js `@next/third-parties/google` integration with GA4 Measurement ID `G-E495LVXW2H`.

## Privacy and security behavior

- Google Analytics does not load until a visitor selects **Allow analytics**.
- Declining prevents the Google script from loading.
- Visitors can reopen **Privacy choices** from the footer.
- The Content Security Policy allows only the non-advertising Google Analytics endpoints.
- Email addresses, request descriptions, and local voting identifiers are never sent to GA4.
- Google Ads and advertising-signal domains are not allowlisted.

The ID can be overridden in Vercel with:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-E495LVXW2H
```

The committed ID is also used as a validated production fallback, so the environment variable is optional.

## Event measurement plan

| Event | Triggered when | GA4 parameters |
| --- | --- | --- |
| `page_view` | Initial load and Next.js route navigation | Automatically collected |
| `feature_upvote` | A visitor votes for an idea | `feature_id`, `feature_name` |
| `feature_request_submit` | A valid request is accepted | `product_id`, `category` |
| `generate_lead` | A newsletter subscription is accepted | `lead_source` |
| `product_view` | A product detail page is viewed | `product_id`, `product_name` |
| `cta_click` | A primary homepage CTA is selected | `cta_name`, `cta_location` |

## Verify the deployment

1. Wait for the Vercel deployment created by the GitHub push to become **Ready**.
2. Open the production site in a private browser window.
3. Open browser Developer Tools → Network.
4. Before making a choice, confirm there is no request to `googletagmanager.com`.
5. Select **Allow analytics**.
6. Confirm `gtag/js?id=G-E495LVXW2H` loads and requests are sent to a `google-analytics.com` collection endpoint.
7. In GA4, open **Reports → Realtime** and confirm the active user and page view.
8. Vote, submit feedback, subscribe, open a product, and click homepage CTAs to test the custom events.

Google notes that standard reports can take 24–48 hours. Realtime is the fastest initial verification method.

## Create GA4 custom dimensions

In **GA4 → Admin → Data display → Custom definitions**, create event-scoped custom dimensions:

| Dimension name | Event parameter |
| --- | --- |
| Feature ID | `feature_id` |
| Feature name | `feature_name` |
| Product ID | `product_id` |
| Product name | `product_name` |
| Feedback category | `category` |
| Lead source | `lead_source` |
| CTA name | `cta_name` |
| CTA location | `cta_location` |

Mark `generate_lead` and `feature_request_submit` as key events if those are important portfolio outcomes.

## Suggested exploration

Create a GA4 Free Form exploration using Feature name as rows, Event count and Total users as values, and an Event name filter equal to `feature_upvote`. A second exploration using Product name × Feedback category shows demand by product area.
