"use client";

import { Container, PageSection, TrustBadge } from "@/components/site-ui";
import { ContactForm } from "@/components/contact-form";
import { useSiteConfig } from "@/components/site-config-provider";
import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const QUOTE_CHECKLIST = [
  "Product name, grade, and HS code (if known)",
  "Origin city and destination country",
  "Packaging and estimated volume (FCL / LCL / air)",
  "Target Incoterms and required certifications",
  "Preferred ship date or delivery window",
] as const;

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function QuotePageContent() {
  const { email, phone } = useSiteConfig();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-primary py-12 text-white sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "url('/hero/container_ship.jpg')",
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
              Export quote
            </p>
            <h1 className="products-hero-title mt-2 text-pretty text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Request a tailored export quote
            </h1>
            <p className="products-hero-lead mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              Share product specs, origin, destination, and Incoterms — we respond within one
              business day.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <TrustBadge className="border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                24h response
              </TrustBadge>
              <TrustBadge className="border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                No obligation
              </TrustBadge>
            </div>
          </div>
        </Container>
      </section>

      <PageSection className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-border/70 bg-surface/30 shadow-sm">
                <div className="border-b border-border/60 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                      <ArchiveBoxIcon className="h-5 w-5 text-accent" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-primary">Export quote request</h2>
                      <p className="mt-0.5 text-sm text-muted sm:text-base">
                        Product and destination fields load from our live catalog when available.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <ContactForm variant="quote" />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-primary">What to include</h2>
                <ul className="mt-4 space-y-2.5">
                  {QUOTE_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground sm:text-base">
                      <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-border/60 pt-5">
                  <p className="text-sm font-medium text-primary">Questions before you submit?</p>
                  <ul className="mt-3 space-y-2.5 text-sm sm:text-base">
                    <li>
                      <a
                        href={phoneHref(phone)}
                        className="inline-flex items-center gap-2.5 font-medium text-primary transition-colors hover:text-secondary"
                      >
                        <PhoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {phone}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-start gap-2.5 break-all font-medium text-primary transition-colors hover:text-secondary"
                      >
                        <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {email}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
