import "server-only";

// Calls a Postgres function from supabase/account_stats.sql with the service-role key (shared by the stats and search routes).

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function rpc(name: string, args: Record<string, unknown>) {
  const res = await fetch(`${SB_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    const search = name === "admin_account_search";
    if (body.includes("PGRST202")) {
      throw new Error(`The account ${search ? "search" : "statistics"} isn't set up yet: run supabase/account_stats.sql in the Supabase SQL Editor.`);
    }
    if (search && body.includes("42P01")) throw new Error("The account search needs the student data table: run supabase/user_data.sql in the Supabase SQL Editor.");
    console.error(`[admin/accounts] ${name}: ${res.status} ${body.slice(0, 300)}`);
    throw new Error(search ? "Couldn't search the accounts." : "Couldn't load the account statistics.");
  }
  return res.json();
}
