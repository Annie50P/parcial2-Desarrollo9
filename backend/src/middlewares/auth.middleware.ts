import { verifyToken, createClerkClient } from '@clerk/backend';
import { Context, Next } from 'hono';
import { User } from '../models/User';

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

export const adminAuthMiddleware = async (c: Context, next: Next) => {
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

    // Checking role directly from local MongoDB User document explicitly
    const userDoc = await User.findOne({ clerk_id: payload.sub });
    
    // Check Clerk Metadata directly
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const clerkUser = await clerk.users.getUser(payload.sub).catch(() => null);
    
    // Fallback checking to Token custom claims if DB is not matching
    const tokenRole = (payload.metadata?.role as string) || (payload as any).org_role || (payload as any).role;
    const clerkApiRole = clerkUser?.publicMetadata?.role;

    if (userDoc?.role !== 'admin' && tokenRole !== 'admin' && clerkApiRole !== 'admin') {
      return c.json({ error: 'Forbidden: Insufficient privileges' }, 403);
    }

    c.set('userId', payload.sub);
    await next();
  } catch (error) {
    console.error('[Admin Auth] Error:', error);
    return c.json({ error: 'Unauthorized: Token verification failed' }, 401);
  }
};
