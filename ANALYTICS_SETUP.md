# GTM and GA4 setup for PulseBoard

PulseBoard pushes a clean, documented in-memory data layer, but does **not** load Google Tag Manager or any other third-party JavaScript in the secure baseline. This prevents unreviewed container changes from executing code in customer browsers.

Only enable GTM after company security/privacy approval, a consent-management decision, a published privacy notice, and an explicit Content Security Policy allowlist. The event plan below remains ready for that approved integration.

## Event measurement plan

| Event | Triggered when | Parameters |
| --- | --- | --- |
| `virtual_page_view` | A visitor loads or navigates to a route | `page_path` |
| `feature_upvote` | A visitor votes for an idea | `feature_data.feature_id`, `feature_data.feature_name` |
| `feature_request_submit` | A valid request is accepted | `product_id`, `category` |
| `generate_lead` | A newsletter subscription is accepted | `lead_source` |
| `product_view` | A product detail page is viewed | `product_id`, `product_name` |
| `cta_click` | A primary homepage CTA is selected | `cta_name`, `cta_location` |

Do not send email addresses, names, free-text request descriptions, visitor IDs, or other personally identifiable information to GA4.

## 1. Create GA4 and GTM

1. In Google Analytics, create a GA4 property and Web data stream for the production Vercel URL.
2. Copy the stream Measurement ID (`G-XXXXXXXXXX`).
3. In Google Tag Manager, create a **Web** container.
4. Keep the container unpublished until the security and privacy review is complete.

## 2. Security approval required before installation

The repository intentionally contains no GTM loader. A company-approved implementation must update the Content Security Policy for only the exact Google hosts required, add consent gating where legally required, and prevent PII from entering the data layer. Do not paste arbitrary custom HTML tags into the GTM container.

After approval, install the reviewed container using a maintained framework integration and pin all related dependencies.

## 3. Add the base Google tag in GTM

1. Create a new **Google Tag**.
2. Enter the GA4 Measurement ID.
3. Use the **Initialization – All Pages** trigger.
4. Save the tag.

## 4. Create Data Layer Variables

In **Variables → User-Defined Variables**, create Version 2 Data Layer Variables:

| Variable name | Data Layer Variable Name |
| --- | --- |
| `DLV - feature_id` | `feature_data.feature_id` |
| `DLV - feature_name` | `feature_data.feature_name` |
| `DLV - product_id` | `product_id` |
| `DLV - product_name` | `product_name` |
| `DLV - category` | `category` |
| `DLV - lead_source` | `lead_source` |
| `DLV - page_path` | `page_path` |
| `DLV - cta_name` | `cta_name` |
| `DLV - cta_location` | `cta_location` |

## 5. Create custom event triggers and GA4 event tags

For each event in the measurement plan:

1. Create a **Custom Event** trigger whose Event name exactly matches the PulseBoard event.
2. Create a **Google Analytics: GA4 Event** tag.
3. Select the base Google tag and use the exact event name.
4. Add the matching Data Layer Variables as Event Parameters.
5. Attach the matching Custom Event trigger.

For `feature_upvote`, for example:

```text
Event name: feature_upvote
Event parameter feature_id: {{DLV - feature_id}}
Event parameter feature_name: {{DLV - feature_name}}
Trigger: Custom Event - feature_upvote
```

## 6. Test before publishing

1. Select **Preview** in GTM.
2. Connect the production or preview deployment in Tag Assistant.
3. Complete the voting, request submission, newsletter, product view, and CTA flows.
4. Confirm each event appears with the expected parameter values.
5. Open **GA4 → Admin → DebugView** and confirm the same events arrive.
6. Publish the GTM container only after validation.

## 7. Make parameters reportable in GA4

In **GA4 → Admin → Data display → Custom definitions**, create event-scoped custom dimensions for:

- Feature ID (`feature_id`)
- Feature name (`feature_name`)
- Product ID (`product_id`)
- Product name (`product_name`)
- Feedback category (`category`)
- Lead source (`lead_source`)
- CTA name (`cta_name`)
- CTA location (`cta_location`)

Mark `generate_lead` and `feature_request_submit` as key events if newsletter growth and feedback contribution are portfolio outcomes. Standard GA4 reports can take 24–48 hours to populate; use Realtime and DebugView during setup.

## Suggested GA4 exploration

Create a Free Form exploration with Feature name as rows, Event count and Total users as values, and a filter where Event name exactly matches `feature_upvote`. This becomes a portfolio-ready **Most requested features** report. Create a second exploration with Product name × Feedback category for demand by product area.
