import Link from "next/link";
import { AnalyticsPreferencesButton } from "@/components/analytics-provider";
import { Logo } from "@/components/logo";

const columns = [
  { title: "Explore", links: [["Feedback", "/board"], ["Roadmap", "/roadmap"], ["Changelog", "/changelog"]] },
  { title: "Product", links: [["Products", "/products"], ["Analytics", "/analytics"], ["Submit an idea", "/submit"]] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:grid-cols-[1fr_auto_auto] lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-6 text-slate-500">
            A transparent feedback loop that helps product teams build what customers actually need.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="min-w-32">
            <p className="text-sm font-semibold text-slate-900">{column.title}</p>
            <div className="mt-3 grid gap-2.5">
              {column.links.map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-slate-500 transition hover:text-indigo-700">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} PulseBoard. Portfolio product experience.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition hover:text-slate-600">Privacy</Link>
            <AnalyticsPreferencesButton />
            <p>Built with Next.js · Ready for Vercel · GA4 enabled</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
