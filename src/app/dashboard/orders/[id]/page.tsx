// src\app\dashboard\orders\[id]\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

const supabase = createClient();

const OrderDetails = () => {
  interface OrderItem {
    id: string;
    image_url: string;
    product_name: string;
    quantity: number;
    price: number;
  }

  interface Order {
    id: string;
    created_at: string;
    status: string;
    order_items: OrderItem[];
    total_price: number;
  }

  const [order, setOrder] = useState<Order | null>(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          `
          id,
          created_at,
          status,
          total_price,
          order_items (
            id,
            image_url,
            product_name,
            quantity,
            price
          )
        `
        )
        .eq('id', orderId)
        .single();

      if (!error && data) {
        setOrder(data as Order);
      } else {
        console.error('Error fetching order details:', error);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="pt-10 pl-10 pr-8 pb-10 bg-[#ECF0F6] dark:bg-[#171717]">
      <div className="bg-white dark:bg-[#252525] p-8 rounded-lg shadow-sm border border-gray-200 dark:border-[#2e2e2e]">
        <h1 className="text-2xl text-erf1-500 mb-4">Order Details</h1>
        <p className="text-gray-500">
          <strong className="text-erf1-700">Order ID:</strong> {order.id}
        </p>
        <p className="text-gray-500">
          <strong className="text-erf1-700">Date:</strong> {new Date(order.created_at).toLocaleDateString()}
        </p>

        <h2 className="text-xl text-erf1-500 mt-4 mb-2">Items</h2>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Image</TableHead>
              <TableHead className="text-left">Product Name</TableHead>
              <TableHead className="text-left">Quantity</TableHead>
              <TableHead className="text-left">Price</TableHead>
              <TableHead className="text-left">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.order_items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-2 px-4">
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded"
                    width={64}
                    height={64}
                  />
                </TableCell>
                <TableCell className="py-2 px-4">{item.product_name}</TableCell>
                <TableCell className="py-2 px-4">{item.quantity}</TableCell>
                <TableCell className="py-2 px-4">€{item.price.toFixed(2)}</TableCell>
                <TableCell className="py-2 px-4">€{(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="mt-6 font-bold text-erf1-500 text-lg">Total: €{order.total_price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
