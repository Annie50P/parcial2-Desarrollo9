import { Hono } from 'hono';
import { getMyOrders, getOrderBySession } from '../controllers/order.controller';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';

const orderRouter = new Hono();

orderRouter.get('/mine', clerkAuthMiddleware, getMyOrders);
orderRouter.get('/by-session/:sessionId', clerkAuthMiddleware, getOrderBySession);

export default orderRouter;
