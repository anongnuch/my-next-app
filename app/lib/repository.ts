import { getDb } from "@/app/lib/db";

// Every function here returns the shape published in app/lib/openapi.ts, so the
// route handlers are a thin HTTP wrapper and the server components can call the
// same code directly without a self-fetch.

type ProductRow = {
  id: string;
  brand: string;
  title: string;
  art: string | null;
  tint: string | null;
  price: number;
  old_price: number | null;
  currency: string;
  rating: number;
  reviews: number;
  category: string;
  stock: number;
  sold: number | null;
  badge: string | null;
  created_at: string;
};

function toProduct(row: ProductRow) {
  const discountPercent = row.old_price
    ? Math.round((1 - row.price / row.old_price) * 100)
    : null;

  return {
    id: row.id,
    brand: row.brand,
    title: row.title,
    art: row.art,
    tint: row.tint,
    price: row.price,
    oldPrice: row.old_price,
    discountPercent,
    currency: row.currency,
    rating: row.rating,
    reviews: row.reviews,
    category: row.category,
    stock: row.stock,
    sold: row.sold,
    badge: row.badge,
  };
}

export type Product = ReturnType<typeof toProduct>;

const SORT_SQL: Record<string, string> = {
  relevance: "p.rating DESC, p.reviews DESC",
  "price-asc": "p.price ASC",
  "price-desc": "p.price DESC",
  rating: "p.rating DESC, p.reviews DESC",
  discount: "COALESCE((p.old_price - p.price) / p.old_price, 0) DESC",
  newest: "p.created_at DESC",
};

export const SORT_OPTIONS = Object.keys(SORT_SQL);

export function listCategories() {
  return getDb()
    .prepare(
      `SELECT c.slug, c.name, c.art, c.tint,
              (SELECT COUNT(*) FROM products p WHERE p.category = c.name) AS productCount
         FROM categories c
        ORDER BY c.position`,
    )
    .all();
}

export function listBrands() {
  return getDb()
    .prepare("SELECT id, label, title, art, tint FROM brands ORDER BY position")
    .all();
}

export function listBanners() {
  return getDb()
    .prepare(
      `SELECT id, variant, headline, body, cta_label AS ctaLabel, cta_href AS ctaHref, art, tint
         FROM banners ORDER BY position`,
    )
    .all();
}

export type ProductQuery = {
  category?: string | null;
  q?: string | null;
  onSale?: boolean;
  inStock?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export function listProducts(query: ProductQuery = {}) {
  const {
    category = null,
    q = null,
    onSale = false,
    inStock = false,
    sort = "relevance",
    page = 1,
    pageSize = 24,
  } = query;

  const where: string[] = [];
  const params: Record<string, unknown> = {};

  if (category) {
    where.push("p.category = @category");
    params.category = category;
  }
  if (q) {
    // LIKE is adequate at this catalogue size; swap in FTS5 if it grows.
    where.push("(LOWER(p.title) LIKE @like OR LOWER(p.brand) LIKE @like)");
    params.like = `%${q.toLowerCase()}%`;
  }
  if (onSale) where.push("p.old_price IS NOT NULL");
  if (inStock) where.push("p.stock > 0");

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const db = getDb();

  const { total } = db
    .prepare(`SELECT COUNT(*) AS total FROM products p ${whereSql}`)
    .get(params) as { total: number };

  // A title match outranks a brand-only match when searching.
  const relevance = q
    ? "CASE WHEN LOWER(p.title) LIKE @like THEN 0 ELSE 1 END, "
    : "";
  const orderBy = `${relevance}${SORT_SQL[sort] ?? SORT_SQL.relevance}`;

  const safePageSize = Math.min(Math.max(pageSize, 1), 100);
  const safePage = Math.max(page, 1);

  const rows = db
    .prepare(
      `SELECT * FROM products p ${whereSql} ORDER BY ${orderBy} LIMIT @limit OFFSET @offset`,
    )
    .all({ ...params, limit: safePageSize, offset: (safePage - 1) * safePageSize }) as ProductRow[];

  // Facets describe the unpaged result set, minus the category filter itself,
  // so the category counts stay stable while a shopper switches tabs.
  const facetWhere = where.filter((clause) => !clause.startsWith("p.category"));
  const facetSql = facetWhere.length ? `WHERE ${facetWhere.join(" AND ")}` : "";
  const facetParams = { ...params };
  delete facetParams.category;

  const categories = db
    .prepare(
      `SELECT p.category AS category, COUNT(*) AS count
         FROM products p ${facetSql}
        GROUP BY p.category ORDER BY p.category`,
    )
    .all(facetParams);

  const { onSaleCount } = db
    .prepare(
      `SELECT COUNT(*) AS onSaleCount FROM products p ${facetSql}
        ${facetSql ? "AND" : "WHERE"} p.old_price IS NOT NULL`,
    )
    .get(facetParams) as { onSaleCount: number };

  return {
    items: rows.map(toProduct),
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    },
    facets: { categories, onSale: onSaleCount },
  };
}

