import { MarketsPageContent } from "@/components/markets-page-content";
import { fetchExportCountries, fetchMarketRegions } from "@/lib/api";
import { site } from "@/data/site";

export const revalidate = 60;

export const metadata = {
  title: "Global Markets | Sundaram Export",
  description: `Export destinations served by ${site.name} — compliance, ports, and buyer networks worldwide.`,
};

export default async function MarketsPage() {
  const [countries, regions] = await Promise.all([
    fetchExportCountries(),
    fetchMarketRegions(),
  ]);

  return <MarketsPageContent countries={countries} regions={regions} />;
}
