// src\components\admin\OrdersTable.tsx
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

type Order = {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    };

    fetchOrders();
  }, [supabase]);

  const formatOrderId = (id: string | number) => {
    return `#${String(id).slice(0, 8).toUpperCase()}`;
  };

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatOrderId(order.id)}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>€ {order.total_price.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={
                    order.status.toLowerCase() === 'niet betaald'
                      ? 'bg-red-600 text-red-600 px-2 py-1 rounded-md font-medium text-xs'
                      : 'bg-green-600 text-white px-2 py-1 rounded-md font-medium text-xs'
                  }
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
