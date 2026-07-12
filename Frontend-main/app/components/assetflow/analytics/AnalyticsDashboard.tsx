"use client";

import { useEffect, useState } from "react";
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
  Legend,
  Cell,
  LabelList,
} from "recharts";
import { apiUrl } from "@/app/lib/assetflowApi";
import { getDB } from "@/app/lib/store";
import AiInsightsPanel from "./AiInsightsPanel";

// Chart chrome + validated categorical palette (see dataviz reference palette).
const INK_MUTED = "#898781";
const GRID = "#e1e0d9";
const BASELINE = "#c3c2b7";
const SERIES_1 = "#2a78d6"; // blue
const SERIES_2 = "#1baf7a"; // aqua

// Asset lifecycle states use reserved status colors, identity carried by axis labels.
const STATUS_COLORS: Record<string, string> = {
  Available: "#0ca30c",
  Allocated: "#2a78d6",
  Maintenance: "#fab219",
  Retired: "#898781",
};

type Analytics = {
  kpis: {
    totalAssets: number;
    portfolioValue: number;
    utilizationRate: number;
    openMaintenance: number;
    avgResolutionDays: number;
    activeBookings: number;
  };
  statusDistribution: Array<{ name: string; value: number }>;
  categoryDistribution: Array<{ name: string; value: number }>;
  maintenanceTrend: Array<{ month: string; requests: number; estimatedCost: number }>;
  bookingTrend: Array<{ month: string; bookings: number }>;
  resolutionByPriority: Array<{ priority: string; avgDays: number; resolved: number }>;
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  fontSize: 12,
  fontWeight: 600,
};

const axisTick = { fill: INK_MUTED, fontSize: 12 };

function ChartPanel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

