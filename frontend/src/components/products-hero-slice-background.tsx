"use client";

import { ProductImage } from "@/components/product-image";
import type { ProductHeroSlice } from "@/lib/recent-products";

type ProductsHeroSliceBackgroundProps = {
  slices: ProductHeroSlice[];
};

export function ProductsHeroSliceBackground({ slices }: ProductsHeroSliceBackgroundProps) {
  if (slices.length === 0) {
    return (
      <>
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('/hero/logistick_hub.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-dark/75 via-primary/55 to-primary-dark/80"
          aria-hidden
        />
      </>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 flex gap-0.5 sm:gap-1">
        {slices.map((slice, index) => (
          <div key={slice.slug} className="relative min-w-0 flex-1 overflow-hidden">
            <ProductImage
              src={slice.imageSrc}
              alt=""
              fill
              sizes={`${Math.round(100 / slices.length)}vw`}
              className="object-cover"
              style={{ objectPosition: index % 2 === 0 ? "center" : "center 30%" }}
              priority={index < 2}
            />
          </div>
        ))}
      </div>

      {/* Edge vignette — slices stay visible at sides */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-transparent to-primary-dark/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/35 via-transparent to-primary-dark/35" />
    </div>
  );
}
