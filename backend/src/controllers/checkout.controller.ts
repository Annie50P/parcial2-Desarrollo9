import { Context } from 'hono';
import Stripe from 'stripe';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Types } from 'mongoose';

const getStripeClient = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured in backend environment');
  }

  return new Stripe(stripeSecretKey);
};

export const checkoutSessionController = async (c: Context) => {
  
  try {
    const userId = c.get('userId');
    
    if (!userId) {
      return c.json({ error: 'User authenticated but ID missing in context' }, 401);
    }

    const body = await c.req.json();
    
    const cartItems = body.items as { productId: string, quantity: number }[];
   
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return c.json({ error: 'Cart cannot be empty' }, 400);
    }
   
    for (const item of cartItems) {
      if (!item.productId || typeof item.productId !== 'string') {
        return c.json({ error: 'Invalid productId: expected string' }, 400);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1) {
        return c.json({ error: 'Invalid quantity: must be a positive number' }, 400);
      }
    }
   
   
    const invalidId = cartItems.find(item => !Types.ObjectId.isValid(item.productId));
    if (invalidId) {
      return c.json({ error: `Invalid productId format: ${invalidId.productId}` }, 400);
    }

    const productIds = cartItems.map(item => new Types.ObjectId(item.productId));
    
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    
    if (dbProducts.length !== cartItems.length) {
      return c.json({ error: 'One or more products not found in database' }, 400);
    }
    
    let totalAmount = 0;
    type StripeSessionParams = Parameters<Stripe['checkout']['sessions']['create']>[0];
    const line_items: NonNullable<NonNullable<StripeSessionParams>['line_items']> = [];
    const validItems = [];
    
    for (const item of cartItems) {
      const dbProduct = dbProducts.find(p => p._id.toString() === item.productId);
      
      if (!dbProduct) {
        return c.json({ error: `Product mismatch: ${item.productId}` }, 400);
      }
      
      if (dbProduct.stock < item.quantity) {
        return c.json({ error: `Insufficient stock for product: ${dbProduct.name}` }, 400);
      }
      
      totalAmount += dbProduct.price * item.quantity;
      validItems.push({ product: dbProduct, quantity: item.quantity });
      
      const firstImage = dbProduct.image_urls?.[0];
      const stripeImages = firstImage && /^https?:\/\//i.test(firstImage) ? [firstImage] : [];

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: dbProduct.name,
            images: stripeImages,
          },
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: item.quantity,
      });
    }

    let localUser = await import('../models/User').then(m => m.User.findOne({ clerk_id: userId }));
    
    if (!localUser) {
      localUser = await import('../models/User').then(m => m.User.create({
        clerk_id: userId,
        email: `${userId}@clerk-auth.local`,
        role: 'user'
      }));
    }

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/home`,
      metadata: {
        clerkUserId: userId
      }
    });
    
   
    
    const newOrder = await Order.create({
      userId: userId,
      total_amount: totalAmount,
      status: 'pending',
      stripe_session_id: session.id
    });


    for (const validItem of validItems) {
      await OrderItem.create({
        order_id: newOrder._id,
        product_id: validItem.product._id,
        price: validItem.product.price,
        quantity: validItem.quantity
      });
    }

    return c.json({ session_url: session.url }, 200);

  } catch (error: any) {
    console.error('[Checkout] Error:', error?.message || error, error?.stack || '');

    if (error?.message?.includes('STRIPE_SECRET_KEY')) {
      return c.json({ error: 'Stripe is not configured on server. Missing STRIPE_SECRET_KEY.' }, 500);
    }

    if (error?.type?.startsWith('Stripe')) {
      return c.json({ error: `Stripe checkout error: ${error.message}` }, 502);
    }

    return c.json({ error: 'Internal server error processing checkout' }, 500);
  }
};