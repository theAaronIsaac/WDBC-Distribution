import { ENV } from './_core/env';

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productName: string | null;
    productId: number;
    quantity: number;
    pricePerUnit: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  shippingCarrier: string;
  shippingService: string;
  paymentMethod: string;
  paymentStatus: string;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const emailHtml = generateOrderConfirmationEmailHtml(data);
    
    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `Order Confirmation - ${data.orderNumber}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send order confirmation email:', await response.text());
      return false;
    }

    console.log(`Order confirmation email sent to ${data.customerEmail} for order ${data.orderNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
}

/**
 * Generate HTML email template for order confirmation
 */
function generateOrderConfirmationEmailHtml(data: OrderEmailData): string {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'square':
        return 'Credit/Debit Card (Square)';
      case 'btc':
        return 'Bitcoin (BTC)';
      default:
        return method;
    }
  };

  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.productName || `Product #${item.productId}`}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Quantity: ${item.quantity}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${formatPrice(item.pricePerUnit * item.quantity)}
          </td>
        </tr>
      `
    )
    .join('');

  const paymentInstructions =
    data.paymentMethod === 'btc'
      ? `
        <div style="background-color: #fed7aa; border: 1px solid #f97316; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <h3 style="margin: 0 0 12px 0; color: #9a3412; font-size: 16px;">Payment Instructions</h3>
          <p style="margin: 0 0 8px 0; color: #7c2d12;">Please send your Bitcoin payment to:</p>
          <p style="margin: 0; font-family: monospace; font-size: 12px; word-break: break-all;">bc1qln37wa3029gwvka8p24pn8gjneu9kfffhlq04v</p>
          <p style="margin: 12px 0 0 0; color: #7c2d12; font-size: 14px;">
            Amount (USD): <strong>${formatPrice(data.total)}</strong>
          </p>
          <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 12px;">
            Please send the equivalent amount in Bitcoin. Your order will be processed once payment is confirmed on the blockchain.
          </p>
        </div>
      `
      : `
        <div style="background-color: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #065f46; font-size: 16px;">✓ Payment Successful</h3>
          <p style="margin: 0; color: #047857;">
            Your payment has been processed successfully via ${getPaymentMethodDisplay(data.paymentMethod)}.
          </p>
        </div>
      `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #3b82f6; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">Order Confirmed!</h1>
              <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px;">Thank you for your purchase</p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 24px; text-align: center; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Number</p>
              <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 20px; font-weight: bold; color: #111827;">${data.orderNumber}</p>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 24px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Order Items</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding: 12px; background-color: #f9fafb;">
                    <table width="100%" cellpadding="4" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Subtotal</td>
                        <td style="text-align: right; font-size: 14px;">${formatPrice(data.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">Shipping (${data.shippingCarrier} - ${data.shippingService})</td>
                        <td style="text-align: right; font-size: 14px;">${data.shippingCost === 0 ? 'FREE' : formatPrice(data.shippingCost)}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: bold; font-size: 16px; padding-top: 8px;">Total</td>
                        <td style="text-align: right; font-weight: bold; font-size: 16px; color: #3b82f6; padding-top: 8px;">${formatPrice(data.total)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Information -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">Payment Information</h2>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Payment Method: <strong>${getPaymentMethodDisplay(data.paymentMethod)}</strong><br>
                Payment Status: <strong style="text-transform: capitalize;">${data.paymentStatus}</strong>
              </p>
              ${paymentInstructions}
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #111827;">Shipping Address</h2>
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
                <p style="margin: 0; font-weight: bold; color: #111827;">${data.customerName}</p>
                <p style="margin: 4px 0 0 0; color: #6b7280; line-height: 1.6;">
                  ${data.shippingAddress}<br>
                  ${data.shippingCity}, ${data.shippingState} ${data.shippingZip}<br>
                  ${data.shippingCountry}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Need help with your order?</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email: <a href="mailto:wesley@wdbcenterprises.com" style="color: #3b82f6; text-decoration: none;">wesley@wdbcenterprises.com</a><br>
                Phone: <a href="tel:+16551234567" style="color: #3b82f6; text-decoration: none;">+1 (655) 123-4567</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px;">
                © 2025 WDBC Distribution. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
