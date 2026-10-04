import { describe, expect, it } from "vitest";
import { GET as getHello } from "@/app/api/hello/route";
import { GET as getOpenApi } from "@/app/api/openapi/route";
import { GET as getCategories } from "@/app/api/categories/route";
import { GET as getBrands } from "@/app/api/brands/route";
import { GET as getBanners } from "@/app/api/banners/route";
import { GET as getProducts } from "@/app/api/products/route";
import { GET as getCollection } from "@/app/api/collections/[slug]/route";
import { GET as getTopSaver } from "@/app/api/deals/top-saver/route";
import { GET as getSearchSuggestions } from "@/app/api/search/suggestions/route";

const req = (url: string) => new Request(url);

describe("GET /api/hello", () => {
  it("returns a fixed greeting", async () => {
    const response = await getHello();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: "Hello World2" });
  });
});

describe("GET /api/openapi", () => {
  it("serves the specification document", async () => {
    const response = await getOpenApi();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Disposition")).toContain("farmart-openapi.json");
    const body = await response.json();
    expect(body.openapi).toBe("3.1.0");
  });
});

describe("GET /api/categories", () => {
  it("lists every category", async () => {
    const body = await getCategories().then((r) => r.json());
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/brands", () => {
  it("lists featured brands", async () => {
    const body = await getBrands().then((r) => r.json());
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/banners", () => {
  it("lists hero banners", async () => {
    const body = await getBanners().then((r) => r.json());
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/products", () => {
  it("returns a page of products", async () => {
    const response = await getProducts(req("http://localhost/api/products"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("items");
    expect(body).toHaveProperty("pagination");
    expect(body).toHaveProperty("facets");
  });

  it("400s on an unknown sort key", async () => {
    const response = await getProducts(req("http://localhost/api/products?sort=bogus"));
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_sort");
  });

  it("400s on an unknown category", async () => {
    const response = await getProducts(
      req("http://localhost/api/products?category=Not+A+Category"),
    );
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("unknown_category");
  });

  it("400s on a page below 1", async () => {
    const response = await getProducts(req("http://localhost/api/products?page=0"));
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_pagination");
  });

  it("400s on a pageSize above 100", async () => {
    const response = await getProducts(req("http://localhost/api/products?pageSize=1000"));
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_pagination");
  });
});

describe("GET /api/collections/[slug]", () => {
  const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

  it("returns a known collection", async () => {
    const response = await getCollection(
      req("http://localhost/api/collections/best-sellers"),
      params("best-sellers"),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.slug).toBe("best-sellers");
  });

  it("404s on an unknown slug", async () => {
    const response = await getCollection(
      req("http://localhost/api/collections/no-such-slug"),
      params("no-such-slug"),
    );
    expect(response.status).toBe(404);
    expect((await response.json()).code).toBe("not_found");
  });
});

describe("GET /api/deals/top-saver", () => {
  it("returns the active deal board", async () => {
    const response = await getTopSaver();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("expiresAt");
    expect(body).toHaveProperty("secondsRemaining");
    expect(body).toHaveProperty("items");
  });
});

describe("GET /api/search/suggestions", () => {
  it("returns suggestions for a query", async () => {
    const response = await getSearchSuggestions(
      req("http://localhost/api/search/suggestions?q=a"),
    );
    expect(response.status).toBe(200);
    expect(Array.isArray(await response.json())).toBe(true);
  });

  it("400s when q is missing", async () => {
    const response = await getSearchSuggestions(req("http://localhost/api/search/suggestions"));
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("missing_query");
  });

  it("400s when q is blank", async () => {
    const response = await getSearchSuggestions(
      req("http://localhost/api/search/suggestions?q=%20"),
    );
    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("missing_query");
  });
});
