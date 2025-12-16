import { getDb } from "./db";
import { eq, sql } from "drizzle-orm";
import { products } from "../drizzle/schema";
import { sendLowStockAlert } from "./low-stock-alert";

/**
 * Decrement stock quantity for a product
 */
export async function decrementStock(productId: number, quantity: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get product details before update
  const productBefore = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (productBefore.length === 0) {
    throw new Error(`Product ${productId} not found`);
  }

  const product = productBefore[0];
  const newStock = Math.max(0, product.stockQuantity - quantity);
  const wasAboveThreshold = product.stockQuantity > product.lowStockThreshold;
  const isNowBelowThreshold = newStock <= product.lowStockThreshold;

  // Use atomic update to prevent race conditions
  await db
    .update(products)
    .set({
      stockQuantity: sql`GREATEST(0, ${products.stockQuantity} - ${quantity})`,
      inStock: sql`CASE WHEN ${products.stockQuantity} - ${quantity} > 0 THEN true ELSE false END`,
    })
    .where(eq(products.id, productId));

  // Send alert if stock just dropped below threshold
  if (wasAboveThreshold && isNowBelowThreshold) {
    sendLowStockAlert({
      productId: product.id,
      productName: product.name,
      currentStock: newStock,
      threshold: product.lowStockThreshold,
      category: product.category,
    }).catch(error => {
      console.error('Failed to send low stock alert:', error);
    });
  }

  return true;
}

/**
 * Update stock quantity for a product (admin function)
 */
export async function updateStockQuantity(productId: number, newQuantity: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(products)
    .set({
      stockQuantity: newQuantity,
      inStock: newQuantity > 0,
    })
    .where(eq(products.id, productId));
}

/**
 * Update low stock threshold for a product
 */
export async function updateLowStockThreshold(productId: number, threshold: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(products)
    .set({
      lowStockThreshold: threshold,
    })
    .where(eq(products.id, productId));
}

/**
 * Check if product has sufficient stock
 */
export async function checkStockAvailability(productId: number, requestedQuantity: number): Promise<{ available: boolean; currentStock: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select({
      stockQuantity: products.stockQuantity,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (result.length === 0) {
    return { available: false, currentStock: 0 };
  }

  const currentStock = result[0].stockQuantity;
  return {
    available: currentStock >= requestedQuantity,
    currentStock,
  };
}

/**
 * Get products with low stock (below threshold)
 */
export async function getLowStockProducts() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(sql`${products.stockQuantity} <= ${products.lowStockThreshold}`)
    .orderBy(products.stockQuantity);
}
