"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/app/lib/assetflowApi";
import { getDB, assetHolderLabel } from "@/app/lib/store";

type AssetDetail = {
  asset: {
    id: string;
    tag: string;
    name: string;
    categoryName?: string;
    departmentName?: string;
    location: string;
    status: string;
    condition: string;
    purchaseDate?: string;
    purchasePrice?: number;
    assignedToName?: string;
  };
  maintenanceHistory: Array<{
    id: string;
    issueDescription: string;
    priority: string;
    status: string;
    createdAt: string;
  }>;
};

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  Allocated: "bg-violet-100 text-violet-800",
  Maintenance: "bg-amber-100 text-amber-800",
  Retired: "bg-rose-100 text-rose-800",
};

export default function PublicAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<AssetDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Assets registered in the in-browser demo workspace live in the local
    // store; assets created through the API live in the backend. Try both.
    const fromLocalStore = (): AssetDetail | null => {
      try {
        const db = getDB();
        const asset = db.assets.find((a) => a.id === id || a.tag === id);
        if (!asset) return null;
        return {
          asset: {
            id: asset.id,
            tag: asset.tag,
            name: asset.name,
            categoryName: db.categories.find((c) => c.id === asset.categoryId)?.name,
            departmentName: undefined,
            location: asset.location,
            status: asset.status === "Under Maintenance" ? "Maintenance" : asset.status,
            condition: asset.condition,
            purchaseDate: asset.acquisitionDate,
            assignedToName: asset.holderEmail ? assetHolderLabel(db, asset) : undefined,
          },
          maintenanceHistory: db.maintenance
            .filter((m) => m.assetId === asset.id)
            .map((m) => ({
              id: m.id,
              issueDescription: m.issue,
              priority: m.priority,
              status: m.status,
              createdAt: m.raisedAt,
            })),
        };
      } catch {
        return null;
      }
    };

    fetch(apiUrl(`/api/assets/${id}`))
      .then(async (res) => {
        if (!res.ok) throw new Error("Asset not found");
        setData(await res.json());
      })
      .catch((e) => {
        const local = fromLocalStore();
        if (local) setData(local);
        else setError(e.message);
      });
  }, [id]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">🔍</div>
          <h1 className="mt-3 text-lg font-bold text-slate-900">Asset not found</h1>
          <p className="mt-1 text-sm text-slate-500">This QR code does not match any registered asset.</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-medium text-slate-500 animate-pulse">Loading asset details...</div>
      </main>
    );
  }

  const { asset, maintenanceHistory } = data;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
          AssetFlow · Asset Passport
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{asset.tag}</div>
                <h1 className="mt-1 text-2xl font-black tracking-tight">{asset.name}</h1>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[asset.status] ?? "bg-slate-100 text-slate-800"}`}>
                {asset.status}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 p-6 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</dt>
              <dd className="mt-1 font-semibold text-slate-900">{asset.categoryName || "Uncategorized"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Department</dt>
              <dd className="mt-1 font-semibold text-slate-900">{asset.departmentName || "Unassigned"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</dt>
              <dd className="mt-1 font-semibold text-slate-900">{asset.location}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Condition</dt>
              <dd className="mt-1 font-semibold text-slate-900">{asset.condition}</dd>
            </div>
            {asset.assignedToName && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned to</dt>
                <dd className="mt-1 font-semibold text-slate-900">{asset.assignedToName}</dd>
              </div>
            )}
            {asset.purchaseDate && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Purchased</dt>
                <dd className="mt-1 font-semibold text-slate-900">{asset.purchaseDate}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900">Maintenance history</h2>
          {maintenanceHistory.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No maintenance recorded — this asset has a clean record. ✅</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {maintenanceHistory.map((m) => (
                <li key={m.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      m.priority === "Critical" ? "bg-rose-100 text-rose-800" :
                      m.priority === "High" ? "bg-orange-100 text-orange-800" :
                      m.priority === "Medium" ? "bg-amber-100 text-amber-800" :
                      "bg-slate-200 text-slate-700"
                    }`}>{m.priority}</span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{m.issueDescription}</p>
                  <div className="mt-1 text-xs font-semibold text-slate-500">Status: {m.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-semibold text-[#5b3df5] hover:underline">
            Open AssetFlow workspace →
          </Link>
        </div>
      </div>
    </main>
  );
}
