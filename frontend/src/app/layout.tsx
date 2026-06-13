// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import dynamic from "next/dynamic";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A2540",
};

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Multinational Export Products`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "export",
    "international trade",
    "freight",
    "customs",
    "India export",
    "agricultural export",
    "textile export",
  ],
};

// Dynamic imports without ssr: false (let it SSR normally)
const Header = dynamic(
  () => import("@/components/site-ui").then((mod) => mod.Header),
  { loading: () => <div className="h-16 bg-primary/10 animate-pulse" /> }
);

const Footer = dynamic(
  () => import("@/components/site-ui").then((mod) => mod.Footer),
  { loading: () => <div className="h-32 bg-primary/5 animate-pulse" /> }
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body
        className="flex min-h-full min-w-0 flex-col bg-background antialiased text-foreground"
        suppressHydrationWarning
      >
        <Header />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}