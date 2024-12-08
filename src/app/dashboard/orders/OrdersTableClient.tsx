'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import jsPDF from 'jspdf';

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
  order_items: Product[];
};

export function OrdersTableClient({ orders }: { orders: Order[] }) {
  const generatePDF = (order: Order) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Order Details - ${order.id}`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 10, 20);
    doc.text(`Total Price: €${order.total_price.toFixed(2)}`, 10, 30);
    doc.text(`Status: ${order.status}`, 10, 40);

    doc.text('Products:', 10, 50);
    order.order_items.forEach((product, index) => {
      doc.text(
        `${index + 1}. ${product.product_name} - €${product.price.toFixed(2)} x ${product.quantity}`,
        10,
        60 + index * 10
      );
    });

    doc.save(`order_${order.id}.pdf`);
  };

  return (
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
              <TableCell>
                <span
                  className={
                    order.status.toLowerCase() === 'niet betaald'
                      ? 'bg-red-500 text-white px-2 py-2 rounded-md font-medium text-xs'
                      : 'bg-green-500 text-white px-2 py-2 rounded-md font-medium text-xs'
                  }
                >
                  {order.status}
                </span>
              </TableCell>
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
  );
}
