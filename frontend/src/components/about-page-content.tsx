"use client";

import {
  Button,
  CardGrid,
  Container,
  PageSection,
  SectionHeading,
  TrustBadge,
} from "@/components/site-ui";
import { AboutGlobalNetwork } from "@/components/about-global-network";
import { useSiteConfig } from "@/components/site-config-provider";
import { processSteps, site, values } from "@/data/site";
import type { Office } from "@/lib/api";
import { getIndustryIcon } from "@/lib/business-icons";
import { formatStatCount } from "@/lib/format-stat";
import type { ExportProduct, IndustrySector } from "@/lib/types/catalog";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  CubeIcon,
  GlobeAltIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const CAPABILITIES = [
  {
    icon: CheckCircleIcon,
    title: "Sourcing & quality",
    description: "Vetted suppliers and ISO-aligned quality gates on every line.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Compliance desk",
    description: "HS codes, certificates of origin, phytosanitary, and import rules.",
  },
  {
    icon: TruckIcon,
    title: "Freight & logistics",
    description: "FCL, LCL, and air freight with end-to-end shipment tracking.",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Dedicated trade desk",
    description: "One accountable team from inquiry through port-to-door delivery.",
  },
] as const;

const VALUE_ICONS = [ShieldCheckIcon, ScaleIcon, UserGroupIcon] as const;

type AboutPageContentProps = {
  offices: Office[];
  industries: IndustrySector[];
  products: ExportProduct[];
  exportCorridorCount: number;
};

