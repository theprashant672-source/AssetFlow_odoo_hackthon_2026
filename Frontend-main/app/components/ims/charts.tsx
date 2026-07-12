"use client";

export function LineChart({
  months,
  raw,
  manufactured,
  sales,
}: {
  months: string[];
  raw: readonly number[];
  manufactured: readonly number[];
  sales: readonly number[];
}) {
  const W = 700, H = 200, PAD = 40;
  const allVals = [...raw, ...manufactured, ...sales];
  const maxV = Math.max(1, ...allVals);
  const pts = (data: readonly number[]) =>
    data.map((v, i) => ({
      x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
      y: PAD + (1 - v / maxV) * (H - PAD * 2),
    }));
  const polyline = (data: readonly number[], color: string) => {
    const p = pts(data);
    const d = p.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`).join(" ");
    return <path d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />;
  };
  const area = (data: readonly number[], color: string) => {
    const p = pts(data);
    const d = [`M ${p[0].x} ${H - PAD}`, ...p.map((pt) => `L ${pt.x} ${pt.y}`), `L ${p[p.length - 1].x} ${H - PAD}`, "Z"].join(" ");
    return <path d={d} fill={color} fillOpacity={0.08} />;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={PAD} x2={W - PAD} y1={PAD + (1 - f) * (H - PAD * 2)} y2={PAD + (1 - f) * (H - PAD * 2)} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {area(raw, "#3b82f6")}
      {area(manufactured, "#f59e0b")}
      {area(sales, "#10b981")}
      {polyline(raw, "#3b82f6")}
      {polyline(manufactured, "#f59e0b")}
      {polyline(sales, "#10b981")}
      {pts(raw).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#3b82f6" stroke="white" strokeWidth={1.5} />)}
      {pts(sales).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#10b981" stroke="white" strokeWidth={1.5} />)}
      {months.map((m, i) => (
        <text key={`${m}-${i}`} x={PAD + (i / (months.length - 1)) * (W - PAD * 2)} y={H - 4} textAnchor="middle" fill="#9ca3af" fontSize={11}>{m}</text>
      ))}
    </svg>
  );
}

export function DonutChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const palette: Record<string, string> = {
    "Open at NovaAssets": "#3b82f6",
    "In Progress at NovaAssets": "#84cc16",
    "Resolved by NovaAssets": "#d1d5db",
    "Pending with Suppliers": "#f59e0b",
    "Resolved by Suppliers": "#06b6d4",
  };

  const withColors = data.map((d) => ({ ...d, color: palette[d.label] || "#9ca3af" }));
  const total = withColors.reduce((s, d) => s + d.value, 0);
  if (total <= 0) {
    return (
      <div className="flex gap-4 items-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-400">
          No data
        </div>
      </div>
    );
  }

  const R = 60, cx = 80, cy = 80, stroke = 28;
  const segments = withColors.map((d, idx) => {
    const before = withColors.slice(0, idx).reduce((s, x) => s + x.value, 0);
    const start = (before / total) * 360;
    const sweep = (d.value / total) * 360;
    const s = (start - 90) * (Math.PI / 180);
    const e = (start + sweep - 90) * (Math.PI / 180);
    const x1 = cx + R * Math.cos(s), y1 = cy + R * Math.sin(s);
    const x2 = cx + R * Math.cos(e), y2 = cy + R * Math.sin(e);
    const lg = sweep > 180 ? 1 : 0;
    return { ...d, path: `M ${x1} ${y1} A ${R} ${R} 0 ${lg} 1 ${x2} ${y2}` };
  });
  return (
    <div className="flex gap-4 items-center">
      <svg viewBox="0 0 160 160" className="w-32 h-32 shrink-0">
        {segments.map((seg, i) => (
          <path key={i} d={seg.path} fill="none" stroke={seg.color} strokeWidth={stroke} strokeLinecap="butt" />
        ))}
        <circle cx={cx} cy={cy} r={R - stroke / 2 - 2} fill="white" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#111827" fontSize={20} fontWeight="bold">{total}</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {withColors.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-gray-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TicketTrendChart({
  labels,
  created,
  completed,
}: {
  labels: string[];
  created: readonly number[];
  completed: readonly number[];
}) {
  const W = 700;
  const H = 220;
  const PAD = 42;
  const allVals = [...created, ...completed];
  const maxV = Math.max(1, ...allVals);
  const points = (data: readonly number[]) => data.map((value, index) => ({
    x: PAD + (index / Math.max(1, data.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - value / maxV) * (H - PAD * 2),
  }));
  const line = (data: readonly number[], color: string) => {
    const pts = points(data);
    const d = pts.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    return <path d={d} fill="none" stroke={color} strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round" />;
  };
  const area = (data: readonly number[], color: string) => {
    const pts = points(data);
    if (!pts.length) return null;
    const d = [`M ${pts[0].x} ${H - PAD}`, ...pts.map((pt) => `L ${pt.x} ${pt.y}`), `L ${pts[pts.length - 1].x} ${H - PAD}`, "Z"].join(" ");
    return <path d={d} fill={color} fillOpacity={0.08} />;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((fraction) => (
        <line key={fraction} x1={PAD} x2={W - PAD} y1={PAD + (1 - fraction) * (H - PAD * 2)} y2={PAD + (1 - fraction) * (H - PAD * 2)} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      {area(created, "#f59e0b")}
      {area(completed, "#10b981")}
      {line(created, "#f59e0b")}
      {line(completed, "#10b981")}
      {points(created).map((point, index) => (
        <circle key={`created-${index}`} cx={point.x} cy={point.y} r={3.25} fill="#f59e0b" stroke="white" strokeWidth={1.5} />
      ))}
      {points(completed).map((point, index) => (
        <circle key={`completed-${index}`} cx={point.x} cy={point.y} r={3.25} fill="#10b981" stroke="white" strokeWidth={1.5} />
      ))}
      {labels.map((label, index) => (
        <text key={`${label}-${index}`} x={PAD + (index / Math.max(1, labels.length - 1)) * (W - PAD * 2)} y={H - 6} textAnchor="middle" fill="#9ca3af" fontSize={11}>
          {label}
        </text>
      ))}
    </svg>
  );
}
