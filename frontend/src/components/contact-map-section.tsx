"use client";

import { Container, PageSection, SectionHeading } from "@/components/site-ui";
import { useSiteConfig } from "@/components/site-config-provider";
import { site } from "@/data/site";
import { buildMapDirectionsUrl, buildMapEmbedUrl } from "@/lib/map-urls";
import { cn } from "@/lib/utils";
import { ArrowTopRightOnSquareIcon, MapPinIcon } from "@heroicons/react/24/outline";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const linkButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors sm:min-h-0 sm:w-auto";

export function ContactMapSection() {
  const { address, addressShort, phone, mapEmbedUrl } = useSiteConfig();
  const embedSrc = buildMapEmbedUrl(address, mapEmbedUrl);
  const directionsUrl = buildMapDirectionsUrl(address);

  return (
    <PageSection className="bg-surface/40">
      <Container>
        <SectionHeading
          eyebrow="Location"
          title="Find our export desk"
          description={`Visit or route to our headquarters in ${addressShort}.`}
        />

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-5 lg:items-stretch lg:gap-8">
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-background p-5 shadow-sm sm:p-6 lg:col-span-2">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                  <MapPinIcon className="h-5 w-5 text-accent" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                    Headquarters
                  </p>
                  <p className="font-semibold text-primary">{site.name}</p>
                </div>
              </div>
              <p className="mt-5 text-base leading-relaxed text-muted">{address}</p>
              <a
                href={phoneHref(phone)}
                className="mt-4 inline-flex text-sm font-medium text-primary transition-colors hover:text-secondary sm:text-base"
              >
                {phone}
              </a>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  linkButtonClass,
                  "bg-accent text-white shadow-lg shadow-accent/25 hover:bg-accent/90",
                )}
              >
                Get directions
                <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" aria-hidden />
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  linkButtonClass,
                  "border border-border bg-background text-foreground hover:border-secondary hover:text-secondary",
                )}
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border/70 bg-muted/20 shadow-sm lg:col-span-3 lg:min-h-[360px]">
            <iframe
              title={`Map showing ${site.name} at ${addressShort}`}
              src={embedSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </Container>
    </PageSection>
  );
}
