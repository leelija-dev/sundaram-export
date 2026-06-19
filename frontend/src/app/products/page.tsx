import { Suspense } from "react";
import { ProductsPageContent } from "@/components/products-page-content";
import { ProductsPageSkeleton } from "@/components/page-skeletons";
import { fetchExportCountries, fetchProducts } from "@/lib/api";

export const revalidate = 60;

async function ProductsPageData() {
  const [products, countries] = await Promise.all([fetchProducts(), fetchExportCountries()]);

  const uniqueMarkets = new Set(products.flatMap((product) => product.markets));
  const marketCount = countries.length > 0 ? countries.length : uniqueMarkets.size;

  return <ProductsPageContent products={products} marketCount={marketCount} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageData />
    </Suspense>
  );
}
