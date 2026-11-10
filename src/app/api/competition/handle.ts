import { BadRequest } from "@/lib/competition-server";
import { StoreUnavailable } from "@/lib/competition-store";

/** Runs a POST action with a JSON body, mapping known errors to status codes. */
export async function handle(request: Request, run: (body: Record<string, unknown>, now: number) => Promise<unknown>) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    return Response.json(await run(body, Date.now()), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof BadRequest) return Response.json({ error: e.message }, { status: 400 });
    if (e instanceof StoreUnavailable) return Response.json({ error: "The leaderboard database isn't set up yet." }, { status: 503 });
    throw e;
  }
}
