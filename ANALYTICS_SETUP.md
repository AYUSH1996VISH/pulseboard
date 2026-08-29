# PulseBoard GTM and GA4 implementation guide

This document is the implementation record, setup runbook, testing checklist, and presentation guide for PulseBoard analytics. It explains how the application, Google Tag Manager (GTM), Google Analytics 4 (GA4), consent controls, and reporting work together.

## 1. Implementation summary

| Item | PulseBoard configuration |
| --- | --- |
| Production site | `https://pulseboard-tawny.vercel.app/` |
| GTM container | `GTM-WHTKJV76` |
| GA4 Measurement ID | `G-E495LVXW2H` |
| GTM environment variable | `NEXT_PUBLIC_GTM_ID` |
| Consent storage key | `pulseboard_analytics_consent` |
| Analytics loader | `@next/third-parties/google` |
| Data collection model | Consent-gated, first-party `dataLayer` events |
| GA4 loader ownership | GTM only |

Do not add a separate `gtag.js` snippet to the application. GTM is the single GA4 loader; adding both would risk duplicate page views and event counts.

## 2. Measurement objective

PulseBoard measures the customer-led product loop:

1. A visitor arrives and views product content.
2. The visitor explores a product or clicks a primary call to action.
3. The visitor upvotes an existing feature or submits a new request.
4. The visitor may subscribe for product updates.
5. Product managers use aggregate demand and acquisition data to prioritize work.

The implementation intentionally does not send email addresses, feedback descriptions, local visitor IDs, or other free-form user input to GTM or GA4.

## 3. Architecture and data flow

```text
Visitor action
    |
    v
PulseBoard React component
    |
    v
trackEvent() checks analytics consent
    |
    +-- consent not granted --> event is discarded
    |
    +-- consent granted ------> window.dataLayer.push(...)
                                  |
                                  v
                             GTM custom-event trigger
                                  |
                                  v
                             GA4 Event tag
                                  |
                                  v
                       GA4 Realtime / reports / explorations
                                  |
                                  v
                    Optional Google Sheets Data API report
```

GTM itself is rendered only when consent is `granted`. Allowing, declining, or withdrawing consent reloads the current URL so the GTM container is either present from page startup or completely absent.

## 4. Application implementation

### File responsibilities

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Validates the GTM container ID and mounts the analytics provider globally. |
| `components/analytics-provider.tsx` | Reads and updates consent, conditionally loads GTM, and displays the consent prompt. |
| `lib/analytics-consent.ts` | Defines the browser storage key and privacy-preference event. |
| `lib/analytics.ts` | Defines typed analytics payloads and the consent-aware `trackEvent()` helper. |
| `types/analytics.d.ts` | Adds a TypeScript definition for `window.dataLayer`. |
| `app/board/page.tsx` | Emits feature upvotes. |
| `components/newsletter-form.tsx` | Emits successful newsletter leads. |
| `app/submit/page.tsx` | Emits successful feature-request submissions. |
| `components/product-view-tracker.tsx` | Emits product-detail views. |
| `components/tracked-link.tsx` | Emits selected CTA clicks. |
| `app/privacy/page.tsx` | Explains analytics use and consent behavior. |
| `next.config.ts` | Allows required GTM, GA4, and Tag Assistant endpoints in the Content Security Policy. |

### GTM container loading

`app/layout.tsx` reads `NEXT_PUBLIC_GTM_ID`. It accepts only an ID matching `GTM-[A-Z0-9]+` and otherwise falls back to `GTM-WHTKJV76`.

Production environment configuration:

```text
NEXT_PUBLIC_GTM_ID=GTM-WHTKJV76
```

The application uses `GoogleTagManager` from `@next/third-parties/google`; the GTM script is not manually pasted into every page. The root layout makes the integration available throughout the Next.js App Router application.

### Consent behavior

- A new visitor sees **Allow analytics** and **Decline** choices.
- GTM does not load before the visitor allows analytics.
- Consent is stored in `localStorage` under `pulseboard_analytics_consent`.
- `trackEvent()` checks that stored value before every data-layer push.
- Selecting or changing a choice clears the current data layer and reloads the page.
- The current URL is preserved, including GTM Preview query parameters.
- Visitors can reopen **Privacy choices** from the footer.
- The GTM `noscript` iframe is intentionally omitted because consent cannot be collected reliably when JavaScript is disabled.

