import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("orders.create", () => {
  it("creates an order with valid data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First get products to use in order
    const products = await caller.products.list();
    const product = products[0];

    if (!product) {
      throw new Error("No products available for testing");
    }

    const orderData = {
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      customerPhone: "555-0123",
      shippingAddress: "123 Test St",
      shippingCity: "Test City",
      shippingState: "CA",
      shippingZip: "90210",
      shippingCountry: "USA",
      shippingCarrier: "USPS",
      shippingService: "Priority Mail",
      shippingCost: 900,
      paymentMethod: "btc" as const,
      subtotal: product.priceUsd,
      total: product.priceUsd + 900,
      customerNotes: "Test order",
      items: [
        {
          productId: product.id,
          quantity: 1,
          pricePerUnit: product.priceUsd,
        },
      ],
    };

    const result = await caller.orders.create(orderData);

    expect(result).toBeDefined();
    expect(result.order).toBeDefined();
    expect(result.orderNumber).toBeDefined();
    expect(result.orderNumber).toMatch(/^SR[A-Z0-9]+$/);
    expect(result.order.customerName).toBe(orderData.customerName);
    expect(result.order.customerEmail).toBe(orderData.customerEmail);
    expect(result.order.total).toBe(orderData.total);
    expect(result.order.paymentMethod).toBe("btc");
    expect(result.order.status).toBe("pending");
    expect(result.order.paymentStatus).toBe("pending");
  });

  it("creates order with BTC payment method", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();
    const product = products[0];

    if (!product) {
      throw new Error("No products available for testing");
    }

    const orderData = {
      customerName: "BTC Customer",
      customerEmail: "btc@example.com",
      shippingAddress: "456 Crypto Ave",
      shippingCity: "Bitcoin City",
      shippingState: "TX",
      shippingZip: "75001",
      shippingCountry: "USA",
      shippingCarrier: "UPS",
      shippingService: "Ground",
      shippingCost: 1200,
      paymentMethod: "btc" as const,
      subtotal: product.priceUsd,
      total: product.priceUsd + 1200,
      items: [
        {
          productId: product.id,
          quantity: 1,
          pricePerUnit: product.priceUsd,
        },
      ],
    };

    const result = await caller.orders.create(orderData);

    expect(result.order.paymentMethod).toBe("btc");
  });

  it("generates unique order numbers", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();
    const product = products[0];

    if (!product) {
      throw new Error("No products available for testing");
    }

    const orderData = {
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      shippingAddress: "123 Test St",
      shippingCity: "Test City",
      shippingState: "CA",
      shippingZip: "90210",
      shippingCountry: "USA",
      shippingCarrier: "USPS",
      shippingService: "Priority Mail",
      shippingCost: 900,
      paymentMethod: "btc" as const,
      subtotal: product.priceUsd,
      total: product.priceUsd + 900,
      items: [
        {
          productId: product.id,
          quantity: 1,
          pricePerUnit: product.priceUsd,
        },
      ],
    };

    const result1 = await caller.orders.create(orderData);
    const result2 = await caller.orders.create(orderData);

    expect(result1.orderNumber).not.toBe(result2.orderNumber);
  });
});

describe("orders.getByOrderNumber", () => {
  it("retrieves an order by order number", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Create an order first
    const products = await caller.products.list();
    const product = products[0];

    if (!product) {
      throw new Error("No products available for testing");
    }

    const orderData = {
      customerName: "Retrieve Test",
      customerEmail: "retrieve@example.com",
      shippingAddress: "789 Fetch Rd",
      shippingCity: "Query City",
      shippingState: "NY",
      shippingZip: "10001",
      shippingCountry: "USA",
      shippingCarrier: "USPS",
      shippingService: "First Class Mail",
      shippingCost: 500,
      paymentMethod: "btc" as const,
      subtotal: product.priceUsd,
      total: product.priceUsd + 500,
      items: [
        {
          productId: product.id,
          quantity: 2,
          pricePerUnit: product.priceUsd,
        },
      ],
    };

    const created = await caller.orders.create(orderData);

    // Now retrieve it
    const retrieved = await caller.orders.getByOrderNumber({
      orderNumber: created.orderNumber,
    });

    expect(retrieved).toBeDefined();
    expect(retrieved.order.orderNumber).toBe(created.orderNumber);
    expect(retrieved.order.customerName).toBe(orderData.customerName);
    expect(retrieved.items).toBeDefined();
    expect(retrieved.items.length).toBe(1);
    expect(retrieved.items[0]?.quantity).toBe(2);
  });

  it("throws error for non-existent order number", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.orders.getByOrderNumber({ orderNumber: "INVALID123" })
    ).rejects.toThrow("Order not found");
  });
});
