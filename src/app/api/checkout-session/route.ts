// Path: src\app\api\checkout-session\route.ts
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-10-28.acacia' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface Item {
  name: string;
  unit_amount: number;
  quantity: number;
  imageUrl?: string;
}

interface InvoiceItem {
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export async function POST(request: Request) {
  try {
    const { userId, items, invoiceId }: { userId: string; items: Item[]; invoiceId?: string } = await request.json();

    if (!userId || (!items && !invoiceId)) {
      throw new Error('Missing required userId, items, or invoiceId in the request body.');
    }

    let lineItems = items?.map((item: Item) => ({
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

    if (invoiceId) {
      // Fetch the invoice and its items from the database
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .eq('id', invoiceId)
        .single();

      if (invoiceError || !invoiceData) {
        console.error('Error fetching invoice:', invoiceError);
        throw new Error('Failed to fetch invoice data.');
      }

      lineItems = invoiceData.invoice_items.map((item: InvoiceItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product_name,
            images: item.image_url ? [item.image_url] : [], // Add image URL if available
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents for Stripe
        },
        quantity: item.quantity,
      }));
    }

    if (!lineItems || lineItems.length === 0) {
      throw new Error('No items found for checkout session.');
    }

    // Now create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/dashboard/cancel`,
      metadata: {
        userId: userId, // Include user ID
        invoiceId: invoiceId || '', // Include invoice ID if provided
      },
    });

    console.log('Checkout session created.');
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
