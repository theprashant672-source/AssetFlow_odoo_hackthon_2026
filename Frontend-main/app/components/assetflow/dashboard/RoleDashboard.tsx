import SectionPanel from "../cards/SectionPanel";
import StatCard from "../cards/StatCard";
import ActivityFeed from "../cards/ActivityFeed";
import AssetStatusChart from "../charts/AssetStatusChart";
import DepartmentChart from "../charts/DepartmentChart";
import RecentAssetsTable from "../tables/RecentAssetsTable";
import type { AssetFlowRole } from "@/app/lib/assetflow-roles";

const sharedAssets = [
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
    tag: "AF-ROM-0008",
    name: "Conference Room A",
    category: "Rooms",
    location: "HQ Floor 4",
    status: "Booked",
    condition: "Ready",
  },
];

const operationalMetrics = [
  { label: "Assets Available", value: "6,420", delta: "+120 ready", tone: "emerald" as const },
  { label: "Assets Allocated", value: "4,210", delta: "+45 assigned", tone: "violet" as const },
  { label: "Active Bookings", value: "34", delta: "12 ongoing", tone: "sky" as const },
  { label: "Pending Transfers", value: "18", delta: "In transit", tone: "violet" as const },
  { label: "Maintenance Today", value: "12", delta: "4 urgent", tone: "amber" as const },
  { label: "Upcoming Returns", value: "24", delta: "Due this week", tone: "sky" as const },
  { label: "Overdue Returns", value: "7", delta: "Requires action", tone: "rose" as const },
];

const roleContent: Record<AssetFlowRole, {
  title: string;
  subtitle: string;
  metrics: typeof operationalMetrics;
  activities: Array<{ title: string; description: string; time: string; tone: string }>;
  statusSeries: Array<{ label: string; value: number; color: string }>;
  departmentSeries: Array<{ label: string; value: number; color: string }>;
}> = {
  founder: {
    title: "Organization Overview",
    subtitle: "Command view for company-wide governance, assets, and operational health.",
    metrics: operationalMetrics,
    activities: [
      { title: "New department created", description: "Product Growth was added under the corporate hierarchy.", time: "4m ago", tone: "bg-[#9A528D]" },
      { title: "Policy update approved", description: "Access rules were updated for asset custody and audit cycles.", time: "26m ago", tone: "bg-odoo-500" },
      { title: "Audit cycle closed", description: "Quarterly audit closed with 98.2% compliance.", time: "1h ago", tone: "bg-emerald-500" },
    ],
    statusSeries: [
      { label: "Available", value: 6420, color: "#16a34a" },
      { label: "Allocated", value: 4210, color: "#9A528D" },
      { label: "Maintenance", value: 780, color: "#f59e0b" },
      { label: "Retired", value: 1070, color: "#ef4444" },
    ],
    departmentSeries: [
      { label: "Engineering", value: 1880, color: "#9A528D" },
      { label: "Sales", value: 1240, color: "#b878ab" },
      { label: "Operations", value: 980, color: "#16a34a" },
      { label: "Facilities", value: 540, color: "#f59e0b" },
      { label: "Finance", value: 320, color: "#ef4444" },
    ],
  },
  admin: {
    title: "Admin Control Center",
    subtitle: "Monitor departments, employees, assets, and operational alerts in one workspace.",
    metrics: operationalMetrics,
    activities: [
      { title: "Department approval pending", description: "Finance and Procurement are waiting for admin sign-off.", time: "8m ago", tone: "bg-[#9A528D]" },
      { title: "Asset registration completed", description: "12 new devices were added to the company inventory.", time: "31m ago", tone: "bg-odoo-500" },
      { title: "Maintenance request escalated", description: "Two laptops are awaiting service approval.", time: "58m ago", tone: "bg-amber-500" },
    ],
    statusSeries: [
      { label: "Available", value: 4600, color: "#16a34a" },
      { label: "Allocated", value: 3410, color: "#9A528D" },
      { label: "Maintenance", value: 520, color: "#f59e0b" },
      { label: "Retired", value: 680, color: "#ef4444" },
    ],
    departmentSeries: [
      { label: "Engineering", value: 1460, color: "#9A528D" },
      { label: "Sales", value: 940, color: "#b878ab" },
      { label: "Operations", value: 720, color: "#16a34a" },
      { label: "HR", value: 430, color: "#f59e0b" },
      { label: "Finance", value: 360, color: "#ef4444" },
    ],
  },
  head: {
    title: "Department Command View",
    subtitle: "Keep track of your department's assets, people, requests, and bookings.",
    metrics: operationalMetrics,
    activities: [
      { title: "Approval waiting on head", description: "A laptop allocation request needs your review.", time: "6m ago", tone: "bg-[#9A528D]" },
      { title: "Upcoming booking", description: "Conference Room B is reserved tomorrow at 11:00 AM.", time: "18m ago", tone: "bg-odoo-500" },
      { title: "Employee added to team", description: "Two new members joined the design department.", time: "1h ago", tone: "bg-emerald-500" },
    ],
    statusSeries: [
      { label: "Available", value: 760, color: "#16a34a" },
      { label: "Allocated", value: 360, color: "#9A528D" },
      { label: "Maintenance", value: 80, color: "#f59e0b" },
      { label: "Pending", value: 48, color: "#ef4444" },
    ],
    departmentSeries: [
      { label: "Your Dept", value: 860, color: "#9A528D" },
      { label: "Cross-Team", value: 220, color: "#b878ab" },
      { label: "Reserve", value: 110, color: "#16a34a" },
    ],
  },
  manager: {
    title: "Asset Operations Board",
    subtitle: "Handle transfers, maintenance, and asset allocation with clear operational focus.",
    metrics: operationalMetrics,
    activities: [
      { title: "Transfer request raised", description: "Three laptops are moving from HQ to field sales.", time: "11m ago", tone: "bg-[#9A528D]" },
      { title: "Maintenance assigned", description: "IT support has accepted two repair tickets.", time: "25m ago", tone: "bg-odoo-500" },
      { title: "Return overdue alert", description: "Four assets need return confirmation today.", time: "49m ago", tone: "bg-amber-500" },
    ],
    statusSeries: [
      { label: "Available", value: 310, color: "#16a34a" },
      { label: "Allocated", value: 430, color: "#9A528D" },
      { label: "Maintenance", value: 68, color: "#f59e0b" },
      { label: "Pending Return", value: 34, color: "#ef4444" },
    ],
    departmentSeries: [
      { label: "Allocated", value: 430, color: "#9A528D" },
      { label: "Transfers", value: 102, color: "#b878ab" },
      { label: "Returns", value: 74, color: "#16a34a" },
    ],
  },
  employee: {
    title: "My Workspace",
    subtitle: "See assigned assets, bookings, notifications, and maintenance requests.",
    metrics: operationalMetrics,
    activities: [
      { title: "Laptop assigned", description: "Your primary work laptop is now active in inventory.", time: "15m ago", tone: "bg-[#9A528D]" },
      { title: "Meeting room booked", description: "Conference Room C is reserved for your team sync.", time: "2h ago", tone: "bg-odoo-500" },
      { title: "Maintenance requested", description: "Your headset replacement request is awaiting approval.", time: "Today", tone: "bg-amber-500" },
    ],
    statusSeries: [
      { label: "Assigned", value: 6, color: "#9A528D" },
      { label: "Bookings", value: 2, color: "#b878ab" },
      { label: "Maintenance", value: 1, color: "#f59e0b" },
      { label: "Unread", value: 8, color: "#16a34a" },
    ],
    departmentSeries: [
      { label: "My Assets", value: 6, color: "#9A528D" },
      { label: "Bookings", value: 2, color: "#b878ab" },
      { label: "Requests", value: 1, color: "#16a34a" },
    ],
  },
};

