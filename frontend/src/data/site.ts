/** Static site copy — contact fields come from getSiteConfig() / useSiteConfig(). */
export const site = {
  name: "Sundaram Export",
  shortName: "Sundaram",
  logoSrc: "/images/company_logo.png",
  tagline: "Multinational export partner for premium products worldwide",
  description:
    "Agricultural commodities, textiles, engineering, and chemicals to 90+ countries — sourcing, certification, and shipment coordination from one team.",
  certifications: ["ISO 9001:2015", "FIEO Member", "APEDA Registered", "DGFT Licensed"],
};

export const socialLinks = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/@sundaramexport",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/sundaramexport",
  },
  {
    label: "X",
    href: "https://x.com/sundaramexport",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sundaramexport",
  },
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/markets", label: "Global Markets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const processSteps = [
  {
    step: "01",
    title: "Inquiry & specification",
    description: "Share grades, packaging, Incoterms, and destination requirements.",
  },
  {
    step: "02",
    title: "Sourcing & compliance",
    description: "Supplier validation, HS codes, licenses, and import rules.",
  },
  {
    step: "03",
    title: "Logistics execution",
    description: "Freight booking, documentation, insurance, and tracking.",
  },
  {
    step: "04",
    title: "Delivery & support",
    description: "Port-to-door coordination and post-shipment support.",
  },
];

export const values = [
  {
    title: "Compliance-first",
    description: "Sanctions screening, accurate classification, and destination documentation on every shipment.",
  },
  {
    title: "Transparent pricing",
    description: "Product and freight costs itemized before you commit.",
  },
  {
    title: "Single accountability",
    description: "One team owns your supply chain from inquiry to delivery.",
  },
];
