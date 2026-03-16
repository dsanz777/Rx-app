"use client";

import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";
import { trackHomepageAction } from "@/lib/analytics";

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  action: string;
  location?: string;
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export const primaryCtaClassName =
  "rounded-full border border-white/20 bg-black/60 px-5 py-3 font-medium text-white transition hover:border-[var(--accent)]/70 hover:text-[var(--accent)]";

export const secondaryCtaClassName =
  "rounded-full border border-white/20 px-5 py-3 font-medium text-white/80 transition hover:text-white";

export function ActionLink({
  href,
  children,
  action,
  location = "homepage",
  className,
  target,
  rel,
}: ActionLinkProps) {
  const onClick: MouseEventHandler<HTMLAnchorElement> = () => {
    trackHomepageAction({ action, location, href });
  };

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a href={href} className={className} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} target={target} rel={rel} onClick={onClick}>
      {children}
    </Link>
  );
}
