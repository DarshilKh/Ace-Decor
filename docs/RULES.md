> ⚠️ **SUPERSEDED (2026-07-27, Phase 26):** This document describes the original Supabase-backed ecommerce architecture (database, admin panel, checkout, or similar) and does **not** reflect the current codebase. As of Phase 26, the site is fully static — no database, no admin panel, no authentication of any kind. See `HANDOFF.md` and `docs/PROJECT_STATUS.md` for the current architecture. Kept here for historical reference only.

---

# Development Rules (RULES)
## ACE DÉCOR — Strict Engineering Standards

**Document Status:** Source of Truth — v2.0
**Scope**: These rules are mandatory for all contributors (human or AI) working on the ACE DÉCOR codebase. Any deviation requires an explicit, documented exception approved by the project owner.

> **⚠ ERRATUM (2026-07-05):** every `proxy.ts` reference below means
> `src/proxy.ts` — see TECHSPEC.md's erratum for why the location (not just
> the filename) matters, and what broke because of it.

---

## 1. Architecture Rules

1. The application is a **single Next.js 16 App Router project**. Do not split storefront and admin into separate apps/repos — they share the design system, auth, and database layer.
2. All data mutations go through **Server Actions** (`actions/`) or **Route Handlers** (`app/api/`) for third-party integrations/webhooks. Client components must never call Supabase directly for writes.
3. All data reads in Server Components use the server Supabase client (`lib/supabase/server.ts`); client components fetch data only via props/Server Actions, not direct browser Supabase calls, except for narrowly scoped real-time/interactive cases explicitly reviewed (e.g., live cart count) — and even then, reads must respect RLS via the anon/authenticated client, never the secret key.
4. The **secret key** (`SUPABASE_SECRET_KEY`, replacing legacy `SUPABASE_SERVICE_ROLE_KEY`) is used **only** in: (a) the Razorpay webhook handler, (b) the admin reports/export module, and (c) one-time seed/migration scripts. It must never appear in any file under `app/(storefront)/`, `app/(auth)/`, `components/`, or any client-bundled module.
5. Folder structure (TECHSPEC.md §2) is authoritative. New domains get a new file in `actions/`, `lib/validation/`, and corresponding route folder — do not create ad-hoc top-level directories.
6. Business rules from PRD.md (single admin, no coupons, no fake discounts, etc.) are **architectural constraints**, not just UI guidelines — do not add database columns, admin UI fields, or Server Actions that would enable excluded features (e.g., a `discount_percent` column on `products`).
7. **Any operation that must atomically update more than one table** (e.g., order confirmation, return completion + stock restock) must be implemented as a Postgres function invoked via `supabase.rpc()`, not as sequential Server Action calls. Sequential calls are not atomic and violate the inventory consistency invariant (APPFLOW.md §10.4). Convention: RPC functions named `rpc_<domain>_<action>` (e.g., `rpc_order_confirm`, `rpc_return_complete`), defined in `supabase/migrations/`.
8. **Upstash Redis is the sole rate-limiting backend.** `lib/ratelimit/` is the only sanctioned integration point — no route may call `@upstash/ratelimit` directly outside this module.

---

## 2. Coding Rules

1. Prefer **Server Components** by default; add `"use client"` only when interactivity (state, effects, event handlers, browser APIs) is required.
2. Keep components small and single-purpose. A component file exceeding ~200 lines is a signal to extract subcomponents.
3. No business logic in JSX/UI components — extract to `lib/utils/` or `actions/`. Components should primarily handle presentation and user interaction wiring.
4. All currency values are formatted via a single shared utility (`lib/utils/format.ts`) — never hand-format `₹` strings inline, to keep formatting consistent and locale-correct.
5. No magic strings for enums (order status, payment status, roles, etc.). Define them once as TypeScript `const` arrays/enums in `lib/constants.ts`, mirrored exactly by the Postgres `CHECK` constraints in SCHEMA.md and the Zod v4 enums in `lib/validation/`.
6. Dead code, commented-out blocks, and `console.log` debugging statements must not be merged. Use the structured logger (TECHSPEC §11) for anything that needs to persist.
7. Every Server Action returns a consistent shape: `{ success: true, data }` or `{ success: false, error: string }`. Never throw raw errors across the Server Action boundary to client components.
8. **Async request APIs**: Next.js 16 requires `await cookies()`, `await headers()`, `await params`, `await searchParams` in all pages, layouts, and Route Handlers. Synchronous access to these APIs throws a runtime error (TECHSPEC §19).

