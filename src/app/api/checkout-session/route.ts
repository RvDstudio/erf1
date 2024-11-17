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

export async function POST(request: Request) {
  try {
    const { userId, items }: { userId: string; items: Item[] } = await request.json();

    if (!userId || !items || items.length === 0) {
      throw new Error('Missing required userId or items in the request body.');
    }

    console.log('Received items:', items);

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

    // Calculate total price in cents, then convert to dollars for Supabase
    const totalPriceInCents = lineItems.reduce(
      (total: number, item) => total + item.price_data.unit_amount * item.quantity,
      0
    );

    const totalPriceInDollars = totalPriceInCents / 100; // Convert to dollars for storage

    // Insert main order details into Supabase `orders` table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total_price: totalPriceInDollars,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select('id'); // Select `id` to get the new order ID

    if (orderError || !orderData || orderData.length === 0) {
      console.error('Error saving order to Supabase:', orderError);
      throw new Error('Failed to save order to database');
    }

    const orderId = orderData[0].id; // Get the order ID of the newly created order

    // Insert each item from the order into the `order_items` table
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_name: item.name,
      quantity: item.quantity,
      price: item.unit_amount,
      image_url: item.imageUrl || '',
    }));

    console.log('Mapped order items:', orderItems);

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Error saving order items to Supabase:', itemsError);
      throw new Error('Failed to save order items to database');
    }

    // Now create the Stripe Checkout Session and add orderId to metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/dashboard/cancel`,
      metadata: {
        userId: userId, // Include user ID
        orderId: orderId.toString(), // Include order ID as string in metadata
      },
    });

    console.log('Checkout session created, and order with items saved to Supabase.');
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
