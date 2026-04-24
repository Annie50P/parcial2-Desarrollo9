import { Hono } from 'hono';
import { getTechnicians, createTechnician, deleteTechnician } from '../controllers/technician.controller';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';

const technicianRoutes = new Hono();

technicianRoutes.get('/', adminAuthMiddleware, getTechnicians);
technicianRoutes.post('/', adminAuthMiddleware, createTechnician);
technicianRoutes.delete('/:id', adminAuthMiddleware, deleteTechnician);

export default technicianRoutes;