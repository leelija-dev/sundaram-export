"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  CubeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HomeIcon,
  MapPinIcon,
  PhoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";
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

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
  phone: string;
  email: string;
  address: string;
};

export function MobileMenu({
  open,
  onClose,
  pathname,
  phone,
  email,
  address,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-[90] bg-primary-dark/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-label="Close menu"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <div
        id="mobile-menu"
        data-lenis-prevent
        className={cn(
          "fixed inset-y-0 right-0 z-[100] flex h-dvh max-h-dvh w-full max-w-[min(100vw,20rem)] flex-col overflow-hidden border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)] lg:hidden",
          open ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-hidden={!open}
        role="dialog"
        aria-modal={open}
        aria-label="Site menu"
      >
        <div className="flex h-[3.75rem] shrink-0 items-center justify-between border-b border-white/10 bg-primary-dark px-4 sm:h-16">
          <span className="text-sm font-semibold text-white">Menu</span>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/90"
            aria-label="Close menu"
            onClick={onClose}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav
          data-lenis-prevent
          className="mobile-menu-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-4"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = NAV_ICONS[link.href] ?? BriefcaseIcon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch
                    onClick={onClose}
                    className={cn(
                      "flex min-h-[3.25rem] items-center gap-3 rounded-lg px-3 text-[15px] font-medium transition-all",
                      active
                        ? "bg-secondary/10 text-primary"
                        : "text-foreground/85 hover:bg-surface hover:text-primary",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                        active ? "bg-secondary text-white" : "bg-surface text-muted",
                      )}
                    >
                      <Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 space-y-2.5 border-t border-border pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <a
              href={phoneHref(phone)}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-sm transition-colors hover:border-secondary/30"
              onClick={onClose}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-white">
                <PhoneIcon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-muted">Trade desk</p>
                <p className="font-medium text-primary">{phone}</p>
              </div>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-sm transition-colors hover:border-secondary/30"
              onClick={onClose}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-white">
                <EnvelopeIcon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">Email</p>
                <p className="truncate font-medium text-primary">{email}</p>
              </div>
            </a>
            <div className="flex items-start gap-3 rounded-lg border border-border bg-surface px-3 py-3 text-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-white">
                <MapPinIcon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">Head office</p>
                <p className="font-medium leading-snug text-primary">{address}</p>
              </div>
            </div>
            <Link
              href="/quote"
              prefetch
              className="flex min-h-11 items-center justify-center rounded-md bg-accent text-base font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent/90"
              onClick={onClose}
            >
              Request a quote
            </Link>
          </div>
        </nav>
      </div>
    </>,
    document.body,
  );
}
