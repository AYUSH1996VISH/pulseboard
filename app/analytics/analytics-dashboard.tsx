"use client";

import { useMemo, useState } from "react";
import { channelMix, weeklyEngagement } from "@/data/analytics";
import { features } from "@/data/features";
import { products } from "@/data/products";

const rangeMultipliers = { "30d": 0.42, "90d": 1, "12m": 3.8 };

function LineChart() {
  const max = Math.max(...weeklyEngagement.map((item) => item.votes));
  const points = weeklyEngagement.map((item, index) => `${(index / (weeklyEngagement.length - 1)) * 100},${95 - (item.votes / max) * 78}`).join(" ");
  const areaPoints = `0,100 ${points} 100,100`;
  return (
    <div className="mt-5">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-52 w-full overflow-visible" role="img" aria-label="Feature engagement increased over the last 12 weeks">
        <defs><linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity=".22" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></linearGradient></defs>
        {[20, 40, 60, 80].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#e2e8f0" strokeWidth=".45" vectorEffect="non-scaling-stroke" />)}
        <polygon points={areaPoints} fill="url(#area-gradient)" />
        <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400"><span>{weeklyEngagement[0].label}</span><span>{weeklyEngagement[3].label}</span><span>{weeklyEngagement[6].label}</span><span>{weeklyEngagement[9].label}</span><span>{weeklyEngagement[11].label}</span></div>
    </div>
  );
}

export function AnalyticsDashboard({ initialProduct }: { initialProduct: string }) {
  const [productId, setProductId] = useState(products.some((product) => product.id === initialProduct) ? initialProduct : "All");
  const [range, setRange] = useState<keyof typeof rangeMultipliers>("90d");
  const selectedProduct = products.find((product) => product.id === productId);
  const multiplier = rangeMultipliers[range];

  const metrics = useMemo(() => {
    const activeUsers = selectedProduct?.activeUsers ?? products.reduce((sum, product) => sum + product.activeUsers, 0);
    const requestCount = selectedProduct?.requests ?? products.reduce((sum, product) => sum + product.requests, 0);
    const productFeatures = selectedProduct ? features.filter((feature) => feature.productId === selectedProduct.id) : features;
    const votes = productFeatures.reduce((sum, feature) => sum + feature.votes, 0);
    const satisfaction = selectedProduct?.satisfaction ?? Math.round(products.reduce((sum, product) => sum + product.satisfaction, 0) / products.length);
    return [
      { label: "Active users", value: Math.round(activeUsers * multiplier).toLocaleString(), change: "+15.6%", detail: "vs previous period" },
      { label: "Feature votes", value: Math.round(votes * multiplier).toLocaleString(), change: "+21.3%", detail: "customer demand" },
      { label: "New requests", value: Math.round(requestCount * multiplier).toLocaleString(), change: "+8.4%", detail: "across channels" },
      { label: "Satisfaction", value: `${satisfaction}%`, change: "+2.4 pts", detail: "post-interaction CSAT" },
    ];
  }, [multiplier, selectedProduct]);

  return (
    <main className="flex-1 bg-slate-50/70">
      <section className="border-b border-slate-200 bg-white"><div className="page-shell flex flex-col justify-between gap-5 py-9 sm:flex-row sm:items-end"><div><span className="eyebrow">Product analytics</span><h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950">Portfolio decision dashboard</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">Connect usage, customer demand, and satisfaction to make roadmap conversations more objective.</p></div><div className="flex gap-2"><select value={productId} onChange={(event) => setProductId(event.target.value)} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500" aria-label="Select product"><option value="All">All products</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><div className="flex rounded-lg border border-slate-300 bg-white p-1">{(["30d", "90d", "12m"] as const).map((item) => <button key={item} type="button" onClick={() => setRange(item)} className={`rounded-md px-2.5 py-1 text-xs font-semibold ${range === item ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}>{item}</button>)}</div></div></div></section>
      <section className="page-shell py-7 sm:py-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="card p-4"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium text-slate-500">{metric.label}</p><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{metric.change}</span></div><p className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{metric.value}</p><p className="mt-1 text-[11px] text-slate-400">{metric.detail}</p></article>)}</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <section className="card p-5"><div className="flex items-start justify-between"><div><h2 className="font-semibold text-slate-950">Feedback engagement</h2><p className="mt-1 text-xs text-slate-500">Votes across all public feature requests</p></div><div className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-indigo-600" />Votes</div></div><LineChart /></section>
          <section className="card p-5"><h2 className="font-semibold text-slate-950">Feedback sources</h2><p className="mt-1 text-xs text-slate-500">Where new product signals originate</p><div className="mt-6 flex h-3 overflow-hidden rounded-full">{channelMix.map((channel) => <span key={channel.label} style={{ width: `${channel.value}%` }} className={channel.color} />)}</div><div className="mt-5 grid gap-3">{channelMix.map((channel) => <div key={channel.label} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${channel.color}`} /><span className="text-slate-600">{channel.label}</span></div><span className="font-semibold text-slate-900">{channel.value}%</span></div>)}</div></section>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[.75fr_1.25fr]">
          <section className="card p-5"><h2 className="font-semibold text-slate-950">Feedback funnel</h2><p className="mt-1 text-xs text-slate-500">Last 90 days</p><div className="mt-5 grid gap-2">{[["Portal visitors", "24,680", 100], ["Engaged visitors", "8,410", 72], ["Voters", "4,092", 52], ["Idea submitters", "892", 30]].map(([label, value, width], index) => <div key={String(label)}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-500">{label}</span><span className="font-semibold text-slate-900">{value}</span></div><div className="h-7 overflow-hidden rounded-md bg-slate-100"><div className={`grid h-full place-items-center rounded-md ${index === 0 ? "bg-indigo-600" : index === 1 ? "bg-indigo-500" : index === 2 ? "bg-indigo-400" : "bg-indigo-300"}`} style={{ width: `${width}%` }}><span className="text-[9px] font-bold text-white">{width}%</span></div></div></div>)}</div></section>
          <section className="card overflow-hidden"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-950">Product performance</h2><p className="mt-1 text-xs text-slate-500">Compare health and customer demand across the portfolio</p></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Active users</th><th className="px-4 py-3 font-semibold">Growth</th><th className="px-4 py-3 font-semibold">CSAT</th><th className="px-4 py-3 font-semibold">Requests</th></tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id} className="text-sm"><td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-700">{product.shortName}</span><span className="font-semibold text-slate-900">{product.name}</span></div></td><td className="px-4 py-3.5 font-medium text-slate-700">{product.activeUsers.toLocaleString()}</td><td className="px-4 py-3.5 font-semibold text-emerald-600">+{product.trend}%</td><td className="px-4 py-3.5 text-slate-700">{product.satisfaction}%</td><td className="px-4 py-3.5 text-slate-700">{product.requests}</td></tr>)}</tbody></table></div></section>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">Portfolio metrics use representative seeded data for this showcase. Connect your data warehouse or GA4 export for live production reporting.</p>
      </section>
    </main>
  );
}
