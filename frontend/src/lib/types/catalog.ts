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

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  agriculture: "Agriculture",
  textiles: "Textiles",
  engineering: "Engineering",
  chemicals: "Chemicals",
  "food-beverage": "Food & beverage",
  handicrafts: "Handicrafts",
};

export function categoryLabelsFromProducts(products: ExportProduct[]): string[] {
  const seen = new Set<ProductCategory>();
  const labels: string[] = [];
  for (const p of products) {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      labels.push(PRODUCT_CATEGORY_LABELS[p.category] ?? p.category);
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
