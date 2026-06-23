/** Resolve Django media URLs from the catalog API into browser-ready absolute URLs. */

function readRuntimeEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function getApiOrigin(): string {
  const mediaOrigin = readRuntimeEnv("NEXT_PUBLIC_MEDIA_ORIGIN");
  if (mediaOrigin) return mediaOrigin.replace(/\/$/, "");

  const apiBase = readRuntimeEnv("NEXT_PUBLIC_API_URL");
  if (apiBase) return apiBase.replace(/\/$/, "").replace(/\/api\/v1$/, "");

  if (typeof window !== "undefined") {
    // Same-origin /media/ paths work through nginx in Docker.
    return "";
  }

  const internal = readRuntimeEnv("API_INTERNAL_URL");
  if (internal) return internal.replace(/\/$/, "").replace(/\/api\/v1$/, "");

  return "http://127.0.0.1:8000";
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
    return origin.length > 0 && src.startsWith(origin);
  } catch {
    return false;
  }
}
