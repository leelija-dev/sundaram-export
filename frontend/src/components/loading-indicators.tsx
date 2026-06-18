"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FetchingBar } from "@/components/ui/fetching-bar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { subscribeFetching } from "@/lib/fetching-bus";

function isInternalNavLink(link: HTMLAnchorElement, event: MouseEvent) {
  if (link.dataset.noFetching !== undefined) return false;
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target && link.target !== "_self") return false;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

  try {
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

function isDownloadLink(link: HTMLAnchorElement) {
  if (link.hasAttribute("download")) return true;
  try {
    const url = new URL(link.href, window.location.href);
    return /\/print\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}

export function LoadingIndicators() {
  const pathname = usePathname();
  const [navFetching, setNavFetching] = useState(false);
  const [bgFetching, setBgFetching] = useState(false);
  const [downloadActive, setDownloadActive] = useState(false);

  useEffect(() => {
    setNavFetching(false);
    setDownloadActive(false);
  }, [pathname]);

  useEffect(() => subscribeFetching(setBgFetching), []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || !isInternalNavLink(link, event)) return;

      if (isDownloadLink(link)) {
        setDownloadActive(true);
      } else {
        setNavFetching(true);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <FetchingBar active={navFetching || bgFetching} />
      <ProgressBar active={downloadActive} label="Downloading" />
    </>
  );
}
