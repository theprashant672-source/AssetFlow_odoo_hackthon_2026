"use client";

// Client-side data store for the AssetFlow demo. Persists to localStorage so
// every workflow (allocation conflicts, booking overlaps, maintenance
// approvals, audit cycles) works end-to-end without a backend.

export type AssetStatus =
  | "Available"
  | "Allocated"
  | "Reserved"
  | "Under Maintenance"
  | "Lost"
  | "Retired"
  | "Disposed";

export type Department = {
  id: string;
  name: string;
  headEmail?: string;
  parentId?: string;
  status: "Active" | "Inactive";
};

export type Category = {
  id: string;
  name: string;
  customField?: string; // e.g. "Warranty period" for Electronics
};

export type EmployeeRole = "Admin" | "Asset Manager" | "Department Head" | "Employee";

export type Employee = {
  id: string;
  name: string;
  email: string;
  departmentId?: string;
  role: EmployeeRole;
  status: "Active" | "Inactive";
};

export type Asset = {
  id: string;
  tag: string; // AF-0001
  name: string;
  categoryId: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionCost: number;
  condition: "New" | "Good" | "Fair" | "Poor";
  location: string;
  bookable: boolean;
  status: AssetStatus;
  holderEmail?: string;
  holderDepartmentId?: string;
  expectedReturn?: string;
};

export type AllocationRecord = {
  id: string;
  assetId: string;
  holderEmail?: string;
  departmentId?: string;
  allocatedAt: string;
  expectedReturn?: string;
  returnedAt?: string;
  checkinNotes?: string;
  allocatedBy: string;
};

export type TransferRequest = {
  id: string;
  assetId: string;
  fromEmail?: string;
  toEmail: string;
  requestedBy: string;
  requestedAt: string;
  status: "Requested" | "Approved" | "Rejected";
  decidedBy?: string;
  decidedAt?: string;
};

export type Booking = {
  id: string;
  assetId: string;
  bookedBy: string;
  start: string; // ISO
  end: string;
  purpose: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
};

export type MaintenanceStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Technician Assigned"
  | "In Progress"
  | "Resolved";

export type MaintenanceRequest = {
  id: string;
  assetId: string;
  issue: string;
  priority: "Low" | "Medium" | "High";
  raisedBy: string;
  raisedAt: string;
  status: MaintenanceStatus;
  technician?: string;
  decidedBy?: string;
  resolvedAt?: string;
};

export type AuditItemResult = "Pending" | "Verified" | "Missing" | "Damaged";

export type AuditCycle = {
  id: string;
  name: string;
  scope: string; // department name or location
  startDate: string;
  endDate: string;
  auditors: string[];
  status: "Open" | "Closed";
  items: { assetId: string; result: AuditItemResult; note?: string }[];
  closedAt?: string;
};

export type Notification = {
  id: string;
  at: string;
  kind: string;
  message: string;
  forRole?: string;
  read: boolean;
};

export type ActivityEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
};

export type DB = {
  version: number;
  departments: Department[];
  categories: Category[];
  employees: Employee[];
  assets: Asset[];
  allocations: AllocationRecord[];
  transfers: TransferRequest[];
  bookings: Booking[];
  maintenance: MaintenanceRequest[];
  audits: AuditCycle[];
  notifications: Notification[];
  activity: ActivityEntry[];
};

const KEY = "assetflow:db:v4";

let db: DB | null = null;
const listeners = new Set<() => void>();

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function nowIso() {
  return new Date().toISOString();
}

