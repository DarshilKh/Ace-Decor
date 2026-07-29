> ⚠️ **SUPERSEDED (2026-07-27, Phase 26):** This document describes the original Supabase-backed ecommerce architecture (database, admin panel, checkout, or similar) and does **not** reflect the current codebase. As of Phase 26, the site is fully static — no database, no admin panel, no authentication of any kind. See `HANDOFF.md` and `docs/PROJECT_STATUS.md` for the current architecture. Kept here for historical reference only.

---

# Product Requirements Document (PRD)
## ACE DÉCOR — D2C Home Décor Ecommerce Platform

**Document Status:** Source of Truth — v2.0
**Audience:** Product, Engineering, Design, QA

---

## 1. Executive Summary

ACE DÉCOR is a Direct-to-Consumer (D2C) ecommerce website for a home essentials brand selling cushion covers, pillow covers, plastic bedsheets, elastic bedsheets, table covers, AC curtains, grass mats, AC covers, and booster covers to customers across India.

The platform consists of two applications sharing one codebase and database:

1. **Storefront (Customer-facing)** — a mobile-first, fast, SEO-friendly shopping experience that lets customers browse products, view details, manage a cart, check out, and pay via Razorpay.
2. **Admin Console (Single Admin)** — a private dashboard for one administrator (the business owner) to manage the product catalog, orders, payments, returns, reviews, banners, FAQs, and view sales analytics (including downloadable reports).

The brand identity is **premium, elegant, warm, trustworthy, modern, minimal, and Scandinavian-inspired** — explicitly modeled after IKEA, Urban Ladder, Home Centre, Pottery Barn, and West Elm, and explicitly **not** modeled after Amazon, Flipkart, or Meesho. The site must avoid marketplace visual patterns (banner clutter, fake discounts, neon CTAs, bank offer banners) while still matching the functional robustness ("top 1% security and production quality") of platforms like Myntra/Flipkart/Meesho.

The platform is built on Next.js 16 (App Router, Server Actions, Route Handlers), TypeScript, Tailwind CSS v4, Shadcn UI, Motion (`motion/react`), Supabase (Postgres, Auth, Storage), Razorpay, and is hosted on Netlify.

---

## 2. Business Goals

| # | Goal | Why it matters |
|---|------|-----------------|
| G1 | Launch a single-brand, single-admin online store for ACE DÉCOR's 9 product categories | Core business objective — replace/supplement offline or marketplace-only sales with a direct channel |
| G2 | Provide a premium, trustworthy shopping experience that differentiates from marketplace clutter | Brand positioning against IKEA/Urban Ladder/Pottery Barn tier competitors |
| G3 | Enable the single admin to run the entire operation (catalog, pricing, orders, returns, reporting) without developer intervention | Operational independence, low ongoing dev cost |
| G4 | Achieve secure, PCI-aware payment acceptance via Razorpay | Legal/financial compliance, customer trust |
| G5 | Be discoverable via organic search (SEO) for product and category terms relevant to Indian home décor shoppers | Reduce paid acquisition dependency |
| G6 | Be production-ready, scalable, and maintainable from day one | Avoid costly rewrites as the catalog and order volume grow |
| G7 | Maintain strict honesty in merchandising (no fake discounts, fake reviews, fake urgency) | Brand trust, regulatory compliance (Indian consumer protection norms on drip pricing/dark patterns) |

---

## 3. User Personas

### 3.1 Priya — The Home Decorator (Primary Persona)
- 28–45 years old, urban/semi-urban India, married, owns or rents a home.
- Shops on mobile during evenings; values aesthetics, quality photos, and clear pricing.
- Cautious about online payments; wants visible trust signals (secure checkout, clear return policy, real reviews).
- Pain point with marketplaces: overwhelmed by ads, fake discounts, and clutter.

### 3.2 Raj — The Practical Buyer
- 30–55 years old, buys functional items (AC covers, grass mats, plastic bedsheets) for practical home maintenance.
- Wants quick navigation by category, clear stock availability, and fast checkout — not interested in "lifestyle" browsing.
- Often buys 1–2 items, occasionally repeat-buys seasonal items (AC covers before summer, grass mats for festivals).

### 3.3 Anita — The Gifting / Festive Shopper
- Buys cushion covers, table covers, bedsheets as part of home refresh during festive seasons (Diwali, wedding season).
- Browses on both mobile and desktop; compares variants (size, color, pattern) before buying.
- Influenced by product photography quality and "only X left" stock indicators (genuine, not manufactured).

