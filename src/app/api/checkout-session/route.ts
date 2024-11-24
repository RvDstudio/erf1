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

    if (!userId || !items) {
      throw new Error('Missing required userId or items in the request body.');
    }

    // Calculate the total price
    const totalAmount = items.reduce((acc, item) => acc + item.unit_amount * item.quantity, 0);

    // Insert into the `orders` table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: 'Niet Betaald', // Initial status
          total_price: totalAmount, // Total price for the order
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error('Error saving order:', orderError);
      throw new Error('Failed to save order');
    }

    const orderId = order.id;

    // Insert items into `order_items` table
    const orderItems = items.map((item) => ({
      order_id: orderId,
      product_name: item.name,
      quantity: item.quantity,
      price: item.unit_amount,
      image_url: item.imageUrl || '/fallback-image.jpg',
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      console.error('Error saving order items:', itemsError);
      throw new Error('Failed to save order items');
    }

    // Create Stripe checkout session
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
        userId,
        orderId, // Pass the order ID for later use in webhook
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
