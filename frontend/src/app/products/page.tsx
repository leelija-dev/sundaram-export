import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPageContent } from "@/components/products-page-content";
import { ProductsPageSkeleton } from "@/components/page-skeletons";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { fetchExportCountries, fetchProducts } from "@/lib/api";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "Export Products",
  description: `Browse ${site.name} export catalog — agricultural commodities, spices, textiles, engineering goods, and chemicals with HS codes, specifications, packaging options, and active global markets.`,
  path: "/products",
  keywords: [
    "export products India",
    "agro commodities catalog",
    "spices export list",
    "HS code export products",
    "B2B export catalog",
  ],
});

async function ProductsPageData() {
  const [products, countries] = await Promise.all([fetchProducts(), fetchExportCountries()]);

  const uniqueMarkets = new Set(products.flatMap((product) => product.markets));
  const marketCount = countries.length > 0 ? countries.length : uniqueMarkets.size;

  return <ProductsPageContent products={products} marketCount={marketCount} />;
}

export default function ProductsPage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <Suspense fallback={<ProductsPageSkeleton />}>
        <ProductsPageData />
      </Suspense>
    </>
  );
}
