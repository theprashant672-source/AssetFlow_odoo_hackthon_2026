"use client";

import { assetHolderLabel } from "@/app/lib/store";
import { useDB, Panel, Button, Table, EmptyRow, Badge, StatusBadge } from "./shared";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsModule() {
  const db = useDB();

  const usage = db.assets
    .map((a) => ({
      asset: a,
      count: db.allocations.filter((al) => al.assetId === a.id).length +
        db.bookings.filter((b) => b.assetId === a.id && b.status !== "Cancelled").length,
    }))
    .sort((x, y) => y.count - x.count);
  const mostUsed = usage.slice(0, 5);
  const idle = usage.filter((u) => u.count === 0);

  const maintByCat = db.categories.map((c) => ({
    category: c.name,
    count: db.maintenance.filter((m) => {
      const a = db.assets.find((x) => x.id === m.assetId);
      return a?.categoryId === c.id;
    }).length,
  }));
  const maxMaint = Math.max(1, ...maintByCat.map((m) => m.count));

  const deptSummary = db.departments.map((d) => {
    const viaEmployees = db.assets.filter((a) => {
      if (a.status !== "Allocated") return false;
      if (a.holderDepartmentId === d.id) return true;
      const e = db.employees.find((x) => x.email === a.holderEmail);
      return e?.departmentId === d.id;
    });
    return { dept: d.name, count: viaEmployees.length };
  });

  const hours = Array.from({ length: 10 }, (_, i) => 9 + i);
  const heat = hours.map((h) => ({
    hour: h,
    count: db.bookings.filter((b) => {
      if (b.status === "Cancelled") return false;
      const s = new Date(b.start).getHours();
      const e = new Date(b.end).getHours() || 24;
      return h >= s && h < Math.max(e, s + 1);
    }).length,
  }));
  const maxHeat = Math.max(1, ...heat.map((x) => x.count));

  const exportAssets = () =>
    downloadCsv("assetflow-assets.csv", [
      ["Tag", "Name", "Category", "Status", "Holder", "Location", "Cost"],
      ...db.assets.map((a) => [
        a.tag, a.name,
        db.categories.find((c) => c.id === a.categoryId)?.name ?? "",
        a.status, assetHolderLabel(db, a), a.location, a.acquisitionCost,
      ]),
    ]);

  const exportAllocations = () =>
    downloadCsv("assetflow-allocations.csv", [
      ["Asset", "Holder", "Allocated", "Expected return", "Returned", "Notes"],
      ...db.allocations.map((al) => [
        db.assets.find((a) => a.id === al.assetId)?.tag ?? "",
        al.holderEmail ?? db.departments.find((d) => d.id === al.departmentId)?.name ?? "",
        al.allocatedAt.slice(0, 10), al.expectedReturn?.slice(0, 10) ?? "",
        al.returnedAt?.slice(0, 10) ?? "", al.checkinNotes ?? "",
      ]),
    ]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap justify-end gap-2">
        <Button tone="ghost" onClick={exportAssets}>Export assets CSV</Button>
        <Button tone="ghost" onClick={exportAllocations}>Export allocations CSV</Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Most-used assets" subtitle="By allocation + booking count.">
          <Table headers={["Asset", "Status", "Usage count"]}>
            {mostUsed.map(({ asset, count }) => (
              <tr key={asset.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{asset.name} <span className="text-xs text-slate-400">{asset.tag}</span></td>
                <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-[#9A528D]" style={{ width: `${Math.max(8, (count / Math.max(1, mostUsed[0]?.count ?? 1)) * 120)}px` }} />
                    <span className="text-sm font-bold">{count}</span>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </Panel>

        <Panel title="Idle assets" subtitle="Never allocated or booked — candidates for redeployment.">
          <Table headers={["Asset", "Status", "Location"]}>
            {idle.length === 0 && <EmptyRow span={3} message="No idle assets." />}
            {idle.slice(0, 6).map(({ asset }) => (
              <tr key={asset.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{asset.name} <span className="text-xs text-slate-400">{asset.tag}</span></td>
                <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                <td className="px-4 py-3">{asset.location}</td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Maintenance frequency by category" subtitle="Requests raised per asset category.">
          <div className="grid gap-2.5">
            {maintByCat.map((m) => (
              <div key={m.category} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm font-semibold text-slate-700">{m.category}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
                  <div
                    className="h-full rounded-lg bg-[linear-gradient(90deg,#9A528D,#b878ab)]"
                    style={{ width: `${(m.count / maxMaint) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-black text-slate-900">{m.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Department-wise allocation" subtitle="Currently allocated assets per department.">
          <div className="grid gap-2.5">
            {deptSummary.map((s) => (
              <div key={s.dept} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5">
                <span className="text-sm font-semibold text-slate-700">{s.dept}</span>
                <Badge tone={s.count > 0 ? "purple" : "slate"}>{s.count} asset{s.count === 1 ? "" : "s"}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Resource booking heatmap" subtitle="Peak usage windows across all bookable resources (by hour).">
        <div className="flex items-end gap-1.5 overflow-x-auto pb-1">
          {heat.map((h) => (
            <div key={h.hour} className="flex min-w-[44px] flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-[#9A528D] transition-all"
                style={{
                  height: `${16 + (h.count / maxHeat) * 90}px`,
                  opacity: h.count === 0 ? 0.15 : 0.35 + (h.count / maxHeat) * 0.65,
                }}
                title={`${h.count} booking(s)`}
              />
              <span className="text-[10px] font-bold text-slate-500">{h.hour}:00</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Assets nearing retirement" subtitle="Poor condition or flagged lifecycle states.">
        <Table headers={["Asset", "Condition", "Status", "Acquired"]}>
          {db.assets.filter((a) => a.condition === "Poor" || ["Retired", "Lost"].includes(a.status)).length === 0 && (
            <EmptyRow span={4} message="Nothing nearing retirement." />
          )}
          {db.assets
            .filter((a) => a.condition === "Poor" || ["Retired", "Lost"].includes(a.status))
            .map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{a.name} <span className="text-xs text-slate-400">{a.tag}</span></td>
                <td className="px-4 py-3">{a.condition}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">{a.acquisitionDate}</td>
              </tr>
            ))}
        </Table>
      </Panel>
    </div>
  );
}
