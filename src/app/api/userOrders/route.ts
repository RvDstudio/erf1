// src\app\api\userOrders\route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, total_price, status')
      .eq('user_id', userId);

    if (ordersError) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const { data: products, error: productsError } = await supabase
          .from('order_items')
          .select('id, product_name, quantity, price, description')
          .eq('order_id', order.id);

        if (productsError) {
          return { ...order, products: [] };
        }

        return { ...order, products: products || [] };
      })
    );

    return NextResponse.json({ orders: ordersWithProducts }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
