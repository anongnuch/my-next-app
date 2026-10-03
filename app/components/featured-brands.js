import SectionHeading from "@/app/components/section-heading";

export default function FeaturedBrands({ brands }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8">
      <SectionHeading title="Featured Brands" linkLabel="All Offers" arrows />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {brands.map((brand) => (
          <li key={brand.id}>
            <a href="#" className="group block">
              <span
                className="grid aspect-16/10 w-full place-items-center rounded-md text-[72px] transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ backgroundColor: brand.tint }}
                role="img"
                aria-label={brand.title}
              >
                {brand.art}
              </span>
              <span className="mt-3 block text-[11px] uppercase tracking-wide text-muted">
                {brand.label}
              </span>
              <span className="mt-1 block text-[13px] font-semibold leading-snug transition-colors group-hover:text-brand-strong">
                {brand.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
