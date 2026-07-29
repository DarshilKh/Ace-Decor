> ⚠️ **SUPERSEDED (2026-07-27, Phase 26):** This document describes the original Supabase-backed ecommerce architecture (database, admin panel, checkout, or similar) and does **not** reflect the current codebase. As of Phase 26, the site is fully static — no database, no admin panel, no authentication of any kind. See `HANDOFF.md` and `docs/PROJECT_STATUS.md` for the current architecture. Kept here for historical reference only.

---

# Implementation Plan
## ACE DÉCOR — Phased Delivery Roadmap

**Document Status:** Source of Truth — v2.0
**Related Documents:** PRD.md, TECHSPEC.md, APPFLOW.md, SCHEMA.md, DESIGN_SYSTEM.md, RULES.md, TRACKER.md

Each phase lists Objective, Deliverables, Dependencies, Risks, and Acceptance Criteria. Phases are intended to be executed roughly sequentially, though some (e.g., Phase 7 Design System implementation and Phase 8 Storefront UI) can overlap once their dependencies are met.

> **⚠ ERRATUM (2026-07-05):** Phase 1's `proxy.ts` deliverable was implemented
> at the project root instead of `src/proxy.ts`, which meant it silently
> never ran — see TECHSPEC.md's erratum for full detail. Fixed in the
> 2026-07-05 dependency/config audit; no phase deliverables changed, only
> the file's location.

---

## Phase 0 — Project Setup

**Objective**: Establish the project skeleton, tooling, and environments.

**Deliverables**:
- Next.js 16 project initialized (App Router, TypeScript). Pin to `next@16.2.9` — do not use `^16` or `latest`; versions below `16.2.6` have patched security vulnerabilities.
- **Tailwind CSS v4** installed and configured (CSS-first `@theme {}` in `globals.css`; `@tailwindcss/postcss` plugin in `postcss.config.mjs`; no `tailwind.config.ts` as primary token config — see TECHSPEC.md §20). Design system tokens from DESIGN_SYSTEM.md §2–§8 converted to OKLCH and placed in `@theme {}`.
- **Shadcn UI** initialised via `npx shadcn@latest init`, selecting the `new-york` style (deprecated `default` style must not be used). `sonner` used for toasts (legacy `toast` component is deprecated).
- **Motion** (`npm install motion`) installed — import from `motion/react`. The `framer-motion` package must NOT be installed (deprecated alias).
- ESLint, Prettier, TypeScript strict mode configured.
- Git repository initialized with branching strategy (per RULES.md).
- Netlify project created, connected to repo, preview deploys enabled. Smoke-test: deploy a trivial Server Action (`GET /api/healthcheck` returning `{ ok: true }`) to confirm Netlify's Next.js 16 runtime (OpenNext v5) correctly handles Server Actions and Route Handlers.
- **Upstash Redis project provisioned** (free tier); `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` added to `.env.example` and Netlify env vars. Required before Phase 5 auth rate limiting.
- **Resend account created** and sending domain verified; `RESEND_API_KEY` added to `.env.example` and Netlify env vars. Required before Phase 1 Supabase SMTP configuration.
- `.env.example` created documenting all required environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_USER_ID`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY` — each marked as server-only or public in comments.
- `lib/ratelimit/client.ts` stub created (Upstash Redis implementation in Phase 5).
- `lib/notifications/resend.ts` stub created (implementation in Phase 15).
- `lib/settings/service.ts` stub and `lib/validation/settings.schema.ts` stub created (implementation in Phase 4 / Phase 20).
- `proxy.ts` placeholder created (Next.js 16 replacement for deprecated `middleware.ts`; implemented in Phase 1).
- Full folder structure from TECHSPEC.md §2 established with stub files.

**Dependencies**: None.

**Risks**:
- Netlify Next.js 16 runtime compatibility — mitigate by deploying `GET /api/healthcheck` as a smoke test before Phase 1 starts. If Server Actions fail on Netlify preview, this is a blocking issue.
- Tailwind v4 and Shadcn compatibility — confirm `npx shadcn@latest init` supports Tailwind v4 before running; select `new-york` style explicitly.
- Motion v12 React 19 compatibility — imports from `motion/react` (not `framer-motion`); confirm no breaking changes on first animation usage.

**Acceptance Criteria**: Empty Next.js 16 app builds and deploys successfully to a Netlify preview URL; `GET /api/healthcheck` returns `{ ok: true }` on Netlify preview; lint/type-check pass in CI; `.env.example` contains all required variables; Tailwind v4 `@theme {}` tokens render correctly in a smoke-test component.

---

## Phase 1 — Supabase Project & Core Infrastructure

**Objective**: Provision Supabase project(s) and establish the database connection layer.

