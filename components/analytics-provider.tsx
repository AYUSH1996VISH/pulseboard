"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ANALYTICS_CONSENT_KEY, ANALYTICS_PREFERENCES_EVENT } from "@/lib/analytics-consent";

type ConsentState = "loading" | "unknown" | "granted" | "denied";

export function AnalyticsProvider({ gtmId }: { gtmId: string }) {
  const [consent, setConsent] = useState<ConsentState>("loading");

  useEffect(() => {
    const savedConsent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    const initialConsent = savedConsent === "granted" || savedConsent === "denied"
      ? savedConsent
      : "unknown";

    // Synchronizing consent from browser storage requires this one-time state update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(initialConsent);

    function reopenPreferences() {
      setConsent("unknown");
    }

    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, reopenPreferences);
    return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, reopenPreferences);
  }, []);

  function updateConsent(nextConsent: "granted" | "denied") {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, nextConsent);
    window.dataLayer = [];

    if (nextConsent === "denied") {
      // A reload guarantees that a previously loaded GTM container is removed
      // when a visitor withdraws analytics consent.
      window.location.reload();
      return;
    }

    setConsent(nextConsent);
  }

  return (
    <>
      {consent === "granted" && <GoogleTagManager gtmId={gtmId} />}
      {consent === "unknown" && (
        <section
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/20 sm:flex sm:items-center sm:gap-5 sm:p-5"
          aria-label="Analytics privacy preference"
          role="dialog"
          aria-live="polite"
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-950">Help us improve PulseBoard</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              We use Google Analytics to understand page usage and product interactions. We do not send email addresses or feedback text.
              {" "}<Link href="/privacy" className="font-medium text-indigo-700 underline underline-offset-2">Privacy notice</Link>
            </p>
          </div>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
            <button
              type="button"
              onClick={() => updateConsent("denied")}
              className="button-secondary h-10 flex-1 px-4 text-xs sm:flex-none"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => updateConsent("granted")}
              className="button-primary h-10 flex-1 px-4 text-xs sm:flex-none"
            >
              Allow analytics
            </button>
          </div>
        </section>
      )}
    </>
  );
}

export function AnalyticsPreferencesButton() {
  return (
    <button
      type="button"
      className="transition hover:text-slate-600"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT))}
    >
      Privacy choices
    </button>
  );
}
