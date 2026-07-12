"use client";

import { useMemo, useState } from "react";
import { createBooking, cancelBooking, bookingLiveStatus, currentUserEmail } from "@/app/lib/store";
import { useDB, Panel, Button, Field, inputCls, Table, EmptyRow, Badge, Alert, fmtDateTime } from "./shared";

const STATUS_TONE: Record<string, string> = {
  Upcoming: "purple", Ongoing: "green", Completed: "slate", Cancelled: "red",
};

export default function BookingModule() {
  const db = useDB();
  const me = currentUserEmail();
  const resources = db.assets.filter((a) => a.bookable);

  const [resourceId, setResourceId] = useState(resources[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [purpose, setPurpose] = useState("");
  const [result, setResult] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  const selectedResource = resources.find((r) => r.id === resourceId);

  const resourceBookings = useMemo(
    () =>
      db.bookings
        .filter((b) => b.assetId === resourceId && b.status !== "Cancelled")
        .sort((a, b) => a.start.localeCompare(b.start)),
    [db, resourceId]
  );

  const dayBookings = resourceBookings.filter((b) => b.start.slice(0, 10) === date);

  const submit = () => {
    setResult(null);
    if (!resourceId) { setResult({ kind: "error", text: "Pick a resource." }); return; }
    if (!purpose.trim()) { setResult({ kind: "error", text: "Add a booking purpose." }); return; }
    const start = new Date(`${date}T${startTime}`).toISOString();
    const end = new Date(`${date}T${endTime}`).toISOString();
    const r = createBooking(resourceId, start, end, purpose.trim(), me);
    if (r.ok) {
      setResult({ kind: "success", text: "Booking confirmed — no overlaps." });
      setPurpose("");
    } else {
      setResult({ kind: "error", text: `Rejected: ${r.reason}` });
    }
  };

  const allMine = db.bookings
    .filter((b) => b.bookedBy.toLowerCase() === me.toLowerCase())
    .slice(0, 10);

  return (
    <div className="grid gap-5">
      <Panel
        title="Book a shared resource"
        subtitle="Overlapping requests are rejected automatically — back-to-back slots are fine."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="Resource">
            <select className={inputCls} value={resourceId} onChange={(e) => setResourceId(e.target.value)}>
              {resources.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Start">
            <input type="time" className={inputCls} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </Field>
          <Field label="End">
            <input type="time" className={inputCls} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </Field>
          <Field label="Purpose">
            <input className={inputCls} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Client demo" />
          </Field>
        </div>
        <div className="mt-4">
          <Button onClick={submit}>Book slot</Button>
        </div>
        {result && <div className="mt-3"><Alert kind={result.kind}>{result.text}</Alert></div>}
      </Panel>

      <Panel
        title={`Schedule — ${selectedResource?.name ?? "resource"}`}
        subtitle={`Existing bookings on ${new Date(date).toLocaleDateString([], { day: "2-digit", month: "long" })}. Pick a free gap.`}
      >
        {dayBookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-400">
            Whole day free — no bookings yet.
          </div>
        ) : (
          <div className="grid gap-2">
            {dayBookings.map((b) => {
              const s = new Date(b.start), e = new Date(b.end);
              const live = bookingLiveStatus(b);
              return (
                <div key={b.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-odoo-200 bg-odoo-50/60 px-4 py-2.5">
                  <span className="font-mono text-sm font-bold text-odoo-800">
                    {s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">{b.purpose}</span>
                  <span className="text-xs text-slate-500">by {b.bookedBy}</span>
                  <Badge tone={STATUS_TONE[live]}>{live}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel title="All bookings" subtitle="Live status: Upcoming, Ongoing, Completed, Cancelled.">
        <Table headers={["Resource", "Slot", "Purpose", "Booked by", "Status", "Action"]}>
          {db.bookings.length === 0 && <EmptyRow span={6} message="No bookings yet." />}
          {db.bookings.slice(0, 15).map((b) => {
            const a = db.assets.find((x) => x.id === b.assetId);
            const live = bookingLiveStatus(b);
            const cancellable = live === "Upcoming" &&
              (b.bookedBy.toLowerCase() === me.toLowerCase() || true);
            return (
              <tr key={b.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{a?.name ?? "—"}</td>
                <td className="px-4 py-3 text-xs">{fmtDateTime(b.start)} → {new Date(b.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                <td className="px-4 py-3">{b.purpose}</td>
                <td className="px-4 py-3">{b.bookedBy}</td>
                <td className="px-4 py-3"><Badge tone={STATUS_TONE[live]}>{live}</Badge></td>
                <td className="px-4 py-3">
                  {cancellable ? (
                    <Button tone="ghost" onClick={() => cancelBooking(b.id, me)}>Cancel</Button>
                  ) : <span className="text-xs text-slate-400">—</span>}
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>

      {allMine.length > 0 && (
        <Panel title="My bookings" subtitle="Your reservations across resources.">
          <div className="flex flex-wrap gap-2">
            {allMine.map((b) => {
              const a = db.assets.find((x) => x.id === b.assetId);
              return (
                <Badge key={b.id} tone={STATUS_TONE[bookingLiveStatus(b)]}>
                  {a?.name}: {fmtDateTime(b.start)}
                </Badge>
              );
            })}
          </div>
        </Panel>
      )}
    </div>
  );
}
