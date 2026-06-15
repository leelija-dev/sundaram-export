// src/components/site-ui.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/data/site";
import {
  Bars3Icon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  CubeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getProductImage } from "@/lib/product-images";
import type { ExportProduct, MarketRegionCard } from "@/lib/types/catalog";
import { formatCategoryLabel } from "@/lib/types/catalog";
import type { BusinessIcon } from "@/lib/business-icons";

const NAV_ICONS: Record<string, BusinessIcon> = {
  "/": HomeIcon,
  "/products": CubeIcon,
  "/markets": GlobeAltIcon,
  "/about": BuildingOffice2Icon,
  "/contact": EnvelopeIcon,
};

export function TrustBadge({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:text-xs",
        className
      )}
      style={style}
    >
      <CheckCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </span>
  );
}

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

function Logo() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur-sm lg:h-10 lg:w-10 lg:text-sm">
        SE
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-primary"
          aria-hidden
        />
      </span>
      <div className="min-w-0 max-w-[9.5rem] leading-tight sm:max-w-[11rem] lg:max-w-none">
        <span className="block truncate text-base font-bold tracking-tight text-white transition-colors group-hover:text-accent lg:overflow-visible lg:whitespace-normal lg:text-lg">
          {site.name}
        </span>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-white/50 lg:block">
          Global export partner
        </span>
      </div>
    </Link>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
  mobile,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  mobile?: boolean;
}) {
  const Icon = NAV_ICONS[href] ?? BriefcaseIcon;

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex min-h-[3.25rem] items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-all",
          active
            ? "bg-primary/8 text-primary"
            : "text-foreground/85 hover:bg-slate-50 hover:text-primary"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            active ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
          )}
        >
          <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden />
        </span>
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 text-[13px] font-medium transition-all xl:text-sm",
        active
          ? "bg-white/12 text-white shadow-sm shadow-black/10"
          : "text-white/70 hover:bg-white/8 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/[0.08] bg-gradient-to-b from-[#0c2d4d] to-primary transition-shadow duration-300 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]",
        scrolled && "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.35)]"
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        aria-hidden
      />

      <Container className="relative grid h-[3.75rem] grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-16 lg:h-[4.25rem] lg:gap-8">
        <div className="shrink-0 justify-self-start">
          <Logo />
        </div>

        <nav
          className="hidden min-w-0 items-center justify-center gap-1 lg:flex"
          aria-label="Main"
        >
          {navLinks.map((link) => {
            const active =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <NavLink key={link.href} href={link.href} label={link.label} active={active} />
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 lg:gap-3">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white xl:inline-flex"
          >
            <PhoneIcon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden 2xl:inline">{site.phone}</span>
            <span className="2xl:hidden">Trade desk</span>
          </a>

          <Link
            href="/quote"
            className="hidden min-h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary shadow-sm shadow-black/15 transition-all hover:bg-accent/90 lg:inline-flex"
          >
            Request quote
          </Link>

          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-md border border-white/15 bg-white/8 text-white transition-colors hover:bg-white/12 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-primary/60 backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100vw,20rem)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)] lg:hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex h-[3.75rem] items-center justify-between border-b border-white/10 bg-primary px-4 sm:h-16">
          <span className="text-sm font-semibold text-white">Navigation</span>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-md border border-white/15 text-white/90"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Mobile">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={active}
                    mobile
                    onClick={() => setOpen(false)}
                  />
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-2.5 border-t border-slate-200 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm transition-colors hover:border-primary/20"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
                <PhoneIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-slate-500">Trade desk</p>
                <p className="font-medium text-primary">{site.phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm transition-colors hover:border-primary/20"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
                <EnvelopeIcon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="truncate font-medium text-primary">{site.email}</p>
              </div>
            </a>
            <Link
              href="/quote"
              className="flex min-h-11 items-center justify-center rounded-md bg-accent text-base font-semibold text-primary transition-colors hover:bg-accent/90"
              onClick={() => setOpen(false)}
            >
              Request a quote
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const exportLinks = [
    { href: "/products", label: "Product catalog" },
    { href: "/markets", label: "Global markets" },
    { href: "/quote", label: "Request export quote" },
    { href: "/contact", label: "Trade desk" },
  ];

  const corridors = ["Bangladesh", "Pakistan", "Sri Lanka", "UAE", "Singapore", "UK", "USA"];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-primary text-white/80 supports-[padding:max(0px)]:pb-[env(safe-area-inset-bottom)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <Container className="relative py-10 sm:py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-accent/90 sm:text-sm">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              {site.description}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 lg:mt-6">
              {site.certifications.map((cert) => (
                <li
                  key={cert}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-medium text-white/75 sm:text-xs"
                >
                  <BuildingOffice2Icon className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Company
            </h3>
            <ul className="mt-4 space-y-1 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center transition-colors hover:text-accent sm:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Export desk */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Export desk
            </h3>
            <ul className="mt-4 space-y-1 text-sm">
              {exportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center transition-colors hover:text-accent sm:min-h-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade desk */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
              Trade desk
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Quotes, compliance, and shipment support from our Mumbai operations team.
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-start gap-2.5 break-all transition-colors hover:text-accent"
                >
                  <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {site.phone}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Button href="/quote" variant="accent" className="px-5 py-2.5 text-sm font-bold">
                Get export quote
              </Button>
              <Button
                href="/contact"
                variant="outline"
                className="border-white/25 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
              >
                Contact desk
              </Button>
            </div>
          </div>
        </div>

        {/* Headquarters — India (flat, no cards) */}
        <div className="mt-10 border-t border-white/10 pt-8 sm:mt-12 sm:pt-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-10">
            <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Headquarters — India
            </p>
            <div className="grid min-w-0 flex-1 gap-4 text-sm text-white/65 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <p className="flex items-start gap-2.5 leading-relaxed sm:col-span-2 lg:col-span-1">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>{site.address}</span>
              </p>
              <p>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-start gap-2.5 break-all transition-colors hover:text-accent"
                >
                  <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {site.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-[#061a2e]/80">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6">
          <p className="text-center text-xs text-white/50 sm:text-left">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-center text-[10px] leading-relaxed text-white/45 sm:max-w-xl sm:text-right sm:text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-white/55">Corridors: </span>
            {corridors.join(" · ")}
          </p>
        </Container>
      </div>
    </footer>
  );
}

// ============================================================
// FIXED PageHero - WHITE BACKGROUND (no blue gradient)
// Homepage remains blue because it uses home-hero.tsx
// ============================================================
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-border bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <Container>
        {eyebrow && (
          <div className="text-sm font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-2 max-w-4xl text-pretty text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base text-muted sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-4 flex flex-wrap gap-3">{children}</div>}
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

export function ProductCard({ product }: { product: ExportProduct }) {
  const imageSrc = getProductImage(product.slug, product.category);

  return (
    <Link href={`/products/${product.slug}`} className="card-interactive card-product group">
      <div className="card-media card-media--image">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="card-body card-body--compact">
        <CardBadge tone="accent">{formatCategoryLabel(product.category)}</CardBadge>
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 sm:h-11 sm:w-11">
            <GlobeAltIcon className="h-5 w-5 text-secondary sm:h-6 sm:w-6" aria-hidden />
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 sm:h-11 sm:w-11">
            <GlobeAltIcon className="h-5 w-5 text-secondary sm:h-6 sm:w-6" aria-hidden />
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
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent sm:h-10 sm:w-10">
          <BriefcaseIcon className="h-5 w-5" aria-hidden />
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
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
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