import { stripMd } from "@/app/lib/design-md";

export function Section({ id, title, intro, children }) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-line py-8">
      <h2 className="text-[20px] font-extrabold tracking-tight">{title}</h2>
      {intro ? (
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">{intro}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SubHeading({ children }) {
  return (
    <h3 className="mb-3 text-[11px] uppercase tracking-wide text-muted">{children}</h3>
  );
}

export function Token({ children }) {
  return (
    <code className="font-mono text-[11px] text-muted">{children}</code>
  );
}

export function SpecTable({ headers, rows, mono = [] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="bg-surface">
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-line px-3 py-2.5 text-[11px] uppercase tracking-wide text-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2.5 align-top text-[12px] ${
                    mono.includes(j) ? "font-mono text-[11px]" : ""
                  } ${j === 0 ? "font-semibold whitespace-nowrap" : "text-muted"}`}
                >
                  {stripMd(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Swatch({ label, token, hex, role }) {
  return (
    <li className="rounded-md border border-line p-3">
      <span
        className="block h-16 w-full rounded-sm border border-line"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-3 text-[13px] font-semibold">{label}</p>
      <p className="mt-0.5 flex items-center gap-2">
        <Token>{token}</Token>
        <span
          className={`font-mono text-[11px] ${hex.startsWith("#") ? "uppercase" : ""}`}
        >
          {hex}
        </span>
      </p>
      {role ? (
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </p>
      ) : null}
    </li>
  );
}

export function TintSwatch({ token, hex }) {
  const label = token.replace("tint-", "");
  return (
    <li className="text-center">
      <span
        className="grid h-16 w-full place-items-center rounded-md border border-line"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 text-[12px] font-semibold capitalize">{label}</p>
      <p className="font-mono text-[11px] uppercase text-muted">{hex}</p>
    </li>
  );
}

const SAMPLES = {
  countdown: "00 : 20 : 37",
  price: "$12.99",
  badge: "Sale Off",
  kicker: "Grocery",
  eyebrow: "Farmart",
  button: "Add To Cart",
  "button-caps": "Shop by Category",
  meta: "Sold 20/40 · (128)",
  tab: "Fruits & Vegetables",
};

export function TypeSpecimen({ name, spec, use }) {
  const sample = SAMPLES[name] ?? "Fresh Organic Produce";
  const isMono = spec.fontFamily?.startsWith("Geist Mono");

  return (
    <li className="flex flex-col gap-3 border-b border-line py-4 last:border-0 lg:flex-row lg:items-baseline lg:gap-8">
      <p
        className="min-w-0 flex-1 break-words"
        style={{
          fontFamily: isMono ? "var(--font-geist-mono), monospace" : undefined,
          fontSize: spec.fontSize,
          fontWeight: spec.fontWeight,
          lineHeight: spec.lineHeight,
          letterSpacing: spec.letterSpacing,
          textTransform: spec.textTransform,
        }}
      >
        {sample}
      </p>
      <div className="shrink-0 lg:w-[300px]">
        <p className="font-mono text-[11px] font-semibold">{name}</p>
        <p className="mt-0.5 text-[11px] text-muted">
          {spec.fontSize} · {spec.fontWeight} · lh {spec.lineHeight} · ls{" "}
          {spec.letterSpacing}
        </p>
        {use ? <p className="mt-1 text-[11px] text-muted">{use}</p> : null}
      </div>
    </li>
  );
}

export function ScaleBar({ name, value, use }) {
  return (
    <li className="flex items-center gap-4 border-b border-line py-2.5 last:border-0">
      <span className="w-14 shrink-0 font-mono text-[11px] font-semibold">{name}</span>
      <span className="w-12 shrink-0 font-mono text-[11px] text-muted">{value}</span>
      <span className="h-3 shrink-0 rounded-sm bg-brand" style={{ width: value }} />
      <span className="min-w-0 flex-1 truncate text-[11px] text-muted">{use}</span>
    </li>
  );
}

export function RadiusChip({ name, value, use }) {
  return (
    <li className="rounded-md border border-line p-3 text-center">
      <span
        className="mx-auto block h-16 w-16 border border-line bg-brand-soft"
        style={{ borderRadius: value }}
      />
      <p className="mt-3 font-mono text-[11px] font-semibold">{name}</p>
      <p className="font-mono text-[11px] text-muted">{value}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted">{use}</p>
    </li>
  );
}

const ELEVATION_STYLES = [
  { background: "var(--surface)" },
  { border: "1px solid var(--line)" },
  { border: "1px solid var(--line)", boxShadow: "0 10px 24px rgba(0,0,0,0.07)" },
  { border: "1px solid var(--line)", boxShadow: "0 10px 28px rgba(0,0,0,0.07)" },
  { boxShadow: "0 24px 60px rgba(0,0,0,0.16)" },
];

export function ElevationTile({ index, level, treatment, use }) {
  return (
    <li className="flex flex-col">
      <span
        className="grid h-24 place-items-center rounded-md text-[11px] text-muted"
        style={ELEVATION_STYLES[index] ?? {}}
      >
        {index === 0 ? "flat" : `level ${index}`}
      </span>
      <p className="mt-3 text-[12px] font-semibold">{level}</p>
      <p className="mt-0.5 font-mono text-[10px] leading-snug text-muted">{treatment}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted">{use}</p>
    </li>
  );
}

// A labelled cell in the component gallery: token name, live example, and the
// description DESIGN.md gives that component.
export function Stage({ name, description, wide = false, children }) {
  return (
    <li
      className={`flex flex-col rounded-md border border-line ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3 p-5">{children}</div>
      <div className="border-t border-line bg-surface px-4 py-2.5">
        <p className="font-mono text-[11px] font-semibold">{name}</p>
        {description ? (
          <p className="mt-0.5 text-[11px] leading-snug text-muted">{description}</p>
        ) : null}
      </div>
    </li>
  );
}
