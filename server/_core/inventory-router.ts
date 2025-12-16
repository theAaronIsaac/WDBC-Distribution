import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { updateStockQuantity, updateLowStockThreshold, getLowStockProducts } from "./inventory-db";

export const inventoryRouter = router({
  /**
   * Update stock quantity for a product (admin only)
   */
  updateStock: protectedProcedure
    .input(z.object({
      productId: z.number(),
      stockQuantity: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await updateStockQuantity(input.productId, input.stockQuantity);
      return { success: true };
    }),

  /**
   * Update low stock threshold for a product (admin only)
   */
  updateThreshold: protectedProcedure
    .input(z.object({
      productId: z.number(),
      lowStockThreshold: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await updateLowStockThreshold(input.productId, input.lowStockThreshold);
      return { success: true };
    }),

  /**
   * Get products with low stock (admin only)
   */
  getLowStock: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    return await getLowStockProducts();
  }),
});
