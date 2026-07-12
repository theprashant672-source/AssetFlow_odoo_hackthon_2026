"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  registerAsset, allocateAsset, updateAssetStatus, assetHolderLabel, currentUserEmail, findEmployee,
  type Asset, type AssetStatus,
} from "@/app/lib/store";
import AssetQrModal from "../assets/AssetQrModal";
import { exportAssetReportPdf, exportQrLabelsPdf } from "@/app/lib/assetflowPdf";
import { useDB, Panel, Button, Field, inputCls, Table, EmptyRow, StatusBadge, Badge, fmtDate, fmtDateTime } from "./shared";

const ALL_STATUSES: AssetStatus[] = [
  "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed",
];

export default function AssetsModule({ canRegister = true, scope = "all" }: {
  canRegister?: boolean; scope?: "all" | "mine";
}) {
  const db = useDB();
  const me = currentUserEmail();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [selected, setSelected] = useState<Asset | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [qrAsset, setQrAsset] = useState<Asset | null>(null);
  const [exportingLabels, setExportingLabels] = useState(false);

  const toPdfRow = (a: Asset) => ({
    id: a.id,
    tag: a.tag,
    name: a.name,
    categoryName: db.categories.find((c) => c.id === a.categoryId)?.name ?? "—",
    departmentName: assetHolderLabel(db, a),
    location: a.location,
    status: a.status,
    condition: a.condition,
  });

  const assets = useMemo(() => {
    let list = db.assets;
    if (scope === "mine") {
      list = list.filter((a) => a.holderEmail?.toLowerCase() === me.toLowerCase());
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((a) =>
        [a.name, a.tag, a.serialNumber, a.location].some((v) => v.toLowerCase().includes(q))
      );
    }
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    if (catFilter) list = list.filter((a) => a.categoryId === catFilter);
    return list;
  }, [db, query, statusFilter, catFilter, scope, me]);

  const availableCount = db.assets.filter((asset) => asset.status === "Available").length;
  const allocatedCount = db.assets.filter((asset) => asset.status === "Allocated").length;

  return (
    <div className="grid gap-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-odoo-100 bg-[linear-gradient(120deg,#fff_0%,#fbf5f9_55%,#f4e8f1_100%)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-odoo-600">Asset register</div>
          <p className="mt-1 text-sm leading-6 text-slate-600">Track equipment, ownership, location, and lifecycle status from one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Metric label="Available" value={availableCount} tone="text-emerald-700" />
          <Metric label="Allocated" value={allocatedCount} tone="text-odoo-700" />
          {(canRegister || scope === "mine") && (
            <Button onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "Register asset"}</Button>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/scan"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-odoo-300 hover:text-odoo-700"
        >
          📷 Scan QR
        </Link>
        <Button
          tone="ghost"
          disabled={assets.length === 0 || exportingLabels}
          onClick={async () => {
            if (assets.length === 0 || exportingLabels) return;
            setExportingLabels(true);
            try {
              await exportQrLabelsPdf(assets.map(toPdfRow), window.location.origin);
            } finally {
              setExportingLabels(false);
            }
          }}
        >
          🏷️ {exportingLabels ? "Preparing…" : "QR Labels PDF"}
        </Button>
        <Button
          tone="ghost"
          disabled={assets.length === 0}
          onClick={() => exportAssetReportPdf(assets.map(toPdfRow))}
        >
          📄 Export PDF
        </Button>
        <span className="text-xs font-medium text-slate-400">
          Print labels, stick them on assets — scan with any phone to open details.
        </span>
      </div>

      {qrAsset && (
        <AssetQrModal
          asset={{ id: qrAsset.id, tag: qrAsset.tag, name: qrAsset.name, location: qrAsset.location }}
          onClose={() => setQrAsset(null)}
        />
      )}

      {showForm && (canRegister || scope === "mine") && <RegisterForm scope={scope} onDone={() => setShowForm(false)} />}

      <Panel
        title={scope === "mine" ? "My assets" : "Asset directory"}
        subtitle={scope === "mine" ? "Assets currently allocated to you." : `${assets.length} matching asset${assets.length === 1 ? "" : "s"} in the register.`}
      >
        <div className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-3 sm:grid-cols-3">
          <input
            className={inputCls}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AF-0001, serial, name…"
          />
          <select className={inputCls} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All lifecycle statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className={inputCls} value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">All asset categories</option>
            {db.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <Table headers={["Tag", "Asset", "Category", "Location", "Holder", "Status", "Details"]}>
          {assets.length === 0 && <EmptyRow span={7} message="No assets match the selected filters." />}
          {assets.map((a) => {
            const cat = db.categories.find((c) => c.id === a.categoryId);
            return (
              <tr key={a.id} className="transition hover:bg-odoo-50/40">
                <td className="px-4 py-3 font-mono text-xs font-bold text-odoo-700">{a.tag}</td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {a.name}
                  {a.bookable && <span className="ml-2"><Badge tone="purple">Bookable</Badge></span>}
                </td>
                <td className="px-4 py-3">{cat?.name ?? "—"}</td>
                <td className="px-4 py-3">{a.location}</td>
                <td className="px-4 py-3">{assetHolderLabel(db, a)}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button tone="ghost" onClick={() => setQrAsset(a)}>QR</Button>
                    <Button tone="ghost" onClick={() => setSelected(selected?.id === a.id ? null : a)}>
                      {selected?.id === a.id ? "Close" : "Open"}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>

      {selected && <AssetDetail asset={db.assets.find((a) => a.id === selected.id) ?? selected} canRegister={canRegister} />}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className={`mt-0.5 text-lg font-black ${tone}`}>{value}</div>
    </div>
  );
}

function RegisterForm({ onDone, scope }: { onDone: () => void; scope?: "all" | "mine" }) {
  const db = useDB();
  const me = currentUserEmail();
  const [form, setForm] = useState({
    name: "", categoryId: db.categories[0]?.id ?? "", serialNumber: "",
    acquisitionDate: new Date().toISOString().slice(0, 10),
    acquisitionCost: "", condition: "New" as Asset["condition"],
    location: "", bookable: false,
  });
  const [err, setErr] = useState("");

  const submit = () => {
    if (!form.name.trim() || !form.serialNumber.trim() || !form.location.trim()) {
      setErr("Name, serial number and location are required.");
      return;
    }
    const assetId = registerAsset(
      {
        name: form.name.trim(),
        categoryId: form.categoryId,
        serialNumber: form.serialNumber.trim(),
        acquisitionDate: form.acquisitionDate,
        acquisitionCost: Number(form.acquisitionCost) || 0,
        condition: form.condition,
        location: form.location.trim(),
        bookable: form.bookable,
      },
      me
    );
    
    if (scope === "mine") {
      allocateAsset(assetId, { holderEmail: me }, undefined, me);
    }
    
    onDone();
  };

  return (
    <Panel title="Register asset" subtitle="Asset tag is auto-generated (AF-XXXX); it enters the registry as Available.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Name">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dell Monitor 27&quot;" />
        </Field>
        <Field label="Category">
          <select className={inputCls} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            {db.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Serial number">
          <input className={inputCls} value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} placeholder="SN-2044" />
        </Field>
        <Field label="Acquisition date">
          <input type="date" className={inputCls} value={form.acquisitionDate} onChange={(e) => setForm({ ...form, acquisitionDate: e.target.value })} />
        </Field>
        <Field label="Acquisition cost (₹ — reports only)">
          <input type="number" className={inputCls} value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} placeholder="45000" />
        </Field>
        <Field label="Condition">
          <select className={inputCls} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value as Asset["condition"] })}>
            {["New", "Good", "Fair", "Poor"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="HQ Floor 2" />
        </Field>
        <label className="flex items-end gap-2 pb-1">
          <input type="checkbox" checked={form.bookable} onChange={(e) => setForm({ ...form, bookable: e.target.checked })} className="h-4 w-4 accent-[#9A528D]" />
          <span className="text-sm font-semibold text-slate-700">Shared / bookable resource</span>
        </label>
      </div>
      {err && <div className="mt-3 text-sm font-medium text-red-600">{err}</div>}
      <div className="mt-4">
        <Button onClick={submit}>Register asset</Button>
      </div>
    </Panel>
  );
}

function AssetDetail({ asset, canRegister }: { asset: Asset; canRegister: boolean }) {
  const db = useDB();
  const history = db.allocations.filter((al) => al.assetId === asset.id);
  const repairs = db.maintenance.filter((m) => m.assetId === asset.id);

  return (
    <Panel
      title={`${asset.name} — ${asset.tag}`}
      subtitle={`Serial ${asset.serialNumber} · Acquired ${fmtDate(asset.acquisitionDate)} · ₹${asset.acquisitionCost.toLocaleString()} · ${asset.condition} condition`}
      actions={
        canRegister ? (
          <div className="flex flex-wrap gap-2">
            {(["Available", "Reserved", "Retired", "Disposed", "Lost"] as AssetStatus[])
              .filter((s) => s !== asset.status && asset.status !== "Allocated")
              .slice(0, 4)
              .map((s) => (
                <Button key={s} tone="ghost" onClick={() => updateAssetStatus(asset.id, s, currentUserEmail())}>
                  Mark {s}
                </Button>
              ))}
          </div>
        ) : undefined
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={asset.status} />
        <span className="text-sm text-slate-500">Location: <b className="text-slate-800">{asset.location}</b></span>
        {asset.holderEmail && (
          <span className="text-sm text-slate-500">
            Holder: <b className="text-slate-800">{findEmployee(db, asset.holderEmail)?.name ?? asset.holderEmail}</b>
          </span>
        )}
        {asset.expectedReturn && (
          <span className="text-sm text-slate-500">Expected return: <b className="text-slate-800">{fmtDate(asset.expectedReturn)}</b></span>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">Allocation history</h3>
          <Table headers={["Holder", "From", "Returned", "Notes"]}>
            {history.length === 0 && <EmptyRow span={4} message="Never allocated." />}
            {history.map((h) => (
              <tr key={h.id}>
                <td className="px-4 py-3">{h.holderEmail ?? db.departments.find((d) => d.id === h.departmentId)?.name ?? "—"}</td>
                <td className="px-4 py-3">{fmtDate(h.allocatedAt)}</td>
                <td className="px-4 py-3">{h.returnedAt ? fmtDate(h.returnedAt) : <Badge tone="purple">active</Badge>}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{h.checkinNotes ?? "—"}</td>
              </tr>
            ))}
          </Table>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">Maintenance history</h3>
          <Table headers={["Issue", "Raised", "Status"]}>
            {repairs.length === 0 && <EmptyRow span={3} message="No maintenance records." />}
            {repairs.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">{m.issue}</td>
                <td className="px-4 py-3">{fmtDateTime(m.raisedAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.status === "Resolved" ? "green" : m.status === "Rejected" ? "red" : "amber"}>{m.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </Panel>
  );
}
