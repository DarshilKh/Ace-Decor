/**
 * data/policies.ts — Static Policy Pages
 *
 * Replaces the old DB-backed `settings` policy-text fields. Rewritten for
 * the WhatsApp-enquiry model — there is no online checkout, no customer
 * account, and no Razorpay; ordering and payment happen directly over
 * WhatsApp. Review this copy and adjust for your business's exact terms
 * (registered address, GSTIN, etc.) — there is no admin panel, so changes
 * are made by editing this file and redeploying.
 */

export type PolicySlug = "shipping" | "returns" | "privacy" | "terms";

export const POLICIES: Record<PolicySlug, { title: string; body: string }> = {
  shipping: {
    title: "Shipping Policy",
    body: `We deliver across India. Once you enquire on WhatsApp and your order is confirmed, our team will share an estimated delivery timeline based on your location.

Processing Time
Orders are processed within 1-2 business days of order confirmation over WhatsApp.

Delivery Timelines
Metro cities typically receive orders within 3-5 business days of dispatch. Other serviceable locations across India typically receive orders within 5-7 business days. Remote or hard-to-reach PIN codes may take slightly longer — we will let you know if this applies to your address.

Shipping Charges
Any shipping charges are confirmed with you directly over WhatsApp before your order is finalised — there are no hidden fees.

Order Tracking
Once your order ships, our team will share tracking details with you over WhatsApp.

Delayed or Missing Deliveries
If your order has not arrived within the timeline shared with you, message us on WhatsApp with your order details and we will look into it right away.

Damaged Shipments
Please inspect your package on arrival. If it appears damaged in transit, share clear photos with us on WhatsApp within 48 hours of delivery so we can arrange a replacement or refund.`,
  },
  returns: {
    title: "Return Policy",
    body: `We want you to love what you order. If something isn't right, message us on WhatsApp and we'll make it simple.

Return Window
You may request a return within 7 days of delivery. Requests made after this window cannot be accepted.

Eligibility
To be eligible for a return, an item must be unused, unwashed, and in its original packaging with all tags intact, and in the same condition in which you received it. Customised or personalised items are not eligible for return.

How to Request a Return
Message us on WhatsApp with your order details and the reason for return. Our team reviews every request within 24-48 hours and will share pickup or drop-off instructions once approved.

Refunds
Once we receive your returned item and confirm it meets the eligibility criteria above, your refund is processed within 5-7 business days to your original payment method.

Exchanges
If you'd prefer a different size or variant rather than a refund, let us know when requesting your return and we'll help arrange an exchange, subject to availability.

Non-Returnable Items
Items that are used, washed, damaged after delivery, or returned without their original packaging cannot be accepted. Customised or made-to-order items are non-returnable unless they arrive defective.

Damaged or Incorrect Items
If you received a damaged, defective, or incorrect item, message us on WhatsApp within 48 hours of delivery with photos of the item and packaging, and we will arrange a free replacement or full refund — no return shipping cost to you in this case.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `This Privacy Policy explains how ACE DÉCOR ("we", "us", "our") handles information when you use our website and enquire about or order our products.

Information We Collect
When you message us on WhatsApp to enquire about or place an order, you share information directly with us through WhatsApp — such as your name, phone number, delivery address, and order details. Our website itself does not require you to create an account or submit any personal information to browse the catalogue.

How We Use Your Information
We use the information you share with us over WhatsApp solely to confirm, process, and deliver your order, and to respond to your questions. We do not sell, rent, or trade your information to third parties for marketing purposes.

Data Sharing
We share your order information only with the courier partners necessary to deliver your order to you.

Cookies
Our website uses only essential functionality needed to display the catalogue — no advertising or tracking cookies.

Your Rights
You may ask us to access, correct, or delete information we hold about you at any time by messaging us on WhatsApp or emailing hello@acedecor.in.

Children's Privacy
Our website is not directed at children under 18, and we do not knowingly collect personal information from children.

Changes to This Policy
We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.

Contact Us
If you have questions about this Privacy Policy or how your information is handled, contact us at hello@acedecor.in or over WhatsApp.`,
  },
  terms: {
    title: "Terms & Conditions",
    body: `These Terms and Conditions govern your use of the ACE DÉCOR website. By browsing our website and enquiring about or ordering our products, you agree to these terms.

About This Website
ACE DÉCOR's website is a product catalogue. There is no online checkout — enquiries, order confirmation, payment, and delivery arrangements all take place directly between you and our team over WhatsApp.

Pricing
All prices shown on the website are in Indian Rupees (INR) and inclusive of GST, and are current at the time of your enquiry. Final pricing, any applicable shipping charges, and payment details are confirmed with you directly over WhatsApp before your order is finalised.

Product Information
We make every effort to display our products, including colours and details, as accurately as possible. Slight variations may occur due to photography, lighting, and screen display differences.

Orders
An order is only confirmed once our team has acknowledged it to you over WhatsApp — adding an item to an enquiry message does not by itself constitute a confirmed order.

Payment
Payment is arranged directly with our team over WhatsApp, using the payment methods we make available to you at the time (such as UPI or bank transfer). We do not process payments through the website itself.

Cancellations
You may request to cancel an order by messaging us on WhatsApp, provided the order has not yet been dispatched.

Limitation of Liability
While we take care to fulfil orders accurately and promptly, we are not liable for delays or issues caused by circumstances beyond our reasonable control, including courier delays.

Governing Law
These terms are governed by the laws of India.

Changes to These Terms
We may update these Terms and Conditions from time to time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.

Contact Us
If you have questions about these Terms and Conditions, contact us at hello@acedecor.in or over WhatsApp.`,
  },
};
