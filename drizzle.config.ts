import type { Config } from "drizzle-kit";

export default {
  schema: "./server/_core/schema.ts",
  out: "./server/_core/drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/sr17018",
  },
} satisfies Config;
