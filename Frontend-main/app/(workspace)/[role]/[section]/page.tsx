import { redirect } from "next/navigation";
import ModulePage from "@/app/components/assetflow/ModulePage";
import DashboardModule from "@/app/components/assetflow/modules/DashboardModule";
import OrganizationModule from "@/app/components/assetflow/modules/OrganizationModule";
import AssetsModule from "@/app/components/assetflow/modules/AssetsModule";
import AllocationModule from "@/app/components/assetflow/modules/AllocationModule";
import BookingModule from "@/app/components/assetflow/modules/BookingModule";
import MaintenanceModule from "@/app/components/assetflow/modules/MaintenanceModule";
import AuditModule from "@/app/components/assetflow/modules/AuditModule";
import ReportsModule from "@/app/components/assetflow/modules/ReportsModule";
import NotificationsModule from "@/app/components/assetflow/modules/NotificationsModule";
import { canAccessSection, isAssetFlowRole, sectionHref, type AssetFlowRole, type AssetFlowSection } from "@/app/lib/assetflow-roles";

const SECTION_TITLES: Record<AssetFlowSection, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Real-time operational snapshot with live KPIs." },
  organization: { title: "Organization Setup", subtitle: "Departments, asset categories and the employee directory." },
  departments: { title: "Departments", subtitle: "Create departments, assign heads, manage hierarchy." },
  employees: { title: "Employee Directory", subtitle: "People, roles and status — roles are assigned only here." },
  "roles-permissions": { title: "Roles & Permissions", subtitle: "Promote employees to Department Head or Asset Manager." },
  categories: { title: "Asset Categories", subtitle: "Electronics, furniture, vehicles, rooms and equipment." },
  assets: { title: "Assets", subtitle: "Register and track assets through their full lifecycle." },
  allocation: { title: "Allocation & Transfer", subtitle: "Who holds what — with explicit conflict rules." },
  transfers: { title: "Transfers", subtitle: "Requested → Approved → re-allocated with history." },
  bookings: { title: "Resource Booking", subtitle: "Time-slot booking with overlap validation." },
  maintenance: { title: "Maintenance", subtitle: "Approval workflow before repair work starts." },
  audit: { title: "Asset Audit", subtitle: "Structured verification cycles with discrepancy reports." },
  reports: { title: "Reports", subtitle: "Utilization, maintenance frequency and allocation summaries." },
  analytics: { title: "Analytics", subtitle: "Usage trends and peak booking windows." },
  notifications: { title: "Notifications & Activity", subtitle: "Alerts plus a full audit log of actions." },
  settings: { title: "Settings", subtitle: "Profile and workspace preferences." },
  "department-assets": { title: "Department Assets", subtitle: "Assets owned by your department." },
  approvals: { title: "Approvals", subtitle: "Pending allocation and transfer approvals." },
  "my-assets": { title: "My Assets", subtitle: "Assets assigned directly to you." },
  profile: { title: "Profile", subtitle: "Your account details and preferences." },
};

function SectionBody({ role, section }: { role: AssetFlowRole; section: AssetFlowSection }) {
  const isAdmin = role === "founder" || role === "admin";
  const isManager = isAdmin || role === "manager";
  const canApprove = isManager || role === "head";

  switch (section) {
    case "dashboard":
      return <DashboardModule role={role} />;
    case "organization":
      return <OrganizationModule initialTab="departments" canEdit={isAdmin} />;
    case "departments":
      return <OrganizationModule initialTab="departments" canEdit={isAdmin} />;
    case "categories":
      return <OrganizationModule initialTab="categories" canEdit={isAdmin} />;
    case "employees":
    case "roles-permissions":
      return <OrganizationModule initialTab="employees" canEdit={isAdmin} />;
    case "assets":
      return <AssetsModule canRegister={isManager} />;
    case "my-assets":
      return <AssetsModule canRegister={false} scope="mine" />;
    case "department-assets":
      return <AssetsModule canRegister={false} />;
    case "allocation":
    case "transfers":
    case "approvals":
      return <AllocationModule canApprove={canApprove} />;
    case "bookings":
      return <BookingModule />;
    case "maintenance":
      return <MaintenanceModule canApprove={isManager} />;
    case "audit":
      return <AuditModule canManage={isManager} />;
    case "reports":
    case "analytics":
      return <ReportsModule />;
    case "notifications":
      return <NotificationsModule />;
    default:
      return null;
  }
}

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
  const meta = SECTION_TITLES[activeSection];

  if (activeSection === "settings" || activeSection === "profile") {
    return <ModulePage title={meta.title} subtitle={meta.subtitle} backHref={sectionHref(activeRole, "dashboard")} />;
  }

  return (
    <div className="grid gap-5">
      <header>
        <h1 className="text-2xl font-black tracking-tight text-slate-950">{meta.title}</h1>
        <p className="mt-1 text-sm text-slate-500">{meta.subtitle}</p>
      </header>
      <SectionBody role={activeRole} section={activeSection} />
    </div>
  );
}
