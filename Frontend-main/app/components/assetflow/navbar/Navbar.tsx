"use client";

import { IconBell, IconMenu, IconMoon, IconSearch, IconSun, IconUser } from "@/app/components/icons/Icons";
import { ROLE_LABELS, type AssetFlowRole } from "@/app/lib/assetflow-roles";

export default function Navbar({
  role,
  onMenuClick,
  onLogout,
  onThemeToggle,
  theme,
}: {
  role: AssetFlowRole;
  onMenuClick: () => void;
  onLogout: () => void;
  onThemeToggle: () => void;
  theme: "light" | "dark";
}) {
  return (
    <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1480px] items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-[0_12px_34px_rgba(39,22,33,0.08)] backdrop-blur-xl sm:px-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#9A528D]/30 hover:text-[#9A528D] lg:hidden"
          aria-label="Toggle sidebar"
        >
          <IconMenu size={18} />
        </button>

        <div className="hidden min-w-[150px] lg:block">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Asset management</div>
          <div className="mt-0.5 text-sm font-bold text-slate-900">Operations workspace</div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-100/80 px-3.5 py-2.5">
          <IconSearch size={18} className="text-slate-400" />
          <input
            type="search"
            placeholder="Search assets, employees, departments..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-odoo-50 hover:text-[#9A528D]"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
        </button>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-odoo-50 hover:text-[#9A528D]"
          aria-label="Notifications"
        >
          <IconBell size={18} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white" />
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="hidden items-center gap-3 rounded-xl bg-slate-100/80 px-2.5 py-2 text-left transition hover:bg-odoo-50 lg:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9A528D,#b878ab)] text-white">
            <IconUser size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{ROLE_LABELS[role]}</div>
            <div className="text-xs text-slate-500">Account menu</div>
          </div>
        </button>
      </div>
    </header>
  );
}
