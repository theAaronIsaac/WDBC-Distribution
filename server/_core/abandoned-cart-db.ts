import { getDb } from "./db";
import { eq, and, lt, sql } from "drizzle-orm";
import {
  abandonedCarts,
  AbandonedCart,
  InsertAbandonedCart,
} from "../drizzle/schema";

/**
 * Create or update an abandoned cart record
 */
export async function upsertAbandonedCart(cart: InsertAbandonedCart): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if cart already exists for this email
  const existing = await db
    .select()
    .from(abandonedCarts)
    .where(
      and(
        eq(abandonedCarts.customerEmail, cart.customerEmail),
        eq(abandonedCarts.converted, false)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing cart
    await db
      .update(abandonedCarts)
      .set({
        customerName: cart.customerName,
        cartData: cart.cartData,
        totalAmount: cart.totalAmount,
        updatedAt: new Date(),
      })
      .where(eq(abandonedCarts.id, existing[0].id));
  } else {
    // Create new cart
    await db.insert(abandonedCarts).values(cart);
  }
}

/**
 * Get abandoned carts that are 24+ hours old and haven't received recovery email
 */
export async function getAbandonedCartsForRecovery(): Promise<AbandonedCart[]> {
  const db = await getDb();
  if (!db) return [];

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return db
    .select()
    .from(abandonedCarts)
    .where(
      and(
        eq(abandonedCarts.recoveryEmailSent, false),
        eq(abandonedCarts.converted, false),
        lt(abandonedCarts.createdAt, twentyFourHoursAgo)
      )
    );
}

/**
 * Mark recovery email as sent for an abandoned cart
 */
export async function markRecoveryEmailSent(cartId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(abandonedCarts)
    .set({
      recoveryEmailSent: true,
      recoveryEmailSentAt: new Date(),
    })
    .where(eq(abandonedCarts.id, cartId));
}

/**
 * Mark an abandoned cart as converted (order completed)
 */
export async function markCartAsConverted(
  email: string,
  orderNumber: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(abandonedCarts)
    .set({
      converted: true,
      convertedOrderNumber: orderNumber,
    })
    .where(
      and(
        eq(abandonedCarts.customerEmail, email),
        eq(abandonedCarts.converted, false)
      )
    );
}

/**
 * Get abandoned cart by email (for restoring cart on checkout page)
 */
export async function getAbandonedCartByEmail(email: string): Promise<AbandonedCart | null> {
  const db = await getDb();
  if (!db) return null;

  const carts = await db
    .select()
    .from(abandonedCarts)
    .where(
      and(
        eq(abandonedCarts.customerEmail, email),
        eq(abandonedCarts.converted, false)
      )
    )
    .orderBy(sql`${abandonedCarts.createdAt} DESC`)
    .limit(1);

  return carts.length > 0 ? carts[0] : null;
}
