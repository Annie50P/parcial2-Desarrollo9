import { verifyToken } from '@clerk/backend';
import { Context, Next } from 'hono';

export const clerkAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload.sub) {
      return c.json({ error: 'Unauthorized: Invalid token payload' }, 401);
    }

    c.set('userId', payload.sub);
    await next();
  } catch (error) {
    console.error('Clerk Auth Error:', error);
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};
