// src/components/site-ui.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { navLinks, site, socialLinks } from "@/data/site";
import { useSiteConfig } from "@/components/site-config-provider";
import { MobileMenu } from "@/components/mobile-menu";
import { useLenis } from "@/components/smooth-scroll-provider";
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
import {
  EnvelopeIcon as EnvelopeIconSolid,
  MapPinIcon as MapPinIconSolid,
  PhoneIcon as PhoneIconSolid,
} from "@heroicons/react/24/solid";
import { getProductImage } from "@/lib/product-images";
import { ProductImage } from "@/components/product-image";
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

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function SocialIcon({ label }: { label: (typeof socialLinks)[number]["label"] }) {
  const className = "h-[15px] w-[15px] sm:h-4 sm:w-4";

  switch (label) {
    case "YouTube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "Facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "X":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    default:
      return null;
  }
}

function TopBar() {
  const { phone, email, address, addressShort } = useSiteConfig();

  return (
    <div className="border-b border-border bg-white">
      <Container className="flex h-[var(--top-bar-h)] items-center justify-between gap-2 text-xs sm:gap-3 sm:text-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-4 lg:gap-5">
          <a
            href={phoneHref(phone)}
            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-primary transition-colors hover:text-secondary"
          >
            <PhoneIconSolid className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
            <span className="hidden sm:inline">{phone}</span>
            <span className="sm:hidden">Call us</span>
          </a>

          <span className="hidden h-2 w-px shrink-0 bg-border sm:block" aria-hidden />

          <a
            href={`mailto:${email}`}
            className="inline-flex min-w-0 items-center gap-1.5 font-medium text-primary transition-colors hover:text-secondary"
          >
            <EnvelopeIconSolid className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
            <span className="truncate">{email}</span>
          </a>

          <span className="hidden h-2 w-px shrink-0 bg-border lg:block" aria-hidden />

          <p className="hidden min-w-0 items-center gap-1.5 font-medium text-primary/90 lg:flex">
            <MapPinIconSolid className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
            <span className="truncate" title={address}>
              {addressShort}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-accent transition-colors hover:bg-surface hover:text-primary sm:h-7 sm:w-7"
            >
              <SocialIcon label={link.label} />
            </a>
          ))}
        </div>
      </Container>
    </div>
  );
}

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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:text-sm",
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
    accent: "bg-accent text-white hover:bg-accent/90 hover:text-white shadow-lg shadow-accent/25",
    outline:
      "border border-border text-foreground hover:border-secondary hover:text-secondary bg-background",
    light: "bg-background text-primary hover:bg-surface shadow-sm border border-border",
  };
  return (
    <Link
      href={href}
      prefetch
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
    <Link href="/" prefetch className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white lg:h-10 lg:w-10">
        <Image
          src={site.logoSrc}
          alt={`${site.name} logo`}
          width={40}
          height={40}
          className="h-full w-full object-contain p-0.5"
          priority
        />
      </span>
      <div className="min-w-0 max-w-[9.5rem] leading-tight sm:max-w-[11rem] lg:max-w-none">
        <span className="block truncate text-base font-bold tracking-tight text-white transition-colors group-hover:text-accent-light lg:overflow-visible lg:whitespace-normal lg:text-lg">
          {site.name}
        </span>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-white/55 lg:block">
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
        prefetch
        onClick={onClick}
        className={cn(
          "flex min-h-[3.25rem] items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-all",
          active
            ? "bg-secondary/10 text-primary"
            : "text-foreground/85 hover:bg-surface hover:text-primary"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            active ? "bg-secondary text-white" : "bg-surface text-muted"
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
      prefetch
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 text-[13px] font-medium transition-all xl:text-sm",
        active
          ? "bg-secondary/20 text-white shadow-sm shadow-black/10 ring-1 ring-secondary/25"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { phone, email, address } = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [motion, setMotion] = useState<"enter" | "exit">("enter");
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideDelayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTicking = useRef(false);

  const setNavVisible = useCallback((next: boolean) => {
    setMotion(next ? "enter" : "exit");
    setVisible(next);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      setNavVisible(true);
      lenis?.stop();
    } else {
      lenis?.start();
    }

    const root = document.documentElement;
    if (open) {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis, setNavVisible]);

  useEffect(() => {
    const TOP_THRESHOLD = 48;
    const HIDE_DELAY_MS = 180;
    const IDLE_SHOW_MS = 520;

    const clearTimers = () => {
      if (hideDelayTimer.current) {
        clearTimeout(hideDelayTimer.current);
        hideDelayTimer.current = null;
      }
      if (scrollIdleTimer.current) {
        clearTimeout(scrollIdleTimer.current);
        scrollIdleTimer.current = null;
      }
    };

    const updateOnScroll = (y: number) => {
      scrollTicking.current = false;
      setScrolled(y > 8);

      if (open || y <= TOP_THRESHOLD) {
        clearTimers();
        setNavVisible(true);
        return;
      }

      if (!hideDelayTimer.current) {
        hideDelayTimer.current = setTimeout(() => {
          hideDelayTimer.current = null;
          const currentY = lenis ? lenis.animatedScroll : window.scrollY;
          if (currentY > TOP_THRESHOLD && !open) {
            setNavVisible(false);
          }
        }, HIDE_DELAY_MS);
      }

      if (scrollIdleTimer.current) {
        clearTimeout(scrollIdleTimer.current);
      }
      scrollIdleTimer.current = setTimeout(() => {
        scrollIdleTimer.current = null;
        setNavVisible(true);
      }, IDLE_SHOW_MS);
    };

    const onScroll = () => {
      if (!scrollTicking.current) {
        scrollTicking.current = true;
        requestAnimationFrame(() => updateOnScroll(lenis ? lenis.animatedScroll : window.scrollY));
      }
    };

    if (lenis) {
      updateOnScroll(lenis.animatedScroll);
      const unsubscribe = lenis.on("scroll", (instance) => {
        updateOnScroll(instance.animatedScroll);
      });
      return () => {
        unsubscribe();
        clearTimers();
      };
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimers();
    };
  }, [open, setNavVisible, lenis]);

  return (
    <>
      <header
        data-visible={visible ? "true" : "false"}
        data-menu-open={open ? "true" : "false"}
        data-motion={motion}
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]",
          scrolled
            ? "bg-primary-dark shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)]"
            : "bg-primary-nav"
        )}
      >
      <TopBar />

      <div
        className={cn(
          "relative border-b border-white/10",
          scrolled ? "bg-primary-dark" : "bg-primary-nav"
        )}
      >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
        aria-hidden
      />

      <Container className="relative grid h-[var(--header-nav-h)] grid-cols-[auto_1fr_auto] items-center gap-3 lg:gap-8">
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
          <Link
            href="/quote"
            prefetch
            className="hidden min-h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-accent/30 transition-all hover:bg-accent/90 lg:inline-flex"
          >
            Request quote
          </Link>

          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-md border border-white/20 bg-primary-dark/40 text-white backdrop-blur-sm transition-colors hover:bg-primary-dark/60 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </Container>
      </div>
    </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        phone={phone}
        email={email}
        address={address}
      />

      <div className="site-header-spacer" aria-hidden />
    </>
  );
}

