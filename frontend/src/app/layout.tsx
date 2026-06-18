import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LoadingIndicators } from "@/components/loading-indicators";
import { SiteConfigProvider } from "@/components/site-config-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Footer, Header } from "@/components/site-ui";
import { site } from "@/data/site";
import { getSiteConfig } from "@/lib/site-env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = getSiteConfig();

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <SiteConfigProvider config={siteConfig}>
          <LoadingIndicators />
          <SmoothScrollProvider>
            <Header />
            <main className="min-w-0">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
