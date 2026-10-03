"use client";

import { useEffect, useId, useRef } from "react";
import { CloseIcon } from "@/app/components/icons";

// Built on the native <dialog> element, so focus trapping, Esc-to-dismiss,
// top-layer stacking and focus restoration come from the platform instead of
// being re-implemented. Styling follows the `dialog` specs in DESIGN.md.
export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  primaryLabel = "Confirm",
  onPrimary,
  secondaryLabel = "Cancel",
}) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Esc and el.close() both raise the native close event; that is the single
  // place the parent's state gets synced back.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onClose?.();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // A click whose target is the dialog itself landed on the backdrop —
      // everything inside the panel hits the wrapper below instead.
      onClick={(event) => {
        if (event.target === ref.current) onClose?.();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-[480px] rounded-lg bg-background p-0 text-foreground shadow-[0_24px_60px_rgba(0,0,0,0.16)] backdrop:bg-scrim"
    >
      <div className="relative max-h-[calc(100dvh-4rem)] overflow-y-auto p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          <CloseIcon size={16} />
        </button>

        <h2
          id={titleId}
          className="pr-10 text-[20px] font-extrabold leading-tight tracking-tight"
        >
          {title}
        </h2>

        {description ? (
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{description}</p>
        ) : null}

        {children ? <div className="mt-4">{children}</div> : null}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded border border-line px-5 text-[13px] font-semibold transition-colors hover:border-brand hover:bg-brand"
          >
            {secondaryLabel}
          </button>
          <button
            type="button"
            onClick={onPrimary ?? onClose}
            className="h-10 rounded bg-brand px-5 text-[13px] font-bold transition-colors hover:bg-brand-strong"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
