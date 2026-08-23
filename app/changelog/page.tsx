import { NewsletterForm } from "@/components/newsletter-form";
import { changelog } from "@/data/changelog";
import { getProduct } from "@/data/products";

const typeStyles = {
  New: "bg-indigo-50 text-indigo-700",
  Improvement: "bg-emerald-50 text-emerald-700",
  Fix: "bg-amber-50 text-amber-700",
};

export const metadata = { title: "Product Changelog | PulseBoard", description: "Follow the latest Pulse product releases, improvements, and fixes." };

export default function ChangelogPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 to-white"><div className="page-shell grid gap-8 py-10 sm:py-12 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><span className="eyebrow">Changelog</span><h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">What we shipped, and why it matters</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Product updates tied back to the customer problems and feedback that shaped them.</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="mb-3 text-sm font-semibold text-slate-900">Get the monthly release digest</p><NewsletterForm source="changelog_newsletter" compact /></div></div></section>
      <section className="page-shell py-10">
        <div className="mx-auto max-w-3xl">
          {changelog.map((entry, index) => {
            const product = getProduct(entry.productId);
            return (
              <article key={entry.id} className={`relative grid gap-5 pb-10 sm:grid-cols-[120px_1fr] ${index < changelog.length - 1 ? "border-b border-slate-200" : ""} ${index > 0 ? "pt-10" : ""}`}>
                <div><time className="text-xs font-medium text-slate-500">{entry.date}</time><p className="mt-2 text-xs text-slate-400">{product?.name}</p></div>
                <div><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeStyles[entry.type]}`}>{entry.type}</span><h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{entry.title}</h2><p className="mt-3 leading-7 text-slate-600">{entry.summary}</p><div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Release highlights</p><ul className="mt-3 grid gap-2 sm:grid-cols-3">{entry.highlights.map((highlight) => <li key={highlight} className="flex items-center gap-2 text-sm text-slate-700"><span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-[9px] font-bold text-emerald-700">✓</span>{highlight}</li>)}</ul></div><div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="flex -space-x-1"><span className="h-6 w-6 rounded-full border-2 border-white bg-indigo-200" /><span className="h-6 w-6 rounded-full border-2 border-white bg-violet-200" /><span className="h-6 w-6 rounded-full border-2 border-white bg-emerald-200" /></span><span>Requested by 40+ customers</span></div></div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
