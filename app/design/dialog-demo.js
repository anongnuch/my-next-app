"use client";

import { useState } from "react";
import Dialog from "@/app/components/dialog";
import { topSaverProducts } from "@/app/lib/data";

const product = topSaverProducts[0];

export default function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 rounded bg-brand px-5 text-[13px] font-bold transition-colors hover:bg-brand-strong"
      >
        Open dialog
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Remove this from your cart?"
        description="You can add it back at any time — the price shown is held for 24 hours."
        primaryLabel="Remove item"
        secondaryLabel="Keep it"
      >
        <div className="flex items-center gap-3 rounded-md border border-line p-3">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-md text-3xl"
            style={{ backgroundColor: product.tint }}
            aria-hidden="true"
          >
            {product.art}
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-wide text-muted">
              {product.brand}
            </span>
            <span className="block text-[13px] font-medium leading-snug">
              {product.title}
            </span>
          </span>
          <span className="ml-auto shrink-0 text-[15px] font-bold text-sale">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </Dialog>
    </>
  );
}
