/**
 * data/site-config.ts — Static Site Configuration
 *
 * Replaces the old DB-backed `settings` table. There is no admin panel to
 * edit these values anymore — to change the WhatsApp number, contact email,
 * or GST note, edit this file directly and redeploy.
 */

export const SITE_CONFIG = {
  brandName: "ACE DÉCOR",

  /**
   * WhatsApp number for the "Enquire on WhatsApp" CTA, in international
   * format with country code (no +, no spaces) — required by the wa.me
   * deep-link format. Sourced from the business owner directly.
   */
  whatsappNumber: "919810139284",

  /** Displayed contact phone number (formatted for readability). */
  contactPhoneDisplay: "+91 98101 39284",

  contactEmail: "hello@acedecor.in",

  gstNote: "All prices are inclusive of GST.",
} as const;
