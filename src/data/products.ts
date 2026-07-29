/**
 * data/products.ts — Static Product Catalog
 *
 * This is the ONLY source of product data on the site — there is no
 * database, no CMS, no admin panel. To add, remove, or edit a product,
 * image, or price, edit this file directly and redeploy.
 *
 * Data model: every colour/size option is its OWN individual listing
 * with its own page and URL (not a variant picker on a shared page) —
 * per business owner request, so customers can browse and directly open
 * each colour as a distinct product, the way the source photos were
 * organised. Listings are grouped by category (the 9 product lines) for
 * navigation, the /shop/[category] listing pages, and "Related
 * Products" on each PDP. All listings in a category share one price.
 */

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Listing {
  slug: string;
  categorySlug: string;
  categoryName: string;
  variantName: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  images: ProductImage[];
}

export interface Category {
  slug: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { slug: "cushion-covers", name: "Cushion Covers" },
  { slug: "pillow-covers", name: "Pillow Covers" },
  { slug: "plastic-bedsheets", name: "Plastic Bedsheets" },
  { slug: "elastic-bedsheets", name: "Elastic Bedsheets" },
  { slug: "table-covers", name: "Table Covers" },
  { slug: "ac-curtains", name: "AC Curtains" },
  { slug: "grass-mats", name: "Grass Mats" },
  { slug: "ac-covers", name: "AC Covers" },
  { slug: "booster-covers", name: "Booster Covers" },
];