export default function RoleDashboard({ role }: { role: AssetFlowRole }) {
  const config = roleContent[role];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-[#5b3df5] px-4 py-3 font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Register Asset
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 font-semibold text-white shadow-sm hover:bg-sky-600 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Resource
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Raise Maintenance Request
        </button>
      </div>

      <SectionPanel title={config.title} subtitle={config.subtitle}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {config.metrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>
      </SectionPanel>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionPanel title="Recent Activity" subtitle="Live role-specific operations">
          <ActivityFeed items={config.activities} />
        </SectionPanel>

        <SectionPanel title="Notifications" subtitle="Today’s operational items">
          <div className="grid gap-3">
            {[
              { title: "Pending approvals", description: "Items waiting for your next action.", tone: "text-amber-700 bg-amber-50" },
              { title: "Due reminders", description: "Asset returns, bookings, and maintenance due soon.", tone: "text-odoo-700 bg-odoo-50" },
              { title: "System status", description: "Workspace sync and policies are healthy.", tone: "text-emerald-700 bg-emerald-50" },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border border-slate-200 p-4 shadow-sm ${item.tone}`}>
                <div className="text-sm font-bold">{item.title}</div>
                <div className="mt-1 text-sm leading-6 opacity-90">{item.description}</div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Asset Status" subtitle="Current operational split">
          <AssetStatusChart data={config.statusSeries} />
        </SectionPanel>
        <SectionPanel title={role === "founder" ? "Department Mix" : "Activity Mix"} subtitle="A quick look at workload distribution">
          <DepartmentChart data={config.departmentSeries} />
        </SectionPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <SectionPanel title="Recent Assets" subtitle="Latest asset records">
          <RecentAssetsTable rows={sharedAssets} />
        </SectionPanel>
        <SectionPanel title="Access Summary" subtitle="Responsibilities for this workspace">
          <div className="grid gap-3">
            {role === "founder" && (
              <>
                <InfoCard title="Organization oversight" description="Govern departments, hierarchy, policies, and company-wide visibility." />
                <InfoCard title="Analytics ready" description="The founder dashboard is designed for executive review and reporting." />
              </>
            )}
            {role === "admin" && (
              <>
                <InfoCard title="Admin control" description="Manage departments, employees, categories, assets, and notifications." />
                <InfoCard title="Public company view" description="Company landing pages remain accessible without login." />
              </>
            )}
            {role === "head" && (
              <>
                <InfoCard title="Department scope" description="Heads only see their department assets, requests, and bookings." />
                <InfoCard title="Approval flow" description="Requests can be reviewed without exposing company-wide data." />
              </>
            )}
            {role === "manager" && (
              <>
                <InfoCard title="Operations focus" description="Transfers, maintenance, and pending returns stay front and center." />
                <InfoCard title="Asset control" description="Managers act on asset movement and support workflows." />
              </>
            )}
            {role === "employee" && (
              <>
                <InfoCard title="Personal workspace" description="Only your assets, bookings, and maintenance requests are shown." />
                <InfoCard title="Simple profile" description="Employees get a lightweight and focused experience." />
              </>
            )}
          </div>
        </SectionPanel>
      </section>
    </div>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="text-sm font-bold text-slate-900">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
