import {
  CardGrid,
  Container,
  ExportCountryCard,
  MarketCard,
  PageHero,
  PageSection,
  SectionHeading,
} from "@/components/site-ui";
import { site } from "@/data/site";
import { fetchExportCountries, fetchMarketRegions } from "@/lib/api";

export const revalidate = 60;

export const metadata = {
  title: "Global Markets",
  description: `Export destinations served by ${site.name}.`,
};

export default async function MarketsPage() {
  const [countries, regions] = await Promise.all([
    fetchExportCountries(),
    fetchMarketRegions(),
  ]);

  const hasCountries = countries.length > 0;
  const hasRegions = regions.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Export destinations"
        title={
          hasCountries
            ? `${countries.length}+ countries we export to`
            : hasRegions
              ? "Global export corridors"
              : "Export destinations"
        }
        description="Each destination is managed by our export desk — compliance, ports, and buyer networks for your product lines."
      />
      <PageSection>
        <Container>
          {hasCountries ? (
            <>
              <SectionHeading
                title="Countries we export to"
                description="Updated live from our operations team."
              />
              <CardGrid variant="cardsTwo" className="mt-8 sm:mt-12 lg:mt-14">
                {countries.map((c) => (
                  <ExportCountryCard
                    key={c.id}
                    country={{
                      id: c.id,
                      name: c.name,
                      subtitle: c.subtitle,
                      description: c.description,
                      key_ports: c.key_ports,
                      specialties: c.specialties,
                      region_name: c.region_name,
                    }}
                  />
                ))}
              </CardGrid>
            </>
          ) : hasRegions ? (
            <>
              <SectionHeading
                title="Regional export desks"
                description="Each corridor is staffed by trade specialists who understand product-specific import rules."
              />
              <CardGrid variant="cardsTwo" className="mt-8 sm:mt-12 lg:mt-14">
                {regions.map((region) => (
                  <MarketCard key={region.id} market={region} />
                ))}
              </CardGrid>
            </>
          ) : (
            <p className="mt-8 text-center text-sm text-muted">
              No export destinations published yet.{" "}
              <a href="/contact" className="font-semibold text-secondary hover:text-primary">
                Contact us
              </a>{" "}
              to discuss your target market.
            </p>
          )}
          <div className="mt-10 rounded-2xl border border-secondary/30 bg-secondary/10 p-5 text-center sm:mt-16 sm:p-8">
            <h3 className="text-base font-semibold text-primary sm:text-lg">
              Don&apos;t see your destination?
            </h3>
            <p className="mt-2 text-sm text-foreground/90">
              We regularly open new lanes. Share your target country and product — we&apos;ll confirm
              feasibility.
            </p>
            <a
              href="/quote"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-secondary hover:text-primary"
            >
              Request a market feasibility check →
            </a>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
