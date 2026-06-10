"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/data/site";
import type { ExportProduct, MarketRegionCard } from "@/lib/types/catalog";

export function Container({
  children,
  className,
  narrow,
}: {
  children: React.ReactNode;
  className?: string;
  /** Prose / form pages — slightly narrower on very large screens */
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        narrow
          ? "mx-auto w-full min-w-0 max-w-3xl px-4 sm:px-6 lg:px-8 2xl:max-w-4xl"
          : "site-container",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Standard vertical padding for content sections */
export function PageSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("section-py", className)}>{children}</section>;
}

export function Button({
  href,
  children,
  variant = "primary",
  className,
  fullWidthOnMobile,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "light" | "accent";
  className?: string;
  fullWidthOnMobile?: boolean;
}) {
  const styles = {
    primary: "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/25",
    secondary: "bg-primary text-white hover:bg-primary/90",
    accent: "bg-accent text-primary hover:bg-accent/90 shadow-lg shadow-accent/25",
    outline:
      "border border-border text-foreground hover:border-secondary hover:text-secondary bg-background",
    light: "bg-background text-primary hover:bg-surface shadow-sm border border-border",
  };
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors sm:min-h-0",
        fullWidthOnMobile && "w-full sm:w-auto",
        styles[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}

function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5 group">
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-primary text-xs font-bold text-white shadow-sm lg:h-9 lg:w-9 lg:text-sm">
        SE
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white" aria-hidden />
      </span>
      <div className="min-w-0 max-w-[9rem] leading-tight sm:max-w-[11rem] lg:max-w-none">
        <span
          className={cn(
            "block truncate font-bold tracking-tight transition-colors text-base lg:overflow-visible lg:whitespace-normal lg:text-lg",
            light ? "text-white group-hover:text-accent" : "text-foreground group-hover:text-secondary"
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            "hidden text-[10px] font-medium uppercase tracking-widest lg:block",
            light ? "text-accent/80" : "text-muted"
          )}
        >
          Est. {site.founded}
        </span>
      </div>
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <Container className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-16 lg:h-[4.25rem] lg:gap-6">
        <div className="shrink-0 justify-self-start">
          <Logo />
        </div>

        {/* Laptop, desktop, large screens — centered nav */}
        <nav
          className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Main"
        >
          {navLinks.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-3 xl:text-sm",
                  active ? "bg-secondary/10 text-primary" : "text-muted hover:bg-surface hover:text-secondary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-3">
          <Button href="/quote" variant="primary" className="hidden lg:inline-flex">
            Request quote
          </Button>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-lg border border-border text-foreground/90 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </Container>

      {/* Mobile + small tablet menu overlay */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col bg-background transition-opacity duration-200 lg:hidden sm:top-16",
          open ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]" aria-label="Mobile">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-12 items-center rounded-xl px-4 text-base font-medium transition-colors",
                      active
                        ? "bg-secondary/10 text-primary"
                        : "text-foreground/90 hover:bg-surface hover:text-secondary"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            <Link
              href="/quote"
              className="flex min-h-12 items-center justify-center rounded-xl bg-secondary text-base font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Request a quote
            </Link>
          </div>
        </nav>
      </div>
      {open && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-30 bg-primary/20 lg:hidden sm:top-16"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-primary text-white/80 supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]">
      <Container className="grid gap-10 py-10 sm:grid-cols-2 sm:gap-8 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:py-16 xl:gap-12">
        <div className="sm:col-span-2 lg:col-span-5 xl:col-span-6">
          <Logo light />
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65 lg:text-[15px]">
            {site.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 lg:mt-6">
            {site.certifications.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/15 bg-primary px-2.5 py-1 text-[11px] text-white/65 sm:px-3 sm:text-xs"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 xl:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-1 lg:gap-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center transition-colors hover:text-accent sm:min-h-0">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="inline-flex min-h-10 items-center transition-colors hover:text-accent sm:min-h-0">
                Request quote
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-4 xl:col-span-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65 lg:max-w-sm">
            <li>
              <a href={`mailto:${site.email}`} className="break-all hover:text-accent">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                {site.phone}
              </a>
            </li>
            <li className="leading-relaxed">{site.address}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/15 px-4 py-5 text-center text-xs text-white/50 sm:py-6">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-border bg-gradient-to-br from-primary via-primary to-primary text-white">
      <Container className="py-10 sm:py-14 md:py-16 lg:py-20 xl:py-24">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-accent sm:text-sm">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-4xl text-pretty text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl xl:max-w-5xl 2xl:text-[3.25rem] 2xl:leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75 sm:mt-4 sm:text-lg lg:max-w-3xl xl:text-xl xl:leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-6 sm:mt-8">{children}</div>}
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl px-1 text-center sm:px-0 lg:max-w-3xl",
        align === "left" && "max-w-3xl text-left xl:max-w-4xl"
      )}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-pretty text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-3 sm:text-base lg:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export type CardGridVariant = "cards" | "cardsTwo" | "cardsThree" | "stats";

/** Equal-height card grid — wraps each child in a stretch cell */
export function CardGrid({
  variant,
  className,
  children,
}: {
  variant: CardGridVariant;
  className?: string;
  children: ReactNode;
}) {
  if (variant === "stats") {
    return <div className={cn(grids.stats, className)}>{children}</div>;
  }

  return (
    <ul className={cn(grids[variant], "m-0 list-none p-0", className)}>
      {Children.map(children, (child) => (
        <li className="flex min-h-0 min-w-0">{child}</li>
      ))}
    </ul>
  );
}

function CardCta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors group-hover:text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}

function CardBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "secondary";
}) {
  const tones = {
    neutral: "text-muted",
    accent: "text-accent",
    secondary: "text-secondary",
  };
  return (
    <p className={cn("text-[11px] font-semibold uppercase tracking-wider sm:text-xs", tones[tone])}>
      {children}
    </p>
  );
}

