import { SITE_NAME, SITE_URL } from "./site";

/** One step of the trail; `path` starts with "/". */
export interface Crumb {
  name: string;
  path: string;
}

/** BreadcrumbList JSON-LD: Stellar, then `trail`. Serialized so it can't close the script tag (render it with <JsonLd>). */
export function breadcrumbJsonLd(trail: Crumb[]): string {
  const all: Crumb[] = [{ name: SITE_NAME, path: "/" }, ...trail];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE_URL}${c.path}` })),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
