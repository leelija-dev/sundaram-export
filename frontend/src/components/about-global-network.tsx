import Link from "next/link";
import { Container, PageSection } from "@/components/site-ui";
import { useSiteConfig } from "@/components/site-config-provider";
import type { Office } from "@/lib/api";
import { formatStatCount } from "@/lib/format-stat";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

function OfficeRow({ office, headquarters }: { office: Office; headquarters?: boolean }) {
  return (
    <article
      className={cn(
        "rounded-2xl border p-5 sm:p-6",
        headquarters
          ? "border-accent/25 bg-primary text-white shadow-lg shadow-primary/10"
          : "border-border/60 bg-white shadow-sm",
      )}
    >
      <div className="flex flex-wrap items-start gap-4">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            headquarters ? "bg-white/10 ring-1 ring-white/15" : "bg-primary/10",
          )}
        >
          <BuildingOffice2Icon
            className={cn("h-5 w-5", headquarters ? "text-accent" : "text-primary")}
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className={cn("text-lg font-bold sm:text-xl", headquarters ? "text-white" : "text-primary")}>
              {office.region}
            </h3>
            {headquarters && (
              <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                Primary desk
              </span>
            )}
          </div>
        </div>
      </div>

      <ul
        className={cn(
          "mt-5 grid gap-3 text-sm sm:grid-cols-2",
          headquarters ? "text-white/80" : "text-foreground/90",
        )}
      >
        <li className="flex items-start gap-2.5 sm:col-span-2">
          <MapPinIcon
            className={cn("mt-0.5 h-4 w-4 shrink-0", headquarters ? "text-accent" : "text-secondary")}
            aria-hidden
          />
          <span className="leading-relaxed">{office.address}</span>
        </li>
        <li>
          <a
            href={`tel:${office.phone.replace(/\s/g, "")}`}
            className={cn(
              "inline-flex items-center gap-2.5 transition-colors",
              headquarters ? "hover:text-accent" : "text-primary hover:text-secondary",
            )}
          >
            <PhoneIcon
              className={cn("h-4 w-4 shrink-0", headquarters ? "text-accent" : "text-secondary")}
              aria-hidden
            />
            {office.phone}
          </a>
        </li>
        <li>
          <a
            href={`mailto:${office.email}`}
            className={cn(
              "inline-flex items-start gap-2.5 break-all transition-colors",
              headquarters ? "hover:text-accent" : "text-primary hover:text-secondary",
            )}
          >
            <EnvelopeIcon
              className={cn("mt-0.5 h-4 w-4 shrink-0", headquarters ? "text-accent" : "text-secondary")}
              aria-hidden
            />
            {office.email}
          </a>
        </li>
      </ul>
    </article>
  );
}

type AboutGlobalNetworkProps = {
  offices: Office[];
  exportCorridorCount: number;
};

export function AboutGlobalNetwork({ offices, exportCorridorCount }: AboutGlobalNetworkProps) {
  const { email, phone, addressShort } = useSiteConfig();
  const hasOffices = offices.length > 0;
  const hq = hasOffices ? offices[0] : null;
  const regionalDesks = hasOffices ? offices.slice(1) : [];

  return (
    <PageSection className="bg-surface/40">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent sm:text-sm">
            Global presence
          </p>
          <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            Our export desks
          </h2>
          <p className="mt-3 text-base text-muted sm:text-lg">
            Regional teams coordinated from {addressShort} — one accountable chain from inquiry to
            delivery.
          </p>
        </div>

        {hasOffices ? (
          <div className="mt-10 space-y-4">
            {hq && <OfficeRow office={hq} headquarters />}
            {regionalDesks.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {regionalDesks.map((office) => (
                  <OfficeRow key={`${office.region}-${office.email}`} office={office} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-background/60 py-12 text-center">
            <BuildingOffice2Icon className="mx-auto mb-3 h-10 w-10 text-muted" aria-hidden />
            <p className="text-base text-muted">
              Office locations will appear here once published in the export desk.
            </p>
            <p className="mt-4 text-sm text-muted">
              Reach us at{" "}
              <a href={`mailto:${email}`} className="font-medium text-secondary hover:text-accent">
                {email}
              </a>{" "}
              or{" "}
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-medium text-secondary hover:text-accent">
                {phone}
              </a>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-white px-5 py-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-sm text-primary">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
              <GlobeAltIcon className="h-5 w-5 text-secondary" aria-hidden />
            </span>
            <span>
              {exportCorridorCount > 0
                ? `${formatStatCount(exportCorridorCount)} export corridors coordinated from our trade desks`
                : "Global trade coordination from a single accountable desk"}
            </span>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
          >
            <BuildingOffice2Icon className="h-4 w-4" aria-hidden />
            Contact a desk
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Container>
    </PageSection>
  );
}
