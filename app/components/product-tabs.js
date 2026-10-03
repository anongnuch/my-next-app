"use client";

import { useCallback, useState } from "react";
import SectionHeading from "@/app/components/section-heading";
import { FeaturedProductCard, ProductCard } from "@/app/components/product-card";

// The first render uses the rows the server already fetched; switching tabs
// goes over HTTP to /api/collections/{slug} so filtering stays server-side.
export default function ProductTabs({
  title,
  slug,
  tabs,
  products,
  featured = null,
  className = "",
}) {
  const allTab = tabs[0];
  const [active, setActive] = useState(allTab);
  const [items, setItems] = useState(products);
  const [featuredItem, setFeaturedItem] = useState(featured);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const select = useCallback(
    async (tab) => {
      if (tab === active) return;
      setActive(tab);
      setPending(true);
      setError(null);

      try {
        const url =
          tab === allTab
            ? `/api/collections/${slug}`
            : `/api/collections/${slug}?category=${encodeURIComponent(tab)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(String(response.status));

        const collection = await response.json();
        setItems(collection.items);
        setFeaturedItem(
          tab === allTab || collection.featured?.category === tab
            ? collection.featured
            : null,
        );
      } catch {
        setError("Could not load that category. Try again.");
        setItems([]);
        setFeaturedItem(null);
      } finally {
        setPending(false);
      }
    },
    [active, allTab, slug],
  );

  return (
    <section className={className}>
      <div className="mx-auto max-w-[1240px] px-4 py-8">
        <SectionHeading title={title}>
          <ul className="no-scrollbar -mb-1 flex min-w-0 flex-1 items-center gap-4 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => select(tab)}
                  aria-pressed={tab === active}
                  className={`whitespace-nowrap text-[12px] font-semibold transition-colors ${
                    tab === active
                      ? "text-brand-strong underline underline-offset-8"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </SectionHeading>

        {error ? (
          <p className="rounded-md border border-dashed border-sale px-4 py-10 text-center text-[13px] text-sale">
            {error}
          </p>
        ) : items.length === 0 && !featuredItem ? (
          <p className="rounded-md border border-dashed border-line px-4 py-10 text-center text-[13px] text-muted">
            No products in {active} yet.
          </p>
        ) : (
          <div
            aria-busy={pending}
            className={`grid gap-5 transition-opacity ${pending ? "opacity-50" : ""} ${
              featured ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,4fr)]" : ""
            }`}
          >
            {featuredItem ? <FeaturedProductCard product={featuredItem} /> : null}

            <div className="grid grid-cols-2 gap-1 rounded-md bg-background p-1 sm:grid-cols-3 lg:grid-cols-6">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
