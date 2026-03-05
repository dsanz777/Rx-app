"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX'); // IMPORTANT: Replace this with your real Measurement ID from Google Analytics (get it by signing up at analytics.google.com and creating a web property)

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    ReactGA.send({ hitType: "pageview", page: url });
  }, [pathname, searchParams]);

  return null;
}