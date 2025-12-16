import pkg from "square";
const { Client } = pkg as any;
import { ENV } from "./env";

let squareClient: any | null = null;

export function getSquareClient(): any {
  if (!squareClient) {
    squareClient = new Client({
      accessToken: ENV.squareAccessToken || "PLACEHOLDER_ACCESS_TOKEN",
      environment: ENV.squareEnvironment === "production" ? "production" : "sandbox",
    });
  }
  return squareClient;
}

export async function createSquarePayment(params: {
  sourceId: string;
  amountCents: number;
  currency?: string;
  orderId?: string;
  customerId?: string;
  note?: string;
}) {
  const client = getSquareClient();
  
  try {
    const response = await client.paymentsApi.createPayment({
      sourceId: params.sourceId,
      amountMoney: {
        amount: BigInt(params.amountCents),
        currency: params.currency || "USD",
      },
      idempotencyKey: `${params.orderId || Date.now()}-${Math.random().toString(36).substring(7)}`,
      ...(params.customerId && { customerId: params.customerId }),
      ...(params.note && { note: params.note }),
    });

    return {
      success: true,
      paymentId: response.result.payment?.id,
      status: response.result.payment?.status,
      receiptUrl: response.result.payment?.receiptUrl,
      payment: response.result.payment,
    };
  } catch (error: any) {
    console.error("[Square] Payment creation failed:", error);
    return {
      success: false,
      error: error.message || "Payment failed",
      errors: error.errors,
    };
  }
}

export async function getSquarePayment(paymentId: string) {
  const client = getSquareClient();
  
  try {
    const response = await client.paymentsApi.getPayment(paymentId);
    return {
      success: true,
      payment: response.result.payment,
    };
  } catch (error: any) {
    console.error("[Square] Get payment failed:", error);
    return {
      success: false,
      error: error.message || "Failed to retrieve payment",
    };
  }
}

export async function refundSquarePayment(params: {
  paymentId: string;
  amountCents: number;
  currency?: string;
  reason?: string;
}) {
  const client = getSquareClient();
  
  try {
    const response = await client.refundsApi.refundPayment({
      paymentId: params.paymentId,
      amountMoney: {
        amount: BigInt(params.amountCents),
        currency: params.currency || "USD",
      },
      idempotencyKey: `refund-${params.paymentId}-${Date.now()}`,
      ...(params.reason && { reason: params.reason }),
    });

    return {
      success: true,
      refundId: response.result.refund?.id,
      status: response.result.refund?.status,
      refund: response.result.refund,
    };
  } catch (error: any) {
    console.error("[Square] Refund failed:", error);
    return {
      success: false,
      error: error.message || "Refund failed",
    };
  }
}
