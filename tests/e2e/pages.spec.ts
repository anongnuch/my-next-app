import { expect, test } from "@playwright/test";

const PAGES = ["/", "/products", "/design", "/docs"];

test.describe("every page renders without runtime errors", () => {
  for (const path of PAGES) {
    test(path, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));

      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("header, main").first()).toBeVisible();
      // "/" fills in from the API after hydration; wait for it so a late
      // runtime error is still caught.
      if (path === "/") {
        await expect(page.getByRole("heading", { name: "Best Seller" })).toBeVisible();
      }

      expect(errors).toEqual([]);
    });
  }
});

test("/design renders DESIGN.md live: tokens and component gallery", async ({ page }) => {
  await page.goto("/design");

  await expect(page.getByRole("heading", { name: "Farmart Design System" })).toBeVisible();
  await expect(page.getByText(/colors/i).first()).toBeVisible();
});

test("/docs loads the Swagger UI over the OpenAPI document", async ({ page }) => {
  const spec = page.waitForResponse((r) => r.url().endsWith("/api/openapi") && r.ok());
  await page.goto("/docs");
  await spec;

  await expect(page.getByText("/products").first()).toBeVisible({ timeout: 15_000 });
});

test("an unknown route is a 404", async ({ page }) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);
});

// min-w-0 regression: a nowrap list or table widening the whole document has
// shipped more than once (CLAUDE.md, Gotchas).
test.describe("no horizontal overflow on a phone", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  for (const path of ["/", "/products", "/design", "/docs"]) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("header, main").first()).toBeVisible();
      if (path === "/") {
        await expect(page.getByRole("heading", { name: "Best Seller" })).toBeVisible();
      }

      const { scroll, client } = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(scroll).toBeLessThanOrEqual(client);
    });
  }
});
