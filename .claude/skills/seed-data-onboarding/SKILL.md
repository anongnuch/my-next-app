---
name: seed-data-onboarding
description: Get the Farmart storefront running with data, and add or change the seed catalogue safely. Use this whenever someone is setting up the project for the first time, has just cloned it, sees an empty home page or empty API responses, needs to reset or re-seed the SQLite database, or wants to add products, categories, brands, banners or collections to the starting data. Also use it when a change hits a FOREIGN KEY or CHECK constraint, when `npm run db:reset` fails, or when someone asks "how do I get this project started" or "where does the data come from".
---

# Onboarding and seed data

This project has no external backend. Everything the storefront renders comes
from a local SQLite file that is **generated, not committed** — so a fresh clone
looks broken until the database exists. The whole point of this skill is that
nobody should have to discover that by debugging an empty page.

## First run

```bash
npm install
npm run dev          # http://localhost:3000
```

That is the entire setup. There is deliberately no separate "seed" step: the
first query opens `data/farmart.db`, creates the schema if the file is new, and
seeds it when the `products` table is empty (`app/lib/db.ts`).

**`npm run dev` alone does not create the file.** The server starts and compiles
with no database on disk — seeding happens on the first query that actually
reaches the repository, not on server start. `/` fetches its data from the
browser after the page hydrates (`app/home-content.js`), so opening it in an
actual browser does trigger seeding, but a bare `curl http://localhost:3000/`
only renders the page shell and will not. `/products` and any `/api/*` route
call the repository directly on the server and always will — verified by
loading fresh with nothing in `data/`, confirming the directory still does not
exist right after `✓ Ready`, then watching it appear the instant one request
lands.

Confirm it worked before doing anything else — an empty database and a broken
query look identical from the browser:

```bash
curl -s localhost:3000/api/categories | head -c 200
npm test
```

You should get 8 categories back, and the suite should pass. If the API answers
but the page looks bare, the problem is the UI, not the data.

## Where the data comes from

```
app/lib/data.js   ← the source of truth you edit
      ↓ (imported by)
app/lib/db.ts     ← creates schema, seeds when products is empty
      ↓
data/farmart.db   ← generated, gitignored, safe to delete
      ↓
app/lib/repository.ts → app/api/**/route.ts → the pages
```

Edit `app/lib/data.js`, never the `.db` file. The database is a build artefact;
treating it as the source means the next person's clone disagrees with yours.

Baseline contents: **8 categories, 4 brands, 2 banners, 24 products,
3 collections, 16 collection memberships**. Check against the live file rather
than trusting this number if it matters:

```bash
node -e "const D=require('better-sqlite3');const db=new D('data/farmart.db',{readonly:true});for(const t of ['categories','brands','banners','products','collections','collection_items'])console.log(t, db.prepare('SELECT COUNT(*) c FROM '+t).get().c)"
```

## Re-seeding

```bash
npm run db:reset     # deletes data/, re-seeds on the next request
```

**Stop the dev server first.** Windows keeps the file handle open while
`next dev` runs, so the delete fails; the command says so and exits rather than
throwing a stack trace. On Windows a plain `kill` often does not actually stop
`next dev` — it is really `npm` → `next dev` → a Turbopack worker as separate
processes, and killing just the top one leaves the others holding the file.
Check first, then stop the whole tree:

```powershell
# Empty output means nothing is listening — db:reset will succeed immediately.
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

# If something is, /T kills the listener's children too, not just itself.
Get-NetTCPConnection -LocalPort 3000 -State Listen |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { taskkill /PID $_ /F /T }
```

If you only need to change a value and not the schema, an `UPDATE` against the
open database is quicker and needs no restart — the pages read SQLite on every
request, so the change shows on the next refresh.

## Adding seed data

Order matters, because the schema enforces the relationships rather than
trusting the seed to be correct.

1. **Category first.** A product's `category` is a foreign key onto
   `categories.name`. Insert a product in a category that does not exist and the
   seed transaction aborts. New categories go in `CATEGORY_SEED` in
   `app/lib/db.ts` — that array is the canonical taxonomy, and
   `productTabs` in `data.js` must agree with it so the filter tabs can actually
   match something.
2. **Product next**, appended to a list in `app/lib/data.js`. The lists are
   joined into `catalogue`, which is what `/products` renders, so a product that
   is only in `catalogue` still appears in the shop without being merchandised.
3. **Collection membership last**, if the product should appear in a home-page
   row (`best-sellers`, `just-landing`, `top-savers`).
4. `npm run db:reset`, restart, then `npm test` and `npm run db:diagram`.

Read `references/data-model.md` before adding a product — it lists every field,
which are required, and the conventions that are easy to get wrong.

## Constraints that will stop you

These are in the schema on purpose: they catch bad seed data at insert time
rather than letting it surface as a broken card in the UI.

| Rule | Why it exists |
|---|---|
| `category` must exist in `categories.name` | Keeps one taxonomy; a typo would silently create an unreachable filter |
| `old_price > price` | A "discount" that raises the price would render as a negative badge |
| `price >= 0`, `stock >= 0` | Nonsense values break sort and the out-of-stock state |
| `rating` between 0 and 5 | The star component renders five stars and nothing else |
| `banner.variant` in `primary`/`promo` | Those are the only two treatments DESIGN.md defines |

A `FOREIGN KEY constraint failed` almost always means step 1 was skipped. A
`CHECK constraint failed` names the column — compare it against the table above.

## Verifying a seed change

```bash
npm test             # includes integrity checks: no orphan rows, no unknown categories
npm run db:diagram   # refresh docs/schema.mmd and public/mermaid.html after a schema change
```

The suite already asserts that every product's category exists, that every
collection item points at a real product, and that a reseed restores the same
row counts, so it is a faster check than clicking through the site.

## Commands

| Command | Use |
|---|---|
| `npm run dev` | Dev server; seeds on first request |
| `npm run db:reset` | Delete the database so it re-seeds (stop the server first) |
| `npm run db:diagram` | Regenerate the ER diagram from the live schema |
| `npm test` | Backend suite, including seed integrity |
| `npm run test:report` | Browsable report at `/test-report.html` |
| `npm run build` / `npm run lint` | The other two checks to pass before calling work done |

## What the seed data is not

The catalogue is placeholder material for development: `art` and `tint` are an
emoji on a pastel tile standing in for photography, and prices and ratings are
invented. Keep that in mind before using it in a screenshot that implies real
inventory, and see `references/data-model.md` for how to swap in real images
without breaking the card layout.
