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

const REPAIR_COST_BY_PRIORITY: Record<string, number> = {
  Critical: 520,
  High: 350,
  Medium: 200,
  Low: 90,
};

const DEFAULT_ASSET_VALUE = 1200;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en", { month: "short" }) + " " + String(year).slice(2);
}

function lastMonths(count: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    keys.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  return keys;
}

router.get("/analytics", async (_req, res, next) => {
  try {
    const { companyAssets, assetBookings, maintenanceRequests } = await getCollections();

    const [assets, bookings, maintenance] = await Promise.all([
      companyAssets.find().toArray(),
      assetBookings.find().toArray(),
      maintenanceRequests.find().toArray(),
    ]);

    const statusDistribution: Record<string, number> = {};
    const categoryDistribution: Record<string, number> = {};
    let portfolioValue = 0;
    for (const asset of assets) {
      statusDistribution[asset.status] = (statusDistribution[asset.status] || 0) + 1;
      const cat = asset.categoryName || "Uncategorized";
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      portfolioValue += typeof asset.purchasePrice === "number" && asset.purchasePrice > 0
        ? asset.purchasePrice
        : DEFAULT_ASSET_VALUE;
    }

    const months = lastMonths(6);
    const maintenanceByMonth = new Map(months.map((m) => [m, { count: 0, cost: 0 }]));
    const bookingsByMonth = new Map(months.map((m) => [m, 0]));

    let resolvedCount = 0;
    let resolutionDaysTotal = 0;
    const resolutionByPriority: Record<string, { total: number; count: number }> = {};

    for (const req of maintenance) {
      const created = new Date(req.createdAt);
      const bucket = maintenanceByMonth.get(monthKey(created));
      if (bucket) {
        bucket.count += 1;
        bucket.cost += REPAIR_COST_BY_PRIORITY[req.priority] ?? REPAIR_COST_BY_PRIORITY.Medium;
      }

      if (req.status === "Resolved") {
        const days = (new Date(req.updatedAt).getTime() - created.getTime()) / 86_400_000;
        if (Number.isFinite(days) && days >= 0) {
          resolvedCount += 1;
          resolutionDaysTotal += days;
          const slot = resolutionByPriority[req.priority] ?? { total: 0, count: 0 };
          slot.total += days;
          slot.count += 1;
          resolutionByPriority[req.priority] = slot;
        }
      }
    }

    for (const booking of bookings) {
      const created = new Date(booking.createdAt);
      const key = monthKey(created);
      if (bookingsByMonth.has(key)) {
        bookingsByMonth.set(key, (bookingsByMonth.get(key) || 0) + 1);
      }
    }

    const totalAssets = assets.length;
    const allocated = statusDistribution["Allocated"] || 0;

    res.json({
      kpis: {
        totalAssets,
        portfolioValue,
        utilizationRate: totalAssets > 0 ? Math.round((allocated / totalAssets) * 100) : 0,
        openMaintenance: maintenance.filter((m) => m.status === "Pending" || m.status === "In Progress").length,
        avgResolutionDays: resolvedCount > 0 ? Number((resolutionDaysTotal / resolvedCount).toFixed(1)) : 0,
        activeBookings: bookings.filter((b) => b.status === "Active" || b.status === "Pending").length,
      },
      statusDistribution: Object.entries(statusDistribution).map(([name, value]) => ({ name, value })),
      categoryDistribution: Object.entries(categoryDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
      maintenanceTrend: months.map((m) => ({
        month: monthLabel(m),
        requests: maintenanceByMonth.get(m)!.count,
        estimatedCost: maintenanceByMonth.get(m)!.cost,
      })),
      bookingTrend: months.map((m) => ({
        month: monthLabel(m),
        bookings: bookingsByMonth.get(m) || 0,
      })),
      resolutionByPriority: ["Critical", "High", "Medium", "Low"].map((priority) => {
        const slot = resolutionByPriority[priority];
        return {
          priority,
          avgDays: slot && slot.count > 0 ? Number((slot.total / slot.count).toFixed(1)) : 0,
          resolved: slot?.count ?? 0,
        };
      }),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
