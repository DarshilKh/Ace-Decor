// PostCSS configuration for Tailwind CSS v4 (TECHSPEC §20, IMPLEMENTATION_PLAN Phase 0)
//
// Key change from Tailwind v3:
//   - Plugin is `@tailwindcss/postcss`, NOT the legacy `tailwindcss` plugin.
//   - Design system tokens are defined in app/globals.css @theme {}, not here.
//   - No tailwind.config.ts as the primary token config surface.
//
// autoprefixer is intentionally omitted: Tailwind v4's @tailwindcss/postcss
// handles vendor prefixing internally — adding autoprefixer alongside it
// causes redundant/conflicting prefix passes.

/** @type {import('postcss').ProcessOptions} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
