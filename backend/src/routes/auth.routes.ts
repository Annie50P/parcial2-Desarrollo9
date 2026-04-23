import { Hono } from 'hono';
import { clerkAuthMiddleware } from '../middlewares/auth.middleware';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { User } from '../models/User';

const authRoutes = new Hono();

authRoutes.get('/me', clerkAuthMiddleware, async (c) => {
  const userId = c.get('userId');

  try {
    const userDoc = await User.findOne({ clerk_id: userId });

    let role = userDoc?.role as string | undefined;

    if (!role) {
      try {
        const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
        const clerkUser = await clerk.users.getUser(userId).catch(() => null);
        role = clerkUser?.publicMetadata?.role as string | undefined;
      } catch {
        role = undefined;
      }
    }

    return c.json({
      userId,
      role: role || 'user',
      isAdmin: role === 'admin'
    });
  } catch (error) {
    console.error('[Auth/Me Error]:', error);
    return c.json({ userId, role: 'user', isAdmin: false }, 200);
  }
});

export default authRoutes;