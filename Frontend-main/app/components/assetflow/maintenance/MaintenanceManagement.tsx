"use client";

import { useState, useEffect } from "react";
import SectionPanel from "../cards/SectionPanel";

export default function MaintenanceManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

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
          <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
            + Raise Request
          </button>
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
              <textarea required placeholder="Describe the problem in detail..." value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" rows={3} />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
            <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
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
                    {req.status === "Pending" || req.status === "In Progress" ? (
                      <button onClick={() => handleResolve(req.id)} className="text-emerald-600 hover:underline font-medium">Resolve</button>
                    ) : (
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
