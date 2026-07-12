import { Router } from "express";
import { randomUUID } from "crypto";
import { getCollections } from "../db/collections";
import type { AssetBooking } from "../types";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { assetBookings } = await getCollections();
    const list = await assetBookings.find().toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { 
      assetId, assetName, userName, 
      bookingDate, expectedReturnDate, notes 
    } = req.body;
    
    const { assetBookings, companyAssets } = await getCollections();
    
    const newBooking: AssetBooking = {
      id: randomUUID(),
      assetId,
      assetName,
      userName,
      bookingDate,
      expectedReturnDate,
      status: "Active",
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await assetBookings.insertOne(newBooking);

    if (assetId) {
      await companyAssets.updateOne(
        { id: assetId },
        {
          $set: {
            status: "Allocated",
            assignedToName: userName,
            updatedAt: new Date()
          }
        }
      );
    }

    res.status(201).json(newBooking);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/return", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assetBookings, companyAssets } = await getCollections();
    
    const booking = await assetBookings.findOne({ id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await assetBookings.updateOne(
      { id },
      {
        $set: {
          status: "Returned",
          updatedAt: new Date(),
        },
      }
    );

    if (booking.assetId) {
      await companyAssets.updateOne(
        { id: booking.assetId },
        {
          $set: {
            status: "Available",
            assignedToName: undefined,
            updatedAt: new Date()
          }
        }
      );
    }
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
