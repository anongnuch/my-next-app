import { defineConfig, devices } from "@playwright/test";

// A dedicated port and database, so the suite never collides with `npm run dev`
// on :3000 and never touches data/farmart.db. The database is seeded from
// app/lib/data.js on first request, same as a fresh clone.
const PORT = 3100;
const DB_PATH = "data/e2e.db";

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Production build, because that is what ships. `next build` rewrites .next,
  // so stop `npm run dev` before running the suite.
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/api/hello`,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
    env: { FARMART_DB_PATH: DB_PATH },
  },
});
