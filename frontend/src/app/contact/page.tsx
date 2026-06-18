import { ContactPageContent } from "@/components/contact-page-content";
import { site } from "@/data/site";
import { fetchOffices } from "@/lib/api";

export const metadata = {
  title: "Contact Us | Sundaram Export",
  description: `Contact ${site.name} export desks worldwide. Reach us for product inquiries, shipments, compliance, or partnerships.`,
};

export const revalidate = 60;

export default async function ContactPage() {
  const offices = await fetchOffices();

  return <ContactPageContent offices={offices} />;
}
