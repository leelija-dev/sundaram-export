"use client";

import Link from "next/link";
import { HomeHero } from "@/components/home-hero";
import {
  Button,
  CardGrid,
  Container,
  PageSection,
  ProductCard,
  SectionHeading,
} from "@/components/site-ui";
import { useSiteConfig } from "@/components/site-config-provider";
import { processSteps, site, values } from "@/data/site";
import { getIndustryIcon } from "@/lib/business-icons";
import { formatStatCount } from "@/lib/format-stat";
import type { ExportProduct, IndustrySector } from "@/lib/types/catalog";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ScaleIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const CAPABILITIES = [
  {
    icon: CheckCircleIcon,
    title: "Sourcing & quality",
    desc: "Vetted suppliers and ISO-aligned quality gates.",
  },
  {
    icon: DocumentTextIcon,
    title: "Documentation desk",
    desc: "HS codes, COO, phytosanitary, and import compliance.",
  },
  {
    icon: TruckIcon,
    title: "Freight & logistics",
    desc: "FCL, LCL, and air freight with tracking.",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Dedicated trade desk",
    desc: "One account owner from inquiry to delivery.",
  },
] as const;

const VALUE_ICONS = [ShieldCheckIcon, ScaleIcon, UserGroupIcon] as const;
const HOME_INDUSTRIES_LIMIT = 4;

type HomePageContentProps = {
  products: ExportProduct[];
  industries: IndustrySector[];
  exportCorridorCount: number;
};

