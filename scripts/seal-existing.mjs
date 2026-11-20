// Encrypts the personal data that was stored in the clear before the admin-only encryption (supabase/sealed.sql) existed.
//
//   npm run data:seal -- --dry-run     only prints how many rows would change
//   npm run data:seal                  same as --dry-run, and says how to proceed
//   npm run data:seal -- --yes         seals them (safe to re-run: only rows with `sealed is null` and plaintext are touched)
//
// Needs SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and ADMIN_SEAL_PUBLIC_KEY (the public key from /admin -> Security), from the
// environment or .env.local. Run supabase/sealed.sql first. Prints the target host, the seal key's fingerprint and the row counts
// (compare the fingerprint with the one shown in /admin -> Security); never the keys or any personal data.
// Refuses when ADMIN_SEAL_PUBLIC_KEY is also listed in ADMIN_DEVICE_KEYS, or ADMIN_DEVICE_KEYS has no valid key (a device key pasted into the wrong variable).
//
//  - support_requests: contacts + message -> `sealed`, plain columns cleared. With a screenshot, the order is crash-safe:
//    download -> seal -> upload `<name>.enc` -> PATCH the row (sealed, screenshot = new name) -> delete the old object.
//    A crash before the PATCH leaves the old row and file untouched (the re-run redoes it); a crash after it leaves only an orphan
//    plaintext file, which the final sweep deletes (a plaintext file whose `.enc` twin exists).
//  - question_reports: {note, telegram, instagram} -> `sealed`, those columns set to ''.
//  - purchases: {email, raw} -> `sealed`, both columns set to null. payment_events: a non-empty payload -> `sealed`, payload null.
// The sealing code is src/lib/seal-format.ts itself (Node 22.18+ runs .ts files directly), so the format is identical to the site's.

import fs from "node:fs";
import path from "node:path";
import { deviceKeyId, importSealPublic, sealBytes, sealJson } from "../src/lib/seal-format.ts";

const ROOT = path.resolve(import.meta.dirname, "..");

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

const local = readEnvLocal();
const env = (name) => (process.env[name] || local[name] || "").trim();
const DRY_FLAG = process.argv.includes("--dry-run");
const YES = process.argv.includes("--yes");
/** Counting pass (true) or real writes (false). A real run needs --yes. */
let dry = true;
const BASE = env("SUPABASE_URL").replace(/\/$/, "");
const KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const PUB = env("ADMIN_SEAL_PUBLIC_KEY");
const missing = [!BASE && "SUPABASE_URL", !KEY && "SUPABASE_SERVICE_ROLE_KEY", !PUB && "ADMIN_SEAL_PUBLIC_KEY"].filter(Boolean);
if (missing.length) {
  console.error(`Missing ${missing.join(", ")} (environment or .env.local).`);
  process.exit(1);
}

const DEVICE_KEYS = env("ADMIN_DEVICE_KEYS").split(",").map((k) => k.trim()).filter(Boolean);
if (!DEVICE_KEYS.some((k) => /^[A-Za-z0-9_-]{100,}$/.test(k))) {
  console.error("ADMIN_DEVICE_KEYS has no valid key. Set up the device key first (/admin -> Security), then the decryption key: otherwise the device key may have been pasted into ADMIN_SEAL_PUBLIC_KEY.\nThe site refuses new support requests and reports in that state too.");
  process.exit(1);
}
if (DEVICE_KEYS.includes(PUB)) {
  console.error("ADMIN_SEAL_PUBLIC_KEY is also listed in ADMIN_DEVICE_KEYS: that is a device key, not the decryption key. Data sealed to it could never be read.\nUse the public key from /admin -> Security -> Decryption key.");
  process.exit(1);
}
let fingerprint;
try {
  await importSealPublic(PUB);
  fingerprint = await deviceKeyId(PUB);
} catch {
  console.error("ADMIN_SEAL_PUBLIC_KEY isn't a valid P-256 public key (SPKI, base64url).");
  process.exit(1);
}
let host = "?";
try {
  host = new URL(BASE).host;
} catch {}

const AUTH = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
const BUCKET = "support-screenshots";
const PAGE = 200;

