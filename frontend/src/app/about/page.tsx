import { AboutPageContent } from "@/components/about-page-content";
import {
  fetchExportCountries,
  fetchIndustries,
  fetchOffices,
  fetchProducts,
} from "@/lib/api";
import { site } from "@/data/site";

export const revalidate = 60;

export const metadata = {
  title: "About Us | Sundaram Export",
  description: `Learn about ${site.name} — export operations, sector expertise, and global trade desks.`,
};

export default async function AboutPage() {
  const [offices, industries, products, countries] = await Promise.all([
    fetchOffices(),
    fetchIndustries(),
    fetchProducts(),
    fetchExportCountries(),
  ]);

  const uniqueMarkets = new Set(
    products.flatMap((product) => product.markets).filter((market) => market.trim().length > 0),
  );
  const exportCorridorCount =
    countries.length > 0 ? countries.length : uniqueMarkets.size;

  return (
    <AboutPageContent
      offices={offices}
      industries={industries}
      products={products}
      exportCorridorCount={exportCorridorCount}
    />
  );
}
