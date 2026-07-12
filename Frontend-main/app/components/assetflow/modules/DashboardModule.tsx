"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { computeKpis, isOverdue, assetHolderLabel, type DB } from "@/app/lib/store";
import type { AssetFlowRole } from "@/app/lib/assetflow-roles";
import {
  IconArrowUpRight,
  IconPackage,
  IconClipboardList,
  IconWrench,
  IconTruck,
  IconCheckCircle,
} from "@/app/components/icons/Icons";
import WorkspaceGuide from "../dashboard/WorkspaceGuide";
import { useDB, Panel, Badge, StatusBadge, Table, EmptyRow, fmtDate, fmtDateTime } from "./shared";

const KPI_TONES = {
  emerald: { chip: "bg-emerald-100 text-emerald-700", ring: "hover:border-emerald-300" },
  violet: { chip: "bg-[#f6ecf4] text-[#9A528D]", ring: "hover:border-[#9A528D]/40" },
  amber: { chip: "bg-amber-100 text-amber-700", ring: "hover:border-amber-300" },
  blue: { chip: "bg-blue-100 text-blue-700", ring: "hover:border-blue-300" },
  red: { chip: "bg-red-100 text-red-700", ring: "hover:border-red-300" },
} as const;

function KpiCard({ label, value, href, hint, icon: Icon, tone = "violet", highlight }: {
  label: string;
  value: number;
  href: string;
  hint: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone?: keyof typeof KPI_TONES;
  highlight?: boolean;
}) {
  const t = KPI_TONES[highlight ? "red" : tone];
  return (
    <Link
      href={href}
      className={`group block rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        highlight ? "border-red-300 bg-red-50/70" : `border-slate-200 ${t.ring}`
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${t.chip}`}>
          <Icon size={17} />
        </span>
        <IconArrowUpRight size={15} className="text-slate-300 transition group-hover:text-[#9A528D]" />
      </div>
      <div className={`mt-3 text-3xl font-black tracking-tight ${highlight ? "text-red-700" : "text-slate-900"}`}>
        {value}
      </div>
      <div className={`mt-1 text-xs font-bold uppercase tracking-[0.12em] ${highlight ? "text-red-600" : "text-slate-500"}`}>
        {label}
      </div>
      <div className="mt-1.5 text-[11px] font-medium leading-4 text-slate-400">{hint}</div>
    </Link>
  );
}

// Chart chrome + colors, same validated palette as the Analytics page.
const GRID = "#e1e0d9";
const INK_MUTED = "#898781";
const BASELINE = "#c3c2b7";
const SERIES_1 = "#2a78d6";
const axisTick = { fill: INK_MUTED, fontSize: 11 };
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  fontSize: 12,
  fontWeight: 600,
};

const STATUS_CHART_COLORS: Record<string, string> = {
  Available: "#0ca30c",
  Allocated: "#2a78d6",
  Reserved: "#9A528D",
  "Under Maintenance": "#fab219",
  Lost: "#d03b3b",
  Retired: "#898781",
  Disposed: "#c3c2b7",
};

