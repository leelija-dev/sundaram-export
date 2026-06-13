// src/app/products/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Container,
  PageSection,
} from "@/components/site-ui";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// Demo products data
const demoProducts = [
  {
    slug: "premium-basmati-rice",
    title: "Premium Basmati Rice",
    shortDescription: "Aged basmati rice with long grains, aromatic fragrance, and authentic Indian taste.",
    category: "spices",
    hsCode: "10063020",
    origins: ["Punjab", "Haryana"],
    moq: "1 x 20ft FCL (20 MT)",
    leadTime: "15-20 days",
    rating: 4.9,
  },
  {
    slug: "organic-turmeric-powder",
    title: "Organic Turmeric Powder",
    shortDescription: "High-curcumin organic turmeric powder (5%+ curcumin). Grown without pesticides.",
    category: "spices",
    hsCode: "09103030",
    origins: ["Tamil Nadu", "Kerala"],
    moq: "5 MT",
    leadTime: "10-15 days",
    rating: 4.8,
  },
  {
    slug: "red-chili-powder",
    title: "Red Chili Powder",
    shortDescription: "Premium red chili powder from Guntur with high color value and pungency.",
    category: "spices",
    hsCode: "09042210",
    origins: ["Andhra Pradesh", "Telangana"],
    moq: "10 MT",
    leadTime: "12-18 days",
    rating: 4.7,
  },
  {
    slug: "organic-cotton-textiles",
    title: "Organic Cotton Textiles",
    shortDescription: "GOTS-certified organic cotton fabrics and garments.",
    category: "textiles",
    hsCode: "52091190",
    origins: ["Maharashtra", "Gujarat"],
    moq: "5000 meters",
    leadTime: "25-30 days",
    rating: 4.9,
  },
  {
    slug: "premium-denim-fabrics",
    title: "Premium Denim Fabrics",
    shortDescription: "Premium denim fabrics for global fashion brands.",
    category: "textiles",
    hsCode: "52094200",
    origins: ["Tamil Nadu", "Gujarat"],
    moq: "3000 yards",
    leadTime: "20-25 days",
    rating: 4.8,
  },
  {
    slug: "handloom-silk-sarees",
    title: "Handloom Silk Sarees",
    shortDescription: "Authentic handwoven silk sarees from Varanasi and Kanchipuram.",
    category: "textiles",
    hsCode: "50072090",
    origins: ["Varanasi", "Kanchipuram"],
    moq: "100 pieces",
    leadTime: "30-40 days",
    rating: 4.9,
  },
  {
    slug: "industrial-gears",
    title: "Industrial Gears",
    shortDescription: "Precision-engineered industrial gears for heavy machinery.",
    category: "engineering",
    hsCode: "84839000",
    origins: ["Punjab", "Gujarat"],
    moq: "500 pieces",
    leadTime: "30-35 days",
    rating: 4.9,
  },
  {
    slug: "automotive-forgings",
    title: "Automotive Forgings",
    shortDescription: "High-strength forged components for automotive industry.",
    category: "engineering",
    hsCode: "87089900",
    origins: ["Maharashtra", "Tamil Nadu"],
    moq: "1000 pieces",
    leadTime: "25-30 days",
    rating: 4.8,
  },
  {
    slug: "zinc-oxide",
    title: "Zinc Oxide (99.8% Purity)",
    shortDescription: "High-purity zinc oxide for rubber, ceramics, and cosmetics industries.",
    category: "chemicals",
    hsCode: "28170010",
    origins: ["Rajasthan", "Gujarat"],
    moq: "10 MT",
    leadTime: "15-20 days",
    rating: 4.9,
  },
  {
    slug: "titanium-dioxide",
    title: "Titanium Dioxide (Rutile Grade)",
    shortDescription: "High-opacity titanium dioxide for paints, plastics, and paper industries.",
    category: "chemicals",
    hsCode: "32061110",
    origins: ["Kerala", "Gujarat"],
    moq: "15 MT",
    leadTime: "20-25 days",
    rating: 4.7,
  },
  {
    slug: "caustic-soda-flakes",
    title: "Caustic Soda Flakes",
    shortDescription: "Industrial-grade caustic soda flakes for various manufacturing processes.",
    category: "chemicals",
    hsCode: "28151190",
    origins: ["Gujarat", "Odisha"],
    moq: "20 MT",
    leadTime: "10-15 days",
    rating: 4.8,
  },
];

const categoryLabels = [
  { name: "All", count: demoProducts.length, icon: "🌐" },
  { name: "spices", count: demoProducts.filter(p => p.category === "spices").length, icon: "🌶️" },
  { name: "textiles", count: demoProducts.filter(p => p.category === "textiles").length, icon: "🧵" },
  { name: "engineering", count: demoProducts.filter(p => p.category === "engineering").length, icon: "⚙️" },
  { name: "chemicals", count: demoProducts.filter(p => p.category === "chemicals").length, icon: "🧪" },
];

// BIG STATS CARDS - matching About page size, using original colors
const stats = [
  { value: "11+", label: "Product Lines", icon: "📦", bgGradient: "from-blue-600 to-blue-500" },
  { value: "90+", label: "Export Markets", icon: "🌍", bgGradient: "from-accent to-accent/80" },
  { value: "100%", label: "Quality Assured", icon: "✓", bgGradient: "from-green-600 to-emerald-500" },
];

