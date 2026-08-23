import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const configuredGtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WHTKJV76";
const gtmId = /^GTM-[A-Z0-9]+$/.test(configuredGtmId)
  ? configuredGtmId
  : "GTM-WHTKJV76";

export const metadata: Metadata = {
  title: "PulseBoard | Product Feedback Platform",
  description:
    "Turn customer feedback into product decisions. Collect ideas, prioritize demand, share your roadmap, and close the feedback loop.",
  keywords: ["product feedback", "feature voting", "product roadmap", "product analytics"],
  openGraph: {
    title: "PulseBoard | Product Feedback Platform",
    description: "Build what matters with a transparent customer feedback loop.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <SiteHeader />
        {children}
        <SiteFooter />
        <AnalyticsProvider gtmId={gtmId} />
      </body>
    </html>
  );
}
