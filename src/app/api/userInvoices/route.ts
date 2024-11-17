// src\app\api\userInvoices\route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id in query parameters.' }, { status: 400 });
    }

    // Fetch invoices with related items
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('user_id', userId);

    if (invoicesError) {
      throw new Error('Failed to fetch invoices.');
    }

    // Format response data
    const formattedInvoices = invoices.map((invoice) => ({
      ...invoice,
      items: invoice.invoice_items || [],
    }));

    return NextResponse.json({ invoices: formattedInvoices }, { status: 200 });
  } catch (error) {
    console.error('Invoice fetching error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to fetch invoices.' }, { status: 500 });
  }
}
