import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import {
  Button,
  CardGrid,
  Container,
  ExportCountryCard,
  IndustryCard,
  PageSection,
  ProcessSteps,
  ProductCard,
  SectionHeading,
} from "@/components/site-ui";
import { industries } from "@/data/industries";
import { processSteps, site, stats } from "@/data/site";
import { fetchExportCountries, fetchProducts } from "@/lib/api";

export const revalidate = 60;

export default async function HomePage() {
  const [products, countries] = await Promise.all([fetchProducts(), fetchExportCountries()]);
  const featuredProducts = products.slice(0, 3);
  const featuredCountries = countries.slice(0, 6);

  return (
    <>
      <HomeHero productCount={products.length} countryCount={countries.length} />

      <section className="border-b border-border bg-background py-8 sm:py-12 lg:py-14">
        <Container>
          <CardGrid variant="stats">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-accent sm:text-3xl md:text-4xl lg:text-[2.75rem]">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm lg:text-base">{stat.label}</p>
              </div>
            ))}
          </CardGrid>
        </Container>
      </section>

      <PageSection>
        <Container>
          <SectionHeading
            eyebrow="Export products"
            title="Six divisions. Global demand."
            description="From farm-gate spices to precision engineering — sourced, certified, and shipped under one roof."
          />
          {featuredProducts.length > 0 ? (
            <CardGrid variant="cards" className="mt-8 sm:mt-12 lg:mt-14">
              {featuredProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </CardGrid>
          ) : (
            <p className="mt-8 text-center text-sm text-muted">
              Product catalog coming soon —{" "}
              <Link href="/contact" className="font-semibold text-secondary hover:text-primary">
                contact us
              </Link>{" "}
              for export inquiries.
            </p>
          )}
          <div className="mt-8 text-center sm:mt-10 lg:mt-12">
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-secondary hover:text-primary"
            >
              View all product lines →
            </Link>
          </div>
        </Container>
      </PageSection>

      <PageSection>
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="From inquiry to delivery"
            description="A disciplined export process built for first-time exporters and enterprise supply chains alike."
          />
          <div className="mt-8 sm:mt-12 lg:mt-14">
            <ProcessSteps steps={processSteps} />
          </div>
        </Container>
      </PageSection>

      <PageSection className="bg-surface">
        <Container>
          <SectionHeading
            eyebrow="Export destinations"
            title={
              featuredCountries.length > 0
                ? "Countries we ship to worldwide"
                : "Presence across major trade corridors"
            }
            description="Destinations managed by our export desk — compliance, ports, and buyer networks."
          />
          {featuredCountries.length > 0 ? (
            <CardGrid variant="cardsThree" className="mt-8 sm:mt-12 lg:mt-14">
              {featuredCountries.map((c) => (
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
          ) : (
            <p className="mt-8 text-center text-sm text-muted">
              Export destinations are being updated.{" "}
              <Link href="/markets" className="font-semibold text-secondary hover:text-primary">
                View markets
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-semibold text-secondary hover:text-primary">
                contact us
              </Link>
              .
            </p>
          )}
          <div className="mt-8 text-center sm:mt-10 lg:mt-12">
            <Link
              href="/markets"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-secondary hover:text-primary"
            >
              Explore all markets →
            </Link>
          </div>
        </Container>
      </PageSection>

      <PageSection>
        <Container>
          <SectionHeading
            eyebrow="Industries"
            title="Sector expertise you can verify"
            description="Dedicated squads for agriculture, textiles, engineering, chemicals, food, and retail channels."
          />
          <CardGrid variant="cards" className="mt-8 sm:mt-12 lg:mt-14">
            {industries.map((ind) => (
              <IndustryCard key={ind.name} name={ind.name} description={ind.description} />
            ))}
          </CardGrid>
        </Container>
      </PageSection>

      <section className="bg-primary py-12 text-white sm:py-16 lg:py-20">
        <Container className="flex flex-col items-stretch justify-between gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left lg:gap-12">
          <div className="min-w-0 flex-1">
            <h2 className="text-pretty text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">
              Start your next export shipment
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base lg:mt-3 lg:text-lg">
              Product sourcing and shipment coordination — one team accountable end to end.
            </p>
          </div>
          <Button
            href="/quote"
            variant="accent"
            fullWidthOnMobile
            className="shrink-0 px-8 py-3 text-base sm:w-auto lg:px-10"
          >
            Get a quote
          </Button>
        </Container>
      </section>
    </>
  );
}