This is a strict opt-in implementation, rather than an implementation that loads analytics first and updates Google Consent Mode afterward.

## 5. Event measurement plan

### Events currently emitted by the application

| Event | When it fires | Data-layer fields | Business question |
| --- | --- | --- | --- |
| `page_view` | GA4 Enhanced Measurement after GTM loads | Automatically collected | Which pages attract and retain visitors? |
| `cta_click` | A tracked homepage CTA is selected | `cta_name`, `cta_location` | Which CTA and placement drive exploration? |
| `product_view` | A product detail page mounts | `product_id`, `product_name` | Which products receive the most interest? |
| `feature_upvote` | A visitor casts their first local vote for a feature | `feature_data.feature_id`, `feature_data.feature_name` | Which features have the strongest demand? |
| `feature_request_submit` | The request API returns success | `product_id`, `category` | What kinds of new requests are being submitted? |
| `generate_lead` | The newsletter API returns success | `lead_source` | Which newsletter placement creates leads? |

`roadmap_filter` and `virtual_page_view` exist in the TypeScript event type as reserved future events, but the current UI does not emit them. Do not use them in production reporting until an application component starts pushing them.

### Exact data-layer examples

Feature upvote:

```javascript
window.dataLayer.push({
  event: "feature_upvote",
  feature_data: {
    feature_id: "feat_1",
    feature_name: "Add Dark Mode"
  }
});
```

Successful newsletter subscription:

```javascript
window.dataLayer.push({
  event: "generate_lead",
  lead_source: "homepage_newsletter"
});
```

Successful feature request:

```javascript
window.dataLayer.push({
  event: "feature_request_submit",
  product_id: "prod_1",
  category: "Analytics"
});
```

Product detail view:

```javascript
window.dataLayer.push({
  event: "product_view",
  product_id: "prod_1",
  product_name: "Pulse Insights"
});
```

Tracked CTA click:

```javascript
window.dataLayer.push({
  event: "cta_click",
  cta_name: "explore_feedback",
  cta_location: "hero"
});
```

## 6. Create the GA4 property and web stream

For a new environment:

1. Open Google Analytics and create or select the PulseBoard GA4 property.
2. Go to **Admin -> Data collection and modification -> Data streams**.
3. Create a Web stream using the production domain.
4. Record the Measurement ID. The current production stream uses `G-E495LVXW2H`.
5. Keep Enhanced Measurement enabled for standard interactions such as page views and scrolls.
6. Do not paste the GA4 Google tag directly into PulseBoard; configure it through GTM in the next section.

The numeric GA4 Property ID and the `G-...` Measurement ID are different values. API reporting uses the numeric Property ID, while the GTM Google tag uses the Measurement ID.

## 7. Install and configure GTM

### Create the GTM container

1. Create a Web container in Google Tag Manager.
2. Use the production domain as the target website.
3. Copy the container ID and set `NEXT_PUBLIC_GTM_ID` in Vercel.
4. Redeploy PulseBoard after changing the environment variable.

The current container is `GTM-WHTKJV76`.

### Create the base Google tag

In **GTM -> Workspace -> Tags -> New**:

| Field | Value |
| --- | --- |
| Tag name | `Google Tag - GA4` |
| Tag type | `Google tag` |
| Tag ID | `G-E495LVXW2H` |
| Trigger | `Initialization - All Pages` |

Keep only one base Google tag. Do not create another page-view tag if Enhanced Measurement is already providing page views.

### Create data-layer variables

In **GTM -> Variables -> User-Defined Variables -> New**, create each variable as **Data Layer Variable**, using **Data Layer Version 2**.

| GTM variable name | Data Layer Variable Name |
| --- | --- |
| `DLV - Feature ID` | `feature_data.feature_id` |
| `DLV - Feature Name` | `feature_data.feature_name` |
| `DLV - Product ID` | `product_id` |
| `DLV - Product Name` | `product_name` |
| `DLV - Category` | `category` |
| `DLV - Lead Source` | `lead_source` |
| `DLV - CTA Name` | `cta_name` |
| `DLV - CTA Location` | `cta_location` |

