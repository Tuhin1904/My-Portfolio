'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import * as gtag from '@/lib/gtag';

export default function SiteAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Send Google Analytics 4 (GA4) Pageview on route change
    gtag.pageview(pathname);
  }, [pathname]);

  return null;
}
