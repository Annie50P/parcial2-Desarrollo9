import { Context } from 'hono';
import mongoose from 'mongoose';

export const getHealth = (c: Context) => {
  const isConnected = mongoose.connection.readyState === 1;
  return c.json({
    status: 'ok',
    timestamp: Date.now(),
    dbConnected: isConnected
  });
};