### 3.4 The Admin (Business Owner / Operator) — Internal Persona
- Single non-technical-to-semi-technical operator.
- Needs to: add/edit products and variants, manage stock, view and process orders, handle returns, view payment/PnL reports, moderate reviews, manage banners/FAQs/site settings.
- Logs in from desktop primarily; needs clarity, not complexity.

---

## 4. User Roles

| Role | Description | Access |
|------|-------------|--------|
| **Guest** | Unauthenticated visitor | Browse catalog, view product details, view FAQs, add to cart (simple local-storage cart, no backend persistence — see FR-14) |
| **Customer (Authenticated)** | Registered user via Supabase Auth | Everything Guest can do, plus: persisted cart, checkout, order history, addresses, profile, submit reviews (post-purchase), track returns |
| **Admin (Single)** | Exactly one privileged account, created at setup time | Full access to Admin Console: catalog (CRUD), orders, payments, returns, reviews moderation, reports/exports, banners, FAQs, site settings |

> **Business Rule:** There is exactly **one** Admin account. No multi-vendor, no staff roles, no marketplace seller accounts. The system must structurally prevent creation of a second admin (see RULES.md and SCHEMA.md).

---

## 5. Functional Requirements

### 5.1 Storefront — Browsing & Discovery
- FR-1: Landing page with hero collage (3–4 rotating/curated lifestyle images), "Shop by Category" grid covering all 9 product categories, featured/best-selling products, and footer with brand info, policy links, and contact details.
- FR-2: Category and search-driven product listing pages (PLPs) with filters (category, price range, size/variant, availability) and sorting (price, newest, popularity).
- FR-3: Product cards display: product image, name, price, stock status (In Stock / Out of Stock / Only Few Left), and an "Add to Cart" action — **no fake discounts, no strike-through MRP, no fake sale badges**.
- FR-4: Mobile-first responsive layout across all breakpoints (mobile, tablet, desktop).
- FR-5: Global navigation (navbar) with logo, category menu, search, account/login, and cart icon with item count.

### 5.2 Storefront — Product Detail Page (PDP)
- FR-6: Full-page product view (not modal) with image gallery (3–4 images minimum, including left/right or alternate angle views), thumbnail strip, and zoom/swipe on mobile.
- FR-7: Product title, short crisp description, price (single honest price, GST-inclusive labeling), stock status with quantity selector.
- FR-8: Variant selection where applicable (e.g., size for table covers: 60x90, 40x60, 48x48; AC curtain sizes: 7ft, 9ft).
- FR-9: Mock/seed initial ratings and a review section (10–15 seed reviews at launch, with the system supporting real post-purchase reviews going forward — see Section 12, Excluded Features, for "fake reviews" policy clarification).
- FR-10: "Share this product" functionality (Web Share API with clipboard-copy fallback).
- FR-11: Delivery/pincode-availability check (optional at launch — see Future Opportunities if deferred).
- FR-12: FAQ section on PDP and/or a dedicated FAQ page.
- FR-13: "Add to Cart" and "Buy Now" actions; disabled/relabeled when out of stock.

### 5.3 Storefront — Cart & Checkout
- FR-14: Cart for guests is a **simple local-storage/cookie-based list** (`product_id`, `product_variant_id`, `quantity`) with no backend persistence and no cross-device sync. On login/signup (triggered from the checkout redirect, FR-16), local cart items are imported into the user's server-side `cart_items` (SCHEMA.md §3.7) in a single-pass operation. A complex, general-purpose guest-cart-merge system is **explicitly not required for v1** (see APPFLOW.md §6 and PRD.md §11 Future Opportunities for any future cross-device guest cart needs).
- FR-15: Cart page shows line items, quantities (editable), per-item subtotal, order subtotal, shipping (if applicable), and total.
- FR-16: **Product browsing (Landing, PLP, PDP) and adding items to a cart do not require login. Login (or signup) is required before checkout** — clicking "Checkout" while unauthenticated redirects to Login/Signup, returning the user to checkout (with their cart imported per FR-14) after successful auth (FR per Slide 3).
- FR-17: Checkout flow for authenticated users: (1) confirm/select delivery address (with ability to add new address — name, phone, address lines, city, state, pincode), (2) confirm contact email/phone, (3) order summary/final bill review (subtotal, shipping, taxes, total — Myntra/Flipkart-style summary), (4) payment via Razorpay.
- FR-18: Order confirmation ("Success") page with order ID, summary, and estimated next steps; confirmation email triggered.

### 5.4 Storefront — Authentication
- FR-19: Email/password and (optionally) OTP/social sign-in via Supabase Auth.
- FR-20: Signup, login, forgot-password/reset flows for customers.
- FR-21: Authenticated session persists across visits (secure cookie-based session via Supabase SSR helpers).

