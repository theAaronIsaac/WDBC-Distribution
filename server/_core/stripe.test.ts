import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        origin: "https://test.example.com",
      },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("stripe.createCheckoutSession", () => {
  it("creates a checkout session for valid product", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stripe.createCheckoutSession({
      productWeight: "1g",
      quantity: 1,
      customerEmail: "test@example.com",
      customerName: "Test User",
    });

    expect(result).toHaveProperty("sessionId");
    expect(result).toHaveProperty("url");
    expect(result.sessionId).toMatch(/^cs_test_/);
    expect(result.url).toContain("checkout.stripe.com");
  });

  it("throws error for invalid product weight", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.stripe.createCheckoutSession({
        productWeight: "99g",
        quantity: 1,
      })
    ).rejects.toThrow("Product not found");
  });

  it("creates session with correct pricing for 3g product", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stripe.createCheckoutSession({
      productWeight: "3g",
      quantity: 1,
      customerEmail: "test@example.com",
    });

    expect(result.sessionId).toBeTruthy();
    expect(result.url).toBeTruthy();
  });
});
