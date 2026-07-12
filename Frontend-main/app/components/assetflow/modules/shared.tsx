"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { getDB, subscribe, type DB, type AssetStatus } from "@/app/lib/store";

export function useDB(): DB {
  return useSyncExternalStore(subscribe, getDB, getDB);
}

export const STATUS_STYLES: Record<AssetStatus, string> = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Allocated: "bg-odoo-50 text-odoo-700 border-odoo-200",
  Reserved: "bg-amber-50 text-amber-700 border-amber-200",
  "Under Maintenance": "bg-orange-50 text-orange-700 border-orange-200",
  Lost: "bg-red-50 text-red-700 border-red-200",
  Retired: "bg-slate-100 text-slate-600 border-slate-200",
  Disposed: "bg-slate-100 text-slate-500 border-slate-200",
};

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    purple: "bg-odoo-50 text-odoo-700 border-odoo-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone] ?? tones.slate}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function Panel({ title, subtitle, actions, children }: {
  title: string; subtitle?: string; actions?: ReactNode; children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(39,22,33,0.055)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Button({ children, onClick, tone = "primary", type = "button", disabled }: {
  children: ReactNode; onClick?: () => void;
  tone?: "primary" | "ghost" | "danger" | "success";
  type?: "button" | "submit"; disabled?: boolean;
}) {
  const tones = {
    primary: "bg-[#9A528D] text-white hover:brightness-110 shadow-[0_10px_22px_rgba(154,82,141,0.25)]",
    ghost: "border border-slate-200 bg-white text-slate-700 hover:border-odoo-300 hover:text-odoo-700",
    danger: "bg-red-600 text-white hover:brightness-110",
    success: "bg-emerald-600 text-white hover:brightness-110",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-[0_1px_2px_rgba(39,22,33,0.03)] outline-none transition placeholder:text-slate-400 focus:border-odoo-400 focus:ring-4 focus:ring-odoo-100/70";

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-[#fbf8fa] text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white/70">{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyRow({ span, message }: { span: number; message: string }) {
  return (
    <tr>
      <td colSpan={span} className="px-4 py-8 text-center text-sm text-slate-400">{message}</td>
    </tr>
  );
}

export function Tabs({ tabs, active, onChange }: {
  tabs: { key: string; label: string }[]; active: string; onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-2xl border border-slate-200 bg-white/80 p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            active === t.key ? "bg-[#9A528D] text-white shadow-sm" : "text-slate-600 hover:text-odoo-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Alert({ kind, children }: { kind: "error" | "success" | "info"; children: ReactNode }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-odoo-200 bg-odoo-50 text-odoo-800",
  };
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[kind]}`}>{children}</div>;
}

// Manual date formatting — locale-based formatters render differently on the
// server vs the browser and cause React hydration mismatches.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${pad2(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${pad2(d.getDate())} ${MONTHS[d.getMonth()]}, ${fmtTime(iso)}`;
}

export function fmtTime(iso?: string | Date) {
  if (!iso) return "—";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const hours24 = d.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const ampm = hours24 < 12 ? "AM" : "PM";
  return `${pad2(hours12)}:${pad2(d.getMinutes())} ${ampm}`;
}

const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function fmtDateLong(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${pad2(d.getDate())} ${MONTHS_LONG[d.getMonth()]}`;
}
