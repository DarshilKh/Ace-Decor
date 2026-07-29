/**
 * data/faq.ts — Static FAQ Content
 *
 * Replaces the old DB-backed `faq_items` table. Rewritten for the
 * WhatsApp-enquiry model — there is no online checkout, no customer
 * account, and no order tracking through the website; ordering, payment,
 * and delivery are all arranged directly over WhatsApp after an enquiry.
 *
 * There is no admin panel — to edit these, edit this file and redeploy.
 */

export interface FaqItem {
  question: string;
  answer: string;
  category: "ordering" | "shipping" | "returns" | "general";
  /**
   * Shown in the compact FAQ block on every product page (in addition to
   * the full /faq page). Keep this to ~4 items — the PDP FAQ is meant to
   * answer the handful of questions someone is most likely to have right
   * before buying, with a link to the full FAQ page for everything else.
   */
  showOnProductPage?: boolean;
}

export const FAQ_ITEMS: FaqItem[] = [
  // Ordering
  {
    category: "ordering",
    question: "How do I place an order?",
    answer:
      'Browse our catalogue, open the product you like, choose a colour or size if applicable, and tap "Enquire on WhatsApp." This opens WhatsApp with your selection pre-filled — just send it, and our team will confirm availability, payment, and delivery details with you directly.',
    showOnProductPage: true,
  },
  {
    category: "ordering",
    question: "How do I pay?",
    answer:
      "Payment is arranged directly with our team over WhatsApp once your order is confirmed — we'll share the available payment options (UPI/bank transfer) at that time.",
    showOnProductPage: true,
  },
  {
    category: "ordering",
    question: "Can I ask questions before ordering?",
    answer:
      "Of course — message us on WhatsApp any time with questions about size, colour, material, or anything else, whether or not you've decided to order.",
  },

  // Shipping
  {
    category: "shipping",
    question: "Do you deliver across India?",
    answer:
      "Yes, we deliver pan-India. Once your order is confirmed over WhatsApp, we'll share an estimated delivery timeline based on your location.",
    showOnProductPage: true,
  },
  {
    category: "shipping",
    question: "How long does delivery take?",
    answer:
      "Delivery timelines are shared at the time of order confirmation and typically range from a few days to about a week, depending on your location.",
  },

  // Returns
  {
    category: "returns",
    question: "What is your return policy?",
    answer:
      "We accept returns within 7 days of delivery for unused, unwashed items in their original condition. Message us on WhatsApp with your order details to start a return — see our full Return Policy for details.",
    showOnProductPage: true,
  },
  {
    category: "returns",
    question: "What if my item arrives damaged or incorrect?",
    answer:
      "Message us on WhatsApp within 48 hours of delivery with photos of the item, and we'll arrange a replacement or refund at no extra cost to you.",
  },

  // General
  {
    category: "general",
    question: "What products does ACE DÉCOR sell?",
    answer:
      "We specialise in premium home décor — cushion covers, pillow covers, bedsheets, table covers, AC curtains, grass mats, AC covers, and booster covers.",
  },
  {
    category: "general",
    question: "Are your prices inclusive of GST?",
    answer: "Yes, all prices shown on our website are inclusive of GST — there are no hidden charges.",
  },
  {
    category: "general",
    question: "How do I contact you?",
    answer:
      "The fastest way is WhatsApp — tap the WhatsApp button anywhere on the site. You can also email us at hello@acedecor.in.",
  },
];
