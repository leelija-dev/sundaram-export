import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Footer, Header } from "@/components/site-ui";
import { site } from "@/data/site";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className="flex min-h-full min-w-0 flex-col bg-background antialiased text-foreground">
        <Header />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
