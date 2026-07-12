"use client";

import { useState } from "react";
import {
  saveDepartment, saveCategory, saveEmployee, currentUserEmail,
  type Department, type Employee, type EmployeeRole,
} from "@/app/lib/store";
import { useDB, Panel, Badge, Button, Field, inputCls, Table, EmptyRow, Tabs, Alert } from "./shared";

const ROLES: EmployeeRole[] = ["Employee", "Department Head", "Asset Manager", "Admin"];

export default function OrganizationModule({ initialTab = "departments", canEdit = true }: {
  initialTab?: "departments" | "categories" | "employees"; canEdit?: boolean;
}) {
  const [tab, setTab] = useState<string>(initialTab);
  return (
    <div className="grid gap-5">
      <Tabs
        tabs={[
          { key: "departments", label: "Departments" },
          { key: "categories", label: "Asset Categories" },
          { key: "employees", label: "Employee Directory" },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === "departments" && <DepartmentsTab canEdit={canEdit} />}
      {tab === "categories" && <CategoriesTab canEdit={canEdit} />}
      {tab === "employees" && <EmployeesTab canEdit={canEdit} />}
    </div>
  );
}

function DepartmentsTab({ canEdit }: { canEdit: boolean }) {
  const db = useDB();
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [parent, setParent] = useState("");
  const [msg, setMsg] = useState("");

  const create = () => {
    if (!name.trim()) { setMsg("Enter a department name."); return; }
    saveDepartment({ name: name.trim(), headEmail: head || undefined, parentId: parent || undefined }, currentUserEmail());
    setName(""); setHead(""); setParent("");
    setMsg(`Department "${name.trim()}" created.`);
  };

  const toggleStatus = (d: Department) => {
    saveDepartment({ ...d, status: d.status === "Active" ? "Inactive" : "Active" }, currentUserEmail());
  };

  return (
    <div className="grid gap-5">
      {canEdit && (
        <Panel title="Create department" subtitle="Assign a head and optional parent for hierarchy.">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Design" />
            </Field>
            <Field label="Department head">
              <select className={inputCls} value={head} onChange={(e) => setHead(e.target.value)}>
                <option value="">— none —</option>
                {db.employees.map((e) => <option key={e.id} value={e.email}>{e.name}</option>)}
              </select>
            </Field>
            <Field label="Parent department">
              <select className={inputCls} value={parent} onChange={(e) => setParent(e.target.value)}>
                <option value="">— none —</option>
                {db.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={create}>Create department</Button>
            {msg && <span className="text-sm text-odoo-700">{msg}</span>}
          </div>
        </Panel>
      )}

      <Panel title="Departments" subtitle={`${db.departments.length} total`}>
        <Table headers={["Name", "Head", "Parent", "Status", ...(canEdit ? ["Action"] : [])]}>
          {db.departments.map((d) => {
            const headEmp = db.employees.find((e) => e.email === d.headEmail);
            const parentDep = db.departments.find((p) => p.id === d.parentId);
            return (
              <tr key={d.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{d.name}</td>
                <td className="px-4 py-3">{headEmp?.name ?? "—"}</td>
                <td className="px-4 py-3">{parentDep?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge tone={d.status === "Active" ? "green" : "slate"}>{d.status}</Badge>
                </td>
                {canEdit && (
                  <td className="px-4 py-3">
                    <Button tone="ghost" onClick={() => toggleStatus(d)}>
                      {d.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
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

function CategoriesTab({ canEdit }: { canEdit: boolean }) {
  const db = useDB();
  const [name, setName] = useState("");
  const [custom, setCustom] = useState("");
  const [msg, setMsg] = useState("");

  const create = () => {
    if (!name.trim()) { setMsg("Enter a category name."); return; }
    saveCategory({ name: name.trim(), customField: custom.trim() || undefined }, currentUserEmail());
    setName(""); setCustom("");
    setMsg(`Category "${name.trim()}" created.`);
  };

  return (
    <div className="grid gap-5">
      {canEdit && (
        <Panel title="Create category" subtitle="Optional category-specific field, e.g. warranty period.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics" />
            </Field>
            <Field label="Category-specific field (optional)">
              <input className={inputCls} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. Warranty period" />
            </Field>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={create}>Create category</Button>
            {msg && <span className="text-sm text-odoo-700">{msg}</span>}
          </div>
        </Panel>
      )}

      <Panel title="Asset categories" subtitle={`${db.categories.length} total`}>
        <Table headers={["Name", "Custom field", "Assets in category"]}>
          {db.categories.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
              <td className="px-4 py-3">{c.customField ?? "—"}</td>
              <td className="px-4 py-3">{db.assets.filter((a) => a.categoryId === c.id).length}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </div>
  );
}

function EmployeesTab({ canEdit }: { canEdit: boolean }) {
  const db = useDB();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [msg, setMsg] = useState("");

  const add = () => {
    if (!name.trim() || !email.trim()) { setMsg("Name and email are required."); return; }
    saveEmployee({ name: name.trim(), email: email.trim(), departmentId: dept || undefined, role: "Employee" }, currentUserEmail());
    setName(""); setEmail(""); setDept("");
    setMsg("Employee added (role: Employee — promote below if needed).");
  };

  const promote = (emp: Employee, role: EmployeeRole) => {
    saveEmployee({ ...emp, role }, currentUserEmail());
  };

  const toggleStatus = (emp: Employee) => {
    saveEmployee({ ...emp, status: emp.status === "Active" ? "Inactive" : "Active" }, currentUserEmail());
  };

  return (
    <div className="grid gap-5">
      {canEdit && (
        <>
          <Alert kind="info">
            Roles are assigned only here — signup always creates a plain Employee account, and the
            Admin promotes people to Department Head or Asset Manager from this directory.
          </Alert>
          <Panel title="Add employee" subtitle="New accounts always start as Employee.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Full name">
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aman Singh" />
              </Field>
              <Field label="Email">
                <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aman@odoo.com" />
              </Field>
              <Field label="Department">
                <select className={inputCls} value={dept} onChange={(e) => setDept(e.target.value)}>
                  <option value="">— none —</option>
                  {db.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button onClick={add}>Add employee</Button>
              {msg && <span className="text-sm text-odoo-700">{msg}</span>}
            </div>
          </Panel>
        </>
      )}

      <Panel title="Employee directory" subtitle={`${db.employees.length} people`}>
        <Table headers={["Name", "Email", "Department", "Role", "Status", ...(canEdit ? ["Promote / demote", "Action"] : [])]}>
          {db.employees.length === 0 && <EmptyRow span={7} message="No employees yet." />}
          {db.employees.map((e) => {
            const d = db.departments.find((x) => x.id === e.departmentId);
            return (
              <tr key={e.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{e.name}</td>
                <td className="px-4 py-3">{e.email}</td>
                <td className="px-4 py-3">{d?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge tone={e.role === "Admin" ? "purple" : e.role === "Employee" ? "slate" : "amber"}>{e.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={e.status === "Active" ? "green" : "slate"}>{e.status}</Badge>
                </td>
                {canEdit && (
                  <>
                    <td className="px-4 py-3">
                      <select
                        className={inputCls}
                        value={e.role}
                        onChange={(ev) => promote(e, ev.target.value as EmployeeRole)}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Button tone="ghost" onClick={() => toggleStatus(e)}>
                        {e.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </Table>
      </Panel>
    </div>
  );
}
