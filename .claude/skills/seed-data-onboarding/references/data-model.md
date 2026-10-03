# Seed data model

Field-by-field reference for `app/lib/data.js`. Read this before adding a
product, a category or a collection. The schema itself lives in `app/lib/db.ts`
and the published API shapes in `app/lib/openapi.ts` — those three must agree.

## Contents

- [Product](#product)
- [Category](#category)
- [Brand](#brand)
- [Banner](#banner)
- [Collection](#collection)
- [Swapping placeholder art for photography](#swapping-placeholder-art-for-photography)

## Product

Appended to one of the arrays in `app/lib/data.js`. `catalogue` is the union of
them all and is what `/products` renders.

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Unique across the whole catalogue. The existing prefixes (`ts-`, `bs-`, `jl-`, `mp-`) record which list it came from; keep the convention so collisions stay obvious. |
| `brand` | yes | Free text. Searched alongside the title, so it affects results. |
| `title` | yes | Clamped to two lines on a card. Over ~45 characters will truncate on the compact card. |
| `category` | yes | **Must exactly match a `categories.name`.** Not a slug — the display string. |
| `price` | yes | Number, not a string. `>= 0`. |
| `oldPrice` | no | Must be **greater** than `price`. Its presence is what makes the card show a struck price and a `-N%` badge; the percentage is derived, never stored. |
| `stock` | yes | `0` disables Add To Cart and shows "Out of stock". Any positive number otherwise. |
| `sold` | no | Only for time-limited deals. **The progress bar renders only when both `sold` and `stock` are present** — `stock` alone is just inventory. Keep `sold <= stock` or the bar overflows. |
| `rating` | yes | 0–5. Rendered as five stars, so fractional values round visually. |
| `reviews` | no | Integer shown in parentheses after the stars. |
| `badge` | no | `"Sale Off"`, `"Hot"` or `"New"`. One red chip on the art; the word changes, the colour does not. |
| `art` | yes | Placeholder emoji. See the last section. |
| `tint` | yes | Hex pastel behind the art. See the last section. |

`currency` and `created_at` are not set here — the seed fills them (`USD`, and a
synthesised date so `sort=newest` has something real to order by; later entries
in the list are treated as more recently stocked).

### Minimal example

```js
{
  id: "mp-7",
  brand: "Farmart",
  title: "Cold Pressed Orange Juice 1L",
  art: "🍊",
  tint: "#fdecd9",
  price: 6.9,
  oldPrice: 8.5,
  rating: 4,
  reviews: 18,
  category: "Drinks",
  stock: 30,
}
```

## Category

Defined in `CATEGORY_SEED` in `app/lib/db.ts`, not in `data.js`, because it is
the taxonomy the schema enforces. The slug is derived automatically.

```js
{ name: "Drinks", art: "🥤", tint: "#e2ecf6" }
```

Adding one means touching two places:

1. `CATEGORY_SEED` — makes it exist and appear in Browse by Category.
2. `productTabs` in `app/lib/data.js` — makes it available as a filter tab.

Three places, in fact — the enum in `app/lib/openapi.ts` (`CATEGORIES`)
publishes the same list to API consumers, and `/api/products?category=New%20One`
returns 400 until it is updated.

`tests/unit/taxonomy.unit.test.ts` asserts all three agree and that no category
is left without products, so forgetting one fails the suite rather than
surfacing later as a tab that matches nothing.

## Brand

```js
{ label: "Happy Tea", title: "Happy Tea 100% Organic, From $29.0", art: "🍵", tint: "#e9efe1" }
```

`label` is the small eyebrow, `title` the promotional line under the tile. The
id is slugified from `label`, so two brands with the same label collide.

## Banner

Defined in `BANNER_SEED` in `app/lib/db.ts`. Exactly two are expected: one
`primary` (the wide grey panel) and one `promo` (the narrow saffron one). The
schema rejects any other `variant`.

`body` on the promo banner is split on `" · "` and rendered as separate lines.
`cta_href` is a real route — point it somewhere that exists.

## Collection

Collections are the merchandised rows. Defined inside `seed()` in
`app/lib/db.ts`:

| Slug | Rendered as |
|---|---|
| `top-savers` | Top Saver Today, with the countdown and progress bars |
| `best-sellers` | Best Seller, tabbed, with a featured card |
| `just-landing` | Just Landing, tabbed, no featured card |

A collection has an optional `featured` product and an ordered list of `items`.
The order in the array is the display order. A product can belong to several
collections; membership does not duplicate the product.

`top-savers` items should carry `sold` so the progress bars render — that is
what makes the row read as scarce.

## Swapping placeholder art for photography

`art` and `tint` travel as a pair: the emoji sits centred on a tinted tile, and
the tile — not the image — carries the rounding and the aspect ratio. When real
images arrive:

1. Replace the `art` field with an image path and render it through
   `next/image` inside the existing tile in `app/components/product-card.js`.
2. Keep `tint` and keep the tile. The ratio, the radius and the pastel backdrop
   are part of the design (DESIGN.md → `product-art`), not scaffolding around a
   missing picture. Removing the tile changes the grid rhythm.

New tints follow a recipe rather than free choice: take the product's dominant
hue to roughly 93% lightness, matching the eight per-food-family tints already
in `CATEGORY_SEED`.
