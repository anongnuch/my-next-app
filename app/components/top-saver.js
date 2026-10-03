import Countdown from "@/app/components/countdown";
import SectionHeading from "@/app/components/section-heading";
import SignupPromo from "@/app/components/signup-promo";
import { FeaturedProductCard, ProductCard } from "@/app/components/product-card";

export default function TopSaver({ deals }) {
  if (!deals) return null;

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-8">
      <SectionHeading title="Top Saver Today" linkLabel="All Offers" arrows>
        <Countdown seconds={deals.secondsRemaining} />
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)_minmax(0,1.05fr)]">
        {deals.featured ? <FeaturedProductCard product={deals.featured} /> : null}

        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {deals.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <SignupPromo />
      </div>
    </section>
  );
}
