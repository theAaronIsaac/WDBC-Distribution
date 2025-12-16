import { getDb } from "./db";
import { recentlyViewedItems, products } from "../drizzle/schema";
import { desc, eq, and, sql } from "drizzle-orm";

/**
 * Record a product view for a session
 */
export async function recordProductView(sessionId: string, productId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  await db.insert(recentlyViewedItems).values({
    sessionId,
    productId,
  });
}

/**
 * Get recently viewed items for a session
 * Returns up to 6 most recent unique products
 */
export async function getRecentlyViewedItems(sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  
  // Get all views for this session, ordered by most recent
  const views = await db
    .select()
    .from(recentlyViewedItems)
    .where(eq(recentlyViewedItems.sessionId, sessionId))
    .orderBy(desc(recentlyViewedItems.viewedAt));

  if (views.length === 0) {
    return [];
  }

  // Get unique product IDs (most recent first)
  const uniqueProductIds: number[] = [];
  const seen = new Set<number>();
  for (const view of views) {
    if (!seen.has(view.productId)) {
      seen.add(view.productId);
      uniqueProductIds.push(view.productId);
      if (uniqueProductIds.length >= 6) break;
    }
  }

  // Fetch full product details for these IDs
  const productList = await db
    .select()
    .from(products)
    .where(
      sql`${products.id} IN (${sql.join(uniqueProductIds.map((id: number) => sql`${id}`), sql`, `)})`
    );

  // Return products in the same order as uniqueProductIds
  return uniqueProductIds
    .map((id: number) => productList.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);
}

/**
 * Clean up old viewed items (older than 30 days)
 */
export async function cleanupOldViews() {
  const db = await getDb();
  if (!db) throw new Error("Database not initialized");
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await db
    .delete(recentlyViewedItems)
    .where(sql`${recentlyViewedItems.viewedAt} < ${thirtyDaysAgo}`);
}