**Deliverables**:
- Supabase project created (production + staging). Confirm projects use new API key format: `sb_publishable_xxx` (publishable, replaces anon key) and `sb_secret_xxx` (secret, replaces service_role key). Update `.env.example` variable names to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SECRET_KEY` accordingly.
- Supabase CLI configured locally; `supabase/migrations/` directory initialized.
- **First migration**: enables required Postgres extensions: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` and `CREATE EXTENSION IF NOT EXISTS pg_trgm;` — this migration must run before any other migration, as later migrations depend on these extensions (trigram indexes for search, uuid generation).
- `lib/supabase/client.ts`, `lib/supabase/server.ts` implemented using `@supabase/ssr` and the new publishable/secret key names.
- **`proxy.ts` session-refresh helper implemented** (`proxy.ts` is the Next.js 16 replacement for the deprecated `middleware.ts`; exports `export function proxy(request: NextRequest)` or a default export; runs on Node.js runtime — not Edge; uses `createServerClient` cookie-refresh pattern from `@supabase/ssr`).
- Generated TypeScript types from Supabase schema wired into `lib/supabase/types.ts`.
- **Resend SMTP configured in Supabase Auth settings** (both production and staging projects): add Resend SMTP credentials to Supabase Auth → SMTP Settings so Supabase sends password-reset and confirmation emails via the project's verified Resend domain. **This is mandatory in Phase 1, not Phase 5** — new Supabase free-tier projects created after June 3, 2026 cannot customise auth email templates without a custom SMTP provider configured at project creation. Without this, password-reset emails in Phase 5 will use Supabase's default unbranded template.

**Dependencies**: Phase 0.

