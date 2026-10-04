# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ภาษา

ตอบผู้ใช้เป็นภาษาไทยทุกครั้ง (ชื่อไฟล์, โค้ด, คำสั่ง และศัพท์เทคนิคคงเป็นภาษาอังกฤษได้)

## Commands

```bash
npm run dev         # Turbopack dev server on :3000
npm run build       # production build — the primary correctness check
npm run start       # serve the production build
npm run lint        # eslint (flat config, eslint-config-next core-web-vitals)
npm test            # vitest, backend suite (single run)
npm run test:watch  # vitest in watch mode
npm run test:coverage  # same, plus coverage/index.html
npm run test:report    # writes public/test-report.html (/test-report.html)
npm run test:e2e    # Playwright browser regression suite (builds and serves on :3100)
npm run test:e2e:ui # same, in Playwright's interactive UI
npm run test:e2e:report # open the last HTML report (playwright-report/)
npm run db:reset    # delete the SQLite file; it re-seeds on next request
npm run db:diagram  # regenerate the ER diagram from the live schema
```

`db:reset` fails while the dev server is running — Windows keeps the database
file locked, so stop the server first.

Run a single test file with `npx vitest run tests/repository.test.ts`, or one
case with `-t "part of the name"`. `--reporter=verbose` lists every test by name
instead of printing only the summary.

`npm run test:coverage` writes a browsable report to `coverage/index.html`
(gitignored). Coverage is scoped to `app/lib/**` and `app/api/**` — the UI has no
tests yet, and including it would report a misleading number.

`npm test`, `next build` and `eslint .` are the automated checks — run all three
before calling work done. The build also fails loudly if `DESIGN.md` front matter
is malformed (see below), which is intentional.

### Tests

Vitest, `environment: "node"` — the suite covers the backend only; there are no
component or end-to-end tests yet. `tests/setup.ts` points `FARMART_DB_PATH` at a
fresh temp database per test file, so tests never touch `data/farmart.db`.

The folder a test lives in is its type, and the report groups by it:

- `tests/unit/` — one module at a time. `repository` (SQL: filters, search
  ranking, sorting, pagination, facets), `db` (schema constraints, seed
  integrity, reseed), `design-md` (the DESIGN.md parser), `http` (request
  helpers), `openapi` (document invariants).
- `tests/integration/` — layers together. `api-routes` drives the handlers as
  `GET(new Request(...))` down to SQLite, covering every error status.
  `spec-contract` keeps `openapi.ts` honest: **a route file must exist for every
  `x-status: live` operation, must not exist for a `planned` one, and every route
  on disk must be described**. Implementing an endpoint without updating the spec
  fails here.

### E2E tests (Playwright)

`tests/e2e/*.spec.ts` drive the real UI in Chromium against a **production build**
(`next build` + `next start` on :3100, started by `playwright.config.ts`) with its
own database `data/e2e.db`, seeded on first request — never `data/farmart.db`.
Vitest ignores this folder. Because it runs `next build`, **stop `npm run dev`
first** (both write `.next`). First time on a machine: `npx playwright install chromium`.

Specs: `home` (six sections over HTTP, one failure fails the page, skeleton),
`product-tabs`, `search` (debounce, keyboard, submit), `products` (SSR filters and
sorts as URLs), `add-to-cart` (toast, out-of-stock), `pages` (render, 404, and
**no horizontal overflow at 375px** — the `min-w-0` regression), `api` (smoke).
Selectors are role/name based; seed titles such as "Beef Bone Marrow Cut 500g"
are asserted, so changing `app/lib/data.js` may need spec updates.

## Architecture

Farmart is a mock grocery storefront: Next.js 16 App Router, React 19, Tailwind
v4. UI components are JavaScript; the API and data layers are TypeScript. Data
lives in a local SQLite file, seeded from `app/lib/data.js`.

### DESIGN.md is the source of truth for UI

The root `DESIGN.md` follows the Google Stitch DESIGN.md convention. YAML front
matter holds the tokens (`colors`, `typography`, `rounded`, `spacing`,
`components`); the markdown body holds the reasoning, the scale tables and the
Do's and Don'ts. The `/design` route is a live rendering of that file —
`app/lib/design-md.js` reads and parses it at build time so the preview never
holds a second copy of any value.

