import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let _db: any;

export async function getDb() {
  if (!_db) {
    try {
      if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL environment variable is not set.");
        return null;
      }
      const connection = await mysql.createConnection(process.env.DATABASE_URL);
      _db = drizzle(connection);
    } catch (error) {
      console.error("Failed to connect to database:", error);
      return null;
    }
  }
  return _db;
}
