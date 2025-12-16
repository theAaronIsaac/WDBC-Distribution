import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { processAbandonedCartRecovery } from "./jobs/abandoned-cart-recovery";

export const abandonedCartRouter = router({
  /**
   * Manually trigger abandoned cart recovery job (admin only)
   */
  triggerRecovery: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    const result = await processAbandonedCartRecovery();
    return result;
  }),
});
