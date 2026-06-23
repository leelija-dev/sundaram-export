import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPageContent } from "@/components/contact-page-content";
import { ContactPageSkeleton } from "@/components/page-skeletons";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/data/site";
import { fetchOffices } from "@/lib/api";
import { getSiteConfig } from "@/lib/site-env";
import { buildBreadcrumbSchema, buildContactPageSchema, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description: `Contact ${site.name} export desks in India and the USA. Reach our trade team for product inquiries, shipment coordination, compliance support, and partnership opportunities.`,
  path: "/contact",
  keywords: [
    "contact export company India",
    "Sundaram Export phone email",
    "export trade desk Mumbai",
    "international shipping inquiry",
  ],
});

export const revalidate = 60;

async function ContactPageData() {
  const offices = await fetchOffices();
  return <ContactPageContent offices={offices} />;
}

export default function ContactPage() {
  const siteConfig = getSiteConfig();
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
    buildContactPageSchema(siteConfig),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Suspense fallback={<ContactPageSkeleton />}>
        <ContactPageData />
      </Suspense>
    </>
  );
}
