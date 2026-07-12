"use client";

import { useState, useEffect, useRef } from "react";
import SectionPanel from "../cards/SectionPanel";
import { apiUrl } from "@/app/lib/assetflowApi";
import { exportMaintenanceReportPdf, exportMaintenanceTicketPdf } from "@/app/lib/assetflowPdf";

type TriageSuggestion = {
  priority: "Low" | "Medium" | "High" | "Critical";
  category: string;
  confidence: number;
  reasons: string[];
};

export default function MaintenanceManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [suggestion, setSuggestion] = useState<TriageSuggestion | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const triageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    assetId: "",
    requestedBy: "",
    issueDescription: "",
    priority: "Medium",
  });

  const fetchData = async () => {
    try {
      const [maintenanceRes, assetsRes] = await Promise.all([
        fetch("http://localhost:5000/api/maintenance"),
        fetch("http://localhost:5000/api/assets")
      ]);

      if (maintenanceRes.ok) setRequests(await maintenanceRes.json());
      if (assetsRes.ok) setAssets(await assetsRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, issueDescription: value }));
    if (triageTimer.current) clearTimeout(triageTimer.current);
    if (value.trim().length < 10) {
      setSuggestion(null);
      return;
    }
    triageTimer.current = setTimeout(async () => {
      setSuggesting(true);
      try {
        const res = await fetch(apiUrl("/api/ai/triage"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: value }),
        });
        if (res.ok) setSuggestion(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setSuggesting(false);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedAsset = assets.find(a => a.id === formData.assetId);
      const payload = {
        ...formData,
        assetName: selectedAsset ? selectedAsset.name : "Unknown Asset",
      };

      const res = await fetch("http://localhost:5000/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ assetId: "", requestedBy: "", issueDescription: "", priority: "Medium" });
        setSuggestion(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/maintenance/${id}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionNotes: "Resolved via UI" })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid gap-6 p-8">
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Maintenance & Repairs</h1>
          <p className="mt-2 text-slate-600">Track asset issues, schedule repairs, and resolve incidents.</p>
        </div>
        {!isCreating && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => requests.length > 0 && exportMaintenanceReportPdf(requests)}
              disabled={requests.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              📄 Export PDF
            </button>
            <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
              + Raise Request
            </button>
          </div>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Raise Maintenance Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Asset</label>
              <select required value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                <option value="">Choose an asset...</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Requested By</label>
              <input type="text" required placeholder="Your Name" value={formData.requestedBy} onChange={e => setFormData({...formData, requestedBy: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Issue Description</label>
              <textarea required placeholder="Describe the problem in detail..." value={formData.issueDescription} onChange={e => handleDescriptionChange(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" rows={3} />
              {suggesting && (
                <div className="mt-2 text-xs font-semibold text-slate-400 animate-pulse">✨ AI analyzing issue...</div>
              )}
              {suggestion && !suggesting && (
                <div className="mt-3 rounded-xl border border-[#5b3df5]/20 bg-[#5b3df5]/5 p-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold text-[#5b3df5]">✨ AI suggests:</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      suggestion.priority === "Critical" ? "bg-rose-100 text-rose-800" :
                      suggestion.priority === "High" ? "bg-orange-100 text-orange-800" :
                      suggestion.priority === "Medium" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-100 text-slate-700"
                    }`}>{suggestion.priority} priority</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">{suggestion.category}</span>
                    <span className="text-xs font-medium text-slate-500">{Math.round(suggestion.confidence * 100)}% confidence</span>
                    {formData.priority !== suggestion.priority && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, priority: suggestion.priority }))}
                        className="ml-auto rounded-lg bg-[#5b3df5] px-3 py-1 text-xs font-bold text-white hover:bg-[#4b30d6] transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  <div className="mt-1.5 text-xs text-slate-500">{suggestion.reasons.join(" · ")}</div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
            <button type="button" onClick={() => { setIsCreating(false); setSuggestion(null); }} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#5b3df5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4b30d6] transition-colors">Submit Request</button>
          </div>
        </form>
      )}

      <SectionPanel title="Active & Recent Requests" subtitle="Monitor the status of all repairs">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Asset</th>
                <th className="p-4 font-semibold">Requested By</th>
                <th className="p-4 font-semibold">Issue</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">No maintenance requests found.</td>
                </tr>
              )}
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{req.assetName}</td>
                  <td className="p-4">{req.requestedBy}</td>
                  <td className="p-4 truncate max-w-xs">{req.issueDescription}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      req.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      req.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      req.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      req.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => exportMaintenanceTicketPdf(req)} className="text-slate-600 hover:text-[#5b3df5] font-medium" title="Download ticket PDF">
                        PDF
                      </button>
                      {req.status === "Pending" || req.status === "In Progress" ? (
                        <button onClick={() => handleResolve(req.id)} className="text-emerald-600 hover:underline font-medium">Resolve</button>
                      ) : (
                        <span className="text-slate-400">Done</span>
                      )}
                    </div>
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
