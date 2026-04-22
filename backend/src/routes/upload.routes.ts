import { Hono } from 'hono';
import { uploadEvidenceController } from '../controllers/upload.controller';

const uploadRoutes = new Hono();

// El endpoint POST /api/uploads espera un campo "file" en FormData
uploadRoutes.post('/', uploadEvidenceController);

export default uploadRoutes;
