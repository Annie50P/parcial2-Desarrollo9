import { Hono } from 'hono';
import { getMyOrders, getOrderBySession, getAllOrders } from '../controllers/order.controller';
import { clerkAuthMiddleware, adminAuthMiddleware } from '../middlewares/auth.middleware';

const orderRouter = new Hono();

orderRouter.get('/mine', clerkAuthMiddleware, getMyOrders);
orderRouter.get('/by-session/:sessionId', clerkAuthMiddleware, getOrderBySession);
orderRouter.get('/', adminAuthMiddleware, getAllOrders);

export default orderRouter;
