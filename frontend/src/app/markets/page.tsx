import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketsPageContent } from "@/components/markets-page-content";
import { MarketsPageSkeleton } from "@/components/page-skeletons";
import { JsonLd } from "@/components/json-ld";
import { fetchExportCountries, fetchMarketRegions } from "@/lib/api";
import { site } from "@/data/site";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Global Markets",
  description: `Explore export destinations served by ${site.name} — regional market profiles, key ports, buyer networks, compliance requirements, and trade corridors across Asia, Europe, the Americas, and beyond.`,
  path: "/markets",
  keywords: [
    "export markets India",
    "global export destinations",
    "international trade corridors",
    "export ports India",
    "worldwide buyer network",
  ],
});

async function MarketsPageData() {
  const [countries, regions] = await Promise.all([
    fetchExportCountries(),
    fetchMarketRegions(),
  ]);

  return <MarketsPageContent countries={countries} regions={regions} />;
}

export default function MarketsPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Global Markets", path: "/markets" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Suspense fallback={<MarketsPageSkeleton />}>
        <MarketsPageData />
      </Suspense>
    </>
  );
}
