"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { products } from "@/data/products";
import { trackEvent } from "@/lib/analytics";

const categories = ["Experience", "Analytics", "Integrations", "Collaboration", "Other"];

export default function SubmitIdeaPage() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mode, setMode] = useState<"demo" | "live" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      productId: String(formData.get("productId") || ""),
      category: String(formData.get("category") || ""),
      email: String(formData.get("email") || ""),
      website: String(formData.get("website") || ""),
    };

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { mode?: "demo" | "live"; error?: string };
      if (!response.ok) throw new Error(result.error);
      trackEvent({ event: "feature_request_submit", product_id: payload.productId, category: payload.category });
      setMode(result.mode || "demo");
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <main className="flex flex-1 items-center bg-slate-50 px-5 py-16">
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-xl text-emerald-700">✓</span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Your idea is in review</h1>
          <p className="mt-3 leading-7 text-slate-600">Thanks for sharing the problem behind your request. The product team can now assess it alongside related demand.</p>
          {mode === "demo" && <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">Demo mode is active. Connect Supabase using the deployment guide to store submissions for every visitor.</p>}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center"><Link href="/board" className="button-primary h-11 text-sm">Browse feedback</Link><button type="button" onClick={() => setState("idle")} className="button-secondary h-11 text-sm">Submit another</button></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-50/70">
      <div className="page-shell grid gap-8 py-10 lg:grid-cols-[.7fr_1.3fr] lg:py-12">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <span className="eyebrow">Share feedback</span>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">Tell us the problem, not just the feature.</h1>
          <p className="mt-4 leading-7 text-slate-600">Clear context helps the product team understand who is affected, why it matters, and what a successful outcome looks like.</p>
          <div className="mt-7 grid gap-3">
            {["Search the board first to avoid duplicates", "Describe the current problem and its impact", "Avoid including passwords or sensitive data"].map((tip, index) => <div key={tip} className="flex gap-3 text-sm text-slate-600"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{index + 1}</span><span className="pt-0.5">{tip}</span></div>)}
          </div>
        </aside>

        <section className="card p-5 sm:p-7">
          <div className="border-b border-slate-100 pb-5"><h2 className="text-lg font-semibold text-slate-950">New feature request</h2><p className="mt-1 text-sm text-slate-500">Fields marked with * are required.</p></div>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <label className="absolute -left-[9999px]" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">Idea title *<input name="title" required minLength={5} maxLength={120} placeholder="A short, specific summary" className="h-11 rounded-lg border border-slate-300 px-3.5 font-normal outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" /></label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-800">Product *<select name="productId" required defaultValue="" className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"><option value="" disabled>Select a product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-medium text-slate-800">Category *<select name="category" required defaultValue="" className="h-11 rounded-lg border border-slate-300 bg-white px-3 font-normal outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"><option value="" disabled>Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-slate-800">What problem are you trying to solve? *<textarea name="description" required minLength={20} maxLength={2000} rows={7} placeholder="Describe your current workflow, the problem you face, and what a good outcome would look like…" className="resize-y rounded-lg border border-slate-300 p-3.5 font-normal leading-6 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" /><span className="text-xs font-normal text-slate-400">Minimum 20 characters</span></label>
            <label className="grid gap-2 text-sm font-medium text-slate-800">Email for updates <span className="font-normal text-slate-400">(optional)</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" className="h-11 rounded-lg border border-slate-300 px-3.5 font-normal outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" /></label>
            {state === "error" && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">We could not submit this request. Check the fields and try again.</p>}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-400">By submitting, you agree the idea can be shared publicly.</p><button type="submit" disabled={state === "loading"} className="button-primary h-11 px-5 text-sm disabled:cursor-wait disabled:opacity-70">{state === "loading" ? "Submitting…" : "Submit for review"}</button></div>
          </form>
        </section>
      </div>
    </main>
  );
}
