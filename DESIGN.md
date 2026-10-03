---
version: alpha
name: Farmart-Grocery-Storefront
description: A bright, high-density grocery marketplace language built on a single saffron-yellow accent, near-black ink on white, hairline-ruled cards and pastel per-category product tints — commerce chrome that stays quiet so produce and price carry the page.

colors:
  brand: "#fdbc1f"
  brand-strong: "#e9a800"
  brand-soft: "#fff7e3"
  on-brand: "#1f2223"
  on-brand-mute: "#6b5510"
  ink: "#1f2223"
  body: "#4c565c"
  mute: "#7b8085"
  hairline: "#e7e9eb"
  canvas: "#ffffff"
  canvas-soft: "#f5f6f7"
  hero-canvas: "#dfe6ea"
  sale: "#e4443c"
  on-sale: "#ffffff"
  scrim: "rgba(31, 34, 35, 0.45)"
  tint-citrus: "#fff3d6"
  tint-bakery: "#fbe7d2"
  tint-seafood: "#ffe0d9"
  tint-meat: "#ffdede"
  tint-wine: "#f2e2ef"
  tint-coffee: "#eee3d6"
  tint-dairy: "#e4eefb"
  tint-pet: "#e6f1e2"

typography:
  display-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 34px
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.85px
  display-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: -0.7px
  display-sm:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 26px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.65px
  wordmark:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 22px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.55px
  section:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 20px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.5px
  price:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0px
  product-title-lg:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: 0px
  body-md:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: 0px
  label:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0px
  product-title:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 17px
    letterSpacing: 0px
  button:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 13px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0px
  button-caps:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.3px
    textTransform: uppercase
  tab:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0px
  eyebrow:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0.275px
    textTransform: uppercase
  meta:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0px
  badge:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0.25px
    textTransform: uppercase
  kicker:
    fontFamily: Geist, Inter, system-ui, -apple-system, sans-serif
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 3px
    textTransform: uppercase
  countdown:
    fontFamily: Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0.55px

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  2xl: 32px
  3xl: 40px
  4xl: 48px
  gutter: 16px
  section: 32px

