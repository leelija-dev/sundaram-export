import Link from "next/link";
import { Container, PageSection } from "@/components/site-ui";
import { site } from "@/data/site";
import {
  BuildingOffice2Icon,
  ClockIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type NetworkOffice = {
  id: string;
  city: string;
  country: string;
  code: string;
  role: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  badges: string[];
  headquarters?: boolean;
};

const NETWORK_OFFICES: NetworkOffice[] = [
  {
    id: "mumbai",
    city: "Mumbai",
    country: "India",
    code: "IN",
    role: "Global Headquarters",
    headquarters: true,
    description:
      "Sourcing, export licensing, phytosanitary coordination, and supply-chain management for India and South Asia.",
    address: site.address,
    phone: site.phone,
    email: site.email,
    badges: ["IST timezone", "24/7 trade desk", "DGFT licensed"],
  },
  {
    id: "houston",
    city: "Houston",
    country: "USA",
    code: "US",
    role: "Americas Desk",
    description:
      "Buyer relationships, customs filing, and port-to-door distribution across the USA, Canada, and Latin America.",
    address: site.addressUS,
    phone: site.phoneAlt,
    email: "americas@sundaramexport.com",
    badges: ["CST timezone", "Gulf port access"],
  },
  {
    id: "frankfurt",
    city: "Frankfurt",
    country: "Germany",
    code: "DE",
    role: "Europe & MENA Desk",
    description:
      "EU, UK, and MENA coordination — customs clearance, REACH documentation, and consolidated LCL programs.",
    address: "Frankfurt Trade Hub, Mainzer Landstraße 250, 60326 Frankfurt, Germany",
    phone: "+49 69 8000 4500",
    email: "eu@sundaramexport.com",
    badges: ["CET timezone", "EU compliant"],
  },
];

function OfficeRow({ office }: { office: NetworkOffice }) {
  const isHq = office.headquarters;

  return (
    <article
      className={cn(
        "rounded-2xl border p-5 sm:p-6",
        isHq
          ? "border-accent/25 bg-primary text-white shadow-lg shadow-primary/10"
          : "border-border/60 bg-white shadow-sm"
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-wide",
            isHq ? "bg-white/10 text-white ring-1 ring-white/15" : "bg-primary text-white"
          )}
        >
          {office.code}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className={cn("text-lg font-bold sm:text-xl", isHq ? "text-white" : "text-primary")}>
              {office.city}, {office.country}
            </h3>
            {isHq && (
              <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                Headquarters
              </span>
            )}
          </div>
          <p className={cn("mt-0.5 text-sm font-medium", isHq ? "text-white/70" : "text-secondary")}>
            {office.role}
          </p>
          <p className={cn("mt-3 text-sm leading-relaxed", isHq ? "text-white/75" : "text-muted")}>
            {office.description}
          </p>
        </div>
      </div>

      <ul
        className={cn(
          "mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3",
          isHq ? "text-white/80" : "text-foreground/90"
        )}
      >
        <li className="flex items-start gap-2.5 sm:col-span-2 lg:col-span-1">
          <MapPinIcon className={cn("mt-0.5 h-4 w-4 shrink-0", isHq ? "text-accent" : "text-secondary")} aria-hidden />
          <span className="leading-relaxed">{office.address}</span>
        </li>
        <li>
          <a
            href={`tel:${office.phone.replace(/\s/g, "")}`}
            className={cn(
              "inline-flex items-center gap-2.5 transition-colors",
              isHq ? "hover:text-accent" : "text-primary hover:text-secondary"
            )}
          >
            <PhoneIcon className={cn("h-4 w-4 shrink-0", isHq ? "text-accent" : "text-secondary")} aria-hidden />
            {office.phone}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${office.email}`}
            className={cn(
              "inline-flex items-start gap-2.5 break-all transition-colors",
              isHq ? "hover:text-accent" : "text-primary hover:text-secondary"
            )}
          >
            <EnvelopeIcon className={cn("mt-0.5 h-4 w-4 shrink-0", isHq ? "text-accent" : "text-secondary")} aria-hidden />
            {office.email}
          </a>
        </li>
      </ul>

      <div
        className={cn(
          "mt-4 flex flex-wrap gap-2 border-t pt-4",
          isHq ? "border-white/10" : "border-border/60"
        )}
      >
        {office.badges.map((badge) => (
          <span
            key={badge}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
              isHq ? "bg-white/10 text-white/90" : "bg-primary/5 text-primary"
            )}
          >
            <ClockIcon className={cn("h-3 w-3", isHq ? "text-accent" : "text-accent")} aria-hidden />
            {badge}
          </span>
        ))}
      </div>
    </article>
  );
}

export function AboutGlobalNetwork() {
  const hq = NETWORK_OFFICES.find((o) => o.headquarters)!;
  const regionalDesks = NETWORK_OFFICES.filter((o) => !o.headquarters);

  return (
    <PageSection className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Global Presence</p>
          <h2 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">Our Global Network</h2>
          <p className="mt-3 text-base text-muted sm:text-lg">
            Headquarters in India with regional export desks — one accountable team from inquiry through
            delivery.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <OfficeRow office={hq} />

          <div className="grid gap-4 md:grid-cols-2">
            {regionalDesks.map((office) => (
              <OfficeRow key={office.id} office={office} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-white px-5 py-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-sm text-primary">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
              <GlobeAltIcon className="h-5 w-5 text-secondary" aria-hidden />
            </span>
            <span>90+ export corridors coordinated from our trade desks</span>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
          >
            <BuildingOffice2Icon className="h-4 w-4" aria-hidden />
            Contact a desk →
          </Link>
        </div>
      </Container>
    </PageSection>
  );
}
