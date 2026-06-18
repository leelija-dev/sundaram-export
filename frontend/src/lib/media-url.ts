/** Resolve Django media URLs from the catalog API into browser-ready absolute URLs. */

export function getApiOrigin(): string {
  const mediaOrigin = process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "");
  if (mediaOrigin) return mediaOrigin;

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api/v1";
  return apiBase.replace(/\/api\/v1$/, "");
}

export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const origin = getApiOrigin();
  if (trimmed.startsWith("/")) {
    return `${origin}${trimmed}`;
  }

  return `${origin}/${trimmed}`;
}

export function isBackendMediaUrl(src: string): boolean {
  if (src.includes("/media/")) return true;

  try {
    const origin = getApiOrigin();
    return src.startsWith(origin);
  } catch {
    return false;
  }
}
