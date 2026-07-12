"use client";

import { useState, useEffect } from "react";
import SectionPanel from "../cards/SectionPanel";
import { IconChartBar, IconCoins, IconUsers, IconTag } from "../../icons/Icons";

export default function AnalyticsDashboard() {
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
        <div className="text-slate-500 font-medium animate-pulse">Computing executive analytics...</div>
      </div>
    );
  }

  const { metrics } = data;
  
  const avgAssetValue = 1200; // Mock $1,200 per asset
  const totalValue = metrics.totalAssets * avgAssetValue;
  const maintenanceCost = metrics.maintenanceAssets * 350; // Mock $350 repair avg
  const utilizationRate = metrics.totalAssets > 0 
    ? Math.round((metrics.allocatedAssets / metrics.totalAssets) * 100) 
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Analytics</h1>
          <p className="mt-2 text-slate-600">Financial insights, depreciation trends, and ROI analysis.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 outline-none">
            <option>Last 30 Days</option>
            <option>Q3 2026</option>
            <option>YTD 2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 text-slate-300 font-medium text-sm mb-4">
            <IconCoins size={18} />
            Total Asset Portfolio Value
          </div>
          <div className="text-4xl font-black tracking-tight">${totalValue.toLocaleString()}</div>
          <div className="mt-4 text-xs font-semibold text-emerald-400 bg-emerald-400/10 inline-block px-2 py-1 rounded-full">
            ↑ 12% vs last quarter
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 font-medium text-sm mb-4">
            <IconChartBar size={18} />
            Global Utilization Rate
          </div>
          <div className="text-4xl font-black tracking-tight text-slate-900">{utilizationRate}%</div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#5b3df5] h-full rounded-full" style={{ width: `${utilizationRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 font-medium text-sm mb-4">
            <IconWrenchPlaceholder />
            Est. Maintenance Costs
          </div>
          <div className="text-4xl font-black tracking-tight text-rose-600">${maintenanceCost.toLocaleString()}</div>
          <div className="mt-4 text-xs font-semibold text-slate-500">
            Based on {metrics.maintenanceAssets} assets currently in repair.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionPanel title="Depreciation Forecast" subtitle="Projected value loss over next 12 months">
          <div className="p-8 flex flex-col items-center justify-center min-h-[250px] bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <IconChartBar size={48} className="text-slate-300 mb-4" />
            <p className="text-sm font-medium text-slate-500 text-center max-w-sm">
              Connect to your ERP or Accounting software to unlock real-time MACRS depreciation schedules.
            </p>
            <button className="mt-4 px-4 py-2 text-sm font-bold text-[#5b3df5] bg-[#5b3df5]/10 rounded-full hover:bg-[#5b3df5]/20 transition-colors">
              Integrate Accounting Software
            </button>
          </div>
        </SectionPanel>

        <SectionPanel title="Cost Center Allocation" subtitle="Where is your capital deployed?">
           <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-700">Engineering & Product</span>
                    <span className="text-slate-900">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-700">Sales & Marketing</span>
                    <span className="text-slate-900">30%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-700">Operations & HR</span>
                    <span className="text-slate-900">15%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-700">Unallocated / Float</span>
                    <span className="text-slate-900">10%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-300 h-full rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
           </div>
        </SectionPanel>
      </div>
    </div>
  );
}

function IconWrenchPlaceholder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  );
}
