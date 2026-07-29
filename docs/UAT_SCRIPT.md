> ⚠️ **SUPERSEDED (2026-07-27, Phase 26):** This document describes the original Supabase-backed ecommerce architecture (database, admin panel, checkout, or similar) and does **not** reflect the current codebase. As of Phase 26, the site is fully static — no database, no admin panel, no authentication of any kind. See `HANDOFF.md` and `docs/PROJECT_STATUS.md` for the current architecture. Kept here for historical reference only.

---

# ACE DÉCOR — Phase 23 UAT Test Script

**Purpose:** Manual test-case checklist to execute against a deployed staging environment (Netlify preview/staging + Supabase staging project) before Phase 24 production cutover. Covers every flow in `docs/APPFLOW.md`.

**How to use this document:**
- Work top to bottom. Each test case has an ID, preconditions, steps, and expected result.
- Mark each row Pass / Fail / Blocked as you go, and note the exact behaviour observed for any Fail.
- Run with Razorpay in **test mode** (test API keys, [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-upi-details/)) — never real payment instruments on staging.
- Sections are ordered so state builds naturally (e.g. you need a placed order before you can test returns).
- The Phase 23 placeholder product catalog (36 products, `placehold.co` images) is sufficient to complete every test case below — real product photography is not required for UAT to pass.

**Environment checklist before starting** (see `docs/PROJECT_STATUS.md` "Manual Setup Remaining"):
- [ ] Supabase staging project provisioned, all 14 migrations applied (`supabase db push`)
- [ ] All environment variables set in Netlify staging context (see `.env.example`)
- [ ] `ADMIN_USER_ID` set to a real Supabase Auth user ID you control
- [ ] Razorpay test-mode keys configured, webhook URL registered and verified
- [ ] Resend configured with a verified sending domain (or Resend sandbox mode)
- [ ] Upstash Redis instance provisioned and reachable

---

## 1. Storefront Browsing & Search

| ID | Steps | Expected Result |
|----|-------|------------------|
| BR-01 | Visit `/` | Landing page loads: hero banner, featured categories, no console errors |
| BR-02 | Visit `/shop` | All 36 seeded products visible, paginated/infinite-scrolled correctly |
| BR-03 | Visit `/shop/[category]` for each of the 9 categories | Only that category's products shown; correct product counts |
| BR-04 | Use the search bar with a full word (e.g. "cushion") | Relevant results returned via full-text search |
| BR-05 | Use the search bar with a typo (e.g. "cushon") | Relevant results still returned via trigram fallback search |
| BR-06 | Apply price filter / sort on `/shop` | Product list updates correctly, URL reflects filter state |
| BR-07 | Visit a product detail page (PDP) | Images, price, variants, description, FAQ accordion, reviews section all render |
| BR-08 | On a PDP, select each variant | Price and stock status update correctly per variant |
| BR-09 | View a product with 0 stock across all variants (temporarily set via `/admin/products`) | "Out of stock" shown, Add to Cart disabled |
| BR-10 | View a product with `low_stock_threshold` breached (e.g. stock=3, threshold=5) | "Only a few left" messaging shown |

## 2. Cart (Guest & Logged-in)

| ID | Steps | Expected Result |
|----|-------|------------------|
| CT-01 | As a guest, add 2-3 products to cart | Cart badge count updates; items persist across page navigation (localStorage-backed guest cart) |
| CT-02 | As a guest, refresh the page | Cart contents still present |
| CT-03 | Update quantity of an item in cart | Line total and cart total recalculate correctly |
| CT-04 | Remove an item from cart | Item removed, totals update |
| CT-05 | Add an item, then reduce its stock to below the cart quantity via `/admin/products` | Cart shows a clear "only N available" adjustment/warning before checkout |
| CT-06 | As a guest, click "Checkout" | Redirected to `/login?redirect=/checkout` (per `docs/APPFLOW.md` §6) |
| CT-07 | Log in from that redirect | Redirected back to `/checkout` with cart intact (guest cart merged into account) |

## 3. Authentication

| ID | Steps | Expected Result |
|----|-------|------------------|
| AU-01 | Visit `/signup`, create a new customer account | Account created, verification/welcome flow behaves per `docs/APPFLOW.md` §7.1 |
| AU-02 | Visit `/login`, sign in with valid credentials | Redirected to account/home appropriately |
| AU-03 | Visit `/login`, sign in with invalid credentials | Clear error message, no account lockout on first attempt |
| AU-04 | Trigger 6 failed login attempts within 15 minutes | Rate limited after the 5th attempt (`auth:login` — Phase 22) |
| AU-05 | Visit `/forgot-password`, submit a valid email | Reset email received (check Resend logs/inbox) |
| AU-06 | Trigger 4 forgot-password requests within 15 minutes | Rate limited after the 3rd (`auth:forgot-password`) |
| AU-07 | Complete a password reset via the emailed link | Password updated, can log in with new password |
| AU-08 | Visit `/account` while logged out | Redirected to `/login?redirect=/account` |
| AU-09 | Visit `/checkout` while logged out | Redirected to `/login?redirect=/checkout` |

