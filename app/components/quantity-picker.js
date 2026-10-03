"use client";

import { useState } from "react";

export default function QuantityPicker({ initial = 1 }) {
  const [qty, setQty] = useState(initial);

  return (
    <div className="flex h-9 w-[92px] items-center justify-between rounded border border-line">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQty((n) => Math.max(1, n - 1))}
        className="h-full w-8 text-muted transition-colors hover:text-brand-strong"
      >
        −
      </button>
      <span className="text-sm font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQty((n) => n + 1)}
        className="h-full w-8 text-muted transition-colors hover:text-brand-strong"
      >
        +
      </button>
    </div>
  );
}
