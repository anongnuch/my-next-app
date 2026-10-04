import { expect, test } from "@playwright/test";

// /products is server-rendered and driven entirely by searchParams (q,
// category, sort, onSale), so every state is a shareable URL.

const prices = async (page) => {
  const texts = await page
    .locator("main ul > li article")
    .evaluateAll((cards) =>
      cards.map((card) => {
        const price = [...card.querySelectorAll("span")].find((el) =>
          /^\$[\d,]+\.\d{2}$/.test(el.textContent.trim()),
        );
        return price ? price.textContent.trim() : "";
      }),
    );
  return texts.map((text) => Number(text.replace(/[$,]/g, "")));
};

test("lists the whole catalogue with a result count", async ({ page }) => {
  await page.goto("/products");

  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
  expect(await page.locator("main ul > li article").count()).toBeGreaterThan(10);
  await expect(page.getByText(/\d+ on offer right now/)).toBeVisible();
});

test("search matches title and brand, and keeps the term in the box", async ({ page }) => {
  await page.goto("/products?q=beef");

  await expect(page.getByRole("heading", { name: "Results for “beef”" })).toBeVisible();
  await expect(page.getByText("Matched on product title and brand.")).toBeVisible();
  await expect(page.getByText("Beef Bone Marrow Cut 500g")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search products" })).toHaveValue("beef");
});

test("a search with no matches shows the empty state and a way out", async ({ page }) => {
  await page.goto("/products?q=zzzznotaproduct");

  await expect(page.getByText(/Nothing matched/)).toBeVisible();
  await page.getByRole("link", { name: "Clear the search" }).click();

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
});

test("a category link filters the grid and sets the URL", async ({ page, request }) => {
  const categories = await (await request.get("/api/categories")).json();
  const name: string = categories[0].name;

  await page.goto("/products");
  await page.getByRole("link", { name, exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`category=${encodeURIComponent(name).replace(/%20/g, "(%20|\\+)")}`));
  await expect(page.getByRole("heading", { name })).toBeVisible();
});

test("an unknown category is ignored rather than erroring", async ({ page }) => {
  const response = await page.goto("/products?category=Nonexistent");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
});

test("sorting by price orders the grid, both directions", async ({ page }) => {
  await page.goto("/products?sort=price-asc");
  const asc = await prices(page);
  expect(asc.length).toBeGreaterThan(1);
  expect(asc).toEqual([...asc].sort((a, b) => a - b));

  await page.goto("/products?sort=price-desc");
  const desc = await prices(page);
  expect(desc).toEqual([...desc].sort((a, b) => b - a));
});

test("an invalid sort falls back to relevance", async ({ page }) => {
  const response = await page.goto("/products?sort=bogus");

  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
});

test("'On offer only' keeps just discounted products", async ({ page }) => {
  await page.goto("/products");
  const all = await page.locator("main ul > li article").count();

  await page.getByRole("link", { name: "On offer only" }).click();
  await expect(page).toHaveURL(/onSale=true/);

  const cards = page.locator("main ul > li article");
  const sale = await cards.count();
  expect(sale).toBeGreaterThan(0);
  expect(sale).toBeLessThan(all);
  // Every remaining card shows a struck-through old price.
  for (const card of await cards.all()) {
    await expect(card.locator(".line-through")).toHaveCount(1);
  }
});

test("filters compose: the search term survives a sort change", async ({ page }) => {
  await page.goto("/products?q=beef");

  await page.getByRole("link", { name: "Price, low to high" }).click();

  await expect(page).toHaveURL(/q=beef/);
  await expect(page).toHaveURL(/sort=price-asc/);
});

test("the header 'Shop' link lands on /products", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Shop" }).click();

  await expect(page).toHaveURL(/\/products$/);
});
