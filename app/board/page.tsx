"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { features, type FeatureStatus } from "@/data/features";
import { getProduct, products } from "@/data/products";
import { trackEvent } from "@/lib/analytics";

const statuses: Array<FeatureStatus | "All"> = ["All", "Under Review", "Planned", "In Progress"];

const badgeStyles: Record<FeatureStatus, string> = {
  Planned: "border-indigo-200 bg-indigo-50 text-indigo-700",
  "In Progress": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
};

function getVisitorId() {
  const storageKey = "pulseboard_visitor_id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const visitorId = crypto.randomUUID();
  window.localStorage.setItem(storageKey, visitorId);
  return visitorId;
}

export default function FeatureBoard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FeatureStatus | "All">("All");
  const [productId, setProductId] = useState("All");
  const [sort, setSort] = useState<"popular" | "recent">("popular");
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(features.map((feature) => [feature.id, feature.votes])),
  );
  const [voted, setVoted] = useState<Set<string>>(() => new Set());

  const visibleFeatures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return features
      .filter((feature) => status === "All" || feature.status === status)
      .filter((feature) => productId === "All" || feature.productId === productId)
      .filter((feature) => !normalizedQuery || `${feature.title} ${feature.description} ${feature.category}`.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => sort === "popular" ? voteCounts[b.id] - voteCounts[a.id] : a.updatedAt.localeCompare(b.updatedAt));
  }, [productId, query, sort, status, voteCounts]);

  async function handleUpvote(featureId: string, featureName: string) {
    if (voted.has(featureId)) return;

    setVoted((current) => new Set(current).add(featureId));
    setVoteCounts((current) => ({ ...current, [featureId]: current[featureId] + 1 }));

    // Required GTM payload: dynamic feature identifiers are kept together for GA4 variables.
    trackEvent({
      event: "feature_upvote",
      feature_data: { feature_id: featureId, feature_name: featureName },
    });

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, visitorId: getVisitorId() }),
      });
      const result = (await response.json()) as { count?: number };
      if (typeof result.count === "number") {
        setVoteCounts((current) => ({ ...current, [featureId]: result.count as number }));
      }
    } catch {
      // Optimistic vote remains available in demo/offline mode.
    }
  }

  return (
    <main className="flex-1 bg-slate-50/60">
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell py-10 sm:py-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Customer feedback</span>
              <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">What should we build next?</h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">Search existing ideas, vote for the outcomes that matter to you, or share a request we have not heard yet.</p>
            </div>
            <Link href="/submit" className="button-primary h-11 shrink-0 px-4 text-sm">
              <span className="text-lg font-normal">+</span> Submit an idea
            </Link>
          </div>
          <div className="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Search feedback</span>
              <svg viewBox="0 0 20 20" fill="none" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.6" /><path d="m12.5 12.5 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by feature, problem, or category…" className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" />
            </label>
            <select value={productId} onChange={(event) => setProductId(event.target.value)} className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" aria-label="Filter by product">
              <option value="All">All products</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value as "popular" | "recent")} className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" aria-label="Sort feedback">
              <option value="popular">Most popular</option><option value="recent">Recently updated</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button key={item} type="button" onClick={() => setStatus(item)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${status === item ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>{item}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-8 sm:py-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600"><span className="font-semibold text-slate-950">{visibleFeatures.length}</span> ideas</p>
          <p className="hidden text-xs text-slate-500 sm:block">One vote per person, per idea</p>
        </div>
        {visibleFeatures.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {visibleFeatures.map((feature) => {
              const product = getProduct(feature.productId);
              const hasVoted = voted.has(feature.id);
              return (
                <article key={feature.id} className="card group flex min-h-64 flex-col p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badgeStyles[feature.status]}`}>{feature.status}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{feature.category}</span>
                    </div>
                    <span className="text-xs text-slate-400">Updated {feature.updatedAt}</span>
                  </div>
                  <div className="mt-5 flex-1">
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950 group-hover:text-indigo-700">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                    <div className="text-xs text-slate-500"><p className="font-medium text-slate-700">{product?.name}</p><p className="mt-1">{feature.comments} comments · ETA {feature.eta}</p></div>
                    <button type="button" disabled={hasVoted} onClick={() => handleUpvote(feature.id, feature.title)} aria-label={`Upvote ${feature.title}`} className={`inline-flex h-11 min-w-20 shrink-0 flex-col items-center justify-center rounded-lg border px-3 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${hasVoted ? "cursor-default border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                      <span className="text-[9px] leading-none">▲</span><span className="mt-0.5 text-sm font-bold tabular-nums">{voteCounts[feature.id]}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="card grid min-h-64 place-items-center p-8 text-center"><div><p className="font-semibold text-slate-900">No ideas match these filters</p><p className="mt-2 text-sm text-slate-500">Try a broader search or submit a new idea.</p><button type="button" onClick={() => { setQuery(""); setStatus("All"); setProductId("All"); }} className="mt-4 text-sm font-semibold text-indigo-700">Clear filters</button></div></div>
        )}
      </section>
    </main>
  );
}