function KpiTile({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${accent ? "border-transparent bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "border-slate-200 bg-white"}`}>
      <div className={`text-xs font-semibold uppercase tracking-wide ${accent ? "text-slate-400" : "text-slate-500"}`}>{label}</div>
      <div className={`mt-2 text-3xl font-black tracking-tight ${accent ? "text-white" : "text-slate-900"}`}>{value}</div>
      {hint && <div className={`mt-1 text-xs font-medium ${accent ? "text-slate-400" : "text-slate-500"}`}>{hint}</div>}
    </div>
  );
}

const REPAIR_COST_BY_PRIORITY: Record<string, number> = { High: 350, Medium: 200, Low: 90 };

// Fallback when the API is unreachable: compute the same analytics shape
// from the in-browser demo store so the page always renders.
function buildLocalAnalytics(): Analytics {
  const db = getDB();
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en", { month: "short" }) + " " + String(d.getFullYear()).slice(2),
    };
  });
  const monthKey = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${d.getMonth()}`;
  };

  const statusCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  let portfolioValue = 0;
  for (const a of db.assets) {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    const cat = db.categories.find((c) => c.id === a.categoryId)?.name ?? "Uncategorized";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    portfolioValue += a.acquisitionCost || 0;
  }

  let resolvedCount = 0;
  let resolutionDaysTotal = 0;
  const resByPriority: Record<string, { total: number; count: number }> = {};
  for (const m of db.maintenance) {
    if (m.status === "Resolved" && m.resolvedAt) {
      const days = (new Date(m.resolvedAt).getTime() - new Date(m.raisedAt).getTime()) / 86_400_000;
      if (Number.isFinite(days) && days >= 0) {
        resolvedCount += 1;
        resolutionDaysTotal += days;
        const slot = resByPriority[m.priority] ?? { total: 0, count: 0 };
        slot.total += days;
        slot.count += 1;
        resByPriority[m.priority] = slot;
      }
    }
  }

  const allocated = statusCounts["Allocated"] || 0;
  const total = db.assets.length;

  return {
    kpis: {
      totalAssets: total,
      portfolioValue,
      utilizationRate: total > 0 ? Math.round((allocated / total) * 100) : 0,
      openMaintenance: db.maintenance.filter((m) => m.status !== "Resolved" && m.status !== "Rejected").length,
      avgResolutionDays: resolvedCount > 0 ? Number((resolutionDaysTotal / resolvedCount).toFixed(1)) : 0,
      activeBookings: db.bookings.filter((b) => b.status === "Upcoming" || b.status === "Ongoing").length,
    },
    statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
    categoryDistribution: Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    maintenanceTrend: months.map((m) => {
      const inMonth = db.maintenance.filter((x) => monthKey(x.raisedAt) === m.key);
      return {
        month: m.label,
        requests: inMonth.length,
        estimatedCost: inMonth.reduce((sum, x) => sum + (REPAIR_COST_BY_PRIORITY[x.priority] ?? 200), 0),
      };
    }),
    bookingTrend: months.map((m) => ({
      month: m.label,
      bookings: db.bookings.filter((b) => monthKey(b.start) === m.key).length,
    })),
    resolutionByPriority: ["High", "Medium", "Low"].map((priority) => {
      const slot = resByPriority[priority];
      return {
        priority,
        avgDays: slot && slot.count > 0 ? Number((slot.total / slot.count).toFixed(1)) : 0,
        resolved: slot?.count ?? 0,
      };
    }),
  };
}

function isValidAnalytics(value: unknown): value is Analytics {
  const v = value as Analytics | null;
  return Boolean(v && v.kpis && Array.isArray(v.maintenanceTrend) && Array.isArray(v.bookingTrend) && Array.isArray(v.statusDistribution));
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch(apiUrl("/api/reports/analytics"))
      .then(async (res) => {
        if (!res.ok) throw new Error("analytics unavailable");
        const json = await res.json();
        if (!isValidAnalytics(json)) throw new Error("unexpected analytics payload");
        setData(json);
      })
      .catch(() => setData(buildLocalAnalytics()));
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Computing analytics...</div>
      </div>
    );
  }

  const { kpis } = data;
  const activityTrend = data.maintenanceTrend.map((m, i) => ({
    month: m.month,
    maintenance: m.requests,
    bookings: data.bookingTrend[i]?.bookings ?? 0,
  }));

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Analytics</h1>
        <p className="mt-2 text-slate-600">Live utilization, maintenance cost trends and AI-driven fleet health.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiTile accent label="Portfolio Value" value={`$${kpis.portfolioValue.toLocaleString()}`} hint={`${kpis.totalAssets} assets tracked`} />
        <KpiTile label="Utilization" value={`${kpis.utilizationRate}%`} hint="Assets currently allocated" />
        <KpiTile label="Open Maintenance" value={String(kpis.openMaintenance)} hint="Pending or in progress" />
        <KpiTile label="Avg Resolution" value={`${kpis.avgResolutionDays}d`} hint="Across resolved requests" />
        <KpiTile label="Active Bookings" value={String(kpis.activeBookings)} hint="Live reservations" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel title="Assets by status" subtitle="Current lifecycle state of every asset">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.statusDistribution} layout="vertical" margin={{ left: 8, right: 32 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} width={92} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
              <Bar dataKey="value" name="Assets" barSize={18} radius={[0, 4, 4, 0]}>
                {data.statusDistribution.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? SERIES_1} />
                ))}
                <LabelList dataKey="value" position="right" style={{ fill: "#52514e", fontSize: 12, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Assets by category" subtitle="Where the fleet is concentrated">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categoryDistribution} layout="vertical" margin={{ left: 8, right: 32 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} width={110} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.04)" }} />
              <Bar dataKey="value" name="Assets" fill={SERIES_1} barSize={18} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="value" position="right" style={{ fill: "#52514e", fontSize: 12, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Activity trend" subtitle="Maintenance requests vs bookings, last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityTrend} margin={{ left: -16, right: 16, top: 8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              <Line type="monotone" dataKey="maintenance" name="Maintenance" stroke={SERIES_1} strokeWidth={2} dot={{ r: 4, fill: SERIES_1, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="bookings" name="Bookings" stroke={SERIES_2} strokeWidth={2} dot={{ r: 4, fill: SERIES_2, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Estimated repair spend" subtitle="Priority-weighted maintenance cost per month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.maintenanceTrend} margin={{ left: -8, right: 16, top: 8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.04)" }} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Est. cost"]} />
              <Bar dataKey="estimatedCost" name="Est. cost" fill={SERIES_1} barSize={22} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel title="Resolution time by priority" subtitle="Average days to resolve maintenance requests">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.resolutionByPriority} layout="vertical" margin={{ left: 8, right: 40 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} />
              <YAxis type="category" dataKey="priority" tick={axisTick} axisLine={{ stroke: BASELINE }} tickLine={false} width={70} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(15,23,42,0.04)" }} formatter={(value, _name, item) => [`${value} days (${(item?.payload as { resolved?: number } | undefined)?.resolved ?? 0} resolved)`, "Avg resolution"]} />
              <Bar dataKey="avgDays" name="Avg days" fill={SERIES_1} barSize={18} radius={[0, 4, 4, 0]}>
                <LabelList dataKey="avgDays" position="right" formatter={(v) => (Number(v) > 0 ? `${v}d` : "")} style={{ fill: "#52514e", fontSize: 12, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <AiInsightsPanel />
      </div>
    </div>
  );
}
