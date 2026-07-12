"use client";

import { useState } from "react";
import { createAuditCycle, markAuditItem, closeAuditCycle, currentUserEmail, type AuditItemResult } from "@/app/lib/store";
import { useDB, Panel, Button, Field, inputCls, Table, EmptyRow, Badge, Alert, fmtDate } from "./shared";

const RESULT_TONE: Record<AuditItemResult, string> = {
  Pending: "slate", Verified: "green", Missing: "red", Damaged: "orange",
};

export default function AuditModule({ canManage = true }: { canManage?: boolean }) {
  const db = useDB();
  const me = currentUserEmail();

  const [name, setName] = useState("");
  const [scope, setScope] = useState("");
  const [auditor, setAuditor] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [openCycle, setOpenCycle] = useState<string | null>(db.audits.find((a) => a.status === "Open")?.id ?? null);

  const locations = Array.from(new Set(db.assets.map((a) => a.location)));

  const create = () => {
    setMsg(null);
    if (!name.trim() || !auditor || !endDate) {
      setMsg({ kind: "error", text: "Cycle name, auditor and end date are required." });
      return;
    }
    const assetIds = db.assets
      .filter((a) => (location ? a.location === location : true))
      .filter((a) => !["Disposed"].includes(a.status))
      .map((a) => a.id);
    if (assetIds.length === 0) { setMsg({ kind: "error", text: "No assets in that scope." }); return; }
    createAuditCycle(
      { name: name.trim(), scope: scope.trim() || location || "Organization-wide", startDate, endDate, auditors: [auditor], assetIds },
      me
    );
    setName(""); setScope(""); setAuditor(""); setEndDate(""); setLocation("");
    setMsg({ kind: "success", text: `Audit cycle created with ${assetIds.length} assets.` });
  };

  return (
    <div className="grid gap-5">
      {canManage && (
        <Panel title="Create audit cycle" subtitle="Scope by location, assign auditors, set the window.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Cycle name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 HQ Audit" />
            </Field>
            <Field label="Scope (location)">
              <select className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="">All locations</option>
                {locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Auditor">
              <select className={inputCls} value={auditor} onChange={(e) => setAuditor(e.target.value)}>
                <option value="">— select —</option>
                {db.employees.filter((e) => e.status === "Active").map((e) => (
                  <option key={e.id} value={e.email}>{e.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Start date">
              <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Field>
            <Field label="End date">
              <input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Field>
          </div>
          <div className="mt-4"><Button onClick={create}>Create cycle</Button></div>
          {msg && <div className="mt-3"><Alert kind={msg.kind}>{msg.text}</Alert></div>}
        </Panel>
      )}

      <Panel title="Audit cycles" subtitle="Open a cycle to verify assets and view its discrepancy report.">
        <Table headers={["Cycle", "Scope", "Window", "Auditors", "Progress", "Status", "Open"]}>
          {db.audits.length === 0 && <EmptyRow span={7} message="No audit cycles yet." />}
          {db.audits.map((c) => {
            const done = c.items.filter((i) => i.result !== "Pending").length;
            return (
              <tr key={c.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                <td className="px-4 py-3">{c.scope}</td>
                <td className="px-4 py-3 text-xs">{fmtDate(c.startDate)} → {fmtDate(c.endDate)}</td>
                <td className="px-4 py-3 text-xs">{c.auditors.join(", ")}</td>
                <td className="px-4 py-3">{done}/{c.items.length}</td>
                <td className="px-4 py-3">
                  <Badge tone={c.status === "Open" ? "purple" : "slate"}>{c.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Button tone="ghost" onClick={() => setOpenCycle(openCycle === c.id ? null : c.id)}>
                    {openCycle === c.id ? "Hide" : "Open"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>

      {openCycle && <CycleDetail cycleId={openCycle} canManage={canManage} />}
    </div>
  );
}

function CycleDetail({ cycleId, canManage }: { cycleId: string; canManage: boolean }) {
  const db = useDB();
  const me = currentUserEmail();
  const cycle = db.audits.find((c) => c.id === cycleId);
  if (!cycle) return null;

  const discrepancies = cycle.items.filter((i) => i.result === "Missing" || i.result === "Damaged");
  const isOpen = cycle.status === "Open";

  return (
    <div className="grid gap-5">
      <Panel
        title={`Verification — ${cycle.name}`}
        subtitle={isOpen ? "Mark each asset Verified, Missing or Damaged." : `Closed ${fmtDate(cycle.closedAt)} — cycle is locked.`}
        actions={
          isOpen && canManage ? (
            <Button tone="danger" onClick={() => closeAuditCycle(cycle.id, me)}>
              Close cycle & apply statuses
            </Button>
          ) : undefined
        }
      >
        <Table headers={["Asset", "Location", "Result", ...(isOpen ? ["Mark"] : [])]}>
          {cycle.items.map((item) => {
            const a = db.assets.find((x) => x.id === item.assetId);
            return (
              <tr key={item.assetId}>
                <td className="px-4 py-3 font-semibold text-slate-900">{a?.name} <span className="text-xs text-slate-400">{a?.tag}</span></td>
                <td className="px-4 py-3">{a?.location}</td>
                <td className="px-4 py-3"><Badge tone={RESULT_TONE[item.result]}>{item.result}</Badge></td>
                {isOpen && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(["Verified", "Missing", "Damaged"] as AuditItemResult[]).map((r) => (
                        <Button
                          key={r}
                          tone={r === "Verified" ? "success" : r === "Missing" ? "danger" : "ghost"}
                          onClick={() => markAuditItem(cycle.id, item.assetId, r, me)}
                        >
                          {r}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </Table>
      </Panel>

      <Panel
        title="Discrepancy report"
        subtitle={
          discrepancies.length === 0
            ? "Auto-generated — no discrepancies flagged yet."
            : `Auto-generated — ${discrepancies.length} flagged item(s). Closing the cycle marks Missing → Lost and Damaged → Under Maintenance.`
        }
      >
        {discrepancies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
            All clear so far.
          </div>
        ) : (
          <Table headers={["Asset", "Tag", "Finding", "Current status"]}>
            {discrepancies.map((i) => {
              const a = db.assets.find((x) => x.id === i.assetId);
              return (
                <tr key={i.assetId} className="bg-red-50/40">
                  <td className="px-4 py-3 font-semibold text-slate-900">{a?.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a?.tag}</td>
                  <td className="px-4 py-3"><Badge tone={RESULT_TONE[i.result]}>{i.result}</Badge></td>
                  <td className="px-4 py-3">{a?.status}</td>
                </tr>
              );
            })}
          </Table>
        )}
      </Panel>
    </div>
  );
}
