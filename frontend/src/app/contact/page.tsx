import { ContactForm } from "@/components/contact-form";
import { CardGrid, Container, OfficeCard, PageHero, PageSection } from "@/components/site-ui";
import { site } from "@/data/site";
import { fetchOffices } from "@/lib/api";

export const metadata = {
  title: "Contact",
  description: `Contact ${site.name} export desks worldwide.`,
};

export const revalidate = 60;

export default async function ContactPage() {
  const offices = await fetchOffices();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Global export desks"
        description="Reach the team for product inquiries, active shipments, compliance questions, or partnership discussions."
      />
      <PageSection>
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16 2xl:gap-20">
            {offices.length > 0 ? (
              <CardGrid variant="cardsTwo" className="!grid-cols-1 lg:gap-5">
                {offices.map((office) => (
                  <OfficeCard
                    key={office.region}
                    region={office.region}
                    address={office.address}
                    phone={office.phone}
                    email={office.email}
                  />
                ))}
              </CardGrid>
            ) : (
              <p className="text-sm text-muted">
                Office locations are being updated. Email{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-secondary">
                  {site.email}
                </a>{" "}
                in the meantime.
              </p>
            )}
            <div className="card-static h-fit lg:sticky lg:top-[5.5rem] lg:self-start">
              <div className="card-body lg:p-8">
                <h2 className="text-lg font-semibold text-foreground">Send a message</h2>
                <p className="mt-1 text-sm text-muted">We respond within one business day.</p>
                <div className="mt-5 sm:mt-6">
                  <ContactForm variant="contact" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
