import type { User } from "@supabase/supabase-js";
import { currentUser } from "@/lib/admin";
import { BadRequest, checkUser } from "@/lib/competition-server";
import { StoreUnavailable } from "@/lib/competition-store";

/** Who is playing: the signed-in account (checked with Supabase), else the guest's anonymous browser id from the body. */
export interface Participant {
  userId: string;
  user: User | null;
}

/** Signed in → the account id (any userId in the body is ignored); guest → body.userId (an anonymous UUID). */
export async function participant(guestId: unknown): Promise<Participant> {
  const user = await currentUser();
  return { user, userId: checkUser(user ? user.id : guestId) };
}

/** The browser's anonymous id, when it's a valid one (for claiming guest rounds after sign-in). */
export function anonIdOf(v: unknown): string | null {
  try {
    return v == null ? null : checkUser(v);
  } catch {
    return null;
  }
}

/** Runs a POST action with a JSON body and the caller's identity, mapping known errors to status codes. */
export async function handle(request: Request, run: (body: Record<string, unknown>, now: number, who: Participant) => Promise<unknown>) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const who = await participant(body.userId);
    return Response.json(await run(body, Date.now(), who), { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    if (e instanceof BadRequest) return Response.json({ error: e.message }, { status: 400 });
    if (e instanceof StoreUnavailable) return Response.json({ error: "The leaderboard database isn't set up yet." }, { status: 503 });
    throw e;
  }
}
