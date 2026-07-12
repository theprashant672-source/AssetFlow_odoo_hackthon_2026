"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconArrowUpRight, IconSparkles } from "@/app/components/icons/Icons";
import { sectionHref, type AssetFlowRole, type AssetFlowSection } from "@/app/lib/assetflow-roles";

type GuideStep = {
  title: string;
  desc: string;
  slug: AssetFlowSection;
  action: string;
};

const GUIDE_STEPS: Record<AssetFlowRole, GuideStep[]> = {
  founder: [
    { title: "Set up the organization", desc: "Create departments, asset categories, and add employees with their roles.", slug: "organization", action: "Open Organization" },
    { title: "Register your assets", desc: "Add every laptop, vehicle or machine with its tag, category and location.", slug: "assets", action: "Open Assets" },
    { title: "Print QR labels", desc: "From Assets, download QR labels and stick them on devices — anyone can scan to identify.", slug: "assets", action: "Get QR labels" },
    { title: "Allocate & book", desc: "Hand assets to people or book them for time slots — approvals happen here.", slug: "bookings", action: "Open Bookings" },
    { title: "Handle maintenance", desc: "Raise repair issues — AI suggests the priority. Resolve them when fixed.", slug: "maintenance", action: "Open Maintenance" },
    { title: "Watch the analytics", desc: "Charts show utilization, repair costs and AI alerts for failing assets.", slug: "analytics", action: "Open Analytics" },
  ],
  admin: [
    { title: "Set up the organization", desc: "Create departments, asset categories, and add employees.", slug: "organization", action: "Open Organization" },
    { title: "Register your assets", desc: "Add equipment with tag, category and location — the single source of truth.", slug: "assets", action: "Open Assets" },
    { title: "Print QR labels", desc: "Download QR labels from Assets and stick them on devices.", slug: "assets", action: "Get QR labels" },
    { title: "Allocate & book", desc: "Assign assets to people or book them for time slots.", slug: "bookings", action: "Open Bookings" },
    { title: "Handle maintenance", desc: "Track repair requests from raised to resolved — AI helps triage.", slug: "maintenance", action: "Open Maintenance" },
    { title: "Review reports", desc: "Export PDF reports for inventory and maintenance any time.", slug: "reports", action: "Open Reports" },
  ],
  head: [
    { title: "Check department assets", desc: "See every asset your department owns and who holds it.", slug: "department-assets", action: "View assets" },
    { title: "Review requests", desc: "Approve or reject allocation requests raised by your team.", slug: "approvals", action: "Open Approvals" },
    { title: "Manage your team", desc: "Keep the employee directory of your department up to date.", slug: "employees", action: "Open Employees" },
    { title: "Book shared resources", desc: "Reserve meeting rooms or equipment for your team.", slug: "bookings", action: "Open Bookings" },
    { title: "Track reports", desc: "See utilization and allocation summaries for your department.", slug: "reports", action: "Open Reports" },
    { title: "Stay notified", desc: "Live alerts arrive here the moment something needs you.", slug: "notifications", action: "Open Notifications" },
  ],
  manager: [
    { title: "Register your assets", desc: "Add new equipment with tag, category and location.", slug: "assets", action: "Open Assets" },
    { title: "Allocate to people", desc: "Hand assets over with clear return dates and history.", slug: "allocation", action: "Open Allocation" },
    { title: "Approve transfers", desc: "Review transfer requests between people and departments.", slug: "transfers", action: "Open Transfers" },
    { title: "Manage bookings", desc: "Time-slot bookings with overlap checks handled for you.", slug: "bookings", action: "Open Bookings" },
    { title: "Run maintenance", desc: "Raise and resolve repairs — AI suggests priority automatically.", slug: "maintenance", action: "Open Maintenance" },
    { title: "Export reports", desc: "One-click PDF reports for audits and reviews.", slug: "reports", action: "Open Reports" },
  ],
  employee: [
    { title: "See your assets", desc: "Everything assigned to you — laptops, phones, equipment — lives here.", slug: "my-assets", action: "My Assets" },
    { title: "Book a resource", desc: "Need a meeting room or a projector? Book a time slot.", slug: "bookings", action: "Open Bookings" },
    { title: "Report a problem", desc: "Something broken? Raise a maintenance request — AI sets the priority.", slug: "maintenance", action: "Raise request" },
    { title: "Follow notifications", desc: "Live updates about your requests and returns arrive here.", slug: "notifications", action: "Open Notifications" },
  ],
};

export default function WorkspaceGuide({ role }: { role: AssetFlowRole }) {
  const storageKey = `assetflow_guide_hidden_${role}`;
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const steps = GUIDE_STEPS[role];

  if (hidden) {
    return (
      <button
        onClick={() => {
          localStorage.removeItem(storageKey);
          setHidden(false);
        }}
        className="inline-flex w-fit items-center gap-2 rounded-full border border-[#9A528D]/25 bg-[#f6ecf4] px-4 py-2 text-xs font-bold text-[#9A528D] transition hover:bg-[#efdceb] hover:shadow-sm"
      >
        <IconSparkles size={14} /> Show &quot;How this workspace works&quot; guide
      </button>
    );
  }

  return (
    <section className="rounded-2xl border border-[#9A528D]/20 bg-gradient-to-br from-[#faf2f8] to-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#9A528D]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9A528D]">
            <IconSparkles size={13} /> New here? Start with this
          </div>
          <h2 className="mt-3 text-lg font-black tracking-tight text-slate-900">How this workspace works</h2>
          <p className="mt-1 text-sm text-slate-500">Follow these steps in order — each card takes you to the right page.</p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem(storageKey, "1");
            setHidden(true);
          }}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          Hide guide ×
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, index) => (
          <Link
            key={step.title}
            href={sectionHref(role, step.slug)}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#9A528D]/40 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#341d2d] text-[11px] font-black text-white">
                {index + 1}
              </span>
              <span className="text-sm font-bold text-slate-900">{step.title}</span>
            </div>
            <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">{step.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#9A528D] opacity-70 transition group-hover:opacity-100">
              {step.action} <IconArrowUpRight size={12} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