export function Footer() {
  const { email, phone, address, copyrightYear } = useSiteConfig();
  const exportLinks = [
    { href: "/products", label: "Product catalog" },
    { href: "/markets", label: "Global markets" },
    { href: "/quote", label: "Request export quote" },
    { href: "/contact", label: "Trade desk" },
  ];

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
                    prefetch
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
                    prefetch
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
                  href={`mailto:${email}`}
                  className="inline-flex items-start gap-2.5 break-all transition-colors hover:text-accent"
                >
                  <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {phone}
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
                <span>{address}</span>
              </p>
              <p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-start gap-2.5 break-all transition-colors hover:text-accent"
                >
                  <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10 bg-primary-dark/80">
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6">
          <p className="text-center text-sm text-white/55 sm:text-left">
            © {copyrightYear} {site.name}. All rights reserved.
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
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
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
        <p className="text-sm font-semibold uppercase tracking-wider text-accent sm:text-base">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-pretty text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base leading-relaxed text-muted sm:mt-3 sm:text-lg">
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
        "inline-flex items-center gap-1 text-base font-semibold text-secondary transition-colors group-hover:text-primary",
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
  const imageSrc = getProductImage(product.slug, product.category, product.imageUrl);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-interactive card-product group"
      aria-label={`View details for ${product.title}`}
    >
      <div className="card-media card-media--image">
        <ProductImage
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
        <p className="mt-1.5 line-clamp-3 flex-1 text-base leading-relaxed text-muted sm:mt-2">
          {product.shortDescription}
        </p>
        <div className="card-footer max-sm:pt-3 sm:border-t sm:border-border sm:pt-4">
          <CardCta>View details →</CardCta>
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