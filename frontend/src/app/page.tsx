// src/app/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HomeHero } from "@/components/home-hero";
import {
  Button,
  CardGrid,
  Container,
  ExportCountryCard,
  IndustryCard,
  PageSection,
  ProductCard,
  SectionHeading,
} from "@/components/site-ui";
import { industries } from "@/data/industries";
import { processSteps, site } from "@/data/site";
import { fetchExportCountries, fetchProducts } from "@/lib/api";
import {
  GlobeAltIcon,
  TruckIcon,
  BuildingOfficeIcon,
  BoltIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  MapPinIcon,
  StarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// Scroll reveal hook
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Section wrapper
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Individual item reveal
function RevealItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchExportCountries()]).then(([productsData, countriesData]) => {
      setProducts(productsData);
      setCountries(countriesData);
      setLoading(false);
    });
  }, []);

  const featuredProducts = products.slice(0, 3);
  const featuredCountries = countries.slice(0, 6);

  const customStats = [
    { value: "90+", label: "Countries served", icon: GlobeAltIcon },
    { value: "18K+", label: "Shipments annually", icon: TruckIcon },
    { value: "6", label: "Product divisions", icon: BuildingOfficeIcon },
    { value: "24/7", label: "Operations desk", icon: BoltIcon },
  ];

  const trustedClients = [
    "Nestlé",
    "Unilever",
    "Tata Group",
    "Mahindra",
    "ITC Limited",
    "Godrej",
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto mb-4" />
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeHero productCount={products.length} countryCount={countries.length} />

      {/* Stats bar */}
      <RevealSection>
        <section className="relative z-10 -mt-8 px-4 sm:-mt-12 sm:px-6 lg:px-8">
          <Container>
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-primary/80 backdrop-blur-md border border-accent/30 p-3 shadow-2xl sm:grid-cols-4 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
              {customStats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="text-center transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-1 text-accent sm:w-9 sm:h-9" />
                  <p className="text-xl font-black text-accent sm:text-2xl md:text-3xl lg:text-4xl">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/80 sm:text-[11px] md:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* Trusted by section – Seamless ribbon */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1360px]">
          <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 backdrop-blur-md border border-accent/30 rounded-2xl shadow-lg shadow-accent/10">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-primary/90 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-primary/90 to-transparent pointer-events-none" />
            
            <div
              className="py-3 sm:py-4"
              style={{
                whiteSpace: "nowrap",
                display: "inline-block",
                animation: "scrollFixed 20s linear infinite",
                width: "auto",
              }}
            >
              {[...trustedClients, ...trustedClients].map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  style={{ 
                    margin: "0 2rem", 
                    display: "inline-block",
                    filter: "drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))",
                  }}
                  className="text-sm font-semibold tracking-wide text-white/90 transition-all duration-300 hover:text-accent hover:-translate-y-0.5 hover:drop-shadow-lg"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products + End-to-end support */}
      <RevealSection>
        <PageSection>
          <Container>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              
              {/* LEFT: Export products section */}
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Export products"
                  title="Six divisions. Global demand."
                  description="From farm-gate spices to precision engineering — sourced, certified, and shipped under one roof."
                />
                <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
                  <Button href="/products" variant="accent" className="px-5 py-2.5 text-sm sm:px-6 sm:py-3">
                    Explore all products
                  </Button>
                  <Button href="/quote" variant="outline" className="border-primary/30 text-primary hover:border-accent hover:text-accent">
                    Request a quote
                  </Button>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  {featuredProducts.slice(0, 2).map((product, idx) => (
                    <RevealItem key={product.slug} delay={idx * 100}>
                      <ProductCard product={product} />
                    </RevealItem>
                  ))}
                </div>
                {featuredProducts.length > 2 && (
                  <div className="mt-6 text-center">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-all hover:gap-2 hover:text-accent"
                    >
                      View all {featuredProducts.length}+ products →
                    </Link>
                  </div>
                )}
              </div>

              {/* RIGHT: End-to-end export support */}
              <div className="space-y-5">
                <div className="border-l-4 border-accent pl-4">
                  <h2 className="text-xl font-bold text-primary sm:text-2xl">End-to-end export support</h2>
                  <p className="text-sm text-muted">Complete supply chain solutions under one roof</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { icon: CheckCircleIcon, title: "Sourcing & quality certification", desc: "Vetted suppliers, ISO standards, quality control" },
                    { icon: DocumentTextIcon, title: "Export documentation & compliance", desc: "HS codes, licenses, destination import rules" },
                    { icon: TruckIcon, title: "Port-to-door shipment coordination", desc: "Freight, insurance, milestone tracking" },
                  ].map((item, idx) => (
                    <RevealItem key={item.title} delay={idx * 100}>
                      <div className="flex items-start gap-3">
                        <item.icon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-primary">{item.title}</p>
                          <p className="text-xs text-muted">{item.desc}</p>
                        </div>
                      </div>
                    </RevealItem>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-accent" />
                  <span className="text-muted">From India to <strong className="text-primary">90+ countries</strong> worldwide</span>
                </div>
              </div>
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* How we work */}
      <RevealSection delay={100}>
        <PageSection>
          <Container>
            <div>
              <SectionHeading
                eyebrow="How we work"
                title="From inquiry to delivery"
                description="A disciplined export process built for first-time exporters and enterprise supply chains alike."
              />
            </div>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
              {processSteps.map((step, idx) => (
                <RevealItem key={step.step} delay={idx * 100}>
                  <div className="group relative rounded-xl border border-border/50 bg-background p-4 transition-all hover:-translate-y-2 hover:border-accent/40 hover:shadow-xl sm:p-5 lg:p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 text-lg font-black text-accent sm:mb-4 sm:h-12 sm:w-12 sm:text-xl lg:h-14 lg:w-14 lg:text-2xl">
                      {step.step.replace(/^0/, "")}
                    </div>
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted sm:mt-2 sm:text-sm">{step.description}</p>
                    {idx < processSteps.length - 1 && (
                      <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 lg:block">
                        <div className="h-0.5 w-4 bg-gradient-to-r from-border to-transparent" />
                      </div>
                    )}
                  </div>
                </RevealItem>
              ))}
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* Destinations & Industries */}
      <RevealSection delay={200}>
        <PageSection>
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              {/* Left: Export destinations */}
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Global reach"
                  title="Presence across major trade corridors"
                  description="Destinations managed by our export desk — compliance, ports, and buyer networks."
                />
                {featuredCountries.length > 0 ? (
                  <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                    {featuredCountries.slice(0, 3).map((c, idx) => (
                      <RevealItem key={c.id} delay={idx * 100}>
                        <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-md sm:p-4">
                          <h3 className="text-sm font-semibold text-primary sm:text-base">{c.name}</h3>
                          <p className="mt-1 text-xs text-muted sm:text-sm">{c.description?.slice(0, 100)}</p>
                        </div>
                      </RevealItem>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-muted sm:mt-6">Export destinations being updated.</p>
                )}
                <div className="mt-5 sm:mt-6">
                  <Link
                    href="/markets"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-all hover:gap-2 hover:text-accent"
                  >
                    Explore all markets →
                  </Link>
                </div>
              </div>

              {/* Right: Industries */}
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Expertise"
                  title="Sector expertise you can verify"
                  description="Dedicated squads for agriculture, textiles, engineering, chemicals, food, and retail channels."
                />
                <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4">
                  {industries.slice(0, 4).map((ind, idx) => (
                    <RevealItem key={ind.name} delay={idx * 100}>
                      <div className="flex items-start gap-2 rounded-lg p-2 transition hover:bg-accent/5 sm:gap-3 sm:p-3">
                        <ShieldCheckIcon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-primary sm:text-base">{ind.name}</h3>
                          <p className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">{ind.description}</p>
                        </div>
                      </div>
                    </RevealItem>
                  ))}
                </div>
                <div className="mt-4 text-right sm:mt-5">
                  <Link href="/industries" className="text-xs text-secondary hover:text-accent sm:text-sm">
                    View all industries →
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* Testimonial section */}
      <RevealSection delay={300}>
        <PageSection className="bg-primary/5">
          <Container narrow>
            <div className="rounded-2xl border border-accent/20 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:shadow-lg sm:p-8 md:p-10 lg:p-12">
              <StarIcon className="w-10 h-10 mx-auto mb-3 text-accent" />
              <p className="text-base font-medium text-foreground/80 italic sm:text-lg md:text-xl">
                Sundaram Export has been our trusted partner for five years. Their compliance team and logistics desk are unmatched.
              </p>
              <p className="mt-3 text-xs font-semibold text-accent sm:mt-4 sm:text-sm">
                — Senior Procurement Director, European Trading Group
              </p>
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* CTA Section */}
      <RevealSection delay={400}>
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                Ready to streamline your exports?
              </h2>
              <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-base md:text-lg">
                One team, end‑to‑end accountability – from sourcing to port delivery.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                <Button href="/quote" variant="accent" fullWidthOnMobile className="px-6 py-2.5 text-sm shadow-lg shadow-accent/20 transition-all duration-300 hover:scale-105 sm:px-8 sm:py-3">
                  Get a free quote
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  fullWidthOnMobile
                  className="border-primary/30 text-primary transition-all duration-300 hover:scale-105 hover:border-accent hover:text-accent text-sm sm:text-base"
                >
                  Talk to trade desk
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </RevealSection>
    </>
  );
}