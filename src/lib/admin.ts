import "server-only";
import type { User } from "@supabase/supabase-js";
import { checkDeviceSignature, type DeviceStatus } from "./seal-format";
import { supabaseServer } from "./supabase/server";

// Who may open the admin pages: Supabase users whose confirmed email is listed in ADMIN_EMAIL (comma-separated).
// Email + password or Google both work, as long as it's the same address.

const ADMINS = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const NO_STORE = { "Cache-Control": "no-store" };

export function isAdmin(user: User | null): boolean {
  const email = user?.email?.toLowerCase();
  return Boolean(email && user?.email_confirmed_at && ADMINS.includes(email));
}

/** The signed-in visitor, checked with Supabase Auth (a cookie alone isn't trusted). */
export async function currentUser(): Promise<User | null> {
  const sb = await supabaseServer();
  if (!sb) return null;
  const { data, error } = await sb.auth.getUser();
  return error ? null : data.user;
}

// Device keys: the admin APIs also need a signature from a key that lives (non-extractable) in the admin's browser.
// ADMIN_DEVICE_KEYS = comma-separated ECDSA P-256 public keys (SPKI base64url), added from /admin -> Security. See seal-format.ts.

export const deviceKeys = () =>
  (process.env.ADMIN_DEVICE_KEYS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** How the request's device signature checks out (ts, method, path and query are all signed). */
export function deviceStatus(request: Request): Promise<DeviceStatus> {
  const url = new URL(request.url);
  return checkDeviceSignature({
    method: request.method,
    pathAndQuery: url.pathname + url.search,
    header: (name) => request.headers.get(name),
    spkis: deviceKeys(),
  });
}

const DEVICE_ERROR: Record<Exclude<DeviceStatus, "ok">, string> = {
  "none-configured": "No admin device is allowed yet: add this browser's key to ADMIN_DEVICE_KEYS (Admin -> Security).",
  missing: "This browser isn't set up as an admin device (Admin -> Security).",
  unknown: "This browser's device key isn't in ADMIN_DEVICE_KEYS.",
  bad: "The device signature is invalid or expired. Check this computer's clock and reload.",
};

/** null when the visitor is an admin on an allowed device, otherwise the response to send back. Fails closed. */
export async function adminOnly(request: Request): Promise<Response | null> {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401, headers: NO_STORE });
  if (!isAdmin(user)) return Response.json({ error: "This account isn't an admin." }, { status: 403, headers: NO_STORE });
  const device = await deviceStatus(request);
  if (device !== "ok") return Response.json({ error: DEVICE_ERROR[device], device }, { status: 403, headers: NO_STORE });
  return null;
}
