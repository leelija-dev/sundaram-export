// src/app/contact/page.tsx

import { ContactForm } from "@/components/contact-form";
import { Container, PageSection, TrustBadge } from "@/components/site-ui";
import { site } from "@/data/site";
import { fetchOffices } from "@/lib/api";
import {
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  MapPinIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Contact Us | Sundaram Export",
  description: `Contact ${site.name} export desks worldwide. Reach us for product inquiries, shipments, compliance, or partnerships.`,
};

export const revalidate = 60;

export default async function ContactPage() {
  const offices = await fetchOffices();

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
      `}</style>

      {/* Hero Section - Centered */}
      <section className="border-b border-border bg-white py-12 text-center sm:py-16 md:py-20 lg:py-24">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent animate-fade-slide-up">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl animate-fade-slide-up [animation-delay:0.05s]">
            Global export desks
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted sm:text-lg animate-fade-slide-up [animation-delay:0.1s]">
            Reach the team for product inquiries, active shipments, compliance questions, or partnership discussions.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm animate-fade-slide-up [animation-delay:0.15s]">
            <TrustBadge className="bg-accent/10 text-accent">24/7 trade support</TrustBadge>
            <TrustBadge className="bg-accent/10 text-accent">Response within 24h</TrustBadge>
            <TrustBadge className="bg-accent/10 text-accent">Multi‑language desk</TrustBadge>
          </div>
        </Container>
      </section>

      <PageSection>
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
              
              {/* LEFT: Contact Form */}
              <div className="lg:col-span-3 animate-fade-slide-up [animation-delay:0.2s]">
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="border-b border-border/50 bg-surface/30 px-6 py-5 sm:px-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <EnvelopeIcon className="h-5 w-5 text-accent" aria-hidden />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Send us a message</h2>
                        <p className="mt-0.5 text-sm text-muted">
                          Fill out the form and our trade desk responds within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <ContactForm variant="contact" />
                  </div>
                </div>
              </div>

              {/* RIGHT: Contact Info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Contact Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="animate-fade-slide-up [animation-delay:0.25s]">
                      <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-white/80 p-4 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                          <EnvelopeIcon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted">Email</p>
                          <a href={`mailto:${site.email}`} className="text-sm font-medium text-primary hover:text-accent">
                            {site.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="animate-fade-slide-up [animation-delay:0.3s]">
                      <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-white/80 p-4 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                          <PhoneIcon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted">Phone</p>
                          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-sm font-medium text-primary hover:text-accent">
                            {site.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="animate-fade-slide-up [animation-delay:0.35s]">
                      <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-white/80 p-4 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                          <ClockIcon className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-muted">Support</p>
                          <p className="text-sm font-medium text-primary">24/7 Trade Desk</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Global Offices */}
                  {offices.length > 0 && (
                    <div className="animate-fade-slide-up [animation-delay:0.4s]">
                      <div className="rounded-2xl border border-border/50 bg-white/80 p-5 backdrop-blur-sm">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-primary">
                          <GlobeAltIcon className="h-5 w-5 text-accent" />
                          Our Global Desks
                        </h3>
                        <div className="mt-3 space-y-3">
                          {offices.map((office, idx) => (
                            <div key={office.region} className="flex items-start gap-2 text-sm" style={{ animationDelay: `${0.42 + idx * 0.03}s` }}>
                              <MapPinIcon className="mt-0.5 h-4 w-4 text-accent shrink-0" />
                              <div>
                                <p className="font-medium text-primary">{office.region}</p>
                                <p className="text-xs text-muted">{office.address.split(",")[0]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trust Badges */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2 animate-fade-slide-up [animation-delay:0.45s]">
                    <span className="flex items-center gap-1 rounded-full bg-accent/5 px-3 py-1 text-xs text-muted">
                      <ShieldCheckIcon className="h-3 w-3 text-accent" />
                      Data protected
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-accent/5 px-3 py-1 text-xs text-muted">
                      <ShieldCheckIcon className="h-3 w-3 text-accent" />
                      SSL secure
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-accent/5 px-3 py-1 text-xs text-muted">
                      <ShieldCheckIcon className="h-3 w-3 text-accent" />
                      Global reach
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}