# ACE DÉCOR

Premium home décor product catalog for the Indian market — WhatsApp enquiry, no online checkout, fully static (no database, no admin panel, no login).

**Stack:** Next.js 16.2.9 · React 19 · Tailwind CSS v4 · Vercel
**Status:** Phases 0–26 complete (full static-site conversion done — see `HANDOFF.md`). Next: Phase 27 (Domain, Hosting & Launch).

---

## Quick Start

```bash
# Install dependencies
npm install

# Set the one environment variable this project uses
echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" > .env.local

# Type check
npm run type-check

# Lint
npx eslint . --max-warnings=0

# Unit tests
npm test

# Dev server
npm run dev

# Production build
npm run build
```

There is no database to set up, no CLI to install, and no admin account to
provision — this is all the setup this project needs.

## Editing Content

There is no admin panel. Every piece of content lives in `src/data/` as
plain TypeScript:

| To change... | Edit... |
|---|---|
| A product, variant, image, or price | `src/data/products.ts` |
| The WhatsApp number, contact email, GST note | `src/data/site-config.ts` |
| FAQ page content | `src/data/faq.ts` |
| Shipping/Returns/Privacy/Terms page copy | `src/data/policies.ts` |

Edit the file, redeploy — that's the entire content workflow.

## Project Structure

```
src/app/          Next.js App Router pages (storefront only — no admin route group)
src/components/   React components (ui/, storefront/)
src/data/         The entire "backend" — products, site config, FAQ, policies
src/lib/utils/    formatPrice, formatWhatsAppLink, JSON-LD builders, cn()
public/images/    All 64 real product photos, organized by category
e2e/              Playwright smoke + accessibility tests
docs/             Historical project documentation (see note below)
```

## Documentation

| File | Contents |
|------|----------|
| `HANDOFF.md` | Full developer handoff, current architecture, conventions, continuation prompt — **read this first** |
| `docs/PROJECT_STATUS.md` | Phase completion status, risks, next steps |
| `docs/PHASE_SUMMARY.md` | Per-phase objectives, files, issues found |
| `docs/DESIGN_SYSTEM.md` | UI/UX design system (colors, typography, spacing) — still accurate |

The remaining files under `docs/` (`PRD.md`, `TECHSPEC.md`, `SCHEMA.md`,
`RULES.md`, `APPFLOW.md`, `IMPLEMENTATION_PLAN.md`, `TRACKER.md`,
`UAT_SCRIPT.md`) describe the project's original Supabase-backed ecommerce
architecture and are **historical reference only** — each now carries a
notice at the top confirming this. Nothing in them about a database, API,
admin panel, or checkout flow is current.

## Environment Variables

This project has exactly one:

```
NEXT_PUBLIC_SITE_URL=
```

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`) — no secrets required:
- **type-check** — TypeScript validation
- **lint** — ESLint with zero warnings allowed
- **unit** — Vitest (26 tests)
- **e2e** — Playwright smoke + accessibility tests (Chromium)
- **lighthouse** — Lighthouse CI (Performance/SEO/Accessibility/Best Practices ≥ 90 mobile)

Install Playwright browsers locally: `npx playwright install chromium`
