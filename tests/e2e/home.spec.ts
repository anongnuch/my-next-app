import { expect, test } from "@playwright/test";

// `/` fetches every section from /api/* in the browser, on purpose (CLAUDE.md,
// "Data"). These tests pin that behaviour: if a section stops loading over HTTP
// or one failure stops failing the whole page, they break.

const ENDPOINTS = [
  "/api/banners",
  "/api/categories",
  "/api/brands",
  "/api/deals/top-saver",
  "/api/collections/best-sellers",
  "/api/collections/just-landing",
];

test("home loads all six sections over the HTTP API", async ({ page }) => {
  const seen = new Set<string>();
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.pathname.startsWith("/api/") && response.status() === 200) {
      seen.add(url.pathname);
    }
  });

  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Best Seller" })).toBeVisible();
  for (const endpoint of ENDPOINTS) expect(seen).toContain(endpoint);
  expect(errors).toEqual([]);
});

test("home shows the header, search box and cart actions", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Farmart", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search products" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Shopping cart", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Wishlist", exact: true })).toBeVisible();
});

test("home renders product cards with prices and an add-to-cart button", async ({ page }) => {
  await page.goto("/");

  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("button", { name: "Add To Cart" }) })
    .first();
  await expect(card).toBeVisible();
  await expect(card.getByText(/^\$\d/).first()).toBeVisible();
  await expect(card.getByRole("button", { name: "Add To Cart" })).toBeVisible();
});

test("one failing API call fails the page instead of half-rendering it", async ({ page }) => {
  await page.route("**/api/brands", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
  );

  await page.goto("/");

  await expect(page.getByText(/Could not load the storefront/)).toBeVisible();
  await expect(page.getByText(/\/api\/brands responded 500/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Best Seller" })).toHaveCount(0);
});

test("a slow API shows the skeleton before content", async ({ page }) => {
  await page.route("**/api/banners", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.continue();
  });

  await page.goto("/");

  // Content headings are absent while a request is still in flight.
  await expect(page.getByRole("heading", { name: "Best Seller" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Best Seller" })).toBeVisible();
});
