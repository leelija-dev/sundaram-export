import type { Metadata } from "next";
import { Suspense } from "react";
import { HomePageContent } from "@/components/home-page-content";
import { HomePageSkeleton } from "@/components/page-skeletons";
import { site } from "@/data/site";
import { fetchExportCountries, fetchIndustries, fetchProducts } from "@/lib/api";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description: `${site.tagline} ${site.description} Request export quotes, browse products, and explore global markets served by ${site.name}.`,
  path: "/",
  keywords: [
    "Indian export company homepage",
    "global export partner India",
    "agricultural export Mumbai",
    "international trade desk",
  ],
});
async function HomePageData() {
  const [products, industries, countries] = await Promise.all([
    fetchProducts(),
    fetchIndustries(),
    fetchExportCountries(),
  ]);

  const uniqueMarkets = new Set(
    products.flatMap((product) => product.markets).filter((market) => market.trim().length > 0),
  );
  const exportCorridorCount =
    countries.length > 0 ? countries.length : uniqueMarkets.size;

  return (
    <HomePageContent
      products={products}
      industries={industries}
      exportCorridorCount={exportCorridorCount}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageData />
    </Suspense>
  );
}
