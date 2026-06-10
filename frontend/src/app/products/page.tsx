import {
  CardGrid,
  Container,
  FilterChips,
  PageHero,
  PageSection,
  ProductCard,
  SectionHeading,
} from "@/components/site-ui";
import { site } from "@/data/site";
import { fetchProducts } from "@/lib/api";
import { categoryLabelsFromProducts } from "@/lib/types/catalog";

export const metadata = {
  title: "Export Products",
  description: `Product divisions exported by ${site.name} — agriculture, textiles, engineering, chemicals, and more.`,
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await fetchProducts();
  const categoryLabels = categoryLabelsFromProducts(products);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Export-ready product divisions"
        description="Each line includes sourcing, quality documentation, packaging options, and coordinated logistics to your destination market."
      />
      <PageSection>
        <Container>
          {categoryLabels.length > 0 && <FilterChips labels={categoryLabels} />}
          <div className="mt-8 sm:mt-12">
            <SectionHeading
              align="left"
              title="Our export catalog"
              description="Select a product line for specifications, HS references, packaging, and target markets."
            />
          </div>
          {products.length > 0 ? (
            <CardGrid variant="cards" className="mt-8 sm:mt-12 lg:mt-14">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </CardGrid>
          ) : (
            <p className="mt-8 text-center text-sm text-muted">
              No products published yet. Check back soon or{" "}
              <a href="/contact" className="font-semibold text-secondary hover:text-primary">
                contact our desk
              </a>
              .
            </p>
          )}
        </Container>
      </PageSection>
    </>
  );
}
