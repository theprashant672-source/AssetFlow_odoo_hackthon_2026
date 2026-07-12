"use client";

import { useState, useEffect } from "react";
import SectionPanel from "../cards/SectionPanel";

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState<"departments" | "categories" | "employees">("departments");

  return (
    <div className="grid gap-6">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("departments")}
          className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "departments" ? "border-b-2 border-[#5b3df5] text-[#5b3df5]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Department Management
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "categories" ? "border-b-2 border-[#5b3df5] text-[#5b3df5]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Asset Category Management
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-3 text-sm font-semibold transition-colors ${activeTab === "employees" ? "border-b-2 border-[#5b3df5] text-[#5b3df5]" : "text-slate-500 hover:text-slate-800"}`}
        >
          Employee Directory
        </button>
      </div>

      <div className="mt-2">
        {activeTab === "departments" && <DepartmentManagement />}
        {activeTab === "categories" && <AssetCategoryManagement />}
        {activeTab === "employees" && <EmployeeDirectory />}
      </div>
    </div>
  );
}

function DepartmentManagement() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", headName: "", parentDepartment: "", status: "Active" });

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/organization/departments");
      if (res.ok) setDepartments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/organization/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ name: "", headName: "", parentDepartment: "", status: "Active" });
        fetchDepartments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SectionPanel title="Departments" subtitle="Create, edit, and deactivate departments">
      {isCreating ? (
        <form onSubmit={handleSubmit} className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200 grid gap-4 max-w-xl">
          <h3 className="font-semibold text-slate-900">Create New Department</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department Head</label>
            <input type="text" value={formData.headName} onChange={e => setFormData({...formData, headName: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Department</label>
            <input type="text" value={formData.parentDepartment} onChange={e => setFormData({...formData, parentDepartment: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5]" />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#5b3df5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b30d6]">Save Department</button>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex justify-end">
          <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
            + Create Department
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Department Head</th>
              <th className="p-4 font-semibold">Parent Department</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {departments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No departments found. Create one above.</td>
              </tr>
            )}
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td className="p-4 font-medium text-slate-900">{dept.name}</td>
                <td className="p-4">{dept.headName || "—"}</td>
                <td className="p-4 text-slate-400">{dept.parentDepartment || "—"}</td>
                <td className="p-4"><span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">{dept.status}</span></td>
                <td className="p-4 text-right"><button className="text-[#5b3df5] hover:underline font-medium">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionPanel>
  );
}

function AssetCategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", customFields: "" });

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/organization/categories");
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/organization/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ name: "", customFields: "" });
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SectionPanel title="Asset Categories" subtitle="Manage electronics, furniture, vehicles, and their fields">
      {isCreating ? (
        <form onSubmit={handleSubmit} className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-200 grid gap-4 max-w-xl">
          <h3 className="font-semibold text-slate-900">Create New Category</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Custom Fields (comma separated)</label>
            <input type="text" value={formData.customFields} onChange={e => setFormData({...formData, customFields: e.target.value})} placeholder="e.g. Warranty Period, OS Version" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5]" />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#5b3df5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b30d6]">Save Category</button>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex justify-end">
          <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
            + Add Category
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold">Category Name</th>
              <th className="p-4 font-semibold">Custom Fields</th>
              <th className="p-4 font-semibold">Total Assets</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No categories found. Create one above.</td>
              </tr>
            )}
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="p-4 font-medium text-slate-900">{cat.name}</td>
                <td className="p-4">{cat.customFields || "—"}</td>
                <td className="p-4">{cat.totalAssets || 0}</td>
                <td className="p-4 text-right"><button className="text-[#5b3df5] hover:underline font-medium">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionPanel>
  );
}

function EmployeeDirectory() {
  const [employees, setEmployees] = useState<any[]>([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/organization/employees");
      if (res.ok) setEmployees(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/organization/employees/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) fetchEmployees();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SectionPanel title="Employee Directory" subtitle="Manage roles, departments, and access">
      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <input type="text" placeholder="Search employees..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 outline-none focus:border-[#5b3df5]" />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {employees.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No employees found.</td>
              </tr>
            )}
            {employees.map(emp => (
              <tr key={emp.id}>
                <td className="p-4 font-medium text-slate-900">{emp.name}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">
                  <select 
                    value={emp.role} 
                    onChange={e => handleRoleChange(emp.id, e.target.value)}
                    className="bg-transparent border border-slate-200 rounded px-2 py-1 outline-none text-xs font-semibold text-slate-700 focus:border-[#5b3df5]"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Asset Manager</option>
                    <option value="head">Department Head</option>
                    <option value="admin">Admin</option>
                    <option value="founder">Founder</option>
                  </select>
                </td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${emp.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}`}>
                    {emp.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-[#5b3df5] hover:underline font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionPanel>
  );
}
