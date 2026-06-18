"use client";

/** Hero photo slide — full bleed below 1280px; right panel on xl+ desktop only. */

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getMapBreakpoint,
  MAP_CONTAINER_INSET,
  type MapBreakpoint,
} from "@/lib/map-layout";
import {
  resolveHeroObjectPosition,
  resolveHeroOpacity,
  type HeroPhotoSlide,
} from "@/lib/hero-images";
import { cn } from "@/lib/utils";

type HeroPhotoBackgroundProps = {
  slide: HeroPhotoSlide;
  priority?: boolean;
};

/** Full hero cover for mobile, tablet, and lg (1024–1279). */
function isFullBleed(breakpoint: MapBreakpoint) {
  return breakpoint !== "desktop";
}

export function HeroPhotoBackground({ slide, priority = false }: HeroPhotoBackgroundProps) {
  const [breakpoint, setBreakpoint] = useState<MapBreakpoint>("lg");

  useEffect(() => {
    const update = () => setBreakpoint(getMapBreakpoint(window.innerWidth));
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const objectPosition = resolveHeroObjectPosition(slide, breakpoint);
  const imageOpacity = resolveHeroOpacity(slide, breakpoint);
  const fullBleed = isFullBleed(breakpoint);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={cn(
          "absolute",
          fullBleed ? "inset-0" : MAP_CONTAINER_INSET.desktop,
          !fullBleed && "xl:inset-0"
        )}
      >
        <Image
          src={slide.src}
          alt=""
          fill
          unoptimized
          priority={priority}
          sizes={fullBleed ? "100vw" : "58vw"}
          className="object-cover"
          style={{ objectPosition, opacity: imageOpacity }}
        />
      </div>

      {fullBleed ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-primary/92 via-primary/55 via-45% to-primary/25"
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-[1] bg-gradient-to-r from-primary via-primary/88 to-transparent",
              breakpoint === "mobile" ? "w-[72%]" : "w-[58%]"
            )}
            aria-hidden
          />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-gradient-to-r from-primary/70 to-transparent sm:w-14"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-14 bg-gradient-to-l from-primary/50 to-transparent sm:w-20"
            aria-hidden
          />
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/92 via-primary/55 to-primary-light/35" />
      <div
        className={cn(
          "absolute inset-0",
          fullBleed
            ? "bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,rgba(217,119,6,0.12),transparent_65%)]"
            : "bg-[radial-gradient(ellipse_70%_55%_at_88%_42%,rgba(217,119,6,0.14),transparent_58%)]"
        )}
      />
      <div
        className="absolute inset-y-0 left-0 w-full max-w-[min(100%,60rem)] bg-gradient-to-r from-primary/88 from-8% via-primary/42 via-52% to-transparent max-lg:max-w-[88%] lg:max-w-[50%] xl:max-w-[58%]"
        aria-hidden
      />
    </div>
  );
}
