export type ChangelogEntry = {
  id: string;
  title: string;
  summary: string;
  date: string;
  productId: string;
  type: "New" | "Improvement" | "Fix";
  highlights: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    id: "release_24",
    title: "Realtime collaboration is here",
    summary:
      "See teammates editing the same workspace and make decisions without losing context.",
    date: "August 18, 2026",
    productId: "prod_core",
    type: "New",
    highlights: ["Live cursors", "Presence indicators", "Conflict-free editing"],
  },
  {
    id: "release_23",
    title: "Faster insights, clearer reports",
    summary:
      "Dashboards now load faster and make recurring product reviews easier to share.",
    date: "August 4, 2026",
    productId: "prod_insights",
    type: "Improvement",
    highlights: ["Saved report views", "CSV export", "42% faster queries"],
  },
  {
    id: "release_22",
    title: "Slack workflow actions",
    summary:
      "Trigger workflows, collect approvals, and share status updates without leaving Slack.",
    date: "July 21, 2026",
    productId: "prod_automate",
    type: "New",
    highlights: ["Approval steps", "Rich notifications", "Workflow templates"],
  },
];
