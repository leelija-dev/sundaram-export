/** Brand palette — used across the site via Tailwind theme tokens */
export const brand = {
  primary: "#0A2540",
  secondary: "#2563EB",
  accent: "#F59E0B",
  background: "#FFFFFF",
  text: "#1F2937",
} as const;

export const site = {
  name: "Sundaram Export",
  shortName: "Sundaram",
  tagline: "Multinational export partner for premium products worldwide",
  description:
    "We export premium agricultural commodities, textiles, engineering goods, and chemicals to buyers in 90+ countries — with sourcing, certification, and shipment coordination from one accountable team.",
  email: "exports@sundaramexport.com",
  phone: "+91 22 4000 1200",
  phoneAlt: "+1 (713) 555 0142",
  address: "Sundaram Trade Tower, Bandra Kurla Complex, Mumbai 400051, India",
  addressUS: "2400 Port Commerce Parkway, Houston, TX 77029, USA",
  founded: 1998,
  certifications: ["ISO 9001:2015", "FIEO Member", "APEDA Registered", "DGFT Licensed"],
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/markets", label: "Global Markets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const stats = [
  { value: "90+", label: "Countries served" },
  { value: "18K+", label: "Shipments annually" },
  { value: "6", label: "Product divisions" },
  { value: "24/7", label: "Operations desk" },
];

export const processSteps = [
  {
    step: "01",
    title: "Inquiry & specification",
    description: "Share product grades, packaging, Incoterms, and destination requirements.",
  },
  {
    step: "02",
    title: "Sourcing & compliance",
    description: "We validate suppliers, HS codes, licenses, and destination import rules.",
  },
  {
    step: "03",
    title: "Logistics execution",
    description: "Freight booking, documentation, insurance, and milestone tracking.",
  },
  {
    step: "04",
    title: "Delivery & support",
    description: "Port-to-door coordination with post-shipment documentation and claims support.",
  },
];

export const values = [
  {
    title: "Compliance-first",
    description: "Every shipment is screened for sanctions, classification accuracy, and destination documentation.",
  },
  {
    title: "Transparent pricing",
    description: "Product and freight costs are itemized before you commit to a shipment.",
  },
  {
    title: "Single accountability",
    description: "One account team owns your product supply chain from inquiry through delivery.",
  },
];

export const offices = [
  {
    region: "Headquarters — India",
    address: site.address,
    phone: site.phone,
    email: site.email,
  },
  {
    region: "Americas",
    address: site.addressUS,
    phone: site.phoneAlt,
    email: "americas@sundaramexport.com",
  },
  {
    region: "Europe & MENA",
    address: "Frankfurt Trade Hub, Mainzer Landstraße 250, 60326 Frankfurt, Germany",
    phone: "+49 69 8000 4500",
    email: "eu@sundaramexport.com",
  },
];
