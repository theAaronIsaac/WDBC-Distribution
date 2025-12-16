import { getAbandonedCartsForRecovery, markRecoveryEmailSent } from "../abandoned-cart-db";
import { sendAbandonedCartEmail } from "../abandoned-cart-email";

/**
 * Job to send recovery emails for abandoned carts
 * Should be run on a schedule (e.g., every hour or every 6 hours)
 */
export async function processAbandonedCartRecovery() {
  console.log('[Abandoned Cart Recovery] Starting job...');
  
  try {
    const abandonedCarts = await getAbandonedCartsForRecovery();
    
    if (abandonedCarts.length === 0) {
      console.log('[Abandoned Cart Recovery] No abandoned carts found');
      return { processed: 0, sent: 0, failed: 0 };
    }

    console.log(`[Abandoned Cart Recovery] Found ${abandonedCarts.length} abandoned carts`);
    
    let sent = 0;
    let failed = 0;

    for (const cart of abandonedCarts) {
      try {
        // Parse cart data
        const cartItems = JSON.parse(cart.cartData);
        
        // Build checkout URL with email pre-filled
        // Note: Update this URL to your actual domain after deployment
        const baseUrl = process.env.VITE_FRONTEND_URL || 'https://your-domain.manus.space';
        const checkoutUrl = `${baseUrl}/checkout?email=${encodeURIComponent(cart.customerEmail)}`;
        
        // Send recovery email
        const success = await sendAbandonedCartEmail({
          customerEmail: cart.customerEmail,
          customerName: cart.customerName,
          cartItems,
          totalAmount: cart.totalAmount,
          checkoutUrl,
        });

        if (success) {
          // Mark as sent
          await markRecoveryEmailSent(cart.id);
          sent++;
          console.log(`[Abandoned Cart Recovery] Email sent to ${cart.customerEmail}`);
        } else {
          failed++;
          console.error(`[Abandoned Cart Recovery] Failed to send email to ${cart.customerEmail}`);
        }
        
        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        failed++;
        console.error(`[Abandoned Cart Recovery] Error processing cart ${cart.id}:`, error);
      }
    }

    console.log(`[Abandoned Cart Recovery] Job completed. Sent: ${sent}, Failed: ${failed}`);
    return { processed: abandonedCarts.length, sent, failed };
    
  } catch (error) {
    console.error('[Abandoned Cart Recovery] Job failed:', error);
    throw error;
  }
}

// Export for use in scheduled jobs or manual triggers
export default processAbandonedCartRecovery;
