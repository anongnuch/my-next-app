import AddToCartButton from "@/app/components/add-to-cart-button";
import { HeartIcon, StarIcon } from "@/app/components/icons";
import QuantityPicker from "@/app/components/quantity-picker";

const money = (value) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function Rating({ rating = 0, reviews }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-brand">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= rating} />
        ))}
      </div>
      {reviews ? (
        <span className="text-[11px] text-muted">({reviews})</span>
      ) : null}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="absolute left-2 top-2 z-10 rounded-sm bg-sale px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
      {children}
    </span>
  );
}

function Art({ product, className = "" }) {
  return (
    <div
      className={`grid place-items-center rounded-md ${className}`}
      style={{ backgroundColor: product.tint }}
      role="img"
      aria-label={product.title}
    >
      <span className="select-none leading-none">{product.art}</span>
    </div>
  );
}

function Price({ product }) {
  const saving = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
      <span
        className={`text-[15px] font-bold ${
          product.oldPrice ? "text-sale" : "text-foreground"
        }`}
      >
        {money(product.price)}
      </span>
      {product.oldPrice ? (
        <>
          <span className="text-xs text-muted line-through">
            {money(product.oldPrice)}
          </span>
          <span className="rounded-sm bg-brand-soft px-[5px] py-[2px] text-[10px] font-semibold uppercase tracking-wide text-sale">
            -{saving}%
          </span>
        </>
      ) : null}
    </div>
  );
}

function StockNote({ product }) {
  if (product.stock !== 0) return null;
  return (
    <p className="mt-1.5 text-[11px] font-semibold text-muted">Out of stock</p>
  );
}

function StockBar({ sold, stock }) {
  const pct = Math.min(100, Math.round((sold / stock) * 100));
  return (
    <div className="mt-1 space-y-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-muted">
        Sold {sold}/{stock}
      </p>
    </div>
  );
}

export function ProductCard({ product }) {
  return (
    <article className="group relative flex h-full flex-col rounded-md border border-transparent bg-background p-3 transition-all hover:border-line hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)]">
      {product.badge ? <Badge>{product.badge}</Badge> : null}
      <button
        type="button"
        aria-label={`Add ${product.title} to wishlist`}
        className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 text-muted opacity-0 transition-opacity hover:text-sale group-hover:opacity-100"
      >
        <HeartIcon size={16} />
      </button>

      <Art product={product} className="aspect-square w-full text-5xl" />

      <p className="mt-3 text-[11px] uppercase tracking-wide text-muted">
        {product.brand}
      </p>
      <h3 className="mt-1 line-clamp-2 min-h-[34px] text-[13px] font-medium leading-[17px] transition-colors group-hover:text-brand-strong">
        <a href="#">{product.title}</a>
      </h3>

      <div className="mt-1.5">
        <Rating rating={product.rating} reviews={product.reviews} />
      </div>

      <div className="mt-1.5">
        <Price product={product} />
      </div>

      {product.sold != null && product.stock ? (
        <StockBar sold={product.sold} stock={product.stock} />
      ) : null}

      <StockNote product={product} />

      {/* mt-auto keeps the action on the card's bottom edge, so a row of cards
          shares one button baseline whether or not they carry a stock bar. */}
      <div className="mt-auto flex flex-col pt-3">
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

export function FeaturedProductCard({ product }) {
  return (
    <article className="relative flex h-full flex-col rounded-md border border-line bg-background p-4">
      {product.badge ? <Badge>{product.badge}</Badge> : null}

      <Art product={product} className="aspect-4/3 w-full text-7xl" />

      <p className="mt-4 text-[11px] uppercase tracking-wide text-muted">
        {product.brand}
      </p>
      <h3 className="mt-1 text-[15px] font-semibold leading-snug">
        <a href="#" className="transition-colors hover:text-brand-strong">
          {product.title}
        </a>
      </h3>

      <div className="mt-2">
        <Rating rating={product.rating} reviews={product.reviews} />
      </div>

      <div className="mt-2">
        <Price product={product} />
      </div>

      {product.sold != null && product.stock ? (
        <StockBar sold={product.sold} stock={product.stock} />
      ) : null}

      <StockNote product={product} />

      <div className="mt-auto flex items-center gap-2 pt-4">
        <QuantityPicker />
        <span className="text-[11px] text-muted">
          Total <strong className="text-foreground">{money(product.price)}</strong>
        </span>
      </div>

      <div className="mt-2 flex flex-col">
        <AddToCartButton product={product} variant="primary" />
      </div>
    </article>
  );
}