components:
  header-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    padding: "{spacing.md} {spacing.gutter}"
    description: Logo, search, contact and cart utilities. Hairline bottom rule only.
  search-field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 44px
    padding: "0px {spacing.md}"
    description: One bordered 44px object made of a scope select, a text input and a submit glyph, not three controls in a row.
  search-scope:
    backgroundColor: transparent
    textColor: "{colors.mute}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-caps}"
    height: 44px
    padding: "0px {spacing.md}"
    description: Category select fused to the left edge of the search field, divided by a hairline.
  nav-pill:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button-caps}"
    rounded: "{rounded.sm}"
    padding: "10px {spacing.md}"
    description: The single persistent saffron anchor in the navigation row.
  nav-link:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "{spacing.sm} 0px"
    description: 13px semibold ink, with a chevron when it opens a menu; saffron-strong on hover.
  hero-banner-primary:
    backgroundColor: "{colors.hero-canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.lg}"
    padding: "{spacing.3xl} {spacing.4xl}"
    height: 260px
    description: Cool grey storytelling banner with a display headline, body copy, white CTA and art bleeding past the edge.
  hero-banner-promo:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.display-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.3xl} {spacing.2xl}"
    height: 260px
    description: The saffron counterpart, with on-brand-mute supporting lines under the headline.
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.md}"
    height: 40px
    description: The one filled action per card or panel; darkens to brand-strong on hover.
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.md}"
    height: 36px
    description: Resting Add To Cart on compact cards; fills with brand on hover.
  button-on-fill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.lg}"
    height: 40px
    description: Shop Now, sitting on a hero fill. White on colour, never saffron on saffron.
  category-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.tab}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg} {spacing.sm}"
    description: Hairline tile with a circular tinted medallion and a two-line centred label.
  category-medallion:
    backgroundColor: "{colors.tint-citrus}"
    rounded: "{rounded.full}"
    height: 56px
    description: Circular tinted disc behind the category art. Tint varies per food family.
  brand-tile:
    backgroundColor: "{colors.tint-wine}"
    rounded: "{rounded.md}"
    description: 16:10 tinted panel for a brand promotion; caption sits outside the tile.
  product-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: transparent
    typography: "{typography.product-title}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
    description: Borderless at rest, hairline plus lift on hover. Densest unit in the system.
  product-card-featured:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.product-title-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    description: Permanently ruled, carries a quantity stepper and a filled primary CTA.
  product-art:
    backgroundColor: "{colors.tint-citrus}"
    rounded: "{rounded.md}"
    description: 1:1 tinted tile behind product art, 4:3 on featured cards.
  badge-sale:
    backgroundColor: "{colors.sale}"
    textColor: "{colors.on-sale}"
    typography: "{typography.badge}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    description: Corner chip pinned to the art. Sale Off, Hot and New share it; the word changes, the colour does not.
  price-sale:
    textColor: "{colors.sale}"
    typography: "{typography.price}"
    description: Reserved for a product that also shows a struck original price.
  price-plain:
    textColor: "{colors.ink}"
    typography: "{typography.price}"
    description: An undiscounted price, set in ink rather than sale red.
  rating-star:
    textColor: "{colors.brand}"
    height: 12px
    description: Five stars, filled to the rating, outlined beyond it. Review count in mute.
  stock-bar:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.full}"
    height: 6px
    description: Brand-filled progress track with a Sold n/total caption in meta below.
  countdown-pill:
    backgroundColor: "{colors.sale}"
    textColor: "{colors.on-sale}"
    typography: "{typography.countdown}"
    rounded: "{rounded.sm}"
    padding: "6px {spacing.sm}"
    description: Sale-red pill with monospaced digits, sitting inline in a section heading.
  promo-card:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
    description: The only use of brand-soft. Sign-up capture at the end of the Top Saver row.
  search-suggestions:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} 0px"
    description: Typeahead panel dropping from the search field at Level 3. Rows are products and categories, and the active row follows the keyboard.
  dialog:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
    description: Centred panel, at most 480px wide, and the one surface with no hairline. Its footer pairs button-secondary with button-primary, both raised to 40px so they share a baseline.
  dialog-overlay:
    backgroundColor: "{colors.scrim}"
    description: Ink at 45% behind the panel. Clicking it dismisses, exactly as Esc does.
  dialog-title:
    textColor: "{colors.ink}"
    typography: "{typography.section}"
    description: Borrows the section heading token, because a dialog title is a landmark you scan rather than a headline you read.
  dialog-close:
    backgroundColor: transparent
    textColor: "{colors.mute}"
    rounded: "{rounded.full}"
    height: 32px
    description: Round glyph pinned to the panel top-right, filling with canvas-soft on hover.
  page-header:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.display-md}"
    padding: "{spacing.2xl} {spacing.gutter}"
    description: Page-level title band above a listing, carrying a title, a mute result count and nothing else.
  price-discount:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.sale}"
    typography: "{typography.badge}"
    rounded: "{rounded.sm}"
    padding: "2px 5px"
    description: The saved percentage beside a struck price, shown only where a product carries an old price.
  skeleton:
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.md}"
    description: Placeholder block holding a section's shape while its data loads. Pulses quietly and stops entirely for a viewer who asked for reduced motion.
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    description: Transient confirmation pinned bottom-right. The only inverted surface in the system, and the only floating one with no shadow.
  form-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.tab}"
    rounded: "{rounded.sm}"
    padding: "0px {spacing.sm}"
    height: 40px
    description: Focus swaps the border to brand and adds no ring; the border change carries the whole state.
  carousel-arrow:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.sm}"
    height: 32px
    description: 32px square pair, right-aligned in the section heading row.
  quantity-stepper:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: 36px
    description: 92px wide, with minus and plus glyphs flanking a tabular count.
  section-heading:
    textColor: "{colors.ink}"
    typography: "{typography.section}"
    description: Title, optional muted all-offers link, optional inline control, arrows pushed right.
  tab-link:
    backgroundColor: transparent
    textColor: "{colors.mute}"
    typography: "{typography.tab}"
    activeIndicator: underline 8px offset in "{colors.brand-strong}"
    description: Mute at rest, saffron-strong and underlined when active; filters the grid in place.
  icon-button:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 40px
    description: Header utilities. Hover fills with canvas-soft; count badge is a brand disc.
