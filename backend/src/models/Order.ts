import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  userId: { type: String, required: true },
  total_amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
  stripe_session_id: { type: String },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
}, { timestamps: true });

orderSchema.virtual('userDoc', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'clerk_id',
  justOne: true
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

export const Order = model('Order', orderSchema);