### 5.5 Storefront — Account
- FR-22: Customer account area: profile (name, email, phone), saved addresses (CRUD), order history with statuses, order detail view, return/refund request initiation per eligible order/item.
- FR-23: Customer can leave a product review only after a delivered order containing that product (verified purchase model) — review authenticity policy (see Section 12).

### 5.6 Admin Console — Authentication
- FR-24: Single admin login (email + password) via Supabase Auth, restricted to one pre-provisioned admin email/account.
- FR-25: Forgot-password flow for the admin account (per Slide 4: "a forgot pass method").
- FR-26: Admin routes are fully isolated from customer routes and protected at proxy (`proxy.ts`) + database (RLS) levels.

### 5.7 Admin Console — Catalog Management
- FR-27: CRUD for categories (9 initial categories, extensible).
- FR-28: Create, read, and update products: name, description, category, base price, status (`active` / `draft` / `archived`), SEO fields (slug, meta title/description). **Hard deletion of products through the admin UI is prohibited** — the equivalent of "deleting" a product is setting `status = 'archived'`. Archived products are hidden from all storefront surfaces but their data is preserved for historical order integrity and analytics. Hard deletes may only be performed through direct database administration in exceptional maintenance scenarios and require explicit justification.
- FR-29: CRUD for product variants (size/type combinations) with independent price/stock per variant where applicable.
- FR-30: Image management per product (upload, reorder, set primary image, delete) via Supabase Storage.
- FR-31: Stock management — increment/decrement inventory, and the system auto-derives display status (In Stock / Only Few Left / Out of Stock) from configurable thresholds.
- FR-32: Price updates (increase/decrease) with audit trail (who/when changed — single admin, but still logged for accountability/history).

### 5.8 Admin Console — Orders & Fulfillment
- FR-33: Orders list with filters (status, date range, search by order ID/customer).
- FR-34: Order detail view: items, customer info, shipping address, payment status, order status.
- FR-35: Admin can accept/process/ship/deliver/cancel an order (status transitions) — "what order we got, if we going to accept it or no" (Slide 4). When marking an order `shipped`, the admin may optionally enter a `tracking_number` and `tracking_url`; these are stored on the `orders` row and surfaced in the "Order Shipped" email and on `/account/orders/[id]`.
- FR-36: Order status changes trigger customer-facing notifications (email at minimum).

### 5.9 Admin Console — Payments & Returns
- FR-37: Payments section listing all transactions (linked to orders), status (captured/failed/refunded), amount, date, Razorpay payment/order IDs.
- FR-38: Payment-over-time graph (Recharts) — daily/weekly/monthly revenue trends.
- FR-39: Returns management — list of return requests, ability to approve/reject, mark refund as processed (refund executed via Razorpay refund API).
- FR-40: Exportable monthly/PnL-style reports (CSV/Excel export of orders, payments, and a profit/loss-style summary).

### 5.10 Admin Console — Reviews, Banners, FAQs, Settings
- FR-41: Reviews moderation — view, approve/hide reviews left by verified customers. Seed reviews (`is_seed = true`) are visually flagged in the admin queue so they are clearly distinguishable from genuine verified-purchase reviews. The admin can hide or delete individual seed reviews via the existing moderation interface as real reviews accumulate. No automated retirement flow is built in v1.
- FR-42: Banners management for homepage hero/promo sections (CRUD, image upload via Supabase Storage, schedule/active flags) — used only for honest seasonal/brand messaging, not fake-discount banners.
- FR-43: FAQ management (CRUD) feeding the storefront FAQ section.
- FR-44: Site settings — store-wide configuration (shipping policy text, contact info, social links, tax/GST display settings, low-stock threshold). All settings reads and writes go through the typed service layer (`lib/settings/service.ts`) using Zod validation — raw JSONB values are never consumed directly by UI components or business logic.

### 5.11 Cross-Cutting
- FR-45: Server Actions and Route Handlers implement all mutations and APIs; no client-side direct DB access.
- FR-46: Razorpay integration: order creation, checkout, signature verification (webhook + server-side verification), refunds.
- FR-47: All product/category/PDP pages are SEO-optimized (meta tags, Open Graph, structured data/JSON-LD for products).

---

