import { Router } from "express";
import { randomUUID } from "crypto";
import { getCollections } from "../db/collections";
import type { AssetAudit } from "../types";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { assetAudits } = await getCollections();
    const list = await assetAudits.find().toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { 
      title, auditorName, totalAssetsExpected, notes 
    } = req.body;
    
    const { assetAudits } = await getCollections();
    
    const newAudit: AssetAudit = {
      id: randomUUID(),
      title,
      auditorName,
      status: "Planned",
      totalAssetsExpected,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await assetAudits.insertOne(newAudit);
    res.status(201).json(newAudit);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/start", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assetAudits } = await getCollections();
    
    await assetAudits.updateOne(
      { id },
      {
        $set: {
          status: "In Progress",
          startDate: new Date().toISOString(),
          updatedAt: new Date(),
        },
      }
    );
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/complete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { totalAssetsVerified, discrepanciesCount } = req.body;
    const { assetAudits } = await getCollections();
    
    await assetAudits.updateOne(
      { id },
      {
        $set: {
          status: "Completed",
          totalAssetsVerified,
          discrepanciesCount,
          completedDate: new Date().toISOString(),
          updatedAt: new Date(),
        },
      }
    );
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
