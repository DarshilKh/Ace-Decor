/**
 * vitest.config.ts — Vitest Unit Test Configuration
 *
 * Fully static site — no database, no Server Actions. Scope: pure utility
 * functions only.
 *   - lib/utils/format.ts (formatPrice, formatDate, formatWhatsAppLink, slugify, etc.)
 *   - lib/utils/jsonld.ts (buildProductJsonLd, buildOrganizationJsonLd, buildFaqJsonLd)
 *
 * Exclusions:
 *   - React components (covered by Playwright e2e)
 *   - Route Handlers (Playwright e2e)
 *
 * Path aliases: vite-tsconfig-paths maps @/* to project root,
 * mirroring tsconfig.json "paths" so test imports work identically
 * to source imports (no duplicate path config to maintain).
 */

import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    // Global test environment — jsdom enables window/localStorage in utility tests.
    // Server-only code (actions, Route Handlers) is excluded from this suite.
    environment: "jsdom",

    // Global imports: describe/it/expect available without explicit import in test files.
    // Mirrors Jest DX — reduces boilerplate in test files.
    globals: true,

    // Test file discovery: colocated __tests__ folders or *.test.ts(x) files.
    // Following Next.js convention: keep tests next to the code they test.
    include: [
      "**/__tests__/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
    ],

    // Exclude Next.js build artefacts, Playwright e2e, and node_modules.
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/e2e/**",
      "**/playwright/**",
    ],

    // Coverage: v8 provider (fast, no instrumentation overhead).
    // Run with: npm run test:coverage
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      // Enforce meaningful coverage on utility modules Phase 13 targets
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      // Include only the modules targeted by Phase 13 unit tests
      // FIX (2026-07-05 dependency/config audit): these paths were missing
      // the src/ prefix, so v8's include filter matched zero real files —
      // coverage silently reported 0% and, because vitest doesn't enforce
      // thresholds against an empty include set, `npm run test:coverage`
      // exited 0 regardless of actual coverage. Confirmed by running
      // coverage before and after this fix.
      include: [
        "src/lib/utils/pricing.ts",
        "src/lib/utils/search.ts",
        "src/lib/utils/format.ts",
        "src/lib/cart/guest-cart.ts",
        "src/lib/utils/jsonld.ts",
      ],
      exclude: [
        "**/node_modules/**",
        "**/.next/**",
        "**/e2e/**",
      ],
    },

    // Consistent timezone for date formatting tests
    env: {
      TZ: "Asia/Kolkata",
    },
  },
});
