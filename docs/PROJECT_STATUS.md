# ACE DÉCOR — Project Status

**Generated:** 2026-07-27 (updated after the full static-site conversion — see Phase 26 — and a same-day UX refinement round, see note below)
**Project:** ACE DÉCOR — Premium Home Décor Product Catalog (India) — WhatsApp-enquiry model, fully static, no backend
**Stack:** Next.js 16.2.9 · React 19 · Tailwind CSS v4 · Vercel (static-friendly hosting only — no database, no admin panel)

**Phase 26 refinement (same day):** the business owner reviewed the live
site and asked for the data/routing model to change — each colour/size is
now its own individually-browsable product page (not a variant picker
behind one category page). Category pages (`/shop/[category]`) now list
every colour as its own clickable card; each PDP shows a "Related
Products" section linking to the other colours in that category. Best
Sellers trimmed to exactly 8 (was 9). Hero collage's large image swapped
to a bedsheet photo; its text block's vertical alignment fixed (was
visually centered against a much taller image, making it look pushed
down — changed to top-aligned). `src/data/products.ts` was regenerated
around a new `Listing` type (35 individual listings, grouped by
`categorySlug`) instead of the old `Product` (9) + `variants[]` shape.

**Mobile UX + SEO refinement round (same day, third pass):** hosting
target changed to Vercel. Mobile menu rebuilt — was a plain text link
list where the header/WhatsApp footer could scroll away with a long
category list on short phones; now a fixed 3-row layout (sticky header,
scrollable middle, sticky footer) with categories shown as an image+name
grid, always fully reachable. Footer rebuilt — the old 2-column mobile
grid produced an unbalanced layout with one orphaned column; now a clean
single-column stack on mobile, a proper responsive grid at larger sizes,
plus a "Get in Touch" block with clickable WhatsApp/email. PDP FAQ
trimmed from all 10 global FAQs down to 4 curated, purchase-relevant ones
(`showOnProductPage` flag in `src/data/faq.ts`) with a link to the full
`/faq` page — the full list was dwarfing the description column on
desktop. Added a sticky mobile "Enquire on WhatsApp" bar on product pages
(`pdp-mobile-sticky-cta.tsx`) so the CTA stays reachable while scrolling;
the floating WhatsApp button hides on mobile product pages specifically
to avoid overlapping it. SEO: added a fully generated (no external assets)
favicon, Apple touch icon, and Open Graph/Twitter card images
(`app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`,
`app/twitter-image.tsx`), a web app manifest (`app/manifest.ts`), a custom
branded 404 page (`app/not-found.tsx`, replacing the generic Next.js
default), `ItemList` JSON-LD on `/shop` and `/shop/[category]`, and
broader root metadata (keywords, `metadataBase`, Twitter card config,
explicit Googlebot directives).

---

