"use client";

import {
  CardGrid,
  Container,
  OfficeCard,
  PageSection,
  SectionHeading,
  TrustBadge,
} from "@/components/site-ui";
import { ContactForm } from "@/components/contact-form";
import { ContactMapSection } from "@/components/contact-map-section";
import { useSiteConfig } from "@/components/site-config-provider";
import { site } from "@/data/site";
import type { Office } from "@/lib/api";
import { formatStatCount } from "@/lib/format-stat";
import {
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

type ContactPageContentProps = {
  offices: Office[];
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function ContactPageContent({ offices }: ContactPageContentProps) {
  const { email, phone, phoneAlt, address, addressShort } = useSiteConfig();
  const hasOffices = offices.length > 0;

  const heroStats = [
    hasOffices && {
      value: formatStatCount(offices.length),
      label: "Global desks",
      icon: BuildingOffice2Icon,
    },
    { value: "24h", label: "Response time", icon: ClockIcon },
    { value: "24/7", label: "Trade support", icon: ChatBubbleLeftRightIcon },
  ].filter(Boolean) as { value: string; label: string; icon: typeof ClockIcon }[];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-primary py-12 text-white sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('/hero/logistick_hub.jpg')",
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
              Contact us
            </p>
            <h1 className="products-hero-title mt-2 text-pretty text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Talk to our export desk
            </h1>
            <p className="products-hero-lead mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
              Product inquiries, active shipments, compliance questions, or partnership discussions —
              one team responds within one business day.
            </p>

            {heroStats.length > 0 && (
              <div
                className={`mt-8 grid grid-cols-1 gap-3 sm:gap-4 ${
                  heroStats.length === 1
                    ? "max-w-xs mx-auto"
                    : heroStats.length === 2
                      ? "sm:grid-cols-2 max-w-md mx-auto"
                      : "sm:grid-cols-3"
                }`}
              >
                {heroStats.map((stat) => {
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

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <TrustBadge className="border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                SSL secure form
              </TrustBadge>
              <TrustBadge className="border border-white/25 bg-white/10 text-white backdrop-blur-sm">
                Data protected
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
                      <EnvelopeIcon className="h-5 w-5 text-accent" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-primary">Send us a message</h2>
                      <p className="mt-0.5 text-sm text-muted sm:text-base">
                        Our trade desk will reply within one business day.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <ContactForm variant="contact" />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold text-primary">Primary desk</h2>
                  <p className="mt-1 text-sm text-muted sm:text-base">
                    Headquarters contact from {site.shortName} operations.
                  </p>
                  <ul className="mt-5 space-y-4 text-sm sm:text-base">
                    <li className="flex items-start gap-3">
                      <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                      <div>
                        <p className="font-medium text-primary">{addressShort}</p>
                        <p className="mt-0.5 leading-relaxed text-muted">{address}</p>
                      </div>
                    </li>
                    <li>
                      <a
                        href={phoneHref(phone)}
                        className="inline-flex items-center gap-3 font-medium text-primary transition-colors hover:text-secondary"
                      >
                        <PhoneIcon className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                        {phone}
                      </a>
                    </li>
                    {phoneAlt && phoneAlt !== phone && (
                      <li>
                        <a
                          href={phoneHref(phoneAlt)}
                          className="inline-flex items-center gap-3 font-medium text-primary transition-colors hover:text-secondary"
                        >
                          <PhoneIcon className="h-5 w-5 shrink-0 text-secondary" aria-hidden />
                          {phoneAlt}
                        </a>
                      </li>
                    )}
                    <li>
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-start gap-3 break-all font-medium text-primary transition-colors hover:text-secondary"
                      >
                        <EnvelopeIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                        {email}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-border/60 bg-surface/40 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-6 w-6 text-secondary" aria-hidden />
                    <div>
                      <p className="font-semibold text-primary">24/7 trade support</p>
                      <p className="mt-0.5 text-sm text-muted sm:text-base">
                        Urgent shipment or customs issues — call the desk anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </PageSection>

      <ContactMapSection />

      {hasOffices && (
        <PageSection className="bg-surface/40">
          <Container>
            <SectionHeading
              eyebrow="Global presence"
              title="Regional export desks"
              description={`${formatStatCount(offices.length)} ${
                offices.length === 1 ? "desk" : "desks"
              } published from our operations team.`}
            />
            <CardGrid variant="cardsTwo" className="mt-8 lg:mt-10">
              {offices.map((office) => (
                <OfficeCard
                  key={`${office.region}-${office.email}`}
                  region={office.region}
                  address={office.address}
                  phone={office.phone}
                  email={office.email}
                />
              ))}
            </CardGrid>
          </Container>
        </PageSection>
      )}

      <PageSection>
        <Container narrow>
          <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6 text-center sm:p-8">
            <ShieldCheckIcon className="mx-auto h-8 w-8 text-accent" aria-hidden />
            <p className="mt-3 text-base font-semibold text-primary sm:text-lg">
              Trusted export partner
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
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
    </>
  );
}
