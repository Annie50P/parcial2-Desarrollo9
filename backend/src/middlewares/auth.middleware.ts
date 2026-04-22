import { verifyToken } from '@clerk/backend';
import { Context, Next } from 'hono';

export const clerkAuthMiddleware = async (c: Context, next: Next) => {
  console.log('[Auth] CLERK_SECRET_KEY loaded:', process.env.CLERK_SECRET_KEY ? 'YES' : 'NO');
  
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  console.log('[Auth] Token received:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  try {
    console.log('[Auth] Verifying token with secret:', process.env.CLERK_SECRET_KEY?.substring(0, 10) + '...');
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    console.log('[Auth] Token verified, userId:', payload.sub);
    
    if (!payload.sub) {
      return c.json({ error: 'Unauthorized: Invalid token payload' }, 401);
    }

    c.set('userId', payload.sub);
    await next();
  } catch (error) {
    console.error('[Auth] Clerk Auth Error:', error);
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};
