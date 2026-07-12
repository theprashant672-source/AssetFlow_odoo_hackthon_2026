import mongoose, { Document, Schema } from 'mongoose';

export type AssetStatus = 'available' | 'assigned' | 'maintenance' | 'retired';

export interface AssetDocument extends Document {
  name: string;
  category: string;
  serialNumber: string;
  status: AssetStatus;
  assignedTo: string | null;
  purchaseDate?: Date;
  value: number;
}

const assetSchema = new Schema<AssetDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    serialNumber: { type: String, required: true, unique: true, trim: true },
    status: {
      type: String,
      enum: ['available', 'assigned', 'maintenance', 'retired'],
      default: 'available',
    },
    assignedTo: { type: String, default: null },
    purchaseDate: { type: Date },
    value: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<AssetDocument>('Asset', assetSchema);
