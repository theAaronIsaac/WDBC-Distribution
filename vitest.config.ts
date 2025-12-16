import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/*square*.test.ts", "**/*stripe*.test.ts"],
    globals: true,
    setupFiles: ["./server/_core/test-setup.ts"],
    environment: "node",
    
  },
});
