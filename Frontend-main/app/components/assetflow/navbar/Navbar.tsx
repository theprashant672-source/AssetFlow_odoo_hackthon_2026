"use client";

import { useEffect, useRef } from "react";
import { IconBell, IconMenu, IconMoon, IconSearch, IconSun, IconUser } from "@/app/components/icons/Icons";
import { ROLE_LABELS, type AssetFlowRole } from "@/app/lib/assetflow-roles";

export default function Navbar({
  role,
  onMenuClick,
  onLogout,
  onThemeToggle,
  theme,
  unseenCount = 0,
  onBellClick,
}: {
  role: AssetFlowRole;
  onMenuClick: () => void;
  onLogout: () => void;
  onThemeToggle: () => void;
  theme: "light" | "dark";
  unseenCount?: number;
  onBellClick?: () => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 px-3 pt-2.5 sm:px-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-[1320px] items-center gap-2.5 rounded-xl border border-white/70 bg-white/80 px-2.5 py-2 shadow-[0_12px_34px_rgba(39,22,33,0.08)] backdrop-blur-xl sm:px-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#9A528D]/30 hover:text-[#9A528D] lg:hidden"
          aria-label="Toggle sidebar"
        >
          <IconMenu size={18} />
        </button>

        <div className="hidden min-w-[150px] lg:block">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Asset management</div>
          <div className="mt-0.5 text-sm font-bold text-slate-900">Operations workspace</div>
        </div>

        <div className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 transition focus-within:border-[#9A528D]/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(154,82,141,0.12)] hover:border-slate-300">
          <IconSearch size={16} className="shrink-0 text-slate-400 transition group-focus-within:text-[#9A528D]" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Search assets, employees, departments..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 sm:block">
            Ctrl K
          </kbd>
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-odoo-50 hover:text-[#9A528D]"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
        </button>

        <button
          type="button"
          onClick={onBellClick}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-odoo-50 hover:text-[#9A528D]"
          aria-label="Notifications"
        >
          <IconBell size={18} />
          {unseenCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[9px] font-bold text-white ring-2 ring-white">
              {unseenCount > 9 ? "9+" : unseenCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="hidden items-center gap-2.5 rounded-lg bg-slate-100/80 px-2 py-1.5 text-left transition hover:bg-odoo-50 lg:flex"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#9A528D,#b878ab)] text-white">
            <IconUser size={16} />
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
