export default function RecentAssetsTable({
  rows,
}: {
  rows: Array<{
    tag: string;
    name: string;
    category: string;
    location: string;
    status: string;
    condition: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.22em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Asset Tag</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Condition</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.tag} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 font-semibold text-slate-900">{row.tag}</td>
              <td className="px-4 py-3 text-slate-700">{row.name}</td>
              <td className="px-4 py-3 text-slate-600">{row.category}</td>
              <td className="px-4 py-3 text-slate-600">{row.location}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{row.condition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
