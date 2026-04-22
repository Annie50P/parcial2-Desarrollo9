import { Hono } from 'hono';
import { getMyOrders } from '../controllers/order.controller';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';

const orderRouter = new Hono();

orderRouter.get('/mine', clerkAuthMiddleware, getMyOrders);

export default orderRouter;
