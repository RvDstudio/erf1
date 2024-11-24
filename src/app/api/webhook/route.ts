import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });

export async function POST(request: Request) {
  const supabase = createClient();
  const sig = request.headers.get('stripe-signature');
  const body = await request.text(); // Get raw body as text to verify signature

  if (!sig) {
    console.error('Missing Stripe signature');
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  try {
    // Verify the webhook signature to ensure it's from Stripe
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // Log metadata to verify the data is present
      console.log('Session metadata:', session.metadata);

      const invoiceId = session.metadata?.invoiceId;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      // Handle valid invoice or order IDs
      if (invoiceId && invoiceId.trim() !== '' && userId) {
        // Update the invoice status in the Supabase database
        const { error } = await supabase
          .from('invoices')
          .update({ status: 'Betaald' })
          .eq('id', invoiceId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating invoice status:', error);
          return NextResponse.json({ error: 'Database update error' }, { status: 500 });
        }

        console.log('Invoice status updated to Betaald for invoice ID:', invoiceId);
      } else if (orderId && orderId.trim() !== '' && userId) {
        // Update the order status in the Supabase database
        const { error } = await supabase
          .from('orders')
          .update({ status: 'Betaald' })
          .eq('id', orderId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating order status:', error);
          return NextResponse.json({ error: 'Database update error' }, { status: 500 });
        }

        console.log('Order status updated to Betaald for order ID:', orderId);
      } else {
        console.error('Missing valid invoice ID or order ID in session metadata');
        return NextResponse.json({ error: 'Incomplete session data' }, { status: 400 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('Error processing webhook:', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: 'Webhook error', details: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    );
  }
}
