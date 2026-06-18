/** Refined maritime palette — single source for inline styles and gradients. */

export const brandColors = {
  primary: "#123A52",
  primaryDark: "#0A2438",
  primaryLight: "#1A4D6B",
  primaryNav: "#0F344C",
  secondary: "#0E7490",
  accent: "#D97706",
  accentLight: "#F59E0B",
  goldLight: "#FEF3C7",
  goldMid: "#FDE68A",
  background: "#F8FAFC",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
  surface: "#F1F5F9",
} as const;

export const brandRgba = {
  secondary: (alpha: number) => `rgba(14, 116, 144, ${alpha})`,
  accent: (alpha: number) => `rgba(217, 119, 6, ${alpha})`,
} as const;
