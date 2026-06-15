import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Container,
  DetailLayout,
  DetailList,
  PageHero,
  QuoteSidebar,
  PageSection,
  TrustBadge,
} from "@/components/site-ui";
import { CategoryIcon } from "@/lib/business-icons";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { getProductImage } from "@/lib/product-images";
import { formatCategoryLabel } from "@/lib/types/catalog";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

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

  const imageSrc = getProductImage(product.slug, product.category);
  const categoryLabel = formatCategoryLabel(product.category);

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <CategoryIcon category={product.category} className="h-6 w-6 text-accent" />
            <span>{categoryLabel}</span>
          </span>
        }
        title={product.title}
        description={product.description}
      >
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
          <TrustBadge className="rounded-full bg-white/10 px-3 py-1 text-white/90">
            Verified Export Quality
          </TrustBadge>
          <TrustBadge className="rounded-full bg-white/10 px-3 py-1 text-white/90">
            Global Shipment Ready
          </TrustBadge>
        </div>
      </PageHero>

      <PageSection className="animate-fade-up">
        <Container>
          <Link
            href="/products"
            className="group mb-6 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all hover:gap-2 hover:text-primary sm:mb-8"
          >
            ← <span>Back to all products</span>
          </Link>

          <DetailLayout sidebar={<QuoteSidebar subject={product.title} />}>
            <div className="space-y-8">
              <div className="relative overflow-hidden rounded-2xl bg-surface shadow-inner">
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={imageSrc}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-primary shadow-sm">
                    {categoryLabel} division
                  </p>
                </div>
              </div>

              {product.hsCode && (
                <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">HS Code</p>
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

              <div className="mt-8 flex items-start justify-center gap-2 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center text-sm text-muted">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <p>
                  <span className="font-semibold text-accent">Export‑ready documentation</span>
                  {" — "}Including COO, phytosanitary, test reports, and BL coordination.
                </p>
              </div>
            </div>
          </DetailLayout>
        </Container>
      </PageSection>
    </>
  );
}
