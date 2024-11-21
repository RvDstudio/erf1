'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
  invoice_items: InvoiceItem[];
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function InvoicesTableClient({ invoices, userId }: { invoices: Invoice[]; userId: string }) {
  const handleStripePayment = async (invoice: Invoice) => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          items: invoice.invoice_items.map((item) => ({
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
    invoice.invoice_items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product_name} - €${item.price.toFixed(2)} x ${item.quantity}`,
        10,
        60 + index * 10
      );
    });

    doc.save(`invoice_${invoice.id}.pdf`);
  };

  return (
    <Table>
      <TableCaption>Uw facturen</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Factuur-ID</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Prijs</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Acties</TableHead>
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
              <Button onClick={() => generateInvoicePDF(invoice)} className="text-white bg-erf1-700 hover:bg-erf1-600">
                PDF
              </Button>
              {invoice.status !== 'Betaald' && (
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
  );
}
