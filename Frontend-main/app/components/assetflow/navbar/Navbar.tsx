"use client";

import AssetFlowLogo from "../AssetFlowLogo";
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
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[rgba(248,250,252,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#5b3df5]/30 hover:text-[#5b3df5] lg:hidden"
          aria-label="Toggle sidebar"
        >
          <IconMenu size={18} />
        </button>

        <div className="hidden lg:block">
          <AssetFlowLogo compact />
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#5b3df5]/30 hover:text-[#5b3df5]"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
        </button>

        <button
          type="button"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#5b3df5]/30 hover:text-[#5b3df5]"
          aria-label="Notifications"
        >
          <IconBell size={18} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white" />
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="hidden items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-[#5b3df5]/30 hover:shadow-md lg:flex"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#5b3df5,#7c6af7)] text-white">
            <IconUser size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{ROLE_LABELS[role]}</div>
            <div className="text-xs text-slate-500">AssetFlow workspace</div>
          </div>
        </button>
      </div>
    </header>
  );
}
