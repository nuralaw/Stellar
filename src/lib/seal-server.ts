import "server-only";
import { importSealPublic, sealBytes, sealJson } from "./seal-format";

// Server side of the admin-only encryption (format: seal-format.ts). The server only ever holds the admin's PUBLIC
// key (ADMIN_SEAL_PUBLIC_KEY, SPKI base64url, created in /admin -> Security), so it can seal personal data but never read it back.
// Without the key nothing personal is stored: callers refuse (support, reports) or store without it (payments).
//
// A device key (ADMIN_DEVICE_KEYS, ECDSA) has the same SPKI shape as the seal key (ECDH) and imports fine as one, so pasting it into
// the wrong variable would "work" and seal everything to a key nobody can open. That case counts as NOT configured, and so does
// an ADMIN_DEVICE_KEYS with no valid key: pasting the device key into ADMIN_SEAL_PUBLIC_KEY *instead of* ADMIN_DEVICE_KEYS leaves
// that one empty. (The device key is set up first in /admin -> Security, the decryption key second.)

const PUBLIC = (process.env.ADMIN_SEAL_PUBLIC_KEY ?? "").trim();
const DEVICE_KEYS = (process.env.ADMIN_DEVICE_KEYS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
/** A P-256 SPKI is 91 bytes (122 base64url characters). */
const VALID_DEVICE_KEYS = DEVICE_KEYS.filter((k) => /^[A-Za-z0-9_-]{100,}$/.test(k));

/** ADMIN_SEAL_PUBLIC_KEY is one of the ADMIN_DEVICE_KEYS (the two were mixed up). */
export const sealKeyIsDeviceKey = (): boolean => PUBLIC !== "" && DEVICE_KEYS.includes(PUBLIC);

if (sealKeyIsDeviceKey()) console.error("[seal] ADMIN_SEAL_PUBLIC_KEY is also listed in ADMIN_DEVICE_KEYS: a device key was pasted into the seal variable. Sealing is off until it's fixed.");
else if (PUBLIC && !VALID_DEVICE_KEYS.length) console.error("[seal] ADMIN_SEAL_PUBLIC_KEY is set but ADMIN_DEVICE_KEYS has no valid key: the device key may have been pasted into the seal variable instead. Sealing is off until ADMIN_DEVICE_KEYS is set (device key first, then the decryption key).");

/** The configured value as is (the admin UI compares it with this browser's keys), even when it's unusable. */
export const sealPublicKey = (): string | null => PUBLIC || null;
export const sealConfigured = (): boolean => PUBLIC !== "" && !sealKeyIsDeviceKey() && VALID_DEVICE_KEYS.length > 0;

// Validated once: a malformed value in the env var fails every seal call, not only the first.
let checked: Promise<void> | null = null;
function ready(): Promise<void> {
  if (!PUBLIC) return Promise.reject(new Error("ADMIN_SEAL_PUBLIC_KEY isn't set."));
  if (!sealConfigured()) return Promise.reject(new Error("ADMIN_SEAL_PUBLIC_KEY is a device key, or ADMIN_DEVICE_KEYS isn't set."));
  return (checked ??= importSealPublic(PUBLIC).then(() => undefined));
}

export async function sealJsonServer(value: unknown): Promise<string> {
  await ready();
  return sealJson(value, PUBLIC);
}

export async function sealBytesServer(bytes: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
  await ready();
  return sealBytes(bytes, PUBLIC);
}
