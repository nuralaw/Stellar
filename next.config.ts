import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The question bank is read from disk at runtime (src/lib/bank.ts); make sure it ships with the functions.
  outputFileTracingIncludes: {
    "/api/questions": ["./content/bank/dist/**"],
    "/api/bank/index": ["./content/bank/dist/**"],
  },
  partialPrefetching: true,
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
