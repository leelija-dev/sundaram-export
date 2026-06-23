import type { Metadata } from "next";
import { QuotePageContent } from "@/components/quote-page-content";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Request a Quote",
  description: `Request a tailored export quote from ${site.name}. Share your product, volume, Incoterms, and destination — our trade desk responds within 24 hours with pricing and logistics options.`,
  path: "/quote",
  keywords: [
    "export quote India",
    "international shipping quote",
    "Incoterms export pricing",
    "B2B export inquiry",
    "freight quote India",
  ],
});

export default function QuotePage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Request a Quote", path: "/quote" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <QuotePageContent />
    </>
  );
}
