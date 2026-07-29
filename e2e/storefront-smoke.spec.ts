/**
 * e2e/storefront-smoke.spec.ts — Storefront Smoke Tests
 *
 * Basic availability/rendering smoke tests for the fully static catalog
 * site — no database, no admin panel, no authenticated area of any kind.
 * These deliberately avoid asserting on content that changes with data,
 * and check page structure and HTTP status instead.
 *
 * Routing model: each colour/size is its own product page
 * (/product/[slug]); /shop/[category] lists every listing in a category as
 * individual clickable cards; /shop lists all 35 listings across every
 * category.
 *
 * BROWSER SETUP NOTE:
 * Before running locally, install Playwright browsers once:
 *   npx playwright install chromium
 */

import { test, expect } from "@playwright/test";

test.describe("Public routes render without errors", () => {
  test("Home page / renders successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("link", { name: /ACE DÉCOR/i }).first()).toBeVisible();

    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    expect(errors).toHaveLength(0);
  });

  test("Shop All page /shop renders all 35 listings", async ({ page }) => {
    const response = await page.goto("/shop");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Shop/i);
    await expect(page.getByPlaceholder(/search products/i)).toBeVisible();
    await expect(page.getByText("35 products")).toBeVisible();
  });

  test("Category listing page /shop/table-covers shows all 11 colour listings", async ({ page }) => {
    const response = await page.goto("/shop/table-covers");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Table Covers", level: 1 })).toBeVisible();
    await expect(page.getByText("11 products")).toBeVisible();
  });

  test("Unknown category /shop/does-not-exist returns 404", async ({ page }) => {
    const response = await page.goto("/shop/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("Product page /product/cushion-covers renders correctly", async ({ page }) => {
    const response = await page.goto("/product/cushion-covers");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /Cushion Covers/i, level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Enquire on WhatsApp/i })).toBeVisible();
  });

  test("Product page for a specific colour variant renders with Related Products", async ({ page }) => {
    const response = await page.goto("/product/table-covers-gold-diamond");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Table Covers");
    await expect(page.getByRole("heading", { name: /More Table Covers/i })).toBeVisible();
  });

  test("Unknown product /product/does-not-exist returns 404", async ({ page }) => {
    const response = await page.goto("/product/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("FAQ page /faq renders", async ({ page }) => {
    const response = await page.goto("/faq");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /Frequently Asked Questions/i, level: 1 })).toBeVisible();
  });

  test("Policy page /policies/shipping renders", async ({ page }) => {
    const response = await page.goto("/policies/shipping");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /Shipping Policy/i, level: 1 })).toBeVisible();
  });
});

test.describe("Navigation links work", () => {
  test("Search icon in navbar navigates to /shop", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /search products/i }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("Logo link navigates to home from /shop", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("link", { name: /ACE DÉCOR/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("Category link in navbar goes to its category listing page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Table Covers", exact: true }).first().click();
    await expect(page).toHaveURL(/\/shop\/table-covers/);
  });

  test("Clicking a product card on a category page opens that product's page", async ({ page }) => {
    await page.goto("/shop/table-covers");
    await page.getByRole("link", { name: /Gold Diamond/i }).first().click();
    await expect(page).toHaveURL(/\/product\/table-covers-gold-diamond/);
  });

  test("Shop by Category tile on the homepage links to the category listing page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "AC Curtains", exact: true }).first().click();
    await expect(page).toHaveURL(/\/shop\/ac-curtains/);
  });
});

test.describe("Enquire on WhatsApp CTA", () => {
  test("PDP CTA links to a wa.me URL with the product name pre-filled", async ({ page }) => {
    await page.goto("/product/cushion-covers");
    const cta = page.getByRole("link", { name: /Enquire on WhatsApp/i });
    const href = await cta.getAttribute("href");
    expect(href).toContain("https://wa.me/919810139284");
    expect(href).toContain("Cushion");
  });
});