Practical consequences:

- **Changing or adding a UI token means editing `DESIGN.md` first**, then the
  code. Do not introduce a colour, radius, shadow or type size that the document
  does not declare.
- Front matter is parsed **strictly**: three levels of `key:` nesting at 0/2/4
  spaces, scalar values only, optional double quotes. A malformed block throws
  during the build with the offending line number. Anything derived from the
  body instead (colour role sentences, the "Use" columns, guardrail bullets) is
  best-effort and degrades to empty.
- Keep front-matter values valid YAML for other tools — an unquoted value must
  not contain `: `.
- Every `{group.key}` reference in the document must resolve to a declared token.
- A new component needs a `description` on its front-matter entry plus a `Stage`
  in `app/design/component-gallery.js`. That gallery imports the **real**
  components, so the preview cannot drift from what ships.

### Tokens live in two places that must agree

`app/globals.css` declares the CSS variables and the Tailwind v4 `@theme inline`
mappings. DESIGN.md names several of the same colours by role rather than by
variable (`canvas`/`--background`, `ink`/`--foreground`, `hairline`/`--line`,
`mute`/`--muted`, `canvas-soft`/`--surface`). DESIGN.md's "Tokens in Code"
section carries the full mapping.

Tailwind v4 specifics: there is no `tailwind.config.js`. Theme values and custom
utilities (`no-scrollbar`, `animate-toast-in`) are declared in `globals.css` via
`@theme inline` and `@utility`. The v4 radius scale differs from v3 — `rounded-md`
is 6px here, not 8px.

### API routes

APIs are built in Next itself, as Route Handlers at `app/api/<name>/route.ts` —
there is no separate service. Only the HTTP methods you export exist; Next
answers anything else with 405. Handlers are not cached by default, so they
appear as `f (Dynamic)` in the build output. Return JSON with `Response.json()`;
`NextResponse` is only needed for cookies, redirects and rewrites. The reference
is `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`.

The contract is written down: `app/lib/openapi.ts` holds an OpenAPI 3.1 document
describing the whole storefront API, derived from what the UI does. `/api/openapi`
serves it as JSON and `/docs` renders it with Swagger UI loaded from a CDN. Each
operation carries `x-status` — `live` means it exists under `app/api`, `planned`
means it is a design only. **Adding or changing an endpoint means updating that
document in the same change**, and flipping its `x-status` to `live`.

### Server/client boundary

Pages, the layout and the product cards are Server Components. Only interactive
leaves carry `"use client"`: countdown, quantity picker, product tabs, dialog,
toast, add-to-cart button.

`AddToCartButton` exists as its own client component specifically so
`ProductCard` can stay server-rendered — only the button ships JavaScript.
Follow that pattern instead of converting a card to a client component.

`ToastProvider` is mounted in `app/layout.js`, so `useToast()` works from any
client component without extra wiring.

### Data

SQLite via `better-sqlite3`, at `data/farmart.db` — generated, gitignored, and
**seeded from `app/lib/data.js` on first use**, so a fresh clone needs no setup
step. `npm run db:reset` deletes the file; the next request rebuilds it. Because
the driver is a native module it is listed in `serverExternalPackages`.

Three layers, and the boundary matters:

- `app/lib/db.ts` — connection, schema and seed. Nothing else opens the database.
- `app/lib/repository.ts` — every query, returning exactly the shapes
  `app/lib/openapi.ts` publishes.
- `app/api/**/route.ts` — thin HTTP wrappers that parse and validate parameters.

Data loading differs by route, on purpose — know which one you are editing:

- **`/` (`app/home-content.js`) fetches from the browser.** It is a client
  component that calls six `/api/*` endpoints in parallel on mount, with a
  skeleton while they are in flight. This was a deliberate choice: the whole
  point was to make the API calls show up in the Network tab. A consequence
  worth knowing — loading `/` does **not** by itself create or seed
  `data/farmart.db`; the database only comes into being once the browser's `fetch`
  calls actually land on the server. `curl http://localhost:3000/` alone will not
  seed it; `curl http://localhost:3000/api/categories` will.