---

## Overview

Farmart is a grocery marketplace front end. Its job is to put a large number of
priced, rated, discounted items in front of a shopper without the page feeling
like a spreadsheet — so the chrome is deliberately almost colourless, and the
colour budget is spent on produce, price and one saffron accent.

Surfaces are white. Sections alternate white against `{colors.canvas-soft}`
(`#f5f6f7`) to group content; that faint grey is the only banding device, and it
always runs full-bleed while the content inside stays in the 1240px container.
Separation between cards is a 1px `{colors.hairline}` rule, not a shadow —
shadow appears only under the pointer.

Type is Geist throughout, set tight and heavy at the top of the scale (weight
800, negative tracking) and small and plain everywhere else. The gap between a
20px section heading and a 13px product title is intentional: headings are
landmarks you scan past, product titles are content you read.

Saffron is the entire accent system. There is no secondary brand hue. Red
(`{colors.sale}`) is not an accent — it is a status colour meaning "this price
is discounted" or "this offer is expiring", and it appears nowhere else.

**Key Characteristics:**

- One accent (saffron `#fdbc1f`) on near-black ink, over white.
- Hairline rules carry structure; elevation is a hover-only affordance.
- Small radii throughout — 4px controls, 6px cards, 8px banners.
- Dense product grids, up to six across, with 4px gutters between cards.
- Pastel per-food-family tints behind art, ~93% lightness, never used as text or fill elsewhere.
- Light mode only. No dark theme is defined.

## Colors

### Brand & Accent

- **Saffron** (`{colors.brand}` — `#fdbc1f`) — the single accent. It fills the
  primary CTA, the Shop by Category pill, the promo banner, rating stars, the
  stock-progress fill and notification badges. Everything yellow on the page is
  this one value.
- **Saffron Strong** (`{colors.brand-strong}` — `#e9a800`) — hover state for any
  saffron fill, and the colour of an active tab's label and underline. It is a
  state, never a resting fill.
- **Saffron Soft** (`{colors.brand-soft}` — `#fff7e3`) — used exactly once, as
  the sign-up promo card's background. It exists so a call-to-action panel can
  read as brand without competing with the saffron buttons inside it.
- **On Brand** (`{colors.on-brand}` — `#1f2223`) — ink sits on saffron. The
  yellow is too light to carry white text, so label colour never flips on a
  brand fill.
- **On Brand Mute** (`{colors.on-brand-mute}` — `#6b5510`) — the one dimmed text
  colour permitted on a saffron fill, for supporting lines under a promo
  headline. It is a darkened saffron, not a grey, so it stays in the family.

### Surface

- **Canvas** (`{colors.canvas}` — `#ffffff`) — every card, the header, the
  default page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#f5f6f7`) — full-bleed section
  banding. Cards placed on it are lifted back to white so they still read as
  cards.
- **Hero Canvas** (`{colors.hero-canvas}` — `#dfe6ea`) — the cool grey-blue of
  the primary hero banner, a deliberate counterweight to the warm saffron banner
  beside it. It is a banner fill only, never a page background.
- **Hairline** (`{colors.hairline}` — `#e7e9eb`) — every border, every divider,
  every empty progress track. There is one border colour in this system.

### Text

- **Ink** (`{colors.ink}` — `#1f2223`) — headings, product titles, prices, button
  labels. Near-black rather than pure black, so heavy 800-weight display type
  does not look blown out.
- **Body** (`{colors.body}` — `#4c565c`) — supporting paragraph text inside the
  hero banner, where it sits on the cool grey fill.
- **Mute** (`{colors.mute}` — `#7b8085`) — brand eyebrows, review counts, Sold
  captions, inactive tabs, placeholders, secondary links. Roughly half the text
  on a product card is this colour by design; it is what lets the title and
  price stay legible in a six-across grid.