export default function DashboardModule({ role }: { role: AssetFlowRole }) {
  const db: DB = useDB();
  const k = computeKpis(db);
  const overdueAssets = db.assets.filter(isOverdue);
  const upcoming = db.assets.filter(
    (a) => a.status === "Allocated" && a.expectedReturn && !isOverdue(a)
  );
  const recentActivity = db.activity.slice(0, 8);
  const base = `/${role}`;

  const statusChartData = (
    ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"] as const
  )
    .map((s) => ({ name: s as string, value: db.assets.filter((a) => a.status === s).length }))
    .filter((s) => s.value > 0);

  const activityTrend = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - i));
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return {
      day: day.toLocaleDateString("en", { weekday: "short" }),
      events: db.activity.filter((e) => {
        const t = new Date(e.at).getTime();
        return t >= day.getTime() && t < next.getTime();
      }).length,
    };
  });

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-2xl bg-[#341d2d] px-4 py-5 text-white shadow-[0_18px_42px_rgba(52,29,45,0.22)] sm:px-5 sm:py-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/55">AssetFlow operations</div>
            <h2 className="mt-2 text-xl font-black tracking-tight sm:text-2xl">Stay ahead of the day&apos;s asset activity.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Review availability, requests, returns, and the actions that need attention.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`${base}/assets`} className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-white/15">Register asset</Link>
            <Link href={`${base}/allocation`} className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-white/15">Review requests</Link>
          </div>
        </div>
      </section>

      <WorkspaceGuide role={role} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Assets available" value={k.available} href={`${base}/assets`} icon={IconPackage} tone="emerald" hint="Ready to allocate — click to see the full inventory." />
        <KpiCard label="Assets allocated" value={k.allocated} href={`${base}/allocation`} icon={IconClipboardList} tone="violet" hint="Currently with people — click to see who holds what." />
        <KpiCard label="Maintenance" value={k.maintenanceToday} href={`${base}/maintenance`} icon={IconWrench} tone="amber" hint="Assets under repair — click to track or resolve." />
        <KpiCard label="Active bookings" value={k.activeBookings} href={`${base}/bookings`} icon={IconClipboardList} tone="blue" hint="Live reservations — click to manage time slots." />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard label="Pending transfers" value={k.pendingTransfers} href={`${base}/allocation`} icon={IconTruck} tone="blue" hint="Waiting for approval — click to review requests." />
        <KpiCard label="Returns due" value={k.upcomingReturns} href={`${base}/allocation`} icon={IconCheckCircle} tone="violet" hint="Coming back soon — click to see due dates." />
        <KpiCard label="Overdue returns" value={k.overdueReturns} href={`${base}/allocation`} icon={IconClipboardList} highlight={k.overdueReturns > 0} tone="red" hint="Past the return date — needs follow-up now." />
      </div>

      {overdueAssets.length > 0 && (
        <Panel
          title="Overdue returns"
          subtitle="Past their expected return date — flagged automatically."
        >
          <Table headers={["Asset", "Holder", "Expected return", "Status"]}>
            {overdueAssets.map((a) => (
              <tr key={a.id} className="bg-red-50/40">
                <td className="px-4 py-3 font-semibold text-slate-900">{a.name} <span className="text-xs text-slate-400">{a.tag}</span></td>
                <td className="px-4 py-3">{assetHolderLabel(db, a)}</td>
                <td className="px-4 py-3 font-semibold text-red-700">{fmtDate(a.expectedReturn)}</td>
                <td className="px-4 py-3"><Badge tone="red">Overdue</Badge></td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Upcoming returns" subtitle="Allocated assets due back soon.">
          <Table headers={["Asset", "Holder", "Due"]}>
            {upcoming.length === 0 && <EmptyRow span={3} message="No upcoming returns." />}
            {upcoming.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{a.name} <span className="text-xs text-slate-400">{a.tag}</span></td>
                <td className="px-4 py-3">{assetHolderLabel(db, a)}</td>
                <td className="px-4 py-3">{fmtDate(a.expectedReturn)}</td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel title="Recent activity" subtitle="Who did what, when.">
          <ul className="grid gap-2.5">
            {recentActivity.length === 0 && <li className="text-sm text-slate-400">No activity yet.</li>}
            {recentActivity.map((e) => (
              <li key={e.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/70 px-3.5 py-2.5">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#9A528D]" />
                <div>
                  <div className="text-sm font-medium text-slate-800">{e.action}</div>
                  <div className="text-xs text-slate-400">{e.actor} · {fmtDateTime(e.at)}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Asset status overview" subtitle="Where every asset stands right now — click a KPI above to act.">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} layout="vertical" margin={{ left: 8, right: 32 }}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} width={118} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
                <Bar dataKey="value" name="Assets" barSize={16} radius={[0, 4, 4, 0]}>
                  {statusChartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_CHART_COLORS[entry.name] ?? SERIES_1} />
                  ))}
                  <LabelList dataKey="value" position="right" style={{ fill: "#52514e", fontSize: 11, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {statusChartData.map((s) => (
              <span key={s.name} className="inline-flex items-center gap-1.5">
                <StatusBadge status={s.name as never} />
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Activity — last 7 days" subtitle="How busy the workspace has been, day by day.">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityTrend} margin={{ left: -24, right: 16, top: 8 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="day" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="events" name="Actions" stroke={SERIES_1} strokeWidth={2} dot={{ r: 4, fill: SERIES_1, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-400">
            Every registration, allocation, booking and repair counts as one action.
          </p>
        </Panel>
      </div>
    </div>
  );
}
