<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project

**Farmart** — a mock grocery storefront (Next.js 16 App Router, React 19, Tailwind v4, SQLite). Full guidance lives in `CLAUDE.md`; this file is the short version.

## What exists

- **Routes:** `/` (storefront home, fetches its data from `/api/*` in the browser), `/products` (SSR search and filtering), `/design` (live render of `DESIGN.md`), `/docs` (Swagger UI over the OpenAPI document).
- **Backend API** — `app/api/**/route.ts` handlers, thin wrappers over `app/lib/repository.ts`. SQLite via `better-sqlite3` in `app/lib/db.ts`, seeded from `app/lib/data.js` on first use. The contract is `app/lib/openapi.ts` (`/api/openapi`).
- **Component library** — `app/components/` (`ProductCard`, `SiteHeader`, `SearchBox`, `Dialog`, `Toast`, plus client leaves like `AddToCartButton`, `Countdown`, `QuantityPicker`, `ProductTabs`).
- **Tests** — `tests/` on Vitest (backend only): `unit/` and `integration/`. See `npm run test:report`. Browser regression tests are Playwright, in `tests/e2e/` (`npm run test:e2e`; stop `npm run dev` first).
- **Design system** — `DESIGN.md` is the token spec; `app/globals.css` mirrors it.

## Conventions

- Changing a UI token means editing `DESIGN.md` first, then `app/globals.css`. Do not add a colour, radius, shadow or type size the document does not declare.
- Product imagery is an emoji on a pastel tile (`art` + `tint`, always together). Keep this unless real images are supplied.
- Pages and cards are Server Components; only interactive leaves carry `"use client"`. Keep `ProductCard` server-rendered.
- Adding or changing an endpoint means updating `app/lib/openapi.ts` in the same change and flipping its `x-status` to `live`.
- Only `app/lib/db.ts` opens the database; every query lives in `app/lib/repository.ts`. Keep `Date.now()` and randomness in the repository, not in components.
- Any flex or grid child that scrolls horizontally needs `min-w-0`.
- Seed data rules (ordering, constraints) are in the `seed-data-onboarding` skill — read it before touching `app/lib/data.js`.

## Quality gate

Before claiming any task done, run and pass: `npm run lint` (must exit clean), `npm run build` (typecheck + `DESIGN.md` validation) and `npm test` (unit + integration). Fix failures; do not skip or weaken a check to get green.
