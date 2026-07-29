> ⚠️ **SUPERSEDED (2026-07-27, Phase 26):** This document describes the original Supabase-backed ecommerce architecture (database, admin panel, checkout, or similar) and does **not** reflect the current codebase. As of Phase 26, the site is fully static — no database, no admin panel, no authentication of any kind. See `HANDOFF.md` and `docs/PROJECT_STATUS.md` for the current architecture. Kept here for historical reference only.

---

# Development Tracker
## ACE DÉCOR — Task Tracker

**Document Status:** Source of Truth — v2.0 (Living Document)
**Instructions**: Update `Status` as work progresses (`Not Started` → `In Progress` → `Blocked` → `Done`). Do not delete rows; add new rows for newly discovered tasks under the relevant phase.

| Phase | Task | Priority | Status | Dependencies | Notes |
|-------|------|----------|--------|---------------|-------|
| Phase 0 | Initialize Next.js 16 + TypeScript project (App Router). Pin `next@16.2.9` — do not use `^16` or `latest` | High | Not Started | — | Versions below 16.2.6 have patched security vulnerabilities |
| Phase 0 | Install Tailwind CSS v4 (`@tailwindcss/postcss`); configure `@import "tailwindcss"` in `globals.css`; create `@theme {}` block (no `tailwind.config.ts` as primary token config) | High | Not Started | Project init | See TECHSPEC.md §20; design tokens go in CSS, not JS config |
| Phase 0 | Initialise Shadcn UI (`npx shadcn@latest init`, `new-york` style, OKLCH token mapping from DESIGN_SYSTEM.md hex values) | High | Not Started | Tailwind v4 configured | Deprecated `default` style must not be selected; use `sonner` not `toast` |
| Phase 0 | Install Motion (`npm install motion`) — import from `motion/react`; do NOT install `framer-motion` | High | Not Started | Project init | `framer-motion` is a deprecated alias; all animation imports use `motion/react` |
| Phase 0 | Configure ESLint, Prettier, TS strict mode | High | Not Started | Project init | |
| Phase 0 | Set up Git repo and branching strategy | High | Not Started | — | |
| Phase 0 | Connect repo to Netlify, enable preview deploys; smoke-test `GET /api/healthcheck` on Netlify preview to confirm Next.js 16 runtime (OpenNext v5) handles Server Actions correctly | High | Not Started | Git repo | Blocking risk — must verify before Phase 1 |
| Phase 0 | Create `proxy.ts` placeholder (Next.js 16 replacement for deprecated `middleware.ts`; implemented in Phase 1) | High | Not Started | Project init | Export name is `proxy` or default export — `middleware` export is deprecated in Next.js 16 |
| Phase 0 | Create `.env.example` with all required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_USER_ID`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY` | Medium | Not Started | — | Mark each as server-only or public in inline comments |
| Phase 0 | Provision Upstash Redis project (free tier); copy `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` to `.env.example` and Netlify env vars (both staging + production) | High | Not Started | — | Required before Phase 5 auth rate limiting |
| Phase 0 | Create Resend account, verify sending domain, copy `RESEND_API_KEY` to `.env.example` and Netlify env vars (both staging + production) | High | Not Started | — | Required before Phase 1 Supabase SMTP config |
| Phase 0 | Create full folder structure from TECHSPEC.md §2 with stub files (`lib/`, `actions/`, `components/`, `types/`, `supabase/migrations/`, etc.) | Medium | Not Started | Project init | Stubs prevent missing-import errors as phases are built |
| Phase 0 | Create `lib/ratelimit/client.ts` stub | Medium | Not Started | Project init | Implemented in Phase 5 |
| Phase 0 | Create `lib/notifications/resend.ts` stub | Medium | Not Started | Project init | Implemented in Phase 15 |
| Phase 0 | Create `lib/settings/service.ts` stub | Medium | Not Started | Project init | Implemented in Phase 20 |
| Phase 0 | Create `lib/validation/settings.schema.ts` stub | Medium | Not Started | Project init | Schemas added in Phase 2; service implemented Phase 20 |
| Phase 1 | Provision Supabase production project | High | Not Started | — | Use new API key format: `sb_publishable_xxx` (publishable) + `sb_secret_xxx` (secret) |
| Phase 1 | Provision Supabase staging project | High | Not Started | — | Use new API key format: `sb_publishable_xxx` + `sb_secret_xxx` |
| Phase 1 | Confirm Supabase API key names; update `.env.example` to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` | High | Not Started | Supabase projects | Legacy `anon`/`service_role` JWT keys deprecated end of 2026; new projects use new format |
| Phase 1 | Set up Supabase CLI + `supabase/migrations/` directory | High | Not Started | Supabase projects | |
| Phase 1 | First migration: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE EXTENSION IF NOT EXISTS pg_trgm;` | High | Not Started | Supabase CLI | Must be migration 001 — all other migrations depend on these extensions |
| Phase 1 | Implement `lib/supabase/client.ts` (uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) | High | Not Started | Supabase projects | |
| Phase 1 | Implement `lib/supabase/server.ts` | High | Not Started | Supabase projects | |
| Phase 1 | Implement `proxy.ts` session refresh (Next.js 16 replacement for deprecated `middleware.ts`; `createServerClient` cookie-refresh from `@supabase/ssr`; Node.js runtime — not Edge) | High | Not Started | server.ts | Export as `export function proxy(request: NextRequest)` or default export — NOT `export function middleware` |
| Phase 1 | **Configure Resend SMTP in Supabase Auth settings (both production + staging projects)** | High | Not Started | Phase 0 Resend account | **Mandatory in Phase 1, not Phase 5** — new free-tier Supabase projects (post June 3 2026) cannot customise auth email templates without custom SMTP; required for password-reset emails in Phase 5 |
| Phase 1 | Generate and wire Supabase TS types (`lib/supabase/types.ts`) | Medium | Not Started | Schema exists (Phase 2+) | Revisit/regenerate after Phase 4 |
| Phase 2 | Migration: `categories` table + RLS | High | Not Started | Phase 1 | |
| Phase 2 | Migration: `products` table + RLS | High | Not Started | categories | |
| Phase 2 | Migration: `product_images` table + RLS | High | Not Started | products | |
| Phase 2 | Migration: `product_variants` table + RLS | High | Not Started | products | |
| Phase 2 | Seed 9 initial categories | High | Not Started | categories migration | |
| Phase 2 | Create `lib/validation/settings.schema.ts` with Zod v4 schemas for all seeded settings keys (`return_window_days`, `default_shipping_fee`, `free_shipping_threshold`, `contact_email`, `contact_phone`, `whatsapp_enabled`, `whatsapp_number`, `low_stock_threshold_default`, policy text keys, `social_links`) | High | Not Started | Phase 1 | Use `z.strictObject()`, `z.email()`, `z.url()` patterns (Zod v4) — not deprecated `.strict()` / `.email()` chain |
| Phase 2 | RLS test: anon can read active products only | High | Not Started | products RLS | |
| Phase 3 | Migration: `users` table + `one_admin_only` partial unique index | High | Not Started | Phase 2 | |
| Phase 3 | Migration: `addresses` table + RLS | High | Not Started | users | |
| Phase 3 | Trigger: `auth.users` insert → `public.users` row (role='customer') | High | Not Started | users table | |
| Phase 3 | Write admin provisioning runbook/script | High | Not Started | users table | |
| Phase 3 | Set `ADMIN_USER_ID` env var in Netlify (staging + production) after admin account provisioned | High | Not Started | Admin provisioning | Server-only — never `NEXT_PUBLIC_`; missing = admin console inaccessible |
| Phase 3 | Implement `lib/auth/guards.ts` (`requireUser`, `requireAdmin`) | High | Not Started | users/role | `requireAdmin()` must fail closed (throw) when `ADMIN_USER_ID` env var is absent — never fail open |
| Phase 4 | Migration: `cart_items` + RLS | High | Not Started | Phase 3 | |
| Phase 4 | Migration: `orders` + RLS (includes `shipped_at TIMESTAMPTZ NULL`, `tracking_number TEXT NULL`, `tracking_url TEXT NULL`) | High | Not Started | addresses, users | |
| Phase 4 | Migration: `order_items` + RLS | High | Not Started | orders, products | |
| Phase 4 | Migration: `payments` + RLS (includes `razorpay_refund_id TEXT UNIQUE` column) | High | Not Started | orders | |
| Phase 4 | Migration: `reviews` + RLS | Medium | Not Started | products, users, order_items | |
| Phase 4 | Migration: `returns` + RLS | High | Not Started | orders, order_items | |
| Phase 4 | Migration: `banners` + RLS | Medium | Not Started | Phase 1 | |
| Phase 4 | Migration: `faq_items` + RLS | Medium | Not Started | Phase 1 | |
| Phase 4 | Migration: `settings` + seed defaults (includes `whatsapp_enabled=false`, `whatsapp_number=""`) | High | Not Started | Phase 1 | `whatsapp_*` keys seeded here — not deferred to Phase 21/22 |
| Phase 4 | Migration: `audit_logs` + RLS (includes `ip_address`, `old_values`/`new_values` JSONB per SCHEMA.md §3.16) | Medium | Not Started | users | `entity_id` is UUID; for `settings` actions use `SETTINGS_ENTITY_UUID` sentinel constant from `lib/constants.ts` |
| Phase 4 | Add `SETTINGS_ENTITY_UUID` sentinel constant to `lib/constants.ts` | Medium | Not Started | Phase 4 audit_logs migration | Required for logging settings changes where PK is TEXT not UUID — see RULES.md §4.10 |
| Phase 4 | Migration: `inventory_movements` + RLS | High | Not Started | products, product_variants, users | See SCHEMA.md §3.17 |
| Phase 4 | Stub `rpc_order_confirm` Postgres function in migration (full body implemented in Phase 14) | High | Not Started | Phase 4 orders/order_items/inventory_movements | Stub with correct signature so later migration can replace body without structural changes |
| Phase 4 | Stub `rpc_return_complete` Postgres function in migration (full body implemented in Phase 19) | High | Not Started | Phase 4 returns/payments | Same pattern as `rpc_order_confirm` |
| Phase 4 | RLS test suite: all Phase 2–4 tables x all roles (anon/authenticated/admin) | High | Not Started | All Phase 4 migrations | RLS harness established here; extended in Phase 13 |
| Phase 5 | Build `/login` page + Server Action | High | Not Started | Phase 3 | |
| Phase 5 | Build `/signup` page + Server Action | High | Not Started | Phase 3 | |
| Phase 5 | Build `/forgot-password` page + Server Action | High | Not Started | Phase 3 | |
| Phase 5 | Build `/reset-password` page + Server Action (include role-aware redirect: `auth.uid() === ADMIN_USER_ID` → `/admin/login`, else → `/login`) | High | Not Started | forgot-password | Server-side check only — `ADMIN_USER_ID` never exposed to client |
| Phase 5 | Apply rate limiting to auth endpoints (login, signup, forgot-password) via `lib/ratelimit/client.ts` (Upstash Redis, sliding window) | High | Not Started | auth pages, Phase 0 Upstash | Per RULES.md §5.6 and RULES.md §1.8 |
| Phase 5 | Navbar: logged-in vs guest states | Medium | Not Started | auth pages | |
| Phase 6 | Build `/admin/login` page (unlinked from public nav) | High | Not Started | Phase 5 | |
| Phase 6 | Update `proxy.ts` for `(admin)` gating (role check + `ADMIN_USER_ID` env var check) | High | Not Started | admin login, guards.ts | Export `proxy` function — NOT `middleware`; Next.js 16 deprecated `middleware` named export |
| Phase 6 | Verify admin forgot-password flow + confirm redirect lands on `/admin/login` post-reset | Medium | Not Started | Phase 5 forgot-password | Role-aware redirect implemented in Phase 5 `/reset-password` action |
| Phase 6 | Automated test: non-admin cannot access `/admin/*`; unauthenticated is redirected | High | Not Started | proxy.ts update | |
| Phase 7 | Define Tailwind v4 theme tokens in `globals.css` `@theme {}` block (OKLCH colors from DESIGN_SYSTEM.md §2 hex values, spacing, radius, shadows, breakpoints, fonts) | High | Not Started | Phase 0 | All tokens in CSS — no JS config file; see TECHSPEC.md §20 |
| Phase 7 | Theme Shadcn components (`new-york` style: Button, Input, Card, Badge, Dialog, Accordion, Tabs, Table, `sonner` toasts) to ACE DÉCOR tokens | High | Not Started | Tailwind theme | Use `sonner` — legacy `toast` component is deprecated |
| Phase 7 | Build base layout: Navbar | High | Not Started | Theme tokens | |
| Phase 7 | Build base layout: Footer | High | Not Started | Theme tokens | |
| Phase 7 | Build base layout: MobileNav | Medium | Not Started | Navbar | |
| Phase 7 | Create `/dev/components` style-preview route (optional) | Low | Not Started | Themed components | Confirm no `framer-motion` imports exist — all animations use `motion/react` |
| Phase 8 | Build landing page hero collage section | High | Not Started | Phase 7 | |
| Phase 8 | Build "Shop by Category" grid (9 categories) | High | Not Started | Phase 2 categories, Phase 7 | |
| Phase 8 | Build Featured Products section | Medium | Not Started | Phase 9 product card | |
| Phase 8 | Build Trust strip section | Low | Not Started | Phase 7 | |
| Phase 8 | Responsive QA: landing page 375px–1920px | High | Not Started | All landing sections | |
| Phase 9 | Build Product Card component (no fake-discount elements per RULES.md §6.3) | High | Not Started | Phase 7, SCHEMA products | |
| Phase 9 | Build `/shop` all-products page | High | Not Started | Product Card | `await searchParams` — Next.js 16 async API |
| Phase 9 | Build `/shop/[category]` page | High | Not Started | Product Card | `await params` — Next.js 16 async API |
| Phase 9 | Build filter UI (price, variant/size, availability) | High | Not Started | /shop pages | |
| Phase 9 | Build sort UI (price, newest) | Medium | Not Started | /shop pages | |
| Phase 9 | Implement pagination (cursor or offset-based) | High | Not Started | /shop pages | |
| Phase 9 | Add `search_vector` (tsvector) column + GIN index to `products` via migration | High | Not Started | Phase 2 products | Per TECHSPEC §15 |
| Phase 9 | Add `pg_trgm` trigram GIN index on `products.name` via migration | High | Not Started | Phase 1 (`pg_trgm` extension) | Required for typo-tolerant search fallback |
| Phase 9 | Write `products` trigger for `search_vector` maintenance on `products` row changes | High | Not Started | search_vector column | |
| Phase 9 | Write `product_variants` trigger for `search_vector` maintenance on `product_variants.name` changes (fires recomputation on parent `products` row) | High | Not Started | products search_vector trigger | **Both triggers required** — a trigger on `products` alone leaves variant name edits producing stale search results |
| Phase 9 | Implement search query-builder (`lib/utils/search.ts`) with ts_rank ranking + trigram fallback | High | Not Started | search_vector + trigram indexes | Per TECHSPEC §15.3/§15.5 |
| Phase 9 | Build search UI (global + category-scoped) with debounced input (300ms) | Medium | Not Started | search query-builder | |
| Phase 10 | Build PDP image gallery (3–4 images + thumbnails + mobile swipe) | High | Not Started | Phase 9 | `await params` — Next.js 16 async API |
| Phase 10 | Build PDP buy box (price, stock, variant selector, qty stepper, Add to Cart / Buy Now) | High | Not Started | Phase 9 | |
| Phase 10 | Implement variant-aware price/stock logic util (`lib/utils/pricing.ts`) | High | Not Started | SCHEMA product_variants | Variant low-stock threshold inherited from `products.low_stock_threshold` — no per-variant threshold |
| Phase 10 | Build reviews section (seed display stub initially) | Medium | Not Started | Phase 17 seed data | Can stub initially |
| Phase 10 | Build FAQ accordion on PDP | Medium | Not Started | Phase 4 faq_items | |
| Phase 10 | Implement share button (Web Share API + clipboard fallback) | Low | Not Started | PDP base | |
| Phase 10 | Add SEO meta tags + JSON-LD Product schema | High | Not Started | PDP base | |
| Phase 11 | Build `/cart` page UI | High | Not Started | Phase 9/10 | |
| Phase 11 | Implement simple guest cart (cookie/local storage, `{product_id, product_variant_id, quantity}[]` — no backend persistence, no cross-device sync) | High | Not Started | /cart UI | v1 scope per APPFLOW.md §6 — not a complex merge engine |
| Phase 11 | Implement authenticated `cart_items` Server Actions (CRUD) using Zod v4 `z.strictObject()` | High | Not Started | Phase 4 cart_items | |
| Phase 11 | Implement single-pass cart import on login/signup (upsert quantities; cap at stock_quantity with toast notification) | High | Not Started | Guest cart + auth Server Actions | Not a complex merge engine — single pass only |
| Phase 12 | Build `/checkout` address selection/entry UI (React Hook Form + Zod v4 — verify `@hookform/resolvers` Zod v4 compatibility before writing) | High | Not Started | Phase 11, Phase 3 addresses | Check `@hookform/resolvers` version supports Zod 4.3.x+ (TypeScript overload compatibility) |
| Phase 12 | Build order summary (subtotal/shipping/tax/total computed via `lib/settings/service.ts`) | High | Not Started | Phase 4 settings | All settings reads through typed service, not raw JSONB |
| Phase 12 | Server Action: create `pending` order + `order_items` with preliminary stock check and Zod v4 validation | High | Not Started | Phase 4 orders/order_items | Definitive atomic stock check happens in `rpc_order_confirm` at Phase 14 |
| Phase 12 | Build multi-step checkout stepper UI (per DESIGN_SYSTEM.md §13) | Medium | Not Started | Checkout pages | |
| Phase 13 | Configure Vitest for unit/integration tests | High | Not Started | Phase 0 | |
| Phase 13 | Configure Playwright for E2E tests | High | Not Started | Phase 0 | |
| Phase 13 | Write baseline Playwright smoke suite (landing, PLP, PDP add-to-cart, login/signup, checkout redirect-to-login) | High | Not Started | Phases 5, 8–12 | |
| Phase 13 | Build RLS test harness covering all tables/policies from Phases 2–4 | High | Not Started | Phases 2–4 | Reused/extended in later phases; run on every migration-touching PR |
| Phase 13 | Wire Vitest + Playwright + RLS harness into CI build gates (block PR merge on failures) | High | Not Started | Above | Per RULES.md §10 |
| Phase 13 | Create staging seed/reset fixture script | Medium | Not Started | Phases 1–4 | |
| Phase 13 | **PDF library spike**: prototype `@react-pdf/renderer` in a Netlify Function context; confirm bundle fits within Netlify limits; if fails, evaluate `pdf-lib` as fallback; document decision before Phase 15 | High | Not Started | Phase 0 Netlify deploy | Decision gates Phase 15 invoice implementation |
| Phase 14 | Implement `/api/razorpay/create-order` Route Handler | High | Not Started | Phase 12 | |
| Phase 14 | Integrate Razorpay Checkout widget client-side | High | Not Started | create-order | |
| Phase 14 | Implement `/api/razorpay/verify-payment` Route Handler (use `await req.text()` for raw body HMAC verification before any JSON parsing) | High | Not Started | Razorpay widget | Raw body required for Razorpay signature verification — `req.json()` breaks HMAC |
| Phase 14 | Write `rpc_order_confirm` Postgres function (migration, replaces Phase 4 stub): atomically validates stock, decrements stock, inserts `inventory_movements` (change_type=sale), updates `orders.status='confirmed'`, inserts `payments` row (status='captured') — single transaction | High | Not Started | Phase 4 stub, Phase 4 inventory_movements | Named `rpc_order_confirm` per RULES.md §1.7; invoked via `supabase.rpc()` |
| Phase 14 | Handle stock-insufficient-at-verification path in `rpc_order_confirm`: roll back, set `orders.status='payment_failed'`, initiate Razorpay refund if payment captured, surface clear error to customer | High | Not Started | rpc_order_confirm | No inventory reservation in v1 — final check is at payment verification |
| Phase 14 | Implement `/api/razorpay/webhook` Route Handler (use `await req.text()` for raw body; idempotent reconciliation for `payment.captured`, `payment.failed`, `refund.created`, `refund.processed`) | High | Not Started | verify-payment | Raw body required for webhook signature verification |
| Phase 14 | Trigger Low Stock Alert check immediately after stock decrement (within same flow) | High | Not Started | inventory_movements insert | Per RULES.md §11.6 — not a separate polling job |
| Phase 14 | Build `/checkout/success` page | High | Not Started | verify-payment | |
| Phase 14 | Test webhook idempotency (duplicate delivery does not create duplicate payments rows) | High | Not Started | webhook handler | |
| Phase 15 | Implement `lib/notifications/resend.ts` (Resend API client, typed `sendEmail()` helper) | High | Not Started | Phase 0 Resend account, Phase 1 SMTP config | Provider: Resend — decided in audit Q4 |
| Phase 15 | Build "Order Confirmed" email template (brand-styled; includes invoice download link) | High | Not Started | resend.ts | |
| Phase 15 | Build "Order Accepted / Shipped / Delivered / Cancelled" email templates | Medium | Not Started | resend.ts | "Shipped" template renders `orders.tracking_number` + `orders.tracking_url` as "Track Your Order" link if set; graceful "on its way" fallback if NULL |
| Phase 15 | Build "Return Approved / Rejected" email templates | Medium | Not Started | resend.ts | |
| Phase 15 | Build "New Order Received" admin email template | High | Not Started | resend.ts | Per PRD §14.3 |
| Phase 15 | Build "Return Request Created" admin email template | Medium | Not Started | resend.ts | Per PRD §14.3 |
| Phase 15 | Build "Low Stock Alert" admin email template + once-per-crossing logic | High | Not Started | resend.ts, Phase 14 inventory hook | Per PRD §14.3 — alert fires once per crossing; re-armed after restock |
| Phase 15 | Implement on-demand invoice PDF generation Route Handler (`GET /api/invoice/[orderId]`) using library decided in Phase 13 spike | High | Not Started | Phase 13 spike decision, Phase 4 orders/order_items | Sourced from order snapshots only — never live `products.base_price` |
| Phase 15 | Add invoice download link to "Order Confirmed" email | Medium | Not Started | Invoice generation | Link to `/api/invoice/[orderId]`, not a PDF attachment |
| Phase 16 | Build `/account` profile page (view/edit name, phone) | High | Not Started | Phase 5 | `await params` — Next.js 16 async API |
| Phase 16 | Build `/account/addresses` (CRUD + set default); surface clear error when deleting an address referenced by a historical order (ON DELETE RESTRICT) | High | Not Started | Phase 3 addresses | |
| Phase 16 | Build `/account/orders` list | High | Not Started | Phase 14 | |
| Phase 16 | Build `/account/orders/[id]` detail (show `tracking_number` + "Track Your Order" link to `tracking_url` if set; "Download Invoice" button) | High | Not Started | orders list, Phase 15 invoice | `await params` — Next.js 16 async API |
| Phase 16 | Build `/account/returns` request flow (return-eligibility via `settings.return_window_days` from `lib/settings/service.ts`) | High | Not Started | Phase 4 returns, settings service | |
| Phase 17 | Server Action: review submission with verified-purchase check (Zod v4 `z.strictObject()`) | Medium | Not Started | Phase 16 orders | |
| Phase 17 | Seed script/migration: 10–15 `is_seed=true` reviews with `reviewer_name` populated | Medium | Not Started | Phase 2 products | |
| Phase 17 | PDP review list + rating summary (replace stub) | Medium | Not Started | Phase 10 stub, seed script | |
| Phase 18 | Build `(admin)` layout (sidebar, topbar, per DESIGN_SYSTEM.md §18) | High | Not Started | Phase 6, Phase 7 | |
| Phase 18 | Build `/admin/dashboard` stat cards + revenue-over-time chart | High | Not Started | Phase 4 orders/payments | |
| Phase 18 | Build `/admin/categories` CRUD | High | Not Started | Phase 2 categories | |
| Phase 18 | Build `/admin/products` list with "Archived" filter tab | High | Not Started | Phase 2 products | "Archived" tab per RULES.md §19.3 — allows admin to view/restore archived products |
| Phase 18 | Build `/admin/products/new` + edit (images, variants, SEO fields, `draft`/`active`/`archived` status) — **no hard-delete action** | High | Not Started | products list | Archive is the only removal action; no `DELETE FROM products` accessible from UI (RULES.md §19) |
| Phase 18 | Wire price/stock edits to `audit_logs` | High | Not Started | Phase 4 audit_logs | |
| Phase 18 | Build manual inventory adjustment UI (restock/manual_adjustment) writing `inventory_movements` + `audit_logs` atomically | High | Not Started | Phase 4 inventory_movements/audit_logs | Per APPFLOW.md §10.2; `manual_adjustment` requires non-empty `reason` field |
| Phase 18 | Build per-product stock history view (from `inventory_movements` ledger) | Medium | Not Started | inventory_movements | |
| Phase 18 | `await params` in all admin product pages | High | Not Started | Phase 18 pages | Next.js 16 async API requirement — TECHSPEC §19 |
| Phase 19 | Build `/admin/orders` list with filters (status, date range, search by order ID/customer) | High | Not Started | Phase 14 | |
| Phase 19 | Build `/admin/orders/[id]` detail + status transitions; include optional `tracking_number` (text) + `tracking_url` (URL) inputs on "Mark as Shipped" action (saved to `orders` + sets `orders.shipped_at = now()` in same Server Action) | High | Not Started | orders list | `await params` — Next.js 16 async API |
| Phase 19 | Add "Download Invoice" action to admin order detail | Medium | Not Started | Phase 15 invoice generation | |
| Phase 19 | Build `/admin/payments` list + revenue-over-time chart (Recharts) | High | Not Started | Phase 14 payments | |
| Phase 19 | Build `/admin/returns` list + detail (approve/reject) | High | Not Started | Phase 4 returns | |
| Phase 19 | Implement "Trigger Refund" action (Razorpay Refunds API → webhook reconciles → `payments.razorpay_refund_id` set) | High | Not Started | webhook handler extension | |
| Phase 19 | Write `rpc_return_complete` Postgres function (migration, replaces Phase 4 stub): atomically updates `returns.status='completed'`, `payments.status='refunded'` + `razorpay_refund_id`, optionally restocks inventory — single transaction | High | Not Started | Phase 4 stub, Razorpay refund webhook | Named `rpc_return_complete` per RULES.md §1.7; invoked via `supabase.rpc()` |
| Phase 20 | Build `/admin/reviews` moderation queue (approve/hide/delete); seed reviews (`is_seed=true`) visually flagged with "Seed" badge — admin can hide or delete individually via existing moderation actions (no separate retirement flow) | Medium | Not Started | Phase 17 | |
| Phase 20 | Build `/admin/banners` CRUD + image upload (Supabase Storage) | Medium | Not Started | Phase 4 banners, Storage | |
| Phase 20 | Build `/admin/faqs` CRUD | Medium | Not Started | Phase 4 faq_items | |
| Phase 20 | Build `/admin/settings` editor (policies, shipping fee, return window, contact info, low-stock threshold, WhatsApp settings); all reads/writes via `lib/settings/service.ts` — raw JSONB never consumed by UI | High | Not Started | Phase 4 settings | Invalid values return validation error and are not persisted (RULES.md §18) |
| Phase 20 | Implement `lib/settings/service.ts` (typed getters/setters: `getShippingSettings()`, `getContactSettings()`, `getWhatsAppSettings()`, `getReturnWindowDays()`, etc.) | High | Not Started | Phase 2 settings.schema.ts | Per RULES.md §18; raw JSONB never consumed by UI or business logic |
| Phase 20 | Build `/admin/reports` export (CSV/Excel) for orders, payments, PnL summary — date range filter | High | Not Started | Phase 19 payments/orders | |
| Phase 21 | Implement dynamic `sitemap.xml` + `robots.txt` (`sitemap.ts` must use `await id` per Next.js 16 async API — TECHSPEC §19) | High | Not Started | Phases 8–10 | |
| Phase 21 | Add JSON-LD: Product, BreadcrumbList, FAQPage, Organization (per PRD §15.1) | High | Not Started | PDP, FAQ pages | |
| Phase 21 | Add OpenGraph + Twitter Card tags (PDP, PLP, Landing) | Medium | Not Started | Phases 8–10 | Per PRD §15.7/§15.8 |
| Phase 21 | Implement blur placeholder generation on image upload (store `blurDataURL` per product image) | Medium | Not Started | Phase 18 image upload | Per TECHSPEC §16.5 |
| Phase 21 | Verify WebP/AVIF delivery + responsive `srcset` across Landing/PLP/PDP | High | Not Started | Phases 8–10 | Per TECHSPEC §16 |
| Phase 21 | Image optimization audit (`next/image`, correct `sizes`, `priority` on above-fold images) | High | Not Started | Phases 8–10 | |
| Phase 21 | Accessibility audit (axe + manual — contrast, focus, alt text, semantic HTML) | High | Not Started | All UI complete | |
| Phase 21 | Lighthouse CI thresholds (Performance/SEO/A11y/Best Practices ≥ 90 mobile on Landing, PLP, PDP) | High | Not Started | Above audits | |
| Phase 21 | SEO slug audit: verify all `products.slug` values follow descriptive hyphenated convention (PRD §15.9); no ID-based or opaque slugs | Medium | Not Started | Phase 2 products | |
| Phase 21 | Build floating WhatsApp button component (storefront-wide; hidden if `whatsapp_enabled=false` or number unset; `motion/react` scale-in animation; `#25D366` colour with documented exception comment) | Low | Not Started | Phase 4 settings seed (`whatsapp_*` keys already seeded), Phase 20 settings service | Optional, admin-configurable per PRD §16; uses `settings.whatsapp_number` + `settings.whatsapp_enabled` from `lib/settings/service.ts` |
| Phase 21 | Add WhatsApp number + enabled toggle to `/admin/settings` UI | Low | Not Started | Phase 20 settings editor | |
| Phase 22 | Configure security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) in `next.config.ts` | High | Not Started | Phase 0 deploy config | |
| Phase 22 | Full RLS policy review/test suite (all tables × all roles) | High | Not Started | Phases 2–4 | |
| Phase 22 | Verify rate limiting active on auth/checkout/review/webhook endpoints (Upstash Redis via `lib/ratelimit/client.ts`) | High | Not Started | Phases 5, 12, 14, 17 | |
| Phase 22 | Grep/build audit: `SUPABASE_SECRET_KEY` not in any client-bundled code; no references to deprecated `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` anywhere in codebase | High | Not Started | All server code | Also verify no `middleware.ts` file exists — `proxy.ts` only |
| Phase 22 | Dependency vulnerability scan (`npm audit` / Dependabot) — resolve all high/critical | Medium | Not Started | — | |
| Phase 22 | Confirm Supabase automated backups enabled on production project (paid plan) | High | Not Started | Phase 1 | Per TECHSPEC §18 |
| Phase 22 | Perform test restore from Supabase backup on staging + document recovery procedure | High | Not Started | Backups enabled | **Mandatory** — a backup never test-restored is not a reliable backup (TECHSPEC §18.4) |
| Phase 23 | Populate real product content for all 9 categories (images, descriptions, variants, pricing) | High | Done (partial) | Phase 18 | 36 products seeded with real descriptions/pricing/variants; images are `placehold.co` placeholders pending DK's real photography (upload pipeline already built in Phase 18) |
| Phase 23 | Enter real policy text (Shipping/Returns/Privacy/Terms) via `/admin/settings` | High | Done | Phase 20 settings | Seeded directly via migration `20260703000014_real_policy_text.sql`; still editable via `/admin/settings` as designed |
| Phase 23 | Enter real FAQ content via `/admin/faqs` | Medium | Done | Phase 20 faqs | Already real as of the Phase 1 `seed_faqs` migration; `/faq` storefront page built this phase to display it (was a Phase 0 stub) |
| Phase 23 | Execute full UAT script (all APPFLOW.md customer + admin flows on staging, Razorpay test mode) | High | Not Started | All prior phases | `docs/UAT_SCRIPT.md` authored covering all flows; actual execution needs a live staging deployment + stakeholder sign-off — outside this session's scope, see `PROJECT_STATUS.md` |
| Phase 24 | Finalize production Supabase project (migrations applied, RLS verified, admin account provisioned, `ADMIN_USER_ID` set in Netlify production env vars) | High | Not Started | Phase 23 | |
| Phase 24 | Activate live Razorpay account + configure live webhook with production URL and `RAZORPAY_WEBHOOK_SECRET` | High | Not Started | Phase 23 | |
| Phase 24 | Configure custom domain + HTTPS on Netlify | High | Not Started | Phase 0 | |
| Phase 24 | Production smoke test (real order end-to-end — payment → order → notification) | High | Not Started | Above | |
| Phase 24 | Confirm monitoring/error tracking active (per TECHSPEC §12) | Medium | Not Started | TECHSPEC §12 | |
| Phase 25 | Write operational runbook for admin (add/edit/archive products, process orders, handle returns, export reports, update settings, retire seed reviews via `/admin/reviews`, rotate API keys) | High | Not Started | Phase 24 | Written for non-technical admin user (PRD persona §3.4) |
| Phase 25 | Triage and fix post-launch bugs (first 1–2 weeks of live traffic) | High | Not Started | Phase 24 | |
| Phase 25 | Final TRACKER.md review — mark all completed phases Done; move remaining items to Future Opportunities backlog (PRD §11) | Medium | Not Started | All phases | |
