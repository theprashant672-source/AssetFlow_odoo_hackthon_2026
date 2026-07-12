import type { CompanyAsset, MaintenanceRequest } from "../types";

export type TriageSuggestion = {
  priority: "Low" | "Medium" | "High" | "Critical";
  category: string;
  confidence: number;
  reasons: string[];
};

type KeywordRule = {
  pattern: RegExp;
  weight: number;
  reason: string;
};

const CRITICAL_RULES: KeywordRule[] = [
  { pattern: /\b(fire|smoke|burn(t|ing)?|spark(s|ing)?|explod\w*)\b/i, weight: 100, reason: "Safety hazard keywords detected" },
  { pattern: /\b(electric(al)? shock|short circuit|exposed wir\w+)\b/i, weight: 100, reason: "Electrical hazard detected" },
  { pattern: /\b(data loss|data breach|ransomware|hacked)\b/i, weight: 90, reason: "Data security risk detected" },
  { pattern: /\b(complete(ly)? (dead|failure)|won'?t (turn on|start|boot)|not (turning on|starting|booting)|total(ly)? (dead|broken))\b/i, weight: 70, reason: "Total failure reported" },
];

const HIGH_RULES: KeywordRule[] = [
  { pattern: /\b(leak(s|ing|age)?|overheat(s|ing)?|very hot)\b/i, weight: 55, reason: "Leak/overheating reported" },
  { pattern: /\b(crash(es|ing)?|blue ?screen|bsod|freez(es|ing)|hang(s|ing)?)\b/i, weight: 45, reason: "System instability reported" },
  { pattern: /\b(broken|shatter(ed)?|crack(ed)?|damag(ed|e))\b/i, weight: 45, reason: "Physical damage reported" },
  { pattern: /\b(urgent(ly)?|asap|immediate(ly)?|blocking|production (down|halt\w*)|can'?t work)\b/i, weight: 50, reason: "Urgency expressed by requester" },
  { pattern: /\b(no (power|display|signal|network|internet)|dead pixel)\b/i, weight: 40, reason: "Core function unavailable" },
];

const MEDIUM_RULES: KeywordRule[] = [
  { pattern: /\b(slow(ness)?|lag(s|ging)?|intermittent(ly)?|sometimes|occasional(ly)?)\b/i, weight: 25, reason: "Intermittent/performance issue" },
  { pattern: /\b(nois(e|y)|rattl(e|ing)|vibrat(e|ing|ion)|squeak\w*)\b/i, weight: 22, reason: "Abnormal noise/vibration" },
  { pattern: /\b(battery (drain\w*|issue|dying)|not charging|charge\w* slowly)\b/i, weight: 25, reason: "Power/battery issue" },
  { pattern: /\b(error|warning|alert|fault(y)? ?(code)?)\b/i, weight: 20, reason: "Error/fault reported" },
];

const LOW_RULES: KeywordRule[] = [
  { pattern: /\b(cosmetic|scratch(ed|es)?|dent(ed)?|faded|stain(ed)?)\b/i, weight: 10, reason: "Cosmetic issue" },
  { pattern: /\b(clean(ing)?|service due|routine|schedule\w* (check|maintenance)|inspection)\b/i, weight: 8, reason: "Routine maintenance" },
  { pattern: /\b(minor|small|slight(ly)?|when (possible|convenient)|no (rush|hurry))\b/i, weight: 5, reason: "Requester marked as minor" },
];

const CATEGORY_RULES: Array<{ category: string; pattern: RegExp }> = [
  { category: "Electrical", pattern: /\b(power|electric\w*|short circuit|voltage|socket|wir(e|ing)|spark\w*|charg(er|ing))\b/i },
  { category: "Hardware", pattern: /\b(screen|display|keyboard|mouse|battery|disk|drive|ram|memory|motherboard|fan|port|hinge|broken|crack\w*)\b/i },
  { category: "Software", pattern: /\b(software|app(lication)?|windows|driver|update|install\w*|crash\w*|blue ?screen|bsod|virus|malware|license)\b/i },
  { category: "Network", pattern: /\b(network|wi-?fi|internet|lan|ethernet|router|connectivity|vpn|dns)\b/i },
  { category: "Mechanical", pattern: /\b(motor|bearing|belt|gear|hydraulic|pump|valve|nois(e|y)|vibrat\w*|leak\w*|jam(med)?)\b/i },
  { category: "HVAC / Facility", pattern: /\b(ac|air ?condition\w*|hvac|cooling|heating|ventilat\w*|plumb\w*|ceiling|door|window|light(ing)?)\b/i },
  { category: "Vehicle", pattern: /\b(vehicle|car|van|truck|tyre|tire|engine|brake|clutch|fuel|mileage)\b/i },
];

export function suggestTriage(description: string): TriageSuggestion {
  const text = (description || "").trim();
  const reasons: string[] = [];
  let score = 0;

  const applyRules = (rules: KeywordRule[]) => {
    for (const rule of rules) {
      if (rule.pattern.test(text)) {
        score += rule.weight;
        reasons.push(rule.reason);
      }
    }
  };

  applyRules(CRITICAL_RULES);
  applyRules(HIGH_RULES);
  applyRules(MEDIUM_RULES);
  applyRules(LOW_RULES);

  let priority: TriageSuggestion["priority"];
  if (score >= 70) priority = "Critical";
  else if (score >= 40) priority = "High";
  else if (score >= 18) priority = "Medium";
  else priority = "Low";

  let category = "General";
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(text)) {
      category = rule.category;
      break;
    }
  }

  // Confidence grows with matched signals and description length, capped at 0.95.
  const signalConfidence = Math.min(0.95, 0.35 + reasons.length * 0.18 + Math.min(text.length / 400, 0.15));
  const confidence = text.length < 12 ? 0.3 : Number(signalConfidence.toFixed(2));

  if (reasons.length === 0) {
    reasons.push("No strong signals found — defaulting to low priority");
  }

  return { priority, category, confidence, reasons: [...new Set(reasons)].slice(0, 4) };
}

export type AssetRiskInsight = {
  assetId: string;
  assetTag: string;
  assetName: string;
  categoryName: string;
  condition: string;
  status: string;
  repairCount: number;
  openRepairs: number;
  criticalRepairs: number;
  daysSinceLastIssue: number | null;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
};

const CONDITION_RISK: Record<string, number> = {
  Poor: 30,
  Fair: 15,
  Good: 5,
  Excellent: 0,
  New: 0,
};

export function computeAssetRisks(
  assets: CompanyAsset[],
  requests: MaintenanceRequest[]
): AssetRiskInsight[] {
  const byAsset = new Map<string, MaintenanceRequest[]>();
  for (const req of requests) {
    if (!req.assetId) continue;
    const list = byAsset.get(req.assetId) ?? [];
    list.push(req);
    byAsset.set(req.assetId, list);
  }

  const now = Date.now();
  const insights: AssetRiskInsight[] = [];

  for (const asset of assets) {
    if (asset.status === "Retired") continue;

    const history = byAsset.get(asset.id) ?? [];
    const repairCount = history.length;
    const openRepairs = history.filter((r) => r.status === "Pending" || r.status === "In Progress").length;
    const criticalRepairs = history.filter((r) => r.priority === "Critical" || r.priority === "High").length;

    const lastIssueAt = history.reduce<number | null>((latest, r) => {
      const t = new Date(r.createdAt).getTime();
      if (Number.isNaN(t)) return latest;
      return latest === null || t > latest ? t : latest;
    }, null);
    const daysSinceLastIssue = lastIssueAt === null ? null : Math.floor((now - lastIssueAt) / 86_400_000);

    let riskScore = 0;
    riskScore += Math.min(repairCount * 18, 54);
    riskScore += criticalRepairs * 12;
    riskScore += openRepairs * 8;
    riskScore += CONDITION_RISK[asset.condition] ?? 0;
    if (daysSinceLastIssue !== null && daysSinceLastIssue <= 30) riskScore += 10;
    riskScore = Math.min(100, riskScore);

    if (riskScore === 0) continue;

    let riskLevel: AssetRiskInsight["riskLevel"];
    let recommendation: string;
    if (riskScore >= 70) {
      riskLevel = "Critical";
      recommendation = `${repairCount} repairs logged — replacement strongly recommended over further repair spend.`;
    } else if (riskScore >= 45) {
      riskLevel = "High";
      recommendation = "Repeated failures detected. Schedule preventive inspection and budget for replacement.";
    } else if (riskScore >= 20) {
      riskLevel = "Medium";
      recommendation = "Failure pattern emerging. Add to next preventive maintenance cycle.";
    } else {
      riskLevel = "Low";
      recommendation = "Minor history. No action needed beyond routine checks.";
    }

    insights.push({
      assetId: asset.id,
      assetTag: asset.tag,
      assetName: asset.name,
      categoryName: asset.categoryName,
      condition: asset.condition,
      status: asset.status,
      repairCount,
      openRepairs,
      criticalRepairs,
      daysSinceLastIssue,
      riskScore,
      riskLevel,
      recommendation,
    });
  }

  return insights.sort((a, b) => b.riskScore - a.riskScore);
}
