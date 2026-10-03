import Link from "next/link";

// One record per panel, so the copy and the destination live in the database
// rather than in markup. `variant` picks the treatment.
export default function HeroBanners({ banners }) {
  const primary = banners.find((banner) => banner.variant === "primary");
  const promo = banners.find((banner) => banner.variant === "promo");

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-[1240px] gap-5 px-4 py-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
        {primary ? (
          <article className="relative flex min-h-[260px] items-center overflow-hidden rounded-lg px-8 py-10 sm:px-12"
            style={{ backgroundColor: primary.tint }}
          >
            <div className="relative z-10 max-w-[320px]">
              <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-tight sm:text-[34px]">
                {primary.headline}
              </h1>
              {primary.body ? (
                <p className="mt-3 text-[13px] leading-relaxed text-[#4c565c]">
                  {primary.body}
                </p>
              ) : null}
              <Link
                href={primary.ctaHref}
                className="mt-6 inline-flex h-10 items-center rounded bg-background px-5 text-[13px] font-bold transition-colors hover:bg-brand"
              >
                {primary.ctaLabel}
              </Link>
            </div>

            <span
              className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[150px] leading-none opacity-90 sm:text-[190px]"
              aria-hidden="true"
            >
              {primary.art}
            </span>

            <div className="absolute bottom-5 right-6 z-10 flex gap-1.5">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className={`h-1.5 rounded-full transition-all ${
                    dot === 0 ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          </article>
        ) : null}

        {promo ? (
          <article className="relative flex min-h-[260px] items-center overflow-hidden rounded-lg px-8 py-10"
            style={{ backgroundColor: promo.tint }}
          >
            <div className="relative z-10">
              <h2 className="text-[26px] font-extrabold leading-tight tracking-tight">
                {promo.headline}
              </h2>
              {(promo.body ?? "").split(" · ").map((line) => (
                <p key={line} className="mt-1 text-[13px] font-medium text-[#6b5510]">
                  {line}
                </p>
              ))}
              <Link
                href={promo.ctaHref}
                className="mt-6 inline-flex h-10 items-center rounded bg-background px-5 text-[13px] font-bold transition-colors hover:bg-foreground hover:text-background"
              >
                {promo.ctaLabel}
              </Link>
            </div>

            <span
              className="pointer-events-none absolute -bottom-4 -right-3 select-none text-[130px] leading-none opacity-95"
              aria-hidden="true"
            >
              {promo.art}
            </span>
          </article>
        ) : null}
      </div>
    </section>
  );
}
