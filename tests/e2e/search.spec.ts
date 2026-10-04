import { expect, test } from "@playwright/test";

// SearchBox: debounced suggestions from /api/search/suggestions, previous
// request aborted, and the form still submits to /products without JavaScript.

test("typing two characters shows suggestions; one character does not", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Search products" });

  await box.fill("b");
  await page.waitForTimeout(400);
  await expect(page.getByRole("listbox")).toHaveCount(0);

  await box.fill("be");
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(page.getByRole("listbox").getByRole("option").first()).toBeVisible();
});

test("fast typing is debounced into a single suggestions request", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Search products" });

  const requests: string[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/search/suggestions")) requests.push(req.url());
  });

  await box.pressSequentially("beef", { delay: 40 });
  await expect(page.getByRole("listbox")).toBeVisible();

  expect(requests).toHaveLength(1);
  expect(new URL(requests[0]).searchParams.get("q")).toBe("beef");
});

test("arrow keys move the active option and Escape closes the list", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Search products" });

  await box.fill("be");
  const options = page.getByRole("listbox").getByRole("option");
  await expect(options.first()).toBeVisible();

  await box.press("ArrowDown");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  await box.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await box.press("ArrowUp");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");

  await box.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
});

test("choosing a suggestion navigates to its href", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Search products" });

  await box.fill("be");
  const first = page.getByRole("listbox").getByRole("option").first();
  await expect(first).toBeVisible();
  await first.click();

  await expect(page).toHaveURL(/\/products\?/);
});

test("submitting the form lands on /products with the query in the URL", async ({ page }) => {
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Search products" });

  await box.fill("beef");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/\/products\?.*q=beef/);
  await expect(page.getByRole("heading", { name: "Results for “beef”" })).toBeVisible();
});

test("a failing suggestions call hides the list instead of breaking the box", async ({ page }) => {
  await page.route("**/api/search/suggestions*", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
  );
  await page.goto("/");
  const box = page.getByRole("combobox", { name: "Search products" });

  await box.fill("beef");
  await page.waitForTimeout(500);

  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(box).toBeEnabled();
});
