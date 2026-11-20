import { NO_STORE, currentUser, deviceKeys, deviceStatus, isAdmin } from "@/lib/admin";
import { sealKeyIsDeviceKey, sealPublicKey } from "@/lib/seal-server";
import { authConfigured } from "@/lib/supabase/server";

// GET → who is signed in, and whether they may open the Support list.
// Stays usable without a device signature (the Security setup screen learns its state here). For an admin it also says:
//  - device: how this request's device signature checks out ("ok" | "missing" | "unknown" | "bad" | "none-configured"),
//  - sealPublicKey: the public key personal data is sealed with (null = not set up), sealKeyIsDeviceKey: that value is also in
//    ADMIN_DEVICE_KEYS (mixed up; sealing is off), deviceKeysConfigured: ADMIN_DEVICE_KEYS isn't empty.
export async function GET(request: Request) {
  const user = await currentUser();
  const admin = isAdmin(user);
  const base = { configured: authConfigured, signedIn: Boolean(user), admin, email: user?.email ?? null };
  if (!admin) return Response.json(base, { headers: NO_STORE });
  return Response.json({ ...base, device: await deviceStatus(request), sealPublicKey: sealPublicKey(), sealKeyIsDeviceKey: sealKeyIsDeviceKey(), deviceKeysConfigured: deviceKeys().length > 0 }, { headers: NO_STORE });
}
