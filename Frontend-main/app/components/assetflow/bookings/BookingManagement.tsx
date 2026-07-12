"use client";

import { useState, useEffect } from "react";
import SectionPanel from "../cards/SectionPanel";

export default function BookingManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    assetId: "",
    userName: "",
    bookingDate: "",
    expectedReturnDate: "",
    notes: "",
  });

  const fetchData = async () => {
    try {
      const [bookingsRes, assetsRes] = await Promise.all([
        fetch("http://localhost:5000/api/bookings"),
        fetch("http://localhost:5000/api/assets")
      ]);

      if (bookingsRes.ok) setBookings(await bookingsRes.json());
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

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsCreating(false);
        setFormData({ assetId: "", userName: "", bookingDate: "", expectedReturnDate: "", notes: "" });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/return`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const availableAssets = assets.filter(a => a.status === "Available");

  return (
    <div className="grid gap-6 p-8">
      <div className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bookings</h1>
          <p className="mt-2 text-slate-600">Manage asset checkout, reservations, and returns.</p>
        </div>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className="rounded-xl bg-[#5b3df5] px-4 py-2 font-semibold text-white shadow-sm hover:bg-[#4b30d6] transition-colors">
            + Book Asset
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-6">New Booking Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Asset</label>
              <select required value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5] bg-transparent">
                <option value="">Choose an available asset...</option>
                {availableAssets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>)}
              </select>
              {availableAssets.length === 0 && <p className="text-xs text-rose-500 mt-1">No assets currently available to book.</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Booked By (Name)</label>
              <input type="text" required placeholder="e.g. John Doe" value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Checkout Date</label>
              <input type="date" required value={formData.bookingDate} onChange={e => setFormData({...formData, bookingDate: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Expected Return Date</label>
              <input type="date" required value={formData.expectedReturnDate} onChange={e => setFormData({...formData, expectedReturnDate: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notes / Purpose (Optional)</label>
              <textarea placeholder="Reason for booking..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#5b3df5] focus:ring-1 focus:ring-[#5b3df5]" rows={2} />
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-8 border-t border-slate-100 pt-6">
            <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Cancel</button>
            <button type="submit" disabled={availableAssets.length === 0} className="rounded-xl bg-[#5b3df5] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4b30d6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Confirm Booking</button>
          </div>
        </form>
      )}

      <SectionPanel title="Active & Recent Bookings" subtitle="Track who has what and when it is due">
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Asset</th>
                <th className="p-4 font-semibold">Booked By</th>
                <th className="p-4 font-semibold">Checkout Date</th>
                <th className="p-4 font-semibold">Due Return</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">No bookings found.</td>
                </tr>
              )}
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{booking.assetName}</td>
                  <td className="p-4">{booking.userName}</td>
                  <td className="p-4">{booking.bookingDate}</td>
                  <td className="p-4 font-medium">{booking.expectedReturnDate}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      booking.status === 'Active' ? 'bg-amber-100 text-amber-800' :
                      booking.status === 'Returned' ? 'bg-slate-100 text-slate-800' :
                      booking.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {booking.status === "Active" ? (
                      <button onClick={() => handleReturn(booking.id)} className="text-[#5b3df5] hover:underline font-medium">Mark Returned</button>
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
