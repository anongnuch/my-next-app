import Link from "next/link";
import ComponentGallery from "@/app/design/component-gallery";
import {
  ElevationTile,
  RadiusChip,
  ScaleBar,
  Section,
  SpecTable,
  SubHeading,
  Swatch,
  TintSwatch,
  TypeSpecimen,
} from "@/app/design/spec-parts";
import {
  colorGroups,
  guardrails,
  loadDesignMd,
  stripMd,
  tableUnder,
} from "@/app/lib/design-md";
import { ArrowRightIcon, LeafIcon } from "@/app/components/icons";

export const metadata = {
  title: "Farmart Design System",
  description:
    "Live preview of the Farmart design system — colours, type, spacing, elevation and components, generated from DESIGN.md.",
};

const NAV = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "shapes", label: "Shapes" },
  { id: "elevation", label: "Elevation" },
  { id: "layout", label: "Layout" },
  { id: "components", label: "Components" },
  { id: "guardrails", label: "Do's & Don'ts" },
  { id: "tokens", label: "Tokens in Code" },
];

// Maps the first column of a markdown table to another column, so the "Use"
// copy in DESIGN.md can label the specimens without being retyped here.
function columnMap(body, heading, column) {
  return new Map(
    tableUnder(body, heading).rows.map((row) => [stripMd(row[0]), row[column] ?? ""]),
  );
}

