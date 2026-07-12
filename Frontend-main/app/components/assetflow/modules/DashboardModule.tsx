"use client";

import Link from "next/link";
import { computeKpis, isOverdue, assetHolderLabel, type DB } from "@/app/lib/store";
import type { AssetFlowRole } from "@/app/lib/assetflow-roles";
import { useDB, Panel, Badge, StatusBadge, Table, EmptyRow, fmtDate, fmtDateTime } from "./shared";

function KpiCard({ label, value, href, highlight }: {
  label: string; value: number; href: string; highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`glass-panel soft-shadow block rounded-2xl p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg ${
        highlight ? "border-2 border-red-300 bg-red-50/70" : ""
      }`}
    >
      <div className={`text-xs font-bold uppercase tracking-[0.14em] ${highlight ? "text-red-600" : "text-slate-500"}`}>
        {label}
      </div>
      <div className={`mt-1.5 text-2xl font-black tracking-tight ${highlight ? "text-red-700" : "text-slate-900"}`}>
        {value}
      </div>
    </Link>
  );
}

export default function DashboardModule({ role }: { role: AssetFlowRole }) {
  const db: DB = useDB();
  const k = computeKpis(db);
  const overdueAssets = db.assets.filter(isOverdue);
  const upcoming = db.assets.filter(
    (a) => a.status === "Allocated" && a.expectedReturn && !isOverdue(a)
  );
  const recentActivity = db.activity.slice(0, 8);
  const base = `/${role}`;

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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Assets available" value={k.available} href={`${base}/assets`} />
        <KpiCard label="Assets allocated" value={k.allocated} href={`${base}/allocation`} />
        <KpiCard label="Maintenance" value={k.maintenanceToday} href={`${base}/maintenance`} />
        <KpiCard label="Active bookings" value={k.activeBookings} href={`${base}/bookings`} />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard label="Pending transfers" value={k.pendingTransfers} href={`${base}/allocation`} />
        <KpiCard label="Returns due" value={k.upcomingReturns} href={`${base}/allocation`} />
        <KpiCard label="Overdue returns" value={k.overdueReturns} href={`${base}/allocation`} highlight={k.overdueReturns > 0} />
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

      <Panel title="Asset status overview" subtitle="Live lifecycle distribution.">
        <div className="flex flex-wrap gap-2.5">
          {(["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"] as const).map((s) => {
            const count = db.assets.filter((a) => a.status === s).length;
            return (
              <div key={s} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                <StatusBadge status={s} />
                <span className="text-sm font-black text-slate-900">{count}</span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
