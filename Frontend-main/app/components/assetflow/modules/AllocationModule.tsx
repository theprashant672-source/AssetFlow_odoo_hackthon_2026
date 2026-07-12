"use client";

import { useState } from "react";
import {
  allocateAsset, requestTransfer, decideTransfer, returnAsset,
  assetHolderLabel, isOverdue, currentUserEmail,
} from "@/app/lib/store";
import { useDB, Panel, Button, Field, inputCls, Table, EmptyRow, Badge, Alert, fmtDate, fmtDateTime } from "./shared";

export default function AllocationModule({ canApprove = true }: { canApprove?: boolean }) {
  const db = useDB();
  const me = currentUserEmail();

  const [assetId, setAssetId] = useState("");
  const [targetType, setTargetType] = useState<"employee" | "department">("employee");
  const [targetEmail, setTargetEmail] = useState("");
  const [targetDept, setTargetDept] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [result, setResult] = useState<{ kind: "error" | "success"; text: string; offerTransfer?: string } | null>(null);
  const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});

  const active = db.assets.filter((a) => a.status === "Allocated");
  const pendingTransfers = db.transfers.filter((t) => t.status === "Requested");
  const decidedTransfers = db.transfers.filter((t) => t.status !== "Requested").slice(0, 6);

  const submitAllocation = () => {
    setResult(null);
    if (!assetId) { setResult({ kind: "error", text: "Select an asset." }); return; }
    const target = targetType === "employee"
      ? { holderEmail: targetEmail }
      : { departmentId: targetDept };
    if (!target.holderEmail && !target.departmentId) {
      setResult({ kind: "error", text: "Pick who receives the asset." });
      return;
    }
    const r = allocateAsset(assetId, target, returnDate ? new Date(returnDate).toISOString() : undefined, me);
    if (r.ok) {
      setResult({ kind: "success", text: "Asset allocated." });
      setAssetId(""); setTargetEmail(""); setTargetDept(""); setReturnDate("");
    } else {
      setResult({
        kind: "error",
        text: r.holder ? `Blocked: currently held by ${r.holder}. ${r.reason}` : r.reason,
        offerTransfer: r.holder && targetType === "employee" && targetEmail ? assetId : undefined,
      });
    }
  };

  const sendTransferRequest = () => {
    if (!result?.offerTransfer || !targetEmail) return;
    requestTransfer(result.offerTransfer, targetEmail, me);
    setResult({ kind: "success", text: "Transfer request submitted for approval." });
  };

  return (
    <div className="grid gap-5">
      <Panel
        title="Allocate asset"
        subtitle="Double-allocation is blocked — the system offers a transfer request instead."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Asset">
            <select className={inputCls} value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              <option value="">— select —</option>
              {db.assets
                .filter((a) => !["Retired", "Disposed", "Lost"].includes(a.status))
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.tag} · {a.name} ({a.status})
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Allocate to">
            <select className={inputCls} value={targetType} onChange={(e) => setTargetType(e.target.value as "employee" | "department")}>
              <option value="employee">Employee</option>
              <option value="department">Department</option>
            </select>
          </Field>
          {targetType === "employee" ? (
            <Field label="Employee">
              <select className={inputCls} value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)}>
                <option value="">— select —</option>
                {db.employees.filter((e) => e.status === "Active").map((e) => (
                  <option key={e.id} value={e.email}>{e.name}</option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Department">
              <select className={inputCls} value={targetDept} onChange={(e) => setTargetDept(e.target.value)}>
                <option value="">— select —</option>
                {db.departments.filter((d) => d.status === "Active").map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </Field>
          )}
          <Field label="Expected return (optional)">
            <input type="date" className={inputCls} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={submitAllocation}>Allocate</Button>
          {result?.offerTransfer && (
            <Button tone="ghost" onClick={sendTransferRequest}>Raise Transfer Request instead</Button>
          )}
        </div>
        {result && (
          <div className="mt-3">
            <Alert kind={result.kind}>{result.text}</Alert>
          </div>
        )}
      </Panel>

      {canApprove && (
        <Panel title="Transfer requests" subtitle="Requested → Approved → re-allocated with history updated automatically.">
          <Table headers={["Asset", "From", "To", "Requested by", "When", "Decision"]}>
            {pendingTransfers.length === 0 && <EmptyRow span={6} message="No pending transfer requests." />}
            {pendingTransfers.map((t) => {
              const a = db.assets.find((x) => x.id === t.assetId);
              return (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{a?.name} <span className="text-xs text-slate-400">{a?.tag}</span></td>
                  <td className="px-4 py-3">{t.fromEmail ?? "—"}</td>
                  <td className="px-4 py-3">{t.toEmail}</td>
                  <td className="px-4 py-3">{t.requestedBy}</td>
                  <td className="px-4 py-3">{fmtDateTime(t.requestedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button tone="success" onClick={() => decideTransfer(t.id, true, me)}>Approve</Button>
                      <Button tone="ghost" onClick={() => decideTransfer(t.id, false, me)}>Reject</Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </Table>
          {decidedTransfers.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-black uppercase tracking-[0.14em] text-slate-500">Recent decisions</h3>
              <Table headers={["Asset", "To", "Status", "Decided by"]}>
                {decidedTransfers.map((t) => {
                  const a = db.assets.find((x) => x.id === t.assetId);
                  return (
                    <tr key={t.id}>
                      <td className="px-4 py-3">{a?.tag} · {a?.name}</td>
                      <td className="px-4 py-3">{t.toEmail}</td>
                      <td className="px-4 py-3">
                        <Badge tone={t.status === "Approved" ? "green" : "red"}>{t.status}</Badge>
                      </td>
                      <td className="px-4 py-3">{t.decidedBy}</td>
                    </tr>
                  );
                })}
              </Table>
            </div>
          )}
        </Panel>
      )}

      <Panel title="Active allocations" subtitle="Mark returned with condition check-in notes — the asset reverts to Available.">
        <Table headers={["Asset", "Holder", "Expected return", "Flag", "Check-in notes", "Return"]}>
          {active.length === 0 && <EmptyRow span={6} message="Nothing allocated right now." />}
          {active.map((a) => (
            <tr key={a.id} className={isOverdue(a) ? "bg-red-50/40" : undefined}>
              <td className="px-4 py-3 font-semibold text-slate-900">{a.name} <span className="text-xs text-slate-400">{a.tag}</span></td>
              <td className="px-4 py-3">{assetHolderLabel(db, a)}</td>
              <td className="px-4 py-3">{fmtDate(a.expectedReturn)}</td>
              <td className="px-4 py-3">
                {isOverdue(a) ? <Badge tone="red">Overdue</Badge> : <Badge tone="green">On track</Badge>}
              </td>
              <td className="px-4 py-3">
                <input
                  className={inputCls}
                  placeholder="Condition notes…"
                  value={returnNotes[a.id] ?? ""}
                  onChange={(e) => setReturnNotes({ ...returnNotes, [a.id]: e.target.value })}
                />
              </td>
              <td className="px-4 py-3">
                <Button tone="ghost" onClick={() => returnAsset(a.id, returnNotes[a.id] ?? "", me)}>
                  Mark returned
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}
