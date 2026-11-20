import type { NextConfig } from "next";
import { PLAUSIBLE_EVENT_PATH, PLAUSIBLE_SCRIPT_PATH } from "./src/lib/analytics";

/** Plausible (optional): proxy its script and event API through our own domain so ad blockers don't drop them.
 *  Only while NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set; see src/components/analytics/PlausibleScript.tsx. */
function plausibleRewrites() {
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim()) return [];
  const host = (process.env.PLAUSIBLE_HOST?.trim() || "https://plausible.io").replace(/\/+$/, "");
  const script = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT?.trim() || `${host}/js/script.js`;
  return [
    { source: PLAUSIBLE_SCRIPT_PATH, destination: script },
    { source: PLAUSIBLE_EVENT_PATH, destination: `${host}/api/event` },
  ];
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The question bank is read from disk at runtime (src/lib/bank.ts); make sure it ships with the functions.
  outputFileTracingIncludes: {
    "/api/questions": ["./content/bank/dist/**"],
    "/api/bank/index": ["./content/bank/dist/**"],
    "/lessons/*": ["./content/lessons/**", "./content/bank/dist/**"],
    "/test/*": ["./content/tests/dist/**"],
    // Ranked matches serve question images through a match-scoped route (src/app/api/ranked/[id]/img) that reads public/ from disk;
    // on Vercel public/ is a CDN folder and isn't part of the function unless it is traced in here.
    "/api/ranked/*/img": ["./public/bank/img/**", "./public/tests/img/**"],
  },
  partialPrefetching: true,
  async rewrites() {
    return [...plausibleRewrites()];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
