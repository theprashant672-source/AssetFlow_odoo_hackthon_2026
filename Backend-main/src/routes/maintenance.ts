import { Router } from "express";
import { randomUUID } from "crypto";
import { getCollections } from "../db/collections";
import type { MaintenanceRequest } from "../types";
import { broadcast } from "../services/realtime";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { maintenanceRequests } = await getCollections();
    const list = await maintenanceRequests.find().toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { 
      assetId, assetName, requestedBy, 
      issueDescription, priority 
    } = req.body;
    
    const { maintenanceRequests, companyAssets } = await getCollections();
    
    const newRequest: MaintenanceRequest = {
      id: randomUUID(),
      assetId,
      assetName,
      requestedBy,
      issueDescription,
      priority: priority || "Medium",
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await maintenanceRequests.insertOne(newRequest);

    if (assetId) {
      await companyAssets.updateOne(
        { id: assetId },
        {
          $set: {
            status: "Maintenance",
            updatedAt: new Date()
          }
        }
      );
    }

    broadcast({
      type: "maintenance_created",
      title: `Maintenance request: ${newRequest.assetName}`,
      body: `${newRequest.priority} priority — ${String(issueDescription || "").slice(0, 120)}`,
      entityType: "maintenance",
      entityId: newRequest.id,
      severity: newRequest.priority === "Critical" || newRequest.priority === "High" ? "warning" : "info",
    });

    res.status(201).json(newRequest);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/resolve", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    const { maintenanceRequests, companyAssets } = await getCollections();
    
    const request = await maintenanceRequests.findOne({ id });
    if (!request) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    await maintenanceRequests.updateOne(
      { id },
      {
        $set: {
          status: "Resolved",
          resolutionNotes,
          updatedAt: new Date(),
        },
      }
    );

    if (request.assetId) {
      await companyAssets.updateOne(
        { id: request.assetId },
        {
          $set: {
            status: "Available",
            updatedAt: new Date()
          }
        }
      );
    }
    
    broadcast({
      type: "maintenance_resolved",
      title: `Maintenance resolved: ${request.assetName}`,
      body: resolutionNotes || "Request marked as resolved",
      entityType: "maintenance",
      entityId: id,
      severity: "success",
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
