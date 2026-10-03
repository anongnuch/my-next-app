// The band that opens a listing route. Page titles live here and nowhere else —
// sections inside a page still use SectionHeading.
export default function PageHeader({ title, description, count, children }) {
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto max-w-[1240px] px-4 py-8">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}

        {count != null ? (
          <p className="mt-2 text-[11px] text-muted">
            {count} {count === 1 ? "product" : "products"}
          </p>
        ) : null}

        {children}
      </div>
    </div>
  );
}
