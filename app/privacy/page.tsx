export const metadata = {
  title: "Privacy Notice | PulseBoard",
  description: "How PulseBoard handles analytics preferences and product feedback data.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-slate-50/60">
      <section className="page-shell py-12 sm:py-16">
        <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <span className="eyebrow">Privacy</span>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">PulseBoard privacy notice</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated August 23, 2026</p>

          <div className="mt-8 grid gap-7 text-sm leading-7 text-slate-600">
            <section>
              <h2 className="text-lg font-semibold text-slate-950">Analytics</h2>
              <p className="mt-2">Google Analytics 4 loads only after you select “Allow analytics.” It may collect page URLs, device and browser information, approximate location derived by Google, and interactions such as feature votes or product views. PulseBoard does not intentionally send email addresses, request descriptions, or account identifiers as custom analytics parameters.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-slate-950">Your choice</h2>
              <p className="mt-2">Your analytics preference is stored in your browser under <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">pulseboard_analytics_consent</code>. You can reopen Privacy choices from the footer at any time. Declining prevents the Google Analytics script from loading.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-slate-950">Feedback and subscriptions</h2>
              <p className="mt-2">If you submit feedback or subscribe to updates, PulseBoard processes the information you provide for those purposes. Do not include passwords, payment information, health information, or other sensitive data in feedback.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-slate-950">Data controls</h2>
              <p className="mt-2">Retention and deletion controls for production data should be configured by the site owner in Google Analytics and Supabase. Contact the site owner through the published portfolio contact channel to request access or deletion.</p>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
