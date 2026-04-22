import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './db/connection';
import healthRoutes from './routes/health.routes';
import productRoutes from './routes/product.routes';
import checkoutRoutes from './routes/checkout.routes';
import uploadRoutes from './routes/upload.routes';
import warrantyRoutes from './routes/warranty.routes';
import webhookRoutes from './routes/webhook.routes';
import orderRoutes from './routes/order.routes';

console.log('[DEBUG] CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY);

const app = new Hono();

// Global Middlewares
app.use('/*', cors());

// Attempt to connect to DB
connectDB();

// Register routes
app.route('/api/health', healthRoutes);
app.route('/api/products', productRoutes);
app.route('/api/checkout', checkoutRoutes);
app.route('/api/uploads', uploadRoutes);
app.route('/api/warranties', warrantyRoutes);
app.route('/api/webhooks', webhookRoutes);
app.route('/api/orders', orderRoutes);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