export function getProduct(id: string) {
  const row = getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return row ? toProduct(row) : null;
}

/**
 * Deals run on a rolling daily window, so the countdown is always ahead of now
 * rather than a fixed timestamp that would be stale the day after seeding.
 */
function nextDealBoundary(now = new Date()) {
  const boundary = new Date(now);
  boundary.setUTCHours(24, 0, 0, 0);
  return boundary.toISOString();
}

export function getCollection(slug: string, category?: string | null) {
  const db = getDb();
  const collection = db
    .prepare(
      "SELECT slug, title, featured_product_id AS featuredProductId, expires_at AS expiresAt FROM collections WHERE slug = ?",
    )
    .get(slug) as
    | { slug: string; title: string; featuredProductId: string | null; expiresAt: string | null }
    | undefined;

  if (!collection) return null;

  const rows = db
    .prepare(
      `SELECT p.* FROM collection_items ci
         JOIN products p ON p.id = ci.product_id
        WHERE ci.collection_slug = @slug
          ${category ? "AND p.category = @category" : ""}
        ORDER BY ci.position`,
    )
    .all({ slug, category }) as ProductRow[];

  const featured = collection.featuredProductId
    ? (db.prepare("SELECT * FROM products WHERE id = ?").get(collection.featuredProductId) as
        | ProductRow
        | undefined)
    : undefined;

  const availableCategories = db
    .prepare(
      `SELECT DISTINCT p.category AS category FROM collection_items ci
         JOIN products p ON p.id = ci.product_id
        WHERE ci.collection_slug = ? ORDER BY p.category`,
    )
    .all(slug)
    .map((row: any) => row.category);

  return {
    slug: collection.slug,
    title: collection.title,
    featured: featured ? toProduct(featured) : null,
    items: rows.map(toProduct),
    availableCategories,
  };
}

export function getTopSaverDeals() {
  const collection = getCollection("top-savers");
  if (!collection) return null;

  const expiresAt = nextDealBoundary();
  return {
    expiresAt,
    // Served alongside the timestamp so the countdown does not depend on the
    // viewer's clock agreeing with the server's.
    secondsRemaining: Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000)),
    featured: collection.featured,
    items: collection.items,
  };
}

export function searchSuggestions(q: string, category?: string | null, limit = 8) {
  const db = getDb();
  const like = `%${q.toLowerCase()}%`;

  const products = db
    .prepare(
      `SELECT id, title FROM products p
        WHERE (LOWER(p.title) LIKE @like OR LOWER(p.brand) LIKE @like)
          ${category ? "AND p.category = @category" : ""}
        ORDER BY CASE WHEN LOWER(p.title) LIKE @like THEN 0 ELSE 1 END,
                 p.rating DESC
        LIMIT @limit`,
    )
    .all({ like, category, limit }) as { id: string; title: string }[];

  const categories = db
    .prepare(
      "SELECT name FROM categories WHERE LOWER(name) LIKE @like ORDER BY position LIMIT 3",
    )
    .all({ like }) as { name: string }[];

  return [
    ...products.map((row) => ({
      type: "product" as const,
      label: row.title,
      productId: row.id,
      href: `/products?q=${encodeURIComponent(row.title)}`,
    })),
    ...categories.map((row) => ({
      type: "category" as const,
      label: row.name,
      productId: null,
      href: `/products?category=${encodeURIComponent(row.name)}`,
    })),
  ];
}
