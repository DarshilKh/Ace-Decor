# Design System
## ACE DÉCOR — Visual Language & UI Standards

**Document Status:** Source of Truth — v2.0

---

## 1. Brand Direction

ACE DÉCOR's visual identity is **premium, elegant, warm, trustworthy, modern, minimal, and Scandinavian-inspired**.

**Emulate**: IKEA, Urban Ladder, Home Centre, Pottery Barn, West Elm — calm layouts, generous whitespace, large lifestyle photography, soft neutral palettes, understated typography, honest merchandising.

**Avoid**: Amazon, Flipkart, Meesho — dense grids, banner stacking, neon CTAs, bank-offer ribbons, countdown timers, fake-discount badges, marketplace-style filter sidebars with heavy borders/colors.

**Guiding principle**: *Products are the hero.* Every layout decision should ask "does this let the product photography breathe?"

---

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#B8835A` | Primary buttons, active states, key accents, links |
| `--color-primary-hover` | `#9C6E49` | Hover/active state of primary elements |
| `--color-background` | `#FAF8F5` | Page background (warm off-white) |
| `--color-surface` | `#FFFFFF` | Cards, modals, inputs, elevated surfaces |
| `--color-heading` | `#2C2C2C` | Headings, primary text |
| `--color-body` | `#6B7280` | Body copy, secondary text, labels |
| `--color-success` | `#5A7D5A` | "In Stock", success messages, confirmations |
| `--color-border` | `#E8E1D8` | Dividers, input borders, card borders |

### 2.1 Derived/Supporting Tokens (to be defined consistently in Tailwind config)
| Token | Suggested Value | Usage |
|-------|------------------|-------|
| `--color-warning` | `#B8835A` (muted, or a warm amber e.g. `#C99A5B`) | "Only Few Left" stock badge |
| `--color-danger` | A muted red, e.g. `#B5544A` | "Out of Stock", destructive actions, error states — **must not be a bright/neon red** |
| `--color-muted-bg` | `#F3EEE8` | Subtle section backgrounds, hover backgrounds on neutral elements |
| `--color-overlay` | `rgba(44,44,44,0.4)` | Modal/drawer backdrops |

### 2.2 Color Usage Rules
- No bright red CTAs. Primary actions use `--color-primary`.
- No neon colors anywhere.
- No gradients except very subtle background tints (e.g., a soft radial fade behind a hero image) — avoid "marketplace" multi-color gradients.
- Stock status colors: `In Stock` → `--color-success`; `Only Few Left` → `--color-warning` (muted amber, text-based, not a flashy badge); `Out of Stock` → `--color-danger` (muted), with reduced-opacity product image.

---

## 3. Typography

**Approach**: Pair a refined serif or high-quality sans-serif for headings (conveying "premium") with a clean, highly legible sans-serif for body text.

| Role | Font Family (suggested) | Weight | Size (Desktop) | Size (Mobile) |
|------|--------------------------|--------|------------------|-----------------|
| Display / Hero Heading | Serif display face (e.g., "Cormorant", "Fraunces") or premium sans (e.g., "Inter Tight") | 600 | 40–56px | 28–36px |
| Page / Section Heading (H1/H2) | Same as above | 600 | 28–36px | 22–28px |
| Card / Subsection Heading (H3) | Sans (e.g., "Inter") | 600 | 18–22px | 16–18px |
| Body Text | Sans (e.g., "Inter") | 400 | 15–16px | 14–15px |
| Small / Caption / Labels | Sans | 400–500 | 12–13px | 12px |
| Price | Sans, slightly heavier | 600 | 16–20px | 16px |
| Button Label | Sans | 500–600 | 14–15px | 14px |

**Rules**:
- Line height: 1.4–1.6 for body text, 1.1–1.3 for headings.
- Avoid all-caps for long text; small-caps or letter-spaced uppercase acceptable for short labels (e.g., "SHOP BY CATEGORY") used sparingly.
- Maintain a clear type scale (e.g., 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48) — do not introduce arbitrary sizes.

---

## 4. Spacing System

Use a consistent 4px-based spacing scale (Tailwind defaults align well):

