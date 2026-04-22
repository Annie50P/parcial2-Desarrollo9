import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
  stripe_session_id: { type: String },
}, { timestamps: true });

export const Order = model('Order', orderSchema);
