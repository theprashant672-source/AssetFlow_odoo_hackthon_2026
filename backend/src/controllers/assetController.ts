import type { Request, Response } from 'express';
import Asset from '../models/Asset.js';

export const getAssets = async (_req: Request, res: Response): Promise<void> => {
  const assets = await Asset.find().sort({ createdAt: -1 });
  res.json(assets);
};

export const getAssetById = async (req: Request, res: Response): Promise<void> => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) {
    res.status(404).json({ message: 'Asset not found' });
    return;
  }
  res.json(asset);
};

export const createAsset = async (req: Request, res: Response): Promise<void> => {
  const asset = await Asset.create(req.body);
  res.status(201).json(asset);
};

export const updateAsset = async (req: Request, res: Response): Promise<void> => {
  const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!asset) {
    res.status(404).json({ message: 'Asset not found' });
    return;
  }
  res.json(asset);
};

export const deleteAsset = async (req: Request, res: Response): Promise<void> => {
  const asset = await Asset.findByIdAndDelete(req.params.id);
  if (!asset) {
    res.status(404).json({ message: 'Asset not found' });
    return;
  }
  res.json({ message: 'Asset deleted' });
};
