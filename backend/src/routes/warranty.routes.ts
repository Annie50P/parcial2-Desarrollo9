import { Hono } from 'hono';
import { createWarrantyReport, getMyWarranties, updateWarrantyStatus } from '../controllers/warranty.controller';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';
import { zValidator } from '@hono/zod-validator';
import { createWarrantySchema } from '../validators/warranty.validator';

const warrantyRoutes = new Hono();

warrantyRoutes.post('/', clerkAuthMiddleware, zValidator('json', createWarrantySchema), createWarrantyReport);
warrantyRoutes.get('/mine', clerkAuthMiddleware, getMyWarranties);
warrantyRoutes.put('/:id/status', updateWarrantyStatus);

export default warrantyRoutes;
