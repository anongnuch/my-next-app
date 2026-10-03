import Countdown from "@/app/components/countdown";
import QuantityPicker from "@/app/components/quantity-picker";
import SectionHeading from "@/app/components/section-heading";
import SignupPromo from "@/app/components/signup-promo";
import { FeaturedProductCard, ProductCard } from "@/app/components/product-card";
import DialogDemo from "@/app/design/dialog-demo";
import ToastDemo from "@/app/design/toast-demo";
import PageHeader from "@/app/components/page-header";
import Skeleton from "@/app/components/skeleton";
import {
  CartIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from "@/app/components/icons";
import { brands, categories, topSaverFeatured, topSaverProducts } from "@/app/lib/data";
import { Stage, SubHeading } from "@/app/design/spec-parts";

function Group({ title, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <SubHeading>{title}</SubHeading>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
    </div>
  );
}

export default function ComponentGallery({ components }) {
  const spec = (name) => components[name]?.description ?? "";
  const category = categories[0];
  const brand = brands[0];

  return (
    <div>
      <Group title="Buttons & Actions">
        <Stage name="button-primary" description={spec("button-primary")}>
          <button
            type="button"
            className="flex h-10 items-center justify-center gap-2 rounded bg-brand px-5 text-sm font-bold text-foreground transition-colors hover:bg-brand-strong"
          >
            <CartIcon size={17} />
            Add To Cart
          </button>
        </Stage>

        <Stage name="button-secondary" description={spec("button-secondary")}>
          <button
            type="button"
            className="flex h-9 items-center justify-center gap-1.5 rounded border border-line px-4 text-[13px] font-semibold transition-colors hover:border-brand hover:bg-brand"
          >
            <CartIcon size={16} />
            Add To Cart
          </button>
        </Stage>

        <Stage name="icon-button" description={spec("icon-button")}>
          {[
            { label: "Account", icon: <UserIcon />, badge: null },
            { label: "Wishlist", icon: <HeartIcon />, badge: "2" },
            { label: "Cart", icon: <CartIcon />, badge: "5" },
          ].map((item) => (
            <span
              key={item.label}
              className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-surface"
            >
              {item.icon}
              {item.badge ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold">
                  {item.badge}
                </span>
              ) : null}
            </span>
          ))}
        </Stage>

        <Stage name="button-on-fill" description={spec("button-on-fill")} wide>
          <span className="flex flex-1 items-center justify-center rounded-md bg-[#dfe6ea] p-5">
            <span className="inline-flex h-10 items-center rounded bg-background px-5 text-[13px] font-bold">
              Shop Now
            </span>
          </span>
          <span className="flex flex-1 items-center justify-center rounded-md bg-brand p-5">
            <span className="inline-flex h-10 items-center rounded bg-background px-5 text-[13px] font-bold">
              Shop Now
            </span>
          </span>
        </Stage>
      </Group>

      <Group title="Forms & Inputs">
        <Stage name="form-input" description={spec("form-input")}>
          <input
            aria-label="Example input"
            placeholder="yourdomain@gmail.com"
            className="h-10 w-full rounded border border-line px-3 text-[12px] outline-none placeholder:text-muted focus:border-brand"
          />
        </Stage>

        <Stage name="quantity-stepper" description={spec("quantity-stepper")}>
          <QuantityPicker />
        </Stage>

        <Stage name="search-suggestions" description={spec("search-suggestions")} wide>
          <div className="w-full max-w-[420px]">
            <span className="flex h-11 items-center rounded border border-line px-4 text-sm text-muted">
              bee
            </span>
            <ul className="mt-1 overflow-hidden rounded border border-line bg-background py-1 shadow-[0_10px_28px_rgba(0,0,0,0.07)]">
              {["British Beef Shank (10% Fat)", "Beef Bone Marrow Cut 500g"].map((label, i) => (
                <li key={label}>
                  <span
                    className={`flex items-center gap-2 px-4 py-2 text-[13px] ${i === 0 ? "bg-surface" : ""}`}
                  >
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                  </span>
                </li>
              ))}
              <li>
                <span className="flex items-center gap-2 px-4 py-2 text-[13px]">
                  <span className="min-w-0 flex-1 truncate">Raw Meats</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted">
                    Category
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </Stage>

        <Stage name="search-field" description={spec("search-field")} wide>
          <span className="flex h-11 w-full min-w-0 items-center rounded border border-line">
            <span className="flex h-11 shrink-0 items-center gap-1.5 border-r border-line px-4 text-[11px] font-semibold uppercase tracking-wide text-muted">
              All Categories
              <ChevronDownIcon size={14} />
            </span>
            <span className="min-w-0 flex-1 px-4 text-sm text-muted">
              I&apos;m searching for...
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center text-muted">
              <SearchIcon />
            </span>
          </span>
        </Stage>
      </Group>

      <Group title="Indicators">
        <Stage name="badge-sale" description={spec("badge-sale")}>
          {["Sale Off", "Hot", "New"].map((word) => (
            <span
              key={word}
              className="rounded-sm bg-sale px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
            >
              {word}
            </span>
          ))}
        </Stage>

        <Stage name="price-sale / price-plain" description={spec("price-sale")}>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold text-sale">$12.99</span>
            <span className="text-xs text-muted line-through">$16.99</span>
          </span>
          <span className="text-[15px] font-bold">$14.70</span>
        </Stage>

        <Stage name="price-discount" description={spec("price-discount")}>
          <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="text-[15px] font-bold text-sale">$12.99</span>
            <span className="text-xs text-muted line-through">$16.99</span>
            <span className="rounded-sm bg-brand-soft px-[5px] py-[2px] text-[10px] font-semibold uppercase tracking-wide text-sale">
              -24%
            </span>
          </span>
        </Stage>

        <Stage name="rating-star" description={spec("rating-star")}>
          <span className="flex items-center gap-1">
            <span className="flex text-brand">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= 4} />
              ))}
            </span>
            <span className="text-[11px] text-muted">(128)</span>
          </span>
        </Stage>

        <Stage name="stock-bar" description={spec("stock-bar")}>
          <span className="w-full">
            <span className="block h-1.5 w-full overflow-hidden rounded-full bg-line">
              <span className="block h-full w-1/2 rounded-full bg-brand" />
            </span>
            <span className="mt-1.5 block text-[11px] text-muted">Sold 20/40</span>
          </span>
        </Stage>

        <Stage name="countdown-pill" description={spec("countdown-pill")}>
          <Countdown seconds={1237} />
        </Stage>
      </Group>

      <Group title="Navigation">
        <Stage name="nav-pill" description={spec("nav-pill")}>
          <button
            type="button"
            className="flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide transition-colors hover:bg-brand-strong"
          >
            <MenuIcon size={16} />
            Shop by category
          </button>
        </Stage>

        <Stage name="nav-link" description={spec("nav-link")}>
          {["Deals Today", "Fresh", "Shop"].map((label, i) => (
            <a
              key={label}
              href="#components"
              className="flex items-center gap-1 text-[13px] font-semibold transition-colors hover:text-brand-strong"
            >
              {label}
              {i === 2 ? <ChevronDownIcon size={13} /> : null}
            </a>
          ))}
        </Stage>

        <Stage name="tab-link" description={spec("tab-link")}>
          <span className="text-[12px] font-semibold text-brand-strong underline underline-offset-8">
            All
          </span>
          {["Raw Meats", "Pet Foods"].map((label) => (
            <span key={label} className="text-[12px] font-semibold text-muted">
              {label}
            </span>
          ))}
        </Stage>

        <Stage name="carousel-arrow" description={spec("carousel-arrow")}>
          {[ChevronLeftIcon, ChevronRightIcon].map((Icon, i) => (
            <span
              key={i}
              className="grid h-8 w-8 place-items-center rounded border border-line text-muted transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
            >
              <Icon size={16} />
            </span>
          ))}
        </Stage>

        <Stage name="section-heading" description={spec("section-heading")} wide>
          <div className="w-full [&_h2]:text-[20px]">
            <SectionHeading title="Top Saver Today" linkLabel="All Offers" arrows>
              <Countdown seconds={1237} />
            </SectionHeading>
          </div>
        </Stage>
      </Group>

      <Group title="Cards & Surfaces">
        <Stage name="category-card" description={spec("category-card")}>
          <span className="w-full max-w-[160px]">
            <span className="flex flex-col items-center gap-3 rounded-md border border-line px-3 py-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_10px_24px_rgba(0,0,0,0.07)]">
              <span
                className="grid h-14 w-14 place-items-center rounded-full text-3xl"
                style={{ backgroundColor: category.tint }}
              >
                {category.art}
              </span>
              <span className="whitespace-pre-line text-[12px] font-semibold leading-tight">
                {category.name}
              </span>
            </span>
          </span>
        </Stage>

        <Stage name="brand-tile" description={spec("brand-tile")}>
          <span className="w-full">
            <span
              className="grid aspect-16/10 w-full place-items-center rounded-md text-[56px]"
              style={{ backgroundColor: brand.tint }}
            >
              {brand.art}
            </span>
            <span className="mt-3 block text-[11px] uppercase tracking-wide text-muted">
              {brand.label}
            </span>
            <span className="mt-1 block text-[13px] font-semibold leading-snug">
              {brand.title}
            </span>
          </span>
        </Stage>

        <Stage name="product-card" description={spec("product-card")}>
          <div className="w-full max-w-[220px]">
            <ProductCard product={topSaverProducts[0]} />
          </div>
        </Stage>

        <Stage name="product-card-featured" description={spec("product-card-featured")}>
          <div className="w-full max-w-[260px]">
            <FeaturedProductCard product={topSaverFeatured} />
          </div>
        </Stage>

        <Stage name="page-header" description={spec("page-header")} wide>
          <div className="w-full overflow-hidden rounded-md border border-line">
            <PageHeader title="All Products" count={24} />
          </div>
        </Stage>

        <Stage name="promo-card" description={spec("promo-card")}>
          <div className="w-full max-w-[260px]">
            <SignupPromo />
          </div>
        </Stage>
      </Group>

      <Group title="Overlays">
        <Stage name="dialog" description={spec("dialog")} wide>
          <DialogDemo />
          <p className="text-[11px] leading-relaxed text-muted">
            Opens the real component. Esc, a click on the scrim and the close
            glyph all dismiss it, and focus returns to this button.
          </p>
        </Stage>

        <Stage name="skeleton" description={spec("skeleton")}>
          <div className="w-full space-y-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </Stage>

        <Stage name="toast" description={spec("toast")} wide>
          <ToastDemo />
          <span className="flex items-center gap-2 rounded-md bg-foreground px-4 py-3 text-[13px] font-semibold text-background">
            <CartIcon size={16} />
            British Beef Shank (10% Fat) added to your cart
          </span>
        </Stage>

        <Stage name="dialog-close" description={spec("dialog-close")}>
          <span className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground">
            <CloseIcon size={16} />
          </span>
        </Stage>
      </Group>

      <Group title="Banners">
        <Stage name="hero-banner-primary" description={spec("hero-banner-primary")} wide>
          <span className="relative flex w-full items-center overflow-hidden rounded-lg bg-[#dfe6ea] px-8 py-10">
            <span className="relative z-10 block max-w-[260px]">
              <span className="block text-[28px] font-extrabold leading-[1.15] tracking-tight">
                Active Summer With Juice Milk 300ml
              </span>
              <span className="mt-4 inline-flex h-10 items-center rounded bg-background px-5 text-[13px] font-bold">
                Shop Now
              </span>
            </span>
            <span className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[130px] leading-none">
              🧃
            </span>
          </span>
        </Stage>

        <Stage name="hero-banner-promo" description={spec("hero-banner-promo")} wide>
          <span className="relative flex w-full items-center overflow-hidden rounded-lg bg-brand px-8 py-10">
            <span className="relative z-10 block">
              <span className="block text-[26px] font-extrabold leading-tight tracking-tight">
                20% SALE OFF
              </span>
              <span className="mt-2 block text-[13px] font-medium text-[#6b5510]">
                Synthetic seeds
              </span>
              <span className="mt-4 inline-flex h-10 items-center rounded bg-background px-5 text-[13px] font-bold">
                Shop Now
              </span>
            </span>
            <span className="pointer-events-none absolute -bottom-4 -right-3 text-[110px] leading-none">
              🍱
            </span>
          </span>
        </Stage>
      </Group>
    </div>
  );
}
