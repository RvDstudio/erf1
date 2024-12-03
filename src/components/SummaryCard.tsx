// Path: src\components\SummaryCard.tsx

import { FC, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface SummaryCardProps {
  title: string;
  category: 'zuivel' | 'kaas' | 'vlees';
  description: string;
  icon: React.ReactNode;
}

const SummaryCard: FC<SummaryCardProps> = ({ title, category, description, icon }) => {
  const [count, setCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      let orderData;
      let invoiceData;

      // Fetch the ordered quantities based on the category
      if (category === 'zuivel') {
        orderData = await supabase.from('order_details').select('quantity').not('zuivel_product', 'is', null);
        invoiceData = await supabase
          .from('invoice_items')
          .select('quantity')
          .eq('product_name', 'Hopjesvla 565ml')
          .or('product_name.eq.Kwark met vruchten 565ml');
      } else if (category === 'kaas') {
        orderData = await supabase.from('order_details').select('quantity').not('kaas_product', 'is', null);
        invoiceData = await supabase
          .from('invoice_items')
          .select('quantity')
          .ilike('product_name', '%kruidenkaas%')
          .or('product_name.ilike.%kaas%');
      } else if (category === 'vlees') {
        orderData = await supabase.from('order_details').select('quantity').not('vlees_product', 'is', null);
        invoiceData = await supabase.from('invoice_items').select('quantity').ilike('product_name', '%vlees%');
      }

      // Sum the quantities from both orders and invoices
      let totalQuantity = 0;

      if (orderData?.data) {
        totalQuantity += orderData.data.reduce((sum, item) => sum + item.quantity, 0);
      }

      if (invoiceData?.data) {
        totalQuantity += invoiceData.data.reduce((sum, item) => sum + item.quantity, 0);
      }

      setCount(totalQuantity);
    };

    fetchData();
  }, [category, supabase]);

  return (
    <div className="bg-white dark:bg-[#252525] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e] flex items-center space-x-6">
      <div className="text-6xl text-erf1-500 bg-gray-100 p-4 rounded">{icon}</div>
      <div className="">
        <h2 className="text-md font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-semibold text-erf1-500 dark:text-white">{count}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
