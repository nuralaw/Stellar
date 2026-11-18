// Runs SQL files against the Supabase database, in the order given (each file in one query).
//
//   npm run db:apply -- supabase/subscriptions.sql supabase/payments.sql
//
// Needs SUPABASE_DB_URL in .env.local (the connection string, with the database password). Prints file names and
// OK / error messages only, never the URL. The alternative is pasting the file into the Supabase SQL Editor.

import fs from "node:fs";
import path from "node:path";
import pg from "pg";

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

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: npm run db:apply -- <file.sql> [more.sql ...]\nExample: npm run db:apply -- supabase/subscriptions.sql supabase/payments.sql");
  process.exit(1);
}

const url = process.env.SUPABASE_DB_URL || readEnvLocal().SUPABASE_DB_URL;
if (!url) {
  console.error(`SUPABASE_DB_URL isn't set. To get it:
  1. Supabase dashboard -> your project -> Connect (top bar).
  2. Pick "Session pooler" and copy the connection string (postgresql://postgres.<ref>:[YOUR-PASSWORD]@...:5432/postgres).
  3. Put your database password in place of [YOUR-PASSWORD] (Project Settings -> Database -> Reset database password if you don't have it).
  4. Add it to .env.local as:  SUPABASE_DB_URL=postgresql://...
Or skip all this: paste the SQL file into Supabase -> SQL Editor -> Run.`);
  process.exit(1);
}

const sqls = [];
for (const f of files) {
  const full = path.resolve(process.cwd(), f);
  if (!fs.existsSync(full)) {
    console.error(`${f}: file not found`);
    process.exit(1);
  }
  sqls.push([f, fs.readFileSync(full, "utf8")]);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
try {
  await client.connect();
} catch (e) {
  // Don't print e.message: it can include the host. The code is enough to tell what went wrong.
  console.error(`Couldn't connect to the database (${e.code ?? "error"}). Check SUPABASE_DB_URL: the password, and that it's the Session pooler string.`);
  process.exit(1);
}

let failed = false;
for (const [name, sql] of sqls) {
  try {
    await client.query(sql);
    console.log(`${name}: OK`);
  } catch (e) {
    failed = true;
    const pos = e.position ? ` (at character ${e.position})` : "";
    console.error(`${name}: ERROR ${e.message}${pos}${e.hint ? `\n  hint: ${e.hint}` : ""}`);
    break; // later files may depend on this one
  }
}
await client.end().catch(() => {});
process.exit(failed ? 1 : 0);
