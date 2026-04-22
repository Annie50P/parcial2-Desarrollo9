import { Hono } from 'hono';
import { stripeWebhookController } from '../controllers/webhook.controller';

const webhookRoutes = new Hono();

// NO inyectar middlewares que lean el body como json aquí, stripe necesita raw text
webhookRoutes.post('/stripe', stripeWebhookController);

export default webhookRoutes;
