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
        <div key={item.title} className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className={`mt-1 h-3 w-3 rounded-full ${item.tone}`} />
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