export function AboutPageContent({
  offices,
  industries,
  products,
  exportCorridorCount,
}: AboutPageContentProps) {
  const { founded, yearsExperience } = useSiteConfig();
  const uniqueCategories = new Set(products.map((p) => p.category));
  const yearsInBusiness = yearsExperience;

  const stats = [
    { value: `${yearsInBusiness}+`, label: "Years in export", icon: StarIcon },
    exportCorridorCount > 0 && {
      value: formatStatCount(exportCorridorCount),
      label: "Export corridors",
      icon: GlobeAltIcon,
    },
    products.length > 0 && {
      value: formatStatCount(products.length),
      label: "Catalog products",
      icon: CubeIcon,
    },
    industries.length > 0 && {
      value: formatStatCount(industries.length),
      label: "Active sectors",
      icon: BriefcaseIcon,
    },
    offices.length > 0 && {
      value: formatStatCount(offices.length),
      label: "Global desks",
      icon: BuildingOffice2Icon,
    },
  ].filter(Boolean) as { value: string; label: string; icon: typeof StarIcon }[];

  const displayStats = stats.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-primary py-12 text-white sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "url('/hero/hub1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-dark/93 via-primary/82 to-primary-dark/90"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(14,116,144,0.22),transparent_60%)]"
          aria-hidden
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-light sm:text-sm">
              About {site.shortName}
            </p>
            <h1 className="products-hero-title mt-2 text-pretty text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Export partner built on trust and compliance
            </h1>
            <p className="products-hero-lead mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              Since {founded}, {site.name} connects Indian suppliers to global buyers — products,
              documentation, and logistics under one accountable team.
            </p>

            {displayStats.length > 0 && (
              <div
                className={`mt-8 grid grid-cols-2 gap-3 sm:gap-4 ${
                  displayStats.length <= 2
                    ? "max-w-md mx-auto"
                    : displayStats.length === 3
                      ? "sm:grid-cols-3 max-w-2xl mx-auto"
                      : "sm:grid-cols-4"
                }`}
              >
                {displayStats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/20 bg-white/[0.08] p-4 text-center backdrop-blur-sm"
                    >
                      <StatIcon className="mx-auto mb-2 h-5 w-5 text-teal-300 sm:h-6 sm:w-6" aria-hidden />
                      <p className="text-xl font-bold tabular-nums text-white sm:text-2xl">{stat.value}</p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/85 sm:text-xs">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {site.certifications.slice(0, 3).map((cert) => (
                <TrustBadge
                  key={cert}
                  className="border border-white/25 bg-white/10 text-white backdrop-blur-sm"
                >
                  {cert}
                </TrustBadge>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <PageSection className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
            <div className="rounded-2xl border border-border/70 bg-surface/40 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                  <SparklesIcon className="h-5 w-5 text-accent" aria-hidden />
                </span>
                <h2 className="text-xl font-bold text-primary sm:text-2xl">Our story</h2>
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted">
                What began as a commodity trading desk in Mumbai has grown into a full-service export
                operation — sourcing, compliance, and shipment coordination for buyers across multiple
                continents.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                We work as an extension of your procurement team: transparent pricing, accurate
                documentation, and a single point of accountability from factory gate to destination port.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-foreground sm:text-base">
                <li className="flex items-start gap-2.5">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  DGFT-licensed export house with APEDA-aligned agri programs
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  Desk-led operations with 24/7 trade support
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm">
                <BriefcaseIcon className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold text-primary">Our mission</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  To empower Indian businesses with seamless global trade — quality products, accurate
                  compliance, and reliable logistics on every shipment.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm">
                <StarIcon className="h-6 w-6 text-accent" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold text-primary">Our vision</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  To be the most trusted export partner for buyers who need one team to own sourcing,
                  documentation, and delivery end to end.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </PageSection>

      <PageSection className="bg-surface/40">
        <Container>
          <SectionHeading
            eyebrow="What drives us"
            title="Core values"
            description="The principles behind every inquiry, quotation, and shipment."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-10">
            {values.map((item, i) => {
              const Icon = VALUE_ICONS[i] ?? ShieldCheckIcon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-background p-5 sm:p-6"
                >
                  <Icon className="mb-3 h-6 w-6 text-accent sm:h-7 sm:w-7" aria-hidden />
                  <h3 className="text-base font-bold text-primary sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </PageSection>

      <PageSection className="bg-background">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Full-stack export operations"
            description="One desk coordinates sourcing, compliance, freight, and buyer communication."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:mt-10">
            {CAPABILITIES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-surface/30 p-5 transition-colors hover:border-secondary/30"
                >
                  <Icon className="h-6 w-6 text-secondary" aria-hidden />
                  <h3 className="mt-3 font-semibold text-primary">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </PageSection>

      {industries.length > 0 && (
        <PageSection className="bg-surface/40">
          <Container>
            <SectionHeading
              eyebrow="Sector expertise"
              title="Industries we serve"
              description={`${formatStatCount(industries.length)} active export sectors managed by our trade specialists.`}
            />
            <CardGrid variant="cardsThree" className="mt-8 lg:mt-10">
              {industries.map((industry) => {
                const Icon = getIndustryIcon(industry.slug);
                return (
                  <article
                    key={industry.slug}
                    className="rounded-2xl border border-border/60 bg-background p-5 sm:p-6"
                  >
                    <Icon className="h-7 w-7 text-accent" aria-hidden />
                    <h3 className="mt-3 text-lg font-semibold text-primary">{industry.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                      {industry.description}
                    </p>
                    {industry.complianceTag && (
                      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-secondary">
                        {industry.complianceTag}
                      </p>
                    )}
                  </article>
                );
              })}
            </CardGrid>
            {products.length > 0 && (
              <div className="mt-8 text-center">
                <Button href="/products" variant="outline">
                  Browse {formatStatCount(products.length)} catalog products
                  <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden />
                </Button>
              </div>
            )}
          </Container>
        </PageSection>
      )}

      <PageSection className="bg-background">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="From inquiry to delivery"
            description="A clear, repeatable process so you always know where your shipment stands."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:mt-10">
            {processSteps.map((step) => (
              <li
                key={step.step}
                className="relative rounded-2xl border border-border/60 bg-surface/30 p-5 sm:p-6"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Step {step.step}
                </span>
                <h3 className="mt-2 font-semibold text-primary">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </PageSection>

      <AboutGlobalNetwork offices={offices} exportCorridorCount={exportCorridorCount} />

      <PageSection>
        <Container narrow>
          <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8 text-center sm:p-10">
            <ShieldCheckIcon className="mx-auto h-10 w-10 text-accent" aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-primary sm:text-2xl">
              Certifications & memberships
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-base text-muted">
              Recognized for quality management, export compliance, and industry membership.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {site.certifications.map((cert) => (
                <TrustBadge
                  key={cert}
                  className="border border-border bg-background text-primary"
                >
                  {cert}
                </TrustBadge>
              ))}
            </div>
          </div>
        </Container>
      </PageSection>

      <section className="border-t border-border/60 bg-surface/30 py-12 sm:py-16">
        <Container>
          <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-primary sm:text-2xl">Ready to export with us?</h2>
              <p className="mt-2 max-w-xl text-base text-muted">
                Share your product, destination, and timeline — our desk responds with feasibility and
                pricing within one business day.
              </p>
              {uniqueCategories.size > 0 && (
                <p className="mt-3 text-sm text-muted">
                  Active across {formatStatCount(uniqueCategories.size)} product divisions
                  {exportCorridorCount > 0 && (
                    <> · {formatStatCount(exportCorridorCount)} export corridors</>
                  )}
                </p>
              )}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:mt-0 sm:shrink-0">
              <Button href="/quote" variant="accent" className="w-full sm:w-auto">
                Request export quote
                <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden />
              </Button>
              <Button href="/contact" variant="outline" className="w-full sm:w-auto">
                Contact trade desk
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
