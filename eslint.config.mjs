// ESLint flat config (ESLint v9 native format)
//
// eslint-config-next@16.2.9 exports a native flat config array — no FlatCompat
// wrapper needed. Importing directly gives us 4 config objects covering:
//   - Next.js rules (@next/eslint-plugin-next)
//   - TypeScript (typescript-eslint)
//   - React + React Hooks
//   - Accessibility (jsx-a11y)
//   - Core Web Vitals additional rules

import nextConfig from "eslint-config-next/core-web-vitals";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // ── Next.js core + TypeScript + React + a11y + Core Web Vitals ───────────
  // Spreads 4 flat config objects from eslint-config-next
  ...nextConfig,

  // ── Project-specific overrides ────────────────────────────────────────────
  // Scoped to .ts/.tsx only — matches the file pattern eslint-config-next uses
  // for its own TypeScript rule block, so @typescript-eslint rules only apply
  // where the plugin is actually registered (avoids "plugin not found" errors
  // on root-level .mjs config files like this one or postcss.config.mjs).
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disallow console.log in committed code (RULES §2.6)
      // Use lib/monitoring/index.ts for structured logging instead.
      "no-console": ["error", { allow: ["warn", "error"] }],

      // TypeScript: disallow any usage unless explicitly justified (RULES §3.1)
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // Allow unused vars prefixed with _ (intentional ignore pattern)
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Warn on non-null assertions — prefer explicit null checks (RULES §3.1 strict)
      "@typescript-eslint/no-non-null-assertion": "warn",

      // React 19: JSX transform is automatic — no React import required
      "react/react-in-jsx-scope": "off",

      // Enforce exhaustive deps in useEffect/useCallback
      "react-hooks/exhaustive-deps": "error",

      // Next.js: always use next/image over raw <img> (RULES §14.2)
      "@next/next/no-img-element": "error",

      // Accessibility: enforce meaningful alt text (RULES §14.4, DESIGN_SYSTEM §14)
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
    },
  },

  // ── Ignore patterns ────────────────────────────────────────────────────────
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      // Test artefact directories — auto-generated, never hand-edited
      "coverage/**",
      "playwright-report/**",
      "playwright-results/**",
      // Next.js auto-generated type declarations
      "next-env.d.ts",
      // Root-level build tool configs — not part of the TypeScript project
      "eslint.config.mjs",
      "postcss.config.mjs",
    ],
  },
];

export default config;
