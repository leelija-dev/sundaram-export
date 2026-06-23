import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutPageContent } from "@/components/about-page-content";
import { AboutPageSkeleton } from "@/components/page-skeletons";
import { JsonLd } from "@/components/json-ld";
import {
  fetchExportCountries,
  fetchIndustries,
  fetchOffices,
  fetchProducts,
} from "@/lib/api";
import { site } from "@/data/site";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description: `Learn about ${site.name} — ${site.tagline.toLowerCase()} Discover our export operations, sector expertise, global trade desks, and compliance-first approach to international trade since our founding.`,
  path: "/about",
  keywords: [
    "about Sundaram Export",
    "export company India history",
    "international trade team",
    "export compliance India",
    "global trade desks",
  ],
});

async function AboutPageData() {
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

  return <AboutPageContent offices={offices} industries={industries} products={products} exportCorridorCount={exportCorridorCount} />;
}

export default function AboutPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Suspense fallback={<AboutPageSkeleton />}>
        <AboutPageData />
      </Suspense>
    </>
  );
}
