import "server-only";
import { NO_STORE, currentUser } from "./admin";
import { AdminBadRequest } from "./elo-admin-data";
import { EloInvalidIdError, EloNotFoundError, EloSetupError, EloStoreUnavailable } from "./elo-store";

// Admin side of ranked matches (docs/ELO.md stage 6) for the routes under /api/admin/ranked: the data functions live in
// elo-admin-data.ts (list / detail / flags, void, reset, log); this file adds the admin's identity and the error responses.
export * from "./elo-admin-data";

/** The signed-in admin's email, for the log. */
export async function adminEmail(): Promise<string> {
  return (await currentUser())?.email ?? "";
}

/** Runs a handler body and turns the known errors into JSON responses (anything else is rethrown). */
export async function adminRun(work: () => Promise<unknown>): Promise<Response> {
  try {
    return Response.json(await work(), { headers: NO_STORE });
  } catch (e) {
    const fail = (status: number) => Response.json({ error: e instanceof Error ? e.message : "Error" }, { status, headers: NO_STORE });
    if (e instanceof AdminBadRequest || e instanceof EloInvalidIdError) return fail(400);
    if (e instanceof EloNotFoundError) return fail(404);
    if (e instanceof EloSetupError || e instanceof EloStoreUnavailable) return fail(503);
    throw e;
  }
}
