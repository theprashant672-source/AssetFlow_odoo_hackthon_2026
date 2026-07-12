"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AssetFlowLogo from "../AssetFlowLogo";
import { IconLogout } from "@/app/components/icons/Icons";
import { ROLE_LABELS, ROLE_NAV, sectionHref, type AssetFlowRole } from "@/app/lib/assetflow-roles";

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
  const router = useRouter();
  const navItems = ROLE_NAV[role];

  const handleLogout = () => {
    document.cookie = "assetflow_session=; path=/; max-age=0;";
    document.cookie = "assetflow_role=; path=/; max-age=0;";
    document.cookie = "assetflow_identity=; path=/; max-age=0;";
    document.cookie = "assetflow_auth_method=; path=/; max-age=0;";
    document.cookie = "assetflow_company=; path=/; max-age=0;";
    router.push("/login");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#271621] px-3 py-3 text-white shadow-[16px_0_45px_rgba(39,22,33,0.12)] transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <AssetFlowLogo />
        </div>

        <div className="mx-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">Active workspace</div>
          <div className="mt-1 text-sm font-bold text-white">{ROLE_LABELS[role]}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-6">
          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
            Navigation
          </div>
          <nav className="grid gap-1.5">
            {navItems.map((item) => {
              const href = sectionHref(role, item.slug);
              const active = pathname === href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  onClick={onClose}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active
                      ? "bg-[#9A528D] text-white shadow-[0_12px_26px_rgba(154,82,141,0.35)]"
                      : "text-white/65 hover:bg-white/[0.09] hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-300/80 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <IconLogout size={18} />
            <span className="flex-1 text-left">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
