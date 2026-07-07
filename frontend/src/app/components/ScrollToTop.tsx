import { useEffect, useLayoutEffect, useRef } from "react";
import {
  disableBrowserScrollRestoration,
  scrollToTopForCurrentRoute,
  scrollToTopForRoute,
} from "../utils/scrollRestoration";

interface ScrollToTopProps {
  routeKey: string;
}

/**
 * Forces scroll to top on every hash route change.
 * Resets window and known app scroll containers immediately.
 */
export function ScrollToTop({ routeKey }: ScrollToTopProps) {
  const previousRouteKey = useRef<string | null>(null);

  useEffect(() => {
    disableBrowserScrollRestoration();
  }, []);

  useLayoutEffect(() => {
    if (previousRouteKey.current === routeKey) {
      return;
    }

    previousRouteKey.current = routeKey;
    scrollToTopForRoute(routeKey);
  }, [routeKey]);

  useEffect(() => {
    if (previousRouteKey.current !== routeKey) {
      return;
    }

    scrollToTopForRoute(routeKey);

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      scrollToTopForRoute(routeKey);
      raf2 = requestAnimationFrame(() => {
        scrollToTopForRoute(routeKey);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [routeKey]);

  useEffect(() => {
    const handleHashChange = () => {
      scrollToTopForCurrentRoute();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return null;
}
