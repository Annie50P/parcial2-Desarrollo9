import { Context } from 'hono';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

export const stripeWebhookController = async (c: Context) => {
  const signature = c.req.header('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Missing stripe signature or webhook secret');
    return c.json({ error: 'Missing stripe webhook setup' }, 400);
  }

  let event: Stripe.Event;

  try {
    // Hono raw body is required by Stripe to construct the event and validate the signature
    const textBody = await c.req.text();
    event = stripe.webhooks.constructEvent(textBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return c.json({ error: `Webhook Error: ${err.message}` }, 400);
  }

  // Manejar únicamente el evento de pago completado
  if (event.type === 'checkout.session.completed') {
    const sessionStripe = event.data.object as Stripe.Checkout.Session;
    
    // Iniciar transacción atómica en MongoDB
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Encontrar la orden correspondiente al stripeSessionId
      const order = await Order.findOne({ stripe_session_id: sessionStripe.id }).session(session);

      if (!order) {
        throw new Error(`Order with stripe_session_id ${sessionStripe.id} not found`);
      }

      if (order.status !== 'pending') {
        // Podría ser un re-intento de Stripe de una orden ya pagada
        await session.abortTransaction();
        session.endSession();
        return c.json({ received: true }, 200);
      }

      // 2. Cambiar status a 'paid'
      order.status = 'paid';
      await order.save({ session });

      // 3. Encontrar los items de esa orden
      const orderItems = await OrderItem.find({ order_id: order._id }).session(session);

      // 4. Reducir el stock de cada producto atómicamente
      for (const item of orderItems) {
        const result = await Product.updateOne(
          { _id: item.product_id, stock: { $gte: item.quantity } }, // Evitar stock negativo
          { $inc: { stock: -item.quantity } },
          { session }
        );

        if (result.modifiedCount === 0) {
          throw new Error(`Insufficient stock for product id ${item.product_id}`);
        }
      }

      // Si todo funcionó, asentar los cambios
      await session.commitTransaction();
      session.endSession();

      console.log(`Order ${order._id} paid and stock updated successfully`);
      return c.json({ received: true }, 200);

    } catch (dbError: any) {
      // Si ocurre un error, deshacer todas las operaciones en la DB
      await session.abortTransaction();
      session.endSession();
      console.error('Transaction aborted due to error:', dbError.message);
      
      return c.json({ error: 'Database transaction failed' }, 400);
    }
  }

  // Devolver un 200 OK vacío para eventos no manejados y evitar re-intentos de Stripe
  return c.json({ received: true }, 200);
};
