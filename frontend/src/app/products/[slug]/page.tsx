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
    title: product.title,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <PageHero
        eyebrow={product.category.replace("-", " ")}
        title={product.title}
        description={product.description}
      />
      <PageSection>
        <Container>
          <Link
            href="/products"
            className="inline-flex min-h-10 items-center text-sm font-medium text-secondary hover:text-primary"
          >
            ← All products
          </Link>
          <DetailLayout sidebar={<QuoteSidebar subject={product.title} />}>
            {product.hsCode && (
              <p className="text-sm text-muted">
                <span className="font-semibold text-foreground">HS reference:</span> {product.hsCode}
              </p>
            )}
            {product.specifications.length > 0 && (
              <DetailList title="Specifications & quality" items={product.specifications} />
            )}
            {product.packaging.length > 0 && (
              <DetailList title="Packaging options" items={product.packaging} />
            )}
            {product.origins.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-foreground sm:text-lg">Origins</h2>
                <ul className="mt-3 space-y-2">
                  {product.origins.map((o) => (
                    <li key={o} className="text-sm text-muted">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.markets.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-foreground sm:text-lg">Active export markets</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.markets.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-primary sm:px-3 sm:text-sm"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </DetailLayout>
        </Container>
      </PageSection>
    </>
  );
}
