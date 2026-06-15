import Link from "next/link";
import { Button, Container } from "@/components/site-ui";
import { ExportNetworkVisual } from "@/components/export-network-visual";
import { site, stats } from "@/data/site";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

const HERO_FEATURES = [
  {
    icon: GlobeAltIcon,
    title: "90+ markets",
    desc: "Active export corridors worldwide",
  },
  {
    icon: ShieldCheckIcon,
    title: "Fully compliant",
    desc: "ISO, APEDA & DGFT aligned",
  },
  {
    icon: TruckIcon,
    title: "Port to door",
    desc: "Freight, docs & milestone tracking",
  },
] as const;

export function HomeHero() {
  return (
    <section className="relative min-h-[min(100svh,54rem)] overflow-visible bg-[#0a2540] pb-14 text-white sm:min-h-[min(92svh,58rem)] sm:pb-16 lg:min-h-[min(88svh,62rem)] lg:pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#061a2e] via-[#0a2540] to-[#0d3158]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_0%_0%,rgba(37,99,235,0.16),transparent_52%),radial-gradient(ellipse_58%_48%_at_88%_38%,rgba(245,158,11,0.14),transparent_54%),radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.1),transparent_48%)]" />

        <div
          className="absolute inset-0 opacity-[0.42]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.55] mix-blend-soft-light"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute -left-1/4 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />

        <div
          className="absolute inset-y-0 left-0 w-full max-w-[min(100%,60rem)] bg-gradient-to-r from-[#0a2540]/88 from-8% via-[#0a2540]/42 via-52% to-transparent max-lg:max-w-[88%] lg:max-w-[50%] xl:max-w-[58%]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/80 via-transparent to-[#0a2540]/22" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0a2540]/85 to-transparent sm:h-32" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-secondary/45 to-transparent" />
      </div>

      <ExportNetworkVisual />

      <Container className="relative z-10 flex min-h-[min(100svh,54rem)] max-w-[1400px] flex-col justify-between px-4 pt-10 pb-6 pointer-events-none sm:min-h-[min(92svh,58rem)] sm:px-6 sm:pt-14 sm:pb-8 lg:min-h-[min(88svh,62rem)] lg:px-8 lg:pt-16 lg:pb-10">
        <div className="flex flex-1 flex-col justify-center">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="pointer-events-auto min-w-0 pt-6 sm:pt-8 md:pt-10 lg:col-span-7 lg:pt-12 xl:col-span-6">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 sm:text-xs">
                  Global export house
                </span>
                <span className="hidden h-3 w-px bg-white/20 sm:block" />
                <span className="hidden text-xs text-white/55 sm:inline">Est. {site.founded}</span>
              </div>

              <h1 className="max-md:text-pretty text-[1.85rem] font-extrabold leading-[1.12] tracking-tight min-[400px]:text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.25rem]">
                <span className="md:whitespace-nowrap">
                  <span className="block md:inline">Connecting Indian </span>
                  <span className="block md:inline">Excellence</span>
                </span>
                <span className="mt-2 block bg-gradient-to-r from-accent via-[#fbbf24] to-accent bg-clip-text text-transparent sm:mt-2.5 md:mt-2">
                  to Global Markets
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-base md:text-lg">
                {site.description}
              </p>

              {/* Value props */}
              <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                {HERO_FEATURES.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-sm sm:p-3.5"
                  >
                    <item.icon className="mb-2 h-5 w-5 text-accent" aria-hidden />
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-white/55 sm:text-xs">{item.desc}</p>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
                <Button
                  href="/quote"
                  variant="accent"
                  fullWidthOnMobile
                  className="px-6 py-3.5 text-sm font-bold shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 sm:text-base"
                >
                  Request export quote
                </Button>
                <Button
                  href="/products"
                  variant="outline"
                  fullWidthOnMobile
                  className="border-white/25 bg-white/[0.06] px-6 py-3.5 text-sm text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 sm:text-base"
                >
                  View product catalog
                </Button>
              </div>

              <Link
                href="/markets"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-accent"
              >
                Explore global markets
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Spacer — map visible on the right */}
            <div className="hidden min-h-[280px] lg:col-span-5 lg:block xl:col-span-6" aria-hidden />
          </div>
        </div>

        <div className="relative z-10 mt-6 w-full sm:mt-8 lg:mt-6">
          <div
            className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4 md:gap-2 lg:ml-auto lg:flex lg:w-auto lg:flex-wrap lg:justify-end lg:gap-2"
            role="list"
            aria-label="Certifications and memberships"
          >
            {site.certifications.map((cert) => (
              <span
                key={cert}
                role="listitem"
                className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-2 text-[10px] font-medium leading-snug text-white/80 backdrop-blur-sm sm:justify-start sm:px-2.5 sm:py-1.5 sm:text-[11px] md:px-3 md:text-xs lg:shrink-0"
              >
                <BuildingOffice2Icon
                  className="h-3 w-3 shrink-0 text-accent sm:h-3.5 sm:w-3.5"
                  aria-hidden
                />
                <span className="min-w-0 text-pretty md:whitespace-nowrap">{cert}</span>
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* Stats — anchored to hero bottom, overlapping next section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2">
        <Container className="max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d3158]/95 shadow-2xl shadow-black/35 backdrop-blur-md">
            <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="px-3 py-4 text-center sm:px-4 sm:py-5">
                  <p className="text-xl font-black tabular-nums text-accent sm:text-2xl md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/65 sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

    </section>
  );
}
