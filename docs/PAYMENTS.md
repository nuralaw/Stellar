# Payments (Gumroad)

Stellar Plus is sold through Gumroad. Gumroad takes the money; our site learns about each sale through a webhook
(`/api/gumroad/ping`) and turns it into Plus access. Code: `src/lib/payments-server.ts`. Tables: `supabase/payments.sql`.

## Go-live checklist

1. **Create the Gumroad products.**
   - Monthly: a *Membership*, billed monthly (price in `plus-config.ts` is $9.61 for now).
   - Until test day: a one-time product. For now it is marked `comingSoon: true` in `plus-config.ts` and skipped here. To launch it later: create the one-time product, set `NEXT_PUBLIC_GUMROAD_PASS_URL` + `GUMROAD_PRODUCT_PASS`, set `pass.amountCents`, remove `comingSoon`, redeploy.
   - Note each product's page URL (like `https://stellar1600.gumroad.com/l/plus`) and its **product id**.
2. **Set the env vars**, in `.env.local` and on Vercel (see `.env.example` for what each one is):
   `NEXT_PUBLIC_GUMROAD_MONTHLY_URL`, `NEXT_PUBLIC_GUMROAD_PASS_URL`, `GUMROAD_PRODUCT_MONTHLY`, `GUMROAD_PRODUCT_PASS` (the product ids; if you also set a custom permalink, list both, comma-separated: sales read back from Gumroad's API only carry the id),
   `GUMROAD_WEBHOOK_KEY` (see below), `GUMROAD_ACCESS_TOKEN`, optionally `GUMROAD_SELLER_ID`.
   The two `_PASS` vars are only needed once the pass's `comingSoon` is removed.
   Then redeploy (the `NEXT_PUBLIC_` links are read at build time).
   Make the webhook key with `openssl rand -hex 24` (or `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`).
   Letters and digits only means the key needs no escaping in a URL. If you ever change the key, run
   `npm run gumroad:setup -- --replace` so the old registrations are deleted and recreated; without `--replace` the script lists the
   old ones and leaves them alone.
3. **Ping:** Gumroad → Settings → Advanced → Ping. URL `https://www.stellar1600.com/api/gumroad/ping`. Turn on Ping
   signing and copy the secret into `GUMROAD_PING_SECRET` (`.env.local` and Vercel). **This is the recommended setup, and the
   secret is required** to tell your own test purchases apart from real ones (Gumroad's API doesn't report that flag).
   Unsigned sales are ignored once the secret is set. A wrong secret makes the site answer 503, and Gumroad retries 3 times
   (after 1, 3 and 10 minutes, so about 15 minutes in all): if you fix the secret in that time the sale still arrives.
   Calls rejected for a bad or missing signature show as a warning in admin → Revenue.
4. **Create the tables.** Put `SUPABASE_DB_URL` in `.env.local` (Supabase → Connect → Session pooler string, with your
   database password), then `npm run db:apply -- supabase/subscriptions.sql supabase/payments.sql`.
   Or paste both files into the Supabase SQL Editor (`supabase/setup.sql` has everything in one file).
5. **Register the other events** (refunds, disputes, cancellations, ended memberships; Ping only sends sales):
   `npm run gumroad:setup`. It lists what exists, adds what's missing, and prints the Ping URL again.
6. **Make a test purchase.** Buy your own product from the Plus page while signed in. Gumroad marks it as a test,
   so you get Plus but it doesn't count as revenue. Check `payment_events` in Supabase (one row per webhook call, with a
   note saying what was done) and `purchases`. Then refund it in Gumroad and watch Plus go away.

Local testing without Gumroad: `node scripts/gumroad-ping-test.mjs` sends a fake signed sale to `localhost:3000`.

## How access works

- A purchase is matched to an account by the `uid` we put in the checkout link, else by the buyer's email. No match: the
  sale is stored (it shows as "unlinked" in admin) but nobody gets Plus.
- **Monthly:** Plus until the sale date + 1 month + 3 days of grace. Every renewal is a new sale and extends it.
- **Until test day:** Plus until the end of the chosen SAT day (`sat` in the checkout link). Only an official date that is
  in the future and at most `passMaxDays` (200, in `plus-config.ts`) after the purchase counts, because the link can be edited
  by the buyer. Otherwise it's 120 days from the sale.
