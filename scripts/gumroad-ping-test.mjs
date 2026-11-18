// Sends a fake, signed Gumroad sale ping to a LOCAL dev server, to test the webhook without Gumroad.
//
//   npm run dev                                   (in another terminal)
//   node scripts/gumroad-ping-test.mjs [options]
//
// Options:
//   --secret=<s>     signing secret (default: GUMROAD_PING_SECRET from .env.local)
//   --url=<url>      default http://localhost:3000/api/gumroad/ping (anything but localhost needs --allow-remote)
//   --uid=<uuid>     url_params[uid] (an existing user id)       --email=<e>   buyer email
//   --sat=YYYY-MM-DD url_params[sat] for the pass                 --product=<id> product_id (match GUMROAD_PRODUCT_*)
//   --price=<cents>  default 999                                  --sale-id=<id> reuse an id to test idempotency
//   --bad-signature  send a wrong signature (expect 401)         --test=false   don't mark it as a test purchase
//   --allow-remote   permit a non-localhost URL (never against production)
// Prints the HTTP status only. Check the result in the payment_events table.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const m = /^--([^=]+)(?:=(.*))?$/.exec(a); return m ? [m[1], m[2] ?? true] : [a, true]; }));

function readEnvLocal() {
  const out = {};
  try {
    for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").split(/\r?\n/)) {
      const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
      if (m) out[m[1]] = m[2].replace(/^(["'])(.*)\1$/, "$2");
    }
  } catch {}
  return out;
}

const url = args.url || "http://localhost:3000/api/gumroad/ping";
const host = new URL(url).hostname;
if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(host) && !args["allow-remote"]) {
  console.error("Refusing to send to a non-local URL. This script is for local testing (add --allow-remote only if you really mean it).");
  process.exit(1);
}
const secret = args.secret || process.env.GUMROAD_PING_SECRET || readEnvLocal().GUMROAD_PING_SECRET;
if (!secret) {
  console.error("No signing secret: put GUMROAD_PING_SECRET in .env.local or pass --secret=<value>.");
  process.exit(1);
}

const saleId = args["sale-id"] || `test_${crypto.randomBytes(6).toString("hex")}`;
const fields = {
  seller_id: "test_seller",
  product_id: args.product || "test_product",
  product_name: "Stellar Plus (test)",
  permalink: "plus",
  product_permalink: "https://example.gumroad.com/l/plus",
  email: args.email || "buyer@example.com",
  price: String(args.price || 999),
  gumroad_fee: "150",
  currency: "usd",
  quantity: "1",
  sale_id: saleId,
  sale_timestamp: new Date().toISOString(),
  resource_name: "sale",
  test: args.test === "false" ? "false" : "true",
  refunded: "false",
  "card[visual]": "**** **** **** 4242",
};
if (args.uid) fields["url_params[uid]"] = args.uid;
if (args.sat) fields["url_params[sat]"] = args.sat;

const body = new URLSearchParams(fields).toString();
const t = Math.floor(Date.now() / 1000);
const sig = crypto.createHmac("sha256", args["bad-signature"] ? `${secret}-wrong` : secret).update(`${t}.${body}`).digest("hex");

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Gumroad-Signature": `t=${t},v1=${sig}` },
    body,
  });
  console.log(`POST ${new URL(url).pathname} (sale_id ${saleId}${args["bad-signature"] ? ", bad signature" : ""}) -> HTTP ${res.status} ${await res.text()}`);
} catch (e) {
  console.error(`Couldn't reach ${url}: is the dev server running? (${e.cause?.code ?? e.message})`);
  process.exit(1);
}