---

## 3. TypeScript Rules

1. `strict: true` in `tsconfig.json` — no exceptions. `any` is disallowed except in clearly justified, narrowly-scoped, commented cases (e.g., third-party library typing gaps), and must be reviewed.
2. All Supabase database types are generated (`supabase gen types typescript`) and committed to `lib/supabase/types.ts`; regenerate after every schema migration. Do not hand-write types that duplicate the generated schema types — extend/compose them instead.
3. All Server Action inputs and outputs have explicit TypeScript types, derived from their corresponding Zod v4 schemas via `z.infer<>` — single source of truth for shape (Zod schema), not duplicated interfaces.
4. No implicit `any` in function signatures, callbacks, or destructured props.
5. Shared domain types (e.g., `Product`, `OrderStatus`, `CartItem`) live in `types/` and are imported, not redefined, across modules.

---

## 4. Database Rules

1. Every schema change is a new, timestamped SQL migration file under `supabase/migrations/`. Never edit a previously-applied migration file — write a new migration to alter/correct.
2. **RLS must be enabled in the same migration that creates a table.** A table is never deployed without RLS policies, even temporarily ("RLS later" is prohibited).
3. Every foreign key has an explicit `ON DELETE` behavior (`RESTRICT` or `CASCADE`) chosen deliberately per SCHEMA.md — no implicit defaults left unconsidered.
4. Enum-like columns use `CHECK` constraints with values that exactly match `lib/constants.ts` and Zod v4 enums. Any change to an enum's allowed values requires updating all three locations in the same change.
5. The `one_admin_only` partial unique index on `users` (SCHEMA.md §3.1) must never be removed or weakened without an explicit, documented decision to support multi-admin (out of scope for v1).
6. Money columns are always `NUMERIC(10,2)`, never `FLOAT`/`REAL`/`DOUBLE`.
7. All list-returning queries (admin orders, PLP, payments, reports) must be paginated — no unbounded `SELECT *` queries against tables expected to grow (`orders`, `order_items`, `payments`, `audit_logs`, `products`).
8. `order_items` fields are immutable snapshots (`product_name_snapshot`, `unit_price_snapshot`) — never join to live `products`/`product_variants` for historical order display; always use the snapshot.
9. Seed/demo data (categories, FAQs, seed reviews, settings defaults) is inserted via migrations or clearly-named seed scripts, never manually via the Supabase dashboard in a way that isn't reproducible.
10. The `audit_logs.entity_id` column is `UUID`. For `settings` table actions (where the PK is `TEXT`), store the settings key string in `old_values`/`new_values` JSONB and use a fixed sentinel UUID (defined in `lib/constants.ts` as `SETTINGS_ENTITY_UUID`) for `entity_id`. This sentinel is documented in `lib/constants.ts` so it is never confused with a real entity UUID.

---

## 5. API Rules

1. Every Server Action and Route Handler input is validated with a **Zod v4** schema using `z.strictObject({})` (Zod v4 replaces the deprecated `.object().strict()` pattern) to reject unknown keys before any database operation. Use top-level format validators — `z.email()`, `z.url()`, `z.uuid()` — not the deprecated `z.string().email()` chain. Use `{ error: "..." }` for custom error messages, not `{ message: "..." }` (deprecated in Zod v4). Use `.issues` not `.errors` on `ZodError` objects.
2. Every Server Action begins with the appropriate guard: `requireUser()` for authenticated-customer actions, `requireAdmin()` for admin actions. Public/anon actions (e.g., reading active products) do not need a guard but must rely on RLS for read scoping.
3. Route Handlers that receive webhooks (`/api/razorpay/webhook`) **must** verify the provider's signature before processing the payload, and must be idempotent (safe to receive the same event twice). For Razorpay webhooks, call `await req.text()` (not `req.json()`) to obtain the raw body for HMAC verification before parsing.
4. Razorpay order creation (`/api/razorpay/create-order`) must always compute the amount **server-side** from the `orders`/`order_items` data already persisted — never trust an amount passed from the client.
5. No endpoint returns raw database error messages or stack traces to the client. Log details server-side; return a generic, user-safe error message.
6. Rate limiting is mandatory on: `/login`, `/signup`, `/forgot-password`, `/api/razorpay/create-order` (checkout initiation), and review-submission Server Actions — implemented via `lib/ratelimit/client.ts` (Upstash Redis, sliding window). See RULES.md §1.8.
7. Any new third-party integration (email provider, analytics, etc.) must be wrapped in a `lib/<provider>/` module with a narrow interface — no direct SDK calls scattered across the codebase.