## 4. Admin Authentication & Access Control

| ID | Steps | Expected Result |
|----|-------|------------------|
| AD-01 | Visit `/admin/dashboard` while logged out | Redirected to `/admin/login` |
| AD-02 | Visit `/admin/login` | Login form renders **without** the admin sidebar/top-bar chrome |
| AD-03 | Log in as the `ADMIN_USER_ID` account at `/admin/login` | Redirected to `/admin/dashboard`, sidebar shows all sections |
| AD-04 | While logged in as admin, visit `/admin/login` again | Redirected to `/admin/dashboard` (no login loop) |
| AD-05 | Log in as a **non-admin** customer account, then visit `/admin/dashboard` | Redirected to `/` (storefront root), never shown the admin login page |
| AD-06 | Temporarily unset `ADMIN_USER_ID` in staging env vars, visit `/admin/dashboard` | Redirected to `/` — admin routes fully inaccessible when unconfigured (re-set the var after this check) |
| AD-07 | As admin, click every sidebar nav item (Dashboard, Products, Categories, Orders, Payments, Returns, Reviews, Banners, FAQs, Reports, Settings) | Every page loads at its documented `/admin/*` URL with no 404s |
| AD-08 | Let a staging session sit idle until under 10 minutes of JWT lifetime remain | Amber "session expires in X min" badge appears in the admin top bar (Phase 22) |

## 5. Checkout & Payment (Razorpay Test Mode)

| ID | Steps | Expected Result |
|----|-------|------------------|
| CO-01 | Add items to cart, proceed to `/checkout`, fill shipping address | Order summary reflects correct items/totals including shipping fee logic (free above ₹499, ₹49 flat below) |
| CO-02 | Complete payment with a Razorpay **test success** card | Redirected to order confirmation page; order status becomes "paid" |
| CO-03 | Check email inbox after CO-02 | Order confirmation email received with PDF invoice attached |
| CO-04 | Check `/admin/products` stock for the ordered items after CO-02 | Stock quantity reduced by the ordered amount (via `rpc_order_confirm`) |
| CO-05 | Check `/admin/orders` after CO-02 | New order visible with correct status, items, and customer details |
| CO-06 | Attempt payment with a Razorpay **test failure** card | Clear failure message shown, cart preserved, no order created in "paid" state |
| CO-07 | Trigger 11 checkout attempts within an hour (same account) | Rate limited after the 10th (`checkout:initiate` — Phase 22) |
| CO-08 | Send a manually crafted/replayed webhook payload to the Razorpay webhook endpoint | Signature verification rejects it (401/400), no order state change |
| CO-09 | Send 101 webhook requests within a minute (load-test tool) | Burst limiter (`webhook:razorpay`, 100/min) engages after the 100th |

## 6. Customer Account

| ID | Steps | Expected Result |
|----|-------|------------------|
| AC-01 | Visit `/account` while logged in | Profile info, order history visible |
| AC-02 | View order history after a completed order (CO-02) | Order appears with correct status and line items |
| AC-03 | Download the invoice PDF from order history | PDF opens correctly with correct order details, pricing, and GST breakdown |
| AC-04 | Update account profile details | Changes persist and reflect on next page load |

## 7. Reviews

| ID | Steps | Expected Result |
|----|-------|------------------|
| RV-01 | Visit a PDP for one of the 5 flagship seeded products (cushion cover, elastic bedsheet, table cover, grass mat, or AC curtain) | Seed reviews (Phase 17) are visible with ratings and review summary |
| RV-02 | As a logged-in customer who purchased a product (CO-02), submit a review | Review submitted successfully, appears (or enters moderation queue per RULES.md) |
| RV-03 | Attempt to submit a second review for the same product | Blocked — one review per customer per product |
| RV-04 | Attempt to submit 4 reviews (different products) within an hour | Rate limited after the 3rd (`review:submit` — Phase 22) |
| RV-05 | As admin, visit `/admin/reviews`, moderate a pending review | Approve/reject actions work and reflect on the storefront immediately |

## 8. Returns

| ID | Steps | Expected Result |
|----|-------|------------------|
| RT-01 | From account order history (within the 7-day return window), request a return | Return request created, status visible in account |
| RT-02 | As admin, visit `/admin/returns`, review the pending request | Request visible with order/item details |
| RT-03 | Approve the return as admin | Status updates; customer-facing status reflects "approved" |
| RT-04 | Mark the return as "completed" as admin | Stock is conditionally restocked per `docs/APPFLOW.md` §10.3; order/return status finalized |
| RT-05 | Attempt to request a return after the 7-day window (adjust `created_at` in Supabase for a test order, or wait) | Return request rejected/disabled with a clear message |