function ProductCard({ product, index }: { product: typeof demoProducts[0]; index: number }) {
  const getCategoryIcon = () => {
    const icons: Record<string, string> = {
      spices: "🌶️",
      textiles: "🧵",
      engineering: "⚙️",
      chemicals: "🧪",
    };
    return icons[product.category] || "📦";
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div
        className="group relative rounded-xl bg-white border border-border/50 overflow-hidden shadow-sm transition-all duration-500 hover:shadow-lg hover:border-accent/30 cursor-pointer"
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        <div className="relative p-4 pb-2 bg-gradient-to-br from-blue-50/50 to-accent/5">
          <div className="flex items-start justify-between">
            <div className="text-4xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
              {getCategoryIcon()}
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? "text-accent" : "text-gray-200"}`}>★</span>
              ))}
            </div>
          </div>
          <h3 className="text-base font-bold text-primary mt-2 line-clamp-1 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-muted mt-1 line-clamp-2">{product.shortDescription}</p>
        </div>

        <div className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {product.hsCode && (
              <div className="flex items-center gap-1">
                <span className="text-blue-600 text-xs">📋</span>
                <span className="text-xs text-primary font-mono">HS: {product.hsCode}</span>
              </div>
            )}
            {product.moq && (
              <div className="flex items-center gap-1">
                <span className="text-accent text-xs">📦</span>
                <span className="text-xs text-primary truncate">MOQ: {product.moq}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted border-t border-border/30 pt-2">
            <div className="flex items-center gap-1"><span>📍</span><span>{product.origins[0]}</span></div>
            <div className="flex items-center gap-1"><span>⏱️</span><span>{product.leadTime}</span></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-transparent transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100 origin-left" />
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? demoProducts
      : demoProducts.filter((product) => product.category === selectedCategory);

  const getDisplayName = (name: string) => {
    if (name === "All") return "All";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

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
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.06),transparent_50%)]" />
        
        <Container>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-accent/50" />
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">Premium Products</p>
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              </div>
              <div className="h-px w-6 bg-gradient-to-l from-transparent to-accent/50" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
              Export‑ready
              <span className="relative ml-2 inline-block">
                <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                  product divisions
                </span>
              </span>
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-2xl mx-auto text-sm text-muted sm:text-base">
              Each line includes sourcing, quality documentation, packaging options, and coordinated logistics to your destination market.
            </p>

            {/* BIG STATS CARDS - Matching About page size */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl bg-gradient-to-r ${stat.bgGradient} backdrop-blur-sm border border-white/20 p-6 text-center text-white shadow-xl transition-all hover:-translate-y-2 animate-fade-slide-up`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/90">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs text-accent animate-fade-slide-up">✓ Verified compliance</span>
              <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs text-accent animate-fade-slide-up">✓ Global logistics network</span>
              <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs text-accent animate-fade-slide-up">✓ End‑to‑end traceability</span>
            </div>
          </div>
        </Container>
      </section>

      <PageSection>
        <Container>
          {/* Category Filter Bar */}
          <div className="text-center mb-8 animate-fade-slide-up">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 mb-2">
              <span className="text-accent text-[10px]">◆</span>
              <span className="text-[10px] font-medium text-accent">Browse by category</span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {categoryLabels.map((category) => {
                const isActive = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`category-pill flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "active border-accent text-accent bg-gradient-to-r from-accent/10 to-transparent shadow-sm"
                        : "border-border/40 text-muted hover:border-accent/40 hover:text-foreground hover:bg-accent/5"
                    }`}
                  >
                    <span className="text-sm">{category.icon}</span>
                    <span>{getDisplayName(category.name)}</span>
                    <span className={`text-[10px] ${isActive ? "text-accent/70" : "text-muted/60"}`}>({category.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-2 border-b border-border/30 animate-slide-up">
            <div>
              <h2 className="text-lg font-semibold text-primary">Product Catalog</h2>
              <p className="text-xs text-muted">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} available
                {selectedCategory !== "All" && (
                  <span className="ml-1">in <span className="text-accent font-medium">{selectedCategory}</span></span>
                )}
              </p>
            </div>
            {selectedCategory !== "All" && (
              <button onClick={() => setSelectedCategory("All")} className="text-xs text-accent hover:text-secondary transition-colors">
                Clear filter ✕
              </button>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product, index) => (
                <div key={product.slug} className="animate-scale-in" style={{ animationDelay: `${index * 0.03}s` }}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">🔍</div>
              <p className="text-muted">No products found in "{selectedCategory}"</p>
              <button onClick={() => setSelectedCategory("All")} className="mt-3 text-accent hover:text-secondary transition-colors text-sm">
                View all products →
              </button>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 rounded-xl bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 p-5 text-center border border-accent/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <p className="font-semibold text-primary text-sm">Need assistance?</p>
                  <p className="text-xs text-muted">Get personalized product recommendations</p>
                </div>
              </div>
              <Link href="/quote" className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-accent/80 hover:shadow-md">
                Request a quote
                <ChevronRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}