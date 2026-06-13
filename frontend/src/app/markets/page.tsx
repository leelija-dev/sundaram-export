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

  // Stats with blue to gold gradient - matching hero page
  const stats = [
    { value: "90+", label: "Countries Served", icon: GlobeAltIcon },
    { value: "24/7", label: "Trade Support", icon: TruckIcon },
    { value: "100%", label: "Compliance Guaranteed", icon: ShieldCheckIcon },
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
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(37,99,235,0.2), 0 0 10px rgba(245,158,11,0.1); }
          50% { box-shadow: 0 0 15px rgba(37,99,235,0.3), 0 0 20px rgba(245,158,11,0.2); }
          100% { box-shadow: 0 0 5px rgba(37,99,235,0.2), 0 0 10px rgba(245,158,11,0.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .glass-hero {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .stat-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
          transform: translateY(-6px) scale(1.02);
          animation: glowPulse 0.6s ease-out;
        }
        .stat-card:hover .stat-icon {
          animation: float 0.5s ease-out;
        }
        .glass-badge {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }
        .glass-badge:hover {
          background: rgba(255, 255, 255, 0.6);
          transform: scale(1.05);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Hero Section - Matching hero page exactly with White + Blue + Gold */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 glass-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),rgba(245,158,11,0.04)_70%)]" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        
        <div className="absolute top-20 right-10 opacity-5 animate-float hidden lg:block">
          <GlobeAltIcon className="h-40 w-40 text-primary" />
        </div>
        
        <Container>
          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Eyebrow - Glassmorphic matching hero page */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm border border-white/40">
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-accent" />
                <p className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">Global Reach</p>
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-blue-500" />
              </div>
              <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent to-transparent" />
            </div>

            {/* Main Heading */}
            <h1 className="text-center text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              {hasCountries
                ? `${countries.length}+ Countries`
                : hasRegions
                ? "Global Export Corridors"
                : "Export Destinations"}
              <span className="relative mt-2 block">
                <span className="gradient-text">
                  we export to
                </span>
                <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-3 text-accent/30" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,5 Q25,0 50,5 T100,5 T150,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
            </h1>

            {/* Description - KEEPING ORIGINAL TEXT */}
            <p className="mt-6 max-w-2xl mx-auto text-center text-base text-muted/90 sm:text-lg md:text-xl">
              Each destination is managed by our export desk — compliance, ports, and buyer networks for your product lines.
            </p>

            {/* Quick Stats - Glassmorphic with Blue to Gold gradient */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="stat-card relative rounded-2xl p-3.5 text-center overflow-hidden group cursor-pointer animate-fade-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-accent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-accent/20 backdrop-blur-xl" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <stat.icon className="stat-icon h-5 w-5 text-white transition-transform duration-300" />
                    <div>
                      <p className="stat-value text-xl font-bold text-white">{stat.value}</p>
                      <p className="text-[10px] font-medium text-white/80 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 rounded-2xl border border-white/30 pointer-events-none" />
                  
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                    <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-[shimmer_0.6s_ease-out]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges - KEEPING ORIGINAL TEXT with glass style */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-2 gap-y-1.5">
              <span className="rounded-full glass-badge px-2.5 py-0.5 text-[10px] text-blue-700 font-medium shadow-sm animate-fade-slide-up" style={{ animationDelay: "0.2s" }}>
                ✓ 24/7 trade support
              </span>
              <span className="rounded-full glass-badge px-2.5 py-0.5 text-[10px] text-blue-700 font-medium shadow-sm animate-fade-slide-up" style={{ animationDelay: "0.25s" }}>
                ✓ Customs clearance ready
              </span>
              <span className="rounded-full glass-badge px-2.5 py-0.5 text-[10px] text-blue-700 font-medium shadow-sm animate-fade-slide-up" style={{ animationDelay: "0.3s" }}>
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
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full glass-badge shadow-sm mb-3 transition-all duration-300 hover:shadow-md">
                  <MapPinIcon className="h-3 w-3 text-accent" />
                  <span className="text-[10px] font-medium bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">Global Network</span>
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
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full glass-badge shadow-sm mb-3 transition-all duration-300 hover:shadow-md">
                  <GlobeAltIcon className="h-3 w-3 text-accent" />
                  <span className="text-[10px] font-medium bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">Regional Desks</span>
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
            <div className="mt-12 rounded-2xl border border-dashed border-white/30 bg-white/40 backdrop-blur-sm p-12 text-center animate-fade-slide-up glass-card transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
              <GlobeAltIcon className="mx-auto h-12 w-12 text-muted mb-4" />
              <p className="text-muted">No export destinations published yet.</p>
              <a href="/contact" className="inline-block mt-2 font-semibold text-accent hover:text-secondary transition-colors">
                Contact us to discuss your target market →
              </a>
            </div>
          )}

          {/* CTA Card - KEEPING ORIGINAL TEXT */}
          <div className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-accent p-8 text-center transition-all duration-500 hover:shadow-xl hover:scale-[1.01] animate-fade-slide-up glass-card" style={{ animationDelay: "0.3s" }}>
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm mb-4 transition-all duration-300 hover:bg-white/30">
                <span className="text-white text-xs">🌍</span>
                <span className="text-[10px] font-medium text-white">Expand Your Reach</span>
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Don't see your destination?
              </h3>
              <p className="mt-3 text-white/80 text-sm sm:text-base">
                We regularly open new lanes. Share your target country and product — we'll confirm feasibility within 48 hours.
              </p>
              <a
                href="/quote"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:shadow-lg hover:gap-3 hover:scale-105"
              >
                Request a market feasibility check
                <ChevronRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Trust Footer - KEEPING ORIGINAL TEXTS */}
          <div className="mt-16 flex flex-wrap justify-center gap-3 text-center animate-fade-slide-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-badge transition-all duration-300 hover:scale-105">
              <ShieldCheckIcon className="h-3 w-3 text-blue-600" />
              <span className="text-[10px] font-medium text-primary">ISO 9001:2015 certified</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-badge transition-all duration-300 hover:scale-105">
              <ShieldCheckIcon className="h-3 w-3 text-blue-600" />
              <span className="text-[10px] font-medium text-primary">FIEO member</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-badge transition-all duration-300 hover:scale-105">
              <ShieldCheckIcon className="h-3 w-3 text-accent" />
              <span className="text-[10px] font-medium text-primary">APEDA registered</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-badge transition-all duration-300 hover:scale-105">
              <ShieldCheckIcon className="h-3 w-3 text-blue-600" />
              <span className="text-[10px] font-medium text-primary">DGFT licensed</span>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}