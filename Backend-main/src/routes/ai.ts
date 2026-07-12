import { Router } from "express";
import { getCollections } from "../db/collections";
import { suggestTriage, computeAssetRisks } from "../services/aiInsights";

const router = Router();

router.post("/triage", (req, res) => {
  const { description } = req.body ?? {};
  if (typeof description !== "string" || !description.trim()) {
    return res.status(400).json({ error: "description is required" });
  }
  res.json(suggestTriage(description));
});

router.get("/insights", async (_req, res, next) => {
  try {
    const { companyAssets, maintenanceRequests } = await getCollections();
    const [assets, requests] = await Promise.all([
      companyAssets.find().toArray(),
      maintenanceRequests.find().toArray(),
    ]);

    const insights = computeAssetRisks(assets, requests);
    const summary = {
      analyzedAssets: assets.length,
      atRiskAssets: insights.filter((i) => i.riskLevel === "High" || i.riskLevel === "Critical").length,
      replacementCandidates: insights.filter((i) => i.riskLevel === "Critical").length,
    };

    res.json({ summary, insights: insights.slice(0, 20) });
  } catch (err) {
    next(err);
  }
});

export default router;
