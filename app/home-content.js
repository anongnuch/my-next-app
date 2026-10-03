"use client";

import { useEffect, useState } from "react";
import CategoryGrid from "@/app/components/category-grid";
import FeaturedBrands from "@/app/components/featured-brands";
import HeroBanners from "@/app/components/hero-banners";
import ProductTabs from "@/app/components/product-tabs";
import SiteHeader from "@/app/components/site-header";
import Skeleton from "@/app/components/skeleton";
import TopSaver from "@/app/components/top-saver";

// The home page loads from the HTTP API in the browser, so every section it
// renders is a visible request in the Network tab. Each key below maps to one
// operation in app/lib/openapi.ts.
const ENDPOINTS = {
  banners: "/api/banners",
  categories: "/api/categories",
  brands: "/api/brands",
  deals: "/api/deals/top-saver",
  bestSellers: "/api/collections/best-sellers",
  justLanding: "/api/collections/just-landing",
};

function HomeSkeleton() {
  return (
    <main className="flex-1">
      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1240px] gap-5 px-4 py-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
          <Skeleton className="h-[260px] rounded-lg" />
          <Skeleton className="h-[260px] rounded-lg" />
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-4 py-8">
        <Skeleton className="mb-5 h-6 w-48" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-[132px]" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 py-8">
        <Skeleton className="mb-5 h-6 w-48" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="aspect-16/10" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function HomeContent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    // Issued in parallel; one failure fails the page rather than rendering a
    // half-populated home.
    (async () => {
      try {
        const entries = await Promise.all(
          Object.entries(ENDPOINTS).map(async ([key, url]) => {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) throw new Error(`${url} responded ${response.status}`);
            return [key, await response.json()];
          }),
        );
        setData(Object.fromEntries(entries));
      } catch (problem) {
        if (problem.name !== "AbortError") setError(problem.message);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader categories={data?.categories ?? []} />

      {error ? (
        <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 py-16">
          <p className="rounded-md border border-dashed border-sale p-6 text-center text-[13px] text-sale">
            Could not load the storefront — {error}
          </p>
        </main>
      ) : !data ? (
        <HomeSkeleton />
      ) : (
        <main className="flex-1">
          <HeroBanners banners={data.banners} />
          <CategoryGrid categories={data.categories} />
          <FeaturedBrands brands={data.brands} />
          <TopSaver deals={data.deals} />

          <ProductTabs
            title={data.bestSellers.title}
            slug={data.bestSellers.slug}
            tabs={["All", ...data.bestSellers.availableCategories]}
            products={data.bestSellers.items}
            featured={data.bestSellers.featured}
            className="bg-surface"
          />

          <ProductTabs
            title={data.justLanding.title}
            slug={data.justLanding.slug}
            tabs={["All", ...data.justLanding.availableCategories]}
            products={data.justLanding.items}
          />
        </main>
      )}
    </div>
  );
}
