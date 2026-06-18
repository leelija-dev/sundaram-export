export type ProductCategory =
  | "agriculture"
  | "textiles"
  | "engineering"
  | "chemicals"
  | "food-beverage"
  | "handicrafts"
  | (string & {});

export type IndustrySector = {
  slug: string;
  name: string;
  description: string;
  complianceTag?: string;
};

export type ExportProduct = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  hsCode?: string;
  origins: string[];
  markets: string[];
  specifications: string[];
  packaging: string[];
  imageUrl?: string;
  createdAt?: string;
};

export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  agriculture: "Agriculture",
  textiles: "Textiles",
  engineering: "Engineering",
  chemicals: "Chemicals",
  "food-beverage": "Food & beverage",
  handicrafts: "Handicrafts",
  spices: "Spices",
};

export function formatCategoryLabel(category: string): string {
  return (
    PRODUCT_CATEGORY_LABELS[category] ??
    category
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function categoryLabelsFromProducts(products: ExportProduct[]): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const p of products) {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      labels.push(formatCategoryLabel(p.category));
    }
  }
  return labels;
}

export type MarketRegionCard = {
  id: string;
  name: string;
  description: string;
  countries: string[];
  keyPorts: string[];
  specialties: string[];
};
