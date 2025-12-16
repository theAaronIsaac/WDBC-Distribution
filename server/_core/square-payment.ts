import { SquareClient, SquareEnvironment } from 'square';
import { ENV } from './_core/env';
import { randomUUID } from 'crypto';

// Initialize Square client
function getSquareClient() {
  if (!ENV.squareAccessToken || !ENV.squareApplicationId) {
    throw new Error('Square credentials not configured');
  }

  return new SquareClient({
    token: ENV.squareAccessToken,
    environment: ENV.squareEnvironment === 'production' 
      ? SquareEnvironment.Production 
      : SquareEnvironment.Sandbox,
  });
}

export interface CreateSquarePaymentParams {
  sourceId: string; // Payment token from Square Web Payments SDK
  amountCents: number; // Amount in cents
  currency?: string;
  orderNumber: string;
  customerEmail: string;
}

export interface SquarePaymentResult {
  success: boolean;
  paymentId?: string;
  status?: string;
  error?: string;
}

/**
 * Process a payment using Square Payments API
 */
export async function createSquarePayment(
  params: CreateSquarePaymentParams
): Promise<SquarePaymentResult> {
  try {
    const client = getSquareClient();
    
    // Get location ID (required for payments)
    const locationsResponse = await client.locations.list();
    const locationId = locationsResponse.locations?.[0]?.id;
    
    if (!locationId) {
      return {
        success: false,
        error: 'No Square location found. Please configure your Square account.',
      };
    }

    // Create payment
    const paymentResponse = await client.payments.create({
      sourceId: params.sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(params.amountCents),
        currency: (params.currency || 'USD') as any,
      },
      locationId,
      referenceId: params.orderNumber,
      note: `Order ${params.orderNumber}`,
      buyerEmailAddress: params.customerEmail,
    });

    const payment = paymentResponse.payment;

    if (!payment) {
      return {
        success: false,
        error: 'Payment creation failed',
      };
    }

    return {
      success: payment.status === 'COMPLETED',
      paymentId: payment.id,
      status: payment.status,
    };
  } catch (error: any) {
    console.error('Square payment error:', error);
    
    // Extract error message from Square API error
    const errorMessage = error.errors?.[0]?.detail || error.message || 'Payment processing failed';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
