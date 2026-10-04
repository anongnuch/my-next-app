import { expect, test } from "@playwright/test";

// AddToCartButton is the only client code on a product card. There is no cart
// yet (PLAN.md Phase 3), so the contract today is the toast acknowledgement.

test("adding a product shows a toast naming it, which then disappears", async ({ page }) => {
  await page.goto("/products?q=beef");

  const card = page.getByRole("article").filter({ hasText: "Beef Bone Marrow Cut 500g" });
  await card.getByRole("button", { name: "Add To Cart" }).click();

  const toast = page.getByText("Beef Bone Marrow Cut 500g added to your cart");
  await expect(toast).toBeVisible();
  // Toasts auto-dismiss after ~2.6s.
  await expect(toast).toBeHidden({ timeout: 6000 });
});

test("pressing twice stacks two toasts", async ({ page }) => {
  await page.goto("/products?q=beef");

  const button = page
    .getByRole("article")
    .filter({ hasText: "Beef Bone Marrow Cut 500g" })
    .getByRole("button", { name: "Add To Cart" });
  await button.click();
  await button.click();

  await expect(page.getByText("Beef Bone Marrow Cut 500g added to your cart")).toHaveCount(2);
});

test("an out-of-stock product has a disabled button and a notice", async ({ page }) => {
  await page.goto("/products?q=prawn");

  const card = page.getByRole("article").filter({ hasText: "King Prawn Deveined Tail On 300g" });
  await expect(card.getByText("Out of stock")).toBeVisible();
  await expect(card.getByRole("button", { name: "Add To Cart" })).toBeDisabled();
});

test("adding from the home page works too (button inside client-rendered cards)", async ({
  page,
}) => {
  await page.goto("/");
  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("button", { name: "Add To Cart" }) })
    .first();
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: "Add To Cart" }).first().click();

  await expect(page.getByText(/added to your cart/)).toBeVisible();
});
