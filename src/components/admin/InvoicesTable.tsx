'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

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

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, invoice_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInvoices(data);
      }
    };

    fetchInvoices();
  }, [supabase]);

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{invoice.invoice_items.length}</TableCell>
              <TableCell>€ {invoice.total_amount.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={
                    invoice.status.toLowerCase() === 'niet betaald'
                      ? 'bg-red-600 text-red-600 px-2 py-1 rounded-md font-medium text-xs'
                      : 'bg-green-600 text-green-600 px-2 py-1 rounded-md font-medium text-xs'
                  }
                >
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/invoices/${invoice.id}`}>
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
