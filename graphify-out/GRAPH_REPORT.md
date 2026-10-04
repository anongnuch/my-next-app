# Graph Report - my-next-app  (2026-10-03)

## Corpus Check
- 70 files · ~32,322 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .graphify-bak 1, (none) 1, .ico 1)

## Summary
- 410 nodes · 811 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `530199f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- repository.ts
- package.json
- design/page.js
- DESIGN.md
- component-gallery.js
- db.ts
- product-card.js
- home-content.js
- spec-contract.test.ts
- generate-test-report.mjs
- compilerOptions
- Business Goals
- Architecture
- Onboarding and seed data
- README.md
- next.config.mjs
- AGENTS.md
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `ComponentGallery()` - 25 edges
2. `DesignSystemPage()` - 19 edges
3. `ProductCard()` - 18 edges
4. `FeaturedProductCard()` - 16 edges
5. `compilerOptions` - 16 edges
6. `SiteHeader()` - 14 edges
7. `Svg()` - 13 edges
8. `SectionHeading()` - 13 edges
9. `getDb()` - 12 edges
10. `scripts` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Spacing System` --references--> `section()`  [INFERRED]
  DESIGN.md → scripts/generate-test-report.mjs
- `Data` --references--> `ProductTabs()`  [INFERRED]
  CLAUDE.md → app/components/product-tabs.js
- `Data` --references--> `SearchBox()`  [INFERRED]
  CLAUDE.md → app/components/search-box.js
- `DESIGN.md is the source of truth for UI` --references--> `Stage()`  [INFERRED]
  CLAUDE.md → app/design/spec-parts.js
- `Collection` --references--> `seed()`  [INFERRED]
  .claude/skills/seed-data-onboarding/references/data-model.md → app/lib/db.ts

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "repository.ts"
Cohesion: 0.08
Nodes (39): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+31 more)

### Community 1 - "package.json"
Cohesion: 0.04
Nodes (45): eslintConfig, dependencies, better-sqlite3, next, react, react-dom, devDependencies, eslint (+37 more)

### Community 2 - "design/page.js"
Cohesion: 0.13
Nodes (28): columnMap(), DesignSystemPage(), metadata, NAV, ELEVATION_STYLES, ElevationTile(), RadiusChip(), SAMPLES (+20 more)

### Community 3 - "DESIGN.md"
Cohesion: 0.05
Nodes (37): Agent Prompt Guide, Border Radius Scale, Brand & Accent, Breakpoints, Buttons, Cards & Containers, Collapsing Strategy, Colors (+29 more)

### Community 4 - "component-gallery.js"
Cohesion: 0.16
Nodes (29): Dialog(), ArrowRightIcon(), base, CartIcon(), ChevronDownIcon(), ChevronLeftIcon(), ChevronRightIcon(), ClockIcon() (+21 more)

### Community 5 - "db.ts"
Cohesion: 0.10
Nodes (25): bestSellerFeatured, bestSellers, brands, catalogue, categories, justLanding, moreProducts, productTabs (+17 more)

### Community 6 - "product-card.js"
Cohesion: 0.15
Nodes (21): AddToCartButton(), Art(), Badge(), FeaturedProductCard(), money(), Price(), ProductCard(), Rating() (+13 more)

### Community 7 - "home-content.js"
Cohesion: 0.17
Nodes (16): CategoryGrid(), Countdown(), pad(), FeaturedBrands(), HeroBanners(), ProductTabs(), SectionHeading(), SignupPromo() (+8 more)

### Community 8 - "spec-contract.test.ts"
Cohesion: 0.11
Nodes (17): GET(), CATEGORIES, errorResponse(), json(), live, OpenApiDocument, planned, ref() (+9 more)

### Community 9 - "generate-test-report.mjs"
Cohesion: 0.15
Nodes (18): Font Family, Hierarchy, Principles, Typography, byType(), caseRows(), countFor(), coveragePath (+10 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "Business Goals"
Cohesion: 0.14
Nodes (13): Business Goals, Category Navigation, Farmart — Online Grocery Store, Homepage ที่ดึงดูดใจ, Phase 0: Research & Context Gathering, Phase 1: Product Discovery & Browsing, Phase 2: Homepage & Merchandising, Phase 3: Cart Management (+5 more)

### Community 12 - "Architecture"
Cohesion: 0.17
Nodes (10): API routes, Architecture, Commands, Data, DESIGN.md is the source of truth for UI, Gotchas, graphify, Routes (+2 more)

### Community 13 - "Onboarding and seed data"
Cohesion: 0.20
Nodes (9): Adding seed data, Commands, Constraints that will stop you, First run, Onboarding and seed data, Re-seeding, Verifying a seed change, What the seed data is not (+1 more)

### Community 14 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **169 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+164 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 183 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `section()` connect `generate-test-report.mjs` to `DESIGN.md`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `vitest` connect `spec-contract.test.ts` to `repository.ts`, `package.json`, `design/page.js`, `db.ts`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `Spacing System` connect `DESIGN.md` to `generate-test-report.mjs`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ComponentGallery()` (e.g. with `ChevronLeftIcon()` and `ChevronRightIcon()`) actually correct?**
  _`ComponentGallery()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _169 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `repository.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08282828282828283 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._