async function rest(pathAndQuery, init = {}) {
  const res = await fetch(`${BASE}/rest/v1/${pathAndQuery}`, { ...init, headers: { ...AUTH, "Content-Type": "application/json", ...init.headers } });
  if (!res.ok) {
    const body = await res.text();
    const hint = /PGRST204|42703|sealed/.test(body) ? " (did you run supabase/sealed.sql?)" : "";
    throw new Error(`${init.method ?? "GET"} ${pathAndQuery.split("?")[0]}: HTTP ${res.status}${hint}`);
  }
  return res;
}

/** Walks a table in key order, PAGE rows at a time (keyset paging, so patching rows while walking is fine). */
async function* scan(table, key, select, filter) {
  let last = null;
  for (;;) {
    const after = last === null ? "" : `&${key}=gt.${encodeURIComponent(last)}`;
    const rows = await (await rest(`${table}?select=${select}&${filter}${after}&order=${key}.asc&limit=${PAGE}`)).json();
    for (const row of rows) yield row;
    if (rows.length < PAGE) return;
    last = rows[rows.length - 1][key];
  }
}

const storage = (p, init = {}) => fetch(`${BASE}/storage/v1/${p}`, { ...init, headers: { ...AUTH, ...init.headers } });
const filled = (v) => typeof v === "string" && v !== "";
const newStats = () => ({ support: 0, screenshots: 0, reports: 0, purchases: 0, events: 0, orphans: 0, failed: 0 });
let stats = newStats();

async function sealSupport() {
  for await (const r of scan("support_requests", "id", "*", "sealed=is.null")) {
    if (![r.telegram, r.instagram, r.other, r.message].some(filled)) continue; // nothing personal to seal
    stats.support++;
    const old = typeof r.screenshot === "string" && r.screenshot ? r.screenshot : null;
    const ext = old ? /\.(jpg|png|webp)$/.exec(old)?.[1] : undefined;
    if (old && !ext && !old.endsWith(".enc")) {
      console.error(`support ${r.id}: unexpected screenshot name, skipped`);
      stats.failed++;
      continue;
    }
    const plainShot = Boolean(old && ext); // an old, unsealed file
    if (plainShot) stats.screenshots++;
    if (dry) continue;
    try {
      const sealed = await sealJson(
        { telegram: r.telegram ?? "", instagram: r.instagram ?? "", other: r.other ?? "", message: r.message ?? "", shotMime: plainShot ? MIME[ext] : undefined },
        PUB,
      );
      const patch = { sealed, telegram: "", instagram: "", other: "", message: "" };
      if (plainShot) {
        const down = await storage(`object/${BUCKET}/${old}`);
        if (!down.ok) throw new Error(`screenshot download: HTTP ${down.status}`);
        const blob = await sealBytes(new Uint8Array(await down.arrayBuffer()), PUB);
        const newName = `${old.slice(0, -ext.length - 1)}.enc`;
        const up = await storage(`object/${BUCKET}/${newName}`, { method: "POST", headers: { "Content-Type": "application/octet-stream", "x-upsert": "true" }, body: blob });
        if (!up.ok) throw new Error(`screenshot upload: HTTP ${up.status}`);
        patch.screenshot = newName;
      }
      await rest(`support_requests?id=eq.${encodeURIComponent(r.id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
      if (plainShot) {
        const del = await storage(`object/${BUCKET}/${old}`, { method: "DELETE" });
        if (!del.ok) console.error(`support ${r.id}: sealed, but the old screenshot file wasn't deleted (HTTP ${del.status}); the final sweep retries`);
      }
    } catch (e) {
      stats.failed++;
      console.error(`support ${r.id}: ${e.message}`);
    }
  }
}

