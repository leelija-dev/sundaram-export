import type { Metadata } from "next";
import { QuotePageContent } from "@/components/quote-page-content";

export const metadata: Metadata = {  title: "Request a Quote | Sundaram Export",
  description:
    "Get a tailored export quote for your product and destination. Our trade desk responds within 24 hours.",
};

export default function QuotePage() {
  return <QuotePageContent />;
}