export const LISTINGS: Listing[] = [
  {
    slug: "cushion-covers",
    categorySlug: "cushion-covers",
    categoryName: "Cushion Covers",
    variantName: "Apsara Gajri",
    name: "Cushion Covers",
    shortDescription: "Soft, richly patterned cushion covers that instantly refresh any sofa or bed.",
    description: "Elevate your living space with our premium cushion covers, woven for softness and durability. Featuring rich, traditional-inspired patterns, each cover is designed to complement both modern and classic interiors.\n\nEasy to maintain and built to hold their colour wash after wash, they're a simple way to refresh a room without a full makeover.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/cushion-covers/apsara-gajri-1.jpg", alt: "Cushion Covers - Apsara Gajri" },
      { url: "/images/products/cushion-covers/apsara-gajri-2.jpg", alt: "Cushion Covers - Apsara Gajri (alternate view)" },
    ],
  },
  {
    slug: "pillow-covers-pure-pink",
    categorySlug: "pillow-covers",
    categoryName: "Pillow Covers",
    variantName: "Pure Pink",
    name: "Pillow Covers — Pure Pink",
    shortDescription: "Breathable, fade-resistant pillow covers in soft solid tones.",
    description: "Our pillow covers are crafted from smooth, breathable fabric designed for everyday comfort. Available in a range of soft solid tones, they layer beautifully with your existing bedding.\n\nEasy-care fabric keeps its colour and shape wash after wash.",
    price: 279,
    originalPrice: 558,
    discountPercent: 50,
    images: [
      { url: "/images/products/pillow-covers/pure-pink-1.jpg", alt: "Pillow Covers - Pure Pink" },
      { url: "/images/products/pillow-covers/pure-pink-2.jpg", alt: "Pillow Covers - Pure Pink (alternate view)" },
    ],
  },
  {
    slug: "pillow-covers-pure-yellow",
    categorySlug: "pillow-covers",
    categoryName: "Pillow Covers",
    variantName: "Pure Yellow",
    name: "Pillow Covers — Pure Yellow",
    shortDescription: "Breathable, fade-resistant pillow covers in soft solid tones.",
    description: "Our pillow covers are crafted from smooth, breathable fabric designed for everyday comfort. Available in a range of soft solid tones, they layer beautifully with your existing bedding.\n\nEasy-care fabric keeps its colour and shape wash after wash.",
    price: 279,
    originalPrice: 558,
    discountPercent: 50,
    images: [
      { url: "/images/products/pillow-covers/pure-yellow-1.jpg", alt: "Pillow Covers - Pure Yellow" },
      { url: "/images/products/pillow-covers/pure-yellow-2.jpg", alt: "Pillow Covers - Pure Yellow (alternate view)" },
    ],
  },
  {
    slug: "pillow-covers-white-blue",
    categorySlug: "pillow-covers",
    categoryName: "Pillow Covers",
    variantName: "White Blue",
    name: "Pillow Covers — White Blue",
    shortDescription: "Breathable, fade-resistant pillow covers in soft solid tones.",
    description: "Our pillow covers are crafted from smooth, breathable fabric designed for everyday comfort. Available in a range of soft solid tones, they layer beautifully with your existing bedding.\n\nEasy-care fabric keeps its colour and shape wash after wash.",
    price: 279,
    originalPrice: 558,
    discountPercent: 50,
    images: [
      { url: "/images/products/pillow-covers/white-blue-1.jpg", alt: "Pillow Covers - White Blue" },
      { url: "/images/products/pillow-covers/white-blue-2.jpg", alt: "Pillow Covers - White Blue (alternate view)" },
    ],
  },
  {
    slug: "plastic-bedsheets-pink",
    categorySlug: "plastic-bedsheets",
    categoryName: "Plastic Bedsheets",
    variantName: "Pink",
    name: "Plastic Bedsheets — Pink",
    shortDescription: "Waterproof, easy-wipe bedsheets built for everyday practicality.",
    description: "Designed for households that need extra protection without compromising on style, our plastic bedsheets are waterproof, easy to wipe clean, and available in a range of solid colours.\n\nA practical choice for kids' rooms, guest rooms, or anyone who wants worry-free bedding.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/plastic-bedsheets/pink-1.jpg", alt: "Plastic Bedsheets - Pink" },
      { url: "/images/products/plastic-bedsheets/pink-2.jpg", alt: "Plastic Bedsheets - Pink (alternate view)" },
    ],
  },
  {
    slug: "plastic-bedsheets-blue",
    categorySlug: "plastic-bedsheets",
    categoryName: "Plastic Bedsheets",
    variantName: "Blue",
    name: "Plastic Bedsheets — Blue",
    shortDescription: "Waterproof, easy-wipe bedsheets built for everyday practicality.",
    description: "Designed for households that need extra protection without compromising on style, our plastic bedsheets are waterproof, easy to wipe clean, and available in a range of solid colours.\n\nA practical choice for kids' rooms, guest rooms, or anyone who wants worry-free bedding.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/plastic-bedsheets/blue-1.jpg", alt: "Plastic Bedsheets - Blue" },
      { url: "/images/products/plastic-bedsheets/blue-2.jpg", alt: "Plastic Bedsheets - Blue (alternate view)" },
    ],
  },
  {
    slug: "plastic-bedsheets-brown",
    categorySlug: "plastic-bedsheets",
    categoryName: "Plastic Bedsheets",
    variantName: "Brown",
    name: "Plastic Bedsheets — Brown",
    shortDescription: "Waterproof, easy-wipe bedsheets built for everyday practicality.",
    description: "Designed for households that need extra protection without compromising on style, our plastic bedsheets are waterproof, easy to wipe clean, and available in a range of solid colours.\n\nA practical choice for kids' rooms, guest rooms, or anyone who wants worry-free bedding.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/plastic-bedsheets/brown-1.jpg", alt: "Plastic Bedsheets - Brown" },
      { url: "/images/products/plastic-bedsheets/brown-2.jpg", alt: "Plastic Bedsheets - Brown (alternate view)" },
    ],
  },
  {
    slug: "plastic-bedsheets-gold",
    categorySlug: "plastic-bedsheets",
    categoryName: "Plastic Bedsheets",
    variantName: "Gold",
    name: "Plastic Bedsheets — Gold",
    shortDescription: "Waterproof, easy-wipe bedsheets built for everyday practicality.",
    description: "Designed for households that need extra protection without compromising on style, our plastic bedsheets are waterproof, easy to wipe clean, and available in a range of solid colours.\n\nA practical choice for kids' rooms, guest rooms, or anyone who wants worry-free bedding.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/plastic-bedsheets/gold-1.jpg", alt: "Plastic Bedsheets - Gold" },
      { url: "/images/products/plastic-bedsheets/gold-2.jpg", alt: "Plastic Bedsheets - Gold (alternate view)" },
    ],
  },
  {
    slug: "plastic-bedsheets-purple",
    categorySlug: "plastic-bedsheets",
    categoryName: "Plastic Bedsheets",
    variantName: "Purple",
    name: "Plastic Bedsheets — Purple",
    shortDescription: "Waterproof, easy-wipe bedsheets built for everyday practicality.",
    description: "Designed for households that need extra protection without compromising on style, our plastic bedsheets are waterproof, easy to wipe clean, and available in a range of solid colours.\n\nA practical choice for kids' rooms, guest rooms, or anyone who wants worry-free bedding.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/plastic-bedsheets/purple-1.jpg", alt: "Plastic Bedsheets - Purple" },
      { url: "/images/products/plastic-bedsheets/purple-2.jpg", alt: "Plastic Bedsheets - Purple (alternate view)" },
    ],
  },
  {
    slug: "elastic-bedsheets-blue",
    categorySlug: "elastic-bedsheets",
    categoryName: "Elastic Bedsheets",
    variantName: "Blue",
    name: "Elastic Bedsheets — Blue",
    shortDescription: "Snug-fit elastic bedsheets that stay perfectly in place, night after night.",
    description: "Our elastic bedsheets feature a fully elasticated fit that hugs your mattress securely, so there's no more tucking or slipping during the night.\n\nSoft to the touch and available in a curated set of colours, they combine comfort with everyday convenience.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/elastic-bedsheets/blue-1.jpg", alt: "Elastic Bedsheets - Blue" },
      { url: "/images/products/elastic-bedsheets/blue-2.jpg", alt: "Elastic Bedsheets - Blue (alternate view)" },
    ],
  },
  {
    slug: "elastic-bedsheets-beige",
    categorySlug: "elastic-bedsheets",
    categoryName: "Elastic Bedsheets",
    variantName: "Beige",
    name: "Elastic Bedsheets — Beige",
    shortDescription: "Snug-fit elastic bedsheets that stay perfectly in place, night after night.",
    description: "Our elastic bedsheets feature a fully elasticated fit that hugs your mattress securely, so there's no more tucking or slipping during the night.\n\nSoft to the touch and available in a curated set of colours, they combine comfort with everyday convenience.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/elastic-bedsheets/beige-1.jpg", alt: "Elastic Bedsheets - Beige" },
      { url: "/images/products/elastic-bedsheets/beige-2.jpg", alt: "Elastic Bedsheets - Beige (alternate view)" },
    ],
  },
  {
    slug: "elastic-bedsheets-black",
    categorySlug: "elastic-bedsheets",
    categoryName: "Elastic Bedsheets",
    variantName: "Black",
    name: "Elastic Bedsheets — Black",
    shortDescription: "Snug-fit elastic bedsheets that stay perfectly in place, night after night.",
    description: "Our elastic bedsheets feature a fully elasticated fit that hugs your mattress securely, so there's no more tucking or slipping during the night.\n\nSoft to the touch and available in a curated set of colours, they combine comfort with everyday convenience.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/elastic-bedsheets/black-1.jpg", alt: "Elastic Bedsheets - Black" },
      { url: "/images/products/elastic-bedsheets/black-2.jpg", alt: "Elastic Bedsheets - Black (alternate view)" },
    ],
  },
  {
    slug: "elastic-bedsheets-maroon",
    categorySlug: "elastic-bedsheets",
    categoryName: "Elastic Bedsheets",
    variantName: "Maroon",
    name: "Elastic Bedsheets — Maroon",
    shortDescription: "Snug-fit elastic bedsheets that stay perfectly in place, night after night.",
    description: "Our elastic bedsheets feature a fully elasticated fit that hugs your mattress securely, so there's no more tucking or slipping during the night.\n\nSoft to the touch and available in a curated set of colours, they combine comfort with everyday convenience.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/elastic-bedsheets/maroon-1.jpg", alt: "Elastic Bedsheets - Maroon" },
      { url: "/images/products/elastic-bedsheets/maroon-2.jpg", alt: "Elastic Bedsheets - Maroon (alternate view)" },
    ],
  },
  {
    slug: "table-covers-cream",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Cream",
    name: "Table Covers — Cream",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/cream-1.jpg", alt: "Table Covers - Cream" },
      { url: "/images/products/table-covers/cream-2.jpg", alt: "Table Covers - Cream (alternate view)" },
    ],
  },
  {
    slug: "table-covers-green",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Green",
    name: "Table Covers — Green",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/green-1.jpg", alt: "Table Covers - Green" },
      { url: "/images/products/table-covers/green-2.jpg", alt: "Table Covers - Green (alternate view)" },
    ],
  },
  {
    slug: "table-covers-lemon",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Lemon",
    name: "Table Covers — Lemon",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/lemon-1.jpg", alt: "Table Covers - Lemon" },
      { url: "/images/products/table-covers/lemon-2.jpg", alt: "Table Covers - Lemon (alternate view)" },
    ],
  },
  {
    slug: "table-covers-purple",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Purple",
    name: "Table Covers — Purple",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/purple-1.jpg", alt: "Table Covers - Purple" },
      { url: "/images/products/table-covers/purple-2.jpg", alt: "Table Covers - Purple (alternate view)" },
    ],
  },
  {
    slug: "table-covers-blue-print",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Blue Print",
    name: "Table Covers — Blue Print",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/blue-print-1.jpg", alt: "Table Covers - Blue Print" },
    ],
  },
  {
    slug: "table-covers-brown-print",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Brown Print",
    name: "Table Covers — Brown Print",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/brown-print-1.jpg", alt: "Table Covers - Brown Print" },
      { url: "/images/products/table-covers/brown-print-2.jpg", alt: "Table Covers - Brown Print (alternate view)" },
    ],
  },
  {
    slug: "table-covers-daisy-pink",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Daisy Pink",
    name: "Table Covers — Daisy Pink",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/daisy-pink-1.jpg", alt: "Table Covers - Daisy Pink" },
      { url: "/images/products/table-covers/daisy-pink-2.jpg", alt: "Table Covers - Daisy Pink (alternate view)" },
    ],
  },
  {
    slug: "table-covers-gold-lace",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Gold Lace",
    name: "Table Covers — Gold Lace",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/gold-lace-1.jpg", alt: "Table Covers - Gold Lace" },
    ],
  },
  {
    slug: "table-covers-gold-diamond",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Gold Diamond",
    name: "Table Covers — Gold Diamond",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/gold-diamond-1.jpg", alt: "Table Covers - Gold Diamond" },
      { url: "/images/products/table-covers/gold-diamond-2.jpg", alt: "Table Covers - Gold Diamond (alternate view)" },
    ],
  },
  {
    slug: "table-covers-pink",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Pink",
    name: "Table Covers — Pink",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/pink-1.jpg", alt: "Table Covers - Pink" },
      { url: "/images/products/table-covers/pink-2.jpg", alt: "Table Covers - Pink (alternate view)" },
    ],
  },
  {
    slug: "table-covers-silver",
    categorySlug: "table-covers",
    categoryName: "Table Covers",
    variantName: "Silver",
    name: "Table Covers — Silver",
    shortDescription: "Elegant table covers in a wide range of prints, perfect for any dining table.",
    description: "Protect your table while adding a touch of elegance with our wide range of table covers. From classic prints to festive lace-trimmed designs, there's a style to match every dining space.\n\nDurable, easy to wipe down, and sized to fit standard dining tables.",
    price: 219,
    originalPrice: 438,
    discountPercent: 50,
    images: [
      { url: "/images/products/table-covers/silver-1.jpg", alt: "Table Covers - Silver" },
      { url: "/images/products/table-covers/silver-2.jpg", alt: "Table Covers - Silver (alternate view)" },
    ],
  },
  {
    slug: "ac-curtains-7-feet",
    categorySlug: "ac-curtains",
    categoryName: "AC Curtains",
    variantName: "7 Feet",
    name: "AC Curtains — 7 Feet",
    shortDescription: "Thermal AC curtains that keep the cool in and the heat out.",
    description: "Our AC curtains are designed to minimise cool-air loss from air-conditioned rooms, helping your AC work more efficiently while adding a clean, tailored look to doorways and windows.\n\nAvailable in multiple lengths to fit your space.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/ac-curtains/7-feet-1.jpg", alt: "AC Curtains - 7 Feet" },
      { url: "/images/products/ac-curtains/7-feet-2.jpg", alt: "AC Curtains - 7 Feet (alternate view)" },
    ],
  },
  {
    slug: "ac-curtains-9-feet",
    categorySlug: "ac-curtains",
    categoryName: "AC Curtains",
    variantName: "9 Feet",
    name: "AC Curtains — 9 Feet",
    shortDescription: "Thermal AC curtains that keep the cool in and the heat out.",
    description: "Our AC curtains are designed to minimise cool-air loss from air-conditioned rooms, helping your AC work more efficiently while adding a clean, tailored look to doorways and windows.\n\nAvailable in multiple lengths to fit your space.",
    price: 299,
    originalPrice: 598,
    discountPercent: 50,
    images: [
      { url: "/images/products/ac-curtains/9-feet-1.jpg", alt: "AC Curtains - 9 Feet" },
      { url: "/images/products/ac-curtains/9-feet-2.jpg", alt: "AC Curtains - 9 Feet (alternate view)" },
    ],
  },
  {
    slug: "grass-mats",
    categorySlug: "grass-mats",
    categoryName: "Grass Mats",
    variantName: "Grass Mat",
    name: "Grass Mats",
    shortDescription: "Natural-look grass mats that bring a refreshing outdoor texture indoors.",
    description: "Bring a touch of the outdoors in with our grass-textured mats — durable, easy to clean, and perfect for balconies, entryways, or as an accent underfoot.\n\nA simple, natural upgrade for any corner of your home.",
    price: 149,
    originalPrice: 298,
    discountPercent: 50,
    images: [
      { url: "/images/products/grass-mats/grass-mat-1.jpg", alt: "Grass Mats - Grass Mat" },
      { url: "/images/products/grass-mats/grass-mat-2.jpg", alt: "Grass Mats - Grass Mat (alternate view)" },
    ],
  },
  {
    slug: "ac-covers-red",
    categorySlug: "ac-covers",
    categoryName: "AC Covers",
    variantName: "Red",
    name: "AC Covers — Red",
    shortDescription: "Dust-proof AC covers that keep your window unit protected when not in use.",
    description: "Keep your window AC unit free of dust and debris during the off-season with our durable, weather-resistant AC covers. A snug, tailored fit protects your investment and keeps maintenance easy.\n\nAvailable in a range of colours.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/ac-covers/red-1.jpg", alt: "AC Covers - Red" },
      { url: "/images/products/ac-covers/red-2.jpg", alt: "AC Covers - Red (alternate view)" },
    ],
  },
  {
    slug: "ac-covers-blue-15-ton",
    categorySlug: "ac-covers",
    categoryName: "AC Covers",
    variantName: "Blue (1.5 Ton)",
    name: "AC Covers — Blue (1.5 Ton)",
    shortDescription: "Dust-proof AC covers that keep your window unit protected when not in use.",
    description: "Keep your window AC unit free of dust and debris during the off-season with our durable, weather-resistant AC covers. A snug, tailored fit protects your investment and keeps maintenance easy.\n\nAvailable in a range of colours.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/ac-covers/blue-15-ton-1.jpg", alt: "AC Covers - Blue (1.5 Ton)" },
      { url: "/images/products/ac-covers/blue-15-ton-2.jpg", alt: "AC Covers - Blue (1.5 Ton) (alternate view)" },
    ],
  },
  {
    slug: "ac-covers-grey",
    categorySlug: "ac-covers",
    categoryName: "AC Covers",
    variantName: "Grey",
    name: "AC Covers — Grey",
    shortDescription: "Dust-proof AC covers that keep your window unit protected when not in use.",
    description: "Keep your window AC unit free of dust and debris during the off-season with our durable, weather-resistant AC covers. A snug, tailored fit protects your investment and keeps maintenance easy.\n\nAvailable in a range of colours.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/ac-covers/grey-1.jpg", alt: "AC Covers - Grey" },
      { url: "/images/products/ac-covers/grey-2.jpg", alt: "AC Covers - Grey (alternate view)" },
    ],
  },
  {
    slug: "ac-covers-brown",
    categorySlug: "ac-covers",
    categoryName: "AC Covers",
    variantName: "Brown",
    name: "AC Covers — Brown",
    shortDescription: "Dust-proof AC covers that keep your window unit protected when not in use.",
    description: "Keep your window AC unit free of dust and debris during the off-season with our durable, weather-resistant AC covers. A snug, tailored fit protects your investment and keeps maintenance easy.\n\nAvailable in a range of colours.",
    price: 199,
    originalPrice: 398,
    discountPercent: 50,
    images: [
      { url: "/images/products/ac-covers/brown-1.jpg", alt: "AC Covers - Brown" },
      { url: "/images/products/ac-covers/brown-2.jpg", alt: "AC Covers - Brown (alternate view)" },
    ],
  },
  {
    slug: "booster-covers-blue",
    categorySlug: "booster-covers",
    categoryName: "Booster Covers",
    variantName: "Blue",
    name: "Booster Covers — Blue",
    shortDescription: "Comfortable booster covers with a snug, secure fit.",
    description: "Our booster covers are made from soft, durable fabric with a secure fit designed for everyday comfort.\n\nAvailable in a range of solid colours to match your bedroom's palette.",
    price: 229,
    originalPrice: 458,
    discountPercent: 50,
    images: [
      { url: "/images/products/booster-covers/blue-1.jpg", alt: "Booster Covers - Blue" },
    ],
  },
  {
    slug: "booster-covers-brown",
    categorySlug: "booster-covers",
    categoryName: "Booster Covers",
    variantName: "Brown",
    name: "Booster Covers — Brown",
    shortDescription: "Comfortable booster covers with a snug, secure fit.",
    description: "Our booster covers are made from soft, durable fabric with a secure fit designed for everyday comfort.\n\nAvailable in a range of solid colours to match your bedroom's palette.",
    price: 229,
    originalPrice: 458,
    discountPercent: 50,
    images: [
      { url: "/images/products/booster-covers/brown-1.jpg", alt: "Booster Covers - Brown" },
    ],
  },
  {
    slug: "booster-covers-grey",
    categorySlug: "booster-covers",
    categoryName: "Booster Covers",
    variantName: "Grey",
    name: "Booster Covers — Grey",
    shortDescription: "Comfortable booster covers with a snug, secure fit.",
    description: "Our booster covers are made from soft, durable fabric with a secure fit designed for everyday comfort.\n\nAvailable in a range of solid colours to match your bedroom's palette.",
    price: 229,
    originalPrice: 458,
    discountPercent: 50,
    images: [
      { url: "/images/products/booster-covers/grey-1.jpg", alt: "Booster Covers - Grey" },
    ],
  },
  {
    slug: "booster-covers-red",
    categorySlug: "booster-covers",
    categoryName: "Booster Covers",
    variantName: "Red",
    name: "Booster Covers — Red",
    shortDescription: "Comfortable booster covers with a snug, secure fit.",
    description: "Our booster covers are made from soft, durable fabric with a secure fit designed for everyday comfort.\n\nAvailable in a range of solid colours to match your bedroom's palette.",
    price: 229,
    originalPrice: 458,
    discountPercent: 50,
    images: [
      { url: "/images/products/booster-covers/red-1.jpg", alt: "Booster Covers - Red" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Accessors
// ─────────────────────────────────────────────────────────────────────────────

export function getAllListings(): Listing[] {
  return LISTINGS;
}

export function getListingBySlug(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

export function getListingsByCategory(categorySlug: string): Listing[] {
  return LISTINGS.filter((l) => l.categorySlug === categorySlug);
}

/** Other listings in the same category, excluding the given one — used for "Related Products". */
export function getRelatedListings(listing: Listing): Listing[] {
  return LISTINGS.filter((l) => l.categorySlug === listing.categorySlug && l.slug !== listing.slug);
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Category tile image for the homepage grid / navbar — first listing in that category. */
export function getCategoryImage(categorySlug: string): ProductImage | null {
  const first = LISTINGS.find((l) => l.categorySlug === categorySlug);
  return first?.images[0] ?? null;
}

/** Maps a Listing to the flat shape ProductCard/ProductGrid expect. */
export function toCardData(listing: Listing) {
  return {
    slug: listing.slug,
    name: listing.name,
    price: listing.price,
    originalPrice: listing.originalPrice,
    discountPercent: listing.discountPercent,
    image: listing.images[0] ?? null,
  };
}

/**
 * Homepage "Best Sellers" selection — 8 hand-picked listings, one per
 * category (grass mats omitted to keep the section at exactly 8, per
 * business owner request). Picks a different variant than the category
 * grid's tile image where more than one exists, so the two homepage
 * sections don't look identical.
 */
export function getBestSellers(): Listing[] {
  const slugs = [
    "cushion-covers",
    "pillow-covers-white-blue",
    "plastic-bedsheets-purple",
    "elastic-bedsheets-maroon",
    "table-covers-silver",
    "ac-curtains-9-feet",
    "ac-covers-brown",
    "booster-covers-red",
  ];
  return slugs
    .map((slug) => getListingBySlug(slug))
    .filter((l): l is Listing => l !== undefined);
}

/**
 * Hand-picked images for the homepage hero collage ("Elevate every room
 * with thoughtful design"). No dedicated hero photography was supplied,
 * so these are 3 product photos chosen for visual variety — the large
 * tile uses a bedsheet photo per business owner request.
 */
export const HERO_COLLAGE_IMAGES: ProductImage[] = [
  { url: "/images/products/elastic-bedsheets/blue-1.jpg", alt: "Elastic Bedsheets" },
  { url: "/images/products/table-covers/gold-diamond-1.jpg", alt: "Table Covers" },
  { url: "/images/products/ac-curtains/9-feet-1.jpg", alt: "AC Curtains" },
];

