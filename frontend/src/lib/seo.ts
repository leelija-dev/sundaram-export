import type { Metadata } from "next";
import { site, socialLinks } from "@/data/site";
import type { SiteConfig } from "@/lib/site-env";
import type { ExportProduct } from "@/lib/types/catalog";

export const DEFAULT_KEYWORDS = [
  "Sundaram Export",
  "export from India",
  "Indian export company",
  "agro commodities export",
  "spices export India",
  "global trade partner",
  "export logistics India",
  "FIEO member exporter",
  "APEDA registered exporter",
  "international shipping India",
  "export quote India",
  "B2B export supplier",
] as const;

function readRuntimeEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
}

/** Canonical public site URL for metadata, sitemap, and JSON-LD. */
export function getSiteUrl(): string {
  const siteUrl = readRuntimeEnv("NEXT_PUBLIC_SITE_URL");
  if (siteUrl) return siteUrl.replace(/\/$/, "");

  const mediaOrigin = readRuntimeEnv("NEXT_PUBLIC_MEDIA_ORIGIN");
  if (mediaOrigin && !mediaOrigin.includes("127.0.0.1")) {
    return mediaOrigin.replace(/\/$/, "");
  }

  const apiBase = readRuntimeEnv("NEXT_PUBLIC_API_URL");
  if (apiBase) {
    const origin = apiBase.replace(/\/api\/v1\/?$/, "");
    if (!origin.includes("127.0.0.1") && !origin.includes("localhost")) {
      return origin.replace(/\/$/, "");
    }
  }

  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === "/" ? "" : normalized}`;
}

export function absoluteAssetUrl(assetPath: string): string {
  const path = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${getSiteUrl()}${path}`;
}

export type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function createPageMetadata(input: PageSeoInput): Metadata {
  const canonical = absoluteUrl(input.path);
  const image = input.image ?? absoluteAssetUrl(site.logoSrc);
  const pageTitle = input.title;
  const fullTitle = `${pageTitle} | ${site.name}`;

  return {
    title: pageTitle,
    description: input.description,
    keywords: input.keywords ?? [...DEFAULT_KEYWORDS],
    alternates: { canonical },
    openGraph: {
      type: input.type ?? "website",
      locale: "en_IN",
      url: canonical,
      siteName: site.name,
      title: fullTitle,
      description: input.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: input.imageAlt ?? `${pageTitle} — ${site.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [...DEFAULT_KEYWORDS],
    applicationName: site.name,
    creator: site.name,
    publisher: site.name,
    category: "International Trade",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [{ url: site.logoSrc, type: "image/png" }],
      shortcut: [{ url: site.logoSrc, type: "image/png" }],
      apple: [{ url: site.logoSrc, type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: site.name,
      title: site.name,
      description: site.description,
      images: [
        {
          url: absoluteAssetUrl(site.logoSrc),
          width: 512,
          height: 512,
          alt: `${site.name} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: [absoluteAssetUrl(site.logoSrc)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function buildOrganizationSchema(config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: site.name,
    url: getSiteUrl(),
    logo: absoluteAssetUrl(site.logoSrc),
    description: site.description,
    foundingDate: String(config.founded),
    email: config.email,
    telephone: [config.phone, config.phoneAlt].filter(Boolean),
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: config.address,
        addressLocality: config.addressShort,
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        streetAddress: config.addressUS,
        addressCountry: "US",
      },
    ],
    sameAs: socialLinks.map((link) => link.href),
    knowsAbout: [
      "Agricultural commodity exports",
      "Spice exports",
      "International logistics",
      "Export compliance",
      "Global trade",
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: site.name,
    url: getSiteUrl(),
    description: site.description,
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "en-IN",
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProductSchema(product: ExportProduct, imageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.shortDescription,
    image: imageUrl,
    category: product.category,
    ...(product.hsCode ? { sku: product.hsCode } : {}),
    brand: {
      "@type": "Brand",
      name: site.name,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/quote?product=${product.slug}`),
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      seller: {
        "@type": "Organization",
        name: site.name,
        url: getSiteUrl(),
      },
    },
  };
}

export function buildContactPageSchema(config: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${site.name}`,
    url: absoluteUrl("/contact"),
    description: `Contact ${site.name} export desks for product inquiries, shipments, and partnerships.`,
    mainEntity: {
      "@id": `${getSiteUrl()}/#organization`,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "export sales",
        email: config.email,
        telephone: config.phone,
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };
}
