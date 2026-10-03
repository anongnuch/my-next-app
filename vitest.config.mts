import { defineConfig } from "vitest/config";

export default defineConfig({
  // Resolves the "@/*" alias from tsconfig.json natively — no plugin needed.
  resolve: { tsconfigPaths: true },
  test: {
    // Backend only — no DOM needed for the repository or the route handlers.
    environment: "node",
    include: ["tests/{unit,integration}/**/*.test.{ts,js}"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      // text prints in the terminal, html is the browsable report,
      // json-summary is the machine-readable one for CI.
      reporter: ["text", "html", "json-summary"],
      // Scoped to what this suite actually targets: the backend. Including the
      // UI would report a misleading number, since none of it is covered yet.
      include: ["app/lib/**", "app/api/**"],
      // Seed data and the OpenAPI document are data, not logic.
      exclude: ["app/lib/data.js"],
    },
  },
});