---

## 6. UI Rules

1. All new UI must conform to DESIGN_SYSTEM.md tokens (colors, spacing, radius, shadows, typography) — no hardcoded hex colors, pixel values outside the spacing scale, or ad-hoc font sizes in component code.
2. Mobile-first: build and test the 375px layout first, then enhance for `md`/`lg`/`xl`.
3. **Prohibited UI patterns** (enforced strictly, per PRD business rules):
   - Strike-through original prices / "% OFF" badges.
   - Countdown timers, "flash sale" banners, fake urgency messaging.
   - Coupon code input fields.
   - Loyalty points/rewards displays.
   - Bank offer / credit card promo banners.
   - Marketplace-style multi-CTA stacked banners on the landing page.
4. Product cards must always show: image, name, price, stock status, Add to Cart — and nothing that violates Rule 3.
5. All forms use **React Hook Form + Zod v4** with inline validation errors; no `alert()`-based validation feedback. Verify `@hookform/resolvers` version supports Zod v4 (check for TypeScript overload compatibility with Zod 4.3.x+) before writing any form code.
6. Loading states use skeleton placeholders matching the final layout (no layout shift on data arrival) — particularly for product grids and admin tables.
7. Animations use the **Motion** package (`motion/react` import path) — install as `motion`, not `framer-motion` (deprecated alias). Animations are subtle (150–300ms, opacity/scale ≤ 1.05) and must respect `prefers-reduced-motion`.
8. Every image (`<Image>`) requires an `alt` attribute sourced from `product_images.alt_text` or an equivalent admin-entered field — never empty/placeholder alt text for meaningful images.

---

## 7. Security Rules

1. No secret keys (`RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_SECRET_KEY`) are ever referenced in any file imported by a client component, or in any `NEXT_PUBLIC_*` variable.
2. `ADMIN_USER_ID` is a **server-only** environment variable — never prefixed `NEXT_PUBLIC_`, never logged, never returned in any API response. It must be present in every environment (staging, production) before deploying any build that includes `(admin)` routes. A missing `ADMIN_USER_ID` must cause `requireAdmin()` to throw (fail closed, not fail open — if the variable is absent, no request is granted admin access).
3. All admin-only routes are protected at proxy (`proxy.ts`) AND Server Action/Route Handler level AND RLS level (defense in depth — see TECHSPEC §4). A code review must confirm all three layers exist for any new admin feature.
4. Payment confirmation is never based solely on a client-side success callback. Order status only becomes `confirmed` after server-side signature verification (and is reconciled by webhook).
5. Refunds are only triggered via the admin Returns workflow (server-side), never directly callable from any customer-facing surface.
6. File uploads (product images, banners) are validated server-side for MIME type and size before storage, and stored with server-generated filenames.
7. User-supplied rich text (product descriptions) is sanitized with an allow-list HTML sanitizer before storage and again before rendering (defense in depth against stored XSS).
8. Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) are defined in a single shared config (e.g., `next.config.ts` headers) — not duplicated/diverging per route.
9. Any new environment variable must be added to `.env.example` (with placeholder, no real value) and documented with whether it is server-only or public.

---

## 8. Git Rules

1. **Branching**: `main` is production-deployable at all times. Feature work happens on `feature/<short-description>` branches, merged via pull request.
2. **Commit messages**: Use conventional, descriptive messages (e.g., `feat(checkout): add address selection step`, `fix(admin): correct stock threshold calculation`). No commits with messages like "wip" or "fix" merged to `main`.
3. **Migrations**: Database migration files are committed in the same PR as the code that depends on them; migrations are never squashed/rewritten after merge to `main`.
4. **Secrets**: `.env*` files (other than `.env.example`) are gitignored and never committed, including in history.
5. **PR Review**: Every PR touching `actions/`, `app/api/`, `proxy.ts`, or `supabase/migrations/` requires review against the relevant sections of this RULES.md (Security, Database, API rules) before merge.
6. **No direct pushes** to `main` — all changes via PR, even for the sole developer, to preserve a reviewable history and enable CI checks (build, lint, type-check) to run before merge.

