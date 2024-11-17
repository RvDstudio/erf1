// src\app\dashboard\orders\page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import jsPDF from 'jspdf';
import { Session } from '@supabase/supabase-js'; // Import Session type from Supabase

type Product = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  description: string;
};

type Order = {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  products: Product[];
};

const supabase = createClient();

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // Explicitly define the type for session
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    getSession();
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!session) {
      setErrorMessage('');
      setLoading(false);
      return;
    }

    const fetchOrderHistory = async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) {
          setErrorMessage('User ID not found.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/userOrders?user_id=${userId}`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch orders.');
        }

        const data = await response.json();
        if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
          setErrorMessage('No orders found.');
        }
      } catch (error) {
        console.error('Error fetching order history:', error as Error);
        setErrorMessage((error as Error).message || 'An error occurred while fetching your order history.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, [session]);

  const generatePDF = (order: Order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Order Details - ${order.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 10, 20);
    doc.text(`Total Price: €${order.total_price.toFixed(2)}`, 10, 30);
    doc.text(`Status: ${order.status}`, 10, 40);

    doc.text('Products:', 10, 50);
    order.products.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.product_name} - €${product.price.toFixed(2)} x ${product.quantity}`,
        10,
        60 + index * 10
      );
    });

    doc.save(`order_${order.id}.pdf`);
  };

  return (
    <div className="pt-10 pl-10 pr-8 pb-10">
      <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-medium mb-2 text-erf1-500">Bestellingen</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableCaption>Een lijst met uw bestellingen.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Bestel ID</TableHead>
              <TableHead>Bestel datum</TableHead>
              <TableHead>Totale prijs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Download PDF</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/dashboard/orders/order/${order.id}`}>
                      <Button className="text-white bg-[#374C69] hover:bg-[#374C69]/90">{order.id}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>€ {order.total_price.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => generatePDF(order)} className="text-white bg-erf1-700 hover:bg-erf1-600">
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
   </div>
  );
}