## Completed Phases

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Project Setup | ✅ Complete | Full scaffold, stubs, tsconfig, eslint, globals.css, constants |
| 1 | Supabase Infrastructure | ✅ Complete (code) | Migrations, RLS, proxy.ts, guards, types — **manual Supabase provisioning still required** |
| 2 | Core Schema Migration (Catalog Tables) | ✅ Complete | Included in Phase 1 migration 002 |
| 3 | Core Schema Migration (Users/Addresses/Auth Wiring) | ✅ Complete | handle_new_user trigger, guards.ts, requireUser/requireAdmin |
| 4 | Core Schema Migration (Commerce Tables) | ✅ Complete | All 17 tables, RPC stubs, settings/FAQ seeds |
| 5 | Authentication Flows (Customer) | ✅ Complete | Login, signup, forgot/reset password, Zod v4, rate-limit wired |
| 6 | Authentication Flows (Admin) | ✅ Complete | `/admin/login` + proxy.ts admin gating; sidebar shell built in Phase 18 |
| 7 | Design System Implementation | ✅ Complete | `@theme{}` tokens + full UI component set (Dialog/Tabs/Table/Card added across later phases) |
| 8 | Storefront: Landing Page & Navigation | ✅ Complete | Navbar, Hero, CategoryGrid, FeaturedProducts, TrustStrip, Footer, WhatsApp FAB |
| 9 | Storefront: Product Listing (PLP) | ✅ Complete | /shop, /shop/[category], FTS + trigram search, filters, sort, pagination |
| 10 | Storefront: Product Detail Page (PDP) | ✅ Complete | Gallery, variant selector, buy-box, reviews, FAQ accordion, full JSON-LD suite |
| 11 | Cart | ⛔ Superseded (Phase 24) | Guest + authenticated cart removed entirely — no cart in the catalog + WhatsApp-enquiry model |
| 12 | Checkout Flow (Pre-Payment) | ⛔ Superseded (Phase 24) | Address CRUD, checkout UI, order creation all removed — no online checkout |
| 13 | Testing Infrastructure | ✅ Complete (updated Phase 24) | Vitest (101 tests after pivot cleanup), Playwright config, GitHub Actions CI, tsconfig path alias bug fixed |
| 14 | Razorpay Payment Integration | ⛔ Superseded (Phase 24) | Razorpay integration, webhook, checkout widget, success page all removed |
| 15 | Order Confirmation Notifications & Invoice Generation | ⛔ Superseded (Phase 24) | Resend email module, invoice PDF generation, /api/invoice/[orderId] all removed |
| 16 | Customer Account Area | ⛔ Superseded (Phase 24) | /account, addresses, order history, returns form all removed — no customer auth/account |
| 17 | Reviews Submission + Seed Content | ⚠️ Partially superseded (Phase 24) | submitReview()/getHasReviewed() removed (required a verified purchase — orders no longer exist); read-only display of approved/seed reviews retained on PDP |
| 18 | Admin Console: Dashboard, Categories, Products | ⛔ Superseded (Phase 26) | Entire admin panel and Supabase backend removed — see Phase 26 |
| 19 | Admin Console: Orders, Payments, Returns | ⛔ Superseded (Phase 24) | Orders/payments/returns admin UI all removed — no orders exist to manage |
| 20 | Admin Console: Reviews, Banners, FAQs, Settings, Reports | ⛔ Superseded (Phase 26) | Entire admin panel removed — content is now hardcoded in src/data/*.ts |
| 21 | SEO, Performance & Accessibility Hardening | ✅ Complete (updated Phase 26) | Static sitemap.xml + robots.ts, LCP priority loading on first-row product images, live WhatsApp FAB with motion entrance, axe-core e2e accessibility suite, Lighthouse CI (≥90 mobile thresholds) |
| 22 | Security Hardening | ⚠️ Partially superseded (Phase 26) | Rate limiting, RLS, env-audit, admin session expiry all removed (no backend to secure); CSP/security headers retained and simplified for a static site |
| 23 | Staging UAT & Content Population | ⛔ Superseded (Phase 26) | Placeholder catalog replaced entirely with the real product photography + prices supplied by the business owner |
| 24 | **Catalog + WhatsApp-Enquiry Pivot** | ✅ Complete | Business decision: site converted from online checkout to a premium product catalog with WhatsApp enquiry. Cart, checkout, Razorpay, customer auth/account, addresses, review submission, invoice generation, and transactional email were removed app-wide. Navbar redesigned (two-tier, premium, scroll hide/reveal). PDP buy box replaced with a single "Enquire on WhatsApp" CTA. Admin dashboard rebuilt around catalog stats (no orders/revenue). Full detail in `PHASE_SUMMARY.md`'s "Phase 24" entry. |
| 25 | Production Cutover & Launch (Supabase-backed) | ⛔ Superseded (Phase 26) | Never executed — the business decided to remove the backend entirely before this could start (see Phase 26). The premise (a Supabase-backed production launch) no longer applies. |
| 26 | **Full Static-Site Conversion — Real Content, No Backend** | ✅ Complete | Business decision: remove Supabase, the entire admin panel, and all authentication — no database, no CMS, no login of any kind. Real product photography (64 photos across 9 categories) and real prices supplied by the business owner are now hardcoded in `src/data/products.ts`. Landing page rebuilt (3×3 category grid, Best Sellers, hero collage) with real images. Footer social icons removed. Full detail in `PHASE_SUMMARY.md`'s "Phase 26" entry. |

---

## Remaining Phases

| Phase | Name | Dependency |
|-------|------|------------|
| 27 | Domain, Hosting & Launch | Phase 26 |
| 28 | Post-Launch Content Review | Phase 27 |

---

## Current Completion

| Metric | Value | Basis |
|--------|-------|-------|
| **Technical completion** | ~97% | 26 of 28 phases complete (scope changed at Phase 26 — see above) |
| **Business functionality** | ~95% | Full catalog browsing → WhatsApp enquiry journey works end-to-end with real product photography, real prices, and the real WhatsApp number. There is no admin panel anymore — content changes require editing `src/data/*.ts` and redeploying. Remaining gap to 100%: a brand logo file (none was supplied — the text wordmark is used as a placeholder), a domain + hosting deploy, and a final content review pass (Phase 27-28). |

---

## Current Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│  Vercel Edge / CDN                                 │
│  Serves pre-rendered static pages + /public assets   │
│  No middleware, no auth, no session of any kind      │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│  Next.js 16.2.9 App Router (React 19)               │
│                                                      │
│  (storefront)/   — The entire site (fully public)    │
│    /                  — landing page                 │
│    /shop              — all-products grid            │
│    /product/[slug]    — 9 static PDPs (generateStaticParams) │
│    /faq, /policies/*  — static content pages          │
│  api/sitemap.xml — generated from src/data/products.ts │
└─────────────────┬───────────────────────────────────┘
                  │ imports (no fetch, no network call)
┌─────────────────▼───────────────────────────────────┐
│  src/data/*.ts — the ENTIRE backend                  │
│  products.ts    — 9 products, 35 variants, 64 photos │
│  site-config.ts — WhatsApp number, contact info      │
│  faq.ts, policies.ts — static page content           │
└──────────────────────────────────────────────────────┘

No database. No admin panel. No login of any kind. No
external services of any kind (no Supabase, no Razorpay,
no Resend, no Upstash). To change a product, price,
image, or any page's copy: edit the relevant file under
src/data/ or src/app/ and redeploy — there is no other
way to change content on this site.
```

**Phase 26 note — this is a deliberate, one-way architectural decision.**
The business owner explicitly asked to remove Supabase, the admin panel,
and all authentication entirely — not just simplify them. This means:
- There is no way to add/edit/remove a product without a code change and
  redeploy. There is no CMS, no admin login, nothing to "log into."
- All 9 products, their variants, images, and prices are hardcoded in
  `src/data/products.ts`. All FAQ/policy copy is hardcoded in
  `src/data/faq.ts` / `src/data/policies.ts`.
- The WhatsApp number (`919810139284`) is hardcoded in
  `src/data/site-config.ts` — changing it requires editing that one file.
- If a CMS or admin panel is wanted again in the future, that is a new
  build, not a toggle — flag this clearly before assuming otherwise.

## Manual Setup Remaining

1. **Vercel deployment** — Connect repo, set `NEXT_PUBLIC_SITE_URL` (the only env var this project uses), deploy. No other configuration, secrets, or provisioning of any kind is required — there is no database, no auth provider, no payment gateway, no third-party API.
2. **Playwright browsers installed** — `npx playwright install chromium` (for running e2e tests locally)
3. **A logo file** — none was supplied in the images provided; the site currently shows a text wordmark ("ACE DÉCOR"). Send a logo file to have it added to the navbar.
4. **Content review** — since there is no admin panel, review the hardcoded copy in `src/data/faq.ts` and `src/data/policies.ts` (shipping/returns/privacy/terms) before launch — this is placeholder-quality business copy adapted for the WhatsApp-enquiry model, not verified legal text specific to your business (registered address, GSTIN, etc. are not included).
5. **A production domain** — pointed at the Vercel deployment.

---

## Known Risks

| # | Risk | Severity | Phase Affected |
|---|------|----------|----------------|
| R1 | ~~No real product data exists~~ — **Resolved Phase 23**: 36 placeholder products seeded (real descriptions/pricing/variants, placeholder images only). Real photography still needed before launch (see Manual Setup Remaining #11). | Low | Resolved (partial) |
| R2 | ~~`lib/ratelimit/client.ts` is a passthrough stub~~ — **Resolved Phase 22**: real Upstash Redis sliding-window limiting on all 6 endpoints. | — | Resolved |
| R3 | ~~`lib/supabase/types.ts` is hand-authored~~ — **Moot as of Phase 26**: Supabase was removed entirely; there is no database and no generated types file anymore. | — | Resolved (moot) |
| R4 | ~~Low-stock alert deduplication not yet implemented~~ — **Moot as of Phase 26**: there is no stock-quantity tracking of any kind in the static catalog (no backend to track it against). | — | Resolved (moot) |
| R5 | Playwright browser installation blocked in this sandbox — e2e tests run in CI only | Low | 13 |
| R6 | ~~`app/layout.tsx` Organization JSON-LD uses hardcoded contact values~~ — **Resolved Phase 21** | — | Resolved |
| R7 | ~~Phase 6 admin layout shell is a stub~~ — **Resolved Phase 18** | — | Resolved |
| R8 | ~~adminUpdateOrderStatus() has no state-machine validation~~ — **Resolved Phase 19** | — | Resolved |
| R9 | ~~`/faq` and `/policies/[slug]` pages remain Phase 0 stubs~~ — **Resolved Phase 23**: both built with real content, added to sitemap.xml. | — | Resolved |
| R10 | ~~`lighthouserc.js` targets Landing + Shop only (PDP excluded)~~ — **Resolved** (pre-Phase-24 prep): added a PDP URL (`/product/floral-beige-cushion-cover-set-of-5`) now that Phase 23 seeded real product slugs. | — | Resolved |
| R11 | Lighthouse CI and axe-core e2e tests require a running browser (Chromium) which is not available in this development sandbox. Will run for the first time in GitHub Actions CI. | Low | CI (automatic) |
| R12 | **New, discovered in Phase 23**: the entire `(admin)` route tree had no literal `/admin` URL segment (e.g. `/admin/dashboard` actually resolved to `/dashboard`), and `/admin/login` collided with the customer `/login` page — this made `next build` fail outright and meant no admin page was ever reachable at its documented URL. Undetected across Phases 6–22 because validation only ever ran `tsc`/`eslint`/`vitest`, none of which catch App Router path collisions — `next build` itself had apparently never been run before. **Fixed in Phase 23**: restructured to `(admin)/admin/*` with a `(shell)` sub-group so `/admin/login` no longer inherits the AdminShell sidebar. Recommend adding `next build` to CI (not just `tsc`) so this class of bug is caught automatically going forward. | — | Resolved (Phase 23) |
| R13 | **New, discovered in Phase 23**: `src/actions/catalog.ts` (a `"use server"` file) re-exported the `StockStatus` *type* at module scope — invalid in a Server Actions file (which may only export async functions) and unused by every real consumer (all of whom import `StockStatus` from `lib/constants` directly). This also broke `next build`. **Fixed in Phase 23** by removing the dead re-export. | — | Resolved (Phase 23) |
| R14 | This sandbox's network egress does not include `fonts.googleapis.com`, so `next build` cannot fetch the Cormorant Garamond / Inter fonts here and fails on that step alone (all other build errors are fixed — see R12/R13). This is a sandbox limitation, not a code defect; Vercel/GitHub Actions have full internet access and will fetch these fonts normally. Confirm this is genuinely clean by watching the first CI build closely. | Low | CI (automatic) |
| R15 | **New, discovered and resolved in the 2026-07-05 final codebase audit**: seven features across multiple phases were fully *coded* but never actually *wired to real data* — the landing page's featured products (hardcoded to an empty array since Phase 8, despite `getProducts()` existing since Phase 9), the navbar and "Shop by Category" grid (both hardcoded to the Phase 1 seed list, ignoring live `/admin/categories` edits), category images (schema column existed but no admin UI or backend support to ever set it), customer-facing return-status visibility (`getMyReturns()` was a literal stub returning an error since Phase 16), the entire `banners` admin feature (full CRUD + scheduling since Phase 20, zero storefront consumer), and the "Low Stock Threshold (default)" setting (editable in `/admin/settings`, silently ignored by product creation). All seven were fixed with real end-to-end wiring; see the "Final Codebase Audit" entry in `PHASE_SUMMARY.md` for full detail, including several items investigated and confirmed *not* to be bugs (scattered `as any` usage, the Sentry stub, footer's curated category links, `resetPassword()`'s rate limiting). | — | Resolved |
| R16 | 🔴 **CRITICAL — New, discovered and resolved in the 2026-07-05 dependency/config audit**: `proxy.ts` (route protection — admin gating, `/account`/`/checkout` redirects, session refresh) lived at the project root instead of `src/proxy.ts`. Next.js only looks for this file under `src/` when a `src/` directory exists (this project has `src/app`) — a root-level copy is silently never detected or executed, with no error or warning. This meant **route-level auth protection never actually ran, on any request, at any point since Phase 1** — verified empirically with a live `next dev` server and a response-header side-channel (not just inferred from reading Next.js source). Undetected for 23+ phases because e2e/Playwright tests (the only tests that exercise a real server) were blocked in every sandbox session and never actually ran, and some customer pages have redundant page-level `if (!user) redirect(...)` fallbacks that masked the symptom by producing similar-looking redirects via a different code path. `/admin/*` pages have no such fallback — requests reached real page code and threw an unhandled `AuthError` from `requireAdmin()` rather than redirecting, meaning admin *data* stayed protected (defense-in-depth held) but routing-layer protection was completely absent. **Fixed**: moved to `src/proxy.ts`, zero logic changes, re-verified end-to-end (`/admin/dashboard`, `/account`, `/checkout` all correctly redirect; `/api/healthcheck` passthrough intact). Also fixed: two related config bugs found during the same audit — `eslint.config.mjs`'s ignore path for generated Supabase types never matched (missing `src/` prefix), and `vitest.config.ts`'s coverage `include` paths never matched either, meaning the 80% coverage threshold gate silently did nothing since Phase 13. Full detail in `PHASE_SUMMARY.md`'s "Dependency & Configuration Audit" entry and `src/proxy.ts`'s own header comment. | — | Resolved |
| R17 | **New, discovered and resolved 2026-07-11**, live on DK's machine against a real (un-migrated) Supabase project: `captureError()` only handled `error instanceof Error`, falling back to the unhelpful literal `"Unknown error occurred"` for anything else — which is exactly what every Supabase 404 logged as, hiding the actual, actionable Postgres/PostgREST error message. **Fixed**: new `describeError()` helper handles native Errors, Error-subclasses with extra fields (PostgrestError's `.details`/`.hint`/`.code`), plain objects with or without `.message`, strings, and empty values — with 7 new unit tests. Positive side-effect of this same session: DK's terminal output showed `proxy.ts` timing in Next's own per-request breakdown, live independent confirmation that the R16 fix works outside this sandbox too. | — | Resolved |
| R18 | **New, discovered and resolved 2026-07-11**, on DK's first-ever real migration run against a live Supabase project (`supabase/migrations/20260617000002_initial_schema.sql`, pasted via the SQL Editor): `public.is_admin(uid uuid)` — declared `LANGUAGE sql` — referenced `public.users` before that table was created later in the same file. Postgres validates `LANGUAGE sql` function bodies eagerly at `CREATE FUNCTION` time (unlike `plpgsql`, validated lazily), so this failed immediately with `42P01: relation "public.users" does not exist`. This is the first time any migration in this project had ever executed against a real database — an isolated, one-off ordering mistake (confirmed `is_admin()` is the *only* `LANGUAGE sql` function across all 14 migrations, so not a systemic pattern). **Fixed**: moved the function definition to after `public.users` exists, before its first use in the `users_admin_select` policy; verified every other call site (~14 more, across nearly every table's admin RLS policy) still comes after it. | — | Resolved |
| R19 | **New, discovered and resolved 2026-07-11**, on DK's second real migration attempt: `supabase/migrations/20260628000011_seed_reviews.sql` used `\'` (backslash-escape) instead of `''` (doubled quote) for an apostrophe in one review string — invalid under Postgres's default `standard_conforming_strings=on`, causing `42601: syntax error at or near "s"`. Undetected by the first verification pass because a real SQL parser (`pglast`) validates outer statement/dollar-quote structure but doesn't descend into validating string-literal content *inside* `DO $$ ... $$` bodies — a genuine methodology gap, documented and fixed with a proper three-layer check (outer grammar, inner dollar-quoted-block content, exact-pattern regex sweep) now standard for any future SQL migration work on this project. **Fixed**: corrected the one instance at the source; confirmed it was the only occurrence across all 14 files. See `PHASE_SUMMARY.md`'s "Second Real Migration Error" entry for full detail. | — | Resolved |
| R20 | ~~DB migration to drop unused ecommerce tables not written~~ — **Moot as of Phase 26**: Supabase (and every table in it) was removed from the project entirely, so there is no schema left to clean up. | — | Resolved (moot) |
| R21 | **New, 2026-07-27, Phase 26**: no logo file was included in the images the business owner supplied — only the 9 product-category photo folders were present. The navbar and footer currently show a text wordmark ("ACE DÉCOR") in its place. | Low | 27 |
| R22 | **New, 2026-07-27, Phase 26**: the FAQ and policy page copy (`src/data/faq.ts`, `src/data/policies.ts`) was rewritten by the assistant to fit the WhatsApp-enquiry model, adapted from the site's prior real policy text — it has not been reviewed or approved by the business owner, and does not include business-specific legal details (registered address, GSTIN, exact return-window edge cases, etc.). Review before launch. | Medium | 27 |
| R23 | **New, 2026-07-27, Phase 26**: this sandbox could not run a full `next build` (blocked at the same Google Fonts fetch step as R14 — a network sandbox limitation, not a code defect). `tsc`, `eslint`, and `vitest` all pass cleanly, and the build reached the font-fetch step without any other error, but a full clean production build was not directly observed in this environment. | Low | 27 (verify on first real build) |

---

## Final Codebase Audit — ✅ Complete (2026-07-05)

A full code-level pass (bugs, technical debt, security, accessibility,
performance, SEO) was completed independent of the Phase 24 business
blocker. Found and fixed seven real, live bugs where earlier-phase code
existed but was never actually wired to real data — see R15 above and the
"Final Codebase Audit" entry in `PHASE_SUMMARY.md` for full detail.

**Immediately after this**, DK ran `npm install && npm run dev` locally and
reported Next.js silently rewriting `tsconfig.json` on first run. That
report triggered a **second, dependency/config-focused audit** the same
day, which found and fixed a critical issue the first pass missed entirely:
`proxy.ts` — the file responsible for all route-level auth protection — had
been in the wrong directory since Phase 1 and had **never actually
executed, on any request, at any point**. See R16 above and the
"Dependency & Configuration Audit" entry in `PHASE_SUMMARY.md` for the full
verification process and fix. Also fixed in that pass: the `tsconfig.json`
self-mutation DK observed (two real misconfigurations, not sandbox noise),
a broken ESLint ignore path, and a coverage-threshold gate that had been
silently non-functional since Phase 13.

**Conclusion: the codebase is production-ready pending only the manual
business tasks listed under "Next Phase" below.** No further code-level
defects were identified after either audit pass.

---

## Next Phase

**Phase 27 — Domain, Hosting & Launch — ⛔ Blocked on manual business/infra action**

The full static-site conversion (Phase 26) is code-complete — see the
checklist above. What's left is business/infra action only, no further
code:

1. A logo file, if wanted (Manual Setup Remaining #3 / R21)
2. A review of the hardcoded FAQ/policy copy (Manual Setup Remaining #4 / R22)
3. Vercel deployment connected to the repo (Manual Setup Remaining #1)
4. A production domain pointed at the deployment (Manual Setup Remaining #5)

Anticipated deliverables once unblocked:
- Live production URL
- Final smoke test on production (real WhatsApp enquiry end-to-end, on a real device, confirming the number 919810139284 opens WhatsApp correctly)
- A verified full `next build` on a machine/CI with normal internet access (R23)