---

## 9. Testing Rules

1. **RLS Tests**: For every table in SCHEMA.md, automated tests verify that `anon`, `authenticated` (non-owner), `authenticated` (owner), and `admin` roles get the expected access (per SCHEMA.md §5.2 table). These tests are written incrementally as each table is created (Phases 2-4) and re-run in CI.
2. **Server Action Unit Tests**: Critical business logic (pricing/stock calculation, return-eligibility check, order-total computation, cart merge logic) has unit tests covering edge cases (zero stock, variant overrides, expired return window, etc.).
3. **Payment Flow Tests**: Razorpay integration is tested against Razorpay's test mode for: successful payment, failed payment, duplicate webhook delivery (idempotency), stock-insufficient-at-verification (results in `payment_failed` + refund), and refund flow — before any production credential is configured.
4. **Accessibility Tests**: Automated `axe` checks run on Landing, PLP, PDP, Cart, Checkout, and key Admin pages as part of CI or a pre-release checklist; no critical violations allowed.
5. **Visual/Responsive QA**: Every new storefront page is manually checked at 375px, 768px, and 1280px+ widths before merge.
6. **Regression Checklist**: Before each production deploy, the APPFLOW.md customer and admin flows are smoke-tested on staging (login, browse, add to cart, checkout+payment in test mode, admin order status update).

---

## 10. Deployment Rules

