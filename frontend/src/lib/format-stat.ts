/** Format API counts for stat cards — e.g. 6, 12, 90+ */
export function formatStatCount(count: number, plusAt = 90): string {
  if (count <= 0) return "0";
  if (count >= plusAt) return `${plusAt}+`;
  return String(count);
}
