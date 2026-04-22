import { Context } from 'hono';
import { Order } from '../models/Order';

export const getMyOrders = async (c: Context) => {
  try {
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Unauthorized: User ID not found' }, 401);
    }

    const orders = await Order.find({ userId }).populate('items.product').exec();

    return c.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
};
