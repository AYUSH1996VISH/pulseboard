import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="PulseBoard home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M4.5 13h3l2-6 4 11 2-5h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-tight text-slate-950">PulseBoard</span>
    </Link>
  );
}
