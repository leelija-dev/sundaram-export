/** Local hero background photos — files in `public/hero/`. */

import type { MapBreakpoint } from "@/lib/map-layout";

export type Responsive<T> = T | Partial<Record<MapBreakpoint, T>>;

export type HeroPhotoSlide = {
  src: string;
  alt: string;
  objectPosition?: Responsive<string>;
  opacity?: Responsive<number>;
};

export const HERO_DEFAULT_OPACITY: Record<MapBreakpoint, number> = {
  mobile: 0.82,
  tablet: 0.82,
  lg: 0.82,
  desktop: 0.82,
};

const BP_ORDER: MapBreakpoint[] = ["mobile", "tablet", "lg", "desktop"];

function resolveResponsive<T>(
  value: Responsive<T> | undefined,
  breakpoint: MapBreakpoint,
  fallback: T
): T {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return value as T;

  const record = value as Partial<Record<MapBreakpoint, T>>;
  if (record[breakpoint] != null) return record[breakpoint] as T;

  const start = BP_ORDER.indexOf(breakpoint);
  for (let i = start - 1; i >= 0; i--) {
    const key = BP_ORDER[i];
    if (record[key] != null) return record[key] as T;
  }
  for (let i = start + 1; i < BP_ORDER.length; i++) {
    const key = BP_ORDER[i];
    if (record[key] != null) return record[key] as T;
  }

  return fallback;
}

export function resolveHeroObjectPosition(
  slide: HeroPhotoSlide,
  breakpoint: MapBreakpoint
): string {
  return resolveResponsive(slide.objectPosition, breakpoint, "70% center");
}

export function resolveHeroOpacity(slide: HeroPhotoSlide, breakpoint: MapBreakpoint): number {
  return resolveResponsive(slide.opacity, breakpoint, HERO_DEFAULT_OPACITY[breakpoint]);
}

/** Slides 2–5: logistic hub → highway truck → container ship → airplane. */
export const HERO_PHOTO_SLIDES: HeroPhotoSlide[] = [
  {
    src: "/hero/logistick_hub.jpg",
    alt: "Global logistics hub",
    objectPosition: {
      mobile: "68% center",
      tablet: "70% center",
      lg: "72% center",
      desktop: "72% center",
    },
  },
  {
    src: "/hero/highway_truck.jpg",
    alt: "Highway freight truck",
    objectPosition: {
      mobile: "65% center",
      tablet: "68% center",
      lg: "70% center",
      desktop: "70% center",
    },
  },
  {
    src: "/hero/container_ship.jpg",
    alt: "Container ship at port",
    objectPosition: {
      mobile: "64% center",
      tablet: "66% center",
      lg: "68% center",
      desktop: "68% center",
    },
  },
  {
    src: "/hero/airplane_flight.jpeg",
    alt: "Airplane in flight over global logistics port",
    objectPosition: {
      mobile: "62% 40%",
      tablet: "70% 38%",
      lg: "74% 38%",
      desktop: "76% 38%",
    },
    opacity: {
      mobile: 0.82,
      tablet: 0.82,
      lg: 0.82,
      desktop: 0.82,
    },
  },
];

export const HERO_SLIDE_COUNT = 1 + HERO_PHOTO_SLIDES.length;
