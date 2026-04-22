import { Context } from 'hono';
import Stripe from 'stripe';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Types } from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

export const checkoutSessionController = async (c: Context) => {
  const userId = c.get('userId'); // Extracted from Clerk Auth Middleware
  
  if (!userId) {
    return c.json({ error: 'User authenticated but ID missing in context' }, 401);
  }

  const body = await c.req.json();
  const cartItems = body.items as { productId: string, quantity: number }[];
  
  const productIds = cartItems.map(item => new Types.ObjectId(item.productId));
  
  try {
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    
    if (dbProducts.length !== cartItems.length) {
      return c.json({ error: 'One or more products were not found in database or there are invalid ObjectIds' }, 400);
    }
    
    let totalAmount = 0;
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
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
      
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: dbProduct.name,
            images: dbProduct.image_urls?.length ? [dbProduct.image_urls[0]] : [],
          },
          unit_amount: Math.round(dbProduct.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      });
    }

    // Clerk ID mapping to DB User ObjectID
    let localUser = await import('../models/User').then(m => m.User.findOne({ clerk_id: userId }));
    
    // Si no encontramos al User por clerk_id, crearemos uno temporalmente para no frenar el checkout.
    // Lo ideal es que se registre via Webhook desde la creación en Clerk, pero en entornos de prueba...
    if (!localUser) {
      localUser = await import('../models/User').then(m => m.User.create({
        clerk_id: userId,
        email: `${userId}@clerk-auth.local`, // Fallback email
        role: 'user'
      }));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart`,
      metadata: {
        clerkUserId: userId
      }
    });
    
    // Save pending Order locally
    const newOrder = await Order.create({
      user_id: localUser._id,
      total_amount: totalAmount,
      status: 'pending',
      stripe_session_id: session.id
    });

    // Save Order items
    for (const validItem of validItems) {
      await OrderItem.create({
        order_id: newOrder._id,
        product_id: validItem.product._id,
        price: validItem.product.price,
        quantity: validItem.quantity
      });
    }

    return c.json({ session_url: session.url }, 200);

  } catch (error) {
    console.error('Checkout error:', error);
    return c.json({ error: 'Internal server error processing checkout' }, 500);
  }
};
