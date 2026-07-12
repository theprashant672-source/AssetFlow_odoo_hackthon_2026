export default function AssetStatusChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = data.reduce<Array<{ color: string; start: number; end: number }>>((acc, item) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    const end = start + (item.value / total) * 100;
    acc.push({ color: item.color, start, end });
    return acc;
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="flex items-center justify-center">
        <div
          className="relative h-56 w-56 rounded-full shadow-[inset_0_0_0_14px_rgba(255,255,255,0.8)]"
          style={{
            background: `conic-gradient(${segments.map((item) => `${item.color} ${item.start}% ${item.end}%`).join(",")})`,
          }}
        >
          <div className="absolute inset-10 rounded-full bg-white/90 backdrop-blur flex flex-col items-center justify-center text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Total assets</div>
            <div className="mt-2 text-4xl font-black tracking-tight text-slate-900">{total.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 self-center">
        {data.map((item) => {
          const percent = Math.round((item.value / total) * 100);
          return (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{percent}%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