async function sealReports() {
  for await (const r of scan("question_reports", "id", "id,note,telegram,instagram", "sealed=is.null")) {
    if (![r.note, r.telegram, r.instagram].some(filled)) continue;
    stats.reports++;
    if (dry) continue;
    try {
      const sealed = await sealJson({ note: r.note ?? "", telegram: r.telegram ?? "", instagram: r.instagram ?? "" }, PUB);
      await rest(`question_reports?id=eq.${r.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ sealed, note: "", telegram: "", instagram: "" }) });
    } catch (e) {
      stats.failed++;
      console.error(`report ${r.id}: ${e.message}`);
    }
  }
}

async function sealPurchases() {
  for await (const r of scan("purchases", "sale_id", "sale_id,email,raw,provider", "sealed=is.null&provider=neq.admin")) {
    if (!filled(r.email) && !(r.raw && typeof r.raw === "object" && Object.keys(r.raw).length)) continue;
    stats.purchases++;
    if (dry) continue;
    try {
      const sealed = await sealJson({ email: r.email ?? null, raw: r.raw ?? null }, PUB);
      await rest(`purchases?sale_id=eq.${encodeURIComponent(r.sale_id)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ sealed, email: null, raw: null }) });
    } catch (e) {
      stats.failed++;
      console.error(`purchase ${r.sale_id}: ${e.message}`);
    }
  }
}

async function sealEvents() {
  for await (const r of scan("payment_events", "id", "id,payload", "sealed=is.null&payload=not.is.null")) {
    if (!r.payload || typeof r.payload !== "object" || !Object.keys(r.payload).length) continue; // `{}` = rejected request, no body logged
    stats.events++;
    if (dry) continue;
    try {
      const sealed = await sealJson(r.payload, PUB);
      await rest(`payment_events?id=eq.${r.id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ sealed, payload: null }) });
    } catch (e) {
      stats.failed++;
      console.error(`payment event ${r.id}: ${e.message}`);
    }
  }
}

/** Plaintext screenshot files whose sealed `.enc` twin exists (left by a crash between the PATCH and the delete). */
async function sweepOrphans() {
  const res = await storage(`object/list/${BUCKET}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefix: "", limit: 10000, offset: 0 }) });
  if (!res.ok) return console.error(`orphan sweep skipped: listing the bucket failed (HTTP ${res.status})`);
  const names = new Set((await res.json()).map((o) => o.name));
  for (const name of names) {
    const m = /^(.+)\.(jpg|png|webp)$/.exec(name);
    if (!m || !names.has(`${m[1]}.enc`)) continue;
    stats.orphans++;
    if (dry) continue;
    const del = await storage(`object/${BUCKET}/${name}`, { method: "DELETE" });
    if (!del.ok) {
      stats.failed++;
      console.error(`orphan ${name}: delete failed (HTTP ${del.status})`);
    }
  }
}

async function pass() {
  stats = newStats();
  await sealSupport();
  await sealReports();
  await sealPurchases();
  await sealEvents();
  if (stats.failed === 0) await sweepOrphans();
  else console.error("Some rows failed, so the orphan sweep was skipped. Fix the errors above and re-run.");
}

function summary(verb) {
  return [
    `  support requests ${verb}: ${stats.support} (${stats.screenshots} with a screenshot)`,
    `  question reports ${verb}: ${stats.reports}`,
    `  purchases ${verb}: ${stats.purchases}`,
    `  payment events ${verb}: ${stats.events}`,
    `  leftover plaintext screenshots ${verb === "sealed" ? "deleted" : "to delete"}: ${stats.orphans}`,
  ].join("\n");
}

console.log(`Supabase host:        ${host}`);
console.log(`Seal key fingerprint: ${fingerprint}  (must match /admin -> Security)`);
try {
  await pass(); // counting pass: dry = true
  console.log("\nWould seal:");
  console.log(summary("to seal"));
  if (DRY_FLAG || !YES) {
    console.log(DRY_FLAG ? "\nDry run: nothing was changed." : "\nNothing was changed. Check the host and fingerprint above, then run again with --yes:  npm run data:seal -- --yes");
    process.exit(stats.failed ? 1 : 0);
  }
  dry = false;
  console.log("\nSealing...");
  await pass();
} catch (e) {
  console.error(`Stopped: ${e.message}`);
  process.exit(1);
}
console.log("\nDone:");
console.log(summary("sealed"));
console.log(`  failed: ${stats.failed}`);
process.exit(stats.failed ? 1 : 0);
