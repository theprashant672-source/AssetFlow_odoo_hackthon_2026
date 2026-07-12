export default function DepartmentChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const max = Math.max(...data.map((item) => item.value));

  return (
    <div className="grid gap-4">
      {data.map((item) => {
        const width = Math.max((item.value / max) * 100, 8);
        return (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-700">{item.label}</div>
              <div className="text-sm font-black text-slate-900">{item.value.toLocaleString()}</div>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${width}%`, background: `linear-gradient(90deg, ${item.color}, rgba(91,61,245,0.28))` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