## 6. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | PDP/PLP/Landing pages should achieve good Core Web Vitals (LCP < 2.5s on mobile 4G); images served via Supabase Storage/CDN with responsive `srcset`/Next/Image optimization. |
| **Security** | Top-tier security posture: server-side authorization checks on every mutation, Row-Level Security (RLS) on all Supabase tables, signed/verified Razorpay webhooks, input validation via Zod v4 on every Server Action and Route Handler, rate limiting on auth and payment endpoints, secrets never exposed client-side. |
| **Availability** | Target 99.9% uptime on Netlify; graceful degradation if Razorpay or Supabase is briefly unreachable (clear error messaging, no silent failures, idempotent payment handling). |
| **Scalability** | Schema and queries designed to scale to tens of thousands of products/orders without redesign; pagination everywhere; indexed queries (see SCHEMA.md). |
| **Maintainability** | Modular folder structure, typed end-to-end (TypeScript + Zod v4 + generated Supabase types), documented conventions (see RULES.md, TECHSPEC.md). |
| **Accessibility** | WCAG 2.1 AA target: color contrast, keyboard navigation, semantic HTML, alt text for all product images. |
| **SEO** | Server-rendered product/category pages, canonical URLs, sitemap.xml, robots.txt, structured data (Product, BreadcrumbList, FAQPage schemas). |
| **Mobile-First** | All UI designed mobile-first, with desktop as a progressive enhancement. |
| **Localization** | INR currency, GST-inclusive pricing display, Indian address format (pincode-based). English language at launch; architecture should not block future Hindi/regional language addition. |
| **Compliance** | No dark patterns: no fake countdowns, no fake stock scarcity, no fake reviews, no pre-checked upsells. Aligned with CCPA (India) guidelines on dark patterns. |

---

## 7. Customer Features (Summary)

- Browse landing page, categories, and search results with filters and sorting.
- View detailed product pages with image galleries, variants, pricing, stock status, reviews, FAQs, and share option.
- Add to cart (guest or logged in), manage cart contents.
- Sign up / log in / reset password.
- Checkout with address entry, order summary review, and Razorpay payment.
- View order history, order details, and order status tracking.
- Request a return/refund for eligible orders.
- Leave a verified-purchase review and rating.
- View store policies (shipping, returns, privacy, terms) and FAQs.

---

## 8. Admin Features (Summary)