- **Never shortened by a new sale:** an account with no end date (admin-granted forever) is left alone, otherwise the
  later of the old and new end dates wins. When a sale extends an active admin grant that has an end date, the admin end
  date is first saved as a hidden "admin floor" (a purchase row `admin:<user id>`, provider `admin`, never counted in revenue),
  and the subscription becomes a Gumroad one. If the sale is later refunded, Plus falls back to the admin end date, not to nothing.
  Setting or removing Plus by hand in admin deletes that floor.
- **Refund or chargeback:** the purchase is marked, then Plus is recomputed from the account's other valid purchases
  (the latest end date, counting any admin floor). If none remain, Plus is removed. Only Plus that came from Gumroad is touched,
  never an untouched admin grant. Refunds and disputes are re-checked with Gumroad's API before we act, because those events aren't signed.
  If a refund arrives before its sale, a stub of the sale is stored from Gumroad's data so the sale can't grant Plus later.
- **Membership ended** (cancelled and run out, or failed payments): Gumroad's API is asked for the membership. If its status is
  cancelled, failed payment or fixed period ended, purchases of that membership made on or before the end date are cut at that
  date (its ended, failed or cancelled date), then Plus is recomputed the same way. Any other status (such as "pending
  cancellation", which ends in the future) is only logged.
- **Cancelled but not ended:** nothing happens. Plus runs to the end of what was paid.
- **Unknown product** (not in `GUMROAD_PRODUCT_*`): stored, no change to access.
- **Unsigned sales** are never trusted: with a Ping secret set they are ignored. Without the secret but with an API token,
  every field is taken from Gumroad's API (not the request) and the account is found by the verified email only.
- Repeated or retried pings do the same thing once (a sale is stored by its Gumroad sale id). Gumroad's "Send test ping" resends
  your latest real sale flagged as a test: it changes nothing here.
- Revenue figures exclude test purchases, refunds and disputes. Gross = price, net = price minus Gumroad's fee.

## Bug-report discounts

A student whose bug report is confirmed gets a personal "first month of Monthly" discount of `PLUS.bugDiscountPercent` (50%).

**One-time Gumroad setup.** Gumroad's API can't make a code that only applies to the first billing period, so create ONE shared code by hand:
Monthly product → Discounts → new code. 50% (must match `bugDiscountPercent` in `plus-config.ts`), Monthly product only,
"first billing period only" turned on, no use limit. Put its name in `GUMROAD_BUG_CODE` (server env var, on Vercel too) and redeploy.
Run `supabase/discounts.sql` once (it is also in `setup.sql`). Without `GUMROAD_BUG_CODE`, grants are still recorded but nothing is applied
(admin shows "Set GUMROAD_BUG_CODE to apply discounts").

**How it works.**
- **Grant:** in admin → Support requests, "Real bug" gives the reporter's account a row in `discounts` (only if they were signed in when they
  reported; otherwise admin says to use Accounts). In admin → Accounts, "50% off 1st month" gives one by hand. One open discount per account, no stacking,
  and one support request earns at most one.
- **Auto-apply:** `/api/access` returns the signed-in student's open discount and the code. `/plus` then shows the first-month price
  (961 cents at 50% is $4.80: Gumroad takes off `round(price * percent / 100)`) and puts the code into the Monthly checkout link
  (`.../l/<product>/<CODE>`). Only Monthly gets it.
- **Mark used:** when the Monthly sale arrives (the first payment, not a renewal) with that offer code, the student's open discount is
  closed (`used_at`, `sale_id`). A repeated ping changes nothing. The sale's note in `payment_events` says "bug discount used".
- **Revoke:** un-ticking "Real bug" takes back an unused discount; "Discount open · Remove" in Accounts does the same. A used one stays used.

**Caveat: the code is shared.** Anyone who copies it from a checkout URL can type it again. Such sales show up as "bug code used without an open discount"
in `payment_events`. The fix is a new code in Gumroad plus a new `GUMROAD_BUG_CODE` value (and a redeploy).