| Token | Value | Typical Use |
|-------|-------|--------------|
| `space-1` | 4px | Icon-to-text gaps |
| `space-2` | 8px | Tight internal padding |
| `space-3` | 12px | Form field padding |
| `space-4` | 16px | Card padding (mobile), default gaps |
| `space-6` | 24px | Section internal padding, card padding (desktop) |
| `space-8` | 32px | Gaps between major content blocks |
| `space-12` | 48px | Section vertical padding (mobile) |
| `space-16` | 64px | Section vertical padding (desktop) |
| `space-24` | 96px | Large hero/section breathing room (desktop) |

**Rule**: No element should feel "cramped." Product cards, in particular, need generous internal padding and gaps between grid items (minimum 16px mobile, 24px desktop).

---

## 5. Radius System

| Token | Value | Usage |
|-------|-------|--------|
| `radius-sm` | 4px | Badges, small chips (stock status) |
| `radius-md` | 8px | Inputs, buttons |
| `radius-lg` | 12px | Cards, product images |
| `radius-xl` | 16px | Modals, large image containers, hero panels |
| `radius-full` | 9999px | Avatar, pill-shaped filter chips |

Consistent, soft rounding throughout reinforces the "warm, elegant" feel — avoid sharp 0px corners and avoid overly playful fully-pill buttons for primary CTAs (use `radius-md`).

---

## 6. Shadows

Per design rules, shadows must be **subtle** — never heavy/dramatic (no marketplace-style harsh drop shadows).

| Token | Definition | Usage |
|-------|------------|--------|
| `shadow-sm` | `0 1px 2px rgba(44,44,44,0.04)` | Inputs, subtle card edges |
| `shadow-md` | `0 4px 12px rgba(44,44,44,0.06)` | Product cards on hover, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(44,44,44,0.08)` | Modals, drawers (cart drawer) |

**Rule**: Default (resting) product cards should rely primarily on the `--color-border` outline and `--color-surface` vs `--color-background` contrast rather than shadow; shadow appears on hover/elevation only.

---

## 7. Grid System

- **Base unit**: 12-column grid on desktop (≥1024px), 4-column on mobile (<640px), 8-column on tablet (640–1023px).
- **Max content width**: 1280px, centered, with 24px (mobile) / 64px (desktop) horizontal padding (gutters).
- **Product Grids**:
  - Mobile: 2 columns.
  - Tablet: 3 columns.
  - Desktop: 4 columns.
- **Category Grid (Landing "Shop by Category")**:
  - Mobile: 2 columns.
  - Desktop: 4 columns (matching the wireframe in Slide 1, which shows 4 category tiles).

---

## 8. Responsive Breakpoints

| Breakpoint | Min Width | Notes |
|------------|-----------|-------|
| `sm` | 375px (base/mobile) | Design baseline — mobile-first |
| `md` | 640px | Small tablets |
| `lg` | 1024px | Tablets/small laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop (content remains capped at max-width 1280px) |

All components must be designed and tested starting from the 375px viewport upward.

---

## 9. Buttons

| Variant | Background | Text Color | Border | Usage |
|---------|------------|------------|--------|--------|
| **Primary** | `--color-primary` | `#FFFFFF` | none | Add to Cart, Checkout, Pay Now, Save |
| **Primary Hover** | `--color-primary-hover` | `#FFFFFF` | none | Hover/active state |
| **Secondary / Outline** | `--color-surface` | `--color-heading` | 1px `--color-border` | Wishlist (future), Cancel, secondary nav actions |
| **Ghost / Text** | transparent | `--color-primary` | none | "View All", "Read More", inline links |
| **Destructive** | `--color-surface` | `--color-danger` (muted) | 1px `--color-danger` (muted) | Remove from cart, Cancel order, Reject return |
| **Disabled** | `--color-muted-bg` | `--color-body` (reduced opacity) | none | Out-of-stock "Add to Cart" |

- Radius: `radius-md` (8px). Padding: `12px 24px` (desktop), `10px 20px` (mobile). Font: 14–15px, weight 500–600.
- Transition: 150–200ms ease for background-color/transform (subtle scale on press, per Motion `motion/react` micro-interactions).

---

## 10. Inputs & Forms

