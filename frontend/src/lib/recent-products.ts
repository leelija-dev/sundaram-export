import { getProductImage } from "@/lib/product-images";
import type { ExportProduct } from "@/lib/types/catalog";

export type ProductHeroSlice = {
  slug: string;
  title: string;
  imageSrc: string;
};

const HERO_SLICE_LIMIT = 5;

export function selectRecentProductHeroSlices(
  products: ExportProduct[],
  limit = HERO_SLICE_LIMIT,
): ProductHeroSlice[] {
  const sorted = [...products].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (bTime !== aTime) return bTime - aTime;
    return a.title.localeCompare(b.title);
  });

  return sorted.slice(0, limit).map((product) => ({
    slug: product.slug,
    title: product.title,
    imageSrc: getProductImage(product.slug, product.category, product.imageUrl),
  }));
}
