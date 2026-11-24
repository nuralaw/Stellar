import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawlers may read the public pages (/, /plus, /register, /sat-score-calculator, /sat-dates, /sat-vocabulary and its lists).
// Everything else needs an account, so it only redirects to /register: listing it here saves crawlers the trip.
// Rules match by prefix ("/test" also blocks "/test-dates"), which is why public pages are named /sat-...: see docs/SEO.md.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/auth/", "/landing", "/profile", "/statistics", "/mistakes", "/practice", "/test", "/lessons", "/vocabulary", "/compete", "/ranked", "/leaderboard"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