### Semantic

- **Sale** (`{colors.sale}` — `#e4443c`) — discount badges, the discounted price,
  the expiry countdown pill and the 15% OFF figure. Reserved for urgency and
  markdown. It is not an error colour and not a decorative accent.
- **On Sale** (`{colors.on-sale}` — `#ffffff`) — the only text colour used on a
  sale fill.
- **Scrim** (`{colors.scrim}` — `rgba(31, 34, 35, 0.45)`) — ink at 45%, laid over
  the page behind a dialog. It is the only translucent value in the system and
  the only colour that is not a flat hex.

### Produce Tints

Eight pastel fills stand behind product and category art, one per food family:
citrus `#fff3d6`, bakery `#fbe7d2`, seafood `#ffe0d9`, meat `#ffdede`, wine
`#f2e2ef`, coffee `#eee3d6`, dairy `#e4eefb`, pet `#e6f1e2`.

They share a recipe: very high lightness (~93%), low saturation, hue borrowed
from the food itself. A new tint is derived by taking the product's dominant hue
to that same lightness, not by picking freely. Tints are backgrounds only —
never text, never a border, never a button.

### Token Names in Code

This document names colours by role. `app/globals.css` names several of them by
their older CSS-variable names. They are the same values; use this mapping when
moving between the two.

| DESIGN.md token | CSS variable | Tailwind utility |
|---|---|---|
| `canvas` | `--background` | `bg-background` |
| `canvas-soft` | `--surface` | `bg-surface` |
| `ink` / `on-brand` | `--foreground` | `text-foreground` |
| `mute` | `--muted` | `text-muted` |
| `hairline` | `--line` | `border-line` |
| `brand` | `--brand` | `bg-brand`, `text-brand` |
| `brand-strong` | `--brand-strong` | `bg-brand-strong` |
| `brand-soft` | `--brand-soft` | `bg-brand-soft` |
| `sale` | `--sale` | `bg-sale`, `text-sale` |
| `scrim` | `--scrim` | `backdrop:bg-scrim` |

`body`, `hero-canvas`, `on-brand-mute` and the eight produce tints are not
tokenised in CSS yet — they appear as literal values in the hero banner and in
the `tint` field of `app/lib/data.js`. Promote them to variables in
`app/globals.css` if they start appearing in a third place.

## Typography

### Font Family

Geist (variable, loaded through `next/font/google`) for everything, with Geist
Mono reserved for countdown digits. Fallback stack:
`Geist, Inter, system-ui, -apple-system, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-lg` | 34px | 800 | 1.15 | -0.85px | Hero headline, ≥640px |
| `display-md` | 28px | 800 | 1.15 | -0.7px | Hero headline, <640px |
| `display-sm` | 26px | 800 | 1.25 | -0.65px | Promo banner headline, 15% OFF figure |
| `wordmark` | 22px | 800 | 1 | -0.55px | Farmart logotype |
| `section` | 20px | 800 | 1.25 | -0.5px | Section headings |
| `price` | 15px | 700 | 1.25 | 0 | Current price |
| `product-title-lg` | 15px | 600 | 1.375 | 0 | Featured card title |
| `body-md` | 13px | 400 | 1.625 | 0 | Banner paragraph copy |
| `label` | 13px | 600 | 1.25 | 0 | Nav links, compact CTA |
| `product-title` | 13px | 500 | 17px | 0 | Compact card title, two-line clamp |
| `button` | 13px | 700 | 1 | 0 | Filled button labels |
| `button-caps` | 12px | 700 | 1 | 0.3px | Shop by Category, search scope |
| `tab` | 12px | 600 | 1.25 | 0 | Filter tabs, brand card titles |
| `eyebrow` | 11px | 400 | 1.25 | 0.275px | Brand name above a product title |
| `meta` | 11px | 400 | 1.25 | 0 | Review counts, Sold captions, cart caption |
| `badge` | 10px | 600 | 1.25 | 0.25px | Sale / Hot / New corner badges |
| `kicker` | 10px | 400 | 1.25 | 3px | GROCERY, under the logotype |
| `countdown` | 11px | 600 | 1.25 | 0.55px | Countdown digits, monospaced |

