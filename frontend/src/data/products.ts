export type ProductCategory =
  | "agriculture"
  | "textiles"
  | "engineering"
  | "chemicals"
  | "food-beverage"
  | "handicrafts";

export type ExportProduct = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  hsCode?: string;
  origins: string[];
  markets: string[];
  specifications: string[];
  packaging: string[];
};

export const products: ExportProduct[] = [
  {
    slug: "spices-oleoresins",
    title: "Spices & Oleoresins",
    shortDescription: "Turmeric, chili, cumin, pepper, and steam-sterilized oleoresins.",
    description:
      "Premium-grade spices sourced from certified farms with steam sterilization, mesh sizing, and EU/US residue compliance. Available in bulk, retail-ready, and private-label packaging.",
    category: "agriculture",
    hsCode: "0904–0910",
    origins: ["India — Kerala, Gujarat, Andhra Pradesh"],
    markets: ["USA", "EU", "GCC", "Japan", "Australia"],
    specifications: ["ASTA color value", "Steam sterilized", "Moisture & ash certificates", "Organic options"],
    packaging: ["25 kg PP bags", "Cartons 10×1 kg", "Drums for oleoresins"],
  },
  {
    slug: "rice-pulses",
    title: "Rice, Pulses & Grains",
    shortDescription: "Basmati, non-basmati rice, lentils, and chickpeas for global retail & HORECA.",
    description:
      "Export of long-grain basmati, parboiled rice, and protein-rich pulses with fumigation certificates and phytosanitary documentation for strict import markets.",
    category: "agriculture",
    hsCode: "1006 / 0713",
    origins: ["India — Punjab, Haryana, Madhya Pradesh"],
    markets: ["Middle East", "Africa", "EU", "North America"],
    specifications: ["Crop year traceability", "Sortex cleaned", "Pesticide MRL reports"],
    packaging: ["5–50 kg PP woven bags", "Retail pouches", "Container stuffing supervision"],
  },
  {
    slug: "cotton-textiles",
    title: "Cotton Textiles & Apparel",
    shortDescription: "Greige fabric, home textiles, and ready-made garments.",
    description:
      "Integrated supply from mill to FOB shipment — cotton bedsheets, towels, knitted wear, and woven apparel with buyer-specific labeling and barcode compliance.",
    category: "textiles",
    hsCode: "5208–6309",
    origins: ["India — Tamil Nadu, Gujarat, Karnataka"],
    markets: ["USA", "UK", "EU", "Canada", "Japan"],
    specifications: ["OEKO-TEX options", "GOTS organic cotton", "Buyer label compliance"],
    packaging: ["Cartons on pallets", "Vacuum bales", "Garment on hanger (GOH)"],
  },
  {
    slug: "engineering-components",
    title: "Engineering & Auto Components",
    shortDescription: "Precision castings, fasteners, and OEM auto parts.",
    description:
      "ISO-certified manufacturing partners deliver machined components, forgings, and aftermarket auto parts with material test certificates and PPAP documentation for automotive buyers.",
    category: "engineering",
    hsCode: "7326 / 8708",
    origins: ["India — Pune, Chennai, Rajkot"],
    markets: ["USA", "Germany", "Mexico", "Brazil", "Thailand"],
    specifications: ["Material test reports", "PPAP Level 3", "Dimensional inspection reports"],
    packaging: ["Wooden crates", "VCI anti-rust packs", "Returnable OEM racks"],
  },
  {
    slug: "industrial-chemicals",
    title: "Industrial Chemicals & Intermediates",
    shortDescription: "Specialty chemicals, dyes, and pharma intermediates.",
    description:
      "Export of REACH-registered intermediates, reactive dyes, and API precursors with SDS, COA, and DG handling where applicable — coordinated with our compliance team.",
    category: "chemicals",
    hsCode: "2904–2942",
    origins: ["India — Gujarat, Maharashtra"],
    markets: ["EU", "USA", "South Korea", "Turkey", "Brazil"],
    specifications: ["COA per batch", "REACH registration refs", "DG / IMDG classification"],
    packaging: ["HDPE drums", "ISO tanks", "Fiberboard boxes"],
  },
  {
    slug: "processed-foods",
    title: "Processed Foods & Ingredients",
    shortDescription: "Frozen seafood, fruit pulp, dehydrated vegetables, and RTE ingredients.",
    description:
      "HACCP-certified facilities supply IQF seafood, aseptic fruit pulp, and dehydrated ingredients with cold-chain logistics managed by our in-house freight desk.",
    category: "food-beverage",
    hsCode: "0306 / 2009",
    origins: ["India — Kerala, Maharashtra, Andhra Pradesh"],
    markets: ["USA", "EU", "Russia", "SE Asia", "Australia"],
    specifications: ["HACCP / FSSC", "Health certificates", "Cold-chain integrity logs"],
    packaging: ["IQF cartons", "Aseptic bags in drums", "Pouches with gas flushing"],
  },
  {
    slug: "handicrafts-home",
    title: "Handicrafts & Home Décor",
    shortDescription: "Brassware, textiles, furniture, and sustainable home products.",
    description:
      "Curated artisan collections with social-compliance audits and consolidated LCL programs for boutique retailers and e-commerce brands worldwide.",
    category: "handicrafts",
    hsCode: "4414 / 7418",
    origins: ["India — Rajasthan, Uttar Pradesh, Jodhpur"],
    markets: ["USA", "EU", "Australia", "Japan"],
    specifications: ["Artisan provenance", "Lead-free finishes", "Fumigation for wood"],
    packaging: ["Gift boxes", "Flat-pack furniture", "Consolidated LCL"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const productCategories: { id: ProductCategory; label: string }[] = [
  { id: "agriculture", label: "Agriculture" },
  { id: "textiles", label: "Textiles" },
  { id: "engineering", label: "Engineering" },
  { id: "chemicals", label: "Chemicals" },
  { id: "food-beverage", label: "Food & beverage" },
  { id: "handicrafts", label: "Handicrafts" },
];