- Background: `--color-surface`. Border: 1px `--color-border`. Radius: `radius-md`.
- Focus state: border color → `--color-primary`, with a subtle 2px outer ring at `rgba(184,131,90,0.15)`.
- Label: above input, `--color-heading`, 13–14px, weight 500.
- Helper/error text: 12–13px below input; error text uses muted danger color, with an icon, not just color (accessibility).
- Required fields marked with `*`; never rely on color alone to indicate required/error.
- Use **React Hook Form + Zod** for all forms; validation errors surface inline immediately on blur/submit.

---

## 11. Cards

### 11.1 Product Card (Storefront)
Structure (top to bottom):
1. Image container (`radius-lg`, aspect ratio 1:1 or 4:5), subtle hover zoom (Motion `motion/react`, scale 1.0 → 1.03).
2. Stock badge (top-left or top-right overlay, small, `radius-sm`): "Only Few Left" (muted amber) shown only when stock ≤ configurable threshold; "Out of Stock" (muted danger) when stock = 0; no badge when comfortably in stock (avoid visual clutter — absence of a badge = healthy stock).
3. Product Name — 1–2 lines, truncate with ellipsis, `--color-heading`, 14–16px, weight 500.
4. Price — `--color-heading`, 16–18px, weight 600. **Single price only** — no strike-through MRP, no "% off" badge.
5. Add to Cart — primary button (full width on mobile cards, or icon+label on desktop), disabled/relabeled "Out of Stock" when applicable.

### 11.2 Admin Data Card / Table Row
- Surface background, `radius-lg`, `shadow-sm`, 16–24px padding.
- Status displayed as a small pill (`radius-full`), using semantic colors (success/warning/danger/muted) — never marketplace-bright colors.

---

## 12. Tables (Admin)

- Header row: `--color-muted-bg` background, `--color-heading` text, 13px, weight 600, uppercase with letter-spacing (sparingly — admin-only context).
- Row hover: `--color-muted-bg` at reduced opacity.
- Row borders: 1px `--color-border`, horizontal only (no vertical cell borders — clean Scandinavian feel).
- Status column: pill badges (see 11.2).
- Pagination: simple prev/next + page indicator, bottom-right, ghost buttons.
- Dense mode for large tables (Orders, Payments) — 12–13px text, 8–12px vertical padding per row.

---

## 13. Forms (General)

- Multi-step forms (Checkout) use a clear stepper/progress indicator (Address → Review → Payment) — minimal style, no heavy progress bars; e.g., three small labeled circles connected by thin lines in `--color-border`, active step in `--color-primary`.
- Address form fields: Full Name, Phone, Pincode, Address Line 1, Address Line 2 (optional), City, State, Landmark (optional), Address Type (Home/Work — optional).
- Admin product form: organized into tabs or accordion sections — General Info, Pricing & Stock, Images, Variants, SEO.

---

## 14. Accessibility