### Principles

- **Negative tracking belongs to display type only.** Anything 20px and above is
  set tight; anything 15px and below is set at zero. Positive tracking is
  reserved for uppercase micro-type (`eyebrow`, `badge`, `button-caps`,
  `kicker`), where it is a legibility fix rather than a style.
- **800 is the ceiling, and display-only.** Headings, the logotype and banner
  headlines are 800. Prices stop at 700, titles at 600.
- **Uppercase is always small.** No uppercase token exceeds 12px. Uppercase at
  reading size reads as shouting in a price grid.
- **Compact product titles are clamped to two lines with a reserved minimum
  height**, so a six-card row keeps its prices, ratings and buttons on one
  baseline regardless of title length.
- **Mono is for digits that change.** Only the countdown uses Geist Mono, so
  ticking numbers never reflow the pill.

## Layout

### Spacing System

Built on a 4px unit. In use: `4` between cards in a product grid, `8`–`12`
inside a card, `16` page gutter, `20` between major grid cells, `24` inside
panels, `32` for section padding, `40` and `48` for hero interiors.

| Token | Value | Use |
|---|---|---|
| `xxs` | 4px | Product grid gutter, badge padding |
| `xs` | 8px | Icon-to-label, chip internals |
| `sm` | 12px | Compact card padding, input padding |
| `md` | 16px | Page gutter, featured card padding |
| `lg` | 20px | Gap between major grid cells |
| `xl` | 24px | Promo card padding |
| `2xl` | 32px | Section vertical padding |
| `3xl` | 40px | Hero vertical padding |
| `4xl` | 48px | Hero horizontal padding, ≥640px |
| `gutter` | 16px | Alias for the page gutter, matching the container |
| `section` | 32px | Alias for the section vertical rhythm |

### Grid & Container

Content is centred in a 1240px max-width container with a 16px gutter.
Full-bleed background bands — the hero strip, the Best Seller band — extend edge
to edge while the container inside them stays at 1240px.

| Region | Desktop grid |
|---|---|
| Hero | `2.15fr / 1fr` — wide storytelling banner, narrow promo |
| Category | 8 equal columns, 12px gap |
| Featured Brands | 4 equal columns, 20px gap |
| Top Saver | `1fr / 2.6fr / 1.05fr` — featured card, 4-up deal grid, sign-up panel |
| Best Seller | `1fr / 4fr` — featured card, 6-up product grid |
| Just Landing | 6 equal columns |
| Product Listing | 4 equal columns, 20px gap |

### Whitespace Philosophy

Vertical rhythm is uniform: every content section is 32px top and bottom
regardless of its density, and the heading sits 20px above its content. The one
exception is the hero strip at 24px, because its banners already carry 40px of
their own interior padding. The page gets its pacing from the grey bands and the
shifting column counts, not from variable section padding.

Inside a product card the opposite rule applies. Gaps are small (4–12px) and
deliberately uneven, tightening as you move down from art to title to price, so
the card reads as one object rather than a stack of rows.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| base | <640px | 2-up product and category grids, everything stacked |
| `sm` | ≥640px | 3-up products, 4-up categories, 2-up brands, cart total appears |
| `md` | ≥768px | Support phone number appears in the header |
| `lg` | ≥1024px | 6-up products, 8-up categories, side-by-side hero, 3-zone Top Saver row, header stops wrapping |

#### Touch Targets

Interactive chrome is 40px (header icon buttons, primary buttons, inputs), 44px
for the search field, and 36px for in-card secondary controls. The 32px carousel
arrows are the one exception, and they are always duplicated by horizontal
scrolling, so they are never the only way to reach content.

#### Collapsing Strategy

Header utilities drop by priority as width is lost: Recently Viewed below `lg`,
the phone number below `md`, the cart total and the search scope select below
`sm`. The cart icon itself never collapses.

