"use client";

import { type FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm({
  source = "homepage_newsletter",
  compact = false,
}: {
  source?: "homepage_newsletter" | "changelog_newsletter";
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website: String(formData.get("website") || "") }),
      });

      if (!response.ok) throw new Error("Subscription failed");

      trackEvent({ event: "generate_lead", lead_source: source });
      setState("success");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="absolute -left-[9999px]" aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className={`flex gap-2 ${compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"}`}>
        <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
        <input
          id={`email-${source}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== "idle") setState("idle");
          }}
          placeholder="you@company.com"
          className="h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"
        />
        <button type="submit" disabled={state === "loading"} className="button-primary h-11 shrink-0 px-4 text-sm disabled:cursor-wait disabled:opacity-70">
          {state === "loading" ? "Joining…" : "Subscribe to updates"}
        </button>
      </div>
      <p className={`mt-2 min-h-5 text-xs ${state === "success" ? "text-emerald-700" : state === "error" ? "text-rose-600" : "text-slate-500"}`} aria-live="polite">
        {state === "success"
          ? "You’re subscribed. Watch your inbox for the next product update."
          : state === "error"
            ? "We couldn’t subscribe you. Please try again."
            : "Monthly product updates. No spam, unsubscribe anytime."}
      </p>
    </form>
  );
}
