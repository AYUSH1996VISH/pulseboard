"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";

const navigation = [
  { href: "/board", label: "Feedback" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/products", label: "Products" },
  { href: "/changelog", label: "Changelog" },
  { href: "/analytics", label: "Analytics" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main navigation">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden md:block">
          <Link href="/submit" className="button-primary h-10 px-4 text-sm">
            Submit an idea
          </Link>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
            {open ? (
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            ) : (
              <path d="M3.5 5.5h13m-13 4.5h13m-13 4.5h13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/submit" onClick={() => setOpen(false)} className="button-primary mt-2 h-11 text-sm">
              Submit an idea
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
