import type { MetadataRoute } from "next";
import { navLinks } from "@/data/site";
import { fetchProducts } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    ...navLinks
      .filter((link) => link.href !== "/")
      .map((link) => ({
        url: absoluteUrl(link.href),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    {
      url: absoluteUrl("/quote"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/products/${product.slug}`),
    lastModified: product.createdAt ? new Date(product.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