/** Category / filter chips — scroll horizontally on small screens */
export function FilterChips({ labels }: { labels: string[] }) {
  return (
    <div className="scroll-chips -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:justify-center lg:gap-3 lg:overflow-visible lg:px-0">
      {labels.map((label) => (
        <span
          key={label}
          className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/90 sm:text-sm lg:px-4"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/** Two-column detail layout: content first on mobile, sidebar below */
export function DetailLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12 2xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 space-y-8 sm:space-y-10">{children}</div>
      <div className="min-w-0">{sidebar}</div>
    </div>
  );
}

const productEmoji: Record<string, string> = {
  agriculture: "🌾",
  textiles: "🧵",
  engineering: "⚙️",
  chemicals: "🧪",
  "food-beverage": "🍽️",
  handicrafts: "🏺",
};

export function ProductCard({ product }: { product: ExportProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="card-interactive card-product group">
      <div className="card-media" aria-hidden>
        {productEmoji[product.category] ?? "📦"}
      </div>
      <div className="card-body card-body--compact">
        <CardBadge tone="accent">{product.category.replace("-", " ")}</CardBadge>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary sm:mt-1.5 sm:text-lg">
          {product.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted sm:mt-2 sm:line-clamp-none">
          {product.shortDescription}
        </p>
        <div className="card-footer max-sm:pt-3 sm:border-t sm:border-border sm:pt-4">
          <CardCta>View specifications →</CardCta>
        </div>
      </div>
    </Link>
  );
}

export type ExportCountryCardData = {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  key_ports?: string[];
  specialties?: string[];
  region_name?: string;
};

export function ExportCountryCard({ country }: { country: ExportCountryCardData }) {
  const ports = country.key_ports ?? [];
  const specialties = country.specialties ?? [];
  const title = country.subtitle ? `${country.name} — ${country.subtitle}` : country.name;

  return (
    <article className="card-static">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-lg sm:h-11 sm:w-11">
            🌍
          </span>
          <div className="min-w-0 flex-1">
            {country.region_name && (
              <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary sm:text-xs">
                {country.region_name}
              </p>
            )}
            <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {country.description || `Export desk for ${country.name}.`}
            </p>
          </div>
        </div>
        {ports.length > 0 && (
          <div className="mt-4 rounded-lg bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">
              Key ports
            </p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/90">
              {ports.slice(0, 4).join(" · ")}
            </p>
          </div>
        )}
        {specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {specialties.map((s) => (
              <span
                key={s}
                className="rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-medium text-primary sm:text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <div className="card-footer--bordered">
          <Link
            href="/quote"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-secondary hover:text-primary"
          >
            Export to {country.name} →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function MarketCard({ market }: { market: MarketRegionCard }) {
  return (
    <article className="card-static">
      <div className="card-body">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-lg sm:h-11 sm:w-11">
            🌍
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">{market.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{market.description}</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted sm:text-xs">
            Key countries
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">
            {market.countries.slice(0, 5).join(" · ")}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {market.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-medium text-primary sm:text-xs"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="card-footer--bordered">
          <Link
            href="/quote"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-secondary hover:text-primary"
          >
            Ship to this region →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function IndustryCard({ name, description }: { name: string; description: string }) {
  return (
    <article className="card-static">
      <div className="card-body">
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent text-base sm:h-10 sm:w-10">
          ◆
        </span>
        <h3 className="text-base font-semibold leading-snug text-foreground lg:text-lg">{name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted lg:text-[15px]">{description}</p>
      </div>
    </article>
  );
}

export function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="card-static">
      <div className="card-body">
        <h3 className="font-semibold text-foreground sm:text-lg">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </article>
  );
}

export function OfficeCard({
  region,
  address,
  phone,
  email,
}: {
  region: string;
  address: string;
  phone: string;
  email: string;
}) {
  return (
    <article className="card-static">
      <div className="card-body">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">{region}</h3>
        <dl className="mt-3 flex flex-1 flex-col gap-3 text-sm text-muted sm:mt-4 sm:gap-4">
          <div>
            <dt className="sr-only">Address</dt>
            <dd className="leading-relaxed">{address}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Phone</dt>
            <dd className="mt-0.5">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-secondary">
                {phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Email</dt>
            <dd className="mt-0.5">
              <a href={`mailto:${email}`} className="break-all text-secondary hover:text-primary">
                {email}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export function ProcessSteps({
  steps,
}: {
  steps: { step: string; title: string; description: string }[];
}) {
  return (
    <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:gap-8">
      {steps.map((item, index) => (
        <li key={item.step} className="flex min-h-0">
          <article
            className={cn(
              "card-static w-full",
              "lg:relative lg:after:absolute lg:after:top-10 lg:after:left-[calc(100%+0.75rem)] lg:after:h-px lg:after:w-6 lg:after:bg-secondary/30 xl:after:w-8",
              index === steps.length - 1 && "lg:after:hidden"
            )}
          >
            <div className="card-body">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                {item.step.replace(/^0/, "")}
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground sm:text-base">{item.title}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted sm:text-sm">
                {item.description}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

export function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground sm:text-lg">{title}</h2>
      <ul className="mt-3 grid auto-rows-fr grid-cols-1 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3 lg:gap-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex h-full items-start gap-2.5 rounded-xl border border-border bg-background px-3 py-3 text-sm text-foreground/90 shadow-sm sm:px-4 sm:py-3.5"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-bold text-secondary">
              ✓
            </span>
            <span className="min-w-0 flex-1 break-words leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function QuoteSidebar({ subject }: { subject: string }) {
  return (
    <aside className="card-static h-fit !bg-surface lg:sticky lg:top-[5.5rem] lg:self-start">
      <div className="card-body xl:p-7">
      <h3 className="text-base font-semibold text-foreground sm:text-lg">Interested in {subject}?</h3>
      <p className="mt-2 text-sm text-muted">
        Share quantity, destination, and Incoterms. Our trade desk responds within one business day.
      </p>
      <Button href="/quote" variant="primary" fullWidthOnMobile className="mt-5 sm:mt-6">
        Request a quote
      </Button>
      <Button href="/contact" variant="outline" fullWidthOnMobile className="mt-3">
        Talk to sales
      </Button>
      </div>
    </aside>
  );
}

/** Responsive card grid presets — use with CardGrid for equal row heights */
export const grids = {
  cards:
    "grid w-full auto-rows-fr grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8",
  cardsTwo:
    "grid w-full auto-rows-fr grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8 2xl:grid-cols-3",
  cardsThree:
    "grid w-full auto-rows-fr grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8",
  stats:
    "grid grid-cols-2 items-center gap-4 sm:gap-6 md:grid-cols-4 md:gap-8 lg:gap-10 xl:gap-12",
};
