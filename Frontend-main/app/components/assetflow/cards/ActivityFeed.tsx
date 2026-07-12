export default function ActivityFeed({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    time: string;
    tone: string;
  }>;
}) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone}`} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-bold text-slate-900">{item.title}</div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.time}</div>
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600">{item.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
