"use client";

import { useState } from "react";
import { raiseMaintenance, advanceMaintenance, currentUserEmail, type MaintenanceRequest } from "@/app/lib/store";
import { useDB, Panel, Button, Field, inputCls, Table, EmptyRow, Badge, Alert } from "./shared";

const STATUS_TONE: Record<string, string> = {
  Pending: "amber",
  Approved: "purple",
  Rejected: "red",
  "Technician Assigned": "purple",
  "In Progress": "orange",
  Resolved: "green",
};

const FLOW = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];

export default function MaintenanceModule({ canApprove = true }: { canApprove?: boolean }) {
  const db = useDB();
  const me = currentUserEmail();
  const [assetId, setAssetId] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState<MaintenanceRequest["priority"]>("Medium");
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const technicians = db.employees.filter((e) => e.role === "Asset Manager" || e.email.includes("itservice"));

  const submit = () => {
    setMsg(null);
    if (!assetId) { setMsg({ kind: "error", text: "Select the asset that needs repair." }); return; }
    if (!issue.trim()) { setMsg({ kind: "error", text: "Describe the issue." }); return; }
    raiseMaintenance(assetId, issue.trim(), priority, me);
    setIssue(""); setAssetId("");
    setMsg({ kind: "success", text: "Request raised — waiting for Asset Manager approval before work starts." });
  };

  return (
    <div className="grid gap-5">
      <Panel
        title="Raise maintenance request"
        subtitle="Approval is required before repair work begins and before the asset flips to Under Maintenance."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Asset">
            <select className={inputCls} value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              <option value="">— select —</option>
              {db.assets
                .filter((a) => !["Retired", "Disposed", "Lost"].includes(a.status))
                .map((a) => <option key={a.id} value={a.id}>{a.tag} · {a.name}</option>)}
            </select>
          </Field>
          <Field label="Issue">
            <input className={inputCls} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Describe the problem…" />
          </Field>
          <Field label="Priority">
            <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as MaintenanceRequest["priority"])}>
              {["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-4"><Button onClick={submit}>Raise request</Button></div>
        {msg && <div className="mt-3"><Alert kind={msg.kind}>{msg.text}</Alert></div>}
      </Panel>

      <Panel
        title="Maintenance workflow"
        subtitle="Pending → Approved / Rejected → Technician Assigned → In Progress → Resolved."
      >
        <div className="mb-4 flex flex-wrap gap-1.5">
          {FLOW.map((s, i) => (
            <span key={s} className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Badge tone={STATUS_TONE[s]}>{s}</Badge>
              {i < FLOW.length - 1 && <span className="text-slate-300">→</span>}
            </span>
          ))}
        </div>
        <Table headers={["Asset", "Issue", "Priority", "Raised by", "Status", "Technician", ...(canApprove ? ["Next step"] : [])]}>
          {db.maintenance.length === 0 && <EmptyRow span={7} message="No maintenance requests." />}
          {db.maintenance.map((m) => {
            const a = db.assets.find((x) => x.id === m.assetId);
            return (
              <tr key={m.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{a?.name} <span className="text-xs text-slate-400">{a?.tag}</span></td>
                <td className="px-4 py-3">{m.issue}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.priority === "High" ? "red" : m.priority === "Medium" ? "amber" : "slate"}>{m.priority}</Badge>
                </td>
                <td className="px-4 py-3">{m.raisedBy}</td>
                <td className="px-4 py-3"><Badge tone={STATUS_TONE[m.status]}>{m.status}</Badge></td>
                <td className="px-4 py-3">{m.technician ?? "—"}</td>
                {canApprove && (
                  <td className="px-4 py-3">
                    {m.status === "Pending" && (
                      <div className="flex gap-2">
                        <Button tone="success" onClick={() => advanceMaintenance(m.id, "approve", me)}>Approve</Button>
                        <Button tone="ghost" onClick={() => advanceMaintenance(m.id, "reject", me)}>Reject</Button>
                      </div>
                    )}
                    {m.status === "Approved" && (
                      <Button tone="ghost" onClick={() => advanceMaintenance(m.id, "assign", me, technicians[0]?.email)}>
                        Assign technician
                      </Button>
                    )}
                    {m.status === "Technician Assigned" && (
                      <Button tone="ghost" onClick={() => advanceMaintenance(m.id, "start", me)}>Start work</Button>
                    )}
                    {m.status === "In Progress" && (
                      <Button tone="success" onClick={() => advanceMaintenance(m.id, "resolve", me)}>Mark resolved</Button>
                    )}
                    {(m.status === "Resolved" || m.status === "Rejected") && (
                      <span className="text-xs text-slate-400">Done</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </Table>
      </Panel>
    </div>
  );
}
