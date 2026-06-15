// src/app/quote/page.tsx

import { ContactForm } from "@/components/contact-form";
import { Container, PageSection, TrustBadge } from "@/components/site-ui";
import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const metadata = {
  title: "Request a Quote | Sundaram Export",
  description: "Get a tailored export quote for your product and destination. Our trade desk responds within 24 hours.",
};

export default function QuotePage() {
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
            Quote
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl animate-fade-slide-up [animation-delay:0.05s]">
            Request a tailored export quote
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted sm:text-lg animate-fade-slide-up [animation-delay:0.1s]">
            Share product needs, origin, destination, and Incoterms. We prepare options within one business day.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm animate-fade-slide-up [animation-delay:0.15s]">
            <TrustBadge className="bg-accent/10 text-accent">24h response</TrustBadge>
            <TrustBadge className="bg-accent/10 text-accent">No obligation</TrustBadge>
            <TrustBadge className="bg-accent/10 text-accent">Global logistics</TrustBadge>
          </div>
        </Container>
      </section>

      <PageSection>
        <Container>
          <div className="mx-auto max-w-5xl">
            {/* Quote Form Card */}
            <div className="animate-fade-slide-up [animation-delay:0.2s]">
              <div className="overflow-hidden rounded-2xl border border-border/50 bg-white/90 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-xl">
                <div className="border-b border-border/50 bg-surface/30 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                      <ArchiveBoxIcon className="h-5 w-5 text-accent" aria-hidden />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Export quote request</h2>
                      <p className="mt-0.5 text-sm text-muted">
                        Tell us about your shipment – we'll respond with pricing and logistics options.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <ContactForm variant="quote" />
                </div>
              </div>
            </div>

            {/* Process Steps - Staggered */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-center">
              {[
                { step: "1", label: "Inquiry", icon: ClipboardDocumentListIcon },
                { step: "2", label: "Logistics", icon: PaperAirplaneIcon },
                { step: "3", label: "Quote", icon: DocumentTextIcon },
              ].map((item, idx) => {
                const StepIcon = item.icon;
                return (
                <div
                  key={item.step}
                  className={`animate-fade-slide-up [animation-delay:${0.25 + idx * 0.08}s]`}
                >
                  <div className="flex items-center gap-2 rounded-full border border-border/50 bg-white/70 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-white">
                    <StepIcon className="h-4 w-4 text-accent" aria-hidden />
                    <span>{item.step}. {item.label}</span>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Trust Badges - Staggered */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-center text-xs text-muted">
              <div className="animate-fade-slide-up [animation-delay:0.4s]">
                <span className="flex items-center gap-1 rounded-full bg-accent/5 px-3 py-1">
                  <ShieldCheckIcon className="h-3 w-3 text-accent" />
                  Data protected
                </span>
              </div>
              <div className="animate-fade-slide-up [animation-delay:0.45s]">
                <span className="flex items-center gap-1 rounded-full bg-accent/5 px-3 py-1">
                  <ShieldCheckIcon className="h-3 w-3 text-accent" />
                  SSL secure
                </span>
              </div>
              <div className="animate-fade-slide-up [animation-delay:0.5s]">
                <span className="flex items-center gap-1 rounded-full bg-accent/5 px-3 py-1">
                  <ShieldCheckIcon className="h-3 w-3 text-accent" />
                  Fast response
                </span>
              </div>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}