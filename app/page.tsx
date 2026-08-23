import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { TrackedLink } from "@/components/tracked-link";
import { features } from "@/data/features";
import { products } from "@/data/products";

const outcomes = [
  {
    title: "One source of truth",
    description: "Replace scattered spreadsheets, support notes, and Slack threads with structured feedback.",
    icon: "inbox",
  },
  {
    title: "Evidence over opinions",
    description: "Prioritize with customer demand, product context, and clear outcome metrics—not the loudest voice.",
    icon: "signal",
  },
  {
    title: "A closed feedback loop",
    description: "Show what is planned, communicate progress, and bring customers back when their idea ships.",
    icon: "loop",
  },
];

const workflow = [
  ["01", "Collect", "Capture structured ideas from customers and teams."],
  ["02", "Validate", "Let people vote and add context to real needs."],
  ["03", "Prioritize", "Compare demand across products and outcomes."],
  ["04", "Close the loop", "Share progress and announce what shipped."],
];

function OutcomeIcon({ type }: { type: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      {type === "inbox" && <path d="M5 5.5h14v13H5v-13Zm0 8h4l1.5 2h3l1.5-2h4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />}
      {type === "signal" && <path d="M5 17v-4m4 4V9m5 8V5m5 12v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
      {type === "loop" && <path d="M18.5 8A7 7 0 0 0 6.2 6.2L4 8.5m1.5 7.5a7 7 0 0 0 12.3 1.8l2.2-2.3M4 4.5v4h4m12 11v-4h-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

export default function Home() {
  const totalVotes = features.reduce((sum, feature) => sum + feature.votes, 0);
  const totalUsers = products.reduce((sum, product) => sum + product.activeUsers, 0);

  return (
    <main className="flex-1 bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 via-white to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:52px_52px] opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" aria-hidden="true" />
        <div className="page-shell relative grid items-center gap-12 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-20">
          <div>
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              Customer-led product decisions
            </div>
            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[1.04] tracking-[-0.052em] text-slate-950 sm:text-6xl">
              Build what matters, with the people who use it.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              PulseBoard turns customer ideas into an evidence-backed roadmap—so teams can prioritize confidently and customers always know what happens next.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TrackedLink href="/board" ctaName="explore_feedback" ctaLocation="hero" className="button-primary h-12 px-5 text-sm">
                Explore customer feedback
                <span aria-hidden="true">→</span>
              </TrackedLink>
              <TrackedLink href="/analytics" ctaName="view_analytics" ctaLocation="hero" className="button-secondary h-12 px-5 text-sm">
                View product analytics
              </TrackedLink>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {['No sign-in to explore', 'Transparent roadmap', 'Built for every team'].map((label) => (
                <span key={label} className="flex items-center gap-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-indigo-200/35 blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
              <div className="flex h-11 items-center justify-between border-b border-slate-200 px-4">
                <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-300" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div>
                <span className="text-[11px] font-medium text-slate-400">pulseboard.app/feedback</span>
                <span className="h-5 w-8" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-xs font-semibold text-indigo-600">FEATURE REQUESTS</p><h2 className="mt-1 text-xl font-bold text-slate-950">What should we build next?</h2></div>
                  <span className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white">+ Submit idea</span>
                </div>
                <div className="mt-5 grid gap-3">
                  {features.slice(0, 3).map((feature) => (
                    <div key={feature.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50">
                        <span className="text-[10px] text-slate-400">▲</span><span className="-mt-1 text-sm font-bold text-slate-800">{feature.votes}</span>
                      </div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{feature.title}</p><p className="mt-1 text-xs text-slate-500">{feature.category} · {feature.comments} comments</p></div>
                      <span className="hidden rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 sm:block">{feature.status}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center">
                  <div><p className="text-lg font-bold text-slate-900">{totalVotes}</p><p className="text-[10px] uppercase tracking-wide text-slate-400">Votes</p></div>
                  <div><p className="text-lg font-bold text-slate-900">{features.length}</p><p className="text-[10px] uppercase tracking-wide text-slate-400">Top ideas</p></div>
                  <div><p className="text-lg font-bold text-slate-900">4</p><p className="text-[10px] uppercase tracking-wide text-slate-400">Products</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">The problem we solve</span>
          <h2 className="section-title mt-4">Good products start with a better feedback loop</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">Customer feedback only creates value when teams can organize it, act on it, and communicate the outcome.</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <article key={outcome.title} className="card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><OutcomeIcon type={outcome.icon} /></div>
              <h3 className="mt-4 font-semibold text-slate-950">{outcome.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{outcome.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70">
        <div className="page-shell py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="eyebrow">How it works</span><h2 className="section-title mt-4">From signal to shipped—in one flow</h2></div>
            <Link href="/roadmap" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">See the live roadmap →</Link>
          </div>
          <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map(([number, title, copy], index) => (
              <div key={title} className={`p-5 ${index > 0 ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-l-0 sm:border-t lg:border-l lg:border-t-0" : ""}`}>
                <span className="font-mono text-xs font-semibold text-indigo-600">{number}</span>
                <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow">Portfolio intelligence</span>
            <h2 className="section-title mt-4">See demand and product health in the same view</h2>
            <p className="mt-4 max-w-lg leading-7 text-slate-600">Connect customer demand with adoption, satisfaction, and growth so roadmap conversations start with shared evidence.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-4"><p className="text-2xl font-bold tracking-tight text-slate-950">{(totalUsers / 1000).toFixed(1)}k</p><p className="mt-1 text-xs text-slate-500">Active users</p></div>
              <div className="rounded-xl border border-slate-200 p-4"><p className="text-2xl font-bold tracking-tight text-slate-950">+16.1%</p><p className="mt-1 text-xs text-slate-500">Portfolio growth</p></div>
            </div>
            <Link href="/products" className="button-secondary mt-6 h-11 px-4 text-sm">Explore all products</Link>
          </div>
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="font-semibold text-slate-900">Product portfolio</p><p className="text-xs text-slate-500">Current performance snapshot</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Live</span></div>
            <div className="divide-y divide-slate-100">
              {products.map((product) => (
                <div key={product.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">{product.shortName}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{product.name}</p><p className="text-xs text-slate-500">{product.activeUsers.toLocaleString()} users</p></div></div>
                  <div className="text-right"><p className="text-sm font-semibold text-slate-900">{product.satisfaction}%</p><p className="text-[10px] text-slate-400">CSAT</p></div>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">+{product.trend}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pb-16">
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-9 text-white sm:px-9 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-12">
          <div><p className="text-sm font-semibold text-indigo-300">Stay close to what ships</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Follow the roadmap, not another noisy inbox.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Get a concise monthly digest of roadmap changes, shipped features, and the customer outcomes behind them.</p></div>
          <div className="rounded-2xl bg-white p-4 text-slate-900"><NewsletterForm compact /></div>
        </div>
      </section>
    </main>
  );
}
