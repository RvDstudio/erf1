// src\components\Invoices\[id]\page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface InvoiceItem {
  id: string; // Unique ID of the invoice item
  product_name: string; // Name of the product
  quantity: number; // Quantity of the product
  price: number; // Price of the product
  image_url?: string; // Optional: URL of the product image
}

interface Invoice {
  id: string; // Unique ID of the invoice
  created_at: string; // Timestamp when the invoice was created
  total_amount: number; // Total amount of the invoice
  status: string; // Status of the invoice (e.g., "betaald", "niet betaald")
  invoice_items: InvoiceItem[]; // List of items in the invoice
}

export default function InvoiceDetails() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchInvoice = async () => {
      const { data, error } = await supabase.from('invoices').select('*, invoice_items(*)').eq('id', id).single();

      if (!error) setInvoice(data);
    };

    if (id) fetchInvoice();
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <h1>Invoice #{invoice.id}</h1>
      <p>Status: {invoice.status}</p>
      <p>Total: €{invoice.total_amount.toFixed(2)}</p>
      <ul>
        {invoice.invoice_items.map((item: InvoiceItem) => (
          <li key={item.id}>
            {item.product_name} x {item.quantity} - €{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