The feature fields are nested under `feature_data`, so their complete dotted paths are required. Using only `feature_id` or `feature_name` would return `undefined`.

### Create custom-event triggers

Create these triggers using trigger type **Custom Event**. Enter the event name exactly, select **All Custom Events**, and use the naming convention shown below.

| Trigger name | Custom event name |
| --- | --- |
| `CE - Feature Upvote` | `feature_upvote` |
| `CE - Generate Lead` | `generate_lead` |
| `CE - Feature Request Submit` | `feature_request_submit` |
| `CE - Product View` | `product_view` |
| `CE - CTA Click` | `cta_click` |

### Create GA4 Event tags

Create one **Google Analytics: GA4 Event** tag per custom event. Select the Google tag or enter Measurement ID `G-E495LVXW2H`, use the exact event name, add the parameters, and attach only its matching trigger.

| Tag name | GA4 event name | Event parameters | Trigger |
| --- | --- | --- | --- |
| `GA4 Event - Feature Upvote` | `feature_upvote` | `feature_id` = `{{DLV - Feature ID}}`; `feature_name` = `{{DLV - Feature Name}}` | `CE - Feature Upvote` |
| `GA4 Event - Generate Lead` | `generate_lead` | `lead_source` = `{{DLV - Lead Source}}` | `CE - Generate Lead` |
| `GA4 Event - Feature Request Submit` | `feature_request_submit` | `product_id` = `{{DLV - Product ID}}`; `category` = `{{DLV - Category}}` | `CE - Feature Request Submit` |
| `GA4 Event - Product View` | `product_view` | `product_id` = `{{DLV - Product ID}}`; `product_name` = `{{DLV - Product Name}}` | `CE - Product View` |
| `GA4 Event - CTA Click` | `cta_click` | `cta_name` = `{{DLV - CTA Name}}`; `cta_location` = `{{DLV - CTA Location}}` | `CE - CTA Click` |

The GA4 parameter names are deliberately flat even though the feature fields are nested in the data layer. GTM reads the nested values and sends them to GA4 as `feature_id` and `feature_name`.

## 8. Configure GA4 reporting

### Register custom dimensions

In **GA4 -> Admin -> Data display -> Custom definitions**, create event-scoped custom dimensions:

| Display name | Scope | Event parameter |
| --- | --- | --- |
| Feature ID | Event | `feature_id` |
| Feature Name | Event | `feature_name` |
| Product ID | Event | `product_id` |
| Product Name | Event | `product_name` |
| Feedback Category | Event | `category` |
| Lead Source | Event | `lead_source` |
| CTA Name | Event | `cta_name` |
| CTA Location | Event | `cta_location` |

Custom definitions apply to newly processed data and are not a reliable way to recover parameter values from older events. Allow normal GA4 processing time before expecting them in standard reports.

### Mark key events

Recommended PulseBoard key events:

- `generate_lead`: a successfully recorded newsletter subscription.
- `feature_request_submit`: a successfully recorded feature request.

`feature_upvote` is an engagement signal. It can also be marked as a key event if feature-demand validation is a primary portfolio objective, but keep the definition consistent when presenting trends.

If the events are not yet visible in the GA4 Events list, first generate them on the live site after allowing analytics. Confirm them in Realtime or DebugView, then wait for standard event processing. Alternatively, create a key event by entering the exact event name in GA4 if that option is available in the current interface.

### Recommended explorations

Feature demand table:

- Technique: Free form
- Rows: Feature Name
- Values: Event count and Total users
- Filter: Event name exactly matches `feature_upvote`

Product interest table:

- Rows: Product Name
- Values: Event count and Total users
- Filter: Event name exactly matches `product_view`

Customer-intent funnel:

```text
page_view -> cta_click -> feature_upvote -> feature_request_submit
```

Treat this as an exploratory journey rather than a required linear transaction: many users will vote without submitting a new request.

## 9. End-to-end testing procedure

### Start a GTM Preview session

