"use client";

import {
  getApiBaseUrl,
  mapProduct,
  mapMarketRegion,
  unwrapList,
  type ExportCountry,
  type ExportProduct,
  type Office,
} from "@/lib/api";
import type { MarketRegionCard } from "@/lib/types/catalog";

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

type ApiMarketRegion = {
  id: string;
  name: string;
  description: string;
  countries: string[];
  key_ports: string[];
  specialties: string[];
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

export async function clientFetchMarketRegions(): Promise<MarketRegionCard[]> {
  const data = await clientGet<Paginated<ApiMarketRegion>>("/markets/");
  if (!data) return [];
  return unwrapList(data).map(mapMarketRegion);
}

export async function clientFetchOffices(): Promise<Office[]> {
  const data = await clientGet<Paginated<Office>>("/offices/");
  if (!data) return [];
  return unwrapList(data);
}
