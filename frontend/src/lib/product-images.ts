import { isBackendMediaUrl, resolveMediaUrl } from "@/lib/media-url";

function productPhoto(photoId: string, width = 800, height = 500): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

const CATEGORY_IMAGES: Record<string, string> = {
  spices: productPhoto("photo-1596040033229-a0b969c41b71"),
  agriculture: productPhoto("photo-1574323347407-f5e1ad6d020b"),
  textiles: productPhoto("photo-1558171813-1f2acd8251d2"),
  engineering: productPhoto("photo-1581092160562-40aa08e78837"),
  chemicals: productPhoto("photo-1532187863486-abf9dbad1b99"),
  "food-beverage": productPhoto("photo-1546069901-ba9599a7e63c"),
  handicrafts: productPhoto("photo-1452860606245-08befc0ff44b"),
};

const DEFAULT_IMAGE = productPhoto("photo-1566576721346-d4a3b4eaeb85");

export function getProductImage(
  _slug: string,
  category?: string,
  imageUrl?: string | null,
): string {
  const backendImage = resolveMediaUrl(imageUrl);
  if (backendImage) return backendImage;

  return (category ? CATEGORY_IMAGES[category] : undefined) ?? DEFAULT_IMAGE;
}

export function productImageUsesBackend(src: string): boolean {
  return isBackendMediaUrl(src);
}
