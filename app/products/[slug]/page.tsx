import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { features } from "@/data/features";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const productFeatures = features.filter((feature) => feature.productId === product.id);
  const adoption = [38, 44, 49, 53, 58, 62, 68, 73, 79, 84, 88, 94];

  return (
    <main className="flex-1 bg-slate-50/60">
      <ProductViewTracker productId={product.id} productName={product.name} />
      <section className="border-b border-slate-200 bg-white"><div className="page-shell py-9"><Link href="/products" className="text-sm font-medium text-slate-500 hover:text-indigo-700">← All products</Link><div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 font-bold text-indigo-700 ring-1 ring-indigo-100">{product.shortName}</span><div><h1 className="text-3xl font-bold tracking-tight text-slate-950">{product.name}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{product.description}</p></div></div><Link href={`/analytics?product=${product.id}`} className="button-secondary h-11 shrink-0 text-sm">View in analytics</Link></div></div></section>
      <section className="page-shell py-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[[product.activeUsers.toLocaleString(), 'Active users', `+${product.trend}%`], [`${product.satisfaction}%`, 'Satisfaction', '+2.1 pts'], [product.requests.toString(), 'Open requests', '12 this month'], [productFeatures.reduce((sum, feature) => sum + feature.votes, 0).toString(), 'Feature votes', 'Portfolio demand']].map(([value, label, change]) => <div key={label} className="card p-4"><p className="text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-xs text-emerald-600">{change}</p></div>)}</div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <section className="card p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold text-slate-950">Weekly active adoption</h2><p className="mt-1 text-xs text-slate-500">Last 12 weeks</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">+{product.trend}%</span></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-slate-200">{adoption.map((value, index) => <div key={index} className="group relative flex-1 rounded-t bg-indigo-100 transition hover:bg-indigo-500" style={{ height: `${value}%` }}><span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[9px] text-white group-hover:block">{value}%</span></div>)}</div><div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>12 weeks ago</span><span>This week</span></div></section>
          <section className="card p-5"><h2 className="font-semibold text-slate-950">Product owner</h2><div className="mt-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">{product.owner.split(' ').map((name) => name[0]).join('')}</span><div><p className="text-sm font-semibold text-slate-900">{product.owner}</p><p className="text-xs text-slate-500">Senior Product Manager</p></div></div><div className="mt-6 border-t border-slate-100 pt-4"><p className="text-xs font-medium text-slate-500">Current objective</p><p className="mt-2 text-sm leading-6 text-slate-700">Increase activated teams while maintaining customer satisfaction above 90%.</p></div></section>
        </div>
        <section className="mt-5 card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="font-semibold text-slate-950">Customer demand</h2><p className="mt-1 text-xs text-slate-500">Roadmap items linked to this product</p></div><Link href="/board" className="text-sm font-semibold text-indigo-700">All feedback →</Link></div><div className="divide-y divide-slate-100">{productFeatures.length ? productFeatures.map((feature) => <div key={feature.id} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 sm:grid-cols-[1fr_auto_auto]"><div><p className="text-sm font-semibold text-slate-900">{feature.title}</p><p className="mt-1 text-xs text-slate-500">{feature.category} · {feature.comments} comments</p></div><span className="hidden self-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 sm:block">{feature.status}</span><span className="self-center text-sm font-semibold text-slate-700">▲ {feature.votes}</span></div>) : <p className="px-5 py-8 text-center text-sm text-slate-500">No public roadmap items yet.</p>}</div></section>
      </section>
    </main>
  );
}
