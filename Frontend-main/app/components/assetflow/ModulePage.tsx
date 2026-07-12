import Link from "next/link";
import { IconArrowLeft, IconPlus } from "../icons/Icons";

export default function ModulePage({
  title,
  subtitle,
  backHref = "/dashboard",
}: {
  title: string;
  subtitle: string;
  backHref?: string;
}) {
  return (
    <section className="glass-panel soft-shadow rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#5b3df5]/30 hover:text-[#5b3df5]"
          >
            <IconArrowLeft size={14} />
            Back to dashboard
          </Link>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{subtitle}</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5b3df5] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(91,61,245,0.26)] transition hover:brightness-110">
          <IconPlus size={16} />
          Create entry
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[
          { label: "Records", value: "128" },
          { label: "Active", value: "94" },
          { label: "Pending", value: "18" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{item.label}</div>
            <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-300 bg-white/50 p-10 text-center text-sm leading-7 text-slate-600">
        This module is scaffolded and ready for the next milestone. We will plug in tables, forms, filters,
        and API integration after the dashboard foundation is approved.
      </div>
    </section>
  );
}
