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
  tone: "violet" | "sky" | "emerald" | "amber";
}) {
  const toneClass =
    tone === "violet"
      ? "from-[#5b3df5] to-[#7c6af7]"
      : tone === "sky"
        ? "from-sky-500 to-cyan-500"
        : tone === "emerald"
          ? "from-emerald-500 to-lime-500"
          : "from-amber-500 to-orange-500";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className={`mb-4 h-2 w-16 rounded-full bg-gradient-to-r ${toneClass}`} />
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-900">{value}</div>
      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <IconArrowUpRight size={13} />
        {delta}
      </div>
    </div>
  );
}
