import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

type OrderEmailProps = {
  orderId: string;
  totalAmount: number;
  status: string;
  items: Array<{ product_name: string; quantity: number; price: number }>;
};

type InvoiceEmailProps = {
  invoiceId: string;
  totalAmount: number;
  status: string;
  items: Array<{ product_name: string; quantity: number; price: number }>;
};

export async function sendOrderConfirmationEmail({ orderId, totalAmount, status, items }: OrderEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ERF1 <orders@erf1.nl>',
      to: ['recipient@example.com'], // Replace with actual customer email
      subject: `Order Confirmation #${orderId}`,
      html: `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Status:</strong> ${status}</p>
        
        <h2>Order Details:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: left;">Quantity</th>
            <th style="padding: 8px; text-align: left;">Price</th>
          </tr>
          ${items
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border-top: 1px solid #e5e7eb;">${item.product_name}</td>
              <td style="padding: 8px; border-top: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 8px; border-top: 1px solid #e5e7eb;">€${item.price.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </table>
        
        <p><strong>Total Amount:</strong> €${totalAmount.toFixed(2)}</p>
      `,
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
    }
    return { success: !error };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false };
  }
}

export async function sendInvoiceEmail({ invoiceId, totalAmount, status, items }: InvoiceEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ERF1 <invoices@erf1.nl>',
      to: ['recipient@example.com'], // Replace with actual customer email
      subject: `Invoice #${invoiceId}`,
      html: `
        <h1>Invoice</h1>
        <p><strong>Invoice ID:</strong> #${invoiceId}</p>
        <p><strong>Status:</strong> ${status}</p>
        
        <h2>Invoice Details:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: left;">Quantity</th>
            <th style="padding: 8px; text-align: left;">Price</th>
          </tr>
          ${items
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border-top: 1px solid #e5e7eb;">${item.product_name}</td>
              <td style="padding: 8px; border-top: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 8px; border-top: 1px solid #e5e7eb;">€${item.price.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </table>
        
        <p><strong>Total Amount:</strong> €${totalAmount.toFixed(2)}</p>
      `,
    });

    if (error) {
      console.error('Error sending invoice email:', error);
    }
    return { success: !error };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false };
  }
} 