Long horizontal runs — the nav link list and the product filter tabs — scroll
horizontally instead of wrapping, with the scrollbar hidden by the
`no-scrollbar` utility. **Any flex child that scrolls must also carry
`min-w-0`**; without it, the child's intrinsic minimum width pushes the whole
document wider than the viewport.

#### Image Behavior

Product art is a fixed 1:1 tile, 4:3 on featured cards and 16:10 on brand tiles,
with the artwork centred on its tint. The ratio holds at every breakpoint, so
grids reflow by column count alone and never by changing card proportion.

## Elevation & Depth

Depth is almost absent at rest. The system separates content with fills and
hairlines, and spends shadow only on pointer feedback.

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No border, no shadow | Hero banners, art tiles, promo card, section bands |
| Level 1 — Hairline | `1px solid #e7e9eb` | Header, nav, category cards, featured product cards, inputs, steppers, arrows |
| Level 2 — Lift | `0 10px 24px rgba(0,0,0,0.07)` + hairline + 2px rise | Category card hover |
| Level 3 — Product Lift | `0 10px 28px rgba(0,0,0,0.07)` + hairline | Product card hover, from a borderless rest state |
| Level 4 — Modal | `0 24px 60px rgba(0,0,0,0.16)` + scrim | The dialog panel, above a dimmed page |

Levels 2 and 3 are the same soft, low-opacity vertical drop: a 24–28px blur at 7%
black, no spread, no ambient layer. Level 4 is the only step that breaks that
budget, and it belongs to the dialog alone — a deeper 60px blur at 16%, paired
with the scrim, because a panel lifted into the top layer has no hairline
neighbours to sit against. Level 4 is the ceiling; nothing is given more.

### Decorative Depth

The hero banners carry oversized product art that bleeds past the panel edge and
is clipped by it. That overflow is the only decorative depth cue in the system.
There are no gradients, no glows, and no borders on a coloured fill.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `none` | 0px | Progress fills, dividers |
| `sm` | 4px | Buttons, inputs, badges, search field, carousel arrows, steppers |
| `md` | 6px | Cards, art tiles, brand tiles, promo panel |
| `lg` | 8px | Hero banners |
| `full` | 9999px | Icon buttons, logo disc, category medallion, stock bar, carousel dots |

Radius encodes scale: the bigger the surface, the rounder it is, capped at 8px.
Anything fully round is either circular by nature — a 40px icon button, a 56px
medallion — or a 6px-tall bar. Nothing in between is pill-shaped.

### Photography Geometry

Product art sits on a rounded tinted square; the tint carries the rounding, the
artwork does not. Category art sits inside a circular medallion. That pairing —
square for goods, circle for taxonomy — is how the eye separates a thing you can
buy from a place you can browse.

## Components

### Buttons

- **`button-primary`** — the filled saffron action. Ink label, 4px radius, 40px
  tall, darkening to `{colors.brand-strong}` on hover. Exactly one per card or
  panel; if a second action competes, it becomes `button-secondary`.
- **`button-secondary`** — the resting Add To Cart on a compact card. White with
  a hairline border, 36px tall, `label` type with a cart glyph. On hover it takes
  the brand fill, so the grid lights up one card at a time.
- **`button-on-fill`** — Shop Now, sitting on a hero. White fill, ink label, 40px
  tall. On the grey banner it warms to saffron on hover; on the saffron banner it
  inverts to ink, because saffron on saffron has no edge.
- **`icon-button`** — 40px circular header utility, transparent until hovered,
  then `{colors.canvas-soft}`. Counts ride as a saffron disc at the top-right.

### Cards & Containers

- **`product-card`** — the densest unit in the system. Borderless and shadowless
  at rest so a six-across row reads as one field of product; on hover it gains a
  hairline and Level 3 lift. Stacks art, brand eyebrow, two-line title, rating,
  price, optional stock bar, then the secondary CTA.
- **`product-card-featured`** — the same content at larger scale, permanently
  ruled, with a 4:3 art tile, a quantity stepper, a running total and a filled
  primary CTA. One per section, anchoring the left edge of the row.
- **`category-card`** — hairline tile, circular tinted medallion, two-line centred
  label. Rises 2px on hover and takes a saffron border.
