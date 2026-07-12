"use client";

import { useState } from "react";
import SectionPanel from "../cards/SectionPanel";

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState("General");
  const [isSaved, setIsSaved] = useState(false);

  const tabs = ["General", "Notifications", "Security", "Integrations"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="grid gap-6 p-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Settings</h1>
        <p className="mt-2 text-slate-600">Configure workspace preferences, security, and alerts.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[#5b3df5] text-[#5b3df5]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <SectionPanel title={`${activeTab} Preferences`} subtitle={`Manage your ${activeTab.toLowerCase()} configuration`}>
        <form onSubmit={handleSave} className="p-6">
          {activeTab === "General" && (
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Workspace Name</label>
                  <input type="text" defaultValue="NovaAssets IMS" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Timezone</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>EST (Eastern Standard Time)</option>
                    <option>PST (Pacific Standard Time)</option>
                    <option>IST (Indian Standard Time)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                <input type="email" defaultValue="support@novaassets.com" className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="grid gap-4">
              {[
                { title: "Asset Checkout Alerts", desc: "Notify me when an asset is booked." },
                { title: "Maintenance Reminders", desc: "Weekly digest of overdue repairs." },
                { title: "Audit Completion", desc: "Email me when an audit cycle ends." },
              ].map((item, i) => (
                <label key={i} className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-[#5b3df5] rounded border-slate-300 focus:ring-[#5b3df5]" />
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{item.title}</div>
                    <div className="text-slate-500 text-xs mt-1">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {activeTab === "Security" && (
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Two-Factor Authentication (2FA)</label>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Currently Disabled</div>
                  <button type="button" className="px-4 py-2 text-sm font-semibold text-[#5b3df5] border border-[#5b3df5] rounded-lg hover:bg-[#5b3df5]/10 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Session Timeout</label>
                <select className="w-full md:w-1/2 p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                  <option>1 Hour</option>
                  <option>4 Hours</option>
                  <option>8 Hours</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "Integrations" && (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Slack", status: "Connected", color: "text-emerald-600 bg-emerald-50" },
                { name: "Jira Service Desk", status: "Connect", color: "text-slate-600 bg-slate-100" },
                { name: "Google Workspace", status: "Connect", color: "text-slate-600 bg-slate-100" },
                { name: "Azure Active Directory", status: "Connect", color: "text-slate-600 bg-slate-100" },
              ].map((app, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl">
                  <div className="font-semibold text-slate-800 text-sm">{app.name}</div>
                  <button type="button" className={`px-3 py-1 rounded-full text-xs font-bold ${app.color}`}>
                    {app.status}
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 flex items-center justify-between min-h-[80px]">
            <div>
              {isSaved && <span className="text-emerald-600 font-semibold text-sm animate-pulse">Settings saved successfully!</span>}
            </div>
            <button type="submit" className="rounded-xl bg-[#5b3df5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4b30d6] transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </SectionPanel>
    </div>
  );
}
