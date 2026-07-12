"use client";

import Link from "next/link";
import AssetFlowLogo from "../AssetFlowLogo";
import { ROLE_LABELS, ROLE_NAV, ROLE_HOME, sectionHref, type AssetFlowRole } from "@/app/lib/assetflow-roles";

export default function Sidebar({
  role,
  pathname,
  open,
  onClose,
}: {
  role: AssetFlowRole;
  pathname: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const navItems = ROLE_NAV[role];
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-slate-200/70 bg-[rgba(248,250,252,0.92)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-5">
          <AssetFlowLogo />
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            {ROLE_LABELS[role]}
          </div>
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const href = sectionHref(role, item.slug);
              const active = pathname === href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#5b3df5] text-white shadow-[0_14px_30px_rgba(91,61,245,0.25)]"
                      : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                  }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.group && <span className="text-[10px] font-semibold uppercase tracking-[0.24em] opacity-60">{item.group}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(91,61,245,0.12),rgba(255,255,255,0.9))] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">Next milestone</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {ROLE_HOME[role]} is your default landing page after login.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
