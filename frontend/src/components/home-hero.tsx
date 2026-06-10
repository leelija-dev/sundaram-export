import Link from "next/link";
import { Button, Container } from "@/components/site-ui";
import { site } from "@/data/site";

type HomeHeroProps = {
  productCount?: number;
  countryCount?: number;
};

const highlights = [
  "Sourcing & quality certification",
  "Export documentation & compliance",
  "Port-to-door shipment coordination",
];

function GlobeVisual() {
  return (
    <div className="hero-globe" aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
        <circle cx="200" cy="200" r="148" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <circle cx="200" cy="200" r="118" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="148" ry="52" stroke="rgba(37,99,235,0.35)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="52" ry="148" stroke="rgba(37,99,235,0.25)" strokeWidth="1" />
        <path
          d="M52 200 Q200 120 348 200"
          stroke="rgba(245,158,11,0.6)"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <path
          d="M80 280 Q200 160 320 100"
          stroke="rgba(37,99,235,0.5)"
          strokeWidth="1.5"
        />
        <circle cx="320" cy="100" r="5" fill="#f59e0b" />
        <circle cx="80" cy="280" r="5" fill="#2563eb" />
        <circle cx="348" cy="200" r="4" fill="#f59e0b" opacity="0.8" />
        <circle cx="200" cy="200" r="6" fill="#2563eb" />
        {[...Array(24)].map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const x = 200 + Math.cos(angle) * 130;
          const y = 200 + Math.sin(angle) * 130;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.5}
              fill="rgba(255,255,255,0.25)"
            />
          );
        })}
      </svg>
    </div>
  );
}

export function HomeHero({ productCount = 0, countryCount = 0 }: HomeHeroProps) {
  const liveProducts = productCount > 0 ? productCount : null;
  const liveCountries = countryCount > 0 ? countryCount : null;

  return (
    <section className="hero-export relative overflow-hidden bg-primary text-white">
      <div className="hero-export-bg" aria-hidden />
      <div className="hero-export-grid" aria-hidden />

      <Container className="relative">
        <div className="hero-export-inner">
          <div className="hero-export-content">
            <div className="hero-export-eyebrow">
              <span className="hero-export-badge">Global export house</span>
              <span className="hero-export-divider" />
              <span className="text-white/70">Est. {site.founded}</span>
            </div>

            <h1 className="hero-export-title">
              Your gateway to{" "}
              <span className="text-accent">worldwide</span> product exports
            </h1>

            <p className="hero-export-lead">{site.description}</p>

            <ul className="hero-export-highlights">
              {highlights.map((item) => (
                <li key={item}>
                  <span className="hero-export-check" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="hero-export-actions">
              <Button href="/quote" variant="accent" fullWidthOnMobile className="px-7 py-3.5 text-base">
                Request export quote
              </Button>
              <Button
                href="/products"
                variant="outline"
                fullWidthOnMobile
                className="border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-accent hover:bg-white/10 hover:text-accent"
              >
                Explore product catalog
              </Button>
            </div>

            <div className="hero-export-certs">
              {site.certifications.map((cert) => (
                <span key={cert} className="hero-export-cert">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-export-panel">
            <div className="hero-export-panel-card">
              <GlobeVisual />
              <div className="hero-export-stats">
                <div className="hero-export-stat">
                  <p className="hero-export-stat-value">{liveCountries ?? "90+"}</p>
                  <p className="hero-export-stat-label">Export destinations</p>
                </div>
                <div className="hero-export-stat">
                  <p className="hero-export-stat-value">{liveProducts ?? "6"}</p>
                  <p className="hero-export-stat-label">Product divisions</p>
                </div>
                <div className="hero-export-stat">
                  <p className="hero-export-stat-value">24/7</p>
                  <p className="hero-export-stat-label">Operations desk</p>
                </div>
              </div>
              <div className="hero-export-panel-footer">
                <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                  Mumbai · Houston · Frankfurt
                </p>
                <Link
                  href="/markets"
                  className="text-sm font-semibold text-accent hover:text-white transition-colors"
                >
                  View export markets →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="hero-export-accent-bar" aria-hidden />
    </section>
  );
}
