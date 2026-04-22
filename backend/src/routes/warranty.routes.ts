import { Hono } from 'hono';
import { createWarrantyReport, getMyWarranties, updateWarrantyStatus } from '../controllers/warranty.controller';

const warrantyRoutes = new Hono();

warrantyRoutes.post('/', createWarrantyReport);
warrantyRoutes.get('/mine', getMyWarranties);
warrantyRoutes.put('/:id/status', updateWarrantyStatus);

export default warrantyRoutes;
