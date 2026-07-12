"use client";

import { useState, useEffect } from "react";
import SectionPanel from "../cards/SectionPanel";

export default function ReportsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/reports/summary")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 font-medium animate-pulse">Loading analytics data...</div>
      </div>
    );
  }

  const { metrics, distribution, recentActivity } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
          <p className="mt-2 text-slate-600">Enterprise overview of asset utilization, health, and activity.</p>
        </div>
        <button className="rounded-xl bg-white border border-slate-200 px-4 py-2 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          Export PDF
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Assets" value={metrics.totalAssets} color="bg-blue-50 text-blue-700" border="border-blue-200" />
        <MetricCard title="Available" value={metrics.availableAssets} color="bg-emerald-50 text-emerald-700" border="border-emerald-200" />
        <MetricCard title="Allocated" value={metrics.allocatedAssets} color="bg-violet-50 text-violet-700" border="border-violet-200" />
        <MetricCard title="In Maintenance" value={metrics.maintenanceAssets} color="bg-amber-50 text-amber-700" border="border-amber-200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        <SectionPanel title="Assets by Category" subtitle="Distribution across departments">
          <div className="p-4 grid gap-4">
            {distribution.byCategory.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No data available.</p>
            ) : (
              distribution.byCategory.map((cat: any, i: number) => {
                const percentage = Math.round((cat.count / metrics.totalAssets) * 100) || 0;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-semibold text-slate-700 truncate">{cat.name}</div>
                    <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#5b3df5] rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="w-12 text-right text-xs font-bold text-slate-500">{cat.count}</div>
                  </div>
                );
              })
            )}
          </div>
        </SectionPanel>

        
        <SectionPanel title="Asset Health" subtitle="Current condition of physical inventory">
          <div className="p-4 grid gap-4">
            {distribution.byCondition.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No data available.</p>
            ) : (
              distribution.byCondition.map((cond: any, i: number) => {
                const percentage = Math.round((cond.count / metrics.totalAssets) * 100) || 0;
                let barColor = "bg-blue-500";
                if (cond.name === "Excellent" || cond.name === "New") barColor = "bg-emerald-500";
                if (cond.name === "Good") barColor = "bg-blue-500";
                if (cond.name === "Fair") barColor = "bg-amber-500";
                if (cond.name === "Poor") barColor = "bg-rose-500";

                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-semibold text-slate-700">{cond.name}</div>
                    <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="w-12 text-right text-xs font-bold text-slate-500">{cond.count}</div>
                  </div>
                );
              })
            )}
          </div>
        </SectionPanel>
      </div>

      
      <SectionPanel title="Recent Asset Activity" subtitle="Latest bookings across the organization">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Activity Type</th>
                <th className="p-4 font-semibold">Asset / Detail</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentActivity.bookings.length === 0 && recentActivity.maintenance.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No recent activity found.</td>
                </tr>
              )}
              {recentActivity.bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">Booking</td>
                  <td className="p-4">{b.assetName}</td>
                  <td className="p-4">{b.userName}</td>
                  <td className="p-4">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800">
                      Checkout
                    </span>
                  </td>
                </tr>
              ))}
              {recentActivity.maintenance.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-900">Maintenance</td>
                  <td className="p-4">{m.assetName}</td>
                  <td className="p-4">{m.requestedBy}</td>
                  <td className="p-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Reported
                    </span>
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

function MetricCard({ title, value, color, border }: { title: string, value: number, color: string, border: string }) {
  return (
    <div className={`p-6 rounded-2xl border ${border} ${color} flex flex-col justify-center`}>
      <div className="text-sm font-semibold opacity-80 uppercase tracking-wider">{title}</div>
      <div className="text-4xl font-black mt-2 tracking-tight">{value}</div>
    </div>
  );
}
