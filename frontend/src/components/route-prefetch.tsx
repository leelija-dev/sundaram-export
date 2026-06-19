"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { navLinks } from "@/data/site";

const EXTRA_ROUTES = ["/quote"];

export function RoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const prefetchAll = () => {
      for (const link of navLinks) {
        router.prefetch(link.href);
      }
      for (const href of EXTRA_ROUTES) {
        router.prefetch(href);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(prefetchAll, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(prefetchAll, 400);
    return () => window.clearTimeout(timer);
  }, [router]);

  return null;
}
