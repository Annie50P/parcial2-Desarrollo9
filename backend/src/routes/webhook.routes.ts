import { Hono } from 'hono';
import { stripeWebhookController, clerkWebhookController } from '../controllers/webhook.controller';

const webhookRoutes = new Hono();

// NO inyectar middlewares que lean el body como json aquí, stripe necesita raw text
webhookRoutes.post('/stripe', stripeWebhookController);
webhookRoutes.post('/clerk', clerkWebhookController);

export default webhookRoutes;
