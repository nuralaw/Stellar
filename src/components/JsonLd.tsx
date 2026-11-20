/**
 * Structured data as a <script type="application/ld+json"> (see the Next.js JSON-LD guide). It is a data block, not
 * executable code, so a plain script tag is right. `json` must already be serialized with "<" escaped.
 */
export function JsonLd({ json }: { json: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
