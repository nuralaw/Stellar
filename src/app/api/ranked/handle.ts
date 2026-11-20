import { unstable_rethrow } from "next/navigation";
import { NO_STORE, currentUser } from "@/lib/admin";
import { BadRequest, checkUser } from "@/lib/competition-server";
import { RankedError, translateError } from "@/lib/elo-server";
import { authConfigured } from "@/lib/supabase/server";

// Shared by every /api/ranked route: who is calling, the JSON body, and the error -> { error, code } mapping of docs/ELO.md 8.4.

/**
 * Supabase on: a signed-in account with a confirmed email (401 auth / 403 verify). Supabase off (local development): the browser's
 * anonymous id (`userId` in the query or the body), the same as the weekly tournament uses, so the feature can be tried locally.
 */
export async function rankedUser(guestId: unknown): Promise<string> {
  if (authConfigured) {
    const user = await currentUser();
    if (!user) throw new RankedError(401, "auth", "Sign in to play ranked matches.");
    if (!user.email_confirmed_at) throw new RankedError(403, "verify", "Confirm your email to play ranked matches.");
    return user.id.toLowerCase();
  }
  if (guestId == null) throw new RankedError(401, "auth", "Missing user id.");
  return checkUser(guestId);
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (!text.trim()) return {};
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new RankedError(400, "bad_request", "Invalid JSON");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new RankedError(400, "bad_request", "Invalid JSON");
  return body as Record<string, unknown>;
}

export interface RankedCall {
  userId: string;
  body: Record<string, unknown>;
  now: number;
}

/**
 * The `{ error, code }` response of a failure. Known errors keep their status and code; anything unexpected is logged and answered
 * as 500 with code "setup" (the contract has no "unavailable" code; "setup" is the least misleading: not the caller's fault).
 */
export function errorResponse(e: unknown): Response {
  // Next's own control-flow errors (dynamic-rendering bail-out on request.url, redirect, notFound) must reach the framework.
  unstable_rethrow(e);
  const err = e instanceof BadRequest ? new RankedError(400, "bad_request", e.message) : translateError(e);
  if (err instanceof RankedError) return Response.json({ error: err.message, code: err.code }, { status: err.status, headers: NO_STORE });
  console.error("[ranked]", err);
  return Response.json({ error: "Ranked matches are unavailable right now.", code: "setup" }, { status: 500, headers: NO_STORE });
}

/** Runs a ranked action for the caller. `hasBody`: POST routes read a JSON body (it may be empty). */
export async function handle(request: Request, hasBody: boolean, run: (call: RankedCall) => Promise<unknown>): Promise<Response> {
  try {
    const body = hasBody ? await readBody(request) : {};
    const guest = new URL(request.url).searchParams.get("userId") ?? body.userId;
    const userId = await rankedUser(guest);
    return Response.json(await run({ userId, body, now: Date.now() }), { headers: NO_STORE });
  } catch (e) {
    return errorResponse(e);
  }
}
