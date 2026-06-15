// src/app/about/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  PageSection,
} from "@/components/site-ui";
import { AboutGlobalNetwork } from "@/components/about-global-network";
import { site, values } from "@/data/site";
import {
  GlobeAltIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UsersIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  StarIcon,
  FireIcon,
  Squares2X2Icon,
  GlobeAmericasIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import type { BusinessIcon } from "@/lib/business-icons";

const milestones: {
  year: string;
  title: string;
  event: string;
  icon: BusinessIcon;
}[] = [
  { year: "1998", title: "The Beginning", event: "Founded in Mumbai as a spice export trading house.", icon: FireIcon },
  { year: "2006", title: "Diversification", event: "Expanded into textiles and engineering with ISO-certified partner mills.", icon: Squares2X2Icon },
  { year: "2014", title: "Global Expansion", event: "Opened Houston operations desk for Americas distribution.", icon: GlobeAmericasIcon },
  { year: "2020", title: "Digital Transformation", event: "Strengthened export logistics and documentation under one brand.", icon: TruckIcon },
  { year: "2024", title: "Global Leadership", event: "90+ country network with dedicated chemicals and cold-chain divisions.", icon: GlobeAltIcon },
];

const stats = [
  { value: "25+", label: "years of trust", icon: TrophyIcon },
  { value: "90+", label: "Countries Served", icon: GlobeAltIcon },
  { value: "500+", label: "Happy Clients", icon: UsersIcon },
  { value: "18K+", label: "Shipments Delivered", icon: RocketLaunchIcon },
];

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

// Reveal section wrapper
function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Reveal item wrapper for staggered children
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
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-w-0 overflow-x-clip">
      {/* Hero Section - Reveal */}
      <RevealSection>
        <section className="border-b border-border bg-white py-12 sm:py-16 md:py-20 lg:py-24">
          <Container>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              About Sundaram Export
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Export excellence built over decades
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">
              Since {site.founded}, {site.name} has grown from a commodity trader into a multinational export partner — products, compliance, and shipment coordination under one accountable team.
            </p>
            
          </Container>
        </section>
      </RevealSection>

      {/* Stats Cards */}
      <RevealSection delay={100}>
        <div className="relative z-10 -mt-12 px-4 sm:px-6 lg:px-8">
          <Container>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {stats.map((stat, idx) => (
                <RevealItem key={stat.label} delay={idx * 100}>
                  <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 backdrop-blur-sm border border-accent/30 p-6 text-center text-white shadow-xl transition-all hover:-translate-y-2">
                    <stat.icon className="mx-auto h-8 w-8 text-accent" />
                    <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/80">{stat.label}</p>
                  </div>
                </RevealItem>
              ))}
            </div>
          </Container>
        </div>
      </RevealSection>

      {/* Our Story + Mission/Vision */}
      <RevealSection delay={200}>
        <PageSection>
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="group rounded-3xl bg-white/90 backdrop-blur-sm border border-border/50 p-8 shadow-lg transition-all hover:-translate-y-2 hover:border-accent/30 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">Our Story</h2>
                <p className="mt-4 text-muted">What began as a modest spice trading house in Mumbai has transformed into a multinational export powerhouse. Over 25 years, we've built relationships, earned trust, and mastered the art of global trade.</p>
                <p className="mt-4 text-muted">Today, Sundaram Export stands as a symbol of reliability, connecting Indian excellence to markets across five continents.</p>
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-foreground">Trusted by 500+ businesses worldwide</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group rounded-2xl bg-white/90 backdrop-blur-sm border border-border/50 p-6 transition-all hover:-translate-y-2 hover:border-accent/30 hover:shadow-xl">
                  <BriefcaseIcon className="h-6 w-6 text-accent mb-3" />
                  <h3 className="font-semibold text-primary text-lg">Our Mission</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    To empower Indian businesses with seamless global trade solutions, delivering quality
                    products and unparalleled logistics expertise.
                  </p>
                </div>
                <div className="group rounded-2xl bg-white/90 backdrop-blur-sm border border-border/50 p-6 transition-all hover:-translate-y-2 hover:border-accent/30 hover:shadow-xl">
                  <StarIcon className="h-6 w-6 text-accent mb-3" />
                  <h3 className="font-semibold text-primary text-lg">Our Vision</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    To become India's most trusted export partner, connecting businesses to 150+ countries
                    with excellence, integrity, and innovation.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* Core Values */}
      <RevealSection delay={300}>
        <PageSection className="bg-primary/5">
          <Container>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">What Drives Us</p>
              <h2 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">Our Core Values</h2>
              <p className="mt-3 text-muted">The principles that guide every shipment, every partnership</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {values.map((value, idx) => (
                <RevealItem key={value.title} delay={idx * 100}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-border/50 p-6 shadow-lg transition-all hover:-translate-y-2 hover:border-accent/30 hover:shadow-xl">
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/5 transition-all group-hover:scale-150" />
                    <div className="relative">
                      <CheckCircleIcon className="h-8 w-8 text-accent mb-4" />
                      <h3 className="text-xl font-bold text-primary">{value.title}</h3>
                      <p className="mt-2 text-sm text-muted leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* Timeline */}
      <RevealSection delay={400}>
        <PageSection>
          <Container>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">Our Journey</p>
              <h2 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">Company Milestones</h2>
              <p className="mt-3 text-muted">25+ years of excellence in global trade</p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {milestones.map((m, idx) => {
                const MilestoneIcon = m.icon;
                return (
                <RevealItem key={m.year} delay={idx * 100}>
                  <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-border/50 p-6 text-center shadow-lg transition-all hover:-translate-y-2 hover:border-accent/30 hover:shadow-xl">
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <MilestoneIcon className="h-7 w-7 text-primary" aria-hidden />
                    </div>
                    <p className="text-sm font-bold text-accent">{m.year}</p>
                    <h3 className="mt-2 text-lg font-bold text-primary">{m.title}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{m.event}</p>
                  </div>
                </RevealItem>
                );
              })}
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      <AboutGlobalNetwork />

      {/* Certifications */}
      <RevealSection delay={500}>
        <PageSection>
          <Container narrow>
            <div className="rounded-3xl bg-white/90 backdrop-blur-sm border border-accent/20 p-8 text-center shadow-lg sm:p-12">
              <ShieldCheckIcon className="mx-auto h-12 w-12 text-accent" />
              <h3 className="mt-4 text-2xl font-bold text-primary">Certifications & Memberships</h3>
              <p className="mt-2 text-sm text-muted">Recognized for quality, compliance, and excellence</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {["ISO 9001:2015", "FIEO Member", "APEDA Registered", "DGFT Licensed"].map((cert, idx) => (
                  <RevealItem key={cert} delay={idx * 100}>
                    <span className="flex items-center gap-2 rounded-full bg-primary/5 border border-accent/20 px-4 py-2 text-sm text-primary shadow-sm">
                      <ShieldCheckIcon className="h-4 w-4 text-accent" />
                      {cert}
                    </span>
                  </RevealItem>
                ))}
              </div>
            </div>
          </Container>
        </PageSection>
      </RevealSection>

      {/* CTA Section */}
      <RevealSection delay={600}>
        <section className="py-16 sm:py-20">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary to-secondary p-1">
              <div className="relative rounded-2xl bg-white/95 p-8 text-center sm:p-12">
                <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">Ready to Grow Globally?</h2>
                  <p className="mx-auto mt-4 max-w-2xl text-muted">Partner with Sundaram Export and unlock new markets worldwide</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button href="/contact" variant="accent" className="px-8 py-3 text-base shadow-xl transition-all hover:scale-105">Get in Touch</Button>
                    <Button href="/quote" variant="outline" className="border-primary/30 text-primary transition-all hover:border-accent hover:text-accent">Request a Quote</Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </RevealSection>

      {/* Footer Trust Bar */}
      <RevealSection delay={700}>
        <div className="border-t border-border bg-white py-6">
          <Container>
            <div className="flex flex-wrap justify-center gap-6 text-center text-xs text-muted">
              <div className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4 text-accent" /> ISO 9001:2015 Certified</div>
              <div className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4 text-accent" /> FIEO Member</div>
              <div className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4 text-accent" /> APEDA Registered</div>
              <div className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4 text-accent" /> DGFT Licensed</div>
        </div>
      </Container>
    </div>
      </RevealSection>
    </div>
  );
}