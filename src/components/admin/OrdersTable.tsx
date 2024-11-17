// src\components\admin\OrdersTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import clsx from 'clsx';
import Loading from '@/components/loading';

type Order = {
  id: string;
  formatted_id: string;
  total_price: number;
  status: 'Betaald' | 'Niet betaald';
};

export default function OrdersTable() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase.from('profiles').select('isAdmin').eq('id', user.id).single();

        if (error || !data?.isAdmin) {
          router.push('/');
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
        if (ordersError) {
          setError('Error fetching orders');
        } else {
          const formattedOrders = (ordersData || []).map((order) => ({
            ...order,
            formatted_id: `#${String(order.id).slice(0, 8).toUpperCase()}`,
          }));
          setOrders(formattedOrders);
        }
      } else {
        router.push('/login');
      }

      setLoading(false);
    };

    fetchOrders();
  }, [router, supabase]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-4 text-[#6699CC]">Orders Page</h1>
      <Table>
        <TableCaption>Lijst met alle bestellingen in het systeem</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Formatted Order ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.formatted_id}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>€{order.total_price}</TableCell>
                <TableCell>
                  <span
                    className={clsx(
                      'text-sm font-medium',
                      order.status === 'Niet betaald' ? 'text-red-500' : 'text-green-500'
                    )}
                  >
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
