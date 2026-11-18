import { getAccess } from "@/lib/access-server";
import { NO_STORE } from "@/lib/admin";
import { getIndex } from "@/lib/bank";
import { sourceOpen } from "@/lib/sources";

// GET /api/bank/index — compact list of all live questions: [id, domain, skill, e|m|h, preview, source][]
// Per visitor (not cached): without Plus ("question-bank"), rows from locked sources keep their id, skill and
// difficulty (counts, Mistakes) but get an empty preview, so past-paper text never reaches the browser.
export async function GET() {
  const canBank = (await getAccess()).can("question-bank");
  const rows = getIndex();
  const body = canBank ? rows : rows.map((row) => (sourceOpen(row[5] ?? "cb", false) ? row : ([row[0], row[1], row[2], row[3], "", row[5]] as typeof row)));
  // X-Bank-Access: which variant this answer is (the client checks it against the plan it expected).
  return Response.json(body, { headers: { ...NO_STORE, "X-Bank-Access": canBank ? "full" : "free" } });
}