- Color contrast: All text/background combinations meet WCAG AA (4.5:1 for body text, 3:1 for large text/headings). Verify `--color-body` (#6B7280) on `--color-background` (#FAF8F5) and `--color-surface` (#FFFFFF) meets this — if not, introduce a slightly darker body-text shade for small text contexts.
- All interactive elements reachable via keyboard (`Tab`/`Shift+Tab`), with visible focus rings (2px, `--color-primary`-based, offset).
- All `<img>` (product photos, banners) require descriptive `alt` text (admin must enter alt text when uploading images — enforced in admin product form).
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, proper heading hierarchy (one `<h1>` per page).
- Form inputs have associated `<label>` elements (not placeholder-only labeling).
- Motion: respect `prefers-reduced-motion` — **Motion** (`motion/react` import) animations should degrade to simple opacity fades or be disabled when this is set. Install as the `motion` npm package — do not install `framer-motion` (deprecated alias).

---

## 15. Product Card Standards (Consolidated)

- **Required elements**: Image, Name, Price, Stock Status, Add to Cart (per PRD FR-3).
- **Prohibited elements**: Strike-through pricing, "% OFF" badges, "Sale" ribbons, countdown timers, "Bestseller"/"Trending" badges unless genuinely data-driven (and even then, kept minimal/text-only, not bright banners).
- **Image**: Square or portrait aspect ratio, consistent across the grid; primary image only (gallery lives on PDP).
- **Hover (desktop)**: Subtle image crossfade to a secondary product image (optional enhancement) or gentle scale; "Add to Cart" may appear on hover on desktop, always visible on mobile.

---

## 16. Product Page (PDP) Standards

Based on the wireframe references (Slide 6) adapted to ACE DÉCOR's design system:

- **Layout**: Two-column on desktop (gallery left ~60%, buy-box right ~40%); single column stacked on mobile (gallery first, then info).
- **Gallery**: 3–4 images minimum, large primary image with thumbnail strip below (desktop) or swipeable carousel with dot indicators (mobile). Include alternate-angle/left-right views as specified in PRD FR-6.
- **Buy box** (right column / below gallery on mobile), top to bottom:
  1. Product Name (H1)
  2. Rating summary (stars + review count) — links to reviews section
  3. Price (single, GST-inclusive note as small caption)
  4. Stock status text (In Stock / Only Few Left / Out of Stock)
  5. Variant selector (size/type chips — `radius-md`, bordered, active state in `--color-primary`)
  6. Quantity stepper
  7. Add to Cart (primary, full width) + Share icon adjacent
  8. Short crisp description (2–4 sentences)
  9. "Why Shop With Us" trust row (Secure Checkout, Easy Returns, Quality Assured) — text + icon only, no flashy badges
- **Below the fold**: Full description/details accordion, Reviews section (10–15 seed reviews at launch, paginated), FAQ accordion (product-specific or global).
- **Delivery check** (optional v1 / future): Pincode input + "Check" button, muted styling, positioned below Add to Cart.

---

## 17. Landing Page Standards

Per Slide 1 wireframe, adapted to design system:

1. **Navbar**: Logo (left), category links (center, collapses to hamburger on mobile), search icon, account icon, cart icon with badge count (right). Sticky on scroll, `--color-surface` background, 1px bottom border `--color-border`.
2. **Hero**: Large collage/carousel of 3–4 curated lifestyle photographs showcasing products in real home settings (Scandinavian styling) — no overlaid sale text/badges; optional single elegant tagline + one CTA ("Explore Collection").
3. **Shop by Category**: Grid of all 9 categories (2 cols mobile / 4 cols desktop), each tile = category image + name, generous spacing, `radius-lg` images.
4. **Featured/Best-Selling Products**: Horizontal scroll or grid of product cards (standard product card component).
5. **Trust/Brand Strip**: 3–4 icon+text items (e.g., "Secure Payments", "Easy Returns", "Quality Materials", "Pan-India Delivery") — simple, no marketplace banner styling.
6. **Footer**: Brand blurb, category quick-links, policy links (Shipping, Returns, Privacy, Terms), FAQ link, contact info (email/phone), social icons. `--color-heading` background optional for footer to create dark/light contrast at page end (if used, ensure all text/icons meet contrast on dark background).

---

## 18. Admin Dashboard Standards

- **Layout**: Persistent left sidebar (collapsible on mobile/tablet) with sections: Dashboard, Products, Categories, Orders, Payments, Returns, Reviews, Banners, FAQs, Reports, Settings. Top bar shows admin email + logout.
- **Dashboard Home**: Grid of stat cards (Today's Revenue, Orders Pending, Low Stock Items, Total Customers) followed by a revenue-over-time line/bar chart (Recharts) and a recent-orders table.
- **Visual tone**: More information-dense and utilitarian than the storefront, but still uses the same color tokens/typography for brand consistency — `--color-surface` cards on `--color-background`, `--color-primary` for primary actions and active nav item.
- **Charts (Recharts)**: Use `--color-primary` as the primary series color, `--color-success`/muted tones for secondary series; gridlines in `--color-border` at low opacity; tooltips styled with `--color-surface` background and `shadow-md`.
- **Forms**: Product/category/banner/FAQ forms follow the Inputs & Forms standards (Section 10/13); destructive actions (delete product, reject return) require a confirmation dialog (Shadcn `AlertDialog`).
- **Responsiveness**: Admin is primarily desktop-used but must remain usable on tablet (sidebar collapses to a top drawer); not required to be pixel-perfect on small phones, but must not be broken.
