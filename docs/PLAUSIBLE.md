# Turning on Plausible

Checklist for the day Stellar moves to stellar1600.com. Until then nothing below is needed: with the
Plausible env vars empty there is no script, no requests, and /admin → Traffic shows only our own counter.

Prices checked November 2026. Confirm them on the linked pages before paying.

## 1. Domain

1. Vercel dashboard → the Stellar project → **Settings → Domains → Buy** `stellar1600.com`
   (or `vercel domains buy stellar1600.com`). Bought in Vercel, it's added to the project and DNS is set up for you.
2. Make `stellar1600.com` the primary domain (the `*.vercel.app` URL keeps working).
3. Supabase → Authentication → URL Configuration: set the Site URL to `https://stellar1600.com` and add it to the
   Redirect URLs, or sign-in links and Google sign-in will still point at the old URL.

## 2. Vercel Pro

4. Vercel → Settings → Billing → upgrade the team to **Pro** ($20 per seat per month, $20 of usage included).
   Hobby is for non-commercial use only. See https://vercel.com/pricing.

## 3. Plausible account and site

5. Sign up at https://plausible.io (30-day free trial with every Business feature, no card needed).
6. Choose the **Business** plan when the trial ends: $19/month at up to 10k pageviews a month
   (Starter $9 and Growth $14 **don't** include the Stats API, so the admin Traffic tab couldn't read them).
   Paying yearly gives 2 months free. Sources: https://plausible.io/#pricing, https://plausible.io/docs/subscription-plans.
7. Add the site with domain `stellar1600.com`.
8. Site settings → General → set **Reporting time zone** to the one you use (e.g. `Asia/Almaty`).
   Plausible draws its charts in this zone. If it differs from your browser's, the admin chart's days are
   shifted (totals stay exact) and the response carries an `X-Traffic-Note` header saying so.
9. Site settings → General → Site installation → **Review**. Copy the script URL from the snippet.
   It looks like `https://plausible.io/js/pa-XXXXXXXX.js`. You only need that URL, not the whole snippet:
   our `PlausibleScript` component writes the snippet for you and serves the script from our own domain.

## 4. Stats API key

10. Plausible → click your account name → Settings → **API Keys → New API Key → Stats API**.
    Copy it right away: it's shown only once. (Needs the Business plan or the trial. Limit: 600 requests per hour;
    the admin Traffic tab uses 6 per load.) Docs: https://plausible.io/docs/stats-api.

## 5. Env vars in Vercel

11. Run these in the project folder, once per variable (Git Bash). Set `VALUE` first, e.g. `VALUE='stellar1600.com'`.
    The `NEXT_PUBLIC_` ones are read at build time and must be `config` type; the API key stays a secret.

    | Variable | Value | Command |
    | --- | --- | --- |
    | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `stellar1600.com` | `printf '%s' "$VALUE" \| vercel env add NEXT_PUBLIC_PLAUSIBLE_DOMAIN --environment production --type config --yes` |
    | `NEXT_PUBLIC_PLAUSIBLE_SCRIPT` | the `pa-…js` URL from step 9 | `printf '%s' "$VALUE" \| vercel env add NEXT_PUBLIC_PLAUSIBLE_SCRIPT --environment production --type config --yes` |
    | `PLAUSIBLE_API_KEY` | the key from step 10 | `printf '%s' "$VALUE" \| vercel env add PLAUSIBLE_API_KEY --environment production --yes` |
    | `PLAUSIBLE_SITE_ID` | `stellar1600.com` | `printf '%s' "$VALUE" \| vercel env add PLAUSIBLE_SITE_ID --environment production --yes` |
    | `PLAUSIBLE_HOST` (optional) | only for a self-hosted Plausible; default `https://plausible.io` | `printf '%s' "$VALUE" \| vercel env add PLAUSIBLE_HOST --environment production --yes` |

    `PLAUSIBLE_SITE_ID` may be left out: it falls back to `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
    To change a value later, add `--force`. Don't put these in `.env.local` unless you want localhost to query Plausible
    (localhost visits are never counted anyway).

## 6. Goals for our custom events

12. Plausible → Site settings → **Goals → Add goal → Custom event**, one for each name below, spelled exactly
    (they come from `src/lib/analytics.ts`):
    `Sign up`, `Sign in`, `Practice session`, `Test finished`, `Lesson finished`, `Competition round`,
    `Support request`, `Question report`.

## 7. Redeploy and check

13. Redeploy production (Vercel → Deployments → ⋯ → Redeploy, or push to `main`). Needed because the
    `NEXT_PUBLIC_` vars and the script proxy are baked in at build time.
14. Open https://stellar1600.com in a private window (signed out: admin browsers aren't counted), then check
    Plausible's dashboard: the **current visitors** count (realtime) should show you within a few seconds.
    Do one tracked action (e.g. finish a practice session) and see it under Goals.
15. /admin → Traffic: a **Stellar counter | Plausible** switch appears. Pick Plausible and check the numbers match
    Plausible's dashboard for the same period. If it shows an error, it says which part is wrong
    (bad key = 401, plan without the Stats API = 402, rate limit = 429).

## Privacy

Plausible sets no cookies and stores no personal data or full IP addresses, so no cookie/consent banner is needed
for it (https://plausible.io/data-policy). The privacy policy page should still name Plausible as the analytics tool.

## Why our own counter keeps running

The Supabase counter (/api/track → /admin → Traffic, "Stellar counter") stays on alongside Plausible:
it holds all the history from before Plausible was turned on, costs nothing extra, and keeps working if the
Plausible subscription ever lapses. It stays the default source of the Traffic tab; Plausible is the second option.
