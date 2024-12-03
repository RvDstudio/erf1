import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_most_sold_products');

  if (error) {
    console.error('Error fetching most sold products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}
