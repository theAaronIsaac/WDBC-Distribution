import { vi } from "vitest";
import { getDb } from "./mock-db";

vi.mock("./db", () => ({ getDb }));