function daysFromNow(days: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function seed(): DB {
  const dep = (id: string, name: string, headEmail?: string, parentId?: string): Department => ({
    id, name, headEmail, parentId, status: "Active",
  });
  const departments: Department[] = [
    dep("d-it", "IT", "tl@odoo.com"),
    dep("d-ops", "Operations", "manager@odoo.com"),
    dep("d-hr", "HR"),
    dep("d-fin", "Finance", undefined, "d-ops"),
  ];
  const categories: Category[] = [
    { id: "c-elec", name: "Electronics", customField: "Warranty period" },
    { id: "c-furn", name: "Furniture" },
    { id: "c-veh", name: "Vehicles", customField: "Registration no." },
    { id: "c-room", name: "Meeting Rooms" },
    { id: "c-equip", name: "Equipment" },
  ];
  const emp = (name: string, email: string, departmentId: string, role: EmployeeRole): Employee => ({
    id: uid(), name, email, departmentId, role, status: "Active",
  });
  const employees: Employee[] = [
    emp("Super Admin", "superadmin@odoo.com", "d-it", "Admin"),
    emp("Asset Manager", "manager@odoo.com", "d-ops", "Asset Manager"),
    emp("Team Lead", "tl@odoo.com", "d-it", "Department Head"),
    emp("IT Service", "itservice@odoo.com", "d-it", "Asset Manager"),
    emp("Employee One", "employee@odoo.com", "d-ops", "Employee"),
    emp("Priya Sharma", "priya@odoo.com", "d-it", "Employee"),
    emp("Raj Verma", "raj@odoo.com", "d-ops", "Employee"),
    emp("Neha Gupta", "neha@odoo.com", "d-hr", "Employee"),
  ];
  let tagCounter = 0;
  const asset = (
    name: string, categoryId: string, cost: number, location: string,
    status: AssetStatus, extra: Partial<Asset> = {}
  ): Asset => {
    tagCounter += 1;
    return {
      id: uid(),
      tag: `AF-${String(tagCounter).padStart(4, "0")}`,
      name, categoryId,
      serialNumber: `SN-${1000 + tagCounter}`,
      acquisitionDate: "2025-04-01",
      acquisitionCost: cost,
      condition: "Good",
      location,
      bookable: false,
      status,
      ...extra,
    };
  };
  const assets: Asset[] = [
    asset("Dell Latitude 5440", "c-elec", 78000, "HQ Floor 2", "Allocated", {
      holderEmail: "priya@odoo.com", expectedReturn: daysFromNow(-2),
    }),
    asset("MacBook Pro 14", "c-elec", 195000, "HQ Floor 2", "Allocated", {
      holderEmail: "employee@odoo.com", expectedReturn: daysFromNow(12),
    }),
    asset("HP LaserJet Printer", "c-elec", 32000, "HQ Floor 1", "Available"),
    asset("Ergo Chair", "c-furn", 12000, "HQ Floor 3", "Available"),
    asset("Standing Desk", "c-furn", 24000, "HQ Floor 3", "Allocated", {
      holderDepartmentId: "d-hr", expectedReturn: daysFromNow(30),
    }),
    asset("Toyota Innova", "c-veh", 2200000, "Parking Bay 1", "Available", { bookable: true }),
    asset("Meeting Room B2", "c-room", 0, "HQ Floor 2", "Available", { bookable: true }),
    asset("Conference Room A1", "c-room", 0, "HQ Floor 1", "Available", { bookable: true }),
    asset("Epson Projector", "c-equip", 55000, "HQ Floor 2", "Available", { bookable: true }),
    asset("Canon DSLR Kit", "c-equip", 88000, "Media Room", "Under Maintenance"),
    asset("Lenovo ThinkPad X1", "c-elec", 145000, "HQ Floor 2", "Available"),
    asset("Server Rack Unit", "c-elec", 310000, "Server Room", "Reserved"),
  ];
  const roomB2 = assets.find((a) => a.name === "Meeting Room B2")!;
  const projector = assets.find((a) => a.name === "Epson Projector")!;
  const laptop = assets[0];
  const dslr = assets.find((a) => a.name === "Canon DSLR Kit")!;

  const allocations: AllocationRecord[] = [
    {
      id: uid(), assetId: laptop.id, holderEmail: "priya@odoo.com",
      allocatedAt: daysFromNow(-40), expectedReturn: daysFromNow(-2), allocatedBy: "manager@odoo.com",
    },
    {
      id: uid(), assetId: assets[1].id, holderEmail: "employee@odoo.com",
      allocatedAt: daysFromNow(-10), expectedReturn: daysFromNow(12), allocatedBy: "manager@odoo.com",
    },
    {
      id: uid(), assetId: assets[4].id, departmentId: "d-hr",
      allocatedAt: daysFromNow(-20), expectedReturn: daysFromNow(30), allocatedBy: "manager@odoo.com",
    },
    {
      id: uid(), assetId: assets[10].id, holderEmail: "raj@odoo.com",
      allocatedAt: daysFromNow(-90), returnedAt: daysFromNow(-30),
      checkinNotes: "Returned in good condition", allocatedBy: "manager@odoo.com",
    },
  ];
  const bookings: Booking[] = [
    {
      id: uid(), assetId: roomB2.id, bookedBy: "employee@odoo.com",
      start: daysFromNow(1, 9), end: daysFromNow(1, 10),
      purpose: "Sprint planning", status: "Upcoming",
    },
    {
      id: uid(), assetId: roomB2.id, bookedBy: "neha@odoo.com",
      start: daysFromNow(1, 14), end: daysFromNow(1, 15),
      purpose: "HR interviews", status: "Upcoming",
    },
    {
      id: uid(), assetId: projector.id, bookedBy: "raj@odoo.com",
      start: daysFromNow(2, 11), end: daysFromNow(2, 13),
      purpose: "Client demo", status: "Upcoming",
    },
  ];
  const maintenance: MaintenanceRequest[] = [
    {
      id: uid(), assetId: dslr.id, issue: "Lens autofocus not working",
      priority: "High", raisedBy: "raj@odoo.com", raisedAt: daysFromNow(-3),
      status: "In Progress", technician: "itservice@odoo.com", decidedBy: "manager@odoo.com",
    },
    {
      id: uid(), assetId: assets[2].id, issue: "Paper jam on tray 2",
      priority: "Low", raisedBy: "neha@odoo.com", raisedAt: daysFromNow(0, 9),
      status: "Pending",
    },
  ];
  const audits: AuditCycle[] = [
    {
      id: uid(), name: "Q3 IT Audit", scope: "IT / HQ Floor 2",
      startDate: daysFromNow(-5).slice(0, 10), endDate: daysFromNow(9).slice(0, 10),
      auditors: ["tl@odoo.com"], status: "Open",
      items: assets
        .filter((a) => a.location === "HQ Floor 2")
        .map((a, i) => ({ assetId: a.id, result: i === 0 ? "Verified" : "Pending" as AuditItemResult })),
    },
  ];
  const notifications: Notification[] = [
    {
      id: uid(), at: daysFromNow(0, 8), kind: "Overdue Return Alert",
      message: `Laptop ${laptop.tag} held by Priya Sharma is past its expected return date.`, read: false,
    },
    {
      id: uid(), at: daysFromNow(-1, 17), kind: "Maintenance In Progress",
      message: `Canon DSLR Kit repair assigned to IT Service.`, read: false,
    },
    {
      id: uid(), at: daysFromNow(-1, 12), kind: "Booking Confirmed",
      message: `Meeting Room B2 booked for Sprint planning.`, read: true,
    },
  ];
  const activity: ActivityEntry[] = [
    { id: uid(), at: daysFromNow(-1, 12), actor: "employee@odoo.com", action: "Booked Meeting Room B2 (Sprint planning)" },
    { id: uid(), at: daysFromNow(-3, 10), actor: "manager@odoo.com", action: "Approved maintenance for Canon DSLR Kit" },
    { id: uid(), at: daysFromNow(-10, 11), actor: "manager@odoo.com", action: "Allocated MacBook Pro 14 to employee@odoo.com" },
  ];

  return {
    version: 4,
    departments, categories, employees, assets, allocations,
    transfers: [], bookings, maintenance, audits, notifications, activity,
  };
}

function load(): DB {
  if (db) return db;
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed.version === 4) {
        db = parsed;
        return db;
      }
    }
  } catch {
    // fall through to seed
  }
  db = seed();
  persist();
  return db;
}

