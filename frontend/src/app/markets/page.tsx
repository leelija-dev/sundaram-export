// src/app/markets/page.tsx

import {
  CardGrid,
  Container,
  ExportCountryCard,
  MarketCard,
  PageSection,
  SectionHeading,
} from "@/components/site-ui";
import { site } from "@/data/site";
import { fetchExportCountries, fetchMarketRegions } from "@/lib/api";
import { GlobeAltIcon, MapPinIcon, TruckIcon, ShieldCheckIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export const revalidate = 60;

export const metadata = {
  title: "Global Markets | Sundaram Export",
  description: `Export destinations served by ${site.name} — 90+ countries across five continents. Compliance, ports, and buyer networks.`,
};

export default async function MarketsPage() {
  const [countries, regions] = await Promise.all([
    fetchExportCountries(),
    fetchMarketRegions(),
  ]);

  const hasCountries = countries.length > 0;
  const hasRegions = regions.length > 0;

  // Stats with blue accents
  const stats = [
    { value: "90+", label: "Countries Served", icon: GlobeAltIcon, color: "from-blue-600 to-blue-400" },
    { value: "24/7", label: "Trade Support", icon: TruckIcon, color: "from-accent to-accent/80" },
    { value: "100%", label: "Compliance Guaranteed", icon: ShieldCheckIcon, color: "from-blue-600 to-accent" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Premium Hero Section - Blue Accents + White Background */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Blue decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),transparent_50%)]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        
        {/* Floating globe icon */}
        <div className="absolute top-20 right-10 opacity-10 animate-float hidden lg:block">
          <GlobeAltIcon className="h-40 w-40 text-primary" />
        </div>
        
        <Container>
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Eyebrow with blue dot */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-400" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Global Reach</p>
                <div className="h-2 w-2 rounded-full bg-accent" />
              </div>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-400" />
            </div>

            {/* Main Heading with blue and gold */}
            <h1 className="text-center text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              {hasCountries
                ? `${countries.length}+ Countries`
                : hasRegions
                ? "Global Export Corridors"
                : "Export Destinations"}
              <span className="relative mt-2 block">
                <span className="bg-gradient-to-r from-blue-600 via-accent to-blue-600 bg-clip-text text-transparent">
                  we export to
                </span>
                <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-3 text-accent/20" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl mx-auto text-center text-base text-muted sm:text-lg md:text-xl">
              Each destination is managed by our export desk — compliance, ports, and buyer networks for your product lines.
            </p>

            {/* Quick Stats with gradient backgrounds */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${stat.color} px-5 py-3 shadow-md animate-fade-slide-up`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges - Blue and Gold */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm text-blue-700 animate-fade-slide-up" style={{ animationDelay: "0.2s" }}>
                ✓ 24/7 trade support
              </span>
              <span className="rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-sm text-accent animate-fade-slide-up" style={{ animationDelay: "0.25s" }}>
                ✓ Customs clearance ready
              </span>
              <span className="rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-sm text-blue-700 animate-fade-slide-up" style={{ animationDelay: "0.3s" }}>
                ✓ Multi‑language desk
              </span>
            </div>
          </div>
        </Container>
      </section>

      <PageSection>
        <Container>
          {hasCountries ? (
            <>
              <div className="text-center mb-12 animate-fade-slide-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-3">
                  <MapPinIcon className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Global Network</span>
                </div>
                <SectionHeading
                  title="Countries we export to"
                  description="Updated live from our operations team — real‑time compliance and port intelligence."
                />
              </div>
              <CardGrid variant="cardsTwo" className="mt-10 lg:mt-14">
                {countries.map((c, index) => (
                  <div
                    key={c.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${0.05 + index * 0.02}s` }}
                  >
                    <ExportCountryCard
                      country={{
                        id: c.id,
                        name: c.name,
                        subtitle: c.subtitle,
                        description: c.description,
                        key_ports: c.key_ports,
                        specialties: c.specialties,
                        region_name: c.region_name,
                      }}
                    />
                  </div>
                ))}
              </CardGrid>
            </>
          ) : hasRegions ? (
            <>
              <div className="text-center mb-12 animate-fade-slide-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/20 mb-3">
                  <GlobeAltIcon className="h-3 w-3 text-accent" />
                  <span className="text-xs font-medium text-accent">Regional Desks</span>
                </div>
                <SectionHeading
                  title="Regional export desks"
                  description="Each corridor is staffed by trade specialists who understand product‑specific import rules."
                />
              </div>
              <CardGrid variant="cardsTwo" className="mt-10 lg:mt-14">
                {regions.map((region, index) => (
                  <div
                    key={region.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${0.05 + index * 0.05}s` }}
                  >
                    <MarketCard market={region} />
                  </div>
                ))}
              </CardGrid>
            </>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center animate-fade-slide-up">
              <GlobeAltIcon className="mx-auto h-12 w-12 text-muted mb-4" />
              <p className="text-muted">No export destinations published yet.</p>
              <a href="/contact" className="inline-block mt-2 font-semibold text-accent hover:text-secondary transition-colors">
                Contact us to discuss your target market →
              </a>
            </div>
          )}

          {/* Enhanced CTA Card with blue gradient */}
          <div className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-primary to-accent p-8 text-center transition-all duration-500 hover:shadow-xl animate-fade-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <span className="text-white text-sm">🌍</span>
                <span className="text-xs font-medium text-white">Expand Your Reach</span>
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Don't see your destination?
              </h3>
              <p className="mt-3 text-white/80">
                We regularly open new lanes. Share your target country and product — we'll confirm feasibility within 48 hours.
              </p>
              <a
                href="/quote"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-all hover:shadow-lg hover:gap-3"
              >
                Request a market feasibility check
                <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Trust Footer with icons */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center text-xs text-muted animate-fade-slide-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
              <span>ISO 9001:2015 certified</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
              <span>FIEO member</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-accent" />
              <span>APEDA registered</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
              <span>DGFT licensed</span>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}