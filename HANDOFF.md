# ACE DÉCOR — Developer Handoff Document

**Date:** 2026-07-27
**Status:** Phase 26 complete — the site is now a **fully static** product
catalog with WhatsApp enquiry. There is no database, no admin panel, and
no authentication of any kind. Phase 27 (Domain, Hosting & Launch) is
next, blocked only on manual business/infra action — see below.
**Project type:** Premium Home Décor Product Catalog — Indian market, WhatsApp-enquiry model, fully static
**Deployment target:** Vercel (no server-side database dependency)

---

## 🔴 Read This First: There Is No Backend Anymore

This project went through two architecture changes:

1. **Phase 24** converted it from a direct-checkout ecommerce site
   (cart, Razorpay, orders, customer accounts) to a WhatsApp-enquiry
   catalog — but still backed by Supabase, with a full admin panel.
2. **Phase 26** (this one) removed Supabase, the admin panel, and all
   authentication **entirely**, at the business owner's explicit request.

**There is now no database, no CMS, no login, no admin panel of any kind.**
All 9 product lines (cushion covers, pillow covers, plastic bedsheets, elastic
bedsheets, table covers, AC curtains, grass mats, AC covers, booster
covers) are hardcoded in `src/data/products.ts` — **each colour/size is its
own individually-browsable product page** (35 total), not a variant picker
behind one page per category: `/shop/[category]` lists every colour in
that category as a separate clickable card, and `/product/[slug]` is one
specific colour's page, with a "Related Products" section linking to its
siblings. FAQ and policy page copy is hardcoded in
`src/data/faq.ts` and `src/data/policies.ts`. The WhatsApp number and
contact info are hardcoded in `src/data/site-config.ts`.

**To change ANY content on this site — a price, a photo, a product
description, the WhatsApp number, FAQ text — edit the relevant file under
`src/data/` (or the relevant page under `src/app/`) and redeploy. There is
no other way.** If a CMS or admin panel is wanted again in the future,
that is a new build from scratch, not something to "turn back on."

Full detail on every file removed, added, or rewritten is in the
**Phase 26** entry of `docs/PHASE_SUMMARY.md` — read that before touching
any code.

**One disclosed gap: no logo file was supplied.** The images zip provided
contained only the 9 product-photo folders — checked thoroughly, twice.
The navbar/footer/mobile-menu currently show a text wordmark ("ACE DÉCOR").
Send a logo file to have it added.

---

## Tech Stack (post-conversion)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16.2.9 (exact pin) | App Router, React 19, mostly static generation (`generateStaticParams`) |
| Language | TypeScript | 5.x | `strict: true` |
| Styling | Tailwind CSS | v4 (CSS-first) | `@theme {}` in globals.css — no tailwind.config.ts |
| UI Components | Custom (Shadcn-style) | — | Button, Accordion only — Select/Label/Input/Badge/FormField were removed (admin-only, now unused) |
| Data | **Static TS files** | — | `src/data/products.ts`, `site-config.ts`, `faq.ts`, `policies.ts` — this IS the backend |
| Auth | **None** | — | No login of any kind, anywhere on the site |
| Enquiry channel | WhatsApp (`wa.me` deep link) | — | Hardcoded number in `src/data/site-config.ts` |
| Motion | motion/react | 12.x | Import from `motion/react`, NOT `framer-motion` |
| Testing | Vitest + Playwright + axe-core | — | Unit: 26 tests. E2E specs cover all public routes. |
| Deployment | Vercel | — | One env var: `NEXT_PUBLIC_SITE_URL` |

**Removed this phase:** Supabase (`@supabase/ssr`, `@supabase/supabase-js`),
Upstash (`@upstash/ratelimit`, `@upstash/redis`), `react-hook-form`, `zod`,
`@hookform/resolvers`, `@radix-ui/react-select`, `@radix-ui/react-label`.

---

## Project Status Summary

**~97% technical completion (26 of 28 phases). ~95% business functionality.**

The full catalog journey works end-to-end with real content: browse →
search → PDP → select variant → view price → **Enquire on WhatsApp** →
WhatsApp opens with the product name, variant, price, and product URL
pre-filled, addressed to `919810139284`. All 9 products have their real
photography (64 images, 35 variants) and real prices with a 50%-off
strike-through presentation.

**Phase 27 (Domain, Hosting & Launch) cannot start until manual
business/infra steps happen outside this sandbox** — see "Next Phase
Prompt" below.

---

## What's New Since Last Handoff (Phase 24)

### Phase 26 — Full Static-Site Conversion

Full detail is in `docs/PHASE_SUMMARY.md`'s Phase 26 entry — summary of
the summary:

**Removed:** Supabase entirely (database, auth, storage, migrations), the
entire admin panel, the review system, rate limiting, env auditing,
monitoring, and every dependency that only existed to support them.

**Real content added:** 64 product photos (9 categories × several
colour/size variants each) processed from the business owner's upload,
normalised into clean web-safe filenames, copied into `/public/images/`.
Real prices with a 50%-off strike-through presentation, per the business
owner's exact price list.

**Rebuilt:**
- **Landing page** — Shop by Category is now a 3×3 grid (was 4/4/1); Best
  Sellers shows all 9 products using different variant photos than the
  category grid; the hero collage uses 3 hand-picked product photos
