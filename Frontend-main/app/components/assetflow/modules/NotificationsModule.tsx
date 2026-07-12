"use client";

import { markAllNotificationsRead, resetDemoData } from "@/app/lib/store";
import { useDB, Panel, Button, Badge, fmtDateTime } from "./shared";

export default function NotificationsModule() {
  const db = useDB();
  const unread = db.notifications.filter((n) => !n.read).length;

  return (
    <div className="grid gap-5">
      <Panel
        title="Notifications"
        subtitle="Asset assignments, approvals, bookings, overdue alerts and audit flags."
        actions={
          <div className="flex gap-2">
            {unread > 0 && <Button tone="ghost" onClick={markAllNotificationsRead}>Mark all read ({unread})</Button>}
            <Button tone="ghost" onClick={resetDemoData}>Reset demo data</Button>
          </div>
        }
      >
        <ul className="grid gap-2.5">
          {db.notifications.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400">
              No notifications yet.
            </li>
          )}
          {db.notifications.slice(0, 30).map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                n.read ? "border-slate-100 bg-white/60" : "border-odoo-200 bg-odoo-50/70"
              }`}
            >
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? "bg-slate-300" : "bg-[#9A528D]"}`} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={/overdue|discrepanc|reject/i.test(n.kind) ? "red" : /approved|confirmed|resolved|returned/i.test(n.kind) ? "green" : "purple"}>
                    {n.kind}
                  </Badge>
                  <span className="text-xs text-slate-400">{fmtDateTime(n.at)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{n.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Activity log" subtitle="Full audit trail — who did what, when.">
        <ul className="grid gap-2">
          {db.activity.length === 0 && <li className="text-sm text-slate-400">No activity yet.</li>}
          {db.activity.slice(0, 40).map((e) => (
            <li key={e.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white/70 px-3.5 py-2.5">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-300" />
              <div>
                <div className="text-sm font-medium text-slate-800">{e.action}</div>
                <div className="text-xs text-slate-400">{e.actor || "system"} · {fmtDateTime(e.at)}</div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
