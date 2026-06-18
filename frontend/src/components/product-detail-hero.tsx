import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { Container } from "@/components/site-ui";
import { CategoryIcon } from "@/lib/business-icons";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type ProductDetailHeroProps = {
  title: string;
  lead: string;
  category: string;
  categoryLabel: string;
  imageSrc: string;
};

export function ProductDetailHero({
  title,
  lead,
  category,
  categoryLabel,
  imageSrc,
}: ProductDetailHeroProps) {
  return (
    <section className="relative min-h-[24rem] overflow-hidden border-b border-white/10 bg-primary text-white sm:min-h-[28rem] lg:min-h-[32rem]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <ProductImage
          src={imageSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-primary-dark/45 to-primary-dark/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/50 via-transparent to-primary-dark/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_40%,rgba(10,36,56,0.55),transparent_70%)]" />
      </div>

      <Container className="relative z-10 py-10 sm:py-14 lg:py-16">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-1.5 text-base font-medium text-white/85 transition-colors hover:text-white"
        >
          <ChevronLeftIcon className="h-4 w-4" aria-hidden />
          Back to all products
        </Link>

        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent-light sm:text-base">
            <CategoryIcon category={category} className="h-5 w-5 text-accent-light" />
            <span>{categoryLabel}</span>
          </div>

          <h1 className="products-hero-title mt-3 text-pretty text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {lead && (
            <p className="products-hero-lead mt-3 max-w-3xl text-base leading-relaxed text-white sm:text-lg">
              {lead}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
