import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { checkoutSessionController } from '../controllers/checkout.controller';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';

const checkoutRoutes = new Hono();

// El middleware de Auth protege el inicio del endpoint de pagos
checkoutRoutes.post(
  '/',
  clerkAuthMiddleware,
  checkoutSessionController
);

export default checkoutRoutes;
