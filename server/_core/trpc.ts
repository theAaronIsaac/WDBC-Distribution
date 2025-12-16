import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";

interface Context {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

const t = initTRPC.context<Context>().create({
  isServer: true,
  allowOutsideOfServer: true,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }
  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});
