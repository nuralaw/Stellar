import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Crawlers may read the public pages (/, /plus, /register). Everything else needs an account, so it only redirects to /register:
// listing it here saves crawlers the trip. Opening more pages to the public? See docs/SEO.md.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/auth/", "/landing", "/profile", "/statistics", "/mistakes", "/practice", "/test", "/lessons", "/vocabulary", "/compete"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
