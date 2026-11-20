import type { Metadata } from "next";

// The public address and name of the site: canonical URLs, Open Graph, robots.txt, sitemap.xml, JSON-LD (docs/SEO.md).
// NEXT_PUBLIC_SITE_URL overrides the address (e.g. for a preview deployment); no trailing slash.

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.stellar1600.com").replace(/\/+$/, "");
export const SITE_NAME = "Stellar";

/**
 * Open Graph fields every page that sets its own `openGraph` must repeat: Next replaces the layout's openGraph object as a whole
 * (and drops the file-based opengraph-image with it), so a page spreads this and adds its title, description and url.
 */
export const OG_BASE: OpenGraph = {
  siteName: SITE_NAME,
  locale: "en_US",
  type: "website",
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Stellar: Free Digital SAT prep" }],
};
