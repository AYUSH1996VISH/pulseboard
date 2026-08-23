export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: "pulse" | "chart" | "flow" | "inbox";
  activeUsers: number;
  satisfaction: number;
  requests: number;
  trend: number;
  owner: string;
};

export const products: Product[] = [
  {
    id: "prod_core",
    slug: "pulse-core",
    name: "Pulse Core",
    shortName: "PC",
    description: "The collaborative workspace where teams plan and ship product work.",
    color: "indigo",
    icon: "pulse",
    activeUsers: 18420,
    satisfaction: 92,
    requests: 184,
    trend: 12.4,
    owner: "Maya Chen",
  },
  {
    id: "prod_insights",
    slug: "pulse-insights",
    name: "Pulse Insights",
    shortName: "PI",
    description: "Product analytics that turns usage signals into confident decisions.",
    color: "violet",
    icon: "chart",
    activeUsers: 12840,
    satisfaction: 89,
    requests: 127,
    trend: 18.7,
    owner: "Noah Williams",
  },
  {
    id: "prod_automate",
    slug: "pulse-automate",
    name: "Pulse Automate",
    shortName: "PA",
    description: "No-code workflows that remove repetitive product operations.",
    color: "emerald",
    icon: "flow",
    activeUsers: 9210,
    satisfaction: 94,
    requests: 96,
    trend: 24.2,
    owner: "Sofia Patel",
  },
  {
    id: "prod_inbox",
    slug: "pulse-inbox",
    name: "Pulse Inbox",
    shortName: "PX",
    description: "A single place to capture, tag, and route customer feedback.",
    color: "amber",
    icon: "inbox",
    activeUsers: 7580,
    satisfaction: 87,
    requests: 143,
    trend: 8.9,
    owner: "Liam Davis",
  },
];

export const getProduct = (id: string) =>
  products.find((product) => product.id === id);