- **`brand-tile`** — a 16:10 tinted panel with its caption *outside and below*,
  so the tile stays a clean field of colour. Scales 1.02 on hover.
- **`promo-card`** — the sign-up panel in `{colors.brand-soft}`, centred, with a
  sale-red headline figure over three inputs and a primary CTA.
- **`page-header`** — a `{colors.canvas-soft}` band that opens a listing route,
  holding the page title at `{typography.display-md}` and a mute result count. It
  is the only place a page title appears; inside a page, sections still use
  `section-heading`.

### Inputs & Forms

- **`form-input`** — white, hairline border, 4px radius, 40px tall, 12px type,
  mute placeholder. Focus replaces the border with `{colors.brand}` and adds no
  ring; the border change carries the whole state.
- **`search-field`** — a 44px composite: a scope `select` fused to the left behind
  a hairline divider, a flexible text input, and a 44px submit glyph. It is one
  bordered object, not three controls in a row.
- **`quantity-stepper`** — 92px wide, 36px tall, hairline bordered, with `−` and
  `+` glyphs flanking a tabular count.
- **`search-suggestions`** — the typeahead panel under `search-field`. It shares
  the field's width, takes Level 3 so it reads as attached rather than floating
  free, and lists products above categories. Hover and keyboard share one
  highlight, so there is never a second apparent cursor.

### Navigation

- **`nav-pill`** — the saffron Shop by Category anchor, uppercase 12px, always
  first in the navigation row.
- **`nav-link`** — 13px semibold ink, with a chevron when it opens a menu, going
  saffron-strong on hover.
- **`tab-link`** — 12px, mute at rest, saffron-strong with an 8px-offset underline
  when active. Tabs filter in place; an empty result shows a dashed hairline panel
  with a plain sentence, never a blank grid.
- **`carousel-arrow`** — a 32px square pair, right-aligned in the heading row,
  inverting to a saffron fill on hover.

### Dialog

- **`dialog`** — a centred panel, at most 480px wide, over a `{colors.scrim}`
  overlay. It is the one surface in the system with no hairline: at Level 4, on a
  dimmed page, a border adds nothing. Its radius steps up to `{rounded.lg}`,
  matching the hero banners, because it is the largest floating surface here.
- **`dialog-title`** — set in `{typography.section}`. A dialog title is a landmark
  you scan, not a headline you read, so it takes the section token rather than a
  display size.
- **`dialog-close`** — a 32px round glyph at the panel's top-right, mute until
  hovered. It is a shortcut, never the only way out.
- **Footer** — `button-secondary` then `button-primary`, right-aligned, both at
  40px so the pair shares a baseline. One primary action per dialog, always.

### Signature Components

- **`badge-sale`** — a 10px uppercase red chip pinned to the art's top-left
  corner. Sale Off, Hot and New all use this one chip; the word changes, the
  colour does not.
- **`stock-bar`** — a 6px hairline track with a saffron fill and a Sold n/total
  caption beneath. It appears only on time-limited offers, and it is what makes
  the Top Saver row feel scarce.
- **`countdown-pill`** — a sale-red pill with monospaced digits, sitting inline in
  the section heading beside the title. Monospacing keeps the pill from changing
  width as it ticks.
- **`rating-star`** — five 12px saffron stars, filled to the rating and outlined
  beyond it, followed by a mute review count in parentheses.
- **`section-heading`** — title, optional mute all-offers link, an optional inline
  control (tabs or a countdown), and arrows pushed to the right edge. Every
  section on the page uses this one row; nothing invents its own header.

### Feedback

- **`price-discount`** — the saved percentage, in sale red on `{colors.brand-soft}`,
  sitting after the struck original price. It never appears without an old price
  beside it, and it states the saving rather than repeating the discounted figure.
- **`skeleton`** — a `{colors.canvas-soft}` block standing in for content that is
  still loading. It takes the shape and size of what will replace it, so nothing
  jumps when the data lands, and it never uses a spinner — the page already knows
  its own layout.
