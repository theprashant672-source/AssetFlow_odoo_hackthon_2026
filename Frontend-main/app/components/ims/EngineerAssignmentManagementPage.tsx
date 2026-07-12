"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  cleanupStaleEngineerAssignments,
  createEngineerAssignment,
  deleteEngineerAssignment,
  importEngineerAssignments,
  listEngineerAssignmentAudit,
  listEngineerAssignmentOptions,
  listEngineerAssignments,
  rebuildEngineerLoads,
  updateEngineerAssignment,
  type EngineerAssignment,
  type EngineerAssignmentAudit,
  type EngineerMaster,
} from "../../lib/imsApi";
import { ActionBtns, Badge, PageHeader, PrimaryBtn, SearchBar, Table, TD, TR } from "./ui";
import { IconRefresh, IconSearch, IconUpload, IconX, IconPlus, IconClipboardList, IconTrash } from "../icons/Icons";

function formatDate(value?: string) {
  if (!value) return "â€”";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "â€”";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCountLabel(load?: { activeCount: number; waitingCount: number } | null) {
  if (!load) return "0 / 0";
  return `${load.activeCount} active, ${load.waitingCount} waiting`;
}

function roleTint(role?: string) {
  if (role === "L1") return "blue";
  if (role === "L2") return "teal";
  if (role === "Backup") return "orange";
  return "gray";
}

function engineerLabel(engineer?: EngineerMaster | null) {
  if (!engineer) return "Unassigned";
  return `${engineer.name} Â· ${engineer.role}`;
}

function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: Array<{ value: string; label: string; meta?: string }>;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? "";
  const filtered = options.filter((option) => {
    const needle = `${option.label} ${option.meta ?? ""}`.toLowerCase();
    return needle.includes(query.trim().toLowerCase());
  });

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-800 shadow-sm transition hover:border-amber-300 hover:shadow-md"
      >
        <span className={`truncate ${value ? "font-semibold" : "text-slate-400"}`}>{selectedLabel || placeholder || "Selectâ€¦"}</span>
        <IconSearch size={14} className="shrink-0 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Searchâ€¦"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div className="max-h-64 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400">No matching engineer.</div>
            ) : filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-amber-50 ${option.value === value ? "bg-amber-50 text-amber-700" : "text-slate-700"}`}
              >
                <span className="truncate font-medium">{option.label}</span>
                {option.meta && <span className="ml-3 shrink-0 text-[11px] uppercase tracking-[0.24em] text-slate-400">{option.meta}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DistrictMultiSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const selected = useMemo(() => new Set(value), [value]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => option.toLowerCase().includes(needle));
  }, [options, query]);

  const toggleDistrict = (district: string) => {
    onChange(
      value.includes(district)
        ? value.filter((item) => item !== district)
        : [...value, district]
    );
  };

  const clearAll = () => onChange([]);
  const selectAll = () => onChange(Array.from(new Set(options)));
  const selectedPreview = value.slice(0, 3);

  return (
    <div ref={ref} className="relative">
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-800 shadow-sm transition hover:border-amber-300 hover:shadow-md"
      >
        <span className={`truncate ${value.length ? "font-semibold text-slate-900" : "text-slate-400"}`}>
          {value.length ? `${value.length} district${value.length > 1 ? "s" : ""} selected` : placeholder || "Select districts"}
        </span>
        <IconSearch size={14} className="shrink-0 text-slate-400" />
      </button>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedPreview.map((district) => (
            <button
              key={district}
              type="button"
              onClick={() => toggleDistrict(district)}
              className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
            >
              {district}
              <IconX size={12} />
            </button>
          ))}
          {value.length > selectedPreview.length && (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              +{value.length - selectedPreview.length} more
            </span>
          )}
        </div>
      )}
      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-100 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search districts..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            <button type="button" onClick={selectAll} className="text-amber-600 transition hover:text-amber-700">
              Select all
            </button>
            <button type="button" onClick={clearAll} className="text-slate-500 transition hover:text-slate-700">
              Clear
            </button>
          </div>
          <div className="max-h-72 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-400">No districts found.</div>
            ) : filtered.map((district) => {
              const checked = selected.has(district);
              return (
                <button
                  key={district}
                  type="button"
                  onClick={() => toggleDistrict(district)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-amber-50 ${checked ? "bg-amber-50 text-amber-700" : "text-slate-700"}`}
                >
                  <span className="truncate font-medium">{district}</span>
                  <span className={`ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full border ${checked ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300 bg-white text-transparent"}`}>
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ModalShell({
  title,
  sub,
  onClose,
  children,
  footer,
}: {
  title: string;
  sub?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-md">
      <button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0" />
      <div className="relative w-full max-w-7xl overflow-hidden rounded-[28px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] shadow-[0_30px_120px_rgba(15,23,42,0.28)]">
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
        {footer && <div className="border-t border-slate-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

type EngineerAssignmentForm = {
  id: string;
  state: string;
  districts: string[];
  l1EngineerId: string;
  l2EngineerId: string;
  l1BackupEngineerId: string;
};

const EMPTY_FORM: EngineerAssignmentForm = {
  id: "",
  state: "",
  districts: [],
  l1EngineerId: "",
  l2EngineerId: "",
  l1BackupEngineerId: "",
};

export default function EngineerAssignmentManagementPage() {
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editorOpen, setEditorOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [toast, setToast] = useState("");
  const [importing, setImporting] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<EngineerAssignmentForm>(EMPTY_FORM);

  const assignmentsRes = useAsyncData(
    () => listEngineerAssignments({ q, state: stateFilter, district: districtFilter, page, limit }),
    [q, stateFilter, districtFilter, page, limit]
  );
  const optionsRes = useAsyncData(listEngineerAssignmentOptions, []);
  const auditRes = useAsyncData(
    () => (auditOpen ? listEngineerAssignmentAudit({ page: 1, limit: 20 }) : Promise.resolve({ data: [], total: 0, page: 1, limit: 20 })),
    [auditOpen]
  );

  const assignments = assignmentsRes.data?.data ?? [];
  const total = assignmentsRes.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const states = optionsRes.data?.states ?? [];
  const districts = optionsRes.data?.districts ?? [];
  const districtsByState = optionsRes.data?.districtsByState ?? {};
  const engineers = optionsRes.data?.engineers ?? [];

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [q, stateFilter, districtFilter, limit]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const uniqueStates = new Set(assignments.map((row) => row.state)).size;
    const uniqueDistricts = new Set(assignments.map((row) => row.district)).size;
    const uniqueEngineers = new Set(assignments.flatMap((row) => [row.l1EngineerId, row.l2EngineerId, row.l1BackupEngineerId])).size;
    return [
      { label: "Mappings", value: total, hint: "State + district pairs" },
      { label: "States", value: uniqueStates, hint: "In current page" },
      { label: "Districts", value: uniqueDistricts, hint: "In current page" },
      { label: "Engineers", value: uniqueEngineers, hint: "Distinct assigned IDs" },
    ];
  }, [assignments, total]);

  const l1EngineerOptions = useMemo(() => {
    return engineers
      .filter((engineer) => engineer.role === "L1")
      .map((engineer) => ({
        value: engineer.id,
        label: engineer.name,
        meta: engineer.role,
      }));
  }, [engineers]);

  const l2EngineerOptions = useMemo(() => {
    return engineers
      .filter((engineer) => engineer.role === "L2")
      .map((engineer) => ({
        value: engineer.id,
        label: engineer.name,
        meta: engineer.role,
      }));
  }, [engineers]);

  const backupEngineerOptions = useMemo(() => {
    return engineers
      .filter((engineer) => engineer.role === "L1" || engineer.role === "L2")
      .map((engineer) => ({
        value: engineer.id,
        label: engineer.name,
        meta: engineer.role,
      }));
  }, [engineers]);

  const engineerNameById = useMemo(() => new Map(engineers.map((engineer) => [engineer.id, engineer.name])), [engineers]);
  const selectedDistrictOptions = useMemo(() => {
    if (!form.state.trim()) return [];
    const stateDistricts = districtsByState[form.state] ?? [];
    return stateDistricts.length ? stateDistricts : districts;
  }, [districts, districtsByState, form.state]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditorError("");
    setEditorOpen(true);
  };

  const openEdit = (row: EngineerAssignment) => {
    setForm({
      id: row.id,
      state: row.state,
      districts: [row.district],
      l1EngineerId: row.l1Engineer?.id ?? "",
      l2EngineerId: row.l2Engineer?.id ?? "",
      l1BackupEngineerId: row.l1BackupEngineer?.id ?? "",
    });
    setEditorError("");
    setEditorOpen(true);
  };

  const save = async () => {
    const l1EngineerName = engineerNameById.get(form.l1EngineerId)?.trim() ?? "";
    const l2EngineerName = engineerNameById.get(form.l2EngineerId)?.trim() ?? "";
    const l1BackupEngineerName = engineerNameById.get(form.l1BackupEngineerId)?.trim() ?? "";
    const districtList = Array.from(new Set(form.districts.map((district) => district.trim()).filter(Boolean)));
    if (!form.state.trim() || !districtList.length || !l1EngineerName || !l2EngineerName) {
      setEditorError("State, at least one district, L1 Engineer and L2 Engineer are required.");
      return;
    }
    if (form.id && districtList.length !== 1) {
      setEditorError("Edit mode supports one district at a time.");
      return;
    }
    setSaving(true);
    setEditorError("");
    try {
      if (form.id) {
        await updateEngineerAssignment(form.id, {
          state: form.state,
          district: districtList[0],
          l1EngineerName,
          l2EngineerName,
          l1BackupEngineerName: l1BackupEngineerName || undefined,
        });
      } else {
        await createEngineerAssignment({
          state: form.state,
          districts: districtList,
          l1EngineerName,
          l2EngineerName,
          l1BackupEngineerName: l1BackupEngineerName || undefined,
        });
      }
      setEditorOpen(false);
      assignmentsRes.reload();
      optionsRes.reload();
      auditRes.reload();
      setToast(form.id ? "Mapping updated successfully." : `${districtList.length} district mapping${districtList.length > 1 ? "s" : ""} created.`);
    } catch (err) {
      setEditorError(err instanceof Error ? err.message : "Failed to save mapping.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: EngineerAssignment) => {
    if (!window.confirm(`Delete mapping for ${row.state} / ${row.district}?`)) return;
    try {
      await deleteEngineerAssignment(row.id);
      assignmentsRes.reload();
      optionsRes.reload();
      auditRes.reload();
      setToast("Mapping deleted.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete mapping.");
    }
  };

  const triggerImport = () => fileInput.current?.click();

  const onImportFile = async (file?: File | null) => {
    if (!file) return;
    setImporting(true);
    try {
      const result = await importEngineerAssignments(file);
      setToast(`Imported ${result.inserted} new, updated ${result.updated}.`);
      if (result.warnings.length) {
        window.alert(result.warnings.join("\n"));
      }
      assignmentsRes.reload();
      optionsRes.reload();
      auditRes.reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to import workbook.");
    } finally {
      setImporting(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const rebuildLoads = async () => {
    setImporting(true);
    try {
      await rebuildEngineerLoads();
      assignmentsRes.reload();
      setToast("Ticket load cache rebuilt.");
    } finally {
      setImporting(false);
    }
  };

  const cleanupStale = async () => {
    if (!window.confirm("Remove every mapping whose L1 or L2 engineer account no longer exists or is inactive? This deletes those state/district mappings permanently.")) return;
    setCleaning(true);
    try {
      const result = await cleanupStaleEngineerAssignments();
      assignmentsRes.reload();
      optionsRes.reload();
      auditRes.reload();
      const parts = [];
      if (result.removed) parts.push(`${result.removed} mapping${result.removed > 1 ? "s" : ""} removed`);
      if (result.backupCleared) parts.push(`${result.backupCleared} stale backup${result.backupCleared > 1 ? "s" : ""} cleared`);
      if (result.mastersDeleted) parts.push(`${result.mastersDeleted} old engineer${result.mastersDeleted > 1 ? "s" : ""} deleted for good`);
      setToast(parts.length ? parts.join(", ") + "." : "No stale mappings found.");
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to clean up stale mappings.");
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <input
        ref={fileInput}
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => onImportFile(e.target.files?.[0])}
      />

      {editorOpen && (
        <ModalShell
          title={form.id ? "Edit Mapping" : "Add New Mapping"}
          sub={form.id ? "Update one state and district mapping." : "Pick one L1 engineer, then map that state to one or many districts in a single save."}
          onClose={() => !saving && setEditorOpen(false)}
          footer={
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setEditorOpen(false)} disabled={saving} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:from-amber-400 hover:to-orange-400 disabled:opacity-60">
                {saving ? "Saving..." : "Save Mapping"}
              </button>
            </div>
          }
        >
          <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <SearchableSelect
                label="State"
                value={form.state}
                onChange={(next) => setForm((prev) => ({ ...prev, state: next, districts: [] }))}
                options={states.map((state) => ({ value: state, label: state }))}
                placeholder="Select state"
              />
              {form.id ? (
                <SearchableSelect
                  label="District"
                  value={form.districts[0] ?? ""}
                  onChange={(next) => setForm((prev) => ({ ...prev, districts: next ? [next] : [] }))}
                  options={selectedDistrictOptions.map((district) => ({ value: district, label: district }))}
                  placeholder={form.state ? "Select district" : "Select state first"}
                />
              ) : (
                <DistrictMultiSelect
                  label="Districts"
                  value={form.districts}
                  onChange={(next) => setForm((prev) => ({ ...prev, districts: next }))}
                  options={selectedDistrictOptions}
                  placeholder={form.state ? "Select one or more districts" : "Select state first"}
                />
              )}
              <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
                <div className="font-semibold">Bulk mapping tip</div>
                <div className="mt-1 leading-6">
                  Choose a state once, then assign the same L1, L2 and backup engineers to multiple districts together.
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <SearchableSelect
                label="L1 Engineer"
                value={form.l1EngineerId}
                onChange={(next) => setForm((prev) => ({ ...prev, l1EngineerId: next }))}
                options={l1EngineerOptions}
                placeholder="Search L1 engineer"
              />
              <SearchableSelect
                label="L2 Engineer"
                value={form.l2EngineerId}
                onChange={(next) => setForm((prev) => ({ ...prev, l2EngineerId: next }))}
                options={l2EngineerOptions}
                placeholder="Search L2 engineer"
              />
              <SearchableSelect
                label="L1 Backup Engineer"
                value={form.l1BackupEngineerId}
                onChange={(next) => setForm((prev) => ({ ...prev, l1BackupEngineerId: next }))}
                options={backupEngineerOptions}
                placeholder="Search backup engineer"
              />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-800">Saved shape</div>
                <div className="mt-1 leading-6">
                  The system still stores one row per district, so complaint routing keeps working without any change.
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Backup picker shows both L1 and L2 engineers. Dropdowns only list active engineer accounts — removed or deactivated accounts drop off automatically.
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              <IconClipboardList size={14} />
              Mapping Rules
            </div>
            <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
              <div>• One save can create many district mappings for the same engineer.</div>
              <div>• State + District stays unique underneath.</div>
              <div>• Repeated engineer names are allowed across many districts.</div>
              <div>• Edit mode still updates a single district at a time.</div>
            </div>
          </div>
          {editorError && <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{editorError}</div>}
        </ModalShell>
      )}
      {auditOpen && (
        <ModalShell
          title="Audit History"
          sub="Change tracking for assignment updates and imports."
          onClose={() => setAuditOpen(false)}
        >
          <Table headers={["Action", "State", "District", "By", "Time", "Note"]}>
            {(auditRes.data?.data ?? []).length === 0 ? (
              <TR>
                <TD colSpan={6} className="py-10 text-center text-slate-400">No audit records found.</TD>
              </TR>
            ) : (
              (auditRes.data?.data ?? []).map((item: EngineerAssignmentAudit) => (
                <TR key={item.id}>
                  <TD><Badge color={item.action === "deleted" ? "red" : item.action === "updated" ? "yellow" : item.action === "created" ? "green" : "blue"}>{item.action}</Badge></TD>
                  <TD className="font-medium text-slate-900">{item.state ?? "â€”"}</TD>
                  <TD className="text-slate-600">{item.district ?? "â€”"}</TD>
                  <TD className="text-slate-600">{item.byName ?? item.by ?? "System"}</TD>
                  <TD className="text-slate-500 whitespace-nowrap">{formatDate(item.createdAt)}</TD>
                  <TD className="text-slate-500">{item.note ?? "â€”"}</TD>
                </TR>
              ))
            )}
          </Table>
        </ModalShell>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[90] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-xl shadow-emerald-200/60">
          {toast}
        </div>
      )}

      <PageHeader
        title="Engineer Assignment Management"
        sub="Map one engineer across one or many districts in a single save."
        action={<PrimaryBtn onClick={openCreate}><IconPlus size={16} /> Add New Mapping</PrimaryBtn>}
      />

      <div className="mb-5 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">{stat.label}</div>
                <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">{stat.value}</div>
                <div className="mt-1 text-xs text-slate-500">{stat.hint}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-amber-100 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,#fff, #fff7ed)] p-5 shadow-[0_20px_60px_rgba(251,191,36,0.15)]">
          <div className="text-[11px] font-black uppercase tracking-[0.32em] text-amber-600">Import Rules</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div>â€¢ Import from `.xlsx` only.</div>
            <div>â€¢ State + District is the unique key.</div>
            <div>â€¢ Repeated engineer names are allowed.</div>
            <div>â€¢ Backup engineer is preserved when present in the workbook.</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={triggerImport} disabled={importing} className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-60">
              <IconUpload size={16} /> Bulk Import via Excel
            </button>
            <button type="button" onClick={() => setAuditOpen(true)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Audit History
            </button>
            <button type="button" onClick={rebuildLoads} disabled={importing} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
              <IconRefresh size={16} /> Rebuild Loads
            </button>
            <button type="button" onClick={cleanupStale} disabled={cleaning} className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60">
              <IconTrash size={16} /> {cleaning ? "Cleaning…" : "Remove Stale Mappings"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1.2fr_0.6fr_0.6fr]">
            <SearchBar value={q} onChange={setQ} />
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">State Filter</label>
              <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100">
                <option value="">All states</option>
                {states.map((state) => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">District Filter</label>
              <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100">
                <option value="">All districts</option>
                {districts.map((district) => <option key={district} value={district}>{district}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={openCreate} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add New Mapping
            </button>
            <button type="button" onClick={triggerImport} disabled={importing} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
              Bulk Import via Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <Table headers={["State", "District", "L1 Engineer", "L2 Engineer", "L1 Backup", "Queue Load", "Actions"]}>
          {assignmentsRes.loading ? (
            <TR>
              <TD colSpan={7} className="py-10 text-center text-slate-400">Loading mappingsâ€¦</TD>
            </TR>
          ) : assignmentsRes.error ? (
            <TR>
              <TD colSpan={7} className="py-10 text-center text-rose-600">{assignmentsRes.error}</TD>
            </TR>
          ) : assignments.length === 0 ? (
            <TR>
              <TD colSpan={7} className="py-10 text-center text-slate-400">No mappings found.</TD>
            </TR>
          ) : (
            assignments.map((row, index) => (
              <TR key={row.id} zebra={index % 2 === 1}>
                <TD className="font-semibold text-slate-900">{row.state}</TD>
                <TD className="text-slate-700">{row.district}</TD>
                <TD>
                  <Badge color={roleTint(row.l1Engineer?.role)}>{engineerLabel(row.l1Engineer)}</Badge>
                </TD>
                <TD>
                  <Badge color={roleTint(row.l2Engineer?.role)}>{engineerLabel(row.l2Engineer)}</Badge>
                </TD>
                <TD>
                  <Badge color={roleTint(row.l1BackupEngineer?.role)}>{engineerLabel(row.l1BackupEngineer)}</Badge>
                </TD>
                <TD>
                  <div className="text-sm font-semibold text-slate-800">{formatCountLabel(row.l1Load)}</div>
                  <div className="text-xs text-slate-400">L1 queue load cache</div>
                </TD>
                <TD>
                  <ActionBtns onEdit={() => openEdit(row)} onDelete={() => remove(row)} />
                </TD>
              </TR>
            ))
          )}
        </Table>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Showing {assignments.length} of {total} mappings
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              {[10, 20, 50].map((size) => <option key={size} value={size}>{size} / page</option>)}
            </select>
            <button type="button" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
              Prev
            </button>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              Page {page} of {totalPages}
            </div>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function useAsyncData<T>(loader: () => Promise<T>, deps: ReadonlyArray<unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loader()
      .then((next) => {
        if (cancelled) return;
        setData(next);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return {
    data,
    loading,
    error,
    reload: () => {
      setLoading(true);
      setError("");
      setNonce((next) => next + 1);
    },
  };
}



