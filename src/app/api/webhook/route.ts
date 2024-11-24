import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-10-28.acacia' });

export async function POST(request: Request) {
  const supabase = createClient();
  const sig = request.headers.get('stripe-signature');
  const body = await request.text(); // Get raw body as text to verify signature

  if (!sig) {
    console.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (orderId) {
        const { error } = await supabase
          .from('orders')
          .update({ status: 'Betaald' }) // Update status to "Paid"
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order status:', error);
          return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
        }

        console.log('Order status updated to Betaald for order ID:', orderId);
      } else {
        console.error('Order ID not found in session metadata');
        return NextResponse.json({ error: 'Order ID missing' }, { status: 400 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('Webhook error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Webhook error', details: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    );
  }
}