1. **Environments**: `production` (main branch + production Supabase + live Razorpay) and `preview/staging` (PR previews + staging Supabase + Razorpay test mode) are kept strictly separate — staging must never use live Razorpay keys or the production Supabase project.
2. **Environment Variables**: Managed exclusively via the Netlify dashboard per environment; `.env.example` is the documentation of record for what must be configured. `.env.example` must include all of: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_USER_ID`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `RESEND_API_KEY` — with placeholder values and comments describing each (server-only vs public). Any new required env var must be added to `.env.example` in the same PR that introduces the usage.
3. **Migrations on Deploy**: Database migrations are applied to the target Supabase project (via Supabase CLI/CI step) **before** the corresponding application code is deployed, to avoid the app referencing tables/columns that don't yet exist.
4. **Build Gates**: A deploy is blocked if `next build`, type-checking, or linting fails. No "fix it after deploy" merges. Pin Next.js to `16.2.9` minimum — versions below `16.2.6` have patched security vulnerabilities.
5. **Rollback Plan**: Netlify's deploy history allows instant rollback to a previous build; any migration that is difficult to reverse (e.g., destructive column drops) is flagged in its PR description with a documented rollback procedure.
6. **Post-Deploy Verification**: After any production deploy touching checkout/payment code, a test transaction (Razorpay test mode on staging, or a minimal live transaction on production if necessary) is performed to confirm the payment pipeline is intact.
7. **Domain/SSL**: Managed via Netlify; HTTPS is enforced for all environments, including previews.

---

## 11. Inventory Rules

1. **No silent stock changes**: Every change to `products.stock_quantity` or `product_variants.stock_quantity` — regardless of cause (sale, return, restock, manual adjustment) — must create a corresponding `inventory_movements` record (SCHEMA.md §3.17) in the **same database transaction** as the stock update. A code path that updates stock without writing an `inventory_movements` row is a bug, not a shortcut.
2. **Correct `change_type`**: Use `sale` for order-confirmation-driven decrements, `return` for restocks resulting from a completed return, `restock` for new inventory arrivals, and `manual_adjustment` for any correction/write-off. Do not reuse `manual_adjustment` for flows that should use `sale`/`return`/`restock`.
3. **Every manual inventory update must be logged twice**: once in `inventory_movements` (the stock ledger entry — what changed and why) and once in `audit_logs` with `action_type = 'inventory.changed'` (the admin accountability entry — who changed it, when, from where). See Inventory Flow (APPFLOW.md §10) for the canonical sequence.
4. **`manual_adjustment` requires a reason**: The `reason` field on `inventory_movements` is mandatory (non-empty) for `manual_adjustment` entries; Server Actions must validate this with Zod v4 before persisting.
5. **Invariant enforcement**: `quantity_changed` must always equal `quantity_after - quantity_before`. Server Actions computing inventory movements must derive `quantity_after` from `quantity_before + quantity_changed` (or vice versa) — never write inconsistent values, and rely on the SCHEMA.md `CHECK` constraint as a backstop, not the primary safeguard.
6. **Low-stock alerting is driven by the same transaction**: The Low Stock Alert notification (PRD §14.3) check happens immediately after the stock update/`inventory_movements` insert, within the same flow — not via a separate polling job, to avoid delayed alerts.
7. **Variant low-stock threshold is inherited from the parent product**: `product_variants` have no independent `low_stock_threshold` in v1. All variant-level low-stock comparisons use `products.low_stock_threshold` via a join. No code path may hardcode a threshold value or read it from anywhere other than `products.low_stock_threshold` for both product-level and variant-level stock checks.

---

## 12. Audit Rules

1. **Critical admin actions must generate `audit_logs` rows.** "Critical" includes, at minimum, every action type listed in SCHEMA.md §3.16: `product.created`, `product.updated`, `product.deleted`, `product.price_changed`, `inventory.changed`, `order.status_changed`, `banner.updated`, `settings.updated`.
2. **No critical business action should occur without traceability.** If a new admin-facing mutation is added that materially changes customer-visible data (pricing, stock, order status, published content) or store configuration, it must be added to the `action_type` enum (SCHEMA.md §3.16 and `lib/constants.ts`) and write an `audit_logs` row as part of its Server Action — this is a required step in the PR checklist (Git Rules §8.5), not an optional enhancement.
3. **Capture before/after state**: `old_values`/`new_values` JSONB columns should contain only the fields that actually changed (a diff), not a full-row dump, to keep entries readable and storage-efficient.
4. **Capture IP address**: Server Actions/Route Handlers performing audited admin mutations must extract the request IP (where available from the Netlify/Next.js request context) and persist it to `audit_logs.ip_address`.
5. **`audit_logs` is append-only**: No Server Action or admin UI may update or delete rows in `audit_logs`. If a correction is needed, a new row documenting the correction is added — the history itself is never edited.
6. **Read access**: `audit_logs` is readable only by the admin (per SCHEMA.md §5.2 RLS policy); there is no customer-facing surface for audit data.

---

## 13. SEO Rules

1. **Every product page (PDP) must support**:
   - **Metadata**: a unique `<title>` and meta description, following the patterns in PRD.md §15.2/§15.3 (with `products.meta_title`/`products.meta_description` overrides where set).
   - **Structured Data**: a Product JSON-LD block (PRD.md §15.1) generated server-side from the same data rendered on the page — never a divergent/duplicated data source.
   - **Canonical URL**: a `<link rel="canonical">` pointing to the PDP's own clean `/product/[slug]` URL (PRD.md §15.4).
2. Every category/PLP page must emit Breadcrumb structured data and a canonical URL that ignores filter/sort query parameters (PRD.md §15.4).
3. The FAQ page (and any PDP sections rendering `faq_items`) must emit FAQ structured data (PRD.md §15.1).
4. `sitemap.xml` and `robots.txt` must stay in sync with publish state: a product moving from `active` to `draft`/`archived` must be removed from the sitemap on the next regeneration, and `(admin)`/`(auth)`/`/account/*`/`/cart`/`/checkout`/`/api/*` must remain disallowed in `robots.txt` (PRD.md §15.5/§15.6).
5. OpenGraph and Twitter Card tags are derived from the same title/description/image data as standard meta tags — no separate content-entry step for social sharing metadata (PRD.md §15.7/§15.8).
6. **Product slugs must follow the descriptive, hyphenated, keyword-rich convention** defined in PRD.md §15.9 (e.g., `elastic-bedsheet-floral-blue`). Opaque ID-based slugs (e.g., `/product/123`) are prohibited. Zod v4 validation on the admin product form must enforce the pattern `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`.
7. **Slugs are immutable once a product is published** (`status = 'active'`). If a slug must change after publication (exceptional, not routine), a 301 redirect from the old slug to the new one must be configured in `next.config.ts` (permanent redirect, not a soft delete) — the old PDP route must never return 404. Any slug change on a published product requires a corresponding `audit_logs` entry and is noted in the PR description.
8. New page types (e.g., a future blog or lookbook section) must follow this same checklist (metadata, structured data where applicable, canonical URL, sitemap inclusion) before being considered launch-ready.

---

## 14. Media Rules

1. **Optimized**: All product, category, and banner images are compressed at upload time to the target quality/dimensions defined in TECHSPEC §16.6 before being stored in Supabase Storage — never store unoptimized, multi-megabyte originals as the canonical asset.
2. **Responsive**: Every rendered image uses `next/image` with appropriate `sizes`/`srcset` covering the breakpoints in DESIGN_SYSTEM.md §8 (TECHSPEC §16.3) — raw `<img>` tags for content images (product photos, banners, category tiles) are not permitted.
3. **Modern formats when possible**: Images are served as WebP/AVIF via `next/image`'s automatic format negotiation (TECHSPEC §16.1/§16.2), with JPEG/PNG as the upload-accepted source formats (SCHEMA.md §4 validation rules) that get re-encoded — admins are not required to manually produce WebP/AVIF files themselves.
4. **Alt text is mandatory**: Every `product_images` row requires non-empty `alt_text`, entered by the admin at upload time (DESIGN_SYSTEM.md §14, §18) — Server Actions must reject image uploads/product saves missing alt text for any image marked as in-use.
5. **Blur placeholders**: Where feasible, a `blurDataURL` is generated and stored alongside each product image to support `placeholder="blur"` (TECHSPEC §16.5) — this should be automated as part of the image upload Server Action, not a manual admin step.
6. **Lazy loading by default**: All images are lazy-loaded except the single above-the-fold hero image and the primary PDP gallery image, which are marked `priority` (TECHSPEC §16.4).
7. **No oversized banner uploads**: Banner images are cropped/sized at upload time to match the aspect ratios defined for the Landing hero/collage (DESIGN_SYSTEM.md §17, TECHSPEC §16.9) — the application does not perform large client-side crops of oversized source images.

---

## 15. Invoice Rules

1. **Invoice data is always sourced from order snapshots**: `order_items.unit_price_snapshot`, `order_items.product_name_snapshot`, `orders.total_amount`, and `orders.shipping_fee`/`tax_amount` are the only sources for financial figures on an invoice — never live `products.base_price` or a re-computed total. This guarantees the invoice always matches exactly what the customer paid.
2. **Invoice generation is server-side only**: The `/api/invoice/[orderId]` Route Handler enforces authentication and ownership (customer → own orders only; admin → any order) via `requireUser()`/`requireAdmin()` + ownership check before any DB query or PDF generation. There is no client-side invoice generation.
3. **Invoices are not stored in Supabase Storage**: Generated on demand, streamed directly — no `invoices/` bucket, no stored PDF files. If a stored/archivable invoice is ever required (future GSTIN compliance), this decision is revisited via a migration rather than pre-built now.
4. **Invoice number convention**: `INV-{orders.order_number}` — derived at presentation time, not stored as a separate field. Any change to this convention requires updating the invoice Route Handler and the email template link simultaneously (to keep them consistent).
5. **Invoice endpoint excluded from `robots.txt`**: per RULES.md §13 and PRD §15.6 — `/api/*` is disallowed for crawlers; invoice PDFs must never be indexed.

---

## 16. WhatsApp Integration Rules

1. **Admin-configurable only**: The WhatsApp number and enabled/disabled state live in `settings.whatsapp_number` and `settings.whatsapp_enabled` — the floating button is never hardcoded with a phone number in application code. Changing the number must require only a settings update (no code deploy).
2. **Hidden when unconfigured**: If `settings.whatsapp_enabled = false` or `settings.whatsapp_number` is blank, the floating button component renders `null` — it must not appear as a broken link or empty button under any configuration state.
3. **Opens in a new tab**: `target="_blank"` with `rel="noopener noreferrer"` — standard for external links; not opening in-app, which would break the WhatsApp deeplink on mobile.
4. **Does not obstruct CTAs**: On mobile, the button's `bottom` offset must be tested against the PDP "Add to Cart" sticky bar and the checkout flow to confirm it never covers a primary action. Implement as a CSS custom property (`--whatsapp-bottom-offset`) that can be adjusted per-page via a data attribute or layout context if needed.
5. **Brand colour exception**: The WhatsApp button uses `#25D366` (official WhatsApp green) as a deliberate, documented exception to the ACE DÉCOR design system colour palette (DESIGN_SYSTEM.md §2). This exception must not be cited as precedent for other off-palette colours — it is specific to the WhatsApp button and requires a code comment noting the intentional exception.

---

## 17. Cart Rules

1. **Browsing without login is always permitted**: The Landing page, all PLP/category pages, all PDP pages, and the `/cart` page must be fully accessible to unauthenticated users — no login gate before checkout.
2. **Guest cart is local-only**: Guest (unauthenticated) cart state lives in `localStorage` / a cookie as a JSON array of `{product_id, variant_id, quantity}`. No backend endpoint or Supabase table row is created for a guest cart session. The `cart_items` table (SCHEMA.md §3.7) is for **authenticated users only**.
3. **Login required at checkout**: Clicking "Checkout" while unauthenticated redirects to `/login?redirect=/checkout`. After successful login/signup, the user is returned to `/checkout` with the local cart imported (Rule 4).
4. **Single-pass import, not a merge engine**: On login from the checkout redirect, local cart items are upserted into `cart_items` for the authenticated `user_id` in a single pass. If a matching `(user_id, product_id, variant_id)` row already exists in `cart_items`, quantities are summed. This is the entirety of the "merge" — no multi-step reconciliation, no conflict-resolution UI, no cross-device cart sync. If the sum exceeds available stock, it is capped at `stock_quantity` (capping is done silently with a toast notification, not an error block).
5. **Stock validation at checkout, not at add-to-cart**: Adding an item to the cart (guest or authenticated) does not validate stock — this keeps the add-to-cart action instant and avoids race conditions. Stock sufficiency is validated exactly once: at payment verification via `rpc_order_confirm` (APPFLOW.md §10.1), which is the authoritative, atomic check.

---

## 18. Settings Rules

1. **No raw JSONB consumption**: UI components and business logic must never read `settings.value` directly from the Supabase client response. All settings access goes through `lib/settings/service.ts`.
2. **Zod-validated per key**: Every settings key has a corresponding Zod v4 schema in `lib/validation/settings.schema.ts`. Adding a new settings key requires adding its schema in the same PR.
3. **Typed service methods only**: `lib/settings/service.ts` exposes named, typed getter and setter functions per logical group (e.g., `getShippingSettings()`, `getContactSettings()`, `getWhatsAppSettings()`). No caller may use a generic `getSetting(key: string): unknown` pattern.
4. **Writes validated before persistence**: The `/admin/settings` Server Action validates all incoming values through the relevant Zod v4 schema before calling `supabase.from('settings').upsert(...)`. A value failing validation returns `{ success: false, error }` — it is never written to the database.
5. **No settings key added without a schema**: If a new `settings` key is introduced (e.g., a new feature toggle), its Zod v4 schema, typed getter, and seed migration must be in the same PR. Loose, untyped keys are prohibited.

---

## 19. Product Lifecycle Rules

1. **No hard deletion via admin UI**: The admin interface must not expose a "Delete Product" action that issues a `DELETE FROM products` statement. The only supported removal path is setting `products.status = 'archived'` via the product edit form.
2. **Archived products are invisible to customers**: RLS and application-level queries filter `WHERE status = 'active'` for all storefront reads (PLP, search, PDP, sitemap). Archived products must not appear in any customer-facing surface.
3. **Archived products remain queryable by admin**: The admin products list must include an "Archived" filter tab so the admin can view, audit, and potentially restore archived products (by setting status back to `draft` or `active`).
4. **Historical integrity is preserved**: `order_items` rows reference `products.id` via `ON DELETE RESTRICT` FK — this structurally prevents a hard delete of any product that has been ordered. Even for products that have never been ordered, the prohibition on UI-level hard deletion is absolute to preserve `inventory_movements` history and analytics integrity.
5. **Exception — direct DB maintenance only**: A hard delete may only be performed directly via the Supabase dashboard or `psql` by the developer/operator, only for products that have zero order history, and only with an accompanying note in the project's operational runbook. Such deletes are never triggered from application code.
6. **Categories follow the same pattern**: Categories are deactivated via `is_active = false`, not hard-deleted. The `ON DELETE RESTRICT` FK on `products.category_id` structurally prevents hard-deleting any category that has associated products.
