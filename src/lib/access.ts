import { useAdminFlag } from "./admin-flag";

// Who may use what. Prepares for the paid plan (not built yet): pages gate features with can(feature).
// The server is the real gate — use getAccess() from ./access-server in Route Handlers; useAccess() on the
// client is for showing/hiding UI only (it trusts the localStorage admin flag, re-checked once per session).

export type Plan = "free" | "pro" | "admin";

/**
 * Planned gated features. Today every feature is free except "competition-retry" (admin only).
 * When the subscription lands, move features into PRO_FEATURES.
 */
export type Feature = "unlimited-tests" | "all-lessons" | "competition-retry";

const FREE_FEATURES: ReadonlySet<Feature> = new Set<Feature>(["unlimited-tests", "all-lessons"]);
const PRO_FEATURES: ReadonlySet<Feature> = new Set<Feature>([...FREE_FEATURES]);

/** Whether a plan includes a feature. Admin gets everything. */
export function planCan(plan: Plan, feature: Feature): boolean {
  if (plan === "admin") return true;
  if (plan === "pro") return PRO_FEATURES.has(feature);
  return FREE_FEATURES.has(feature);
}

export interface Access {
  plan: Plan;
  isAdmin: boolean;
  can: (feature: Feature) => boolean;
}

export function accessFor(plan: Plan): Access {
  return { plan, isAdmin: plan === "admin", can: (f) => planCan(plan, f) };
}

/** Client hook (call from Client Components). Until the subscription exists, plan is "admin" or "free". */
export function useAccess(): Access {
  const admin = useAdminFlag();
  return accessFor(admin ? "admin" : "free");
}
