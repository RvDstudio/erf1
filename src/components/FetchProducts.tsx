// Path: src\components\FetchProducts.tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const fetchProducts = async (category: string) => {
  const { data, error } = await supabase.from(`${category}_products`).select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
};