export default async function DesignSystemPage() {
  const { tokens, body } = await loadDesignMd();

  const groups = colorGroups(body);
  const tints = Object.entries(tokens.colors).filter(([name]) =>
    name.startsWith("tint-"),
  );
  const typeUse = columnMap(body, "### Hierarchy", 5);
  const spacingUse = columnMap(body, "### Spacing System", 2);
  const radiusUse = columnMap(body, "### Border Radius Scale", 2);
  const elevation = tableUnder(body, "## Elevation & Depth").rows;
  const grid = tableUnder(body, "### Grid & Container");
  const breakpoints = tableUnder(body, "#### Breakpoints");
  const tokenMap = tableUnder(body, "### Token Names in Code");
  const { dos, donts } = guardrails(body);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand">
              <LeafIcon size={22} />
            </span>
            <h1 className="text-[22px] font-extrabold tracking-tight">
              Farmart Design System
            </h1>
            <span className="rounded-sm bg-surface px-2 py-1 font-mono text-[11px] text-muted">
              {tokens.version} · {tokens.name}
            </span>
            <Link
              href="/"
              className="ml-auto inline-flex h-10 items-center gap-1.5 rounded bg-brand px-4 text-[13px] font-bold transition-colors hover:bg-brand-strong"
            >
              View the storefront
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-muted">
            {tokens.description}
          </p>
          <p className="mt-3 text-[11px] text-muted">
            Every value on this page is read from{" "}
            <code className="font-mono text-foreground">DESIGN.md</code> at build
            time, and the components below are the same ones the storefront
            renders — so this preview cannot drift from either.
          </p>
        </div>

        <nav className="border-t border-line">
          <ul className="no-scrollbar mx-auto flex max-w-[1240px] min-w-0 gap-5 overflow-x-auto px-4 py-3">
            {NAV.map((item) => (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className="whitespace-nowrap text-[12px] font-semibold text-muted transition-colors hover:text-brand-strong"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-4">
        <Section
          id="colors"
          title="Colors"
          intro="One accent on near-black ink over white. Red is a status colour, not a second accent, and the produce tints are backgrounds only."
        >
          {groups.map((group) => (
            <div key={group.name} className="mb-6 last:mb-0">
              <SubHeading>{group.name}</SubHeading>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.swatches.map((swatch) => (
                  <Swatch key={swatch.token} {...swatch} />
                ))}
              </ul>
            </div>
          ))}

          <div>
            <SubHeading>Produce Tints</SubHeading>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {tints.map(([token, hex]) => (
                <TintSwatch key={token} token={token} hex={hex} />
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="typography"
          title="Typography"
          intro="Geist throughout, with Geist Mono reserved for digits that tick. Tight and heavy above 20px, plain and small below it."
        >
          <ul className="rounded-md border border-line px-4">
            {Object.entries(tokens.typography).map(([name, spec]) => (
              <TypeSpecimen
                key={name}
                name={name}
                spec={spec}
                use={typeUse.get(name)}
              />
            ))}
          </ul>
        </Section>

        <Section
          id="spacing"
          title="Spacing"
          intro="A 4px unit. Sections keep a uniform 32px rhythm; the space inside a card tightens as you move down it."
        >
          <ul className="rounded-md border border-line px-4 py-2">
            {Object.entries(tokens.spacing).map(([name, value]) => (
              <ScaleBar
                key={name}
                name={name}
                value={value}
                use={spacingUse.get(name)}
              />
            ))}
          </ul>
        </Section>

        <Section
          id="shapes"
          title="Shapes"
          intro="Radius encodes scale: the bigger the surface, the rounder it is, capped at 8px. Nothing between a bar and a circle is pill-shaped."
        >
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(tokens.rounded).map(([name, value]) => (
              <RadiusChip
                key={name}
                name={name}
                value={value}
                use={radiusUse.get(name)}
              />
            ))}
          </ul>
        </Section>

        <Section
          id="elevation"
          title="Elevation & Depth"
          intro="Depth is almost absent at rest — structure comes from hairlines, and shadow is spent only on pointer feedback."
        >
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {elevation.map((row, i) => (
              <ElevationTile
                key={row[0]}
                index={i}
                level={stripMd(row[0])}
                treatment={stripMd(row[1])}
                use={row[2]}
              />
            ))}
          </ul>
        </Section>

        <Section
          id="layout"
          title="Layout"
          intro="A 1240px container with a 16px gutter. Grids reflow by column count alone; card proportions never change."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {/* min-w-0: the tables set a min width, and a grid item's automatic
                minimum size would otherwise grow the column to match. */}
            <div className="min-w-0">
              <SubHeading>Grid & Container</SubHeading>
              <SpecTable headers={grid.headers} rows={grid.rows} />
            </div>
            <div className="min-w-0">
              <SubHeading>Breakpoints</SubHeading>
              <SpecTable headers={breakpoints.headers} rows={breakpoints.rows} />
            </div>
          </div>
        </Section>

        <Section
          id="components"
          title="Components"
          intro="Rendered from the storefront's own components and classes. Each caption is the description DESIGN.md gives that component."
        >
          <ComponentGallery components={tokens.components} />
        </Section>

        <Section
          id="guardrails"
          title="Do's and Don'ts"
          intro="The rules that keep the system coherent as it grows."
        >
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-line p-5">
              <SubHeading>Do</SubHeading>
              <ul className="space-y-2.5">
                {dos.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12px] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold"
                    >
                      ✓
                    </span>
                    {stripMd(item)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-line p-5">
              <SubHeading>Don&apos;t</SubHeading>
              <ul className="space-y-2.5">
                {donts.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12px] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-sale text-[10px] font-bold text-white"
                    >
                      ✕
                    </span>
                    {stripMd(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="tokens"
          title="Tokens in Code"
          intro="This document names colours by role; globals.css still carries some of their older variable names. Same values, two spellings."
        >
          <SpecTable
            headers={tokenMap.headers}
            rows={tokenMap.rows}
            mono={[1, 2]}
          />
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-[1240px] px-4 py-6 text-[11px] text-muted">
          Generated from <code className="font-mono">DESIGN.md</code> ·{" "}
          {Object.keys(tokens.colors).length} colours ·{" "}
          {Object.keys(tokens.typography).length} type tokens ·{" "}
          {Object.keys(tokens.components).length} component specs
        </div>
      </footer>
    </div>
  );
}
