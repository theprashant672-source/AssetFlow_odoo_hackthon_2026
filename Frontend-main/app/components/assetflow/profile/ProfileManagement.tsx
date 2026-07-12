"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { currentUserEmail, findEmployee, isOverdue } from "@/app/lib/store";
import { ROLE_LABELS, sectionHref, type AssetFlowRole } from "@/app/lib/assetflow-roles";
import { useDB, Panel, Button, Field, inputCls, Table, EmptyRow, StatusBadge, Badge, fmtDate, fmtDateTime } from "../modules/shared";

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}

export default function ProfileManagement({ role }: { role: AssetFlowRole }) {
  const db = useDB();
  const router = useRouter();
  const email = currentUserEmail();
  const employee = findEmployee(db, email);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [authMethod, setAuthMethod] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDisplayName(localStorage.getItem("assetflow_profile_name") || employee?.name || "");
    setPhone(localStorage.getItem("assetflow_profile_phone") || "");
    setCompany(readCookie("assetflow_company") || "ODOO Technologies Pvt. Ltd.");
    setAuthMethod(readCookie("assetflow_auth_method") || "password");
  }, [employee?.name]);

  const myAssets = useMemo(
    () => db.assets.filter((a) => a.holderEmail?.toLowerCase() === email.toLowerCase()),
    [db, email]
  );
  const myBookings = useMemo(
    () => db.bookings.filter((b) => b.bookedBy.toLowerCase() === email.toLowerCase() && b.status !== "Cancelled"),
    [db, email]
  );
  const myRequests = useMemo(
    () => db.maintenance.filter((m) => m.raisedBy.toLowerCase() === email.toLowerCase()),
    [db, email]
  );
  const overdueCount = myAssets.filter(isOverdue).length;

  const saveProfile = () => {
    localStorage.setItem("assetflow_profile_name", displayName.trim());
    localStorage.setItem("assetflow_profile_phone", phone.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    for (const c of ["assetflow_session", "assetflow_role", "assetflow_identity", "assetflow_auth_method", "assetflow_company"]) {
      document.cookie = `${c}=; path=/; max-age=0; samesite=lax`;
    }
    router.push("/login");
  };

  const shownName = displayName.trim() || employee?.name || email.split("@")[0] || "User";
  const initial = shownName.charAt(0).toUpperCase() || "U";

  return (
    <div className="grid gap-5">
      <section className="overflow-hidden rounded-2xl bg-[#341d2d] p-5 text-white shadow-[0_18px_42px_rgba(52,29,45,0.22)] sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9A528D,#b878ab)] text-2xl font-black">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-black tracking-tight">{shownName}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/65">
              <span>{email || "No email in session"}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white">{ROLE_LABELS[role]}</span>
              {employee?.departmentId && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white">
                  {db.departments.find((d) => d.id === employee.departmentId)?.name ?? "—"}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
          >
            Log out
          </button>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link href={sectionHref(role, role === "employee" ? "my-assets" : "assets")} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9A528D]/40 hover:shadow-md">
          <div className="text-3xl font-black text-slate-900">{myAssets.length}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Assets with me</div>
          <div className="mt-1 text-[11px] font-medium text-slate-400">
            {overdueCount > 0 ? `${overdueCount} overdue — return soon!` : "Everything on schedule."}
          </div>
        </Link>
        <Link href={sectionHref(role, "bookings")} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9A528D]/40 hover:shadow-md">
          <div className="text-3xl font-black text-slate-900">{myBookings.length}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">My bookings</div>
          <div className="mt-1 text-[11px] font-medium text-slate-400">Click to view or cancel slots.</div>
        </Link>
        <Link href={sectionHref(role, "maintenance")} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#9A528D]/40 hover:shadow-md">
          <div className="text-3xl font-black text-slate-900">{myRequests.length}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Issues I raised</div>
          <div className="mt-1 text-[11px] font-medium text-slate-400">
            {myRequests.filter((m) => m.status !== "Resolved" && m.status !== "Rejected").length} still open.
          </div>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Account details" subtitle="Your display name and contact info — saved on this device.">
          <div className="grid gap-3">
            <Field label="Display name">
              <input className={inputCls} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
            </Field>
            <Field label="Phone (optional)">
              <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Email (from sign-in)">
                <input className={`${inputCls} bg-slate-50 text-slate-500`} value={email} readOnly />
              </Field>
              <Field label="Sign-in method">
                <input className={`${inputCls} bg-slate-50 text-slate-500`} value={authMethod === "otp" ? "One-time passcode" : "Password"} readOnly />
              </Field>
            </div>
            <Field label="Company">
              <input className={`${inputCls} bg-slate-50 text-slate-500`} value={company} readOnly />
            </Field>
            <div className="flex items-center gap-3">
              <Button onClick={saveProfile}>Save changes</Button>
              {saved && <span className="text-sm font-bold text-emerald-600">✓ Saved</span>}
            </div>
          </div>
        </Panel>

        <Panel title="Assets assigned to me" subtitle="What you're currently responsible for.">
          <Table headers={["Asset", "Status", "Expected return"]}>
            {myAssets.length === 0 && <EmptyRow span={3} message="No assets assigned to you right now." />}
            {myAssets.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {a.name} <span className="text-xs text-slate-400">{a.tag}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  {a.expectedReturn ? (
                    isOverdue(a) ? <Badge tone="red">Overdue · {fmtDate(a.expectedReturn)}</Badge> : fmtDate(a.expectedReturn)
                  ) : "—"}
                </td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>

      <Panel title="My recent maintenance requests" subtitle="Issues you reported and where they stand.">
        <Table headers={["Asset", "Issue", "Priority", "Raised", "Status"]}>
          {myRequests.length === 0 && <EmptyRow span={5} message="You haven't raised any issues yet." />}
          {myRequests.slice(0, 6).map((m) => {
            const a = db.assets.find((x) => x.id === m.assetId);
            return (
              <tr key={m.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{a?.name ?? "—"}</td>
                <td className="px-4 py-3">{m.issue}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.priority === "High" ? "red" : m.priority === "Medium" ? "amber" : "slate"}>{m.priority}</Badge>
                </td>
                <td className="px-4 py-3 text-xs">{fmtDateTime(m.raisedAt)}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.status === "Resolved" ? "green" : m.status === "Rejected" ? "red" : "amber"}>{m.status}</Badge>
                </td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    </div>
  );
}
