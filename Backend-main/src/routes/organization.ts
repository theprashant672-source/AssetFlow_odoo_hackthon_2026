import { Router } from "express";
import { randomUUID } from "crypto";
import { getCollections } from "../db/collections";
import type { Department, AssetCategory } from "../types";

const router = Router();


router.get("/departments", async (req, res, next) => {
  try {
    const { departments } = await getCollections();
    const list = await departments.find().toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post("/departments", async (req, res, next) => {
  try {
    const { name, headName, parentDepartment, status } = req.body;
    const { departments } = await getCollections();
    
    const newDept: Department = {
      id: randomUUID(),
      name,
      headName,
      parentDepartment,
      status: status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await departments.insertOne(newDept);
    res.status(201).json(newDept);
  } catch (err) {
    next(err);
  }
});

router.put("/departments/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, headName, parentDepartment, status } = req.body;
    const { departments } = await getCollections();
    
    await departments.updateOne(
      { id },
      {
        $set: {
          name,
          headName,
          parentDepartment,
          status,
          updatedAt: new Date(),
        },
      }
    );
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});


router.get("/categories", async (req, res, next) => {
  try {
    const { assetCategories } = await getCollections();
    const list = await assetCategories.find().toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.post("/categories", async (req, res, next) => {
  try {
    const { name, customFields } = req.body;
    const { assetCategories } = await getCollections();
    
    const newCat: AssetCategory = {
      id: randomUUID(),
      name,
      customFields,
      totalAssets: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await assetCategories.insertOne(newCat);
    res.status(201).json(newCat);
  } catch (err) {
    next(err);
  }
});

router.put("/categories/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, customFields } = req.body;
    const { assetCategories } = await getCollections();
    
    await assetCategories.updateOne(
      { id },
      {
        $set: {
          name,
          customFields,
          updatedAt: new Date(),
        },
      }
    );
    
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});


router.get("/employees", async (req, res, next) => {
  try {
    const { users } = await getCollections();
    const list = await users.find({}).toArray();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.put("/employees/:id/role", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const { users } = await getCollections();
    
    await users.updateOne(
      { id },
      {
        $set: {
          role,
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
