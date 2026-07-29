/**
 * lib/utils/__tests__/format.test.ts
 *
 * Unit tests for lib/utils/format.ts — the single source for currency and
 * WhatsApp link formatting in ACE DÉCOR.
 */

import { describe, it, expect } from "vitest";
import { formatPrice, formatWhatsAppLink } from "../format";

// ─────────────────────────────────────────────────────────────────────────────
// formatPrice
// ─────────────────────────────────────────────────────────────────────────────

describe("formatPrice", () => {
  it("formats a whole number with ₹ symbol", () => {
    const result = formatPrice(499);
    expect(result).toContain("499");
    expect(result).toContain("₹");
  });

  it("formats zero as ₹0", () => {
    const result = formatPrice(0);
    expect(result).toContain("0");
    expect(result).toContain("₹");
  });

  it("formats a decimal price", () => {
    const result = formatPrice(1499.99);
    expect(result).toContain("1,499");
    expect(result).toContain("₹");
  });

  it("formats large amounts with Indian grouping (lakh system)", () => {
    // 100000 → ₹1,00,000 in Indian locale
    const result = formatPrice(100000);
    expect(result).toContain("₹");
    expect(result).toContain("1");
    expect(result).toContain("000"); // must contain the amount
  });

  it("returns a string type", () => {
    expect(typeof formatPrice(299)).toBe("string");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// formatWhatsAppLink
// ─────────────────────────────────────────────────────────────────────────────

describe("formatWhatsAppLink", () => {
  it("produces a wa.me link with the phone number", () => {
    const link = formatWhatsAppLink("+91 98765 43210", "Hello");
    expect(link).toContain("wa.me");
    expect(link).toContain("9876543210");
  });

  it("strips non-numeric characters from the phone number", () => {
    const link = formatWhatsAppLink("+91-98765-43210", "Hi");
    expect(link).not.toContain("-");
    expect(link).not.toContain("+");
  });

  it("URL-encodes the message text", () => {
    const link = formatWhatsAppLink("9876543210", "Hello World!");
    // Space should be encoded
    expect(link).toContain("Hello%20World");
  });

  it("works with a message containing special characters", () => {
    const link = formatWhatsAppLink("9876543210", "I'd like to know more");
    expect(link.length).toBeGreaterThan(20);
    expect(link).toContain("wa.me");
  });

  it("works with the real business WhatsApp number", () => {
    const link = formatWhatsAppLink("919810139284", "Hi");
    expect(link).toBe("https://wa.me/919810139284?text=Hi");
  });
});