1. Open the GTM workspace and click **Preview**.
2. Enter `https://pulseboard-tawny.vercel.app/` including `https://`.
3. If an older debug window is open, close it before starting a new session.
4. Allow pop-ups and third-party cookies temporarily if the browser blocks the preview connection.
5. Disable ad-blocking or tracking-protection extensions for the site and Tag Assistant during testing.
6. PulseBoard opens with a `gtm_debug` query parameter.
7. Before granting consent, it is expected that Tag Assistant may not find GTM because the application intentionally blocks the container.
8. Click **Allow analytics**. PulseBoard reloads while preserving the debug URL.
9. Tag Assistant should now show `GTM-WHTKJV76` and `G-E495LVXW2H`.

### Test matrix

| Test action | Expected data-layer event | Expected GTM tag |
| --- | --- | --- |
| Open a page after consent | `page_view` | `Google Tag - GA4` / Enhanced Measurement |
| Click **Explore customer feedback** | `cta_click` | `GA4 Event - CTA Click` |
| Open a product detail page | `product_view` | `GA4 Event - Product View` |
| Upvote a feature | `feature_upvote` | `GA4 Event - Feature Upvote` |
| Successfully submit an idea | `feature_request_submit` | `GA4 Event - Feature Request Submit` |
| Successfully subscribe | `generate_lead` | `GA4 Event - Generate Lead` |

For every custom event:

1. Select the event in the Tag Assistant event timeline.
2. Confirm its GA4 Event tag appears under **Tags Fired**.
3. Open **Variables** and confirm each expected value is populated rather than `undefined`.
4. Open **Data Layer** and verify the payload shape.
5. Confirm the tag fired once, not twice.
6. Confirm the event in GA4 DebugView or Realtime.
7. Confirm no email address, request text, or visitor identifier appears in the payload.

### Consent regression tests

1. In the footer, open **Privacy choices**.
2. Choose **Decline** and confirm the page reloads.
3. Confirm no new GTM or GA4 requests occur after the reload.
4. Reopen **Privacy choices**, allow analytics, and confirm tracking resumes after reload.
5. Test in a private browser window to reproduce the first-visit experience.

## 10. Publish and deploy workflow

Application changes:

1. Run `npm run lint`.
2. Run `npx tsc --noEmit`.
3. Run `npm run build`.
4. Commit and push to the connected GitHub `main` branch.
5. Vercel creates a new production deployment.
6. Repeat the consent and Tag Assistant smoke tests on the production URL.

GTM changes:

1. Preview the workspace.
2. Test all affected events.
3. Click **Submit**.
4. Choose **Publish and Create Version**.
5. Give the version a meaningful name, such as `PulseBoard product events v1`.
6. Describe the tags, triggers, variables, or parameter changes.

GTM workspace changes are not live merely because they work in Preview. They become live only after the container version is published.

## 11. Reporting and interpretation

### Where to validate data

| Tool | Best use | Expected timing |
| --- | --- | --- |
| GTM Preview / Tag Assistant | Trigger, variable, tag, and payload testing | Immediate |
| GA4 DebugView | Development event and parameter validation | Near real time |
| GA4 Realtime | Production event arrival | Near real time |
| GA4 standard reports | Trends and audience reporting | After processing |
| GA4 Explorations | Feature, product, acquisition, and funnel analysis | After processing |
| Google Sheets via GA4 Data API | Shareable recurring portfolio report | After API-accessible processing |

GA4 `eventCount` is the appropriate production reporting count for events delivered to GA4. It is not an export of Tag Assistant's internal tag-fire log. A GTM tag can fire in Preview without producing a processed GA4 event if consent, browser blocking, network failure, configuration, or processing intervenes.

### Google Sheets reporting

The optional Apps Script report uses the **Google Analytics Data API** advanced service and the numeric GA4 Property ID. It can retrieve event counts, users, sessions, page performance, acquisition, devices, key events, and registered custom dimensions.

The report should maintain these views:

- Executive dashboard
- Event performance
- Daily event trend
- Feature vote performance
- Newsletter leads
- Feature-request submissions
- Product views
- CTA performance
- Page performance
- Acquisition
- Device and geography
- Realtime events
- Measurement plan and refresh log

The Analytics Data API cannot dynamically list GTM container tags and triggers. Use a measurement-plan sheet to map GTM configuration to the corresponding GA4 event count. Accessing the actual GTM container inventory requires the separate Google Tag Manager API.

## 12. Troubleshooting

### Tag Assistant says “Not connected” or “0 Google tags found”

