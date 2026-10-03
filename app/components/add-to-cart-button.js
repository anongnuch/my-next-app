"use client";

import { CartIcon } from "@/app/components/icons";
import { useToast } from "@/app/components/toast";

// Isolating the press in its own client component keeps the product cards
// themselves server-rendered — only this button ships JavaScript.
export default function AddToCartButton({ product, variant = "secondary" }) {
  const { showToast } = useToast();
  const outOfStock = product.stock === 0;

  const base =
    "flex items-center justify-center gap-1.5 rounded transition-colors disabled:cursor-not-allowed";
  const skin =
    variant === "primary"
      ? "h-10 bg-brand text-sm font-bold hover:bg-brand-strong disabled:bg-surface disabled:text-muted"
      : "h-9 border border-line text-[13px] font-semibold hover:border-brand hover:bg-brand disabled:border-line disabled:bg-surface disabled:text-muted";

  return (
    <button
      type="button"
      disabled={outOfStock}
      onClick={() => showToast(`${product.title} added to your cart`)}
      className={`${base} ${skin}`}
    >
      <CartIcon size={variant === "primary" ? 17 : 16} />
      Add To Cart
    </button>
  );
}
