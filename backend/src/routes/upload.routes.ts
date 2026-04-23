import { Hono } from 'hono';
import { uploadEvidenceController } from '../controllers/upload.controller';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';

const uploadRoutes = new Hono();

uploadRoutes.post('/', clerkAuthMiddleware, uploadEvidenceController);

export default uploadRoutes;
