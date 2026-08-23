export type FeatureStatus = "Planned" | "In Progress" | "Under Review";
export type FeatureCategory =
  | "Experience"
  | "Analytics"
  | "Integrations"
  | "Collaboration";

export type Feature = {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: FeatureStatus;
  productId: string;
  category: FeatureCategory;
  comments: number;
  eta: string;
  updatedAt: string;
  impact: "High" | "Medium";
};

export const features: Feature[] = [
  {
    id: "feat_1",
    title: "Add Dark Mode",
    description:
      "Switch between light and dark themes, with your preference synced across every device.",
    votes: 142,
    status: "In Progress",
    productId: "prod_core",
    category: "Experience",
    comments: 32,
    eta: "September 2026",
    updatedAt: "2 days ago",
    impact: "High",
  },
  {
    id: "feat_2",
    title: "Advanced Analytics Dashboard",
    description:
      "Understand product engagement with customizable reports, trends, and exportable insights.",
    votes: 98,
    status: "Planned",
    productId: "prod_insights",
    category: "Analytics",
    comments: 18,
    eta: "Q4 2026",
    updatedAt: "5 days ago",
    impact: "High",
  },
  {
    id: "feat_3",
    title: "Public API & Webhooks",
    description:
      "Connect your favorite tools and automate workflows with a secure, developer-friendly API.",
    votes: 76,
    status: "Under Review",
    productId: "prod_automate",
    category: "Integrations",
    comments: 24,
    eta: "Exploring",
    updatedAt: "1 week ago",
    impact: "Medium",
  },
  {
    id: "feat_4",
    title: "Collaborative Workspaces",
    description:
      "Invite teammates, share boards, and make decisions together with granular permissions.",
    votes: 64,
    status: "Planned",
    productId: "prod_inbox",
    category: "Collaboration",
    comments: 15,
    eta: "November 2026",
    updatedAt: "3 days ago",
    impact: "Medium",
  },
];
