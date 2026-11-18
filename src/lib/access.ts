import { useEffect, useMemo, useSyncExternalStore } from "react";
import { setAdminFlag, useAdminFlag } from "./admin-flag";
import { getAuth, onAuthChange, useAuth } from "./auth-client";
import { accessFor, type Access, type BugDiscount, type Plan } from "./access-core";

// Client side of access: the visitor's plan for showing/hiding UI. Shared types and planCan live in ./access-core.
export * from "./access-core";

// --- client: the visitor's plan, fetched once per page load from /api/access (signed-in visitors only) ---

interface Remote {
  userId: string;
  plan: Plan;
  expiresAt: string | null;
  discount: BugDiscount | null;
  /** The request failed (network / server error): `plan` is only a "free" placeholder, not a real answer. */
  failed?: boolean;
}

let remote: Remote | null = null;
let inflight: Promise<void> | null = null;
/** The user id the inflight request was made for (it's only reused for that same user). */
let inflightFor: string | null = null;
/** Counts requests; only the newest one may store its answer. */
let reqSeq = 0;
/** The user id whose failed answer already got its one retry. */
let retriedFor: string | null = null;
let watching = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function fetchAccess(userId: string): Promise<void> {
  const seq = ++reqSeq;
  inflightFor = userId;
  const request = (inflight = fetch("/api/access", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<{ plan?: Plan; expiresAt?: string | null; discount?: BugDiscount | null }>) : null))
    .catch(() => null)
    .then((d) => {
      // Signed out, switched account, or a newer request was started while this one ran: drop the answer.
      if (getAuth().user?.id !== userId || seq !== reqSeq) return;
      const plan: Plan = d?.plan === "plus" || d?.plan === "admin" ? d.plan : "free";
      const dc = d?.discount;
      const discount = dc && typeof dc.percent === "number" && typeof dc.code === "string" ? { percent: dc.percent, code: dc.code } : null;
      remote = { userId, plan, expiresAt: d?.expiresAt ?? null, discount, ...(d ? {} : { failed: true }) };
      emit();
      if (d) {
        retriedFor = null;
      } else if (retriedFor !== userId) {
        // Failed answer: try once more shortly.
        retriedFor = userId;
        setTimeout(() => {
          if (getAuth().user?.id === userId && remote?.failed) void refreshAccess();
        }, 5000);
      }
    })
    .finally(() => {
      // Only the newest request clears the slot (an older one finishing late must not).
      if (inflight === request) inflight = null;
    }));
  return request;
}

/** Asks the server for the signed-in visitor's plan again (call after something may have changed it). Always starts a fresh request. */
export function refreshAccess(): Promise<void> {
  const userId = getAuth().user?.id;
  if (!userId) {
    if (remote) {
      remote = null;
      emit();
    }
    return Promise.resolve();
  }
  return fetchAccess(userId);
}

/** Fetch on first use and on every sign-in / sign-out. */
function watch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  let prevId: string | null = null;
  onAuthChange((user) => {
    // Signed out, or another account took over: the "this browser is an admin's" flag no longer applies.
    if (prevId && user?.id !== prevId) setAdminFlag(false);
    prevId = user?.id ?? null;
    remote = null;
    retriedFor = null;
    emit();
    if (user) void (inflight && inflightFor === user.id ? inflight : fetchAccess(user.id));
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Client hook (call from Client Components). `ready` is false until the plan is known. */
export function useAccess(): Access {
  const admin = useAdminFlag();
  const auth = useAuth();
  const known = useSyncExternalStore(subscribe, () => remote, () => null);
  useEffect(watch, []);

  const userId = auth.user?.id;
  const mine = known && known.userId === userId ? known : null;
  // The admin flag is only a fast path: once the server has answered (or we know nobody is signed in), that wins.
  // A failed answer is no answer: the flag stays.
  const isAdmin = admin && (userId ? !mine || mine.failed || mine.plan === "admin" : !auth.ready);
  const plan: Plan = isAdmin ? "admin" : (mine?.plan ?? "free");
  const expiresAt = isAdmin ? null : (mine?.expiresAt ?? null);
  const ready = isAdmin || (auth.ready && (!userId || Boolean(mine)));
  const dPercent = isAdmin ? null : (mine?.discount?.percent ?? null);
  const dCode = isAdmin ? null : (mine?.discount?.code ?? null);
  return useMemo(() => accessFor(plan, expiresAt, ready, dPercent !== null && dCode ? { percent: dPercent, code: dCode } : null), [plan, expiresAt, ready, dPercent, dCode]);
}
