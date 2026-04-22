import { Hono } from 'hono';
import { connectDB } from './db/connection';
import healthRoutes from './routes/health.routes';
import productRoutes from './routes/product.routes';

const app = new Hono();

// Attempt to connect to DB
connectDB();

// Register routes
app.route('/api/health', healthRoutes);
app.route('/api/products', productRoutes);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
