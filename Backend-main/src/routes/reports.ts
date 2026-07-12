import { Router } from "express";
import { getCollections } from "../db/collections";

const router = Router();

router.get("/summary", async (req, res, next) => {
  try {
    const { companyAssets, assetBookings, maintenanceRequests, assetAudits } = await getCollections();
    
    const [
      allAssets,
      recentBookings,
      recentMaintenance,
      recentAudits
    ] = await Promise.all([
      companyAssets.find().toArray(),
      assetBookings.find().sort({ createdAt: -1 }).limit(5).toArray(),
      maintenanceRequests.find().sort({ createdAt: -1 }).limit(5).toArray(),
      assetAudits.find().sort({ createdAt: -1 }).limit(5).toArray(),
    ]);

    const totalAssets = allAssets.length;
    let allocatedAssets = 0;
    let availableAssets = 0;
    let maintenanceAssets = 0;
    let retiredAssets = 0;

    const assetsByCategory: Record<string, number> = {};
    const assetsByCondition: Record<string, number> = {};

    allAssets.forEach(asset => {
      if (asset.status === "Allocated") allocatedAssets++;
      else if (asset.status === "Available") availableAssets++;
      else if (asset.status === "Maintenance") maintenanceAssets++;
      else if (asset.status === "Retired") retiredAssets++;

      const cat = asset.categoryName || "Uncategorized";
      assetsByCategory[cat] = (assetsByCategory[cat] || 0) + 1;

      const cond = asset.condition || "Unknown";
      assetsByCondition[cond] = (assetsByCondition[cond] || 0) + 1;
    });

    res.json({
      metrics: {
        totalAssets,
        allocatedAssets,
        availableAssets,
        maintenanceAssets,
        retiredAssets,
      },
      distribution: {
        byCategory: Object.entries(assetsByCategory).map(([name, count]) => ({ name, count })),
        byCondition: Object.entries(assetsByCondition).map(([name, count]) => ({ name, count })),
      },
      recentActivity: {
        bookings: recentBookings,
        maintenance: recentMaintenance,
        audits: recentAudits,
      }
    });

  } catch (err) {
    next(err);
  }
});

export default router;
