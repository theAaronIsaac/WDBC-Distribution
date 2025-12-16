import { router, publicProcedure, protectedProcedure } from "./trpc";
import { z } from "zod";
import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import { users, products, orders, contacts, shippingRates } from "./schema";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  // Product routes
  products: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(products);
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const product = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
        if (!product.length) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        return product[0];
      }),

    create: publicProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        category: z.string(),
        stock: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const result = await db.insert(products).values({
          name: input.name,
          description: input.description || "",
          priceUsd: Math.round(input.price * 100),
          category: input.category as any,
          stockQuantity: input.stock,
          inStock: input.stock > 0,
        });
        return { success: true, id: result[0].insertId };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional(),
        price: z.number(),
        category: z.string(),
        stock: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db.update(products).set({
          name: input.name,
          description: input.description || "",
          priceUsd: Math.round(input.price * 100),
          category: input.category as any,
          stockQuantity: input.stock,
          inStock: input.stock > 0,
        }).where(eq(products.id, input.id));

        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db.delete(products).where(eq(products.id, input.id));
        return { success: true };
      }),
  }),

  // Order routes
  orders: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(orders).orderBy(orders.createdAt);
    }),

    getByOrderNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        const order = await db.select().from(orders).where(eq(orders.orderNumber, input.orderNumber)).limit(1);
        if (!order.length) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
        return order[0];
      }),

    filter: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        paymentStatus: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        let conditions = [];
        if (input.status) conditions.push(eq(orders.status, input.status as any));
        if (input.paymentStatus) conditions.push(eq(orders.paymentStatus, input.paymentStatus as any));
        if (input.startDate) conditions.push(gte(orders.createdAt, new Date(input.startDate)));
        if (input.endDate) conditions.push(lte(orders.createdAt, new Date(input.endDate)));

        const query = conditions.length > 0 ? db.select().from(orders).where(and(...conditions)) : db.select().from(orders);
        return query;
      }),

    updateStatus: publicProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
        trackingNumber: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const updateData: any = { status: input.status };
        if (input.trackingNumber) updateData.trackingNumber = input.trackingNumber;

        await db.update(orders).set(updateData).where(eq(orders.id, input.orderId));
        return { success: true };
      }),

    updatePaymentStatus: publicProcedure
      .input(z.object({
        orderId: z.number(),
        paymentStatus: z.enum(["pending", "completed", "failed"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db.update(orders).set({ paymentStatus: input.paymentStatus }).where(eq(orders.id, input.orderId));
        return { success: true };
      }),
  }),

  // Contact routes
  contact: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(contacts).orderBy(contacts.createdAt);
    }),

    updateStatus: publicProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied"]),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        await db.update(contacts).set({ status: input.status }).where(eq(contacts.id, input.id));
        return { success: true };
      }),
  }),

  // Shipping routes
  shipping: router({
    getRates: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(shippingRates).where(eq(shippingRates.active, true));
    }),
  }),

  // Stripe routes
  stripe: router({
    createCheckoutSession: publicProcedure
      .input(z.object({ productWeight: z.string(), quantity: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

        const product = await db.select().from(products).where(eq(products.name, `SR17018 ${input.productWeight}`)).limit(1);
        if (!product.length) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });

        // Mock Stripe session creation
        return {
          sessionId: `cs_test_${Math.random().toString(36).substring(7)}`,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
