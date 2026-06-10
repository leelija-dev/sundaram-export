import { ContactForm } from "@/components/contact-form";
import { Container, PageHero, PageSection } from "@/components/site-ui";

export const metadata = {
  title: "Request a Quote",
  description: "Request a tailored export quote for products and international shipments.",
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Quote"
        title="Request a tailored export quote"
        description="Share product needs, origin, destination, and Incoterms. Our trade desk prepares options within one business day."
      />
      <PageSection>
        <Container narrow>
          <div className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6 md:p-8">
            <ContactForm variant="quote" />
          </div>
        </Container>
      </PageSection>
    </>
  );
}
