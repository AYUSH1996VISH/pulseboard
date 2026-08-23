import Link from "next/link";
import { features } from "@/data/features";
import { products } from "@/data/products";

const colorStyles: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  violet: "bg-violet-50 text-violet-700 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
};

export const metadata = { title: "Product Portfolio | PulseBoard", description: "Explore product health, customer demand, and roadmap progress across the Pulse portfolio." };

export default function ProductsPage() {
  const totalUsers = products.reduce((sum, product) => sum + product.activeUsers, 0);
  const averageSatisfaction = Math.round(products.reduce((sum, product) => sum + product.satisfaction, 0) / products.length);

  return (
    <main className="flex-1 bg-slate-50/60">
      <section className="border-b border-slate-200 bg-white"><div className="page-shell py-10 sm:py-12"><span className="eyebrow">Product portfolio</span><div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-950">Every product, one shared view</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Compare adoption, satisfaction, growth, and customer demand across the complete Pulse product portfolio.</p></div><Link href="/analytics" className="button-primary h-11 shrink-0 text-sm">Open analytics</Link></div></div></section>
      <section className="page-shell py-8 sm:py-10">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[['Products', products.length.toString(), 'Active portfolio'], ['Active users', totalUsers.toLocaleString(), '+15.6% this quarter'], ['Avg. satisfaction', `${averageSatisfaction}%`, '+2.4 pts'], ['Open requests', products.reduce((sum, product) => sum + product.requests, 0).toString(), 'Across all products']].map(([label, value, note]) => <div key={label} className="card p-4"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>)}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {products.map((product) => {
            const productFeatures = features.filter((feature) => feature.productId === product.id);
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="card group p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-4"><span className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-bold ring-1 ${colorStyles[product.color]}`}>{product.shortName}</span><span className="text-sm text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600">→</span></div>
                <h2 className="mt-4 text-xl font-semibold text-slate-950 group-hover:text-indigo-700">{product.name}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.description}</p>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4"><div><p className="text-lg font-bold text-slate-950">{product.activeUsers.toLocaleString()}</p><p className="text-[11px] text-slate-400">Active users</p></div><div><p className="text-lg font-bold text-slate-950">{product.satisfaction}%</p><p className="text-[11px] text-slate-400">Satisfaction</p></div><div><p className="text-lg font-bold text-emerald-600">+{product.trend}%</p><p className="text-[11px] text-slate-400">Growth</p></div></div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{product.requests} customer requests</span><span>{productFeatures.length} roadmap item{productFeatures.length === 1 ? '' : 's'}</span></div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