function persist() {
  if (typeof window === "undefined" || !db) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // storage full/unavailable — demo continues in memory
  }
}

function mutate(fn: (d: DB) => void) {
  const current = load();
  fn(current);
  db = { ...current };
  persist();
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDB(): DB {
  return load();
}

export function resetDemoData() {
  db = seed();
  persist();
  listeners.forEach((l) => l());
}

function pushNotification(d: DB, kind: string, message: string) {
  d.notifications.unshift({ id: uid(), at: nowIso(), kind, message, read: false });
}

function logActivity(d: DB, actor: string, action: string) {
  d.activity.unshift({ id: uid(), at: nowIso(), actor, action });
}

export function currentUserEmail(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/assetflow_identity=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export function findEmployee(d: DB, email?: string) {
  if (!email) return undefined;
  return d.employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
}

export function assetHolderLabel(d: DB, a: Asset): string {
  if (a.holderEmail) {
    const e = findEmployee(d, a.holderEmail);
    return e ? e.name : a.holderEmail;
  }
  if (a.holderDepartmentId) {
    const dept = d.departments.find((x) => x.id === a.holderDepartmentId);
    return dept ? `${dept.name} (dept)` : "Department";
  }
  return "—";
}

// ---------- Organization setup ----------

export function saveDepartment(input: Partial<Department> & { name: string }, actor: string) {
  mutate((d) => {
    if (input.id) {
      const t = d.departments.find((x) => x.id === input.id);
      if (t) Object.assign(t, input);
      logActivity(d, actor, `Updated department ${input.name}`);
    } else {
      d.departments.push({ id: uid(), status: "Active", ...input } as Department);
      logActivity(d, actor, `Created department ${input.name}`);
    }
  });
}

export function saveCategory(input: Partial<Category> & { name: string }, actor: string) {
  mutate((d) => {
    if (input.id) {
      const t = d.categories.find((x) => x.id === input.id);
      if (t) Object.assign(t, input);
      logActivity(d, actor, `Updated category ${input.name}`);
    } else {
      d.categories.push({ id: uid(), ...input } as Category);
      logActivity(d, actor, `Created category ${input.name}`);
    }
  });
}

export function saveEmployee(input: Partial<Employee> & { name: string; email: string }, actor: string) {
  mutate((d) => {
    const existing = input.id
      ? d.employees.find((x) => x.id === input.id)
      : d.employees.find((x) => x.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      const prevRole = existing.role;
      Object.assign(existing, input);
      if (input.role && input.role !== prevRole) {
        logActivity(d, actor, `Changed ${existing.name}'s role: ${prevRole} → ${input.role}`);
        pushNotification(d, "Role Updated", `${existing.name} is now ${input.role}.`);
      } else {
        logActivity(d, actor, `Updated employee ${existing.name}`);
      }
    } else {
      d.employees.push({ id: uid(), role: "Employee", status: "Active", ...input } as Employee);
      logActivity(d, actor, `Added employee ${input.name}`);
    }
  });
}

// ---------- Assets ----------

export function nextAssetTag(d: DB): string {
  const max = d.assets.reduce((m, a) => {
    const n = parseInt(a.tag.replace("AF-", ""), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `AF-${String(max + 1).padStart(4, "0")}`;
}

export function registerAsset(
  input: Omit<Asset, "id" | "tag" | "status">,
  actor: string
) {
  mutate((d) => {
    const tag = nextAssetTag(d);
    d.assets.push({ ...input, id: uid(), tag, status: "Available" });
    logActivity(d, actor, `Registered asset ${tag} (${input.name})`);
    pushNotification(d, "Asset Registered", `${input.name} entered the registry as ${tag}.`);
  });
}

export function updateAssetStatus(assetId: string, status: AssetStatus, actor: string) {
  mutate((d) => {
    const a = d.assets.find((x) => x.id === assetId);
    if (!a) return;
    a.status = status;
    if (status !== "Allocated") {
      a.holderEmail = undefined;
      a.holderDepartmentId = undefined;
      a.expectedReturn = undefined;
    }
    logActivity(d, actor, `Set ${a.tag} status to ${status}`);
  });
}

// ---------- Allocation / transfer / return ----------

export type AllocationResult = { ok: true } | { ok: false; reason: string; holder?: string };

export function allocateAsset(
  assetId: string,
  target: { holderEmail?: string; departmentId?: string },
  expectedReturn: string | undefined,
  actor: string
): AllocationResult {
  const d = load();
  const a = d.assets.find((x) => x.id === assetId);
  if (!a) return { ok: false, reason: "Asset not found." };
  if (a.status === "Allocated") {
    return { ok: false, reason: "Asset is already allocated.", holder: assetHolderLabel(d, a) };
  }
  if (a.status !== "Available" && a.status !== "Reserved") {
    return { ok: false, reason: `Asset is ${a.status} and cannot be allocated.` };
  }
  mutate((x) => {
    const asset = x.assets.find((y) => y.id === assetId)!;
    asset.status = "Allocated";
    asset.holderEmail = target.holderEmail;
    asset.holderDepartmentId = target.departmentId;
    asset.expectedReturn = expectedReturn;
    x.allocations.unshift({
      id: uid(), assetId, holderEmail: target.holderEmail, departmentId: target.departmentId,
      allocatedAt: nowIso(), expectedReturn, allocatedBy: actor,
    });
    const holder = assetHolderLabel(x, asset);
    logActivity(x, actor, `Allocated ${asset.tag} to ${holder}`);
    pushNotification(x, "Asset Assigned", `${asset.name} (${asset.tag}) assigned to ${holder}.`);
  });
  return { ok: true };
}

export function requestTransfer(assetId: string, toEmail: string, actor: string) {
  mutate((d) => {
    const a = d.assets.find((x) => x.id === assetId);
    if (!a) return;
    d.transfers.unshift({
      id: uid(), assetId, fromEmail: a.holderEmail, toEmail,
      requestedBy: actor, requestedAt: nowIso(), status: "Requested",
    });
    logActivity(d, actor, `Requested transfer of ${a.tag} to ${toEmail}`);
    pushNotification(d, "Transfer Requested", `${a.name} (${a.tag}) transfer requested to ${toEmail}.`);
  });
}

export function decideTransfer(transferId: string, approve: boolean, actor: string) {
  mutate((d) => {
    const t = d.transfers.find((x) => x.id === transferId);
    if (!t || t.status !== "Requested") return;
    t.status = approve ? "Approved" : "Rejected";
    t.decidedBy = actor;
    t.decidedAt = nowIso();
    const a = d.assets.find((x) => x.id === t.assetId);
    if (approve && a) {
      // close old allocation, open new one
      const open = d.allocations.find((al) => al.assetId === a.id && !al.returnedAt);
      if (open) {
        open.returnedAt = nowIso();
        open.checkinNotes = `Transferred to ${t.toEmail}`;
      }
      a.holderEmail = t.toEmail;
      a.holderDepartmentId = undefined;
      a.status = "Allocated";
      d.allocations.unshift({
        id: uid(), assetId: a.id, holderEmail: t.toEmail,
        allocatedAt: nowIso(), expectedReturn: a.expectedReturn, allocatedBy: actor,
      });
    }
    if (a) {
      logActivity(d, actor, `${approve ? "Approved" : "Rejected"} transfer of ${a.tag} to ${t.toEmail}`);
      pushNotification(d, approve ? "Transfer Approved" : "Transfer Rejected",
        `${a.name} (${a.tag}) transfer to ${t.toEmail} ${approve ? "approved" : "rejected"}.`);
    }
  });
}

export function returnAsset(assetId: string, checkinNotes: string, actor: string) {
  mutate((d) => {
    const a = d.assets.find((x) => x.id === assetId);
    if (!a) return;
    const open = d.allocations.find((al) => al.assetId === assetId && !al.returnedAt);
    if (open) {
      open.returnedAt = nowIso();
      open.checkinNotes = checkinNotes;
    }
    a.status = "Available";
    a.holderEmail = undefined;
    a.holderDepartmentId = undefined;
    a.expectedReturn = undefined;
    logActivity(d, actor, `Marked ${a.tag} returned (${checkinNotes || "no notes"})`);
    pushNotification(d, "Asset Returned", `${a.name} (${a.tag}) returned and available again.`);
  });
}

export function isOverdue(a: Asset): boolean {
  return a.status === "Allocated" && !!a.expectedReturn && new Date(a.expectedReturn) < new Date();
}

// ---------- Bookings ----------

export type BookingResult = { ok: true } | { ok: false; reason: string };

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(aEnd) > new Date(bStart);
}

export function createBooking(
  assetId: string, start: string, end: string, purpose: string, actor: string
): BookingResult {
  if (!start || !end) return { ok: false, reason: "Pick a start and end time." };
  if (new Date(end) <= new Date(start)) return { ok: false, reason: "End time must be after start time." };
  const d = load();
  const clash = d.bookings.find(
    (b) => b.assetId === assetId && b.status !== "Cancelled" && overlaps(start, end, b.start, b.end)
  );
  if (clash) {
    const s = new Date(clash.start), e = new Date(clash.end);
    return {
      ok: false,
      reason: `Overlaps an existing booking (${s.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} – ${e.toLocaleTimeString([], { timeStyle: "short" })} by ${clash.bookedBy}).`,
    };
  }
  mutate((x) => {
    const a = x.assets.find((y) => y.id === assetId);
    x.bookings.unshift({ id: uid(), assetId, bookedBy: actor, start, end, purpose, status: "Upcoming" });
    logActivity(x, actor, `Booked ${a?.name ?? "resource"} (${purpose})`);
    pushNotification(x, "Booking Confirmed", `${a?.name ?? "Resource"} booked: ${purpose}.`);
  });
  return { ok: true };
}

export function cancelBooking(bookingId: string, actor: string) {
  mutate((d) => {
    const b = d.bookings.find((x) => x.id === bookingId);
    if (!b) return;
    b.status = "Cancelled";
    const a = d.assets.find((x) => x.id === b.assetId);
    logActivity(d, actor, `Cancelled booking of ${a?.name ?? "resource"}`);
    pushNotification(d, "Booking Cancelled", `${a?.name ?? "Resource"} booking (${b.purpose}) cancelled.`);
  });
}

export function bookingLiveStatus(b: Booking): Booking["status"] {
  if (b.status === "Cancelled") return "Cancelled";
  const now = new Date();
  if (new Date(b.end) < now) return "Completed";
  if (new Date(b.start) <= now) return "Ongoing";
  return "Upcoming";
}

// ---------- Maintenance ----------

export function raiseMaintenance(
  assetId: string, issue: string, priority: MaintenanceRequest["priority"], actor: string
) {
  mutate((d) => {
    const a = d.assets.find((x) => x.id === assetId);
    d.maintenance.unshift({
      id: uid(), assetId, issue, priority, raisedBy: actor, raisedAt: nowIso(), status: "Pending",
    });
    logActivity(d, actor, `Raised maintenance request for ${a?.tag ?? assetId}`);
    pushNotification(d, "Maintenance Requested", `${a?.name ?? "Asset"}: ${issue}`);
  });
}

export function advanceMaintenance(
  requestId: string,
  action: "approve" | "reject" | "assign" | "start" | "resolve",
  actor: string,
  technician?: string
) {
  mutate((d) => {
    const r = d.maintenance.find((x) => x.id === requestId);
    if (!r) return;
    const a = d.assets.find((x) => x.id === r.assetId);
    if (action === "approve" && r.status === "Pending") {
      r.status = "Approved";
      r.decidedBy = actor;
      if (a) a.status = "Under Maintenance";
      pushNotification(d, "Maintenance Approved", `${a?.name ?? "Asset"} repair approved.`);
    } else if (action === "reject" && r.status === "Pending") {
      r.status = "Rejected";
      r.decidedBy = actor;
      pushNotification(d, "Maintenance Rejected", `${a?.name ?? "Asset"} request rejected.`);
    } else if (action === "assign" && r.status === "Approved") {
      r.status = "Technician Assigned";
      r.technician = technician || "itservice@odoo.com";
    } else if (action === "start" && r.status === "Technician Assigned") {
      r.status = "In Progress";
    } else if (action === "resolve" && (r.status === "In Progress" || r.status === "Technician Assigned")) {
      r.status = "Resolved";
      r.resolvedAt = nowIso();
      if (a) a.status = "Available";
      pushNotification(d, "Maintenance Resolved", `${a?.name ?? "Asset"} is available again.`);
    }
    logActivity(d, actor, `Maintenance ${r.status} — ${a?.tag ?? r.assetId}`);
  });
}

// ---------- Audits ----------

export function createAuditCycle(
  input: { name: string; scope: string; startDate: string; endDate: string; auditors: string[]; assetIds: string[] },
  actor: string
) {
  mutate((d) => {
    d.audits.unshift({
      id: uid(), name: input.name, scope: input.scope,
      startDate: input.startDate, endDate: input.endDate,
      auditors: input.auditors, status: "Open",
      items: input.assetIds.map((assetId) => ({ assetId, result: "Pending" as AuditItemResult })),
    });
    logActivity(d, actor, `Created audit cycle "${input.name}" (${input.assetIds.length} assets)`);
    pushNotification(d, "Audit Cycle Created", `"${input.name}" assigned to ${input.auditors.join(", ")}.`);
  });
}

export function markAuditItem(auditId: string, assetId: string, result: AuditItemResult, actor: string) {
  mutate((d) => {
    const c = d.audits.find((x) => x.id === auditId);
    if (!c || c.status === "Closed") return;
    const item = c.items.find((i) => i.assetId === assetId);
    if (!item) return;
    item.result = result;
    const a = d.assets.find((x) => x.id === assetId);
    logActivity(d, actor, `Audit "${c.name}": marked ${a?.tag ?? assetId} ${result}`);
    if (result === "Missing" || result === "Damaged") {
      pushNotification(d, "Audit Discrepancy Flagged", `${a?.name ?? "Asset"} marked ${result} in "${c.name}".`);
    }
  });
}

export function closeAuditCycle(auditId: string, actor: string) {
  mutate((d) => {
    const c = d.audits.find((x) => x.id === auditId);
    if (!c || c.status === "Closed") return;
    c.status = "Closed";
    c.closedAt = nowIso();
    for (const item of c.items) {
      const a = d.assets.find((x) => x.id === item.assetId);
      if (!a) continue;
      if (item.result === "Missing") {
        a.status = "Lost";
        a.holderEmail = undefined;
        a.holderDepartmentId = undefined;
      } else if (item.result === "Damaged" && a.status === "Available") {
        a.status = "Under Maintenance";
      }
    }
    const flagged = c.items.filter((i) => i.result === "Missing" || i.result === "Damaged").length;
    logActivity(d, actor, `Closed audit cycle "${c.name}" (${flagged} discrepancies)`);
    pushNotification(d, "Audit Cycle Closed", `"${c.name}" closed with ${flagged} discrepancies.`);
  });
}

// ---------- Notifications ----------

export function markAllNotificationsRead() {
  mutate((d) => {
    d.notifications.forEach((n) => (n.read = true));
  });
}

// ---------- KPIs ----------

export function computeKpis(d: DB) {
  const overdue = d.assets.filter(isOverdue);
  const upcomingReturns = d.assets.filter(
    (a) => a.status === "Allocated" && a.expectedReturn && new Date(a.expectedReturn) >= new Date()
  );
  const today = new Date().toDateString();
  return {
    available: d.assets.filter((a) => a.status === "Available").length,
    allocated: d.assets.filter((a) => a.status === "Allocated").length,
    maintenanceToday: d.maintenance.filter(
      (m) => !["Resolved", "Rejected"].includes(m.status) &&
        (m.status !== "Pending" || new Date(m.raisedAt).toDateString() === today)
    ).length,
    activeBookings: d.bookings.filter((b) => ["Upcoming", "Ongoing"].includes(bookingLiveStatus(b))).length,
    pendingTransfers: d.transfers.filter((t) => t.status === "Requested").length,
    upcomingReturns: upcomingReturns.length,
    overdueReturns: overdue.length,
  };
}
