import { Context } from 'hono';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

export const getMyOrders = async (c: Context) => {
  try {
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Unauthorized: User ID not found' }, 401);
    }

    const ordersData = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    const orderIds = ordersData.map(o => o._id);

    const relatedItems = await OrderItem.find({ order_id: { $in: orderIds } })
      .populate('product_id')
      .lean();

    const orders = ordersData.map(order => {
      const items = relatedItems
        .filter(item => String(item.order_id) === String(order._id))
        .map(item => ({
          ...item,
          product: item.product_id,
        }));
      return { ...order, items };
    });

    return c.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
};

export const getOrderBySession = async (c: Context) => {
  try {
    const sessionId = c.req.param('sessionId');
    const userId = c.get('userId');

    if (!userId) {
      return c.json({ error: 'Unauthorized: User ID not found' }, 401);
    }

    const order = await Order.findOne({ stripe_session_id: sessionId, userId }).lean();

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const relatedItems = await OrderItem.find({ order_id: order._id })
      .populate('product_id')
      .lean();

    const items = relatedItems.map(item => ({
      ...item,
      product: item.product_id,
    }));

    return c.json({ ...order, items });
  } catch (error) {
    console.error('Error fetching order by session:', error);
    return c.json({ error: 'Failed to fetch order' }, 500);
  }
};

export const getAllOrders = async (c: Context) => {
  try {
    const ordersData = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'email')
      .lean();

    const orderIds = ordersData.map(o => o._id);
    const relatedItems = await OrderItem.find({ order_id: { $in: orderIds } })
      .populate('product_id')
      .lean();

    const orders = ordersData.map(order => {
      const items = relatedItems
        .filter(item => String(item.order_id) === String(order._id))
        .map(item => ({
          ...item,
          product: item.product_id,
        }));
      return { ...order, items };
    });

    return c.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
};
