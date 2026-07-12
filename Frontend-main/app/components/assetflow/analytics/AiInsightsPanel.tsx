"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/app/lib/assetflowApi";
import { getDB } from "@/app/lib/store";

type Insight = {
  assetId: string;
  assetTag: string;
  assetName: string;
  repairCount: number;
  openRepairs: number;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
};

type InsightsResponse = {
  summary: { analyzedAssets: number; atRiskAssets: number; replacementCandidates: number };
  insights: Insight[];
};

const RISK_STYLES: Record<Insight["riskLevel"], { badge: string; bar: string }> = {
  Critical: { badge: "bg-rose-100 text-rose-800", bar: "bg-rose-500" },
  High: { badge: "bg-orange-100 text-orange-800", bar: "bg-orange-500" },
  Medium: { badge: "bg-amber-100 text-amber-800", bar: "bg-amber-500" },
  Low: { badge: "bg-slate-100 text-slate-700", bar: "bg-slate-400" },
};

const CONDITION_RISK: Record<string, number> = { Poor: 30, Fair: 15, Good: 5, New: 0 };

// Fallback when the API is unreachable: run the same risk scoring over the
// in-browser demo store so the panel always renders.
function buildLocalInsights(): InsightsResponse {
  const db = getDB();
  const now = Date.now();
  const insights: Insight[] = [];

  for (const asset of db.assets) {
    if (asset.status === "Retired" || asset.status === "Disposed") continue;
    const history = db.maintenance.filter((m) => m.assetId === asset.id);
    if (history.length === 0 && (CONDITION_RISK[asset.condition] ?? 0) === 0) continue;

    const repairCount = history.length;
    const openRepairs = history.filter((m) => m.status !== "Resolved" && m.status !== "Rejected").length;
    const highRepairs = history.filter((m) => m.priority === "High").length;
    const lastIssueAt = history.reduce<number | null>((latest, m) => {
      const t = new Date(m.raisedAt).getTime();
      return Number.isNaN(t) ? latest : latest === null || t > latest ? t : latest;
    }, null);

    let riskScore = Math.min(repairCount * 18, 54) + highRepairs * 12 + openRepairs * 8 + (CONDITION_RISK[asset.condition] ?? 0);
    if (lastIssueAt !== null && now - lastIssueAt <= 30 * 86_400_000) riskScore += 10;
    riskScore = Math.min(100, riskScore);
    if (riskScore === 0) continue;

    const riskLevel: Insight["riskLevel"] = riskScore >= 70 ? "Critical" : riskScore >= 45 ? "High" : riskScore >= 20 ? "Medium" : "Low";
    const recommendation =
      riskLevel === "Critical"
        ? `${repairCount} repairs logged — replacement strongly recommended over further repair spend.`
        : riskLevel === "High"
          ? "Repeated failures detected. Schedule preventive inspection and budget for replacement."
          : riskLevel === "Medium"
            ? "Failure pattern emerging. Add to next preventive maintenance cycle."
            : "Minor history. No action needed beyond routine checks.";

    insights.push({
      assetId: asset.id,
      assetTag: asset.tag,
      assetName: asset.name,
      repairCount,
      openRepairs,
      riskScore,
      riskLevel,
      recommendation,
    });
  }

  insights.sort((a, b) => b.riskScore - a.riskScore);
  return {
    summary: {
      analyzedAssets: db.assets.length,
      atRiskAssets: insights.filter((i) => i.riskLevel === "High" || i.riskLevel === "Critical").length,
      replacementCandidates: insights.filter((i) => i.riskLevel === "Critical").length,
    },
    insights: insights.slice(0, 20),
  };
}

function isValidInsights(value: unknown): value is InsightsResponse {
  const v = value as InsightsResponse | null;
  return Boolean(v && v.summary && typeof v.summary.analyzedAssets === "number" && Array.isArray(v.insights));
}

export default function AiInsightsPanel({ limit = 6 }: { limit?: number }) {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/ai/insights"))
      .then(async (res) => {
        if (!res.ok) throw new Error("insights unavailable");
        const json = await res.json();
        if (!isValidInsights(json)) throw new Error("unexpected insights payload");
        setData(json);
      })
      .catch(() => setData(buildLocalInsights()))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-[#5b3df5]/10 text-sm">✨</span>
            AI Predictive Maintenance
          </h3>
          <p className="mt-1 text-sm text-slate-500">Failure-pattern analysis across the asset fleet.</p>
        </div>
        {data && (
          <div className="text-right text-xs font-semibold text-slate-500">
            <div>{data.summary.analyzedAssets} assets analyzed</div>
            <div className="text-rose-600">{data.summary.replacementCandidates} replacement candidates</div>
          </div>
        )}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-400 animate-pulse">Analyzing failure patterns...</div>
        ) : !data || data.insights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
            No risk signals yet — fleet is healthy. Insights appear as maintenance history accumulates.
          </div>
        ) : (
          <ul className="space-y-3">
            {data.insights.slice(0, limit).map((insight) => {
              const style = RISK_STYLES[insight.riskLevel];
              return (
                <li key={insight.assetId} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">
                      {insight.assetName}
                      <span className="ml-2 text-xs font-bold text-slate-400">{insight.assetTag}</span>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${style.badge}`}>
                      {insight.riskLevel} risk
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${insight.riskScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 tabular-nums">{insight.riskScore}/100</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{insight.recommendation}</p>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    {insight.repairCount} repairs logged{insight.openRepairs > 0 ? ` · ${insight.openRepairs} open` : ""}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
