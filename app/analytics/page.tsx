import { AnalyticsDashboard } from "./analytics-dashboard";

export const metadata = {
  title: "Product Analytics | PulseBoard",
  description: "Track portfolio engagement, customer demand, and product health in one decision-ready dashboard.",
};

export default async function AnalyticsPage({ searchParams }: PageProps<"/analytics">) {
  const { product } = await searchParams;
  return <AnalyticsDashboard initialProduct={typeof product === "string" ? product : "All"} />;
}
