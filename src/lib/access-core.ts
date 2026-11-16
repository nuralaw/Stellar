// Plans and features, shared by server and client (no React here). Client hook: ./access; server gate: ./access-server.
// Who may use what (free / Stellar Plus / admin). Pages gate features with access.can(feature) and show
// <PlusLock> when it's false. The server is the real gate — use getAccess() from ./access-server in Route
// Handlers and Server Components; useAccess() on the client is for showing/hiding UI only.

export type Plan = "free" | "plus" | "admin";

/**
 * Gated features. Free has none of these.
 * - "all-tests": every practice test (free: the two most recent months, see ./free-tests)
 * - "lessons": all lessons
 * - "advanced-stats": advanced statistics
 * - "mistake-review": spaced review in Mistakes
 * - "competition-retry": admin only
 */
export type Feature = "all-tests" | "lessons" | "advanced-stats" | "mistake-review" | "competition-retry";

const FREE_FEATURES: ReadonlySet<Feature> = new Set<Feature>();
const PLUS_FEATURES: ReadonlySet<Feature> = new Set<Feature>(["all-tests", "lessons", "advanced-stats", "mistake-review"]);

/** Whether a plan includes a feature. Admin gets everything. */
export function planCan(plan: Plan, feature: Feature): boolean {
  if (plan === "admin") return true;
  if (plan === "plus") return PLUS_FEATURES.has(feature);
  return FREE_FEATURES.has(feature);
}

export interface Access {
  plan: Plan;
  isAdmin: boolean;
  /** ISO end date of Plus, null when it has no end (or the plan isn't Plus). */
  expiresAt: string | null;
  /** False while the plan is still being looked up (client only): show a placeholder instead of a lock. Always true on the server. */
  ready: boolean;
  can: (feature: Feature) => boolean;
}

export function accessFor(plan: Plan, expiresAt: string | null = null, ready = true): Access {
  return { plan, isAdmin: plan === "admin", expiresAt: plan === "plus" ? expiresAt : null, ready, can: (f) => planCan(plan, f) };
}
