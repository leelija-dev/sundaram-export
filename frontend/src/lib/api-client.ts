"use client";

import {
  getApiBaseUrl,
  mapProduct,
  submitInquiry,
  unwrapList,
  type ExportCountry,
  type ExportProduct,
  type InquiryPayload,
  type InquiryResponse,
} from "@/lib/api";

const API_BASE = getApiBaseUrl();

type Paginated<T> = { results: T[] } | T[];

type ApiProduct = {
  slug: string;
  title: string;
  short_description: string;
  description: string;
  category: ExportProduct["category"];
  hs_code: string;
  origins: string[];
  markets: string[];
  specifications: string[];
  packaging: string[];
};

async function clientGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function clientFetchProducts(): Promise<ExportProduct[]> {
  const data = await clientGet<Paginated<ApiProduct>>("/products/");
  if (!data) return [];
  return unwrapList(data).map(mapProduct);
}

export async function clientFetchCountries(): Promise<ExportCountry[]> {
  const data = await clientGet<Paginated<ExportCountry>>("/countries/");
  if (!data) return [];
  return unwrapList(data);
}

/** Submit contact or quote inquiry from client components. */
export async function clientSubmitInquiry(
  payload: InquiryPayload,
): Promise<InquiryResponse> {
  return submitInquiry(payload);
}
