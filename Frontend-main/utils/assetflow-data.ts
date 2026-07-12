import type { AssetRow, DashboardActivity, DashboardMetric } from "@/types/assetflow";

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Assets", value: "12,480", delta: "+8.4% this month", tone: "violet" },
  { label: "Employees", value: "3,214", delta: "+2.1% this month", tone: "sky" },
  { label: "Bookings", value: "94", delta: "+12 today", tone: "emerald" },
  { label: "Maintenance", value: "17", delta: "-5 open", tone: "amber" },
];

export const dashboardActivities: DashboardActivity[] = [
  {
    title: "Laptop allocated to Product Design",
    description: "Asset AF-LAP-2248 was assigned to Meera Sharma with a 30 day review window.",
    time: "2 min ago",
    tone: "bg-[#5b3df5]",
  },
  {
    title: "Meeting room booking approved",
    description: "Conference Room A is reserved for the leadership sync from 3:00 PM to 4:00 PM.",
    time: "14 min ago",
    tone: "bg-sky-500",
  },
  {
    title: "Vehicle maintenance escalated",
    description: "The fleet team has marked vehicle MH-12-AX-2041 as pending service approval.",
    time: "47 min ago",
    tone: "bg-amber-500",
  },
];

export const notifications = [
  {
    title: "7 assets due for return",
    description: "Allocation cycle ends today for 7 devices across engineering and sales.",
    time: "Today",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "2 maintenance approvals pending",
    description: "The facility team is waiting on finance approval for two repair requests.",
    time: "Today",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "Monthly audit scheduled",
    description: "The audit cycle begins on Monday morning for all active office locations.",
    time: "Mon",
    tone: "bg-emerald-50 text-emerald-700",
  },
];

export const assetStatusSeries = [
  { label: "Available", value: 6420, color: "#16a34a" },
  { label: "Allocated", value: 4210, color: "#5b3df5" },
  { label: "Maintenance", value: 780, color: "#f59e0b" },
  { label: "Retired", value: 1070, color: "#ef4444" },
];

export const departmentBreakdown = [
  { label: "Engineering", value: 1880, color: "#5b3df5" },
  { label: "Sales", value: 1240, color: "#0ea5e9" },
  { label: "Operations", value: 980, color: "#16a34a" },
  { label: "Facilities", value: 540, color: "#f59e0b" },
  { label: "Finance", value: 320, color: "#ef4444" },
];

export const dashboardAssets: AssetRow[] = [
  {
    tag: "AF-LAP-2248",
    name: "MacBook Pro 14",
    category: "Electronics",
    location: "Product Design",
    status: "Allocated",
    condition: "Excellent",
  },
  {
    tag: "AF-VEH-0412",
    name: "Honda City",
    category: "Vehicles",
    location: "Operations",
    status: "Available",
    condition: "Good",
  },
  {
    tag: "AF-FUR-1094",
    name: "Ergonomic Workstation",
    category: "Furniture",
    location: "HQ Floor 2",
    status: "Allocated",
    condition: "Excellent",
  },
  {
    tag: "AF-ROM-0008",
    name: "Conference Room A",
    category: "Rooms",
    location: "HQ Floor 4",
    status: "Booked",
    condition: "Ready",
  },
];
