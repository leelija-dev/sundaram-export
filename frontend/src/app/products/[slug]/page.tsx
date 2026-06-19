import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetailHero } from "@/components/product-detail-hero";
import { ProductImage } from "@/components/product-image";
import { ProductDetailSkeleton } from "@/components/page-skeletons";
import {
  Container,
  DetailLayout,
  DetailList,
  QuoteSidebar,
  PageSection,
} from "@/components/site-ui";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { getProductImage } from "@/lib/product-images";
import { formatCategoryLabel } from "@/lib/types/catalog";

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

async function ProductDetailData({ slug }: { slug: string }) {
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const imageSrc = getProductImage(product.slug, product.category, product.imageUrl);
  const categoryLabel = formatCategoryLabel(product.category);
  const heroLead = product.shortDescription || product.description;

  return (
    <>
      <ProductDetailHero
        title={product.title}
        lead={heroLead}
        category={product.category}
        categoryLabel={categoryLabel}
        imageSrc={imageSrc}
      />

      <PageSection className="animate-fade-up">
        <Container>
          <DetailLayout sidebar={<QuoteSidebar subject={product.title} />}>
            <div className="space-y-8">
              {product.description && product.description !== product.shortDescription && (
                <div className="rounded-2xl border border-border/70 bg-surface/50 p-5 sm:p-6">
                  <h2 className="text-base font-semibold text-primary sm:text-lg">About this product</h2>
                  <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{product.description}</p>
                </div>
              )}

              <div className="relative overflow-hidden rounded-2xl bg-surface shadow-inner">
                <div className="relative aspect-[16/10] w-full">
                  <ProductImage
                    src={imageSrc}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow-sm">
                    {categoryLabel} division
                  </p>
                </div>
              </div>

              {product.hsCode && (
                <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-wider text-muted">HS Code</p>
                  <p className="mt-1 font-mono text-lg font-medium text-foreground">{product.hsCode}</p>
                </div>
              )}

              {product.specifications.length > 0 && (
                <div className="animate-fade-up [animation-delay:0.1s]">
                  <DetailList title="Specifications & quality" items={product.specifications} />
                </div>
              )}

              {product.packaging.length > 0 && (
                <div className="animate-fade-up [animation-delay:0.2s]">
                  <DetailList title="Packaging options" items={product.packaging} />
                </div>
              )}

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
            </div>
          </DetailLayout>
        </Container>
      </PageSection>
    </>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailData slug={slug} />
    </Suspense>
  );
}
