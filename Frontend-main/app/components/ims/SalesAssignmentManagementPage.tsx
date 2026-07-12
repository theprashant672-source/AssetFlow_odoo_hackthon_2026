"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { NOVAASSETS_PRICE_STATES } from "../../lib/novaassetsPricing";
import { createUser, deleteUser, listUsers, updateUser, type UserSafe } from "../../lib/imsApi";
import { Badge, PageHeader, PrimaryBtn, SearchBar, Table, TD, TR } from "./ui";
import { IconPencil, IconPlus, IconTrash, IconUsers, IconX } from "../icons/Icons";

function useAsyncData<T>(loader: () => Promise<T>, deps: ReadonlyArray<unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const reload = () => {
    const nextRequestId = ++requestId.current;
    setLoading(true);
    setError("");
    loader()
      .then((value) => {
        if (requestId.current !== nextRequestId) return;
        setData(value);
      })
      .catch((err: unknown) => {
        if (requestId.current !== nextRequestId) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (requestId.current !== nextRequestId) return;
        setLoading(false);
      });
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload };
}

function ModalShell({
  title,
  sub,
  onClose,
  children,
}: {
  title: string;
  sub?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md">
      <button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_30px_120px_rgba(15,23,42,0.28)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900">{title}</div>
            {sub && <div className="mt-1 text-sm text-slate-500">{sub}</div>}
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-800">
            <IconX size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function stateLabel(state: string) {
  switch (state) {
    case "UP": return "Uttar Pradesh";
    case "MP": return "Madhya Pradesh";
    case "Bihar": return "Bihar";
    case "Haryana": return "Haryana";
    case "Rajasthan": return "Rajasthan";
    case "Punjab": return "Punjab";
    default: return state;
  }
}

type SalesUserForm = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  isActive: boolean;
  assignedStates: string[];
};

const EMPTY_FORM: SalesUserForm = {
  id: "",
  name: "",
  email: "",
  mobile: "",
  password: "Sales@123",
  isActive: true,
  assignedStates: ["UP"],
};

export default function SalesAssignmentManagementPage() {
  const usersRes = useAsyncData(listUsers, []);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<SalesUserForm>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [recentCredential, setRecentCredential] = useState<{ email: string; password: string } | null>(null);

  const salesUsers = useMemo(() => {
    const rows = usersRes.data ?? [];
    return rows.filter((user) => String(user.role ?? "").toLowerCase().includes("sales"));
  }, [usersRes.data]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return salesUsers;
    return salesUsers.filter((user) => [
      user.name,
      user.email,
      user.mobile,
      user.role,
      ...(user.assignedStates ?? []),
    ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query)));
  }, [salesUsers, search]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openCreate = () => {
    setEditingId("");
    setForm(EMPTY_FORM);
    setError("");
    setRecentCredential(null);
    setModalOpen(true);
  };

  const openEdit = (user: UserSafe) => {
    setEditingId(user.id);
    setForm({
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      mobile: user.mobile ?? "",
      password: "",
      isActive: user.isActive !== false,
      assignedStates: user.assignedStates?.length ? user.assignedStates : ["UP"],
    });
    setError("");
    setRecentCredential(null);
    setModalOpen(true);
  };

  const toggleState = (state: string) => {
    setForm((current) => ({
      ...current,
      assignedStates: current.assignedStates.includes(state)
        ? current.assignedStates.filter((item) => item !== state)
        : [...current.assignedStates, state],
    }));
  };

  const save = async () => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.trim();
    const password = form.password.trim();
    const assignedStates = Array.from(new Set(form.assignedStates.map((state) => state.trim()).filter(Boolean)));

    if (!name || !email || !mobile) {
      setError("Name, email and mobile are required.");
      return;
    }
    if (!assignedStates.length) {
      setError("At least one state is required.");
      return;
    }
    if (!editingId && !password) {
      setError("Password is required for new sales accounts.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateUser(editingId, {
          name,
          mobile,
          role: "Sales",
          isActive: form.isActive,
          password: password || undefined,
          assignedStates,
        });
        setToast("Sales account updated.");
      } else {
        await createUser({
          name,
          email,
          mobile,
          role: "Sales",
          password,
          isActive: form.isActive,
          assignedStates,
        });
        setRecentCredential({ email, password });
        setToast("Sales account created.");
      }
      usersRes.reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user: UserSafe) => {
    const confirmed = window.confirm(`Delete sales account "${user.name}"?`);
    if (!confirmed) return;
    try {
      await deleteUser(user.id);
      usersRes.reload();
      setToast("Sales account deleted.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Assignment Management"
        sub="Create sales login accounts and map them to one or more states."
        action={<PrimaryBtn onClick={openCreate}><IconPlus size={16} /> Add Sales Account</PrimaryBtn>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">Sales Accounts</div>
          <div className="mt-2 text-4xl font-black text-blue-700">{salesUsers.length}</div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">Demo Login</div>
          <div className="mt-2 text-sm font-semibold text-emerald-800">sales@avavbusiness.com / Sales@123</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-500">State Rule</div>
          <div className="mt-2 text-sm text-amber-800">One state for a person, multiple states for a head.</div>
        </div>
      </div>

      {recentCredential && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          New login created: <span className="font-semibold">{recentCredential.email}</span> / <span className="font-semibold">{recentCredential.password}</span>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">{filteredUsers.length} sales users</div>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <Table headers={["Name", "Login", "States", "Status", "Manage"]}>
          {usersRes.loading ? (
            <TR><TD colSpan={5} className="py-8 text-center text-gray-400">Loading...</TD></TR>
          ) : usersRes.error ? (
            <TR><TD colSpan={5} className="py-8 text-center text-red-500">{usersRes.error}</TD></TR>
          ) : filteredUsers.length === 0 ? (
            <TR><TD colSpan={5} className="py-8 text-center text-gray-400">No sales accounts found.</TD></TR>
          ) : filteredUsers.map((user) => (
            <TR key={user.id}>
              <TD>
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-400">{user.mobile}</div>
              </TD>
              <TD>
                <div className="font-mono text-xs text-gray-700">{user.email}</div>
                <div className="mt-1 text-[11px] text-gray-400">Password is set in the create/edit form.</div>
              </TD>
              <TD>
                <div className="flex flex-wrap gap-1">
                  {(user.assignedStates ?? []).map((state) => (
                    <Badge key={state} color="blue">{stateLabel(state)}</Badge>
                  ))}
                </div>
              </TD>
              <TD>
                <Badge color={user.isActive === false ? "gray" : (user.assignedStates?.length ?? 0) > 1 ? "amber" : "green"}>
                  {user.isActive === false ? "Inactive" : (user.assignedStates?.length ?? 0) > 1 ? "Sales Head" : "Sales Person"}
                </Badge>
              </TD>
              <TD>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openEdit(user)} className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:border-amber-300 hover:text-amber-600">
                    <IconPencil size={16} />
                  </button>
                  <button type="button" onClick={() => remove(user)} className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:border-rose-300 hover:text-rose-600">
                    <IconTrash size={16} />
                  </button>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </div>

      {modalOpen && (
        <ModalShell
          title={editingId ? "Edit Sales Account" : "Add Sales Account"}
          sub={editingId ? "Update the login and state mapping." : "Create a demo login and assign one or more states."}
          onClose={() => setModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                disabled={Boolean(editingId)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Mobile</span>
              <input
                value={form.mobile}
                onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Password {editingId ? "(optional)" : ""}</span>
              <input
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder={editingId ? "Leave blank to keep current password" : "Sales@123"}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
              />
            </label>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-bold text-slate-800">Assigned States</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {NOVAASSETS_PRICE_STATES.map((state) => {
                const checked = form.assignedStates.includes(state);
                return (
                  <label key={state} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${checked ? "border-amber-300 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-700"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleState(state)} className="h-4 w-4 accent-amber-500" />
                    {stateLabel(state)}
                  </label>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-slate-500">Select one state for a sales person, or multiple states for a sales head.</div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 accent-amber-500"
              />
              Active
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md shadow-amber-200 ${saving ? "cursor-not-allowed bg-amber-300" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400"}`}
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </ModalShell>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[90] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
