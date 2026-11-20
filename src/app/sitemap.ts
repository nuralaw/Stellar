import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The public, indexable pages. To add one: append it here (and see docs/SEO.md for robots.txt and the public-paths list).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/plus`, priority: 0.8 },
    { url: `${SITE_URL}/register`, priority: 0.6 },
  ];
}
