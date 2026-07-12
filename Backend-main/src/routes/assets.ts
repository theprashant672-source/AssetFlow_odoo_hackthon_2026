import { Router } from "express";
import { randomUUID } from "crypto";
import { getCollections } from "../db/collections";
import type { CompanyAsset } from "../types";
import { broadcast } from "../services/realtime";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { companyAssets } = await getCollections();
    const list = await companyAssets.find().toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { companyAssets, maintenanceRequests } = await getCollections();
    const asset = await companyAssets.findOne({ id: req.params.id });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    const maintenanceHistory = await maintenanceRequests
      .find({ assetId: asset.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    res.json({ asset, maintenanceHistory });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { 
      tag, name, categoryId, categoryName, 
      departmentId, departmentName, location, 
      status, condition, purchaseDate, purchasePrice 
    } = req.body;
    
    const { companyAssets } = await getCollections();
    
    const newAsset: CompanyAsset = {
      id: randomUUID(),
      tag,
      name,
      categoryId,
      categoryName,
      departmentId,
      departmentName,
      location,
      status: status || "Available",
      condition: condition || "New",
      purchaseDate,
      purchasePrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await companyAssets.insertOne(newAsset);

    broadcast({
      type: "asset_registered",
      title: `New asset registered: ${newAsset.name}`,
      body: `Tag ${newAsset.tag} · ${newAsset.categoryName || "Uncategorized"} · ${newAsset.location}`,
      entityType: "asset",
      entityId: newAsset.id,
      severity: "success",
    });

    res.status(201).json(newAsset);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      tag, name, categoryId, categoryName, 
      departmentId, departmentName, location, 
      status, condition, purchaseDate, purchasePrice,
      assignedToId, assignedToName
    } = req.body;
    
    const { companyAssets } = await getCollections();
    
    await companyAssets.updateOne(
      { id },
      {
        $set: {
          tag,
          name,
          categoryId,
          categoryName,
          departmentId,
          departmentName,
          location,
          status,
          condition,
          purchaseDate,
          purchasePrice,
          assignedToId,
          assignedToName,
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
