function readEnv(key: string, fallback: string): string {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function readEnvInt(key: string, fallback: number): number {
  const raw = process.env[key]?.trim();
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export type SiteConfig = {
  email: string;
  phone: string;
  phoneAlt: string;
  address: string;
  addressShort: string;
  addressUS: string;
  founded: number;
  yearsExperience: number;
  copyrightYear: number;
  mapEmbedUrl: string;
};

/** Read contact & company fields on the server (layout / RSC pages). */
export function getSiteConfig(): SiteConfig {
  const founded = readEnvInt("NEXT_PUBLIC_SITE_FOUNDED_YEAR", 1998);
  const yearsOverride = readEnvInt("NEXT_PUBLIC_SITE_YEARS_EXPERIENCE", 0);
  const currentYear = new Date().getFullYear();
  const yearsExperience =
    yearsOverride > 0 ? yearsOverride : Math.max(currentYear - founded, 1);

  return {
    email: readEnv("NEXT_PUBLIC_SITE_EMAIL", "exports@sundaramexport.com"),
    phone: readEnv("NEXT_PUBLIC_SITE_PHONE", "+91 22 4000 1200"),
    phoneAlt: readEnv("NEXT_PUBLIC_SITE_PHONE_ALT", "+1 (713) 555 0142"),
    address: readEnv(
      "NEXT_PUBLIC_SITE_ADDRESS",
      "Sundaram Trade Tower, Bandra Kurla Complex, Mumbai 400051, India",
    ),
    addressShort: readEnv("NEXT_PUBLIC_SITE_ADDRESS_SHORT", "Mumbai, India"),
    addressUS: readEnv(
      "NEXT_PUBLIC_SITE_ADDRESS_US",
      "2400 Port Commerce Parkway, Houston, TX 77029, USA",
    ),
    founded,
    yearsExperience,
    copyrightYear: currentYear,
    mapEmbedUrl: readEnv("NEXT_PUBLIC_MAP_EMBED_URL", ""),
  };
}