- Secure single-admin login with password reset.
- Dashboard overview: key metrics (today's sales, pending orders, low-stock alerts, revenue trend chart).
- Category management (CRUD).
- Product management: create/read/update, variants, images, pricing, stock, SEO metadata, publish/archive (no hard-delete via UI).
- Order management: list, filter, view detail, update status (accept, process, ship, deliver, cancel); optionally add tracking number/URL when marking shipped.
- Payments view with revenue-over-time charts and transaction list.
- Returns management: approve/reject, trigger refund.
- Reviews moderation (including seed review identification and manual retirement).
- Banner management for homepage promotions.
- FAQ management.
- Site settings (policies, contact info, thresholds) via typed settings service layer.
- Reports export (CSV/Excel) for orders, payments, and PnL summary.

---

## 9. Security Requirements

1. **Authentication**: Supabase Auth (email/password minimum; OTP optional) for customers; a single, pre-provisioned admin account with no public admin-signup route.
2. **Authorization**: Enforced at three layers — Next.js `proxy.ts` (route gating, replaces deprecated `middleware.ts`), Server Action/Route Handler checks (session + role verification), and Postgres RLS policies (defense in depth).
3. **Payment Security**: Razorpay order creation server-side only; payment signature verification server-side on success callback; webhook signature verification for asynchronous events; idempotent order/payment state transitions to prevent double-processing.
4. **Data Protection**: All PII (addresses, phone numbers) protected by RLS so a customer can only access their own records; admin access to customer PII scoped to operational necessity (fulfilling orders).
5. **Input Validation**: All inputs validated server-side with Zod v4 schemas — never trust client-side validation alone. Use `z.strictObject()`, `z.email()`, `z.url()`, `z.uuid()` patterns.
6. **Transport Security**: HTTPS enforced everywhere (Netlify default), secure/HTTP-only cookies for session tokens.
7. **Rate Limiting & Abuse Prevention**: Rate limiting via Upstash Redis on login, signup, password reset, review submission, and checkout-initiation endpoints to mitigate brute force and abuse.
8. **File Upload Security**: Supabase Storage buckets with restricted MIME types/sizes for product images and admin-uploaded banners; signed URLs where appropriate.
9. **Secrets Management**: All API keys (Razorpay secret, Supabase secret key) stored as Netlify environment variables, never exposed to the client bundle.
10. **Audit Logging**: Admin actions on price/stock/order-status changes are logged with timestamps for accountability.
11. **Dependency & Configuration Hygiene**: Dependencies kept current; security headers (CSP, X-Frame-Options, HSTS) configured at the Netlify/Next.js level.

---

## 10. Success Metrics

| Metric | Target / Purpose |
|--------|-------------------|
| Conversion Rate (visits → orders) | Baseline established post-launch; track month-over-month improvement |
| Cart Abandonment Rate | Identify checkout friction (especially the login-redirect-at-checkout step) |
| Average Order Value (AOV) | Track impact of catalog/merchandising changes |
| Page Load Performance (Core Web Vitals) | Maintain "Good" thresholds on Google PageSpeed/Search Console |
| Organic Search Traffic | Growth in category/product page impressions and clicks (Search Console) |
| Return Rate | Track product quality and description accuracy issues |
| Admin Operational Time | Time taken by admin to process an order / update stock — should decrease as dashboard matures |
| Repeat Purchase Rate | Indicator of trust and satisfaction (especially important given no loyalty/rewards program) |

---

## 11. Future Opportunities (Out of Scope for v1 but Architecturally Anticipated)

- Wishlist / "save for later" functionality.
- Pincode-based delivery estimate and serviceability check (can be added post-launch).
- Hindi/regional language support.
- WhatsApp order notifications/support integration.
- Abandoned cart email reminders.
- Inventory forecasting/reorder alerts in admin dashboard.
- Bundle/combo product offerings (genuine bundles, not fake discount bundles).
- Customer support chat/helpdesk integration.
- Progressive Web App (PWA) installable storefront.
- Multiple admin/staff accounts with role-based permissions (would require schema changes — documented as a future migration path, not built now).

---

## 12. Excluded Features (Explicitly Out of Scope — Business Rules)

The following are **intentionally excluded** per explicit business rules and must **not** be implemented, even if common on reference marketplaces:

- ❌ Multi-vendor marketplace functionality (single brand, single seller only).
- ❌ Multiple admin/staff roles or a "seller dashboard" model (single admin only).
- ❌ Coupons / promo codes.
- ❌ Reward points / loyalty programs.
- ❌ Fake discounts, fake strike-through MRP, fake "X% OFF" badges.
- ❌ Fake sale banners / fake urgency countdowns.
- ❌ Fake reviews (seed reviews used at launch must be clearly understood internally as placeholder content to be replaced by genuine verified-purchase reviews; the *system* must not have a "generate fake review" feature).
- ❌ Bank offer banners / credit card promotional banners.
- ❌ Marketplace-style UI (mega filter sidebars copied from Myntra/Flipkart, dense grid clutter, multiple competing CTAs, aggressive banner stacking).
- ❌ **Hard product deletion via admin UI** — products are archived (`status = 'archived'`), never hard-deleted through the application. This preserves `order_items` snapshot integrity, `inventory_movements` history, and analytics continuity.

> **Note on seed reviews/ratings:** Slide 3 requests "10–15 mock reviews" and "some mock ratings" for launch content population. This is permitted **only** as initial editorial/seed content to avoid an empty-looking store at launch, clearly distinct from the prohibited "fake reviews" pattern (i.e., simulating ongoing fake social proof). The schema and admin tooling must support transitioning fully to verified-purchase reviews. Retirement of seed reviews in v1 is manual: the admin uses the existing `/admin/reviews` moderation interface to individually hide or delete seed reviews as genuine verified-purchase reviews accumulate. The `is_seed = true` flag makes seed reviews clearly identifiable in the admin queue. No automated retirement flow, batch-retirement tool, or scheduled task is built in v1. This distinction must be respected by all future contributors.

---

## 13. Reference Inputs Considered

This PRD was derived from the attached presentation, including:
- Wireframe of the landing page structure (navbar → hero collage → "Shop by Category" grid → footer).
- Reference screenshots from Myntra and "Rizara" (jewelry D2C site) illustrating PLP filter/sort patterns, PDP gallery + buy-box layout, delivery pincode-check widgets, and "Why Shop With Us" trust modules — used as **structural** inspiration only; visual styling must follow ACE DÉCOR's own design system (see DESIGN_SYSTEM.md), not the marketplace color/branding shown in those references.

---

## 14. Notification Requirements

### 14.1 Initial Version Scope
- **Email notifications only** via **Resend** (`lib/notifications/resend.ts`). SMS, WhatsApp, and push notifications are explicitly out of scope for v1 (see PRD §11 Future Opportunities) but the notification architecture (TECHSPEC §11/§12, `lib/notifications/`) must not preclude adding additional channels later.

### 14.2 Customer Notifications

| Notification | Trigger | Expected Behavior |
|---------------|---------|---------------------|
| **Order Placed** | `orders.status` transitions `pending → confirmed` (i.e., immediately after successful payment verification — see Order Lifecycle, APPFLOW.md) | Email sent to `orders.contact_email` confirming the order number, items, total, and shipping address. Acts as the customer's receipt. |
| **Payment Successful** | `payments.status` transitions to `captured` | May be combined with "Order Placed" into a single email (since both typically occur in the same transaction) to avoid notification fatigue; if sent separately, confirms payment amount and method. |
| **Order Accepted** | Admin transitions `orders.status` to `processing` | Email confirms the order has been accepted and is being prepared for shipment. |
| **Order Shipped** | Admin transitions `orders.status` to `shipped` | Email confirms shipment, including `orders.tracking_number` and a "Track Your Order" link to `orders.tracking_url` if set by the admin. If both fields are NULL, the email uses a generic "on its way" message. Both fields are optional — the admin is not required to enter them to mark an order shipped. |
| **Order Delivered** | Admin transitions `orders.status` to `delivered` (or system-set `delivered_at`) | Email confirms delivery and invites the customer to leave a review (linking to the relevant PDP review form, per APPFLOW §8). |
| **Return Approved** | `returns.status` transitions to `approved` | Email informs the customer their return request was approved, with next steps (e.g., how/where to send the item back) and the expected refund timeline. |
| **Return Rejected** | `returns.status` transitions to `rejected` | Email informs the customer their return request was rejected, including the reason (`returns.admin_notes` or a templated reason). |

### 14.3 Admin Notifications

| Notification | Trigger | Expected Behavior |
|---------------|---------|---------------------|
| **New Order Received** | `orders.status` transitions `pending → confirmed` | Email sent to the admin's configured notification address (per `settings.contact_email` or a dedicated `settings` key) with order number, items, total, and customer contact/shipping details — enabling the admin to act without needing to check the dashboard immediately. |
| **Return Request Created** | New row inserted into `returns` (`status = 'requested'`) | Email sent to the admin summarizing the order, item, and customer-provided reason, prompting review in `/admin/returns`. |
| **Low Stock Alert** | A product's or variant's `stock_quantity` crosses at or below its `low_stock_threshold` (evaluated on stock-affecting events: order confirmation, manual stock adjustment). For variant-tracked products, `low_stock_threshold` is inherited from the parent `products.low_stock_threshold` — there is no per-variant threshold in v1. | Email sent to the admin identifying the product/variant and current stock level, prompting a restock decision. To avoid notification spam, this alert is only sent **once per crossing** (i.e., not repeated on every subsequent sale at the same low level) — re-armed once stock is replenished above the threshold and crosses below it again. |

### 14.4 General Notification Behavior
- All notification sending is isolated behind a `lib/notifications/` module (per IMPLEMENTATION_PLAN.md Phase 15), decoupling the choice of email provider from the triggering business logic. The provider is **Resend** (`lib/notifications/resend.ts`).
- Notification sending failures (e.g., provider outage) must **not** block or roll back the underlying business operation (e.g., an order must still be marked `confirmed` even if the confirmation email fails to send) — failures are logged (per TECHSPEC §11 Application/Error Logs) for follow-up, not surfaced as user-facing errors.
- Notification templates follow the same brand voice and visual identity (premium, warm, minimal) as the storefront — no marketplace-style promotional styling in transactional emails.

---

## 15. SEO Requirements

### 15.1 Structured Data (Schema.org via JSON-LD)

| Schema | Applied To | Purpose |
|--------|------------|---------|
| **Product Schema** | Every PDP (`/product/[slug]`) | Marks up product name, image(s), description, price (`offers.price`, `priceCurrency: INR`), availability (`InStock`/`OutOfStock`/`LimitedAvailability` derived from the stock-status logic in SCHEMA.md §3.4), and aggregate rating (from `reviews`, where present) — enabling rich results (price/availability/star ratings) in search results. |
| **Breadcrumb Schema** | PLP and PDP pages | Reflects the navigation path (e.g., Home → Shop → Table Covers → "60x90 Table Cover"), improving search result presentation and reinforcing site structure for crawlers. |
| **Organization Schema** | Site-wide (root layout) | Marks up ACE DÉCOR's brand name, logo, and contact/social information (sourced from `settings`), supporting brand knowledge panels and consistent brand representation in search results. |
| **FAQ Schema** | `/faq` page and any PDP sections that surface FAQ content (`faq_items`) | Enables FAQ rich results directly in search listings, improving click-through for common questions (shipping, returns, sizing). |

All structured data is generated server-side from the same data already rendered on the page (no duplicate/divergent data sources), and validated against Google's Rich Results Test as part of IMPLEMENTATION_PLAN.md Phase 21.

### 15.2 Meta Titles
- Every public page (Landing, PLP/category, PDP, FAQ, policy pages) has a unique, descriptive `<title>` following a consistent pattern, e.g.:
  - PDP: `{Product Name} | {Category Name} | ACE DÉCOR`
  - PLP/Category: `{Category Name} | ACE DÉCOR`
  - Landing: `ACE DÉCOR | Premium Home Décor — Cushion Covers, Bedsheets, AC Curtains & More`
- Product-level meta titles default to the pattern above but may be overridden via `products.meta_title` (SCHEMA.md §3.4) for admin-controlled fine-tuning.

### 15.3 Meta Descriptions
- Every public page has a meta description (≈150–160 characters) summarizing the page content in the brand's premium/warm tone.
- PDP meta descriptions default to a truncated/derived form of `products.short_description`, overridable via `products.meta_description`.
- Category/landing meta descriptions are managed via `settings` or hardcoded per-route content, editable without a code deploy where feasible (future enhancement: expose category meta description fields in `/admin/categories`).

### 15.4 Canonical URLs
- Every public page emits a `<link rel="canonical">` pointing to its own clean URL (using `NEXT_PUBLIC_SITE_URL` + path), preventing duplicate-content issues from query-string variants (e.g., filter/sort parameters on `/shop`).
- Filtered/sorted PLP views (e.g., `/shop/table-covers?sort=price_asc`) canonicalize to the unfiltered category URL (`/shop/table-covers`) unless a specific filter combination is deemed worth indexing separately (not the case for v1).

### 15.5 Sitemap
- A dynamic `sitemap.xml` (TECHSPEC §5, `GET /api/sitemap.xml` or Next.js's built-in `sitemap.ts` convention) is generated, including: Landing page, all active category pages, all `status = 'active'` product PDPs, FAQ page, and policy pages.
- The sitemap is regenerated/reflects changes automatically as products/categories are published (`status = 'active'`) or unpublished — draft/archived products are excluded.
- The sitemap URL is referenced in `robots.txt` (§15.6) and submitted to Google Search Console as part of launch (IMPLEMENTATION_PLAN.md Phase 21/22).

### 15.6 Robots.txt
- A `robots.txt` allows crawling of all public storefront routes and explicitly disallows: `(admin)` routes, `(auth)` routes (`/login`, `/signup`, `/forgot-password`, `/reset-password`), `/account/*`, `/cart`, `/checkout`, and `/api/*` — these pages have no SEO value and/or contain sensitive flows that should not be indexed.
- References the `sitemap.xml` location.

### 15.7 OpenGraph
- Every public page emits OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) so links shared on WhatsApp/Facebook/etc. (a common sharing pattern in India, and explicitly supported by the PDP "share" feature, FR-10) render an attractive preview card.
- `og:image` for PDPs uses the primary product image (`product_images.is_primary = true`); for category/landing pages, a representative category/hero image; falls back to a default brand `og:image` (from the `branding` storage bucket) if none is available.

### 15.8 Twitter Cards
- `summary_large_image` Twitter Card meta tags are emitted alongside OpenGraph tags (reusing the same title/description/image values) so shared links render correctly on X/Twitter as well — implemented as a thin layer over the existing OpenGraph metadata, not a separate content source.

### 15.9 Product SEO URL Convention
- All product detail pages use **descriptive, hyphenated, keyword-rich slugs** that convey the product name and key differentiators directly in the URL. Slugs are stored in `products.slug` (SCHEMA.md §3.4), set by the admin at product creation, and are the source of truth for PDP routing (`/product/[slug]`).
- **Pattern**: `/product/{descriptor}-{category}-{optional-variant-or-colour}` in all lowercase, hyphens only, no special characters.
- **Examples**:
  - `/product/elastic-bedsheet-floral-blue`
  - `/product/cushion-cover-modern-leaf-green`
  - `/product/ac-curtain-premium-stripe-7ft`
  - `/product/grass-mat-reversible-large`
- **Prohibited**: ID-based or auto-generated opaque slugs such as `/product/123`, `/product/prod_abc789`, or `/product/item1`. These destroy keyword relevance in URLs.
- Slugs must be unique (`UNIQUE` constraint on `products.slug`, SCHEMA.md §3.4), URL-safe (validated via Zod v4 in the admin product form — pattern `/^[a-z0-9-]+$/`, no leading/trailing hyphens), and stable after publication (slug changes break inbound links and require 301 redirects — document this in RULES.md).
- **Category pages** follow a parallel convention: `/shop/cushion-covers`, `/shop/ac-curtains`, etc., using `categories.slug` (already defined in SCHEMA.md §3.3).

---

## 16. WhatsApp Integration (Floating Contact Button)

**Status**: Optional but high-value for Indian D2C ecommerce — included as a first-class, admin-configurable feature, not an afterthought.

### 16.1 Feature Description
- A **floating WhatsApp contact button** (fixed bottom-right, all storefront pages) renders a WhatsApp icon linking to `https://wa.me/<whatsapp_number>` — the standard deeplink that opens WhatsApp (app or web) with a pre-filled optional message (e.g., "Hi, I have a question about my ACE DÉCOR order").
- The button is **completely hidden** (not rendered in the DOM) when `settings.whatsapp_enabled = false` or `settings.whatsapp_number` is blank/unset, to avoid broken/empty buttons if the admin hasn't configured it.

### 16.2 Admin Configuration
- Two `settings` keys (SCHEMA.md §3.15):
  - `whatsapp_enabled` (`boolean`, default `false`) — master on/off toggle.
  - `whatsapp_number` (`string`) — Indian mobile number in international format without `+` or leading zeros (e.g., `919876543210`) or full international format (e.g., `+919876543210`); validated to be a plausible Indian mobile number.
- Both are exposed as fields in `/admin/settings` under a "Contact & Support" section, with a note that the number is public (visible to anyone who inspects the link).

### 16.3 UI/UX
- Position: fixed, bottom-right, z-index above content but below modals/drawers; `64px × 64px` circular button with the official WhatsApp green (`#25D366`) — this is the one intentional exception to the ACE DÉCOR design system palette, because the WhatsApp brand color is universally recognized and aids trust/discoverability.
- On mobile, the button must not obscure the "Add to Cart" CTA on PDP — offset from bottom to clear the mobile sticky CTA bar if present.
- Opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).
- Animated entrance (Motion `motion/react` subtle scale-in from 0 → 1) on page load after a 1–2 second delay, so it doesn't distract from the initial page render.

