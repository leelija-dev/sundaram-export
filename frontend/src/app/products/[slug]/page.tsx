//src/app/products/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Container,
  DetailLayout,
  DetailList,
  PageHero,
  QuoteSidebar,
  PageSection,
} from "@/components/site-ui";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.title} | Sundaram Export`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  // Category emoji mapping for visual flair
  const categoryEmoji: Record<string, string> = {
    spices: "🌿",
    textiles: "🧵",
    engineering: "⚙️",
    chemicals: "🧪",
    "food-beverage": "🍽️",
    handicrafts: "🏺",
  };
  const emoji = categoryEmoji[product.category] || "📦";

  return (
    <>
      {/* Enhanced PageHero with category badge and accent gradient */}
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <span className="capitalize">{product.category.replace("-", " ")}</span>
          </span>
        }
        title={product.title}
        description={product.description}
      >
        {/* Optional: add a small trust badge under description */}
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Verified Export Quality</span>
          <span className="rounded-full bg-white/10 px-3 py-1">✓ Global Shipment Ready</span>
        </div>
      </PageHero>

      <PageSection className="animate-fade-up">
        <Container>
          {/* Back link with animated arrow */}
          <Link
            href="/products"
            className="group mb-6 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all hover:gap-2 hover:text-primary sm:mb-8"
          >
            ← <span>Back to all products</span>
          </Link>

          <DetailLayout sidebar={<QuoteSidebar subject={product.title} />}>
            <div className="space-y-8">
              {/* Product image placeholder – premium visual */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 p-8 text-center shadow-inner">
                <div className="text-6xl sm:text-7xl md:text-8xl">{emoji}</div>
                <p className="mt-3 text-sm text-muted">{product.category.replace("-", " ")} division</p>
              </div>

              {/* HS Code highlight card */}
              {product.hsCode && (
                <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">HS Code</p>
                  <p className="mt-1 font-mono text-lg font-medium text-foreground">{product.hsCode}</p>
                </div>
              )}

              {/* Specifications & Quality – enhanced with icons */}
              {product.specifications.length > 0 && (
                <div className="animate-fade-up [animation-delay:0.1s]">
                  <DetailList title="Specifications & quality" items={product.specifications} />
                </div>
              )}

              {/* Packaging options */}
              {product.packaging.length > 0 && (
                <div className="animate-fade-up [animation-delay:0.2s]">
                  <DetailList title="Packaging options" items={product.packaging} />
                </div>
              )}

              {/* Origins */}
              {product.origins.length > 0 && (
                <div className="animate-fade-up [animation-delay:0.3s]">
                  <h2 className="text-base font-semibold text-foreground sm:text-lg">Origins</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.origins.map((origin) => (
                      <span
                        key={origin}
                        className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted shadow-sm transition-all hover:scale-105 hover:border-accent/30"
                      >
                        {origin}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Active export markets */}
              {product.markets.length > 0 && (
                <div className="animate-fade-up [animation-delay:0.4s]">
                  <h2 className="text-base font-semibold text-foreground sm:text-lg">Active export markets</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.markets.map((market) => (
                      <span
                        key={market}
                        className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-primary transition-all hover:scale-105 hover:bg-secondary/20"
                      >
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional trust section */}
              <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center text-sm text-muted">
                <span className="font-semibold text-accent">✓ Export‑ready documentation</span> – Including COO, phytosanitary, test reports, and BL coordination.
              </div>
            </div>
          </DetailLayout>
        </Container>
      </PageSection>
    </>
  );
}