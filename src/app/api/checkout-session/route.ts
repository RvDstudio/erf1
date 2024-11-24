import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface Item {
  name: string;
  unit_amount: number;
  quantity: number;
  imageUrl?: string;
}

export async function POST(request: Request) {
  try {
    const { userId, items, invoiceId }: { userId: string; items: Item[]; invoiceId?: string } = await request.json();

    if (!userId || (!items && !invoiceId)) {
      throw new Error('Missing required userId, items, or invoiceId in the request body.');
    }

    let recordId: string | undefined;
    let totalAmount = 0;

    if (invoiceId) {
      // Fetch existing invoice details
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('id, total_amount, status')
        .eq('id', invoiceId)
        .single();

      if (invoiceError || !invoice) {
        throw new Error('Invoice not found or could not be retrieved.');
      }

      if (invoice.status === 'Betaald') {
        throw new Error('Invoice is already paid.');
      }

      recordId = invoiceId;
      totalAmount = invoice.total_amount; // Use the total from the existing invoice
    } else {
      // Create a new order if no invoice is provided
      totalAmount = items.reduce((acc, item) => acc + item.unit_amount * item.quantity, 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            status: 'Niet Betaald',
            total_price: totalAmount,
          },
        ])
        .select()
        .single();

      if (orderError || !order) {
        throw new Error('Failed to create a new order.');
      }

      recordId = order.id;

      // Insert items into `order_items` table
      const orderItems = items.map((item) => ({
        order_id: recordId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.unit_amount,
        image_url: item.imageUrl || '/fallback-image.jpg',
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw new Error('Failed to save order items.');
    }

    // Prepare Stripe checkout session
    const lineItems = items.map((item: Item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [], // Add image URL if available
        },
        unit_amount: Math.round(item.unit_amount * 100), // Convert to cents for Stripe
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/dashboard/cancel`,
      metadata: {
        userId: userId || '',       // Ensure userId is valid
        invoiceId: invoiceId || '', // Send empty string if no invoice
        orderId: recordId || '',    // Send empty string if no order
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