- **Product detail page** — gallery and buy box combined into one Client
  Component (`pdp-product-view.tsx`) so switching a colour variant also
  swaps the gallery photos
- **Shop page** — simple client-side search + price sort (no pagination
  needed for a 9-product catalog)
- **Footer** — Instagram/Facebook/YouTube icons removed

**Validation:** `tsc` ✅ zero errors · `eslint` ✅ zero errors/warnings ·
`vitest` ✅ 26/26 passing · `next build` — reaches the same Google Fonts
sandbox limitation as before (R14/R23) and fails only there; every
earlier build step succeeded.

---

## Prior History (Phases 0–25 — for context only)

Phases 0–23 built the original direct-checkout ecommerce platform on
Supabase. Phase 24 pivoted it to a WhatsApp-enquiry catalog (still
Supabase-backed, still with an admin panel). Phase 25 (a Supabase-backed
production launch) was never executed — the business decided to remove
the backend entirely before it could start. None of the ecommerce or
Supabase-backed admin features described in those phase summaries exist
in the codebase anymore. Full detail remains in `docs/PHASE_SUMMARY.md`
and `docs/PROJECT_STATUS.md`'s risk log (R1–R23) for historical context —
don't use those entries as a guide to current app behavior.

The other docs in `docs/` (`PRD.md`, `TECHSPEC.md`, `SCHEMA.md`,
`RULES.md`, `APPFLOW.md`, `IMPLEMENTATION_PLAN.md`, `TRACKER.md`,
`UAT_SCRIPT.md`) describe the original Supabase-backed ecommerce
architecture in detail and were **not** rewritten for the Phase 26
conversion — they are kept for historical reference only. Treat anything
in them describing a database, an API, an admin panel, or a checkout flow
as **no longer accurate**.

---

## Environment Variables Required (post-conversion)

```bash
NEXT_PUBLIC_SITE_URL=
```

That's it. No Supabase keys, no admin user ID, no Upstash, no Razorpay, no
Resend — this project has exactly one environment variable.

---

## Critical Conventions

### Next.js 16 Async APIs
```typescript
const { slug } = await params;
```

### Static Generation
Every product and policy page uses `generateStaticParams()` — the entire
site can be statically exported/pre-rendered at build time since there is
no per-request data source.

### Editing Content
There is no admin panel — every content change is a code change:
- Products, variants, images, prices → `src/data/products.ts`
- WhatsApp number, contact info, GST note → `src/data/site-config.ts`
- FAQ copy → `src/data/faq.ts`
- Policy pages (shipping/returns/privacy/terms) → `src/data/policies.ts`

### Validate with `next build`, not just `tsc`
Earlier phases (pre-conversion) found build-breaking bugs that `tsc
--noEmit`, `eslint`, and `vitest` all missed. Run `npx next build` before
considering any change done, in addition to the usual three checks
(subject to the R14/R23 sandbox font-fetch limitation, which is not a
real failure — see Known Risks in `PROJECT_STATUS.md`).

---

## Roadmap Position

```
Phases 0-23   ████████████████████████ Ecommerce build — complete (historical)
Phase 24      ████████████████████████ Catalog + WhatsApp-Enquiry Pivot (historical — superseded)
Phase 25      ░ Supabase-backed launch — never executed, superseded by Phase 26
Phase 26      ████████████████████████ Full Static-Site Conversion ✅
Phase 27      ⛔ Domain, Hosting & Launch   ← blocked, manual business action required
Phase 28      ░ Post-Launch Content Review
```

---

## Known Risks (see PROJECT_STATUS.md for the full table)

| Risk | Severity |
|---|---|
| R21: No logo file was supplied — text wordmark used as a placeholder | Low — send a logo file |
| R22: FAQ/policy copy was rewritten by the assistant, not reviewed by the business owner — no registered address/GSTIN included | Medium — review before launch |
| R23: This sandbox couldn't complete a full `next build` (Google Fonts fetch blocked) — verify on the first real build | Low — verify on first real build |

Risks R1–R20 (all resolved or made moot by this conversion) remain in
`PROJECT_STATUS.md` for history; none are active concerns for the current
static codebase.

---

## Next Phase Prompt

```
Continue ACE DÉCOR development. Phases 0-26 are complete — the site is now
a fully static premium product catalog with WhatsApp enquiry (no database,
no admin panel, no login of any kind). Phase 27 — Domain, Hosting &
Launch — is next, blocked on manual business/infra action only:

1. A logo file, if wanted (none was supplied in the original images zip)
2. A review of the hardcoded FAQ/policy copy in src/data/faq.ts and
   src/data/policies.ts — written for the WhatsApp-enquiry model but not
   verified against this specific business's legal details
3. Vercel deployment connected to the repo, with
   NEXT_PUBLIC_SITE_URL set — no other environment variables needed
4. A production domain pointed at the deployment

Once those are done, resume Phase 27 with these deliverables:
- Live production URL
- Final smoke test on production (real WhatsApp enquiry end-to-end, on a
  real device, confirming 919810139284 opens WhatsApp correctly with the
  product name/variant/price/URL pre-filled)
- A verified full `next build` on a machine/CI with normal internet access
  (this sandbox could only verify up to the font-fetch step — R23)
```

*This document was rewritten as part of the full static-site conversion handoff package.*
