# SEO

## What is indexed, and why

Only pages a signed-out visitor can open:

- `/` is the public landing page (`src/components/landing/dusk/DuskLanding.tsx`, "Dusk to Stars"). For a signed-out visitor `src/proxy.ts` rewrites `/` to
  `app/landing` (the address stays `/`); a signed-in student gets the Dashboard. The landing page is static, so it never reads the session.
- `/plus` is Free vs Plus, with the FAQ.
- `/register` is the sign-up page. Its canonical has no query, so `/register?next=...` collapses into it.
- Three free tools, static pages that answer what people search for (all linked from both footers, see `RESOURCE_NAV` below):
  - `/sat-score-calculator`: raw score to estimated SAT score, with the conversion tables and a short FAQ.
  - `/sat-dates`: official test dates and deadlines (`src/lib/sat-dates.ts`, checked against College Board by hand, see `SAT_DATES_CHECKED`).
  - `/sat-vocabulary`, `/sat-vocabulary/advanced`, `/sat-vocabulary/math-terms`: the vocabulary lists as plain HTML (`src/lib/vocab.ts`).
  Each has a title, description, canonical and Open Graph set in its own metadata, and BreadcrumbList JSON-LD (`src/lib/breadcrumbs.ts`).

Everything else (lessons, vocabulary, practice, tests, statistics, ...) needs an account and only redirects to `/register`.
`/login`, `/auth/*` and `/admin` are `noindex`.

Do not open past papers or College Board questions to search engines: that content is not ours (third party), and it is the paid part of Stellar.
The public pages show only what we wrote ourselves: our own score estimate, the dates (facts), and our own vocabulary entries.

## Where things live

- `src/lib/site.ts`: `SITE_URL` (default `https://www.stellar1600.com`, override with `NEXT_PUBLIC_SITE_URL`) and `SITE_NAME`.
- `src/app/layout.tsx`: `metadataBase`, default title and description, Open Graph and Twitter defaults. No canonical here (it would be inherited by every page).
- `src/app/robots.ts`: `/robots.txt`. Allows `/`, disallows the gated and private paths, points to the sitemap.
- `src/app/sitemap.ts`: `/sitemap.xml`. Every entry has a hand-kept `lastModified` ("YYYY-MM-DD"). Change it only when that page's content
  really changes (a deploy or a rebuild is not a change); Google trusts the date only if it stays honest. No `priority` (Google ignores it).
- `src/lib/nav.ts`, `RESOURCE_NAV`: the public tools. Both footers (`SiteFooter.tsx`, the landing footer in `DuskLanding.tsx`) link them,
  which is how Google finds the pages. A new public page goes into this list too.
- `src/lib/breadcrumbs.ts`: BreadcrumbList JSON-LD for the public pages (rendered with `<JsonLd>`).
- `src/app/icon.png` (192x192) and `src/app/favicon.ico` (16, 32 and 48 px): the favicon, see below.
- `src/app/opengraph-image.tsx` (and `twitter-image.tsx`): the generated 1200x630 share image.
- JSON-LD (WebSite, Organization, FAQPage) is in the landing page component.

## Adding a page to the search results

1. Make it open to signed-out visitors: add it to `PUBLIC` in `src/lib/public-paths.ts`.
2. Add it to `src/app/sitemap.ts` (with a `lastModified`).
3. Remove it from the `disallow` list in `src/app/robots.ts` if it is there.
4. Give the page `alternates.canonical` and a good `title` / `description` in its metadata (`title: { absolute: ... }`, under about 60 characters, ending with "Stellar").
5. Link it from the footers (add it to `RESOURCE_NAV`); a page nobody links to is hard for Google to find.

Opening a page without steps 1 to 3 either redirects crawlers to `/register` or hides the page from them.
The page must be fully static (no session read on the server, like `/plus`); check `npx next build` lists it as prerendered.

### Trap: robots.txt rules match by prefix

`Disallow: /test` also blocks `/test-dates`, and `/practice` also blocks `/practice-tests`. So name public pages `/sat-...`
(none of the gated paths starts that way), and check `src/app/robots.ts` before choosing a new address.

## Favicon

Google shows the favicon in search results. Rules: the file is square, its size is a multiple of 48 px (`icon.png` is 192x192), the
mark is large in the canvas, and the URL stays stable (`/favicon.ico` and the `icon.png` that Next links). Both files are an opaque
white rounded-corner tile (corner radius about 22%, transparent only outside the corners) with `public/logo-mark.png` centred at about
84% of the tile height; the white star in the mark stays opaque (commit b39becd). `favicon.ico` holds 16, 32 and 48 px frames.
`/favicon.ico` has a file extension, so the proxy matcher skips it and it is served signed out. `apple-icon.png` is separate.

## After a deploy

In Google Search Console: URL Inspection, then "Request indexing" for `/` and for each new page (`/sat-score-calculator`, `/sat-dates`,
`/sat-vocabulary`, `/sat-vocabulary/advanced`, `/sat-vocabulary/math-terms`). Re-submitting `sitemap.xml` is optional.

## Google Search Console

Property: `https://www.stellar1600.com/` (URL prefix), verified with the HTML file `public/google95eef4b7889e1800.html`.
Keep that file: deleting it un-verifies the site. Sitemap submitted there: `https://www.stellar1600.com/sitemap.xml`.
Alternative (not used now): set `GOOGLE_SITE_VERIFICATION` (the token from the "HTML tag" method) in the environment and
redeploy; the layout then adds the `google-site-verification` meta tag. Unset, nothing is added.