## 9. Admin Console — Catalog & Content Management

| ID | Steps | Expected Result |
|----|-------|------------------|
| CM-01 | As admin, edit one of the 36 seeded products at `/admin/products/[id]/edit` | Changes save and reflect on the storefront PDP |
| CM-02 | Upload a **real product photo** for one seeded product via the admin image uploader | New image appears on the PDP; confirms the pipeline DK will use to replace all placeholder images before launch |
| CM-03 | Archive a product (soft-delete) | Product disappears from storefront but remains in admin/order history (archive-only deletion, per RULES.md) |
| CM-04 | Create a new product from scratch at `/admin/products/new` | New product appears correctly on storefront once published |
| CM-05 | Edit a category at `/admin/categories` | Changes reflect on `/shop/[category]` |
| CM-06 | Edit a banner at `/admin/banners` | Change reflects on the storefront homepage |
| CM-07 | Add/edit an FAQ at `/admin/faqs` | Change reflects immediately on `/faq` (no redeploy needed) |
| CM-08 | Edit policy text at `/admin/settings` for Shipping, Returns, Privacy, and Terms | Changes reflect immediately at `/policies/shipping`, `/policies/returns`, `/policies/privacy`, `/policies/terms` |
| CM-09 | Visit `/policies/refunds` (an invalid slug) | Returns a proper 404, not a crash |
| CM-10 | Visit `/faq` with all FAQ items temporarily deactivated | Page renders gracefully with an empty-state message, no crash |

## 10. Admin Console — Orders, Payments, Reports

| ID | Steps | Expected Result |
|----|-------|------------------|
| OP-01 | View `/admin/orders`, filter by status | Filtering works correctly |
| OP-02 | View `/admin/orders/[id]` for an order from CO-02 | Full order detail correct (items, customer, payment, shipping) |
| OP-03 | View `/admin/payments` | Payment records match orders and Razorpay dashboard (test mode) |
| OP-04 | View `/admin/reports` | Sales/analytics figures reflect actual seeded/test order data accurately |
| OP-05 | View `/admin/dashboard` | Summary stat cards (orders, revenue, low stock, pending returns) match underlying data |

## 11. SEO, Performance & Accessibility (Phase 21 spot-check)

| ID | Steps | Expected Result |
|----|-------|------------------|
| SE-01 | Fetch `/api/sitemap.xml` | Includes homepage, shop, all category pages, all product pages, `/faq`, and all 4 `/policies/*` URLs (Phase 23 addition) |
| SE-02 | Fetch `/robots.txt` | Disallows `/admin/*`, `/account/*`, `/checkout`, `/api/*` as appropriate; allows public pages |
| SE-03 | View page source on a PDP | Correct `Product` JSON-LD with accurate price, availability, and image |
| SE-04 | View page source on `/faq` | Correct `FAQPage` JSON-LD matching visible questions |
| SE-05 | Run Lighthouse (or the CI Lighthouse CI job) against staging | Scores meet the thresholds configured in `lighthouserc.js` |
| SE-06 | Run axe/Playwright accessibility spec against staging (`e2e/accessibility.spec.ts`) | No serious/critical violations |

## 12. Security Hardening Spot-Checks (Phase 22)

| ID | Steps | Expected Result |
|----|-------|------------------|
| SC-01 | Inspect response headers on any page | CSP header present, `'unsafe-eval'` absent from `script-src` in production |
| SC-02 | Attempt to load the site over plain HTTP | Redirected to HTTPS (Netlify default) |
| SC-03 | Check Netlify build logs for the env-audit step | No missing required env vars, no `NEXT_PUBLIC_` leakage of server secrets |
| SC-04 | Run `supabase/tests/rls_policy_tests.sql` against the staging database | All 42 checks pass |

## 13. Cross-Cutting

| ID | Steps | Expected Result |
|----|-------|------------------|
| XC-01 | Full journey: browse → PDP → cart → login → checkout → payment → confirmation email → order in account → review submission → return request → admin resolves return | End-to-end flow completes with no dead ends or console errors at any step |
| XC-02 | Test on a real mobile device (not just responsive devtools) | Layout, tap targets, and cart drawer/checkout flow all usable |
| XC-03 | Test with JavaScript-heavy interactions on a slow 3G network throttle | Loading states shown appropriately, no broken interactions |

---

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Tester | | | ☐ Pass ☐ Pass with notes ☐ Fail |
| Business owner (stakeholder) | | | ☐ Approved for Phase 24 cutover ☐ Changes requested |

**Notes / issues found during UAT:**
_(log any Fail/Blocked items here with enough detail to reproduce)_
