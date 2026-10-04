import { expect, test } from "@playwright/test";

// The API as a browser-facing contract, against the real production server and
// a real SQLite file. Exhaustive status-code coverage lives in the Vitest
// integration suite; this is the smoke layer that proves the deployed build
// serves it.

const LIVE_GETS = [
  "/api/hello",
  "/api/banners",
  "/api/categories",
  "/api/brands",
  "/api/deals/top-saver",
  "/api/collections/best-sellers",
  "/api/collections/just-landing",
  "/api/products",
  "/api/search/suggestions?q=be",
  "/api/openapi",
];

test.describe("live endpoints answer 200 with JSON", () => {
  for (const path of LIVE_GETS) {
    test(path, async ({ request }) => {
      const response = await request.get(path);

      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("application/json");
      await response.json();
    });
  }
});

test("products rejects bad parameters with a typed 400", async ({ request }) => {
  const sort = await request.get("/api/products?sort=bogus");
  expect(sort.status()).toBe(400);
  expect((await sort.json()).code).toBe("invalid_sort");

  const category = await request.get("/api/products?category=Nonexistent");
  expect(category.status()).toBe(400);

  const pageSize = await request.get("/api/products?pageSize=1000");
  expect(pageSize.status()).toBe(400);
});

test("products filters and paginates", async ({ request }) => {
  const body = await (await request.get("/api/products?q=beef&pageSize=2")).json();

  expect(body.items.length).toBeLessThanOrEqual(2);
  expect(body.pagination.total).toBeGreaterThan(0);
  for (const item of body.items) {
    expect(`${item.title} ${item.brand}`.toLowerCase()).toContain("beef");
  }
});

test("an unknown collection is a 404", async ({ request }) => {
  const response = await request.get("/api/collections/does-not-exist");

  expect(response.status()).toBe(404);
});

test("only GET exists: other methods get 405", async ({ request }) => {
  const response = await request.post("/api/categories");

  expect(response.status()).toBe(405);
});

test("the OpenAPI document describes the live routes", async ({ request }) => {
  const spec = await (await request.get("/api/openapi")).json();

  expect(spec.openapi).toMatch(/^3\.1/);
  for (const path of ["/products", "/categories", "/search/suggestions"]) {
    expect(Object.keys(spec.paths)).toContain(path);
  }
});
