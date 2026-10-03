import { beforeEach, describe, expect, it } from "vitest";
import { closeDb, getDb, reseed } from "@/app/lib/db";

beforeEach(() => {
  closeDb();
});

describe("getDb", () => {
  it("seeds every table on first use", () => {
    const db = getDb();

    const counts = Object.fromEntries(
      ["categories", "brands", "banners", "products", "collections", "collection_items"].map(
        (table) => [table, (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n],
      ),
    );

    for (const [table, count] of Object.entries(counts)) {
      expect(count, `${table} should be seeded`).toBeGreaterThan(0);
    }
  });

  it("reuses the cached connection across calls", () => {
    expect(getDb()).toBe(getDb());
  });

  it("enforces foreign keys", () => {
    const db = getDb();
    const { foreign_keys: fk } = db.pragma("foreign_keys")[0] as {
      foreign_keys: number;
    };
    expect(fk).toBe(1);
  });
});

describe("schema constraints", () => {
  it("rejects a negative price", () => {
    const db = getDb();
    expect(() =>
      db
        .prepare(
          `INSERT INTO products (id, brand, title, price, currency, category, created_at)
           VALUES ('bad-price', 'Brand', 'Title', -1, 'USD', 'Drinks', '2026-01-01T00:00:00.000Z')`,
        )
        .run(),
    ).toThrow();
  });

  it("rejects an oldPrice that is not above price", () => {
    const db = getDb();
    expect(() =>
      db
        .prepare(
          `INSERT INTO products (id, brand, title, price, old_price, currency, category, created_at)
           VALUES ('bad-old-price', 'Brand', 'Title', 10, 5, 'USD', 'Drinks', '2026-01-01T00:00:00.000Z')`,
        )
        .run(),
    ).toThrow();
  });

  it("rejects a rating outside 0..5", () => {
    const db = getDb();
    expect(() =>
      db
        .prepare(
          `INSERT INTO products (id, brand, title, price, currency, rating, category, created_at)
           VALUES ('bad-rating', 'Brand', 'Title', 10, 'USD', 9, 'Drinks', '2026-01-01T00:00:00.000Z')`,
        )
        .run(),
    ).toThrow();
  });

  it("rejects a product referencing an unknown category", () => {
    const db = getDb();
    expect(() =>
      db
        .prepare(
          `INSERT INTO products (id, brand, title, price, currency, category, created_at)
           VALUES ('bad-category', 'Brand', 'Title', 10, 'USD', 'Not A Category', '2026-01-01T00:00:00.000Z')`,
        )
        .run(),
    ).toThrow();
  });

  it("rejects a banner with an unknown variant", () => {
    const db = getDb();
    expect(() =>
      db
        .prepare(
          `INSERT INTO banners (id, variant, headline, position) VALUES ('bad-banner', 'sidebar', 'Headline', 99)`,
        )
        .run(),
    ).toThrow();
  });
});

describe("reseed", () => {
  it("restores the same product count after clearing every table", () => {
    const db = getDb();
    const before = (db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number }).n;

    const result = reseed() as { count: number };

    const after = (db.prepare("SELECT COUNT(*) AS n FROM products").get() as { n: number }).n;
    expect(after).toBe(before);
    expect(result.count).toBe(before);
  });
});