- **`/products` is SSR.** Its Server Component calls the repository directly,
  not this app's own HTTP routes — same code, one less hop — so search results
  are in the initial HTML and shareable as a URL. Pages that read the database
  declare `export const dynamic = "force-dynamic"` so they are not frozen at
  build time.
- **Interactions always go over HTTP**, regardless of which page hosts them.
  Switching a tab in `ProductTabs` calls `/api/collections/{slug}`, and
  `SearchBox` calls `/api/search/suggestions` as the shopper types (200ms
  debounce, previous request aborted).

Keep new interactive filtering on the HTTP route rather than filtering an
already-loaded array in the client — the SQL is the one place the rules live.
If a page needs to be crawlable or linkable with its result state in the URL,
follow the `/products` pattern (SSR); if it needs its data calls to be visibly
inspectable, follow the `/` pattern (client fetch).

Keep impure calls (`Date.now()`, randomness) in the repository, never in a
component: `react-hooks/purity` fails the lint otherwise, and the timing values
belong in the payload anyway (`DealBoard.secondsRemaining`).

The schema is documented by introspection, not by hand: `npm run db:diagram`
reads the live file and writes `docs/schema.mmd` plus `public/mermaid.html`
(served at `/mermaid.html`). Re-run it after any schema change.

`app/lib/data.js` remains the seed source. A product carries `brand`, `title`,
`art`, `tint`, `price`, optional `oldPrice`, `rating`, `reviews`, `category`,
`stock`, and optionally `badge` and `sold`.

Two conventions that are easy to break:

- `art` and `tint` are an emoji on a pastel tile, standing in for product
  photography. They travel together; replace both when real images land.
- The stock progress bar renders only when a product has **both** `sold` and
  `stock`. `stock` alone is inventory and drives the out-of-stock disabled state,
  not the bar.

### Routes

`/design` and `/docs` are prerendered — static HTML, no `dynamic` export.
`/` prerenders an empty shell too; it carries no `force-dynamic` because it never
touches SQLite on the server, only from the browser after hydration (see Data,
above). `/products` is the one page that is actually `force-dynamic`, reading
SQLite per request and driving search and filtering from `searchParams` (`q`,
`category`, `sort`, `onSale`). The header search form submits straight to it.
Route handlers live under `/api`.

## Gotchas

- **`min-w-0`** — any flex or grid child that scrolls horizontally, or that
  contains something with a minimum width (a table, a nowrap list), needs it.
  Without it the child's automatic minimum size widens the entire document. This
  has caused real horizontal-overflow bugs more than once and is codified as a Do
  in DESIGN.md.
- **`AGENTS.md` is managed by `next dev`**, which rewrites the Next.js rules block
  it hosts. Because AGENTS.md hosts that block, the same writer skips CLAUDE.md,
  so this file is safe to edit by hand.
- **`tsconfig.json` owns the `@/*` alias.** When the first `.ts` file appeared,
  Next auto-installed TypeScript and generated a `tsconfig.json` with no `paths`,
  which silently shadowed `jsconfig.json` and broke every `@/...` import in the
  repo. `jsconfig.json` has since been deleted; keep `paths` in `tsconfig.json`.
- **Onboarding and seed data** are covered by the `seed-data-onboarding` skill in
  `.claude/skills/`. Consult it before changing `app/lib/data.js`, adding a
  category, or resetting the database — it carries the ordering rules and the
  constraints that reject bad seed data.
- **`PLAN.md`** is the phased product roadmap. New feature work is drawn from it;
  check which phase an item belongs to before widening scope into a later one.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

graphify is an optional local tool, not a project dependency, and `graphify-out/` is untracked (generated). If `graphify` is not on PATH or `graphify-out/graph.json` does not exist (e.g. a fresh clone), skip the rules below and use normal search; the hooks in `.claude/settings.json` are no-ops when `graphify` is missing. To enable it, install graphify and run `graphify update .` to build the graph.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
