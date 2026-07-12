import { IconArrowUpRight } from "@/app/components/icons/Icons";

export default function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: "violet" | "sky" | "emerald" | "amber" | "rose";
}) {
  const toneClass =
    tone === "violet"
      ? "from-[#9A528D] to-[#b878ab]"
      : tone === "sky"
        ? "from-odoo-500 to-odoo-500"
        : tone === "emerald"
          ? "from-emerald-500 to-lime-500"
          : tone === "rose"
            ? "from-rose-500 to-red-500"
            : "from-amber-500 to-orange-500";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-3.5 shadow-sm">
      <div className={`mb-3 h-1.5 w-12 rounded-full bg-gradient-to-r ${toneClass}`} />
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-1.5 text-xl font-black tracking-tight text-slate-900">{value}</div>
      <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        <IconArrowUpRight size={13} />
        {delta}
      </div>
    </div>
  );
}