### 16.4 Scope Boundary
- This is a **contact/support button only** — not a WhatsApp commerce integration (no catalog, no automated order status via WhatsApp API) for v1. Full WhatsApp Business API integration (order notifications, automated status updates) is listed as a Future Opportunity in PRD §11.

---

## 17. Invoice System

**Status**: Required for production — customers and the admin must be able to download a properly formatted invoice PDF for any completed order.

### 17.1 Purpose
- Provides the customer with a downloadable record of purchase (useful for expense claims, gifting, and dispute resolution).
- Provides the admin with a per-order invoice for record-keeping, tax filing, and customer support.

### 17.2 Invoice Contents
Each generated invoice PDF includes:

| Section | Content |
|---------|---------|
| Header | ACE DÉCOR logo, brand name, business address/contact (from `settings`) |
| Invoice metadata | Invoice number (derived from `orders.order_number`, e.g., `INV-ACE-20260613-0001`), invoice date (`orders.placed_at`), order number |
| Bill To | Customer name (`addresses.full_name`), shipping address (formatted Indian address), contact phone/email |
| Line Items | Product name snapshot, variant name, quantity, unit price (INR), line total — from `order_items` |
| Totals | Subtotal, shipping fee, GST/tax amount (labelled per Indian convention), **Grand Total (INR)** |
| Footer | GST note ("Prices are inclusive of all taxes"), return policy brief, website URL |

