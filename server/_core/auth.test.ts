import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { createAdminUser } from "./auth";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(): { ctx: TrpcContext; cookies: Map<string, string> } {
  const cookies = new Map<string, string>();

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string) => {
        cookies.set(name, value);
      },
      clearCookie: (name: string) => {
        cookies.delete(name);
      },
    } as TrpcContext["res"],
  };

  return { ctx, cookies };
}

describe("Email/Password Authentication", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "testpass123";

  beforeAll(async () => {
    // Create a test admin user
    await createAdminUser(testEmail, testPassword, "Test Admin");
  });

  it("should successfully login with correct credentials", async () => {
    const { ctx, cookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({
      email: testEmail,
      password: testPassword,
    });

    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe(testEmail);
    expect(result.user?.role).toBe("admin");
    expect(cookies.size).toBeGreaterThan(0);
  });

  it("should fail login with incorrect password", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: testEmail,
        password: "wrongpassword",
      })
    ).rejects.toThrow();
  });

  it("should fail login with non-existent email", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "nonexistent@example.com",
        password: "anypassword",
      })
    ).rejects.toThrow();
  });

  it("should not allow duplicate email registration", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        email: testEmail,
        password: "newpassword123",
      })
    ).rejects.toThrow();
  });

  it("should successfully logout", async () => {
    const { ctx, cookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First login
    await caller.auth.login({
      email: testEmail,
      password: testPassword,
    });

    expect(cookies.size).toBeGreaterThan(0);

    // Then logout
    const result = await caller.auth.logout();

    expect(result.success).toBe(true);
  });
});
