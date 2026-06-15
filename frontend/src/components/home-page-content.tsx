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
import { industries } from "@/data/industries";
import { processSteps, site, values } from "@/data/site";
import type { ExportProduct } from "@/lib/types/catalog";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  MapPinIcon,
  ScaleIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const TRUSTED_CLIENTS = ["Nestlé", "Unilever", "Tata Group", "Mahindra", "ITC Limited", "Godrej"];

const CAPABILITIES = [
  {
    icon: CheckCircleIcon,
    title: "Sourcing & quality",
    desc: "Vetted suppliers, batch testing, and ISO-aligned quality gates before dispatch.",
  },
  {
    icon: DocumentTextIcon,
    title: "Documentation desk",
    desc: "HS codes, COO, phytosanitary certs, and destination import compliance handled in-house.",
  },
  {
    icon: TruckIcon,
    title: "Freight & logistics",
    desc: "FCL, LCL, and air freight with insurance, tracking, and port coordination.",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Dedicated trade desk",
    desc: "Single account owner from inquiry through delivery — 24/7 operations support.",
  },
] as const;

const VALUE_ICONS = [ShieldCheckIcon, ScaleIcon, UserGroupIcon] as const;

type HomePageContentProps = {
  products: ExportProduct[];
};

export function HomePageContent({ products }: HomePageContentProps) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <HomeHero />

      {/* Trusted buyers marquee */}
      <PageSection className="content-auto !pt-16 !pb-6 sm:!pt-20 sm:!pb-8">
        <Container>
          <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:mb-5 sm:text-xs">
            Trusted by procurement teams worldwide
          </p>
          <div className="relative w-full min-w-0 overflow-hidden rounded-xl border border-primary/10 bg-primary shadow-lg shadow-primary/10 sm:rounded-2xl">
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-primary to-transparent sm:w-16" />
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-primary to-transparent sm:w-16" />
            <div className="marquee-track py-3 sm:py-4">
              {[...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS].map((name, index) => (
                <span key={`${name}-${index}`} className="marquee-item">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </PageSection>

      {/* Core values */}
      <PageSection className="content-auto !py-8 sm:!py-10">
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
                  <h3 className="text-sm font-bold text-primary sm:text-base">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">{item.description}</p>
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
            description="Agricultural commodities, textiles, engineering, chemicals, food, and retail — sourced, certified, and shipped under one accountable team."
          />
          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <Button href="/products" variant="accent" fullWidthOnMobile className="px-6 py-2.5 text-sm sm:w-auto">
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
      <PageSection className="content-auto bg-primary text-white">
        <Container>
          <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
                Full-service export house
              </p>
              <h2 className="mt-2 text-pretty text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Everything buyers need — under one roof
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base">
                From farm-gate spices to precision engineering components, our desk manages sourcing,
                compliance, documentation, and port-to-door logistics for first-time exporters and global
                procurement teams alike.
              </p>
              <div className="mt-5 flex items-start gap-2 sm:mt-6 sm:items-center">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent sm:mt-0" aria-hidden />
                <p className="text-sm text-white/75">
                  Headquartered in Mumbai · Desk coverage across{" "}
                  <strong className="font-semibold text-white">90+ countries</strong>
                </p>
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
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:p-5"
                >
                  <item.icon className="mb-3 h-6 w-6 text-accent" aria-hidden />
                  <h3 className="text-sm font-semibold text-white sm:text-base">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60 sm:text-sm">{item.desc}</p>
                </div>
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
            description="A disciplined four-stage process built for compliance, transparency, and on-time execution."
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
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </PageSection>

      {/* Industries */}
      <PageSection className="content-auto">
        <Container>
          <SectionHeading
            eyebrow="Sector expertise"
            title="Industries we serve with verified compliance"
            description="Dedicated squads for agriculture, textiles, engineering, chemicals, food, and retail channels."
          />
          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
            {industries.map((ind) => (
              <div
                key={ind.name}
                className="group flex min-w-0 items-start gap-3 rounded-xl border border-border/60 bg-background p-4 transition-colors hover:border-secondary/35 sm:p-5"
              >
                <ShieldCheckIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent transition-colors group-hover:text-secondary"
                  aria-hidden
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-primary sm:text-base">{ind.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">{ind.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:mt-10">
            <Link
              href="/industries"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-accent"
            >
              View industry capabilities
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Container>
      </PageSection>

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
              <p className="mt-4 text-sm font-semibold text-primary">
                Senior Procurement Director
              </p>
              <p className="text-xs text-muted">European trading group · Agri commodities</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
                Certifications & memberships
              </p>
              <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                Export-ready from day one
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Every shipment is backed by accredited quality systems and registered export credentials
                recognized by customs authorities worldwide.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
                {site.certifications.map((cert) => (
                  <li
                    key={cert}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-primary sm:text-sm"
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(37,99,235,0.2),transparent)]" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl min-w-0 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
              Start your export journey
            </p>
            <h2 className="mt-2 text-pretty text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              Ready to ship with a team that owns the full chain?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-base md:text-lg">
              Share your product specs, destination, and Incoterms — our trade desk responds with
              sourcing options, compliance checklist, and freight quote within one business day.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
              <Button
                href="/quote"
                variant="accent"
                fullWidthOnMobile
                className="px-8 py-3 text-sm font-bold shadow-lg shadow-accent/25 sm:text-base"
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
            <p className="mt-5 text-xs text-white/50 sm:mt-6 sm:text-sm">
              {site.email} · {site.phone}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
