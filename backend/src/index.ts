import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './db/connection';
import healthRoutes from './routes/health.routes';
import productRoutes from './routes/product.routes';
import checkoutRoutes from './routes/checkout.routes';

const app = new Hono();

// Global Middlewares
app.use('/*', cors());

// Attempt to connect to DB
connectDB();

// Register routes
app.route('/api/health', healthRoutes);
app.route('/api/products', productRoutes);
app.route('/api/checkout', checkoutRoutes);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
