import { expect, test } from "@playwright/test";

// Switching a tab always goes over HTTP to /api/collections/{slug}; the client
// never filters an already-loaded array (CLAUDE.md, "Data").

test("a tab fetches its category from the API and marks itself pressed", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "Best Seller" }),
  });
  await expect(section).toBeVisible();

  const all = section.getByRole("button", { name: "All", exact: true });
  const meats = section.getByRole("button", { name: "Raw Meats" });
  await expect(all).toHaveAttribute("aria-pressed", "true");

  const [request] = await Promise.all([
    page.waitForRequest(
      (req) =>
        req.url().includes("/api/collections/best-sellers") &&
        new URL(req.url()).searchParams.get("category") === "Raw Meats",
    ),
    meats.click(),
  ]);
  expect(request.method()).toBe("GET");

  await expect(meats).toHaveAttribute("aria-pressed", "true");
  await expect(all).toHaveAttribute("aria-pressed", "false");
  await expect(section.getByText("Beef Bone Marrow Cut 500g")).toBeVisible();
});

test("returning to All restores the full list", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "Best Seller" }),
  });

  await section.getByRole("button", { name: "Raw Meats" }).click();
  await expect(section.getByText("Coconut Bowl With Fresh Fruits")).toHaveCount(0);

  await section.getByRole("button", { name: "All", exact: true }).click();
  await expect(section.getByText("Coconut Bowl With Fresh Fruits")).toBeVisible();
});

test("a failed tab request shows an error and clears stale products", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "Best Seller" }),
  });
  await expect(section).toBeVisible();

  await page.route("**/api/collections/best-sellers?category=*", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
  );
  await section.getByRole("button", { name: "Raw Meats" }).click();

  await expect(section.getByText("Could not load that category. Try again.")).toBeVisible();
  await expect(section.getByRole("article")).toHaveCount(0);
});

test("a category with no products says so", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "Just Landing" }),
  });
  await expect(section).toBeVisible();

  await page.route("**/api/collections/just-landing?category=*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        slug: "just-landing",
        title: "Just Landing",
        availableCategories: [],
        items: [],
        featured: null,
      }),
    }),
  );
  const tab = section.getByRole("button").nth(1);
  const label = (await tab.textContent())!.trim();
  await tab.click();

  await expect(section.getByText(`No products in ${label} yet.`)).toBeVisible();
});