export function HomePageContent({ products, industries, exportCorridorCount }: HomePageContentProps) {
  const { email, phone } = useSiteConfig();
  const featuredProducts = products.slice(0, 3);
  const featuredIndustries = industries.slice(0, HOME_INDUSTRIES_LIMIT);
  const productCategoryCount = new Set(products.map((p) => p.category)).size;
  const activeSectorsLabel = formatStatCount(industries.length, 10);
  const exportCorridorsLabel = formatStatCount(exportCorridorCount, 90);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <HomeHero
        exportCorridorCount={exportCorridorCount}
        industryCount={industries.length}
        productCategoryCount={productCategoryCount}
        productCount={products.length}
      />

      {/* Core values */}
      <PageSection className="content-auto bg-background !mt-16 !pt-8 !pb-10 sm:!mt-20 sm:!pt-10 sm:!pb-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {values.map((item, i) => {
              const Icon = VALUE_ICONS[i] ?? ShieldCheckIcon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-surface/50 p-4 sm:rounded-2xl sm:p-5 lg:p-6"
                >
                  <Icon className="mb-3 h-6 w-6 text-accent sm:h-7 sm:w-7" aria-hidden />
                  <h3 className="text-base font-bold text-primary sm:text-lg">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </PageSection>

      {/* Product divisions */}
      <PageSection className="content-auto bg-surface/40">
        <Container>
          <SectionHeading
            eyebrow="Export products"
            title="Six divisions. One export desk."
            description="Agri, textiles, engineering, chemicals, food, and retail — sourced and shipped under one team."
          />
          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <Button href="/products" variant="accent" fullWidthOnMobile className="px-6 py-2.5 text-sm text-white hover:text-white sm:w-auto">
              Browse full catalog
            </Button>
            <Button
              href="/quote"
              variant="outline"
              fullWidthOnMobile
              className="border-primary/25 text-primary hover:border-accent hover:text-accent sm:w-auto"
            >
              Request a quote
            </Button>
          </div>
          {featuredProducts.length > 0 ? (
            <CardGrid variant="cardsThree" className="mt-8 sm:mt-10 lg:mt-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </CardGrid>
          ) : (
            <p className="mt-8 text-center text-sm text-muted">Product catalog loading…</p>
          )}
        </Container>
      </PageSection>

      {/* Export desk capabilities */}
      <PageSection className="content-auto relative overflow-hidden border-y border-white/10 bg-primary text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_8%_12%,rgba(14,116,144,0.22),transparent_52%),radial-gradient(ellipse_70%_55%_at_92%_88%,rgba(217,119,6,0.18),transparent_58%)]"
          aria-hidden
        />

        <Container className="relative">
          <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
            <div className="lg:col-span-5">
              <p className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm">
                Full-service export house
              </p>
                <h2 className="mt-3 text-pretty text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  Everything buyers need — under one roof
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/80 sm:mt-4 sm:text-lg">
                  Sourcing, compliance, documentation, and port-to-door logistics for global procurement teams.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7">
                  <div className="rounded-xl border border-white/15 p-3.5 sm:p-4">
                    <p className="text-xl font-black text-accent sm:text-2xl">{exportCorridorsLabel}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/70 sm:text-sm">
                      Countries served
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/15 p-3.5 sm:p-4">
                    <p className="text-xl font-black text-accent sm:text-2xl">24/7</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/70 sm:text-sm">
                      Operations desk
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <Button
                    href="/about"
                    variant="outline"
                    className="border-white/30 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
                  >
                    About our export desk
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-7">
                {CAPABILITIES.map((item) => (
                  <article
                    key={item.title}
                    className="group relative overflow-hidden rounded-xl border border-white/15 p-4 transition-all duration-300 hover:border-accent/40 sm:rounded-2xl sm:p-5"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden
                    />
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent/25 to-secondary/20 ring-1 ring-accent/25 sm:h-11 sm:w-11">
                        <item.icon className="h-5 w-5 text-accent" aria-hidden />
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white sm:text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75 sm:text-base">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>
        </Container>
      </PageSection>

      {/* Export process */}
      <PageSection className="content-auto">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="From inquiry to port delivery"
            description="A four-stage process for compliance, transparency, and on-time execution."
          />
          <ol className="home-process-grid mt-8 sm:mt-10 lg:mt-12">
            {processSteps.map((step) => (
              <li
                key={step.step}
                className="home-process-step relative min-w-0 rounded-xl border border-border/60 bg-background p-5 sm:p-6"
              >
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent/15 to-secondary/15 text-sm font-black text-accent sm:mb-4 sm:h-10 sm:w-10 sm:text-base">
                  {step.step}
                </span>
                <h3 className="text-base font-semibold text-primary sm:text-lg">{step.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </PageSection>

      {/* Industries */}
      {industries.length > 0 && (
      <PageSection className="content-auto relative overflow-hidden border-y border-border/50 bg-gradient-to-br from-background via-surface/60 to-background">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.1]"
          style={{ backgroundImage: "url('/hero/export-sector.jpg')" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_100%_0%,rgba(14,116,144,0.18),transparent_62%),radial-gradient(ellipse_85%_75%_at_0%_100%,rgba(217,119,6,0.14),transparent_58%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/[0.07] via-transparent to-accent/[0.08]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(18,58,82,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(18,58,82,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-[min(100%,42rem)] w-[min(90vw,42rem)] rounded-full bg-secondary/20 blur-[100px] sm:-right-20 sm:h-[36rem] sm:w-[36rem]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-[min(100%,40rem)] w-[min(90vw,40rem)] rounded-full bg-accent/18 blur-[100px] sm:-left-20 sm:h-[34rem] sm:w-[34rem]"
          aria-hidden
        />

        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                align="left"
                eyebrow="Sector expertise"
                title="Industries we serve"
                description="Dedicated export squads with sector-specific documentation and quality gates."
              />

              <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8">
                <div className="rounded-xl border border-border/70 bg-background/80 p-3.5 backdrop-blur-sm sm:p-4">
                  <p className="text-2xl font-bold tabular-nums text-primary sm:text-3xl">{activeSectorsLabel}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted sm:text-sm">
                    Active sectors
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/80 p-3.5 backdrop-blur-sm sm:p-4">
                  <p className="text-2xl font-bold tabular-nums text-primary sm:text-3xl">{exportCorridorsLabel}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-muted sm:text-sm">
                    Export corridors
                  </p>
                </div>
              </div>

              <Link
                href="/industries"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:shadow-lg sm:mt-8"
              >
                View industry capabilities
                <ArrowRightIcon className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:gap-5">
              {featuredIndustries.map((ind) => {
                const Icon = getIndustryIcon(ind.slug);
                const tag = ind.complianceTag ?? "Export-ready";

                return (
                  <article
                    key={ind.slug}
                    className="group relative flex min-h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-6"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-secondary via-accent to-secondary transition-transform duration-300 group-hover:scale-x-100"
                      aria-hidden
                    />

                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/25 ring-1 ring-accent/25 shadow-sm shadow-accent/10 transition-all duration-300 group-hover:from-secondary/30 group-hover:to-accent/35 group-hover:ring-accent/40 sm:h-12 sm:w-12">
                        <Icon
                          className="h-5 w-5 text-accent transition-colors group-hover:text-accent-light sm:h-6 sm:w-6"
                          aria-hidden
                        />
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-primary sm:text-xl">{ind.name}</h3>
                    <p className="mt-2 flex-1 text-base leading-relaxed text-muted">{ind.description}</p>

                    {tag && (
                      <div className="mt-4 border-t border-border/60 pt-4">
                        <span className="text-xs font-medium text-secondary sm:text-sm">{tag}</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </PageSection>
      )}

      {/* Testimonial + certifications */}
      <PageSection className="content-auto border-y border-border/60 bg-surface/30">
        <Container>
          <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
              <StarIcon className="mb-4 h-8 w-8 text-accent sm:h-9 sm:w-9" aria-hidden />
              <blockquote className="text-base leading-relaxed text-foreground/90 sm:text-lg">
                &ldquo;Sundaram Export has been our trusted partner for five years. Their compliance team
                and logistics desk are unmatched for regulated agricultural shipments.&rdquo;
              </blockquote>
              <p className="mt-4 text-base font-semibold text-primary">
                Senior Procurement Director
              </p>
              <p className="text-sm text-muted">European trading group</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
                Certifications & memberships
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                Export-ready from day one
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
                Accredited quality systems and export credentials recognized worldwide.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
                {site.certifications.map((cert) => (
                  <li
                    key={cert}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-primary sm:text-base"
                  >
                    <BuildingOffice2Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </PageSection>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-primary py-12 text-white sm:py-16 md:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(14,116,144,0.2),transparent)]" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl min-w-0 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
              Start your export journey
            </p>
            <h2 className="mt-2 text-pretty text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Ready to ship with us?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/80 sm:mt-4 sm:text-lg">
              Share your specs and destination — we respond with sourcing options and a freight quote within one business day.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                href="/quote"
                variant="accent"
                fullWidthOnMobile
                className="px-8 py-3 text-sm font-bold text-white shadow-lg shadow-accent/25 hover:text-white sm:text-base"
              >
                Get a free export quote
              </Button>
              <Button
                href="/contact"
                variant="outline"
                fullWidthOnMobile
                className="border-white/30 bg-white/5 text-white hover:border-white/50 hover:bg-white/10 sm:text-base"
              >
                Talk to trade desk
              </Button>
            </div>
            <p className="mt-5 text-sm text-white/60 sm:mt-6 sm:text-base">
              {email} · {phone}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
