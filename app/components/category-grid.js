import Link from "next/link";
import SectionHeading from "@/app/components/section-heading";

export default function CategoryGrid({ categories }) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8">
      <SectionHeading
        title="Browse by Category"
        linkLabel={`${categories.length} Categories`}
        arrows
      />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="flex h-full flex-col items-center gap-3 rounded-md border border-line px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)]"
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-full text-3xl"
                style={{ backgroundColor: category.tint }}
                aria-hidden="true"
              >
                {category.art}
              </span>
              <span className="text-[12px] font-semibold leading-tight">
                {category.name}
              </span>
              <span className="text-[11px] text-muted">
                {category.productCount} items
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
