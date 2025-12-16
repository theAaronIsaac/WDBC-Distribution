import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { serveStatic } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { configureClerk } from "./clerk-middleware";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Clerk middleware
  configureClerk(app);

  // Initialize database
  const db = await getDb();
  if (!db) {
    console.error("Failed to initialize database");
    process.exit(1);
  }

  // tRPC middleware
  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: async ({ req, res }) => {
        // Extract user from session/JWT if available
        return {
          user: undefined, // Will be populated from session/JWT
        };
      },
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const publicDir = path.resolve(__dirname, "../../dist/public");
    app.use(express.static(publicDir));

    // Serve index.html for SPA routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(publicDir, "index.html"));
    });
  }

  // Start server
  const port = parseInt(process.env.PORT || "3000");
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`tRPC endpoint: http://localhost:${port}/trpc`);
  });
}

startServer().catch(console.error);
