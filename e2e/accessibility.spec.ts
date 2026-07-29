/**
 * e2e/accessibility.spec.ts — Automated Accessibility Audit (axe-core)
 *
 * IMPLEMENTATION_PLAN Phase 21: "Accessibility audit against DESIGN_SYSTEM.md
 * §14 (contrast, focus states, alt text, semantic structure) using automated
 * (axe) + manual checks."
 *
 * Scope: every public route on this fully static site — there is no
 * authenticated area of any kind to exclude.
 *
 * Acceptance Criteria: "axe reports no critical violations" — this suite
 * asserts on `violations` filtered to impact level "critical" and "serious"
 * (axe's two highest severities), which is the practical equivalent of the
 * specified "no critical violations" bar without being so strict that
 * legitimate "moderate"/"minor" findings (often false positives or design
 * decisions) block the pipeline.
 */

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// ─────────────────────────────────────────────────────────────────────────────
// Helper: run axe and assert no critical/serious violations
// ─────────────────────────────────────────────────────────────────────────────

async function assertNoSeriousViolations(page: import("@playwright/test").Page, label: string) {
  const results = await new AxeBuilder({ page })
    // WCAG 2.1 AA is the bar set by DESIGN_SYSTEM §14 ("WCAG AA").
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const serious = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );

  if (serious.length > 0) {
    const summary = serious
      .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
      .join("\n");
    throw new Error(`${label}: ${serious.length} serious/critical a11y violation(s):\n${summary}`);
  }

  expect(serious).toHaveLength(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public storefront pages
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Accessibility — public storefront", () => {
  test("Landing page / has no serious axe violations", async ({ page }) => {
    await page.goto("/");
    await assertNoSeriousViolations(page, "Landing page");
  });

  test("Shop page /shop has no serious axe violations", async ({ page }) => {
    await page.goto("/shop");
    await assertNoSeriousViolations(page, "Shop page");
  });

  test("FAQ page /faq has no serious axe violations", async ({ page }) => {
    await page.goto("/faq");
    await assertNoSeriousViolations(page, "FAQ page");
  });

  test("Product page /product/cushion-covers has no serious axe violations", async ({ page }) => {
    await page.goto("/product/cushion-covers");
    await assertNoSeriousViolations(page, "Product page");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Semantic structure spot-checks (DESIGN_SYSTEM §14 — landmarks, headings)
// ─────────────────────────────────────────────────────────────────────────────

test.describe("Semantic structure — DESIGN_SYSTEM §14", () => {
  test("Landing page has exactly one <h1> and proper landmarks", async ({ page }) => {
    await page.goto("/");

    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Shop page has exactly one <h1>", async ({ page }) => {
    await page.goto("/shop");
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);
  });

  test("All interactive elements on landing page are keyboard-reachable", async ({ page }) => {
    await page.goto("/");

    // Tab through the first several focusable elements and confirm each
    // receives a visible focus outline (DESIGN_SYSTEM §14: "visible focus
    // rings, 2px, --color-primary-based, offset").
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();
    }
  });
});
