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

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('user_id', userId);

    if (invoicesError) {
      throw new Error('Failed to fetch invoices.');
    }

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, status, totalAmount, items } = body;

    if (!userId || !status || !totalAmount || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    // Insert invoice
    const { data: newInvoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([
        {
          user_id: userId,
          status: 'Niet Betaald', // Initial status
          total_amount: totalAmount,
        },
      ])
      .select()
      .single();

    if (invoiceError) {
      throw new Error('Failed to insert invoice.');
    }

    // Insert related invoice items
    const invoiceItems = items.map((item) => ({
      invoice_id: newInvoice.id,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      image_url: item.imageUrl,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) {
      throw new Error('Failed to insert invoice items.');
    }

    return NextResponse.json({ message: 'Invoice created successfully.', invoice: newInvoice }, { status: 201 });
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Failed to create invoice.' }, { status: 500 });
  }
}
