/** Google Maps embed and directions URLs from a street address. */
export function buildMapEmbedUrl(address: string, customEmbedUrl?: string): string {
  const custom = customEmbedUrl?.trim();
  if (custom) return custom;
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export function buildMapDirectionsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
