import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketsPageContent } from "@/components/markets-page-content";
import { MarketsPageSkeleton } from "@/components/page-skeletons";
import { fetchExportCountries, fetchMarketRegions } from "@/lib/api";
import { site } from "@/data/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Global Markets | Sundaram Export",
  description: `Export destinations served by ${site.name} — compliance, ports, and buyer networks worldwide.`,
};

async function MarketsPageData() {
  const [countries, regions] = await Promise.all([
    fetchExportCountries(),
    fetchMarketRegions(),
  ]);

  return <MarketsPageContent countries={countries} regions={regions} />;
}

export default function MarketsPage() {
  return (
    <Suspense fallback={<MarketsPageSkeleton />}>
      <MarketsPageData />
    </Suspense>
  );
}
