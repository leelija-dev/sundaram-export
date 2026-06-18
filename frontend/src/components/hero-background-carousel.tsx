"use client";

/** Crossfades hero backgrounds — export map + logistics photo slides. */

import { useEffect, useState } from "react";
import { ExportNetworkVisual } from "@/components/export-network-visual";
import { HeroPhotoBackground } from "@/components/hero-photo-background";
import { HERO_PHOTO_SLIDES, HERO_SLIDE_COUNT } from "@/lib/hero-images";
import { cn } from "@/lib/utils";

const SLIDE_MS = 8000;
const FADE_MS = 1400;

function isSlideVisible(slideIndex: number, activeSlide: number, reduceMotion: boolean) {
  if (reduceMotion) return slideIndex === 0;
  return activeSlide === slideIndex;
}

export function HeroBackgroundCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % HERO_SLIDE_COUNT),
      SLIDE_MS
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={cn(
          "absolute inset-0 transition-opacity ease-in-out",
          isSlideVisible(0, activeSlide, reduceMotion)
            ? "z-[1] opacity-100"
            : "pointer-events-none z-0 opacity-0"
        )}
        style={{ transitionDuration: reduceMotion ? "0ms" : `${FADE_MS}ms` }}
      >
        <ExportNetworkVisual />
      </div>

      {HERO_PHOTO_SLIDES.map((slide, index) => {
        const slideIndex = index + 1;
        const visible = isSlideVisible(slideIndex, activeSlide, reduceMotion);

        return (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              visible ? "z-[1] opacity-100" : "pointer-events-none z-0 opacity-0"
            )}
            style={{ transitionDuration: reduceMotion ? "0ms" : `${FADE_MS}ms` }}
          >
            <HeroPhotoBackground slide={slide} priority={index === 0} />
          </div>
        );
      })}
    </div>
  );
}
