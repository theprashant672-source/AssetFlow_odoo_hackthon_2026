import Link from "next/link";
import { IconArrowLeft, IconPlus } from "../icons/Icons";

export default function ModulePage({
  title,
  subtitle,
  backHref = "/dashboard",
  actionLabel,
}: {
  title: string;
  subtitle: string;
  backHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="glass-panel soft-shadow rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-[#9A528D]/30 hover:text-[#9A528D]"
          >
            <IconArrowLeft size={14} />
            Back to dashboard
          </Link>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#9A528D] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(154,82,141,0.26)] transition hover:brightness-110">
            <IconPlus size={16} />
            Create entry
          </button>
          {actionLabel && (
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5b3df5] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_30px_rgba(91,61,245,0.26)] transition hover:brightness-110">
              <IconPlus size={16} />
              {actionLabel}
            </button>
          )}
        </div>
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
        Use this workspace to review records, update details, and manage operational actions.
      </div>
    </section>
  );
}
