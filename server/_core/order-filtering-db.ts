import { getDb } from "./db";
import { and, gte, lte, eq, sql } from "drizzle-orm";
import { orders } from "../drizzle/schema";

export interface OrderFilters {
  startDate?: Date;
  endDate?: Date;
  paymentStatus?: "pending" | "completed" | "failed";
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

/**
 * Get filtered orders based on criteria
 */
export async function getFilteredOrders(filters: OrderFilters) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters.startDate) {
    conditions.push(gte(orders.createdAt, filters.startDate));
  }

  if (filters.endDate) {
    // Add one day to include the entire end date
    const endOfDay = new Date(filters.endDate);
    endOfDay.setHours(23, 59, 59, 999);
    conditions.push(lte(orders.createdAt, endOfDay));
  }

  if (filters.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, filters.paymentStatus));
  }

  if (filters.status) {
    conditions.push(eq(orders.status, filters.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(orders)
    .where(whereClause)
    .orderBy(sql`${orders.createdAt} DESC`);
}
