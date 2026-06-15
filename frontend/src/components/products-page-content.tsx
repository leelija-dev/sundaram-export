"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, PageSection, TrustBadge } from "@/components/site-ui";
import {
  ALL_CATEGORIES_ICON,
  DEFAULT_PRODUCT_ICON,
  getCategoryIcon,
  type BusinessIcon,
} from "@/lib/business-icons";
import { getProductImage } from "@/lib/product-images";
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

function ProductCatalogCard({ product, index }: { product: ExportProduct; index: number }) {
  const imageSrc = getProductImage(product.slug, product.category);
  const primaryOrigin = product.origins[0];
  const marketLabel =
    product.markets.length === 0
      ? null
      : product.markets.length === 1
        ? product.markets[0]
        : `${product.markets.length} markets`;

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/40 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-500 hover:border-accent/40 hover:shadow-lg"
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        <div className="relative h-40 overflow-hidden sm:h-44">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium capitalize text-primary shadow-sm">
            {formatCategoryLabel(product.category)}
          </span>
        </div>

        <div className="relative p-4 pb-2">
          <h3 className="line-clamp-1 text-base font-bold text-primary transition-colors group-hover:text-accent">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{product.shortDescription}</p>
        </div>

        <div className="p-4 pt-2">
          <div className="mb-2 grid grid-cols-2 gap-2">
            {product.hsCode && (
              <div className="flex items-center gap-1.5">
                <ClipboardDocumentListIcon className="h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden />
                <span className="truncate font-mono text-xs text-primary">HS: {product.hsCode}</span>
              </div>
            )}
            {product.specifications.length > 0 && (
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                <span className="truncate text-xs text-primary">
                  {product.specifications.length} spec{product.specifications.length === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs text-muted">
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPinIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">{primaryOrigin ?? "India"}</span>
            </div>
            {marketLabel && (
              <div className="flex shrink-0 items-center gap-1.5 pl-2">
                <GlobeAltIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{marketLabel}</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 transform bg-gradient-to-r from-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
      </div>
    </Link>
  );
}

export function ProductsPageContent({ products, marketCount }: ProductsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryFilters = useMemo(() => buildCategoryFilters(products), [products]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const productLineStat =
    products.length >= 10 ? `${products.length}+` : String(products.length);
  const marketStat = marketCount >= 10 ? `${marketCount}+` : String(marketCount);

  const stats: { value: string; label: string; icon: BusinessIcon }[] = [
    { value: productLineStat, label: "Product Lines", icon: DEFAULT_PRODUCT_ICON },
    { value: marketStat, label: "Export Markets", icon: GlobeAltIcon },
    { value: "100%", label: "Quality Assured", icon: ShieldCheckIcon },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(37,99,235,0.2), 0 0 10px rgba(245,158,11,0.1); }
          50% { box-shadow: 0 0 15px rgba(37,99,235,0.4), 0 0 20px rgba(245,158,11,0.25); }
          100% { box-shadow: 0 0 5px rgba(37,99,235,0.2), 0 0 10px rgba(245,158,11,0.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.4s ease-out forwards;
        }
        .category-pill.active {
          background: linear-gradient(135deg, #f59e0b15, #f59e0b05);
          border-color: #f59e0b;
          color: #f59e0b;
        }
        .glass-hero {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.1);
        }
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .stat-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
          transform: translateY(-6px) scale(1.01);
          animation: glowPulse 0.6s ease-out;
        }
        .stat-card:hover .stat-icon {
          animation: float 0.5s ease-out;
        }
        .stat-card:hover .stat-value {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          background-size: 200% 100%;
          animation: shimmer 0.6s ease-out;
        }
      `}</style>

      <section className="glass-hero relative overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.08),rgba(245,158,11,0.04)_70%)]" />

        <Container>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-1 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-accent" />
                <p className="bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent">
                  Premium Products
                </p>
                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-blue-500" />
              </div>
              <div className="h-px w-8 bg-gradient-to-l from-transparent via-accent to-transparent" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Export‑ready
              <span className="relative ml-3 inline-block">
                <span className="gradient-text">product divisions</span>
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-muted/90 sm:text-lg md:text-xl">
              Each line includes sourcing, quality documentation, packaging options, and coordinated
              logistics to your destination market.
            </p>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                <div
                  key={stat.label}
                  className="stat-card group relative animate-fade-slide-up cursor-pointer overflow-hidden rounded-2xl p-4 text-center"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-accent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-accent/20 backdrop-blur-xl" />
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 to-accent opacity-30 blur transition duration-500 group-hover:opacity-50" />
                  <div className="relative z-10">
                    <StatIcon className="stat-icon mx-auto mb-1 h-7 w-7 text-white drop-shadow-md transition-transform duration-300" />
                    <p className="stat-value text-2xl font-bold text-white drop-shadow-md">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/90">
                      {stat.label}
                    </p>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/30" />
                </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-1.5 gap-y-1">
              <TrustBadge className="animate-fade-slide-up border border-white/50 bg-white/40 text-blue-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-md">
                Verified compliance
              </TrustBadge>
              <TrustBadge className="animate-fade-slide-up border border-white/50 bg-white/40 text-blue-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-md">
                Global logistics network
              </TrustBadge>
              <TrustBadge className="animate-fade-slide-up border border-white/50 bg-white/40 text-blue-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/60 hover:shadow-md">
                End‑to‑end traceability
              </TrustBadge>
            </div>
          </div>
        </Container>
      </section>

      <PageSection>
        <Container>
          {products.length === 0 ? (
            <div className="glass-card rounded-xl py-16 text-center">
              <DEFAULT_PRODUCT_ICON className="mx-auto mb-3 h-12 w-12 text-muted" aria-hidden />
              <h2 className="text-lg font-semibold text-primary">Catalog updating</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Published products will appear here once they are added in the export desk. Contact our
                trade team for current availability.
              </p>
              <Link
                href="/quote"
                className="mt-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-accent px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
              >
                Request a quote
                <ChevronRightIcon className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <>
              {categoryFilters.length > 1 && (
                <div className="animate-fade-slide-up mb-8 text-center">
                  <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/50 px-2 py-0.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/60 hover:shadow-md">
                    <FunnelIcon className="h-3 w-3 text-accent" aria-hidden />
                    <span className="bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-[9px] font-medium text-transparent">
                      Browse by category
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {categoryFilters.map((category) => {
                      const isActive = selectedCategory === category.slug;
                      const FilterIcon = category.icon;
                      return (
                        <button
                          key={category.slug}
                          type="button"
                          onClick={() => setSelectedCategory(category.slug)}
                          className={`category-pill flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all duration-300 hover:scale-105 ${
                            isActive
                              ? "active border-accent bg-gradient-to-r from-accent/15 to-blue-500/10 text-accent shadow-sm backdrop-blur-sm"
                              : "border-white/40 bg-white/30 text-muted backdrop-blur-sm hover:border-accent/50 hover:bg-white/50 hover:text-foreground"
                          }`}
                        >
                          <FilterIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span className="leading-none">{category.label}</span>
                          <span
                            className={`text-[9px] leading-none ${isActive ? "text-accent/70" : "text-muted/60"}`}
                          >
                            ({category.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="animate-slide-up mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-white/30 pb-2">
                <div>
                  <h2 className="text-lg font-semibold text-primary">Product Catalog</h2>
                  <p className="text-xs text-muted/80">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"} available
                    {selectedCategory !== "all" && (
                      <span className="ml-1">
                        in{" "}
                        <span className="font-medium text-accent">
                          {formatCategoryLabel(selectedCategory)}
                        </span>
                      </span>
                    )}
                  </p>
                </div>
                {selectedCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="text-xs text-accent transition-all duration-300 hover:scale-105 hover:text-secondary"
                  >
                    Clear filter ✕
                  </button>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.slug}
                      className="animate-scale-in"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <ProductCatalogCard product={product} index={index} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl py-12 text-center transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
                  <MagnifyingGlassIcon className="mx-auto mb-3 h-12 w-12 text-muted" aria-hidden />
                  <p className="text-muted">
                    No products found in &ldquo;{formatCategoryLabel(selectedCategory)}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="mt-3 text-sm text-accent transition-colors hover:text-secondary"
                  >
                    View all products →
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-12 rounded-xl border border-white/40 bg-gradient-to-r from-blue-600/10 via-accent/5 to-blue-600/10 p-5 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-accent shadow-sm transition-transform duration-300 hover:scale-110">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden />
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-primary">Need assistance?</p>
                  <p className="text-xs text-muted/80">Get personalized product recommendations</p>
                </div>
              </div>
              <Link
                href="/quote"
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-accent px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-accent/90 hover:shadow-lg"
              >
                Request a quote
                <ChevronRightIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
