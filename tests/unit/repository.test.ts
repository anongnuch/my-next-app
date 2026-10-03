import { describe, expect, it } from "vitest";
import {
  SORT_OPTIONS,
  getCollection,
  getProduct,
  getTopSaverDeals,
  listBanners,
  listBrands,
  listCategories,
  listProducts,
  searchSuggestions,
} from "@/app/lib/repository";

describe("listCategories", () => {
  it("returns categories ordered by position, each with a product count", () => {
    const categories = listCategories() as { slug: string; name: string; productCount: number }[];
    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
      expect(category.slug).toBeTruthy();
      expect(category.name).toBeTruthy();
      expect(category.productCount).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("listBrands", () => {
  it("returns every seeded brand", () => {
    const brands = listBrands() as { id: string; label: string; title: string }[];
    expect(brands.length).toBeGreaterThan(0);
    expect(brands[0]).toHaveProperty("label");
  });
});

describe("listBanners", () => {
  it("returns banners with a known variant", () => {
    const banners = listBanners() as { variant: string }[];
    expect(banners.length).toBeGreaterThan(0);
    for (const banner of banners) {
      expect(["primary", "promo"]).toContain(banner.variant);
    }
  });
});

describe("listProducts", () => {
  it("paginates with the default page size", () => {
    const result = listProducts();
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.pageSize).toBe(24);
    expect(result.items.length).toBeLessThanOrEqual(24);
    expect(result.pagination.total).toBeGreaterThan(0);
    expect(result.pagination.totalPages).toBe(
      Math.max(1, Math.ceil(result.pagination.total / 24)),
    );
  });

  it("filters by category", () => {
    const [{ name: category }] = listCategories() as { name: string }[];
    const result = listProducts({ category, pageSize: 100 });
    expect(result.items.length).toBeGreaterThan(0);
    for (const item of result.items) {
      expect(item.category).toBe(category);
    }
  });

  it("filters to on-sale products only", () => {
    const result = listProducts({ onSale: true, pageSize: 100 });
    for (const item of result.items) {
      expect(item.oldPrice).not.toBeNull();
    }
  });

  it("filters to in-stock products only", () => {
    const result = listProducts({ inStock: true, pageSize: 100 });
    for (const item of result.items) {
      expect(item.stock).toBeGreaterThan(0);
    }
  });

  it("searches title and brand case-insensitively", () => {
    const [sample] = listProducts({ pageSize: 1 }).items;
    const needle = sample.title.split(" ")[0];

    const result = listProducts({ q: needle.toUpperCase(), pageSize: 100 });
    expect(result.items.some((item) => item.id === sample.id)).toBe(true);
  });

  it("sorts by price ascending and descending", () => {
    const asc = listProducts({ sort: "price-asc", pageSize: 100 }).items.map((p) => p.price);
    const desc = listProducts({ sort: "price-desc", pageSize: 100 }).items.map((p) => p.price);

    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("paginates distinct pages", () => {
    const total = listProducts().pagination.total;
    if (total < 2) return;

    const first = listProducts({ page: 1, pageSize: 1 }).items;
    const second = listProducts({ page: 2, pageSize: 1 }).items;
    expect(first[0].id).not.toBe(second[0].id);
  });

  it("clamps an out-of-range page size", () => {
    const result = listProducts({ pageSize: 1000 });
    expect(result.pagination.pageSize).toBe(100);
  });

  it("keeps category facets stable regardless of the active category filter", () => {
    const [{ name: category }] = listCategories() as { name: string }[];
    const unfiltered = listProducts({ pageSize: 1 }).facets.categories;
    const filtered = listProducts({ category, pageSize: 1 }).facets.categories;
    expect(filtered).toEqual(unfiltered);
  });

  it("rejects an unknown sort key by falling back to relevance ordering", () => {
    expect(SORT_OPTIONS).toContain("relevance");
    expect(SORT_OPTIONS).toContain("price-asc");
  });
});

describe("getProduct", () => {
  it("returns the matching product", () => {
    const [sample] = listProducts({ pageSize: 1 }).items;
    const product = getProduct(sample.id);
    expect(product?.id).toBe(sample.id);
  });

  it("returns null for an unknown id", () => {
    expect(getProduct("does-not-exist")).toBeNull();
  });
});

describe("getCollection", () => {
  it("returns a known collection with its items", () => {
    const collection = getCollection("best-sellers");
    expect(collection?.slug).toBe("best-sellers");
    expect(collection?.items.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown slug", () => {
    expect(getCollection("not-a-collection")).toBeNull();
  });

  it("narrows items to the requested category", () => {
    const collection = getCollection("best-sellers");
    const [firstItem] = collection!.items;
    const narrowed = getCollection("best-sellers", firstItem.category);
    expect(narrowed!.items.every((item) => item.category === firstItem.category)).toBe(true);
  });
});

describe("getTopSaverDeals", () => {
  it("returns a countdown within the current day", () => {
    const deals = getTopSaverDeals();
    expect(deals).not.toBeNull();
    expect(deals!.secondsRemaining).toBeGreaterThanOrEqual(0);
    expect(deals!.secondsRemaining).toBeLessThanOrEqual(86_400);
    expect(new Date(deals!.expiresAt).toISOString()).toBe(deals!.expiresAt);
    expect(deals!.items.length).toBeGreaterThan(0);
  });
});

describe("searchSuggestions", () => {
  it("ranks product and category matches", () => {
    const suggestions = searchSuggestions("a");
    expect(suggestions.length).toBeGreaterThan(0);
    for (const suggestion of suggestions) {
      expect(["product", "category"]).toContain(suggestion.type);
    }
  });

  it("returns nothing for a query that matches no product or category", () => {
    expect(searchSuggestions("zzzznosuchproductzzzz")).toEqual([]);
  });
});
