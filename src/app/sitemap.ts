import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The public, indexable pages. To add one: append it here (and see docs/SEO.md for robots.txt and the public-paths list).
// lastModified: a hand-kept "YYYY-MM-DD". Change it only when the page's content really changes (a build or a deploy is not a
// change): Google learns to trust the date only if it is honest. Priority is left out on purpose (Google ignores it).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: "2026-11-24" },
    { url: `${SITE_URL}/plus`, lastModified: "2026-11-20" },
    { url: `${SITE_URL}/register`, lastModified: "2026-11-20" },
    { url: `${SITE_URL}/sat-score-calculator`, lastModified: "2026-11-24" },
    { url: `${SITE_URL}/sat-dates`, lastModified: "2026-11-24" },
    { url: `${SITE_URL}/sat-vocabulary`, lastModified: "2026-11-24" },
    { url: `${SITE_URL}/sat-vocabulary/advanced`, lastModified: "2026-11-24" },
    { url: `${SITE_URL}/sat-vocabulary/math-terms`, lastModified: "2026-11-24" },
  ];
}
