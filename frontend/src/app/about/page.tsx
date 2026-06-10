import {
  Button,
  CardGrid,
  Container,
  InfoCard,
  PageHero,
  PageSection,
  SectionHeading,
} from "@/components/site-ui";
import { site, values } from "@/data/site";

export const metadata = {
  title: "About Us",
  description: `Learn about ${site.name} — multinational export products since ${site.founded}.`,
};

const milestones = [
  { year: "1998", event: "Founded in Mumbai as a spice export trading house." },
  { year: "2006", event: "Expanded into textiles and engineering with ISO-certified partner mills." },
  { year: "2014", event: "Opened Houston operations desk for Americas distribution." },
  { year: "2020", event: "Strengthened export logistics and documentation under one brand." },
  { year: "2024", event: "90+ country network with dedicated chemicals and cold-chain divisions." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Export excellence built over decades"
        description={`Since ${site.founded}, ${site.name} has grown from a commodity trader into a multinational export partner — products, compliance, and shipment coordination under one accountable team.`}
      />
      <PageSection>
        <Container narrow>
          <div className="space-y-5 text-sm leading-relaxed text-muted sm:space-y-6 sm:text-base">
            <p>
              We serve manufacturers, brand owners, and trading companies who need more than commodity
              supply. Our product divisions source and certify goods and coordinate cross-border
              shipments without silos between supplier, document, and carrier.
            </p>
            <p>
              Headquarters in Mumbai anchor sourcing and export licensing. Regional desks in Houston
              and Frankfurt coordinate destination compliance, buyer relationships, and last-mile
              delivery for clients in the Americas, Europe, and MENA.
            </p>
          </div>

          <div className="mt-12 sm:mt-16">
            <SectionHeading align="left" eyebrow="Values" title="How we operate" />
            <CardGrid variant="cards" className="mt-6 sm:mt-8">
              {values.map((v) => (
                <InfoCard key={v.title} title={v.title} description={v.description} />
              ))}
            </CardGrid>
          </div>

          <div className="mt-12 sm:mt-16">
            <SectionHeading align="left" eyebrow="Timeline" title="Company milestones" />
            <ol className="mt-6 space-y-5 border-l-2 border-secondary/30 pl-5 sm:mt-8 sm:space-y-6 sm:pl-6">
              {milestones.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[1.35rem] top-1.5 flex h-2.5 w-2.5 rounded-full bg-secondary sm:-left-[1.6rem] sm:h-3 sm:w-3" />
                  <p className="text-sm font-bold text-primary">{m.year}</p>
                  <p className="mt-1 text-sm text-muted">{m.event}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 rounded-2xl bg-primary p-5 text-white sm:mt-16 sm:p-8">
            <h3 className="text-lg font-bold sm:text-xl">Partner with {site.name}</h3>
            <p className="mt-2 text-sm text-white/75">
              Whether you need a product supplier or a full export program — start with a conversation.
            </p>
            <Button href="/contact" variant="accent" fullWidthOnMobile className="mt-5 sm:mt-6">
              Contact our team
            </Button>
          </div>
        </Container>
      </PageSection>
    </>
  );
}
