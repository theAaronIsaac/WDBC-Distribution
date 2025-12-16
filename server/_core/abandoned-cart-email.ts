import { ENV } from './_core/env';

export interface AbandonedCartEmailData {
  customerEmail: string;
  customerName: string | null;
  cartItems: Array<{
    productName: string;
    productId: number;
    quantity: number;
    pricePerUnit: number;
  }>;
  totalAmount: number;
  checkoutUrl: string;
}

/**
 * Send abandoned cart recovery email
 */
export async function sendAbandonedCartEmail(data: AbandonedCartEmailData): Promise<boolean> {
  try {
    const emailHtml = generateAbandonedCartEmailHtml(data);
    
    const response = await fetch(`${ENV.forgeApiUrl}/notification/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: data.customerEmail,
        subject: `You left something behind! Complete your order`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      console.error('Failed to send abandoned cart email:', await response.text());
      return false;
    }

    console.log(`Abandoned cart email sent to ${data.customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending abandoned cart email:', error);
    return false;
  }
}

/**
 * Generate HTML email template for abandoned cart recovery
 */
function generateAbandonedCartEmailHtml(data: AbandonedCartEmailData): string {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const greeting = data.customerName ? `Hi ${data.customerName}` : 'Hello';

  const itemsHtml = data.cartItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.productName}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Quantity: ${item.quantity}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${formatPrice(item.pricePerUnit * item.quantity)}
          </td>
        </tr>
      `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Order</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #3b82f6; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">You Left Something Behind!</h1>
              <p style="margin: 8px 0 0 0; color: #dbeafe; font-size: 16px;">Complete your order today</p>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827;">${greeting},</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827;">
                We noticed you started an order but didn't complete it. Your items are still waiting for you!
              </p>
              <p style="margin: 0; font-size: 16px; color: #111827;">
                Complete your purchase now and get your research materials delivered quickly.
              </p>
            </td>
          </tr>

          <!-- Cart Items -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">Your Cart</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding: 16px; background-color: #f9fafb; text-align: right;">
                    <span style="font-size: 14px; color: #6b7280; margin-right: 12px;">Total:</span>
                    <span style="font-weight: bold; font-size: 20px; color: #3b82f6;">${formatPrice(data.totalAmount)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 24px 32px 24px; text-align: center;">
              <a href="${data.checkoutUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Complete Your Order
              </a>
              <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px;">
                This link will take you directly to checkout with your items ready.
              </p>
            </td>
          </tr>

          <!-- Benefits -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #111827;">Why Choose WDBC Distribution?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                  <li>High-quality laboratory-grade compounds</li>
                  <li>Fast and secure shipping options</li>
                  <li>Secure payment processing</li>
                  <li>Dedicated customer support</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Questions? We're here to help!</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email: <a href="mailto:wesley@wdbcenterprises.com" style="color: #3b82f6; text-decoration: none;">wesley@wdbcenterprises.com</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px;">
                © 2025 WDBC Distribution. All rights reserved.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">
                You're receiving this email because you started a checkout on our website.
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
