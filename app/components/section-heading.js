import { ChevronLeftIcon, ChevronRightIcon } from "@/app/components/icons";

export default function SectionHeading({ title, linkLabel, children, arrows }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3">
      <h2 className="text-[20px] font-extrabold tracking-tight">{title}</h2>

      {linkLabel ? (
        <a
          href="#"
          className="text-[12px] font-semibold text-muted transition-colors hover:text-brand-strong"
        >
          {linkLabel} ›
        </a>
      ) : null}

      {children}

      {arrows ? (
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            className="grid h-8 w-8 place-items-center rounded border border-line text-muted transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="grid h-8 w-8 place-items-center rounded border border-line text-muted transition-colors hover:border-brand hover:bg-brand hover:text-foreground"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