- **`toast`** — an ink panel with canvas text, pinned bottom-right, that confirms
  an Add To Cart press and dismisses itself. It is the system's one inverted
  surface: the dark fill is what separates it from the page, so it carries no
  shadow and no border. Level 4 stays with the dialog.

## Do's and Don'ts

### Do

- Read colour, radius and font values from the theme tokens in
  `app/globals.css` — every token in this document exists there as a CSS variable
  and a Tailwind utility.
- Keep exactly one filled saffron action per card or panel.
- Use `{colors.sale}` for a price only when a struck original price sits beside
  it; an undiscounted price is `{colors.ink}`.
- Give every horizontally scrolling flex child `min-w-0` alongside
  `no-scrollbar`.
- Derive a new produce tint by taking the product's own hue to ~93% lightness.
- Clamp compact product titles to two lines and reserve their height, so a row of
  cards keeps one baseline.
- Reach for a hairline before a shadow when you need to separate two things.
- Put new sections inside the 1240px container with 32px vertical padding, headed
  by `section-heading`.
- Let a dialog be dismissed three ways — Esc, a scrim click and the close glyph —
  and hand focus back to whatever opened it.
- Confirm an Add To Cart press with a `toast`. The cart lives in the header and is
  usually off screen, so the toast is the only acknowledgement a shopper gets.
- State a discount twice over — the struck original price and `price-discount` —
  so the saving is legible without arithmetic.

### Don't

- Don't introduce a second accent hue. If something needs to stand out next to
  saffron, use weight, size, or `{colors.canvas-soft}` banding instead.
- Don't use saffron as a text colour on white — it fails contrast. Saffron is a
  fill that carries ink, an icon fill, or a bar.
- Don't put a shadow on a resting product card; at six across it turns the grid
  into corrugation.
- Don't set body copy or product titles above weight 600, or display type above
  800.
- Don't apply positive letter-spacing above 15px, and don't set uppercase above
  12px.
- Don't use a radius outside the five-step scale — nothing at `rounded-xl` or
  above, and no pill-shaped buttons.
- Don't add dark-mode variants to individual components. This system is light
  only; a dark theme means a second full token set, decided as one change.
- Don't let a produce tint escape its art tile — no tinted text, borders, buttons
  or section backgrounds.
- Don't stack a dialog on a dialog, and don't invent a shadow above Level 4 — it
  is the ceiling, not a starting point.
- Don't give the toast a shadow or a lift. Its ink fill does the separating, and a
  floating panel with a shadow reads as a dialog.
- Don't leave an out-of-stock product with a live Add To Cart. Disable it, say so
  in `meta`, and leave the price where it is.

## Agent Prompt Guide

### Quick Reference

```
accent      #fdbc1f   hover #e9a800   soft #fff7e3
ink         #1f2223   body #4c565c    mute #7b8085
surface     #ffffff   band #f5f6f7    hairline #e7e9eb
urgency     #e4443c   on-fill #ffffff
scrim       rgba(31, 34, 35, 0.45) — dialog only
radius      4 control / 6 card / 8 banner / full pill
font        Geist — 800 display, 600 label, 400 body
container   1240px, 16px gutter, 32px section padding
```

### Ready-to-use Prompts

- *"Add a product section following DESIGN.md: a `section-heading` with filter
  tabs, a featured card on the left, and a 6-up `product-card` grid on the
  right."*
- *"Build a promotional banner using `hero-banner-promo` — saffron fill, ink
  headline at `display-sm`, `on-brand-mute` supporting lines, a `button-on-fill`
  CTA, and art bleeding off the right edge."*
- *"Style this form with `form-input` and `button-primary`: hairline borders, 4px
  radius, 40px controls, brand border on focus, no focus ring."*
- *"Review this component against the Do's and Don'ts in DESIGN.md and fix any
  token violations."*

### Notes for Implementers

Product and category art is currently placeholder emoji on tinted tiles, held in
the `art` and `tint` fields of `app/lib/data.js`. When real photography lands,
swap those fields for images rendered through `next/image` and keep the tinted
tile as the backdrop — the tint, the ratio and the rounding are part of the
design, not a stand-in for the photo.
