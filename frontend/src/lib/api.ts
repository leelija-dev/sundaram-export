import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { ExportProduct, IndustrySector, MarketRegionCard, ProductCategory } from "@/lib/types/catalog";
import { resolveMediaUrl } from "@/lib/media-url";

export type {
  ExportProduct,
  IndustrySector,
  MarketRegionCard,
  ProductCategory,
} from "@/lib/types/catalog";
export { categoryLabelsFromProducts, PRODUCT_CATEGORY_LABELS } from "@/lib/types/catalog";

function readRuntimeEnv(key: string): string | undefined {
  // Bracket access keeps server env readable at runtime in Docker/standalone
  // (static process.env.NEXT_PUBLIC_* is inlined at build time).
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
}

/** Resolve API base URL per request (server vs browser, dev vs Docker). */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    const internal = readRuntimeEnv("API_INTERNAL_URL");
    if (internal) return internal.replace(/\/$/, "");

    const configured = readRuntimeEnv("NEXT_PUBLIC_API_URL");
    if (configured) return configured.replace(/\/$/, "");

    return "http://127.0.0.1:8000/api/v1";
  }

  const configured = readRuntimeEnv("NEXT_PUBLIC_API_URL")?.replace(/\/$/, "");
  if (configured?.startsWith("/")) return configured;
  if (configured) {
    try {
      const target = new URL(configured, window.location.origin);
      if (target.origin === window.location.origin) return configured;
    } catch {
      // fall through to same-origin relative path
    }
  }

  // Behind nginx in Docker: browser calls /api/v1 on the current host.
  return "/api/v1";
}

export const API_REVALIDATE_SECONDS = 60;

type Paginated<T> = { results: T[]; count?: number } | T[];

type MemoryCacheEntry = { expires: number; data: unknown };
const memoryCache = new Map<string, MemoryCacheEntry>();
const DEV_MEMORY_TTL_MS = 30_000;

export function unwrapList<T>(data: Paginated<T>): T[] {
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

type ApiIndustry = {
  slug: string;
  name: string;
  description: string;
  compliance_tag?: string;
};

type ApiProduct = {
  slug: string;
  title: string;
  short_description: string;
  description?: string;
  image?: string | null;
  category: string;
  hs_code: string;
  origins: string[];
  markets: string[];
  specifications?: string[];
  packaging?: string[];
  created_at?: string;
};

export type ExportCountry = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  key_ports: string[];
  specialties: string[];
  region_id: string;
  region_name: string;
};

type ApiMarketRegion = {
  id: string;
  name: string;
  description: string;
  countries: string[];
  key_ports: string[];
  specialties: string[];
};

export type Office = {
  region: string;
  address: string;
  phone: string;
  email: string;
};

export type InquiryPayload = {
  type: "contact" | "quote";
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  origin?: string;
  destination?: string;
  product_slug?: string;
  incoterms?: string;
  volume?: string;
  website?: string;
};

export type InquiryResponse = {
  id: string;
  message: string;
  inquiry?: {
    id: string;
    inquiry_type: string;
    status: string;
    created_at: string;
  };
};

export function mapIndustry(api: ApiIndustry): IndustrySector {
  return {
    slug: api.slug,
    name: api.name,
    description: api.description,
    complianceTag: api.compliance_tag || undefined,
  };
}

export function mapProduct(api: ApiProduct): ExportProduct {
  return {
    slug: api.slug,
    title: api.title,
    shortDescription: api.short_description,
    description: api.description ?? "",
    category: api.category,
    hsCode: api.hs_code || undefined,
    origins: api.origins ?? [],
    markets: api.markets ?? [],
    specifications: api.specifications ?? [],
    packaging: api.packaging ?? [],
    imageUrl: resolveMediaUrl(api.image),
    createdAt: api.created_at,
  };
}

export function mapMarketRegion(api: ApiMarketRegion): MarketRegionCard {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    countries: api.countries ?? [],
    keyPorts: api.key_ports ?? [],
    specialties: api.specialties ?? [],
  };
}

function readMemoryCache<T>(key: string): T | null {
  const hit = memoryCache.get(key);
  if (!hit || hit.expires <= Date.now()) return null;
  return hit.data as T;
}

