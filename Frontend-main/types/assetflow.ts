export type AssetStatus = "Available" | "Allocated" | "Maintenance" | "Retired";

export type DashboardMetric = {
  label: string;
  value: string;
  delta: string;
  tone: "violet" | "sky" | "emerald" | "amber";
};

export type DashboardActivity = {
  title: string;
  description: string;
  time: string;
  tone: string;
};

export type AssetRow = {
  tag: string;
  name: string;
  category: string;
  location: string;
  status: string;
  condition: string;
};
