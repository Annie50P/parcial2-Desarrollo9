import { Schema, model } from 'mongoose';

const orderItemSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { timestamps: true });

export const OrderItem = model('OrderItem', orderItemSchema);
