import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { LoadingIndicators } from "@/components/loading-indicators";
import { RoutePrefetch } from "@/components/route-prefetch";
import { SiteConfigProvider } from "@/components/site-config-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { Footer, Header } from "@/components/site-ui";
import { getSiteConfig } from "@/lib/site-env";
import { buildOrganizationSchema, buildWebSiteSchema, createRootMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = getSiteConfig();
  const structuredData = [buildOrganizationSchema(siteConfig), buildWebSiteSchema()];

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        suppressHydrationWarning
      >
        <JsonLd data={structuredData} />
        <SiteConfigProvider config={siteConfig}>
          <RoutePrefetch />
          <LoadingIndicators />
          <SmoothScrollProvider>
            <Header />
            <main id="main-content" className="min-w-0">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
