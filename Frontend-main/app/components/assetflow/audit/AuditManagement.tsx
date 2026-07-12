"use client";

import { useState, useEffect } from "react";
import SectionPanel from "../cards/SectionPanel";

export default function AuditManagement() {
  const [audits, setAudits] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeAuditId, setActiveAuditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    auditorName: "",
    totalAssetsExpected: "",
    notes: "",
  });

  const [completeData, setCompleteData] = useState({
    totalAssetsVerified: "",
    discrepanciesCount: "",
  });

  const fetchAudits = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/audit");
      if (res.ok) setAudits(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        totalAssetsExpected: parseInt(formData.totalAssetsExpected) || 0,
      };

      const res = await fetch("http://localhost:5000/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ title: "", auditorName: "", totalAssetsExpected: "", notes: "" });
        fetchAudits();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStart = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/audit/${id}/start`, {
        method: "PUT"
      });
      if (res.ok) fetchAudits();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAuditId) return;

    try {
      const payload = {
        totalAssetsVerified: parseInt(completeData.totalAssetsVerified) || 0,
        discrepanciesCount: parseInt(completeData.discrepanciesCount) || 0,
      };

      const res = await fetch(`http://localhost:5000/api/audit/${activeAuditId}/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setActiveAuditId(null);
        setCompleteData({ totalAssetsVerified: "", discrepanciesCount: "" });
        fetchAudits();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid gap-6 p-8">
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Asset Audit</h1>
          <p className="mt-2 text-slate-600">Plan and execute physical inventory audits.</p>
        </div>
        {!isCreating && !activeAuditId && (
          <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
            + Plan New Audit
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Plan Audit Cycle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Audit Title</label>
              <input type="text" required placeholder="e.g. Q4 2026 HQ Inventory" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lead Auditor Name</label>
              <input type="text" required placeholder="e.g. Jane Smith" value={formData.auditorName} onChange={e => setFormData({...formData, auditorName: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total Assets Expected</label>
              <input type="number" required placeholder="0" value={formData.totalAssetsExpected} onChange={e => setFormData({...formData, totalAssetsExpected: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Audit Notes</label>
              <input type="text" placeholder="Scope, locations..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
            <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#5b3df5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4b30d6] transition-colors">Save Audit Plan</button>
          </div>
        </form>
      )}

      {activeAuditId && (
        <form onSubmit={handleCompleteSubmit} className="mb-6 bg-amber-50 p-6 rounded-2xl border border-amber-200 shadow-sm">
          <h3 className="font-bold text-lg text-amber-900 mb-6">Complete Audit Cycle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Total Assets Physically Verified</label>
              <input type="number" required placeholder="0" value={completeData.totalAssetsVerified} onChange={e => setCompleteData({...completeData, totalAssetsVerified: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Discrepancies / Missing Assets</label>
              <input type="number" required placeholder="0" value={completeData.discrepanciesCount} onChange={e => setCompleteData({...completeData, discrepanciesCount: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8 border-t border-amber-200/50 pt-6">
            <button type="button" onClick={() => setActiveAuditId(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button type="submit" className="rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 transition-colors">Mark Completed</button>
          </div>
        </form>
      )}

      <SectionPanel title="Audit History & Plans" subtitle="Monitor the status of physical inventory checks">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Auditor</th>
                <th className="p-4 font-semibold">Expected</th>
                <th className="p-4 font-semibold">Verified</th>
                <th className="p-4 font-semibold">Discrepancies</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {audits.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">No audits planned.</td>
                </tr>
              )}
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{audit.title}</td>
                  <td className="p-4 font-medium">{audit.auditorName}</td>
                  <td className="p-4">{audit.totalAssetsExpected || 0}</td>
                  <td className="p-4">{audit.totalAssetsVerified ?? "—"}</td>
                  <td className="p-4">
                    {audit.discrepanciesCount !== undefined ? (
                      <span className={audit.discrepanciesCount > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                        {audit.discrepanciesCount}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      audit.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
                      audit.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {audit.status === "Planned" && (
                      <button onClick={() => handleStart(audit.id)} className="text-[#5b3df5] hover:underline font-medium">Start Audit</button>
                    )}
                    {audit.status === "In Progress" && (
                      <button onClick={() => setActiveAuditId(audit.id)} className="text-amber-600 hover:underline font-medium">Complete</button>
                    )}
                    {audit.status === "Completed" && (
                      <span className="text-slate-400">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>
    </div>
  );
}
