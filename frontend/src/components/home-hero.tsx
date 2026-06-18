import Link from "next/link";
import { Button, Container } from "@/components/site-ui";
import { HeroBackgroundCarousel } from "@/components/hero-background-carousel";
import { site } from "@/data/site";
import { formatStatCount } from "@/lib/format-stat";
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

type HomeHeroProps = {
  exportCorridorCount: number;
  industryCount: number;
  productCategoryCount: number;
  productCount: number;
};

type HeroStat = {
  value: string;
  label: string;
};

function buildHeroStats({
  exportCorridorCount,
  industryCount,
  productCategoryCount,
  productCount,
}: HomeHeroProps): HeroStat[] {
  const stats: HeroStat[] = [];

  if (exportCorridorCount > 0) {
    stats.push({
      value: formatStatCount(exportCorridorCount, 90),
      label: "Countries served",
    });
  }

  if (industryCount > 0) {
    stats.push({
      value: formatStatCount(industryCount),
      label: "Active sectors",
    });
  }

  if (productCategoryCount > 0) {
    stats.push({
      value: formatStatCount(productCategoryCount),
      label: "Product divisions",
    });
  } else if (productCount > 0) {
    stats.push({
      value: formatStatCount(productCount),
      label: "Catalog products",
    });
  }

  stats.push({ value: "24/7", label: "Operations desk" });

  return stats.slice(0, 4);
}

function buildHeroFeatures(exportCorridorCount: number) {
  const marketsLabel =
    exportCorridorCount > 0
      ? `${formatStatCount(exportCorridorCount, 90)} markets`
      : "Global markets";

  return [
    {
      icon: GlobeAltIcon,
      title: marketsLabel,
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
}

export function HomeHero({
  exportCorridorCount,
  industryCount,
  productCategoryCount,
  productCount,
}: HomeHeroProps) {
  const heroStats = buildHeroStats({
    exportCorridorCount,
    industryCount,
    productCategoryCount,
    productCount,
  });
  const heroFeatures = buildHeroFeatures(exportCorridorCount);

  const statGridClass =
    heroStats.length <= 1
      ? "grid-cols-1"
      : heroStats.length === 2
        ? "grid-cols-2"
        : heroStats.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 md:grid-cols-4";

  return (
    <section className="relative min-h-[min(100svh,54rem)] overflow-visible bg-primary pb-14 text-white sm:min-h-[min(92svh,58rem)] sm:pb-16 lg:min-h-[min(88svh,62rem)] lg:pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_0%_0%,rgba(14,116,144,0.16),transparent_52%),radial-gradient(ellipse_58%_48%_at_88%_38%,rgba(217,119,6,0.14),transparent_54%),radial-gradient(circle_at_50%_100%,rgba(14,116,144,0.1),transparent_48%)]" />

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
          className="absolute inset-y-0 left-0 w-full max-w-[min(100%,60rem)] bg-gradient-to-r from-primary/88 from-8% via-primary/42 via-52% to-transparent max-lg:max-w-[88%] lg:max-w-[50%] xl:max-w-[58%]"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/22" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary/85 to-transparent sm:h-32" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-secondary/45 to-transparent" />
      </div>

      <HeroBackgroundCarousel />

      <Container className="relative z-10 flex min-h-[min(100svh,54rem)] max-w-[1400px] flex-col justify-between px-4 pt-10 pb-6 pointer-events-none sm:min-h-[min(92svh,58rem)] sm:px-6 sm:pt-14 sm:pb-8 lg:min-h-[min(88svh,62rem)] lg:px-8 lg:pt-16 lg:pb-10">
        <div className="flex flex-1 flex-col justify-center">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
            <div className="pointer-events-auto min-w-0 pt-6 sm:pt-8 md:pt-10 lg:col-span-7 lg:pt-12 xl:col-span-6">
              <h1 className="max-md:text-pretty text-[1.85rem] font-extrabold leading-[1.12] tracking-tight min-[400px]:text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl xl:text-[3.25rem]">
                <span className="md:whitespace-nowrap">
                  <span className="block md:inline">Connecting Indian </span>
                  <span className="block md:inline">Excellence</span>
                </span>
                <span className="mt-2 block bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent sm:mt-2.5 md:mt-2">
                  to Global Markets
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:mt-5 sm:text-lg">
                {site.description}
              </p>

              <ul className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
                {heroFeatures.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-white/15 bg-primary-dark/45 p-3 backdrop-blur-md sm:p-3.5 lg:border-white/20 lg:bg-primary-dark/55"
                  >
                    <item.icon className="mb-2 h-5 w-5 text-accent" aria-hidden />
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-snug text-white/70">{item.desc}</p>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
                <Button
                  href="/quote"
                  variant="accent"
                  fullWidthOnMobile
                  className="px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:text-white sm:text-base"
                >
                  Request export quote
                </Button>
                <Button
                  href="/products"
                  variant="outline"
                  fullWidthOnMobile
                  className="border-white/25 bg-primary-dark/35 px-6 py-3.5 text-sm text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-primary-dark/50 sm:text-base"
                >
                  View product catalog
                </Button>
              </div>

              <Link
                href="/markets"
                className="mt-4 inline-flex items-center gap-1.5 text-base font-medium text-white/70 transition-colors hover:text-accent"
              >
                Explore global markets
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="hidden min-h-[280px] lg:col-span-5 lg:block xl:col-span-6" aria-hidden />
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2">
        <Container className="max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-primary-dark/88 shadow-2xl shadow-black/35 backdrop-blur-lg lg:bg-primary-dark/92">
            <div className={`grid divide-x divide-white/10 ${statGridClass}`}>
              {heroStats.map((stat) => (
                <div key={stat.label} className="px-3 py-4 text-center sm:px-4 sm:py-5">
                  <p className="text-xl font-black tabular-nums text-accent sm:text-2xl md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/75 sm:text-sm">
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
