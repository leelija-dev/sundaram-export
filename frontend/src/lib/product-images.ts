/** Curated Unsplash photos for export product cards (slug-specific with category fallbacks). */

function productPhoto(photoId: string, width = 800, height = 500): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

const SLUG_IMAGES: Record<string, string> = {
  // Catalog page (demo listings)
  "premium-basmati-rice": productPhoto("photo-1586201375761-b329b8747ad2"),
  "organic-turmeric-powder": productPhoto("photo-1615485290382-441e4d049cb5"),
  "red-chili-powder": productPhoto("photo-1596040033229-a0b969c41b71"),
  "organic-cotton-textiles": productPhoto("photo-1558171813-1f2acd8251d2"),
  "premium-denim-fabrics": productPhoto("photo-1542272604-787c3835535d"),
  "handloom-silk-sarees": productPhoto("photo-1583391738718-d79bc38ce211"),
  "industrial-gears": productPhoto("photo-1581092160562-40aa08e78837"),
  "automotive-forgings": productPhoto("photo-1486262715619-67b85e0b08d3"),
  "zinc-oxide": productPhoto("photo-1532187863486-abf9dbad1b99"),
  "titanium-dioxide": productPhoto("photo-1565008576549-57569a49371d"),
  "caustic-soda-flakes": productPhoto("photo-1532094349884-543bc11b234d"),
  // API / static catalog
  "spices-oleoresins": productPhoto("photo-1596040033229-a0b969c41b71"),
  "rice-pulses": productPhoto("photo-1586201375761-b329b8747ad2"),
  "cotton-textiles": productPhoto("photo-1558171813-1f2acd8251d2"),
  "engineering-components": productPhoto("photo-1581092160562-40aa08e78837"),
  "industrial-chemicals": productPhoto("photo-1532187863486-abf9dbad1b99"),
  "processed-foods": productPhoto("photo-1546069901-ba9599a7e63c"),
  "handicrafts-home": productPhoto("photo-1452860606245-08befc0ff44b"),
};

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

export function getProductImage(slug: string, category?: string): string {
  return SLUG_IMAGES[slug] ?? (category ? CATEGORY_IMAGES[category] : undefined) ?? DEFAULT_IMAGE;
}
