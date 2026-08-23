import Link from "next/link";
import { features, type FeatureStatus } from "@/data/features";
import { getProduct } from "@/data/products";

const columns: Array<{ status: FeatureStatus; description: string; dot: string; badge: string }> = [
  { status: "Under Review", description: "Ideas we are validating", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
  { status: "Planned", description: "Committed for an upcoming cycle", dot: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700" },
  { status: "In Progress", description: "Actively being built", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
];

export const metadata = {
  title: "Public Roadmap | PulseBoard",
  description: "See what the PulseBoard team is reviewing, planning, and building next.",
};

export default function RoadmapPage() {
  return (
    <main className="flex-1 bg-slate-50/70">
      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell flex flex-col justify-between gap-5 py-10 sm:flex-row sm:items-end sm:py-12">
          <div><span className="eyebrow">Public roadmap</span><h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">See where your feedback is going</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">A transparent view of what we are exploring, what we have committed to, and what the team is building now.</p></div>
          <Link href="/board" className="button-secondary h-11 shrink-0 px-4 text-sm">Vote on feedback</Link>
        </div>
      </section>

      <section className="page-shell py-8 sm:py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">Last updated August 21, 2026</p><p className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />Updated weekly</p></div>
        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((column) => {
            const items = features.filter((feature) => feature.status === column.status);
            return (
              <section key={column.status} aria-labelledby={column.status.replace(" ", "-")}>
                <div className="mb-3 flex items-center justify-between px-1"><div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${column.dot}`} /><h2 id={column.status.replace(" ", "-")} className="font-semibold text-slate-950">{column.status}</h2><span className="text-xs font-medium text-slate-400">{items.length}</span></div><p className="mt-1 text-xs text-slate-500">{column.description}</p></div></div>
                <div className="grid gap-3">
                  {items.map((feature) => {
                    const product = getProduct(feature.productId);
                    return (
                      <article key={feature.id} className="card p-4 transition hover:border-indigo-200 hover:shadow-md">
                        <div className="flex items-center justify-between gap-2"><span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{feature.category}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${column.badge}`}>{feature.impact} impact</span></div>
                        <h3 className="mt-3 font-semibold leading-6 text-slate-950">{feature.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500"><span>{product?.name}</span><span className="font-medium text-slate-700">{feature.votes} votes</span></div>
                        <div className="mt-3 flex items-center gap-2 text-xs"><span className="text-slate-400">Target</span><span className="font-medium text-slate-700">{feature.eta}</span></div>
                      </article>
                    );
                  })}
                  {items.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-400">No items in this stage</div>}
                </div>
              </section>
            );
          })}
        </div>
        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900"><strong>A note on commitments:</strong> Roadmaps communicate direction, not fixed deadlines. We update targets as we learn from customers and delivery.</div>
      </section>
    </main>
  );
}