function writeMemoryCache(key: string, data: unknown, ttlMs: number) {
  memoryCache.set(key, { expires: Date.now() + ttlMs, data });
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const memoryKey = `GET:${path}`;
  const cached = readMemoryCache<T>(memoryKey);
  if (cached !== null) return cached;

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      next: { revalidate: API_REVALIDATE_SECONDS, tags: [`api:${path}`] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as T;
    writeMemoryCache(memoryKey, data, DEV_MEMORY_TTL_MS);
    return data;
  } catch {
    return null;
  }
}

const fetchJsonDeduped = cache(fetchJson);

function catalogCache<T>(key: string, tags: string[], loader: () => Promise<T>): Promise<T> {
  return unstable_cache(loader, ["catalog", key], {
    revalidate: API_REVALIDATE_SECONDS,
    tags,
  })();
}

export const fetchIndustries = cache(async (): Promise<IndustrySector[]> => {
  return catalogCache("industries", ["catalog", "industries"], async () => {
    const data = await fetchJsonDeduped<Paginated<ApiIndustry>>("/industries/");
    if (!data) return [];
    return unwrapList(data).map(mapIndustry);
  });
});

export const fetchProducts = cache(async (): Promise<ExportProduct[]> => {
  return catalogCache("products", ["catalog", "products"], async () => {
    const data = await fetchJsonDeduped<Paginated<ApiProduct>>("/products/");
    if (!data) return [];
    return unwrapList(data).map(mapProduct);
  });
});

export const fetchProductBySlug = cache(async (slug: string): Promise<ExportProduct | null> => {
  return catalogCache(`product:${slug}`, ["catalog", "products", `product:${slug}`], async () => {
    const data = await fetchJsonDeduped<ApiProduct>(`/products/${slug}/`);
    return data ? mapProduct(data) : null;
  });
});

export const fetchExportCountries = cache(async (): Promise<ExportCountry[]> => {
  return catalogCache("countries", ["catalog", "countries"], async () => {
    const data = await fetchJsonDeduped<Paginated<ExportCountry>>("/countries/");
    if (!data) return [];
    return unwrapList(data);
  });
});

export const fetchMarketRegions = cache(async (): Promise<MarketRegionCard[]> => {
  return catalogCache("markets", ["catalog", "markets"], async () => {
    const data = await fetchJsonDeduped<Paginated<ApiMarketRegion>>("/markets/");
    if (!data) return [];
    return unwrapList(data).map(mapMarketRegion);
  });
});

export const fetchOffices = cache(async (): Promise<Office[]> => {
  return catalogCache("offices", ["catalog", "offices"], async () => {
    const data = await fetchJsonDeduped<Paginated<Office>>("/offices/");
    if (!data) return [];
    return unwrapList(data);
  });
});

export async function checkApiHealth(): Promise<boolean> {
  const data = await fetchJsonDeduped<{ status: string }>("/health/");
  return data?.status === "ok";
}

function formatApiErrors(data: Record<string, unknown>): string {
  if (typeof data.detail === "string") return data.detail;
  const parts: string[] = [];
  const nonField = data.non_field_errors;
  if (Array.isArray(nonField)) {
    parts.push(nonField.map(String).join(", "));
  }
  for (const [key, value] of Object.entries(data)) {
    if (key === "non_field_errors") continue;
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(", ")}`);
    } else if (typeof value === "string") {
      parts.push(value);
    }
  }
  return parts.length > 0 ? parts.join(" ") : "Request failed.";
}

function buildInquiryPayload(payload: InquiryPayload): InquiryPayload {
  const productSlug = payload.product_slug?.trim();
  return {
    ...payload,
    name: payload.name.trim(),
    company: payload.company?.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim(),
    message: payload.message.trim(),
    origin: payload.origin?.trim(),
    destination: payload.destination?.trim(),
    incoterms: payload.incoterms?.trim(),
    volume: payload.volume?.trim(),
    product_slug:
      productSlug && productSlug !== "other" ? productSlug : undefined,
  };
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  const body = buildInquiryPayload(payload);
  const res = await fetch(`${getApiBaseUrl()}/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail =
      typeof data === "object" && data !== null
        ? formatApiErrors(data as Record<string, unknown>)
        : "Something went wrong. Please try again.";
    throw new Error(detail);
  }

  return data as InquiryResponse;
}
