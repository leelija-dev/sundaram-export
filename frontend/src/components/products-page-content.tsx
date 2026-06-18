"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import {
  Button,
  CardGrid,
  Container,
  PageSection,
  SectionHeading,
} from "@/components/site-ui";
import {
  ALL_CATEGORIES_ICON,
  DEFAULT_PRODUCT_ICON,
  getCategoryIcon,
  type BusinessIcon,
} from "@/lib/business-icons";
import { ProductsHeroSliceBackground } from "@/components/products-hero-slice-background";
import { getProductImage } from "@/lib/product-images";
import { selectRecentProductHeroSlices } from "@/lib/recent-products";
import { formatCategoryLabel, type ExportProduct } from "@/lib/types/catalog";
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  FunnelIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

type ProductsPageContentProps = {
  products: ExportProduct[];
  marketCount: number;
};

type CategoryFilter = {
  slug: string;
  label: string;
  count: number;
  icon: BusinessIcon;
};

function buildCategoryFilters(products: ExportProduct[]): CategoryFilter[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }

  return [
    { slug: "all", label: "All", count: products.length, icon: ALL_CATEGORIES_ICON },
    ...Array.from(counts.entries())
      .sort(([a], [b]) => formatCategoryLabel(a).localeCompare(formatCategoryLabel(b)))
      .map(([slug, count]) => ({
        slug,
        label: formatCategoryLabel(slug),
        count,
        icon: getCategoryIcon(slug),
      })),
  ];
}

function ProductCatalogCard({ product }: { product: ExportProduct }) {
  const imageSrc = getProductImage(product.slug, product.category, product.imageUrl);
  const primaryOrigin = product.origins[0];
  const marketLabel =
    product.markets.length === 0
      ? null
      : product.markets.length === 1
        ? product.markets[0]
        : `${product.markets.length} markets`;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-interactive card-product group h-full"
      aria-label={`View details for ${product.title}`}
    >
      <div className="card-media card-media--image relative">
        <ProductImage
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/10 to-transparent" />
        <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/20 bg-primary-dark/75 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {formatCategoryLabel(product.category)}
        </span>
      </div>

      <div className="card-body card-body--compact flex flex-col">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-primary transition-colors group-hover:text-secondary sm:text-xl">
          {product.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-base leading-relaxed text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {product.hsCode && (
            <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-surface px-2 py-1.5">
              <ClipboardDocumentListIcon className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden />
              <span className="truncate font-mono text-primary">HS {product.hsCode}</span>
            </div>
          )}
          {product.specifications.length > 0 && (
            <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-surface px-2 py-1.5">
              <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
              <span className="truncate text-primary">
                {product.specifications.length} spec{product.specifications.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>

        <div className="card-footer mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-sm text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden />
            <span className="truncate">{primaryOrigin ?? "India"}</span>
          </span>
          {marketLabel ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <GlobeAltIcon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
              <span className="truncate">{marketLabel}</span>
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 font-medium text-secondary group-hover:text-accent">
              View details
              <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductsPageContent({ products, marketCount }: ProductsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryFilters = useMemo(() => buildCategoryFilters(products), [products]);
  const heroSlices = useMemo(() => selectRecentProductHeroSlices(products), [products]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const productLineStat = products.length >= 10 ? `${products.length}+` : String(products.length);
  const marketStat = marketCount >= 10 ? `${marketCount}+` : String(marketCount);

  const stats = [
    { value: productLineStat, label: "Product lines", icon: DEFAULT_PRODUCT_ICON },
    { value: marketStat, label: "Export markets", icon: GlobeAltIcon },
    { value: "100%", label: "Quality assured", icon: ShieldCheckIcon },
  ] as const;

  return (
    <>
      <section className="relative min-h-[28rem] overflow-hidden border-b border-white/10 bg-primary py-12 text-white sm:min-h-[32rem] sm:py-16 lg:min-h-[36rem] lg:py-20">
        <ProductsHeroSliceBackground slices={heroSlices} />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-primary-dark/92 px-5 py-8 shadow-2xl shadow-black/30 backdrop-blur-md sm:px-10 sm:py-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-light sm:text-base">
                Export products
              </p>
              <h1 className="products-hero-title mt-2 text-pretty text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Export-ready product divisions
              </h1>
              <p className="products-hero-lead mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white sm:mt-4 sm:text-lg">
                Sourcing, documentation, packaging, and logistics for every product line.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              {stats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/20 bg-white/[0.08] p-4 text-center backdrop-blur-sm"
                  >
                    <StatIcon className="mx-auto mb-2 h-6 w-6 text-teal-300" aria-hidden />
                    <p className="text-2xl font-bold tabular-nums text-white">{stat.value}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-white/85 sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <PageSection className="bg-background">
        <Container>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-surface/40 py-16 text-center">
              <DEFAULT_PRODUCT_ICON className="mx-auto mb-3 h-12 w-12 text-muted" aria-hidden />
              <h2 className="text-lg font-semibold text-primary">Catalog updating</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Published products will appear here once they are added in the export desk. Upload a
                product image in the desk for each listing, or a category placeholder will be used.
              </p>
              <Button href="/quote" variant="accent" className="mt-6">
                Request a quote
              </Button>
            </div>
          ) : (
            <>
              {categoryFilters.length > 1 && (
                <div className="mb-8">
                  <div className="mb-3 flex items-center justify-center gap-2 text-muted">
                    <FunnelIcon className="h-4 w-4 text-accent" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider">Browse by category</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {categoryFilters.map((category) => {
                      const isActive = selectedCategory === category.slug;
                      const FilterIcon = category.icon;
                      return (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() => setSelectedCategory(category.slug)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            isActive
                              ? "border-secondary/40 bg-secondary/10 text-primary"
                              : "border-border bg-background text-muted hover:border-secondary/30 hover:text-primary"
                          }`}
                        >
                          <FilterIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          {category.label}
                          <span className={isActive ? "text-secondary" : "text-muted/70"}>
                            ({category.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <SectionHeading
                eyebrow="Product catalog"
                title={
                  selectedCategory === "all"
                    ? "Browse export-ready lines"
                    : formatCategoryLabel(selectedCategory)
                }
                description={`${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} available${
                  selectedCategory !== "all" ? ` in ${formatCategoryLabel(selectedCategory)}` : ""
                }.`}
              />

              {selectedCategory !== "all" && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="text-sm font-medium text-secondary transition-colors hover:text-accent"
                  >
                    Clear filter
                  </button>
                </div>
              )}

              {filteredProducts.length > 0 ? (
                <CardGrid variant="cardsThree" className="mt-8 sm:mt-10 lg:mt-12">
                  {filteredProducts.map((product) => (
                    <ProductCatalogCard key={product.slug} product={product} />
                  ))}
                </CardGrid>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface/30 py-12 text-center">
                  <MagnifyingGlassIcon className="mx-auto mb-3 h-12 w-12 text-muted" aria-hidden />
                  <p className="text-muted">
                    No products found in &ldquo;{formatCategoryLabel(selectedCategory)}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="mt-3 text-sm font-medium text-secondary hover:text-accent"
                  >
                    View all products
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-12 rounded-2xl border border-border/70 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
            <div className="flex items-start gap-3 sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-primary">Need a quote?</p>
                <p className="mt-0.5 text-base text-muted">
                  Get product recommendations from our trade desk.
                </p>
              </div>
            </div>
            <Button href="/quote" variant="accent" className="mt-4 w-full sm:mt-0 sm:w-auto">
              Request a quote
              <ChevronRightIcon className="ml-1 h-4 w-4" aria-hidden />
            </Button>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
