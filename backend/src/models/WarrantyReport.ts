import { Schema, model, Document, Types } from 'mongoose';

export interface IWarrantyReport extends Document {
  orderId: Types.ObjectId;
  userId: string;
  description: string;
  evidenceUrls: string[];
  status: 'pending' | 'review' | 'resolved' | 'rejected';
  repairNotes?: string;
  createdAt: Date;
}

const WarrantyReportSchema = new Schema<IWarrantyReport>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: String, required: true },
  description: { type: String, required: true },
  evidenceUrls: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'review', 'resolved', 'rejected'], 
    default: 'pending' 
  },
  repairNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const WarrantyReport = model<IWarrantyReport>('WarrantyReport', WarrantyReportSchema);
