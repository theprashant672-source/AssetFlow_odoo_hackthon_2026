import { redirect } from "next/navigation";
import ModulePage from "@/app/components/assetflow/ModulePage";
import RoleDashboard from "@/app/components/assetflow/dashboard/RoleDashboard";
import { canAccessSection, isAssetFlowRole, sectionHref, type AssetFlowRole, type AssetFlowSection } from "@/app/lib/assetflow-roles";

export default async function RoleSectionPage({
  params,
}: Readonly<{
  params: Promise<{ role: string; section: string }>;
}>) {
  const { role, section } = await params;
  if (!isAssetFlowRole(role)) {
    redirect("/login");
  }

  if (!canAccessSection(role, section)) {
    return (
      <ModulePage
        title="Access denied"
        subtitle={`The ${section} module is not available for ${role}.`}
        backHref={sectionHref(role as AssetFlowRole, "dashboard")}
      />
    );
  }

  const activeRole = role as AssetFlowRole;
  const activeSection = section as AssetFlowSection;

  if (activeSection === "dashboard") {
    return <RoleDashboard role={activeRole} />;
  }

  const titles: Record<AssetFlowSection, { title: string; subtitle: string }> = {
    dashboard: { title: "Dashboard", subtitle: "Role-based enterprise snapshot." },
    organization: { title: "Organization", subtitle: "Manage company structure, hierarchy, and governance." },
    departments: { title: "Departments", subtitle: "Create departments and assign owners." },
    employees: { title: "Employees", subtitle: "Track people, roles, and ownership." },
    "roles-permissions": { title: "Roles & Permissions", subtitle: "Control access across the platform." },
    categories: { title: "Categories", subtitle: "Electronics, furniture, vehicles, rooms, and equipment." },
    assets: { title: "Assets", subtitle: "Register and manage company assets." },
    allocation: { title: "Allocation", subtitle: "Approve, assign, and return assets." },
    transfers: { title: "Transfers", subtitle: "Move assets between people and departments." },
    bookings: { title: "Bookings", subtitle: "Reserve rooms, projectors, and vehicles." },
    maintenance: { title: "Maintenance", subtitle: "Handle maintenance requests and resolutions." },
    audit: { title: "Audit", subtitle: "Review audit cycles and discrepancies." },
    reports: { title: "Reports", subtitle: "Summaries for leadership and team reviews." },
    analytics: { title: "Analytics", subtitle: "Usage trends and operational insights." },
    notifications: { title: "Notifications", subtitle: "Updates, approvals, and reminders." },
    settings: { title: "Settings", subtitle: "Profile and workspace preferences." },
    "department-assets": { title: "Department Assets", subtitle: "Assets owned by your department." },
    approvals: { title: "Approvals", subtitle: "Pending allocation and booking approvals." },
    "my-assets": { title: "My Assets", subtitle: "Assets assigned directly to you." },
    profile: { title: "Profile", subtitle: "Your account details and preferences." },
  };

  const meta = titles[activeSection];
  return <ModulePage title={meta.title} subtitle={meta.subtitle} backHref={sectionHref(activeRole, "dashboard")} />;
}