- Confirm you entered the full HTTPS production URL.
- Click **Allow analytics** in PulseBoard; GTM is intentionally absent before consent.
- Let the consent action reload the debug URL.
- Allow pop-ups and temporarily disable tracking protection for the test.
- Confirm the deployed environment uses `GTM-WHTKJV76`.
- Confirm the GTM script request is not blocked in browser developer tools.
- Close stale Preview sessions and start a new one.

### The event appears, but the GA4 tag does not fire

- Confirm the trigger type is **Custom Event**.
- Confirm the trigger event name exactly matches the data-layer `event` value.
- Confirm the GA4 Event tag is attached to that trigger.
- Confirm the event-name field in the tag is not accidentally set to `Google Analytics: GA4 Event` or another label.

### Feature variables show `undefined`

Use these exact Version 2 paths:

```text
feature_data.feature_id
feature_data.feature_name
```

The feature fields are nested; the other current parameters are top-level fields.

### The GA4 tag fired, but the event is missing in reports

- Check GA4 Realtime and DebugView first.
- Confirm the GA4 Event tag uses Measurement ID `G-E495LVXW2H`.
- Confirm the base Google tag initializes before custom-event tags.
- Confirm analytics consent was granted.
- Allow standard GA4 processing time.
- Check browser network requests and extensions that block analytics.

### Event parameters are absent from standard reports

- Confirm the values exist in Tag Assistant.
- Confirm each parameter is registered as an event-scoped GA4 custom dimension.
- Confirm capitalization and underscores match exactly.
- Generate new events after creating the custom definitions.
- Allow processing time before checking standard reports.

### Counts appear duplicated

- Search the application and GTM for a second GA4/Google tag installation.
- Do not use both a hard-coded `gtag.js` snippet and GTM.
- Do not add a separate history-change page-view tag while Enhanced Measurement already handles browser-history page views.
- Confirm each custom-event trigger is attached to only one matching GA4 Event tag.

### Google Sheets reports fail

- Use the numeric GA4 Property ID, not `G-E495LVXW2H`.
- Confirm the Apps Script account has access to the GA4 property and spreadsheet.
- Confirm the `AnalyticsData` advanced service is enabled.
- Register custom dimensions before requesting `customEvent:...` fields.
- Review the Apps Script execution log and the report's refresh-log sheet.

## 13. Security and governance rules

- Never send email addresses, request titles, request descriptions, local visitor IDs, or other personal data to GA4.
- Use controlled categorical values for event parameters.
- Keep the GTM container and GA4 property access limited to authorized maintainers.
- Use descriptive GTM version names and change notes.
- Test consent behavior whenever analytics-loading code changes.
- Review the measurement plan periodically and remove unused tags and variables.
- Update this document whenever an event name, parameter, key-event definition, GTM ID, GA4 stream, or consent behavior changes.

## 14. Release checklist

- [ ] The production GTM container ID is correct.
- [ ] GTM is absent before consent and loads after consent.
- [ ] There is only one GA4 loader.
- [ ] The base Google tag fires once.
- [ ] All current custom events appear in the Tag Assistant timeline.
- [ ] Every matching GA4 Event tag fires once.
- [ ] All required variables contain correct values.
- [ ] No personal or free-form customer data is present.
- [ ] Events appear in GA4 Realtime or DebugView.
- [ ] GA4 custom dimensions exist for custom parameters.
- [ ] Business outcomes are marked consistently as key events.
- [ ] GTM workspace changes are submitted and published.
- [ ] Production is smoke-tested after Vercel deployment.
- [ ] Analytics documentation and GTM version notes are updated.

## 15. Portfolio explanation

A concise way to present this implementation:

> PulseBoard uses a consent-gated, event-driven measurement architecture. The Next.js application emits typed first-party data-layer events only after explicit analytics consent. Google Tag Manager translates those events into GA4 events with controlled product metadata, while excluding emails, feedback text, and visitor identifiers. GA4 custom dimensions, key events, explorations, and an optional Google Sheets Data API report turn those interactions into product-demand, acquisition, and conversion insights.

This demonstrates product analytics planning, implementation governance, privacy-aware measurement, technical validation, and stakeholder reporting—not only tag installation.
