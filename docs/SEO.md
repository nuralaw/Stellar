# SEO

## What is indexed, and why

Only pages a signed-out visitor can open:

- `/` is the public landing page (`src/components/landing/dusk/DuskLanding.tsx`, "Dusk to Stars"). For a signed-out visitor `src/proxy.ts` rewrites `/` to
  `app/landing` (the address stays `/`); a signed-in student gets the Dashboard. The landing page is static, so it never reads the session.
- `/plus` is Free vs Plus, with the FAQ.
- `/register` is the sign-up page. Its canonical has no query, so `/register?next=...` collapses into it.

Everything else (lessons, vocabulary, practice, tests, statistics, ...) needs an account and only redirects to `/register`.
`/login`, `/auth/*` and `/admin` are `noindex`.

## Where things live

- `src/lib/site.ts`: `SITE_URL` (default `https://www.stellar1600.com`, override with `NEXT_PUBLIC_SITE_URL`) and `SITE_NAME`.
- `src/app/layout.tsx`: `metadataBase`, default title and description, Open Graph and Twitter defaults. No canonical here (it would be inherited by every page).
- `src/app/robots.ts`: `/robots.txt`. Allows `/`, disallows the gated and private paths, points to the sitemap.
- `src/app/sitemap.ts`: `/sitemap.xml`.
- `src/app/opengraph-image.tsx` (and `twitter-image.tsx`): the generated 1200x630 share image.
- JSON-LD (WebSite, Organization, FAQPage) is in the landing page component.

## Adding a page to the search results

1. Make it open to signed-out visitors: add it to `PUBLIC` in `src/lib/public-paths.ts`.
2. Add it to `src/app/sitemap.ts`.
3. Remove it from the `disallow` list in `src/app/robots.ts` if it is there.
4. Give the page `alternates.canonical` and a good `title` / `description` in its metadata.

Opening a page without steps 1 to 3 either redirects crawlers to `/register` or hides the page from them.

## Google Search Console

Property: `https://www.stellar1600.com/` (URL prefix), verified with the HTML file `public/google95eef4b7889e1800.html`.
Keep that file: deleting it un-verifies the site. Sitemap submitted there: `https://www.stellar1600.com/sitemap.xml`.
Alternative (not used now): set `GOOGLE_SITE_VERIFICATION` (the token from the "HTML tag" method) in the environment and
redeploy; the layout then adds the `google-site-verification` meta tag. Unset, nothing is added.
