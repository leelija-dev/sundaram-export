"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CardGrid,
  Container,
  ExportCountryCard,
  MarketCard,
  PageSection,
  SectionHeading,
  TrustBadge,
} from "@/components/site-ui";
import { site } from "@/data/site";
import type { ExportCountry } from "@/lib/api";
import { formatStatCount } from "@/lib/format-stat";
import type { MarketRegionCard } from "@/lib/types/catalog";
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  FunnelIcon,
  GlobeAltIcon,
  MapPinIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

type MarketsPageContentProps = {
  countries: ExportCountry[];
  regions: MarketRegionCard[];
};

function buildRegionFilters(countries: ExportCountry[]) {
  const counts = new Map<string, number>();
  for (const country of countries) {
    const region = country.region_name?.trim();
    if (!region) continue;
    counts.set(region, (counts.get(region) ?? 0) + 1);
  }

  return [
    { slug: "all", label: "All regions", count: countries.length },
    ...Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ slug: label, label, count })),
  ];
}

export function MarketsPageContent({ countries, regions }: MarketsPageContentProps) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const hasCountries = countries.length > 0;
  const hasRegions = regions.length > 0;

  const regionFilters = useMemo(() => buildRegionFilters(countries), [countries]);

  const filteredCountries =
    selectedRegion === "all"
      ? countries
      : countries.filter((country) => country.region_name === selectedRegion);

  const countryStat = formatStatCount(countries.length);
  const regionStat = formatStatCount(regions.length);
  const portCount = countries.reduce((sum, country) => sum + (country.key_ports?.length ?? 0), 0);

  const stats = [
    hasCountries && { value: countryStat, label: "Export countries", icon: GlobeAltIcon },
    hasRegions && { value: regionStat, label: "Regional desks", icon: MapPinIcon },
    portCount > 0 && { value: String(portCount), label: "Key ports", icon: TruckIcon },
  ].filter(Boolean) as { value: string; label: string; icon: typeof GlobeAltIcon }[];

  const heroTitle = hasCountries
    ? `${countryStat} countries we export to`
    : hasRegions
      ? `${regionStat} regional export desks`
      : "Global export destinations";

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-primary py-12 text-white sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('/hero/export-sector.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-dark/92 via-primary/80 to-primary-dark/90" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,116,144,0.2),transparent_60%)]" aria-hidden />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-light sm:text-sm">
              Global markets
            </p>
            <h1 className="products-hero-title mt-2 text-pretty text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {heroTitle}
            </h1>
            <p className="products-hero-lead mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              Compliance, ports, and buyer networks for each destination — managed by our export desk.
            </p>

            {stats.length > 0 && (
              <div
                className={`mt-8 grid grid-cols-1 gap-3 sm:gap-4 ${
                  stats.length === 1
                    ? "max-w-xs mx-auto"
                    : stats.length === 2
                      ? "sm:grid-cols-2 max-w-lg mx-auto"
                      : "sm:grid-cols-3"
                }`}
              >
                {stats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/20 bg-white/[0.08] p-4 text-center backdrop-blur-sm"
                    >
                      <StatIcon className="mx-auto mb-2 h-6 w-6 text-teal-300" aria-hidden />
                      <p className="text-2xl font-bold tabular-nums text-white">{stat.value}</p>
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/85 sm:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className={`flex flex-wrap justify-center gap-2 ${stats.length > 0 ? "mt-6" : "mt-8"}`}>
              <TrustBadge className="border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                Customs clearance ready
              </TrustBadge>
              <TrustBadge className="border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                24/7 trade support
              </TrustBadge>
            </div>
          </div>
        </Container>
      </section>

      <PageSection className="bg-background">
        <Container>
          {hasCountries ? (
            <>
              {regionFilters.length > 1 && (
                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-center gap-2 text-muted">
                    <FunnelIcon className="h-4 w-4 text-accent" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider sm:text-sm">
                      Filter by region
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {regionFilters.map((region) => {
                      const isActive = selectedRegion === region.slug;
                      return (
                        <button
                          key={region.slug}
                          type="button"
                          onClick={() => setSelectedRegion(region.slug)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                            isActive
                              ? "border-secondary/40 bg-secondary/10 text-primary"
                              : "border-border bg-background text-muted hover:border-secondary/30 hover:text-primary"
                          }`}
                        >
                          {region.label}
                          <span className={isActive ? "text-secondary" : "text-muted/70"}>
                            {" "}({region.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <SectionHeading
                eyebrow="Export destinations"
                title={
                  selectedRegion === "all"
                    ? "Countries we export to"
                    : selectedRegion
                }
                description={`${filteredCountries.length} ${
                  filteredCountries.length === 1 ? "destination" : "destinations"
                } with live port and compliance data from our operations team.`}
              />

              {selectedRegion !== "all" && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRegion("all")}
                    className="text-sm font-medium text-secondary transition-colors hover:text-accent"
                  >
                    Clear filter
                  </button>
                </div>
              )}

              {filteredCountries.length > 0 ? (
                <CardGrid variant="cardsTwo" className="mt-8 sm:mt-10 lg:mt-12">
                  {filteredCountries.map((country) => (
                    <ExportCountryCard
                      key={country.id}
                      country={{
                        id: country.id,
                        name: country.name,
                        subtitle: country.subtitle,
                        description: country.description,
                        key_ports: country.key_ports,
                        specialties: country.specialties,
                        region_name: country.region_name,
                      }}
                    />
                  ))}
                </CardGrid>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface/30 py-12 text-center">
                  <p className="text-muted">No countries in this region yet.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedRegion("all")}
                    className="mt-3 text-sm font-medium text-secondary hover:text-accent"
                  >
                    View all countries
                  </button>
                </div>
              )}
            </>
          ) : hasRegions ? (
            <>
              <SectionHeading
                eyebrow="Regional desks"
                title="Export corridors by region"
                description="Each corridor is staffed by trade specialists who understand product-specific import rules."
              />
              <CardGrid variant="cardsTwo" className="mt-8 sm:mt-10 lg:mt-12">
                {regions.map((region) => (
                  <MarketCard key={region.id} market={region} />
                ))}
              </CardGrid>
            </>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-surface/40 py-16 text-center">
              <GlobeAltIcon className="mx-auto mb-3 h-12 w-12 text-muted" aria-hidden />
              <h2 className="text-lg font-semibold text-primary">Markets updating</h2>
              <p className="mx-auto mt-2 max-w-md text-base text-muted">
                Export destinations will appear here once they are published in the export desk.
              </p>
              <Button href="/contact" variant="accent" className="mt-6">
                Contact trade desk
              </Button>
            </div>
          )}

          {hasRegions && hasCountries && (
            <div className="mt-16">
              <SectionHeading
                eyebrow="Regional overview"
                title="Corridor desks"
                description="Broader regional coverage managed alongside country-specific lanes."
              />
              <CardGrid variant="cardsTwo" className="mt-8 sm:mt-10">
                {regions.map((region) => (
                  <MarketCard key={region.id} market={region} />
                ))}
              </CardGrid>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-border/70 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div className="flex items-start gap-3 sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-primary">Don&apos;t see your destination?</p>
                <p className="mt-0.5 text-base text-muted">
                  Share your target country — we confirm feasibility within 48 hours.
                </p>
              </div>
            </div>
            <Button href="/quote" variant="accent" className="mt-4 w-full sm:mt-0 sm:w-auto">
              Request market check
              <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden />
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {site.certifications.map((cert) => (
              <TrustBadge
                key={cert}
                className="border border-border bg-background text-primary"
              >
                {cert}
              </TrustBadge>
            ))}
          </div>
        </Container>
      </PageSection>
    </>
  );
}
