import type { InputHTMLAttributes } from "react";

export default function TextField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#5b3df5] focus:ring-4 focus:ring-[#5b3df5]/10"
      />
      {error && <span className="text-xs font-medium text-[#ef4444]">{error}</span>}
    </label>
  );
}