### 17.3 Technical Approach
- **On-demand generation** (not stored): invoices are generated at request time from `order_items` and `orders` data (which are immutable snapshots per SCHEMA.md §3.9), using a server-side Route Handler (`GET /api/invoice/[orderId]`) protected by authentication (customer can only generate their own order's invoice; admin can generate any order's invoice — enforced by `requireUser()` + ownership check, or `requireAdmin()`).
- **Library**: server-side PDF generation using a Next.js-compatible library (e.g., `@react-pdf/renderer` for declarative React-based PDF layout, or `pdf-lib` for programmatic construction) — selected in Phase 15 with Netlify Function bundle-size and runtime limits in mind. A spike/prototype in Phase 13 confirms the chosen library fits within Netlify Function constraints before Phase 15 begins.
- **Response**: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="ACE-DECOR-Invoice-{order_number}.pdf"` — triggers a browser download.
- Financial figures are always taken from the **order snapshot** (`order_items.unit_price_snapshot`, `orders.total_amount`, etc.) — never from current `products.base_price`, so the invoice always matches what the customer actually paid, regardless of subsequent price changes.

### 17.4 Access Points
- **Customer**: "Download Invoice" button on `/account/orders/[id]` (visible for orders in `confirmed`, `processing`, `shipped`, `delivered` status — i.e., once payment is captured).
- **Admin**: "Download Invoice" action on `/admin/orders/[id]`.
- **Order Confirmed Email**: a link (not attachment) to the invoice download endpoint so the customer can retrieve it from their inbox.

### 17.5 Scope
- v1: single-format, one-per-order invoice PDF (no bulk-download, no GSTIN-based tax invoice customisation beyond the standard template). GSTIN field and HSN code support are Future Opportunities if the business owner is GST-registered.
