"use client";

type HomepageActionMeta = {
  action: string;
  location?: string;
  href?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackHomepageAction(meta: HomepageActionMeta) {
  if (typeof window === "undefined") return;

  const payload = {
    action: meta.action,
    location: meta.location ?? "homepage",
    href: meta.href ?? "",
    ts: Date.now(),
  };

  window.dispatchEvent(new CustomEvent("homepage:action_click", { detail: payload }));

  if (typeof window.gtag === "function") {
    window.gtag("event", "homepage_action_click", {
      event_category: "homepage",
      event_label: meta.action,
      action_location: payload.location,
      action_href: payload.href,
    });
  }

  if (typeof window.plausible === "function") {
    window.plausible("Homepage Action Click", {
      props: {
        action: meta.action,
        location: payload.location,
        href: payload.href,
      },
    });
  }
}
