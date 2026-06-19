import { Suspense } from "react";
import { HomePageContent } from "@/components/home-page-content";
import { HomePageSkeleton } from "@/components/page-skeletons";
import { fetchExportCountries, fetchIndustries, fetchProducts } from "@/lib/api";

export const revalidate = 60;

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
