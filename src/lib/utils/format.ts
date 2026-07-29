/**
 * lib/utils/format.ts — Currency and WhatsApp Link Formatting
 *
 * Single shared formatting module. All currency formatting goes through
 * `formatPrice()` — never inline ₹ strings. Never use `toFixed()` for
 * display — always use Intl.NumberFormat for locale-correct output.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Currency Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Intl.NumberFormat instance for INR currency.
 * Cached at module level — constructing Intl.NumberFormat is expensive.
 *
 * Output: "₹1,499" (no decimals for whole rupees — Indian convention)
 * Output for decimals: "₹1,499.50"
 */
const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Formats a rupee amount for display.
 *
 * @param amount - Amount in INR
 * @returns Formatted string, e.g. "₹1,499"
 */
export function formatPrice(amount: number): string {
  return INR_FORMATTER.format(amount);
}

// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp Link Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a wa.me deep-link with an optional pre-filled message.
 *
 * @param number - Phone number in international format, no + (e.g. "919876543210")
 * @param message - Optional pre-filled message text
 */
export function formatWhatsAppLink(number: string, message?: string): string {
  // wa.me requires a numeric-only phone number (no +, spaces, hyphens, parens)
  const cleanNumber = number.replace(/\D/g, "");
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanNumber}${encodedMessage}`;
}
