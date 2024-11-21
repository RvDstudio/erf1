'use server';

import { createClient } from '@/utils/supabase/server';

export async function getInvoices(userId: string) {
  const supabase = createClient();

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('id, created_at, total_amount, status, invoice_items (id, product_name, quantity, price)')
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to fetch invoices');
  }

  return invoices;
}
