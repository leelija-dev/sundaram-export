import { ProductsPageContent } from "@/components/products-page-content";
import { fetchExportCountries, fetchProducts } from "@/lib/api";

export const revalidate = 60;

export default async function ProductsPage() {
  const [products, countries] = await Promise.all([fetchProducts(), fetchExportCountries()]);

  const uniqueMarkets = new Set(products.flatMap((product) => product.markets));
  const marketCount = countries.length > 0 ? countries.length : uniqueMarkets.size;

  return <ProductsPageContent products={products} marketCount={marketCount} />;
}
