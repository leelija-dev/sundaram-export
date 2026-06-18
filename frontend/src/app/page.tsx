import { HomePageContent } from "@/components/home-page-content";
import { fetchExportCountries, fetchIndustries, fetchProducts } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
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
