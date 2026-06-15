import { HomePageContent } from "@/components/home-page-content";
import { fetchProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await fetchProducts();

  return <HomePageContent products={products} />;
}
