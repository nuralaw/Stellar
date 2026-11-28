// Builds public/admission/land-110m.json (land outlines for the Admission globe) from Natural Earth 1:110m land (ne_110m_land,
// public domain, https://www.naturalearthdata.com/). Usage: node scripts/admission-land.mjs <path to ne_110m_land.geojson>
// Output: { source, polygons: [ [ [lon,lat,lon,lat,…], …rings ], … ] } with one entry per Polygon (MultiPolygons flattened),
// outer ring first, coordinates rounded to 2 decimals.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/admission-land.mjs <path to ne_110m_land.geojson>");
  process.exit(1);
}

const geo = JSON.parse(readFileSync(input, "utf8"));
const round = (n) => Math.round(n * 100) / 100;
const ring = (r) => r.flatMap(([lon, lat]) => [round(lon), round(lat)]);

const polygons = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (g.type === "Polygon") polygons.push(g.coordinates.map(ring));
  else if (g.type === "MultiPolygon") for (const p of g.coordinates) polygons.push(p.map(ring));
}

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/admission/land-110m.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ source: "Natural Earth 1:110m land (ne_110m_land), public domain, naturalearthdata.com", polygons }));
console.log(`${polygons.length} polygons -> ${out}`);
