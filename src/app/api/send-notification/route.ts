import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail, sendInvoiceEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'order') {
      const result = await sendOrderConfirmationEmail({
        orderId: data.id,
        totalAmount: data.total_price,
        status: data.status,
        items: data.order_items || [],
      });
      return NextResponse.json({ success: result.success });
    } else if (type === 'invoice') {
      const result = await sendInvoiceEmail({
        invoiceId: data.id,
        totalAmount: data.total_amount,
        status: data.status,
        items: data.invoice_items || [],
      });
      return NextResponse.json({ success: result.success });
    }

    return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
} 