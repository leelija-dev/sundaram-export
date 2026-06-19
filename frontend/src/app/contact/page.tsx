import { Suspense } from "react";
import { ContactPageContent } from "@/components/contact-page-content";
import { ContactPageSkeleton } from "@/components/page-skeletons";
import { site } from "@/data/site";
import { fetchOffices } from "@/lib/api";

export const metadata = {
  title: "Contact Us | Sundaram Export",
  description: `Contact ${site.name} export desks worldwide. Reach us for product inquiries, shipments, compliance, or partnerships.`,
};

export const revalidate = 60;

async function ContactPageData() {
  const offices = await fetchOffices();
  return <ContactPageContent offices={offices} />;
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPageData />
    </Suspense>
  );
}
