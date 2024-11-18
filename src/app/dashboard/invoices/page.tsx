'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Session } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import { loadStripe } from '@stripe/stripe-js';

type InvoiceItem = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type Invoice = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: InvoiceItem[];
};

const supabase = createClient();
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

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
  }, []);

  useEffect(() => {
    if (!session) return;

    const fetchInvoices = async () => {
      try {
        const response = await fetch(`/api/userInvoices?user_id=${session.user.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch invoices.');
        }

        const data = await response.json();
        setInvoices(data.invoices || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [session]);

  const handleStripePayment = async (invoice: Invoice) => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user.id,
          items: invoice.items.map((item) => ({
            name: item.product_name,
            unit_amount: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Stripe payment error:', error);
    }
  };

  const generateInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Invoice - ${invoice.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 10, 20);
    doc.text(`Total Amount: €${invoice.total_amount.toFixed(2)}`, 10, 30);
    doc.text(`Status: ${invoice.status}`, 10, 40);

    doc.text('Items:', 10, 50);
    invoice.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product_name} - €${item.price.toFixed(2)} x ${item.quantity}`,
        10,
        60 + index * 10
      );
    });

    doc.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="pt-10 pl-10 pr-8 pb-10">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-medium mb-2 text-erf1-500">Facturen</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table>
            <TableCaption>Your invoices</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link href={`/dashboard/orders/invoices/${invoice.id}`}>
                      <Button className="text-white bg-[#374C69] hover:bg-[#374C69]/90">{invoice.id}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>€{invoice.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      onClick={() => generateInvoicePDF(invoice)}
                      className="text-white bg-erf1-700 hover:bg-erf1-600"
                    >
                      PDF
                    </Button>
                    {invoice.status !== 'Paid' && (
                      <Button
                        onClick={() => handleStripePayment(invoice)}
                        className="text-white bg-erf1-600 hover:bg-erf1-500"
                      >
                        Betalen
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
