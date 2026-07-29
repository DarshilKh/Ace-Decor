/**
 * playwright.config.ts — Playwright E2E Test Configuration
 *
 * Phase 13: Testing Infrastructure Setup.
 *
 * Scope: storefront smoke tests against a running Next.js server.
 *   - Home page renders (/, no auth required)
 *   - Shop page renders (/shop)
 *   - Login page renders (/login)
 *   - Signup page renders (/signup)
 *   - Unauthenticated checkout → redirects to /login?redirect=/checkout
 *   - Cart page renders (/cart)
 *   - Healthcheck API returns 200 (/api/healthcheck)
 *
 * BROWSER NOTE:
 * Playwright browsers (Chromium, Firefox, WebKit) must be installed in the
 * CI environment separately from this package install step:
 *
 *   npx playwright install --with-deps chromium
 *
 * The GitHub Actions workflow (ci.yml) handles this automatically.
 * Local developers should run `npx playwright install chromium` once
 * after cloning the repo. Browsers are not bundled in node_modules and
 * cannot be committed to source control.
 *
 * CI: runs against `npm run build && npm run start` (production mode)
 *     to catch Next.js build-time errors that don't surface in dev mode.
 * Local: runs against `npm run dev` (webServer.command below).
 */

import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  // E2E test directory — separate from unit tests
  testDir: "./e2e",

  // Run tests in parallel where possible
  fullyParallel: true,

  // Fail the build if any test.only is accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests once in CI (flaky network, timing issues)
  retries: process.env.CI ? 1 : 0,

  // Limit parallelism in CI to avoid resource exhaustion
  ...(process.env.CI ? { workers: 2 as const } : {}),

  // Reporter: minimal in local, rich HTML report in CI
  reporter: process.env.CI
    ? [["html", { outputFolder: "playwright-report" }], ["github"]]
    : [["list"]],

  use: {
    baseURL: BASE_URL,

    // Capture traces on first retry — diagnose CI failures without re-running
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Consistent viewport
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Additional browsers can be enabled for Phase 21 (cross-browser testing):
    // { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit",   use: { ...devices["Desktop Safari"]  } },
    // { name: "mobile",   use: { ...devices["Pixel 7"] }        },
  ],

  // Auto-start the Next.js server for local e2e runs.
  // In CI, the server is started separately before Playwright runs.
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: "npm run dev",
          url: BASE_URL,
          reuseExistingServer: true,
          timeout: 120_000, // Allow 2 min for cold Next.js startup
        },
      }),

  // Global timeout per test
  timeout: 30_000,

  // Global expect timeout (for assertions like .toBeVisible())
  expect: {
    timeout: 10_000,
  },

  // Output directory for test artefacts (screenshots, traces, videos)
  outputDir: "playwright-results",
});
