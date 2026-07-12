import {
  IconDashboard,
  IconFactory,
  IconUsers,
  IconTag,
  IconPackage,
  IconClipboardList,
  IconTruck,
  IconWrench,
  IconCoins,
  IconCog,
  IconChartBar,
  IconShield,
  IconBriefcase,
  IconBell,
} from "@/app/components/icons/Icons";
import type { ComponentType } from "react";

export type AssetFlowRole = "founder" | "admin" | "head" | "manager" | "employee";

export type AssetFlowSection =
  | "dashboard"
  | "organization"
  | "departments"
  | "employees"
  | "roles-permissions"
  | "categories"
  | "assets"
  | "allocation"
  | "transfers"
  | "bookings"
  | "maintenance"
  | "audit"
  | "reports"
  | "analytics"
  | "notifications"
  | "settings"
  | "department-assets"
  | "approvals"
  | "my-assets"
  | "profile";

export type RoleNavItem = {
  label: string;
  slug: AssetFlowSection;
  icon: ComponentType<{ size?: number; className?: string }>;
  group?: string;
  description?: string;
};

export const ROLE_LABELS: Record<AssetFlowRole, string> = {
  founder: "Founder / Super Admin",
  admin: "Admin",
  head: "Department Head",
  manager: "Asset Manager",
  employee: "Employee",
};

export const ROLE_HOME: Record<AssetFlowRole, string> = {
  founder: "/founder/dashboard",
  admin: "/admin/dashboard",
  head: "/head/dashboard",
  manager: "/manager/dashboard",
  employee: "/employee/dashboard",
};

export const ROLE_NAV: Record<AssetFlowRole, RoleNavItem[]> = {
  founder: [
    { label: "Dashboard", slug: "dashboard", icon: IconDashboard },
    { label: "Organization", slug: "organization", icon: IconBriefcase, group: "Core" },
    { label: "Departments", slug: "departments", icon: IconFactory, group: "Core" },
    { label: "Employees", slug: "employees", icon: IconUsers, group: "Core" },
    { label: "Roles & Permissions", slug: "roles-permissions", icon: IconShield, group: "Core" },
    { label: "Asset Categories", slug: "categories", icon: IconTag, group: "Assets" },
    { label: "Assets", slug: "assets", icon: IconPackage, group: "Assets" },
    { label: "Bookings", slug: "bookings", icon: IconClipboardList, group: "Operations" },
    { label: "Maintenance", slug: "maintenance", icon: IconWrench, group: "Operations" },
    { label: "Audit", slug: "audit", icon: IconCoins, group: "Operations" },
    { label: "Reports", slug: "reports", icon: IconChartBar, group: "Insights" },
    { label: "Analytics", slug: "analytics", icon: IconChartBar, group: "Insights" },
    { label: "Settings", slug: "settings", icon: IconCog, group: "System" },
  ],
  admin: [
    { label: "Dashboard", slug: "dashboard", icon: IconDashboard },
    { label: "Departments", slug: "departments", icon: IconFactory, group: "Organization" },
    { label: "Employees", slug: "employees", icon: IconUsers, group: "Organization" },
    { label: "Categories", slug: "categories", icon: IconTag, group: "Assets" },
    { label: "Assets", slug: "assets", icon: IconPackage, group: "Assets" },
    { label: "Bookings", slug: "bookings", icon: IconClipboardList, group: "Operations" },
    { label: "Maintenance", slug: "maintenance", icon: IconWrench, group: "Operations" },
    { label: "Audit", slug: "audit", icon: IconCoins, group: "Operations" },
    { label: "Reports", slug: "reports", icon: IconChartBar, group: "Insights" },
    { label: "Notifications", slug: "notifications", icon: IconBell, group: "Insights" },
    { label: "Settings", slug: "settings", icon: IconCog, group: "System" },
  ],
  head: [
    { label: "Dashboard", slug: "dashboard", icon: IconDashboard },
    { label: "Department Assets", slug: "department-assets", icon: IconPackage, group: "Team" },
    { label: "Employees", slug: "employees", icon: IconUsers, group: "Team" },
    { label: "Allocation Requests", slug: "approvals", icon: IconClipboardList, group: "Team" },
    { label: "Bookings", slug: "bookings", icon: IconClipboardList, group: "Team" },
    { label: "Reports", slug: "reports", icon: IconChartBar, group: "Insights" },
    { label: "Notifications", slug: "notifications", icon: IconBell, group: "Insights" },
    { label: "Settings", slug: "settings", icon: IconCog, group: "System" },
  ],
  manager: [
    { label: "Dashboard", slug: "dashboard", icon: IconDashboard },
    { label: "Assets", slug: "assets", icon: IconPackage, group: "Operations" },
    { label: "Allocation", slug: "allocation", icon: IconClipboardList, group: "Operations" },
    { label: "Transfers", slug: "transfers", icon: IconTruck, group: "Operations" },
    { label: "Bookings", slug: "bookings", icon: IconClipboardList, group: "Operations" },
    { label: "Maintenance", slug: "maintenance", icon: IconWrench, group: "Operations" },
    { label: "Audit", slug: "audit", icon: IconCoins, group: "Operations" },
    { label: "Reports", slug: "reports", icon: IconChartBar, group: "Insights" },
    { label: "Notifications", slug: "notifications", icon: IconBell, group: "Insights" },
    { label: "Settings", slug: "settings", icon: IconCog, group: "System" },
  ],
  employee: [
    { label: "Dashboard", slug: "dashboard", icon: IconDashboard },
    { label: "My Assets", slug: "my-assets", icon: IconPackage, group: "Personal" },
    { label: "Bookings", slug: "bookings", icon: IconClipboardList, group: "Personal" },
    { label: "Maintenance", slug: "maintenance", icon: IconWrench, group: "Personal" },
    { label: "Notifications", slug: "notifications", icon: IconBell, group: "Personal" },
    { label: "Profile", slug: "profile", icon: IconCog, group: "Personal" },
  ],
};

export const ROLE_ALLOWED_SECTIONS: Record<AssetFlowRole, AssetFlowSection[]> = {
  founder: [
    "dashboard",
    "organization",
    "departments",
    "employees",
    "roles-permissions",
    "categories",
    "assets",
    "bookings",
    "maintenance",
    "audit",
    "reports",
    "analytics",
    "settings",
  ],
  admin: [
    "dashboard",
    "departments",
    "employees",
    "categories",
    "assets",
    "bookings",
    "maintenance",
    "audit",
    "reports",
    "notifications",
    "settings",
  ],
  head: ["dashboard", "department-assets", "employees", "approvals", "bookings", "reports", "notifications", "settings"],
  manager: ["dashboard", "assets", "allocation", "transfers", "bookings", "maintenance", "audit", "reports", "notifications", "settings"],
  employee: ["dashboard", "my-assets", "bookings", "maintenance", "notifications", "profile", "settings"],
};

export function isAssetFlowRole(value: string): value is AssetFlowRole {
  return value in ROLE_HOME;
}

export function roleHome(role: AssetFlowRole) {
  return ROLE_HOME[role];
}

export function sectionHref(role: AssetFlowRole, slug: AssetFlowSection) {
  return `/${role}/${slug}`;
}

export function canAccessSection(role: AssetFlowRole, slug: string): slug is AssetFlowSection {
  return ROLE_ALLOWED_SECTIONS[role].includes(slug as AssetFlowSection);
}
