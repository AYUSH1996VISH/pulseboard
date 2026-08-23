# GTM and GA4 setup for PulseBoard

PulseBoard loads Google Tag Manager container `GTM-WHTKJV76` through the official Next.js `@next/third-parties/google` integration. GTM must be the only GA4 loader. Do not paste a separate `gtag.js` snippet into the application or configure a second GA4 plugin.

## Privacy and security behavior

- GTM does not load until a visitor selects **Allow analytics**.
- Declining or withdrawing consent reloads the page without GTM.
- Visitors can reopen **Privacy choices** from the footer.
- Events before consent are not stored or transmitted.
- Email addresses, request descriptions, and local voting identifiers are never placed in the data layer.
- The Content Security Policy allows GTM, Tag Assistant preview resources, and non-advertising GA4 endpoints.
- The GTM `noscript` iframe is intentionally omitted because it cannot obtain consent when JavaScript is disabled.

The container ID can be overridden in Vercel:

```text
NEXT_PUBLIC_GTM_ID=GTM-WHTKJV76
```

The committed ID is also a validated fallback, so the environment variable is optional.

## 1. Create the Google tag in GTM

In **GTM -> Workspace -> Tags -> New**:

- Name: `Google Tag - GA4`
- Tag type: `Google tag`
- Tag ID: `G-E495LVXW2H`
- Trigger: `Initialization - All Pages`

Keep GA4 Enhanced Measurement enabled for automatic page views, browser-history changes, scrolls, outbound clicks, form interactions, and file downloads. Do not also create a History Change page-view tag.

## 2. Create data-layer variables

Create Version 2 Data Layer Variables:

| GTM variable | Data Layer Variable Name |
| --- | --- |
| `DLV - Feature ID` | `feature_data.feature_id` |
| `DLV - Feature Name` | `feature_data.feature_name` |
| `DLV - Product ID` | `product_id` |
| `DLV - Product Name` | `product_name` |
| `DLV - Category` | `category` |
| `DLV - Lead Source` | `lead_source` |
| `DLV - CTA Name` | `cta_name` |
| `DLV - CTA Location` | `cta_location` |
| `DLV - Filter Name` | `filter_name` |

## 3. Create custom-event triggers and GA4 event tags

Create one Custom Event trigger and one `Google Analytics: GA4 Event` tag for each row. Use measurement ID `G-E495LVXW2H`.

| Event and trigger name | Parameters sent by the GA4 Event tag |
| --- | --- |
| `feature_upvote` | `feature_id`: `{{DLV - Feature ID}}`, `feature_name`: `{{DLV - Feature Name}}` |
| `feature_request_submit` | `product_id`: `{{DLV - Product ID}}`, `category`: `{{DLV - Category}}` |
| `generate_lead` | `lead_source`: `{{DLV - Lead Source}}` |
| `product_view` | `product_id`: `{{DLV - Product ID}}`, `product_name`: `{{DLV - Product Name}}` |
| `cta_click` | `cta_name`: `{{DLV - CTA Name}}`, `cta_location`: `{{DLV - CTA Location}}` |
| `roadmap_filter` | `filter_name`: `{{DLV - Filter Name}}` |

Each trigger uses its exact event name and fires on **All Custom Events**. Each GA4 Event tag uses the same event name and its matching trigger.

## 4. Preview, verify, and publish

1. In GTM, click **Preview** and connect `https://pulseboard-tawny.vercel.app/`.
2. Before consent, confirm `gtm.js` is not requested.
3. Select **Allow analytics** and confirm container `GTM-WHTKJV76` connects.
4. Test a vote, subscription, request submission, product view, roadmap filter, and homepage CTA.
5. Confirm each event appears once in Tag Assistant and GA4 DebugView/Realtime.
6. Confirm no event parameter contains an email address or feedback text.
7. In GTM, select **Submit -> Publish and Create Version**.

## 5. Create GA4 custom dimensions

In **GA4 -> Admin -> Data display -> Custom definitions**, create event-scoped custom dimensions:

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
| Roadmap filter | `filter_name` |

Mark `generate_lead` and `feature_request_submit` as key events. Standard custom-dimension reports can take 24-48 hours; use Realtime and DebugView for initial validation.

## Recommended exploration

Create a GA4 Free Form exploration using Feature name as rows, Event count and Total users as values, filtered to `feature_upvote`. Create a funnel exploration for `page_view` -> `cta_click` -> `feature_upvote` -> `feature_request_submit`.
