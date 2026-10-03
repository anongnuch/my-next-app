import Link from "next/link";
import PageHeader from "@/app/components/page-header";
import SiteHeader from "@/app/components/site-header";
import { ProductCard } from "@/app/components/product-card";
import { listCategories, listProducts } from "@/app/lib/repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products — Farmart",
  description:
    "Browse the full Farmart catalogue — fresh produce, meat, seafood, bakery and daily groceries with member pricing.",
};

const SORTS = [
  ["relevance", "Relevance"],
  ["price-asc", "Price, low to high"],
  ["price-desc", "Price, high to low"],
  ["rating", "Rating"],
  ["discount", "Biggest discount"],
  ["newest", "Newest"],
];

export default async function ProductsPage({ searchParams }) {
  // searchParams is a promise in this version of Next.
  const params = await searchParams;
  const categories = listCategories();

  const query = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = SORTS.some(([value]) => value === params.sort) ? params.sort : "relevance";
  const onSale = params.onSale === "true";

  const known = category && categories.some((row) => row.name === category);
  const { items, pagination, facets } = listProducts({
    q: query || null,
    category: known ? category : null,
    sort,
    onSale,
    pageSize: 48,
  });

  const title = query
    ? `Results for “${query}”`
    : known
      ? category
      : "All Products";

  // Preserve the active search when a filter chip is clicked.
  const hrefWith = (overrides) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (overrides.category) next.set("category", overrides.category);
    if (overrides.sort && overrides.sort !== "relevance") next.set("sort", overrides.sort);
    if (overrides.onSale) next.set("onSale", "true");
    const qs = next.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader categories={categories} query={query} />

      <PageHeader
        title={title}
        description={
          query
            ? "Matched on product title and brand."
            : "Everything in the shop, priced for members. Add straight to your cart — no need to open a product first."
        }
        count={pagination.total}
      >
        <p className="mt-1 text-[11px] text-muted">
          {facets.onSale} on offer right now
        </p>

        <div className="no-scrollbar mt-4 flex min-w-0 items-center gap-4 overflow-x-auto pb-1">
          <Link
            href={hrefWith({ sort, onSale })}
            className={`shrink-0 whitespace-nowrap text-[12px] font-semibold transition-colors ${
              known ? "text-muted hover:text-foreground" : "text-brand-strong underline underline-offset-8"
            }`}
          >
            All
          </Link>
          {categories.map((row) => (
            <Link
              key={row.slug}
              href={hrefWith({ category: row.name, sort, onSale })}
              className={`shrink-0 whitespace-nowrap text-[12px] font-semibold transition-colors ${
                category === row.name
                  ? "text-brand-strong underline underline-offset-8"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {row.name}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={hrefWith({ category, sort, onSale: !onSale })}
            className={`inline-flex h-8 items-center rounded border px-3 text-[12px] font-semibold transition-colors ${
              onSale
                ? "border-brand bg-brand"
                : "border-line text-muted hover:border-brand hover:text-foreground"
            }`}
          >
            On offer only
          </Link>

          {SORTS.map(([value, label]) => (
            <Link
              key={value}
              href={hrefWith({ category, sort: value, onSale })}
              className={`inline-flex h-8 items-center rounded border px-3 text-[12px] font-semibold transition-colors ${
                sort === value
                  ? "border-brand bg-brand"
                  : "border-line text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-8">
        {items.length === 0 ? (
          <p className="rounded-md border border-dashed border-line px-4 py-16 text-center text-[13px] text-muted">
            Nothing matched{query ? ` “${query}”` : " those filters"}.{" "}
            <Link href="/products" className="font-semibold text-foreground underline">
              Clear the search
            </Link>
          </p>
        ) : (
          /* Product Listing grid, per DESIGN.md: 4 equal columns, 20px gap. */
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
