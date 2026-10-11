import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import {
  bestSellerFeatured,
  bestSellers,
  brands,
  catalogue,
  justLanding,
  topSaverFeatured,
  topSaverProducts,
} from "@/app/lib/data";

// SQLite file lives outside the app tree and is generated, not committed.
// `app/lib/data.js` remains the seed source so the catalogue has one origin.
// FARMART_DB_PATH lets the test suite point at a throwaway file instead.
// On Vercel the deployment directory is read-only, so the DB goes in /tmp
// (writable, per-instance). It is re-seeded from data.js on each cold start.
const DB_PATH =
  process.env.FARMART_DB_PATH ??
  (process.env.VERCEL
    ? path.join("/tmp", "farmart.db")
    : path.join(process.cwd(), "data", "farmart.db"));

const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  slug      TEXT PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE,
  art       TEXT,
  tint      TEXT,
  position  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS brands (
  id        TEXT PRIMARY KEY,
  label     TEXT NOT NULL,
  title     TEXT NOT NULL,
  art       TEXT,
  tint      TEXT,
  position  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS banners (
  id        TEXT PRIMARY KEY,
  variant   TEXT NOT NULL CHECK (variant IN ('primary', 'promo')),
  headline  TEXT NOT NULL,
  body      TEXT,
  cta_label TEXT,
  cta_href  TEXT,
  art       TEXT,
  tint      TEXT,
  position  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id         TEXT PRIMARY KEY,
  brand      TEXT NOT NULL,
  title      TEXT NOT NULL,
  art        TEXT,
  tint       TEXT,
  price      REAL NOT NULL CHECK (price >= 0),
  old_price  REAL CHECK (old_price IS NULL OR old_price > price),
  currency   TEXT NOT NULL DEFAULT 'USD',
  rating     REAL NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  reviews    INTEGER NOT NULL DEFAULT 0,
  category   TEXT NOT NULL REFERENCES categories(name),
  stock      INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sold       INTEGER,
  badge      TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_price_idx    ON products (price);

CREATE TABLE IF NOT EXISTS collections (
  slug                TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  featured_product_id TEXT REFERENCES products(id),
  expires_at          TEXT
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_slug TEXT NOT NULL REFERENCES collections(slug),
  product_id      TEXT NOT NULL REFERENCES products(id),
  position        INTEGER NOT NULL,
  PRIMARY KEY (collection_slug, product_id)
);
`;

// One canonical taxonomy. The browse tiles and the product `category` column
// previously used two different wordings; this is the tab vocabulary, which is
// the one products actually reference and the one the OpenAPI enum publishes.
const CATEGORY_SEED = [
  { name: "Fruits & Vegetables", art: "🍋", tint: "#fff3d6" },
  { name: "Breads & Sweets", art: "🥖", tint: "#fbe7d2" },
  { name: "Frozen Seafoods", art: "🦀", tint: "#ffe0d9" },
  { name: "Raw Meats", art: "🥩", tint: "#ffdede" },
  { name: "Drinks", art: "🥤", tint: "#e2ecf6" },
  { name: "Coffee & Teas", art: "☕", tint: "#eee3d6" },
  { name: "Milks & Dairies", art: "🥛", tint: "#e4eefb" },
  { name: "Pet Foods", art: "🦴", tint: "#e6f1e2" },
];

const BANNER_SEED = [
  {
    id: "summer-juice",
    variant: "primary",
    headline: "Active Summer With Juice Milk 300ml",
    body: "New arrivals with a better fruits, juice, milks, essential the customer.",
    cta_label: "Shop Now",
    cta_href: "/products",
    art: "🧃",
    tint: "#dfe6ea",
  },
  {
    id: "synthetic-seeds",
    variant: "promo",
    headline: "20% SALE OFF",
    body: "Synthetic seeds · Net 2.0 OZ",
    cta_label: "Shop Now",
    cta_href: "/products?onSale=true",
    art: "🍱",
    tint: "#fdbc1f",
  },
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function seed(db: Database.Database) {
  const insertCategory = db.prepare(
    "INSERT INTO categories (slug, name, art, tint, position) VALUES (?, ?, ?, ?, ?)",
  );
  const insertBrand = db.prepare(
    "INSERT INTO brands (id, label, title, art, tint, position) VALUES (?, ?, ?, ?, ?, ?)",
  );
  const insertBanner = db.prepare(
    `INSERT INTO banners (id, variant, headline, body, cta_label, cta_href, art, tint, position)
     VALUES (@id, @variant, @headline, @body, @cta_label, @cta_href, @art, @tint, @position)`,
  );
  const insertProduct = db.prepare(
    `INSERT INTO products (id, brand, title, art, tint, price, old_price, currency,
                           rating, reviews, category, stock, sold, badge, created_at)
     VALUES (@id, @brand, @title, @art, @tint, @price, @old_price, @currency,
             @rating, @reviews, @category, @stock, @sold, @badge, @created_at)`,
  );
  const insertCollection = db.prepare(
    "INSERT INTO collections (slug, title, featured_product_id, expires_at) VALUES (?, ?, ?, ?)",
  );
  const insertCollectionItem = db.prepare(
    "INSERT INTO collection_items (collection_slug, product_id, position) VALUES (?, ?, ?)",
  );

  // `created_at` is synthesised so `sort=newest` has something real to order by:
  // later entries in the seed list are treated as more recently stocked.
  const base = Date.parse("2026-01-01T00:00:00.000Z");

  db.transaction(() => {
    CATEGORY_SEED.forEach((category, i) =>
      insertCategory.run(slugify(category.name), category.name, category.art, category.tint, i),
    );

    brands.forEach((brand: any, i: number) =>
      insertBrand.run(slugify(brand.label), brand.label, brand.title, brand.art, brand.tint, i),
    );

    BANNER_SEED.forEach((banner, i) => insertBanner.run({ ...banner, position: i }));

    catalogue.forEach((product: any, i: number) =>
      insertProduct.run({
        id: product.id,
        brand: product.brand,
        title: product.title,
        art: product.art ?? null,
        tint: product.tint ?? null,
        price: product.price,
        old_price: product.oldPrice ?? null,
        currency: "USD",
        rating: product.rating ?? 0,
        reviews: product.reviews ?? 0,
        category: product.category,
        stock: product.stock ?? 0,
        sold: product.sold ?? null,
        badge: product.badge ?? null,
        created_at: new Date(base + i * 86_400_000).toISOString(),
      }),
    );

    const collections = [
      {
        slug: "top-savers",
        title: "Top Saver Today",
        featured: topSaverFeatured,
        items: topSaverProducts,
        // Deals run on a rolling daily window; the API recomputes the next
        // boundary on read so the countdown never serves an expired timestamp.
        expiresAt: null,
      },
      {
        slug: "best-sellers",
        title: "Best Seller",
        featured: bestSellerFeatured,
        items: bestSellers,
        expiresAt: null,
      },
      {
        slug: "just-landing",
        title: "Just Landing",
        featured: null,
        items: justLanding,
        expiresAt: null,
      },
    ];

    for (const collection of collections) {
      insertCollection.run(
        collection.slug,
        collection.title,
        (collection.featured as any)?.id ?? null,
        collection.expiresAt,
      );
      (collection.items as any[]).forEach((product, i) =>
        insertCollectionItem.run(collection.slug, product.id, i),
      );
    }
  })();
}

let connection: Database.Database | null = null;

export function getDb(): Database.Database {
  if (connection) return connection;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);

  // Seed on first use so a fresh clone works without a separate setup step.
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM products").get() as {
    count: number;
  };
  if (count === 0) seed(db);

  connection = db;
  return db;
}

/** Closes the cached connection. Tests use it to start from a clean handle. */
export function closeDb() {
  connection?.close();
  connection = null;
}

/** Drops every row and re-seeds. Used by `npm run db:reset`. */
export function reseed() {
  const db = getDb();
  db.transaction(() => {
    db.exec(
      "DELETE FROM collection_items; DELETE FROM collections; DELETE FROM products; DELETE FROM banners; DELETE FROM brands; DELETE FROM categories;",
    );
  })();
  seed(db);
  return db.prepare("SELECT COUNT(*) AS count FROM products").get();
}
