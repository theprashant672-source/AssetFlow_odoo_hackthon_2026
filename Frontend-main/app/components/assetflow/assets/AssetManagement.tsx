"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SectionPanel from "../cards/SectionPanel";
import AssetQrModal from "./AssetQrModal";
import { exportAssetReportPdf, exportQrLabelsPdf } from "@/app/lib/assetflowPdf";

export default function AssetManagement() {
  const [assets, setAssets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [qrAsset, setQrAsset] = useState<any | null>(null);
  const [exportingLabels, setExportingLabels] = useState(false);

  const [formData, setFormData] = useState({
    tag: "",
    name: "",
    categoryId: "",
    departmentId: "",
    location: "",
    status: "Available",
    condition: "New",
  });

  const fetchData = async () => {
    try {
      const [assetsRes, catRes, deptRes] = await Promise.all([
        fetch("http://localhost:5000/api/assets"),
        fetch("http://localhost:5000/api/organization/categories"),
        fetch("http://localhost:5000/api/organization/departments")
      ]);

      if (assetsRes.ok) setAssets(await assetsRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (deptRes.ok) setDepartments(await deptRes.json());
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
      const selectedCat = categories.find(c => c.id === formData.categoryId);
      const selectedDept = departments.find(d => d.id === formData.departmentId);

      const payload = {
        ...formData,
        categoryName: selectedCat ? selectedCat.name : "Uncategorized",
        departmentName: selectedDept ? selectedDept.name : "Unassigned",
      };

      const res = await fetch("http://localhost:5000/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ tag: "", name: "", categoryId: "", departmentId: "", location: "", status: "Available", condition: "New" });
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assets</h1>
          <p className="mt-2 text-slate-600">Register and manage company assets.</p>
        </div>
        {!isCreating && (
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/scan" className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              📷 Scan QR
            </Link>
            <button
              onClick={async () => {
                if (assets.length === 0 || exportingLabels) return;
                setExportingLabels(true);
                try {
                  await exportQrLabelsPdf(assets, window.location.origin);
                } finally {
                  setExportingLabels(false);
                }
              }}
              disabled={assets.length === 0 || exportingLabels}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {exportingLabels ? "Preparing..." : "🏷️ QR Labels PDF"}
            </button>
            <button
              onClick={() => assets.length > 0 && exportAssetReportPdf(assets)}
              disabled={assets.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              📄 Export PDF
            </button>
            <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
              + Register Asset
            </button>
          </div>
        )}
      </div>

      {qrAsset && <AssetQrModal asset={qrAsset} onClose={() => setQrAsset(null)} />}

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">Register New Asset</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Tag / ID</label>
              <input type="text" required placeholder="e.g. AF-LAP-001" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Asset Name / Model</label>
              <input type="text" required placeholder="e.g. MacBook Pro 14" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department Owner (Optional)</label>
              <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                <option value="">Unassigned</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Current Location</label>
              <input type="text" required placeholder="e.g. HQ Floor 4" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Condition</label>
              <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
            <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button type="submit" className="rounded-xl bg-[#5b3df5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4b30d6] transition-colors">Register Asset</button>
          </div>
        </form>
      )}

      <SectionPanel title="Asset Inventory" subtitle="All registered assets in the system">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Tag</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {assets.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">No assets found. Click "Register Asset" to add one.</td>
                </tr>
              )}
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{asset.tag}</td>
                  <td className="p-4 font-medium">{asset.name}</td>
                  <td className="p-4">{asset.categoryName}</td>
                  <td className="p-4">{asset.departmentName}</td>
                  <td className="p-4">{asset.location}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      asset.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      asset.status === 'Allocated' ? 'bg-violet-100 text-violet-800' :
                      asset.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setQrAsset(asset)} className="text-slate-600 hover:text-[#5b3df5] font-medium" title="Show QR code">
                        QR
                      </button>
                      <button className="text-[#5b3df5] hover:underline font-medium">Manage</button>
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
