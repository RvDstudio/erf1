'use server';

import { createClient } from '@/utils/supabase/server';

export async function getUserOrders(userId: string) {
  const supabase = createClient();

  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, created_at, total_price, status, order_items (id, product_name, quantity, price, description)')
    .eq('user_id', userId);

  if (ordersError) {
    throw new Error('Failed to fetch orders');
  }

  return orders;
}
