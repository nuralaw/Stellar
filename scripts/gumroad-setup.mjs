// Registers Gumroad "resource subscriptions" so refunds, disputes, cancellations and ended memberships reach the webhook.
//
//   npm run gumroad:setup [-- https://www.stellar1600.com] [--replace]
//
// Reads GUMROAD_ACCESS_TOKEN and GUMROAD_WEBHOOK_KEY from .env.local. Lists what's already registered, adds what's missing,
// and prints what it did (the key is masked). If an event already has a subscription for our endpoint with a DIFFERENT key (an
// old key or site), it's listed and left alone unless you pass --replace, which deletes it and registers the current one. Sales arrive through the seller's own Ping (Settings -> Advanced -> Ping), not here.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const API = "https://api.gumroad.com/v2/resource_subscriptions";
const NAMES = ["refund", "dispute", "dispute_won", "cancellation", "subscription_ended", "subscription_restarted"];

function readEnvLocal() {
  const out = {};
  let text = "";
  try {
    text = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  } catch {
    return out;
  }
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, "");
    out[m[1]] = v;
  }
  return out;
}

const env = { ...readEnvLocal(), ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith("GUMROAD_"))) };
const token = env.GUMROAD_ACCESS_TOKEN;
const key = env.GUMROAD_WEBHOOK_KEY;
const argv = process.argv.slice(2);
const replace = argv.includes("--replace");
const site = (argv.find((a) => !a.startsWith("--")) || "https://www.stellar1600.com").replace(/\/+$/, "");

if (!token || !key) {
  console.error(`Missing ${[!token && "GUMROAD_ACCESS_TOKEN", !key && "GUMROAD_WEBHOOK_KEY"].filter(Boolean).join(" and ")} in .env.local.
  GUMROAD_ACCESS_TOKEN: Gumroad -> Settings -> Advanced -> Applications -> create an application -> "Generate access token".
  GUMROAD_WEBHOOK_KEY:  any long random string you make up (e.g. 32+ random characters). Put the same value on Vercel.`);
  process.exit(1);
}

const mask = (k) => (k.length <= 6 ? "***" : `${k.slice(0, 2)}***${k.slice(-2)}`);
const postUrl = `${site}/api/gumroad/ping?key=${encodeURIComponent(key)}`;
const shown = `${site}/api/gumroad/ping?key=${mask(key)}`;

async function register(name) {
  const res = await fetch(API, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // Sent in the body, not the query string, so the token isn't in any URL.
    body: new URLSearchParams({ access_token: token, resource_name: name, post_url: postUrl }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(`HTTP ${res.status}${json?.message ? `: ${json.message}` : ""}`);
}

async function remove(id) {
  const res = await fetch(`${API}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ access_token: token }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(`delete failed (HTTP ${res.status}${json?.message ? `: ${json.message}` : ""})`);
}

/** A subscription's post_url with the key masked, for printing. */
function maskUrl(u) {
  try {
    const url = new URL(u);
    if (url.searchParams.has("key")) url.searchParams.set("key", mask(url.searchParams.get("key")));
    return url.toString();
  } catch {
    return "(unreadable URL)";
  }
}

async function list(name) {
  const res = await fetch(`${API}?${new URLSearchParams({ access_token: token, resource_name: name })}`);
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(`listing ${name} failed (HTTP ${res.status}${json?.message ? `: ${json.message}` : ""})`);
  return Array.isArray(json?.resource_subscriptions) ? json.resource_subscriptions : [];
}

console.log(`Site: ${site}\nPost URL: ${shown}\n`);
let problems = 0;
for (const name of NAMES) {
  try {
    const existing = await list(name);
    if (existing.some((s) => s.post_url === postUrl)) {
      console.log(`${name}: already registered`);
      continue;
    }
    const stale = existing.filter((s) => typeof s.post_url === "string" && s.post_url.includes("/api/gumroad/ping"));
    if (stale.length && !replace) {
      problems++;
      console.error(`${name}: NOT registered. Already registered with a different key or site:`);
      for (const s of stale) console.error(`    ${maskUrl(s.post_url)}`);
      console.error("    Re-run with --replace to delete these and register the current key.");
      continue;
    }
    for (const s of stale) {
      if (!s.id) throw new Error("an old subscription has no id to delete");
      await remove(s.id);
    }
    await register(name);
    console.log(`${name}: registered${stale.length ? ` (replaced ${stale.length} old one${stale.length > 1 ? "s" : ""})` : ""}`);
  } catch (e) {
    problems++;
    console.error(`${name}: FAILED ${e.message}`);
  }
}

console.log(`
Next, in Gumroad -> Settings -> Advanced:
  Ping URL:  ${site}/api/gumroad/ping
  Turn on Ping signing and copy the secret into GUMROAD_PING_SECRET (.env.local and Vercel).
  (The Ping URL needs no key: it's verified by its signature.)`);
process.exit(problems ? 1 : 0);
