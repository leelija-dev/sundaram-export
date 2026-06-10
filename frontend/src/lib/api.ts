import type { ExportProduct, MarketRegionCard, ProductCategory } from "@/lib/types/catalog";

export type {
  ExportProduct,
  MarketRegionCard,
  ProductCategory,
} from "@/lib/types/catalog";
export { categoryLabelsFromProducts, PRODUCT_CATEGORY_LABELS } from "@/lib/types/catalog";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";

export const API_REVALIDATE_SECONDS = 60;

type Paginated<T> = { results: T[]; count?: number } | T[];

export function unwrapList<T>(data: Paginated<T>): T[] {
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

type ApiProduct = {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  category: ProductCategory;
  hs_code: string;
  origins: string[];
  markets: string[];
  specifications: string[];
  packaging: string[];
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

export function getApiBaseUrl(): string {
  return API_BASE;
}

export function mapProduct(api: ApiProduct): ExportProduct {
  return {
    slug: api.slug,
    title: api.title,
    shortDescription: api.short_description,
    description: api.description,
    category: api.category,
    hsCode: api.hs_code || undefined,
    origins: api.origins ?? [],
    markets: api.markets ?? [],
    specifications: api.specifications ?? [],
    packaging: api.packaging ?? [],
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

async function serverGet<T>(path: string, revalidate = API_REVALIDATE_SECONDS): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchProducts(): Promise<ExportProduct[]> {
  const data = await serverGet<Paginated<ApiProduct>>("/products/");
  if (!data) return [];
  return unwrapList(data).map(mapProduct);
}

export async function fetchProductBySlug(slug: string): Promise<ExportProduct | null> {
  const data = await serverGet<ApiProduct>(`/products/${slug}/`);
  return data ? mapProduct(data) : null;
}

export async function fetchExportCountries(): Promise<ExportCountry[]> {
  const data = await serverGet<Paginated<ExportCountry>>("/countries/");
  if (!data) return [];
  return unwrapList(data);
}

export async function fetchMarketRegions(): Promise<MarketRegionCard[]> {
  const data = await serverGet<Paginated<ApiMarketRegion>>("/markets/");
  if (!data) return [];
  return unwrapList(data).map(mapMarketRegion);
}

export async function fetchOffices(): Promise<Office[]> {
  const data = await serverGet<Paginated<Office>>("/offices/");
  if (!data) return [];
  return unwrapList(data);
}

export async function checkApiHealth(): Promise<boolean> {
  const data = await serverGet<{ status: string }>("/health/", 30);
  return data?.status === "ok";
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResponse> {
  const res = await fetch(`${API_BASE}/inquiries/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

function formatApiErrors(data: Record<string, unknown>): string {
  if (typeof data.detail === "string") return data.detail;
  const parts: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(", ")}`);
    } else if (typeof value === "string") {
      parts.push(value);
    }
  }
  return parts.length > 0 ? parts.join(" ") : "Request failed.";
}
