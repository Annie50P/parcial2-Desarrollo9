import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { checkoutSchema } from '../validators/checkout.validator';
import { checkoutSessionController } from '../controllers/checkout.controller';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';

const checkoutRoutes = new Hono();

// El middleware de Auth protege el inicio del endpoint de pagos
checkoutRoutes.post(
  '/',
  clerkAuthMiddleware,
  zValidator('json', checkoutSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error.issues }, 400);
    }
  }),
  checkoutSessionController
);

export default checkoutRoutes;