**Risks**: Confusing publishable vs secret key usage early, leading to security holes later — mitigate by documenting key usage in RULES.md §1.4 and the code review checklist. The `SUPABASE_SECRET_KEY` (new format, replaces `SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS entirely and must never appear in client-bundled code. Forgetting to configure Resend SMTP in Supabase during Phase 1 will cause password-reset emails to use Supabase's default unbranded template (or fail on new free-tier projects) — this is not recoverable without reconfiguring Supabase Auth settings.

**Acceptance Criteria**: A simple server component can successfully query Supabase (e.g., `select now()`); staging and production Supabase projects are both reachable from respective Netlify environments; `proxy.ts` is deployed and correctly redirects unauthenticated requests to `/login` for a test protected route (smoke-tested on Netlify preview); a test password-reset email is received on staging using the correct Resend sending domain (not Supabase's default).

---

## Phase 2 — Core Schema Migration (Catalog Tables)

**Objective**: Implement the catalog portion of SCHEMA.md.

**Deliverables**:
- Migrations for `categories`, `products`, `product_images`, `product_variants`.
- RLS enabled and policies applied per SCHEMA.md §5.
- Seed migration with the 9 initial categories.
- `lib/validation/settings.schema.ts` Zod v4 schemas created for all seeded settings keys (`return_window_days`, `default_shipping_fee`, `free_shipping_threshold`, `contact_email`, `contact_phone`, `whatsapp_enabled`, `whatsapp_number`, `low_stock_threshold_default`, policy text keys, `social_links`).

**Dependencies**: Phase 1.

**Risks**: RLS policy errors silently blocking legitimate reads — mitigate with integration tests for anon read access to active products.

**Acceptance Criteria**: Anonymous Supabase client can read active products/categories; cannot read draft/archived products; admin (secret key / authenticated admin) can read/write all.

---

## Phase 3 — Core Schema Migration (Users, Addresses, Auth Wiring)

**Objective**: Implement `users`, `addresses` tables and connect to Supabase Auth.

**Deliverables**:
- Migration for `users` (with `one_admin_only` partial unique index) and `addresses`.
- DB trigger: on `auth.users` insert → create `public.users` row with `role='customer'`.
- One-time admin provisioning script/runbook (manually create the single admin user + set `role='admin'`).
- `ADMIN_USER_ID` env var documented in the runbook — copy from `auth.users.id` in the Supabase dashboard after admin provisioning; add to Netlify env vars (server-only, never `NEXT_PUBLIC_`).
- `lib/auth/guards.ts` (`requireUser()`, `requireAdmin()`). `requireAdmin()` must fail closed if `ADMIN_USER_ID` env var is absent — no request is granted admin access without this variable.

**Dependencies**: Phase 2.

**Risks**: Admin provisioning being accidentally repeatable — mitigate via the partial unique index plus a documented manual runbook (not a public endpoint).

**Acceptance Criteria**: New signup creates both `auth.users` and `public.users` rows; attempting to set a second user's role to `admin` violates the unique index; `requireAdmin()` correctly rejects non-admin sessions; `requireAdmin()` throws (fails closed) when `ADMIN_USER_ID` is absent.

---

## Phase 4 — Core Schema Migration (Commerce Tables)

**Objective**: Implement `cart_items`, `orders`, `order_items`, `payments`, `returns`, `reviews`, plus `banners`, `faq_items`, `settings`, `audit_logs`, `inventory_movements`.

**Deliverables**:
- All remaining migrations from SCHEMA.md with RLS policies.
- Seed data for `settings` (default shipping fee, return window, policy text placeholders, contact info, `whatsapp_enabled = false`, `whatsapp_number = ""`).
- Seed data for `faq_items` (initial FAQ set).
- `lib/validation/settings.schema.ts` completed with Zod v4 schemas for all seeded keys.
- `SETTINGS_ENTITY_UUID` sentinel constant added to `lib/constants.ts` for use in `audit_logs.entity_id` when logging settings changes (since `settings.key` is TEXT, not UUID — see RULES.md §4.10).
- `rpc_order_confirm` and `rpc_return_complete` Postgres functions stubbed in migration (full implementation in Phase 14/Phase 19) with correct function signatures and empty bodies that can be replaced without a new migration.

**Dependencies**: Phase 3.

**Risks**: Enum/CHECK constraint mismatches between DB and Zod v4 schemas causing runtime validation errors — mitigate by centralizing enum definitions referenced by both (documented in RULES.md §2.5).

**Acceptance Criteria**: All tables exist with correct constraints/indexes; RLS policies verified via test queries for each role (anon/authenticated/admin); settings seed data is readable via `lib/settings/service.ts` typed getters.

---

## Phase 5 — Authentication Flows (Customer)

**Objective**: Build customer signup, login, logout, forgot/reset password.

**Deliverables**:
- `(auth)` route group: `/login`, `/signup`, `/forgot-password`, `/reset-password`.
- Server Actions for each flow with Zod v4 validation (`z.strictObject()`, `z.email()`) and rate limiting on login/signup/forgot-password via `lib/ratelimit/client.ts` (Upstash Redis, sliding window — provisioned in Phase 0).
- `/reset-password` Server Action includes role-aware redirect: after `supabase.auth.updateUser({ password })`, check `auth.uid() === ADMIN_USER_ID` server-side; redirect admin to `/admin/login`, redirect customer to `/login`.
- Session-aware navbar state (logged in vs guest).

**Dependencies**: Phase 3, Phase 0 (Upstash Redis and Resend provisioned).

**Risks**: Supabase password-reset emails — mitigated by Resend SMTP configured in Phase 1; test email delivery early.

**Acceptance Criteria**: A user can sign up, log in, log out, and reset a forgotten password end-to-end on staging; admin resetting password is redirected to `/admin/login`, customer to `/login`; rate limiting blocks >5 failed login attempts per minute from the same IP.

---

## Phase 6 — Authentication Flows (Admin) & Route Protection

**Objective**: Implement admin-only login and proxy-based route protection for `(admin)`.

**Deliverables**:
- `/admin/login` page (separate from customer login, not linked from public nav).
- `proxy.ts` updated to gate `(admin)` routes via session + `is_admin` check + `ADMIN_USER_ID` env var check (role check + identity check, belt-and-suspenders per TECHSPEC §3/§4).
- Forgot-password flow scoped/tested for the admin account (reuses Phase 5's shared flow; redirect to `/admin/login` per role-aware redirect).

**Dependencies**: Phase 3, Phase 5 (shares auth primitives).

**Risks**: `proxy.ts` misconfiguration exposing admin routes — mitigate with an automated test that hits `/admin/dashboard` unauthenticated and as a non-admin user, expecting redirects/403. Named export must be `export function proxy` (or default export) — `export function middleware` is deprecated in Next.js 16.

**Acceptance Criteria**: Only the single admin account can access `(admin)` routes; all other sessions (including authenticated customers) are redirected; automated test: non-admin cannot access `/admin/*`.

---

## Phase 7 — Design System Implementation

**Objective**: Implement DESIGN_SYSTEM.md as Tailwind v4 `@theme {}` tokens + Shadcn component overrides.

**Deliverables**:
- `globals.css` `@theme {}` block with all color tokens (OKLCH), spacing, radius, shadow, breakpoint, and typography scale from DESIGN_SYSTEM.md §2–§8.
- Shadcn UI components themed to ACE DÉCOR tokens (Button, Input, Card, Badge, Dialog, Accordion, Tabs, Table, `sonner` toasts etc.) using `new-york` style.
- Base layout components: Navbar, Footer, MobileNav.
- Storybook or a simple `/dev/components` preview route (optional but recommended) for visual QA.

**Dependencies**: Phase 0.

**Risks**: Design drift if components are styled ad hoc per page — mitigate by enforcing component reuse via code review (RULES.md). OKLCH token conversion must match DESIGN_SYSTEM.md hex values exactly — verify visually before proceeding.

**Acceptance Criteria**: A style-preview page renders all core components matching DESIGN_SYSTEM.md tokens; Navbar/Footer render correctly across breakpoints; no `framer-motion` imports exist — all animations use `motion/react`.

---

## Phase 8 — Storefront: Landing Page & Navigation

**Objective**: Build the landing page per DESIGN_SYSTEM.md §17 and Slide 1 wireframe.

**Deliverables**:
- `/` landing page: Navbar, Hero collage, "Shop by Category" grid (9 categories), Featured Products section, Trust strip, Footer.
- Category data fetched from `categories` table (active only).
- Responsive behavior verified mobile/tablet/desktop.
- `params` and `searchParams` accessed via `await` per Next.js 16 async API requirement (TECHSPEC §19).

**Dependencies**: Phase 2, Phase 7.

**Risks**: Hero imagery/content not yet available — use placeholder Scandinavian-style imagery that matches palette, replaceable later via `banners`/static assets.

**Acceptance Criteria**: Landing page renders correctly on 375px–1920px widths; category tiles link to correct category PLPs; Lighthouse mobile score baseline recorded.

---

## Phase 9 — Storefront: Product Listing (PLP) & Filters

**Objective**: Build category and search-driven product listing pages.

**Deliverables**:
- `/shop` (all products) and `/shop/[category]` pages.
- Filter UI (price range, variant/size, availability) and sort (price, newest).
- Product card component (per DESIGN_SYSTEM.md §11.1/§15) wired to real data.
- Pagination (cursor or offset-based).
- `search_vector` column added to `products` via migration; GIN index created; `pg_trgm` trigram GIN index on `products.name` created. **Two triggers required**: (1) on `products` row changes, (2) on `product_variants.name` changes — both call the same `tsvector` recomputation on the parent `products` row. Both triggers are required; a trigger on `products` alone leaves variant name edits producing stale search results.
- `params` accessed via `await` (Next.js 16 async API — TECHSPEC §19).

**Dependencies**: Phase 2, Phase 7, Phase 8.

**Risks**: Filter/sort combinations producing slow queries as catalog grows — mitigate with indexes from SCHEMA.md §6 and query review. `search_vector` trigger for variant name changes must cover `product_variants` table explicitly.

**Acceptance Criteria**: Filtering and sorting return correct, paginated results; stock status badges render correctly (In Stock / Only Few Left / Out of Stock) with no fake-discount elements present; a product name search returns relevant results; a misspelled search (e.g., "cushon cover") returns near-matches via trigram fallback.

---

## Phase 10 — Storefront: Product Detail Page (PDP)

**Objective**: Build the full-page product view per DESIGN_SYSTEM.md §16.

**Deliverables**:
- `/product/[slug]` page: gallery (3-4+ images), variant selector, price, stock status, quantity stepper, Add to Cart/Buy Now. `params` accessed via `await` (TECHSPEC §19).
- Reviews section (rendering seed reviews) and FAQ accordion.
- Share button (Web Share API + clipboard fallback).
- SEO: meta tags, Open Graph, JSON-LD Product schema.

**Dependencies**: Phase 2, Phase 9.

**Risks**: Variant-aware pricing/stock logic bugs (effective price/stock depends on `product_variants` vs `products`) — mitigate with unit tests on the pricing/stock utility (`lib/utils/pricing.ts`). Variant low-stock threshold is inherited from `products.low_stock_threshold` — no per-variant threshold (RULES.md §11.7).

**Acceptance Criteria**: PDP correctly reflects variant-specific price/stock when a variant is selected; Add to Cart respects available stock; JSON-LD validates via Google's Rich Results Test; `params` accessed asynchronously without runtime errors.

---

## Phase 11 — Cart (Guest Browsing & Authenticated Cart) and Login-Before-Checkout Import

**Objective**: Implement cart functionality with a simple guest cart and the login-before-checkout import flow (APPFLOW §6).

**Deliverables**:
- `/cart` page with line items, quantity edit, remove, subtotal.
- Simple guest cart stored client-side (cookie/local storage) as `{product_id, product_variant_id, quantity}[]` — no backend persistence, no cross-device sync (v1 scope per APPFLOW.md §6).
- Server Actions for authenticated `cart_items` CRUD.
- Single-pass cart import executed on login/signup when a redirect-to-checkout is pending (not a complex merge engine).

**Dependencies**: Phase 5, Phase 9/10 (product data).

**Risks**: Stock changing between add-to-cart and checkout — stock validation happens at payment verification via `rpc_order_confirm` (Phase 14), which is the single authoritative atomic check.

**Acceptance Criteria**: A guest can browse and build a local cart without logging in; clicking Checkout redirects to login/signup; after successful auth, the local cart is imported into server-side `cart_items` (quantities summed for any pre-existing matching line items) and the local cart is cleared.

---

## Phase 12 — Checkout Flow (Pre-Payment)

**Objective**: Implement address selection/entry and order summary review (APPFLOW §1, steps 5-6).

**Deliverables**:
- `/checkout` page: address list + "add new address" form (React Hook Form + Zod v4 — verify `@hookform/resolvers` supports Zod v4 minor version before writing form code), contact email/phone confirmation, order summary (subtotal, shipping fee, tax, total) computed from `lib/settings/service.ts` and cart contents.
- Server Action to create a `pending` order + `order_items` (with stock check at this step; clear messaging if insufficient). Note: the definitive, atomic stock check and decrement happens in `rpc_order_confirm` at Phase 14.
- Multi-step UI stepper per DESIGN_SYSTEM.md §13.

**Dependencies**: Phase 4, Phase 11.

**Risks**: Race conditions on stock between order creation and payment — resolved in Phase 14 via `rpc_order_confirm` atomic Postgres function; this phase creates a `pending` order only.

**Acceptance Criteria**: A `pending` order with correct `order_items` and computed totals is created; checkout blocks/clearly messages if an item's stock is clearly 0 at this step; all Zod v4 schemas use `z.strictObject()` and `z.email()` patterns.

---

## Phase 13 — Testing Infrastructure Setup

**Objective**: Establish the automated testing foundation **before** payment integration begins.

**Deliverables**:
- **Vitest** configured for unit/integration testing of: Server Action logic, pricing/stock utilities (`lib/utils/pricing.ts`), search query-builder (`lib/utils/search.ts`), return-eligibility logic, and the inventory-movement invariant helper (SCHEMA.md §3.17/§10.4).
- **Playwright** configured for end-to-end browser testing, with a baseline smoke suite covering: landing page load, category/PLP navigation, PDP add-to-cart, login/signup, and the (unauthenticated) checkout redirect-to-login behavior (per APPFLOW.md §6).
- **RLS test harness**: a repeatable test setup (using Supabase's local dev stack or a dedicated test project) that runs the RLS test matrix from SCHEMA.md §5.2 across `anon`/`authenticated`/`admin` roles for every table created so far (Phases 2–4) — this harness is reused and extended in every subsequent phase as new tables/policies are added.
- **CI integration**: `next build`, type-check, lint, Vitest, and the Playwright smoke suite run on every PR (per RULES.md §10 Build Gates), with the RLS test harness run at minimum on every migration-touching PR.
- **Test data/fixtures**: a seed/reset script for the staging Supabase project so Playwright/RLS tests run against a known, reproducible dataset.
- **PDF library spike**: prototype `@react-pdf/renderer` in a Netlify Function context to confirm it fits within bundle/startup limits. If it fails, evaluate `pdf-lib` as the fallback. Decision documented before Phase 15 begins.

**Dependencies**: Phases 0–12.

**Risks**: Setting this up too late would mean the riskiest code (payments, refunds, inventory, admin mutations) ships without test coverage discipline from the start — this is precisely why this phase is sequenced **before** Phase 14.

**Acceptance Criteria**: A PR that intentionally breaks a Server Action (e.g., removes a `requireAdmin()` guard) fails CI; a PR that breaks the checkout redirect fails CI via Playwright; the PDF library spike produces a working minimal invoice PDF deployed to a Netlify Function preview.

---

## Phase 14 — Razorpay Payment Integration

**Objective**: Implement the full payment lifecycle per TECHSPEC §8 and APPFLOW §4.

**Deliverables**:
- `/api/razorpay/create-order` Route Handler.
- Client-side Razorpay Checkout widget integration on `/checkout`.
- `/api/razorpay/verify-payment` Route Handler:
  - Uses `await req.text()` (raw body) for HMAC signature verification before any JSON parsing.
  - Calls `rpc_order_confirm` Postgres function via `supabase.rpc()` — atomically validates stock, decrements stock, inserts `inventory_movements` rows, updates `orders.status = 'confirmed'`, inserts `payments` row with `status = 'captured'`.
  - If `rpc_order_confirm` returns stock-insufficient: sets `orders.status = 'payment_failed'`, initiates Razorpay refund if payment was captured, surfaces clear error to customer.
- `rpc_order_confirm` Postgres function (migration): single atomic transaction for the above. Named `rpc_order_confirm` per RULES.md §1.7.
- `/api/razorpay/webhook` Route Handler (signature verification via raw body, idempotent reconciliation for `payment.captured`, `payment.failed`, `refund.processed`, `refund.failed`).
- `/checkout/success` page.

**Dependencies**: Phase 12, Phase 13.

**Risks**: Raw-body parsing for webhook/verify-payment signature verification — use `await req.text()` before any JSON parsing; this is a common source of Razorpay signature failures in Next.js. Razorpay test-mode vs live-mode key mismatches.

**Acceptance Criteria**: End-to-end test payment results in `orders.status='confirmed'`, `payments.status='captured'`, stock correctly decremented, `inventory_movements` row inserted — all in a single transaction; simulated webhook retries do not create duplicate rows; simulated stock-insufficient-at-verification results in `orders.status='payment_failed'` and Razorpay refund initiated; simulated payment failure leaves order in `payment_failed` with a retry path.

---

## Phase 15 — Order Confirmation Notifications & Invoice Generation

**Objective**: Send order confirmation and status-update emails, and implement server-side invoice PDF generation.

**Deliverables**:
- **`lib/notifications/resend.ts`** implemented: Resend API client, typed `sendEmail(to, subject, html)` helper, and email-sending functions per notification type (Order Placed, Order Shipped, Order Delivered, Return Approved/Rejected — per PRD §14.2).
- Email templates styled with ACE DÉCOR brand voice (premium, warm, minimal — no marketplace styling).
- All notification triggers wired into corresponding Server Actions/webhook handlers — sending is fire-and-forget (failures logged, never block the business operation per PRD §14.4).
- **Invoice PDF generation** (`/api/invoice/[orderId]`): using the library confirmed in Phase 13 spike (`@react-pdf/renderer` or `pdf-lib`), generate on-demand invoices from `order_items` snapshots + `orders` totals + `addresses` + `settings` brand details. `Content-Type: application/pdf`, `Content-Disposition: attachment`.
- Order Confirmed email includes a link to `GET /api/invoice/[orderId]` (not a PDF attachment).

**Dependencies**: Phase 14, Phase 13 (PDF library spike resolved).

**Risks**: Email delivery failures must not block order confirmation — confirmed by fire-and-forget architecture. Resend API key must be valid and domain verified (provisioned in Phase 0, SMTP configured in Phase 1).

**Acceptance Criteria**: Placing a test order results in a confirmation email sent via Resend (verifiable in Resend dashboard/staging inbox); admin order-status changes trigger corresponding emails; generated invoice PDF for a test order correctly shows order number, items, quantities, unit prices, totals, shipping address, and ACE DÉCOR brand details.

---

## Phase 16 — Customer Account Area

**Objective**: Build `/account` (profile, addresses, order history, order detail, returns).

**Deliverables**:
- `/account` profile page (view/edit name, phone).
- `/account/addresses` (CRUD, set default). Note: deleting an address referenced by a historical order is blocked by `ON DELETE RESTRICT` FK — surface a clear error message, not a silent failure.
- `/account/orders` (list with status) and `/account/orders/[id]` (detail, items, status, return-eligibility check, **"Download Invoice" button** linking to `/api/invoice/[orderId]`). Show `tracking_number` and "Track Your Order" link (`tracking_url`) if set on the order.
- `/account/returns` — initiate return request for eligible delivered items (per `settings.return_window_days` via `lib/settings/service.ts`).
- `params` accessed via `await` per Next.js 16 async API requirement (TECHSPEC §19).

**Dependencies**: Phase 5, Phase 14.

**Risks**: Return-eligibility logic must correctly reference `orders.delivered_at` + `settings.return_window_days` — covered by unit tests (Phase 13).

**Acceptance Criteria**: Customer can view/edit profile and addresses, view order history/detail (with invoice download and tracking link if available), and submit a return request for an eligible delivered order item; ineligible items show a clear reason (e.g., "Return window closed").

---

## Phase 17 — Reviews (Submission + Seed Content)

**Objective**: Enable verified-purchase review submission and populate seed reviews.

**Deliverables**:
- Server Action for review submission with verified-purchase validation (APPFLOW §8). Zod v4 schema using `z.strictObject()`.
- Seed migration/script inserting 10–15 `is_seed=true` reviews across initial products (per PRD §12 note). Seed reviews have `reviewer_name` populated with representative names (not null).
- PDP review list with pagination and rating summary.

**Dependencies**: Phase 10, Phase 16.

**Risks**: Seed reviews being mistaken for ongoing "fake reviews" — mitigated by the `is_seed` flag; admin UI must clearly label seed reviews (Phase 20).

**Acceptance Criteria**: A customer with a `delivered` order can submit exactly one review per purchased line item; seed reviews render correctly on PDP and are flagged with an `is_seed` indicator in the admin Reviews view.

---

## Phase 18 — Admin Console: Dashboard, Categories, Products

**Objective**: Build the admin shell and core catalog management.

**Deliverables**:
- `(admin)` layout (sidebar, top bar) per DESIGN_SYSTEM.md §18.
- `/admin/dashboard` with stat cards + revenue-over-time chart (initially using available order/payment data).
- `/admin/categories` CRUD.
- `/admin/products` list (with "Archived" filter tab per RULES.md §19.3), `/admin/products/new`, `/admin/products/[id]/edit` — including image upload (Supabase Storage), variant management, pricing/stock, SEO fields, status (`draft`/`active`/`archived`).
- Product management UI exposes `active` / `draft` / `archived` status transitions but **no hard-delete action** — archive is the only removal action (RULES.md §19). No `DELETE FROM products` action is accessible from the admin UI.
- `params` accessed via `await` (TECHSPEC §19).

**Dependencies**: Phase 6, Phase 7, Phase 2.

**Risks**: Image upload UX complexity (multi-image reorder/primary selection) — scope a straightforward numbered-order approach rather than a complex DnD library if time-constrained.

**Acceptance Criteria**: Admin can create a full product (with images, variants, SEO fields) and it appears correctly on the storefront once `status='active'`; archiving a product removes it from all storefront listings on next revalidation; price/stock edits write `audit_logs` entries; no hard-delete button is present or accessible.

---

## Phase 19 — Admin Console: Orders, Payments, Returns

**Objective**: Build order management, payments view, and returns workflow.

**Deliverables**:
- `/admin/orders` list (filters: status, date range, search) and `/admin/orders/[id]` detail with status-transition controls (per Order Lifecycle state diagram) and a **"Download Invoice"** action (reuses Phase 15 invoice module). When transitioning to `shipped`: optional `tracking_number` (text input) and `tracking_url` (URL input) fields; saved to `orders` in the same Server Action that updates `orders.status = 'shipped'` and sets `orders.shipped_at = now()`.
- `/admin/payments` — transaction list + revenue-over-time chart (Recharts) using `payments`/`orders` data.
- `/admin/returns` — list, detail, approve/reject, and "Trigger Refund" action calling Razorpay Refunds API. `rpc_return_complete` Postgres function (migration): atomically updates `returns.status = 'completed'`, updates `payments.status = 'refunded'` + sets `razorpay_refund_id`, optionally restocks inventory if item is resellable — single atomic transaction.
- `params` accessed via `await` (TECHSPEC §19).

**Dependencies**: Phase 14, Phase 18.

**Risks**: Refund API errors (e.g., partial refunds, already-refunded payments) — mitigate with clear `refund_failed` state and admin-facing error messages requiring manual follow-up.

**Acceptance Criteria**: Admin can transition an order through its full lifecycle; when marking shipped, optional tracking fields are saved and appear in the customer's order detail and in the "Order Shipped" email; payments chart reflects real captured payments; a test return request can be approved and refunded end-to-end in Razorpay test mode, updating `returns.status='completed'` and `payments.status='refunded'` atomically.

---

## Phase 20 — Admin Console: Reviews, Banners, FAQs, Settings, Reports

**Objective**: Complete remaining admin modules.

**Deliverables**:
- `/admin/reviews` — moderation queue (approve/hide/delete); seed reviews (`is_seed = true`) are visually flagged with a "Seed" badge to distinguish them from real reviews — admin can hide or delete seed reviews individually via the existing moderation actions (no separate retirement flow per PRD §12).
- `/admin/banners` — CRUD with image upload, schedule (`starts_at`/`ends_at`), active toggle.
- `/admin/faqs` — CRUD.
- `/admin/settings` — edit `settings` key-value entries (policies, shipping fee, return window, contact info, low-stock threshold, WhatsApp settings). All reads/writes go exclusively through `lib/settings/service.ts` — raw JSONB never consumed by UI or business logic (RULES.md §18). Settings Server Action validates all incoming values through Zod v4 schemas in `lib/validation/settings.schema.ts` before persistence. Invalid values (e.g., `return_window_days = "seven"`) return a validation error and are never written to the database.
- **`lib/settings/service.ts` implemented**: typed getter/setter functions for all settings groups (`getShippingSettings()`, `getContactSettings()`, `getWhatsAppSettings()`, `getReturnWindowDays()`, etc.).
- `/admin/reports` — CSV/Excel export of orders, payments, and a PnL-style summary (revenue, refunds, net) for a selected date range.

**Dependencies**: Phase 18, Phase 19.

**Risks**: Export performance for large date ranges — mitigate with server-side streaming/pagination for export generation if catalog/order volume grows.

**Acceptance Criteria**: All four admin modules are functional; a generated report export opens correctly in Excel/Sheets with accurate totals; setting an invalid value via the settings editor returns a validation error and does not persist; seed reviews are clearly badged in the moderation queue.

---

## Phase 21 — SEO, Performance & Accessibility Hardening

**Objective**: Pass production-readiness checks for SEO, performance, and accessibility.

**Deliverables**:
- `sitemap.xml` and `robots.txt` (dynamic, reflecting active products/categories; `sitemap.ts` using Next.js 16's async `id` param per TECHSPEC §19).
- JSON-LD for Product, BreadcrumbList, FAQPage, Organization.
- Image optimization audit (`next/image`, responsive sizes) across landing/PLP/PDP.
- Accessibility audit against DESIGN_SYSTEM.md §14 (contrast, focus states, alt text, semantic structure) using automated (axe) + manual checks.
- Lighthouse CI thresholds defined and met (Performance, SEO, Accessibility, Best Practices ≥ 90 on mobile for key pages).
- **SEO slug audit**: verify every `products.slug` follows the descriptive, hyphenated convention defined in PRD §15.9 (e.g., `elastic-bedsheet-floral-blue`, not auto-generated IDs/codes) and that PDP URLs (`/product/[slug]`) resolve correctly.
- **Floating WhatsApp button** (optional, admin-configurable per PRD §16): site-wide floating action button using `settings.whatsapp_number`; hidden entirely if `settings.whatsapp_enabled = false` or the number is unset; animated entrance via `motion/react` subtle scale-in.

**Dependencies**: Phases 8-20 (content/pages must exist).

**Risks**: Large hero images tanking LCP — mitigate with proper `next/image` priority loading and modern formats (WebP/AVIF). `sitemap.ts` must use `await id` per Next.js 16 async API requirements (TECHSPEC §19).

**Acceptance Criteria**: Lighthouse mobile scores meet thresholds on Landing, PLP, and PDP; axe reports no critical violations; sitemap includes all active products/categories; no archived/draft products appear in sitemap.

---

## Phase 22 — Security Hardening & Penetration-Style Review

**Objective**: Validate the security posture defined in TECHSPEC §10 and PRD §9 before launch.

**Deliverables**:
- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) configured and verified.
- RLS policy review/test suite covering every table and role combination from SCHEMA.md §5.
- Rate limiting verified on auth, checkout-initiation, review submission, and webhook endpoints (all via Upstash Redis / `lib/ratelimit/client.ts`).
- Manual review: ensure `SUPABASE_SECRET_KEY` is never referenced in any client-bundled code (grep/build audit). The old variable name `SUPABASE_SERVICE_ROLE_KEY` must not appear anywhere in the codebase.
- Dependency vulnerability scan (`npm audit` / GitHub Dependabot) resolved for high/critical issues.
- **Backup & disaster recovery verification**: confirm Supabase automated backups are enabled on the production project (paid plan), document the recovery procedure (TECHSPEC §18), and perform at least one test restore on the staging project to confirm the procedure works.

**Dependencies**: All prior phases (full surface area must exist).

**Risks**: Discovering a structural RLS gap late — mitigated by RLS test suite being written incrementally per phase (Phases 2-4). A backup that has never been test-restored is not a reliable backup — the test restore on staging is **mandatory**.

**Acceptance Criteria**: No critical/high security findings remain open; security headers verified via an external header-check tool; RLS test suite passes for all roles/tables; a documented test restore from a Supabase backup has been successfully performed on staging; no references to deprecated key names (`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `middleware.ts`) exist in the codebase.

---

## Phase 23 — Staging UAT & Content Population — ✅ Complete (code-side; see status note)

**Objective**: Populate real content and conduct User Acceptance Testing on staging.

**Deliverables**:
- All 9 categories populated with real products, images, descriptions, variants, and pricing (replacing placeholders).
- Real policy text (Shipping, Returns, Privacy, Terms) entered via `/admin/settings`.
- Real FAQ content entered.
- End-to-end UAT script executed covering every flow in APPFLOW.md (customer + admin) on staging with Razorpay test mode.

**Status note**: all 9 categories are populated with 36 real products (names/descriptions/pricing/variants) — images are placeholder graphics pending DK's real product photography (upload pipeline already built, Phase 18). Real policy text was written and seeded directly via migration (equivalent outcome to entering it through `/admin/settings`, which remains the tool for any future edits). FAQ content was already real as of the Phase 1 seed. `docs/UAT_SCRIPT.md` was authored covering every APPFLOW.md flow, but its actual *execution* requires a live staging deployment and business sign-off that don't exist in this sandbox — see `PROJECT_STATUS.md` "Manual Setup Remaining" #11-12. A critical pre-existing admin-routing bug (R12) and a build-breaking dead export (R13) were discovered and fixed in this phase — see `PHASE_SUMMARY.md`.

**Dependencies**: Phases 18-22.

**Risks**: Content gaps (missing images/descriptions) discovered late — track via a content checklist per product/category.

**Acceptance Criteria**: UAT script fully passes on staging with no critical defects; stakeholder (business owner/admin) sign-off obtained.

---

## Phase 24 — Production Cutover & Launch

**Objective**: Go live on production domain with live Razorpay credentials.

**Deliverables**:
- Production Supabase project finalized (migrations applied, RLS verified, admin account provisioned, `ADMIN_USER_ID` set in Netlify production env vars).
- Production Razorpay account activated (live keys, live webhook configured and verified).
- Custom domain configured on Netlify with HTTPS.
- Final smoke test on production: place a small real order end-to-end to confirm payment → order → email flow.
- Monitoring/error-tracking confirmed active (per TECHSPEC §12).

**Dependencies**: Phase 23.

**Risks**: Live Razorpay webhook misconfiguration (different URL/secret than staging) — mitigate with a pre-launch checklist verifying all production environment variables and webhook URLs.

**Acceptance Criteria**: Production site is live on the custom domain; a real end-to-end order/payment completes successfully; admin can log in and see the order in `/admin/orders` and `/admin/payments`.

---

## Phase 25 — Post-Launch Stabilization & Handover

**Objective**: Stabilize, document operational runbooks, and hand over to the business owner/admin.

**Deliverables**:
- Operational runbook: how to add/edit/archive products, process orders, handle returns, export reports, update settings/policies, rotate Razorpay/Supabase keys if needed, retire seed reviews via the admin moderation interface.
- Bug-fix backlog from first 1-2 weeks of live usage triaged and addressed.
- Final review of TRACKER.md — all phases marked complete; remaining items moved to a "Future Opportunities" backlog (per PRD §11).

**Dependencies**: Phase 24.

**Risks**: Knowledge concentrated in development team only — mitigate by ensuring the runbook is written for a non-technical admin user, matching the PRD persona (Section 3.4).

**Acceptance Criteria**: Admin (business owner) can independently perform all routine operations using only the admin console and runbook, without developer assistance, for at least one full order cycle.
