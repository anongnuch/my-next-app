// OpenAPI description of the Farmart storefront API.
//
// Every operation here is derived from something the UI already does: the
// catalogue grid and its tabs, the deal countdown, the Add To Cart press, the
// wishlist heart, the 15% member sign-up panel and the header search.
//
// `x-status` marks what is actually wired up. Only `live` operations exist in
// `app/api`; `planned` ones are the designed contract for work still to come
// (cart management is PLAN.md Phase 3). This file is the single source of
// truth — `/api/openapi` serves it and `/docs` renders it.

const CATEGORIES = [
  "Fruits & Vegetables",
  "Frozen Seafoods",
  "Raw Meats",
  "Coffee & Teas",
  "Breads & Sweets",
  "Drinks",
  "Pet Foods",
  "Milks & Dairies",
];

const planned = { "x-status": "planned" };
const live = { "x-status": "live" };

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const json = (schema: object, description: string) => ({
  description,
  content: { "application/json": { schema } },
});

const errorResponse = (description: string) => json(ref("Error"), description);

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Farmart Storefront API",
    version: "1.0.0",
    summary: "The API behind the Farmart online grocery store.",
    description: [
      "Designed from the shipped storefront: the catalogue listing, the home",
      "page merchandising rows, the cart and wishlist actions on each product",
      "card, and the member sign-up panel.",
      "",
      "**Implementation status.** Operations tagged `x-status: live` are",
      "implemented under `app/api`, backed by SQLite and seeded from the",
      "catalogue. The home page and search run on them. Operations tagged",
      "`planned` are a designed contract only — cart, wishlist, member",
      "sign-up and product detail are still ahead (PLAN.md Phases 1 and 3).",
      "",
      "Prices are decimal numbers in the currency named by the `currency`",
      "field (ISO 4217, `USD` throughout the mock data).",
    ].join("\n"),
    contact: { name: "Farmart", url: "https://example.com/farmart" },
    license: { name: "UNLICENSED" },
  },
  servers: [
    { url: "/api", description: "Same-origin, this deployment" },
    { url: "http://localhost:3000/api", description: "Local development" },
  ],
  tags: [
    { name: "Catalog", description: "Products, categories and brands." },
    {
      name: "Merchandising",
      description: "The curated rows the home page renders — banners, collections and timed deals.",
    },
    { name: "Cart", description: "The shopper's basket. PLAN.md Phase 3." },
    { name: "Wishlist", description: "Saved products, behind the heart on each card." },
    { name: "Membership", description: "New-member sign-up and the 15% incentive." },
    { name: "System", description: "Health and service metadata." },
  ],
  paths: {
    "/products": {
      get: {
        ...live,
        tags: ["Catalog"],
        summary: "List the catalogue",
        description:
          "Powers `/products` and, with `category`, the Best Seller and Just Landing tab rows. Also serves the header search when `q` is supplied.",
        operationId: "listProducts",
        parameters: [
          {
            name: "category",
            in: "query",
            description: "Filter to one category. Omit for the All tab.",
            schema: { type: "string", enum: CATEGORIES },
          },
          {
            name: "q",
            in: "query",
            description: "Free-text search across title and brand.",
            schema: { type: "string", minLength: 1, maxLength: 120 },
          },
          {
            name: "onSale",
            in: "query",
            description: "Only products carrying an `oldPrice`.",
            schema: { type: "boolean" },
          },
          {
            name: "inStock",
            in: "query",
            description: "Exclude products with `stock` of 0.",
            schema: { type: "boolean" },
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              default: "relevance",
              enum: ["relevance", "price-asc", "price-desc", "rating", "discount", "newest"],
            },
          },
          { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 24 },
          },
        ],
        responses: {
          200: json(ref("ProductList"), "A page of products."),
          400: errorResponse("A query parameter was malformed."),
        },
      },
    },
    "/products/{productId}": {
      get: {
        ...planned,
        tags: ["Catalog"],
        summary: "Get one product",
        description: "Backs the product detail page (PLAN.md Phase 1).",
        operationId: "getProduct",
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "ts-1",
          },
        ],
        responses: {
          200: json(ref("Product"), "The product."),
          404: errorResponse("No product with that id."),
        },
      },
    },
    "/categories": {
      get: {
        ...live,
        tags: ["Catalog"],
        summary: "List categories",
        description: "Drives the Browse by Category row and the search scope select in the header.",
        operationId: "listCategories",
        responses: {
          200: json({ type: "array", items: ref("Category") }, "Every browsable category."),
        },
      },
    },
    "/brands": {
      get: {
        ...live,
        tags: ["Catalog"],
        summary: "List featured brands",
        description: "The Featured Brands promotional row.",
        operationId: "listBrands",
        responses: {
          200: json({ type: "array", items: ref("Brand") }, "Featured brands."),
        },
      },
    },
    "/banners": {
      get: {
        ...live,
        tags: ["Merchandising"],
        summary: "List hero banners",
        description: "The two hero panels at the top of the home page, in display order.",
        operationId: "listBanners",
        responses: {
          200: json({ type: "array", items: ref("Banner") }, "Banners in display order."),
        },
      },
    },
    "/collections/{slug}": {
      get: {
        ...live,
        tags: ["Merchandising"],
        summary: "Get a merchandised collection",
        description:
          "A curated row of products. `best-sellers` and `just-landing` each render as a tabbed grid with one featured card.",
        operationId: "getCollection",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["best-sellers", "just-landing", "top-savers"] },
          },
          {
            name: "category",
            in: "query",
            description: "Narrow the collection to one tab.",
            schema: { type: "string", enum: CATEGORIES },
          },
        ],
        responses: {
          200: json(ref("Collection"), "The collection and its products."),
          404: errorResponse("No collection with that slug."),
        },
      },
    },
    "/deals/top-saver": {
      get: {
        ...live,
        tags: ["Merchandising"],
        summary: "Get the running Top Saver deals",
        description:
          "Time-limited offers. `expiresAt` drives the countdown pill; `sold` and `stock` drive the progress bar under each card.",
        operationId: "getTopSaverDeals",
        responses: {
          200: json(ref("DealBoard"), "The deals and when the window closes."),
        },
      },
    },
    "/cart": {
      get: {
        ...planned,
        tags: ["Cart"],
        summary: "Get the current cart",
        description: "Backs the cart total in the header and the full cart page.",
        operationId: "getCart",
        responses: { 200: json(ref("Cart"), "The cart, with totals recalculated.") },
      },
      delete: {
        ...planned,
        tags: ["Cart"],
        summary: "Empty the cart",
        operationId: "clearCart",
        responses: { 200: json(ref("Cart"), "The now-empty cart.") },
      },
    },
    "/cart/items": {
      post: {
        ...planned,
        tags: ["Cart"],
        summary: "Add a product to the cart",
        description:
          "The Add To Cart press on a product card. Adding a product already in the cart increases its quantity rather than creating a second line.",
        operationId: "addCartItem",
        requestBody: {
          required: true,
          content: { "application/json": { schema: ref("AddCartItemRequest") } },
        },
        responses: {
          201: json(ref("Cart"), "The updated cart."),
          409: errorResponse("The product is out of stock."),
          422: errorResponse("Quantity exceeds the stock on hand."),
        },
      },
    },
    "/cart/items/{itemId}": {
      patch: {
        ...planned,
        tags: ["Cart"],
        summary: "Change a line quantity",
        description: "The quantity stepper on the cart page and the featured product card.",
        operationId: "updateCartItem",
        parameters: [
          { name: "itemId", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: ref("UpdateCartItemRequest") } },
        },
        responses: {
          200: json(ref("Cart"), "The updated cart."),
          404: errorResponse("No such line in the cart."),
          422: errorResponse("Quantity exceeds the stock on hand."),
        },
      },
      delete: {
        ...planned,
        tags: ["Cart"],
        summary: "Remove a line from the cart",
        description: "Confirmed through the 'Remove this from your cart?' dialog.",
        operationId: "removeCartItem",
        parameters: [
          { name: "itemId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: json(ref("Cart"), "The updated cart."),
          404: errorResponse("No such line in the cart."),
        },
      },
    },
    "/wishlist": {
      get: {
        ...planned,
        tags: ["Wishlist"],
        summary: "Get the wishlist",
        description: "Backs the count on the header heart.",
        operationId: "getWishlist",
        responses: { 200: json(ref("Wishlist"), "Saved products.") },
      },
    },
    "/wishlist/items": {
      post: {
        ...planned,
        tags: ["Wishlist"],
        summary: "Save a product",
        description: "The heart that appears on a product card on hover.",
        operationId: "addWishlistItem",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: { productId: { type: "string", examples: ["bs-2"] } },
              },
            },
          },
        },
        responses: {
          201: json(ref("Wishlist"), "The updated wishlist."),
          404: errorResponse("No product with that id."),
        },
      },
    },
    "/wishlist/items/{productId}": {
      delete: {
        ...planned,
        tags: ["Wishlist"],
        summary: "Unsave a product",
        operationId: "removeWishlistItem",
        parameters: [
          { name: "productId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: json(ref("Wishlist"), "The updated wishlist."),
          404: errorResponse("That product was not saved."),
        },
      },
    },
    "/members": {
      post: {
        ...planned,
        tags: ["Membership"],
        summary: "Sign up a new member",
        description:
          "The 15% OFF panel beside the Top Saver row. Returns the discount code the new member earns.",
        operationId: "createMember",
        requestBody: {
          required: true,
          content: { "application/json": { schema: ref("MemberSignupRequest") } },
        },
        responses: {
          201: json(ref("Member"), "The new member and their welcome discount."),
          409: errorResponse("That email is already registered."),
          422: errorResponse("A field failed validation."),
        },
      },
    },
    "/search/suggestions": {
      get: {
        ...live,
        tags: ["Catalog"],
        summary: "Typeahead suggestions",
        description: "Suggestions for the header search field as the shopper types.",
        operationId: "getSearchSuggestions",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 1, maxLength: 120 },
          },
          {
            name: "category",
            in: "query",
            description: "The scope chosen in the select fused to the search field.",
            schema: { type: "string", enum: CATEGORIES },
          },
        ],
        responses: {
          200: json(
            { type: "array", items: ref("SearchSuggestion") },
            "Ranked suggestions, most relevant first.",
          ),
        },
      },
    },
    "/openapi": {
      get: {
        ...live,
        tags: ["System"],
        summary: "Fetch this specification",
        description:
          "Serves this document as JSON. `/docs` renders it with Swagger UI; point a client generator at this URL.",
        operationId: "getOpenApiDocument",
        responses: {
          200: json(
            { type: "object", description: "An OpenAPI 3.1 document." },
            "The specification.",
          ),
        },
      },
    },
    "/hello": {
      get: {
        ...live,
        tags: ["System"],
        summary: "Health probe",
        description: "The one implemented endpoint. Returns a fixed greeting.",
        operationId: "getHello",
        responses: {
          200: json(
            {
              type: "object",
              required: ["message"],
              properties: { message: { type: "string", examples: ["Hello World"] } },
            },
            "A greeting.",
          ),
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        description:
          "A sellable item. `art` and `tint` are the placeholder emoji-on-pastel treatment standing in for photography.",
        required: ["id", "brand", "title", "price", "currency", "category", "stock"],
        properties: {
          id: { type: "string", examples: ["ts-1"] },
          brand: { type: "string", examples: ["Meat Brand"] },
          title: { type: "string", examples: ["British Beef Shank (10% Fat)"] },
          art: { type: "string", description: "Placeholder glyph.", examples: ["🥩"] },
          tint: {
            type: "string",
            description: "Pastel backdrop for the art tile, as a hex colour.",
            pattern: "^#[0-9a-f]{6}$",
            examples: ["#fde8e6"],
          },
          price: { type: "number", format: "double", minimum: 0, examples: [12.99] },
          oldPrice: {
            type: ["number", "null"],
            format: "double",
            description: "Pre-discount price. Present only when the item is on offer.",
            examples: [16.99],
          },
          discountPercent: {
            type: ["integer", "null"],
            description: "Derived from price and oldPrice; what the -24% badge shows.",
            examples: [24],
          },
          currency: { type: "string", examples: ["USD"] },
          rating: { type: "number", minimum: 0, maximum: 5, examples: [5] },
          reviews: { type: "integer", minimum: 0, examples: [64] },
          category: { type: "string", enum: CATEGORIES },
          stock: {
            type: "integer",
            minimum: 0,
            description: "Units on hand. 0 disables Add To Cart and shows 'Out of stock'.",
            examples: [40],
          },
          sold: {
            type: ["integer", "null"],
            description:
              "Units sold in the current promotion. Present only on timed deals — it is what draws the progress bar.",
            examples: [20],
          },
          badge: {
            type: ["string", "null"],
            description: "Corner chip copy.",
            enum: ["Sale Off", "Hot", "New", null],
          },
        },
      },
      ProductList: {
        type: "object",
        required: ["items", "pagination"],
        properties: {
          items: { type: "array", items: ref("Product") },
          pagination: ref("Pagination"),
          facets: {
            type: "object",
            description: "Counts for the filters the UI offers.",
            properties: {
              categories: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    category: { type: "string", enum: CATEGORIES },
                    count: { type: "integer" },
                  },
                },
              },
              onSale: { type: "integer", description: "Shown as 'N on offer right now'." },
            },
          },
        },
      },
      Pagination: {
        type: "object",
        required: ["page", "pageSize", "total", "totalPages"],
        properties: {
          page: { type: "integer", examples: [1] },
          pageSize: { type: "integer", examples: [24] },
          total: { type: "integer", examples: [24] },
          totalPages: { type: "integer", examples: [1] },
        },
      },
      Category: {
        type: "object",
        required: ["slug", "name"],
        properties: {
          slug: { type: "string", examples: ["fruits-vegetables"] },
          name: { type: "string", examples: ["Fruits & Vegetables"] },
          art: { type: "string", examples: ["🍋"] },
          tint: { type: "string", pattern: "^#[0-9a-f]{6}$", examples: ["#fff3d6"] },
          productCount: { type: "integer", examples: [4] },
        },
      },
      Brand: {
        type: "object",
        required: ["id", "label", "title"],
        properties: {
          id: { type: "string", examples: ["snack-brand"] },
          label: { type: "string", description: "Eyebrow above the title.", examples: ["Snack Brand"] },
          title: { type: "string", examples: ["New Snacks Release"] },
          art: { type: "string", examples: ["🍿"] },
          tint: { type: "string", pattern: "^#[0-9a-f]{6}$", examples: ["#efe6f7"] },
        },
      },
      Banner: {
        type: "object",
        required: ["id", "variant", "headline"],
        properties: {
          id: { type: "string", examples: ["summer-juice"] },
          variant: {
            type: "string",
            enum: ["primary", "promo"],
            description: "`primary` is the wide grey panel; `promo` the narrow saffron one.",
          },
          headline: { type: "string", examples: ["Active Summer With Juice Milk 300ml"] },
          body: { type: ["string", "null"] },
          ctaLabel: { type: "string", examples: ["Shop Now"] },
          ctaHref: { type: "string", examples: ["/products"] },
          art: { type: "string", examples: ["🧃"] },
          tint: { type: "string", pattern: "^#[0-9a-f]{6}$", examples: ["#dfe6ea"] },
        },
      },
      Collection: {
        type: "object",
        required: ["slug", "title", "items"],
        properties: {
          slug: { type: "string", examples: ["best-sellers"] },
          title: { type: "string", examples: ["Best Seller"] },
          featured: {
            ...ref("Product"),
            description: "Rendered as the large card anchoring the row.",
          },
          items: { type: "array", items: ref("Product") },
          availableCategories: {
            type: "array",
            description: "The tabs to show above the grid.",
            items: { type: "string", enum: CATEGORIES },
          },
        },
      },
      DealBoard: {
        type: "object",
        required: ["expiresAt", "secondsRemaining", "items"],
        properties: {
          expiresAt: {
            type: "string",
            format: "date-time",
            description: "When the countdown pill reaches zero.",
          },
          secondsRemaining: {
            type: "integer",
            minimum: 0,
            description:
              "Seconds until expiresAt, computed server-side so the countdown does not depend on the viewer's clock.",
            examples: [15237],
          },
          featured: ref("Product"),
          items: { type: "array", items: ref("Product") },
        },
      },
      Cart: {
        type: "object",
        required: ["id", "items", "subtotal", "total", "currency"],
        properties: {
          id: { type: "string", examples: ["cart_01HZ"] },
          items: { type: "array", items: ref("CartItem") },
          itemCount: { type: "integer", description: "Badge on the header cart.", examples: [5] },
          subtotal: { type: "number", format: "double", examples: [3690.59] },
          discount: {
            type: "number",
            format: "double",
            description: "Member discount applied, if any.",
            examples: [0],
          },
          total: { type: "number", format: "double", examples: [3690.59] },
          currency: { type: "string", examples: ["USD"] },
        },
      },
      CartItem: {
        type: "object",
        required: ["id", "product", "quantity", "lineTotal"],
        properties: {
          id: { type: "string", examples: ["line_1"] },
          product: ref("Product"),
          quantity: { type: "integer", minimum: 1, examples: [2] },
          lineTotal: { type: "number", format: "double", examples: [25.98] },
        },
      },
      AddCartItemRequest: {
        type: "object",
        required: ["productId"],
        properties: {
          productId: { type: "string", examples: ["ts-1"] },
          quantity: { type: "integer", minimum: 1, default: 1, examples: [1] },
        },
      },
      UpdateCartItemRequest: {
        type: "object",
        required: ["quantity"],
        properties: { quantity: { type: "integer", minimum: 1, examples: [3] } },
      },
      Wishlist: {
        type: "object",
        required: ["items"],
        properties: {
          items: { type: "array", items: ref("Product") },
          itemCount: { type: "integer", description: "Badge on the header heart.", examples: [2] },
        },
      },
      MemberSignupRequest: {
        type: "object",
        description: "The three fields on the 15% OFF panel.",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", examples: ["yourdomain@gmail.com"] },
          name: { type: "string", maxLength: 120, examples: ["Alex Farmer"] },
          phone: { type: "string", maxLength: 32, examples: ["8 800 332 65-66"] },
        },
      },
      Member: {
        type: "object",
        required: ["id", "email", "discountPercent"],
        properties: {
          id: { type: "string", examples: ["mem_01HZ"] },
          email: { type: "string", format: "email" },
          name: { type: ["string", "null"] },
          phone: { type: ["string", "null"] },
          discountPercent: { type: "integer", description: "15 for a new member.", examples: [15] },
          discountCode: { type: "string", examples: ["WELCOME15"] },
          memberSince: { type: "string", format: "date-time" },
        },
      },
      SearchSuggestion: {
        type: "object",
        required: ["type", "label"],
        properties: {
          type: { type: "string", enum: ["product", "category", "brand"] },
          label: { type: "string", examples: ["British Beef Shank (10% Fat)"] },
          productId: { type: ["string", "null"] },
          href: { type: "string", examples: ["/products"] },
        },
      },
      Error: {
        type: "object",
        required: ["code", "message"],
        properties: {
          code: {
            type: "string",
            examples: ["out_of_stock"],
            description: "Stable machine-readable identifier.",
          },
          message: { type: "string", examples: ["That product is out of stock."] },
          details: {
            type: ["object", "null"],
            description: "Field-level problems, keyed by field name.",
            additionalProperties: { type: "string" },
          },
        },
      },
    },
  },
} as const;

export type OpenApiDocument = typeof openApiDocument;
