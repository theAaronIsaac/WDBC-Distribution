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

describe("products.list", () => {
  it("returns all products without authentication", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify product structure
    const product = products[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("weightGrams");
    expect(product).toHaveProperty("priceUsd");
    expect(product).toHaveProperty("inStock");
  });

  it("returns products in correct weight order with updated pricing", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();

    // Should be ordered by weight: 1g, 3g, 5g, 10g
    expect(products[0]?.weightGrams).toBe(1);
    expect(products[0]?.priceUsd).toBe(6000); // $60
    expect(products[1]?.weightGrams).toBe(3);
    expect(products[1]?.priceUsd).toBe(18000); // $180
    expect(products[2]?.weightGrams).toBe(5);
    expect(products[2]?.priceUsd).toBe(29000); // $290
    expect(products[3]?.weightGrams).toBe(10);
    expect(products[3]?.priceUsd).toBe(49000); // $490
  });
});

describe("products.getById", () => {
  it("returns a product by id", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First get all products to get a valid ID
    const products = await caller.products.list();
    const firstProduct = products[0];

    if (firstProduct) {
      const product = await caller.products.getById({ id: firstProduct.id });

      expect(product).toBeDefined();
      expect(product.id).toBe(firstProduct.id);
      expect(product.name).toBe(firstProduct.name);
    }
  });

  it("throws error for non-existent product", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.products.getById({ id: 99999 })
    ).rejects.toThrow("Product not found");
  });
});

describe("shipping.getRates", () => {
  it("returns active shipping rates without authentication", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const rates = await caller.shipping.getRates();

    expect(rates).toBeDefined();
    expect(Array.isArray(rates)).toBe(true);
    expect(rates.length).toBeGreaterThan(0);

    // Verify all returned rates are active
    rates.forEach((rate) => {
      expect(rate.active).toBe(true);
      expect(rate).toHaveProperty("carrier");
      expect(rate).toHaveProperty("serviceName");
      expect(rate).toHaveProperty("baseRate");
    });
  });

  it("includes both USPS and UPS options", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const rates = await caller.shipping.getRates();

    const carriers = rates.map((r) => r.carrier);
    expect(carriers).toContain("USPS");
    expect(carriers).toContain("UPS");
  });
});
