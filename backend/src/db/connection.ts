import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/safetech';
    await mongoose.connect(uri);
    console.log(`[DB] Mongoose connected successfully to ${uri}`);
  } catch (error) {
    console.error('[DB] Mongoose connection error:', error);
    // Don't exit process, let Hono start so health check shows dbConnected: false
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[DB] Mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('[DB] Mongoose error:', err);
});
