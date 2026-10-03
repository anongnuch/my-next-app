"use client";

import { useToast } from "@/app/components/toast";

export default function ToastDemo() {
  const { showToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => showToast("British Beef Shank (10% Fat) added to your cart")}
      className="h-10 rounded bg-brand px-5 text-[13px] font-bold transition-colors hover:bg-brand-strong"
    >
      Trigger toast
    </button>
  );
}
