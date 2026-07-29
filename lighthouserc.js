/**
 * lighthouserc.js — Lighthouse CI Configuration
 *
 * IMPLEMENTATION_PLAN Phase 21: "Lighthouse CI thresholds defined and met
 * (Performance, SEO, Accessibility, Best Practices ≥ 90 on mobile for key
 * pages)."
 *
 * Runs against a production build (npm run build && npm run start) on the
 * three pages explicitly named in the Acceptance Criteria: Landing, PLP, PDP.
 * Mobile emulation only, matching the "≥ 90 on mobile" requirement.
 *
 * PDP URL points at one of the 9 static products defined in
 * src/data/products.ts. If a product slug there ever changes, update
 * pdpUrl below to match.
 */

const BASE_URL = process.env.LHCI_BASE_URL || "http://localhost:3000";
const pdpUrl = `${BASE_URL}/product/cushion-covers`;

module.exports = {
  ci: {
    collect: {
      url: [
        `${BASE_URL}/`,
        `${BASE_URL}/shop`,
        pdpUrl,
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop", // overridden per-URL below via formFactor
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false,
        },
        throttling: {
          // Simulated "Slow 4G" mobile throttling — matches Lighthouse's
          // default mobile profile used by PageSpeed Insights.
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
        },
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
