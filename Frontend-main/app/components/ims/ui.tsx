"use client";

import type { ReactNode } from "react";
import { IconPencil, IconSearch, IconTrash } from "../icons/Icons";

export function Badge({ children, color }: { children: ReactNode; color?: string }) {
  const map: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    red: "bg-red-50 text-red-700 border border-red-200",
    yellow: "bg-amber-50 text-amber-700 border border-amber-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
    teal: "bg-teal-50 text-teal-700 border border-teal-200",
    orange: "bg-orange-50 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${map[color || ""] || map.gray}`}>
      {children}
    </span>
  );
}

export function roleBadge(role: string) {
  if (role === "Admin") return <Badge color="red">{role}</Badge>;
  if (role === "Sales") return <Badge color="blue">{role}</Badge>;
  if (role === "Inventory") return <Badge color="orange">{role}</Badge>;
  if (role === "Dispatch") return <Badge color="teal">{role}</Badge>;
  if (["L1 Engineer", "L2 Technical Team", "L3 Advanced OEM Support"].includes(role)) return <Badge color="yellow">{role}</Badge>;
  if (role === "Warehouse Team") return <Badge color="teal">{role}</Badge>;
  if (role === "Accounts Team") return <Badge color="orange">{role}</Badge>;
  if (role === "Dealer") return <Badge color="blue">{role}</Badge>;
  if (role === "Distributor") return <Badge color="teal">{role}</Badge>;
  return <Badge color="gray">{role}</Badge>;
}

export function ActionBtns({
  small,
  onEdit,
  onDelete,
  disabled,
}: {
  small?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}) {
  const sz = small ? "w-6 h-6 text-xs" : "w-7 h-7 text-xs";
  const isEditDisabled = disabled || !onEdit;
  const isDeleteDisabled = disabled || !onDelete;
  return (
    <div className="flex gap-1.5 items-center justify-center">
      <button
        type="button"
        disabled={isEditDisabled}
        onClick={onEdit}
        className={`${sz} rounded border border-amber-200 bg-amber-100 text-amber-600 transition flex items-center justify-center ${
          isEditDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-amber-200"
        }`}
      >
        <IconPencil size={14} />
      </button>
      <button
        type="button"
        disabled={isDeleteDisabled}
        onClick={onDelete}
        className={`${sz} rounded border border-red-200 bg-red-100 text-red-500 transition flex items-center justify-center ${
          isDeleteDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-200"
        }`}
      >
        <IconTrash size={14} />
      </button>
    </div>
  );
}

export function SearchBar({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="relative w-full sm:w-auto">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <IconSearch size={14} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="pl-8 pr-4 py-2 text-sm bg-white border border-gray-200 rounded text-gray-700 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 w-full sm:w-52 transition shadow-sm"
      />
    </div>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {sub && <p className="text-gray-500 text-sm mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryBtn({ children, onClick, type, disabled }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit" | "reset"; disabled?: boolean }) {
  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={`w-full sm:w-auto justify-center px-4 py-2 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm transition shadow-md shadow-amber-200 flex items-center gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:from-amber-400 hover:to-orange-400'}`}
    >
      {children}
    </button>
  );
}

export function Table({ headers, children }: { headers: (string | ReactNode)[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-1 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TR({ children, zebra }: { children: ReactNode; zebra?: boolean }) {
  return (
    <tr className={`border-b border-gray-100 hover:bg-amber-50/50 transition ${zebra ? "bg-gray-50/50" : "bg-white"}`}>
      {children}
    </tr>
  );
}

export function TD({ children, className, colSpan }: { children: ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={`px-3 py-1 text-gray-700 ${className || ""}`}>{children}</td>;
}
