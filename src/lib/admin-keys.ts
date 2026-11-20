// Browser-only admin keys (formats: seal-format.ts). Non-extractable private keys live in this browser's IndexedDB:
//  - device: ECDSA P-256. Signs every admin API request (adminFetch), so the server only answers allowed browsers (ADMIN_DEVICE_KEYS).
//            A replacement is first kept as `device-pending` and only promoted once the server accepts its signature.
//  - seal:   ECDH P-256. Decrypts the personal data the server sealed with the matching public key (ADMIN_SEAL_PUBLIC_KEY).
//            A replaced seal key is archived as `seal-old:<spki>` and still tried when opening data.
// The page's JavaScript can use these keys but never read them out. The seal key's only copy outside this browser is the
// passphrase-protected backup file the admin downloads when creating it. Keys are per browser AND per site address (origin).

import {
  deviceKeyId,
  exportSpki,
  generateDevicePair,
  generateSealPair,
  importSealPrivate,
  openBytes,
  openJson,
  parseBackup,
  sealJson,
  signDevice,
  signingMessage,
  unwrapPrivateKey,
  wrapPrivateKey,
} from "./seal-format";

export interface DeviceKey {
  privateKey: CryptoKey;
  spki: string;
  keyId: string;
}
export interface SealKey {
  privateKey: CryptoKey;
  spki: string;
  /** The passphrase backup was re-opened and matches this key (created keys start false; restored ones are true). */
  verified?: boolean;
}
export type OpenFailure = { ok: false; why: "no-key" | "wrong-key" };

const DB_NAME = "stellar-admin";
const STORE = "keys";
const OLD_SEAL = "seal-old:";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB isn't available in this browser."));
  });
}

/** One transaction. It resolves with the returned request's result only once the transaction has COMMITTED (a write isn't safe before that). */
async function idb<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = run(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error ?? req.error ?? new Error("Couldn't write to this browser's storage."));
      tx.onabort = () => reject(tx.error ?? new Error("Writing to this browser's storage was aborted."));
    });
  } finally {
    db.close();
  }
}

/** Best effort: asks the browser not to evict this site's data under storage pressure. */
function persist() {
  try {
    void navigator.storage?.persist?.().catch(() => {});
  } catch {}
}

// In-memory cache: undefined = not read yet, null = no such key in this browser.
let device: DeviceKey | null | undefined;
let pending: DeviceKey | null | undefined;
let seal: SealKey | null | undefined;
let oldSeals: SealKey[] | undefined;
const listeners = new Set<() => void>();
const changed = () => listeners.forEach((f) => f());

/** Called after a key is created, restored, promoted or forgotten (so lists can decrypt again). Returns the unsubscribe function. */
export function onKeysChange(f: () => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

// ── Device key ──

export async function getDeviceKey(): Promise<DeviceKey | null> {
  if (device === undefined) {
    try {
      device = ((await idb("readonly", (s) => s.get("device"))) as DeviceKey | undefined) ?? null;
    } catch {
      device = null; // IndexedDB blocked (private window…): behaves as "no device key"
    }
  }
  return device;
}

export async function getPendingDeviceKey(): Promise<DeviceKey | null> {
  if (pending === undefined) {
    try {
      pending = ((await idb("readonly", (s) => s.get("device-pending"))) as DeviceKey | undefined) ?? null;
    } catch {
      pending = null;
    }
  }
  return pending;
}

async function newDeviceKey(): Promise<DeviceKey> {
  const pair = await generateDevicePair();
  const spki = await exportSpki(pair.publicKey);
  return { privateKey: pair.privateKey, spki, keyId: await deviceKeyId(spki) };
}

/** The first device key of this browser (the active one). Replacing a working key goes through createPendingDeviceKey. */
export async function createDeviceKey(): Promise<DeviceKey> {
  const key = await newDeviceKey();
  await idb("readwrite", (s) => s.put(key, "device"));
  persist();
  device = key;
  changed();
  return key;
}

/** A replacement device key: stored beside the working one, which keeps signing until the server accepts the new one. */
export async function createPendingDeviceKey(): Promise<DeviceKey> {
  const key = await newDeviceKey();
  await idb("readwrite", (s) => s.put(key, "device-pending"));
  persist();
  pending = key;
  changed();
  return key;
}

export async function dropPendingDeviceKey() {
  await idb("readwrite", (s) => s.delete("device-pending"));
  pending = null;
  changed();
}

/** Signs a /api/admin/me request with the pending key; if the server accepts it, the pending key becomes the active one. */
export async function promotePendingDeviceKey(): Promise<"none" | "promoted" | "not-accepted"> {
  const key = await getPendingDeviceKey();
  if (!key) return "none";
  try {
    const res = await signedFetch(key, "/api/admin/me", { cache: "no-store" });
    const json: { device?: string } | null = await res.json().catch(() => null);
    if (json?.device !== "ok") return "not-accepted";
  } catch {
    return "not-accepted";
  }
  await idb("readwrite", (s) => {
    s.delete("device-pending");
    return s.put(key, "device");
  });
  device = key;
  pending = null;
  changed();
  return "promoted";
}

export async function forgetDeviceKey() {
  await idb("readwrite", (s) => s.delete("device"));
  device = null;
  changed();
}

// ── Seal key ──

export async function getSealKey(): Promise<SealKey | null> {
  if (seal === undefined) {
    try {
      seal = ((await idb("readonly", (s) => s.get("seal"))) as SealKey | undefined) ?? null;
    } catch {
      seal = null;
    }
  }
  return seal;
}

/** The current key first, then the archived ones. */
export async function getSealKeys(): Promise<SealKey[]> {
  const current = await getSealKey();
  if (oldSeals === undefined) {
    try {
      oldSeals = (await idb("readonly", (s) => s.getAll(IDBKeyRange.bound(OLD_SEAL, "seal-old;")))) as SealKey[];
    } catch {
      oldSeals = [];
    }
  }
  return [...(current ? [current] : []), ...oldSeals];
}

/** Makes `key` the current seal key; a different current key is archived, never dropped. */
async function storeSealKey(key: SealKey) {
  const prev = await getSealKey();
  const archive = prev && prev.spki !== key.spki ? prev : null;
  await idb("readwrite", (s) => {
    if (archive) s.put(archive, OLD_SEAL + archive.spki);
    s.delete(OLD_SEAL + key.spki);
    return s.put(key, "seal");
  });
  persist();
  seal = key;
  oldSeals = undefined;
  changed();
}

/** Opens a sealed JSON value with the current key, then the archived ones. */
export async function openJsonAny<T = unknown>(sealed: string): Promise<{ ok: true; data: T } | OpenFailure> {
  const keys = await getSealKeys();
  if (!keys.length) return { ok: false, why: "no-key" };
  for (const k of keys) {
    try {
      return { ok: true, data: await openJson<T>(sealed, k.privateKey) };
    } catch {}
  }
  return { ok: false, why: "wrong-key" };
}

/** Opens sealed bytes (a screenshot) with the current key, then the archived ones. */
export async function openBytesAny(bytes: Uint8Array): Promise<{ ok: true; data: Uint8Array<ArrayBuffer> } | OpenFailure> {
  const keys = await getSealKeys();
  if (!keys.length) return { ok: false, why: "no-key" };
  for (const k of keys) {
    try {
      return { ok: true, data: await openBytes(bytes, k.privateKey) };
    } catch {}
  }
  return { ok: false, why: "wrong-key" };
}

/** The private key must open what its public key seals. */
async function selfTest(privateKey: CryptoKey, publicSpki: string) {
  try {
    await openJson(await sealJson({ t: 1 }, publicSpki), privateKey);
  } catch {
    throw new Error("The backup file is damaged: its key pair doesn't match.");
  }
}

/**
 * Makes a new seal key: the pair is generated extractable only long enough to wrap the private key into the passphrase backup,
 * then the private key is re-imported NON-extractable and stored (not yet "verified": see verifyBackup). Returns the backup file's
 * text and the public key for ADMIN_SEAL_PUBLIC_KEY. A previous key stays archived in this browser.
 */
export async function createSealKey(passphrase: string): Promise<{ backupJson: string; publicSpki: string }> {
  const pair = await generateSealPair(true);
  const publicSpki = await exportSpki(pair.publicKey);
  const pkcs8 = new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
  const backup = await wrapPrivateKey(pkcs8, passphrase, publicSpki);
  const privateKey = await importSealPrivate(pkcs8, false);
  pkcs8.fill(0);
  await storeSealKey({ privateKey, spki: publicSpki, verified: false });
  return { backupJson: JSON.stringify(backup, null, 1), publicSpki };
}

/**
 * Re-opens the downloaded backup with its passphrase and checks it holds the private key of this browser's current seal key.
 * Only then is the key marked verified (the setup screen shows the public key for the server after this).
 */
export async function verifyBackup(backupJson: string, passphrase: string): Promise<void> {
  const current = await getSealKey();
  if (!current) throw new Error("There is no key in this browser to verify.");
  const backup = parseBackup(backupJson);
  if (backup.pub !== current.spki) throw new Error("This backup file belongs to a different key than the one just created.");
  const pkcs8 = await unwrapPrivateKey(backup, passphrase);
  const privateKey = await importSealPrivate(pkcs8, false);
  pkcs8.fill(0);
  await selfTest(privateKey, current.spki);
  const next: SealKey = { ...current, verified: true };
  await idb("readwrite", (s) => s.put(next, "seal"));
  seal = next;
  changed();
}

/** Restores the seal key from a backup file. `expectedPublic` (the server's key) must match the backup, else nothing is stored. */
export async function restoreSealKey(backupJson: string, passphrase: string, expectedPublic?: string | null): Promise<SealKey> {
  const backup = parseBackup(backupJson);
  if (expectedPublic && backup.pub !== expectedPublic) throw new Error("This backup belongs to a different key than the one the server uses (ADMIN_SEAL_PUBLIC_KEY).");
  const pkcs8 = await unwrapPrivateKey(backup, passphrase);
  const privateKey = await importSealPrivate(pkcs8, false);
  pkcs8.fill(0);
  await selfTest(privateKey, backup.pub);
  const key: SealKey = { privateKey, spki: backup.pub, verified: true };
  await storeSealKey(key);
  return key;
}

/** Removes every seal key (current and archived) from this browser. */
export async function forgetSealKey() {
  const olds = await getSealKeys();
  await idb("readwrite", (s) => {
    for (const k of olds) s.delete(OLD_SEAL + k.spki);
    return s.delete("seal");
  });
  seal = null;
  oldSeals = [];
  changed();
}

// ── Signed requests ──

function signedFetch(key: DeviceKey, input: string | URL, init: RequestInit = {}): Promise<Response> {
  const url = new URL(String(input), window.location.origin);
  const ts = String(Date.now());
  const method = (init.method ?? "GET").toUpperCase();
  return signDevice(key.privateKey, signingMessage(ts, method, url.pathname + url.search)).then((sig) => {
    const headers = new Headers(init.headers);
    headers.set("x-admin-ts", ts);
    headers.set("x-admin-key-id", key.keyId);
    headers.set("x-admin-sig", sig);
    return fetch(input, { ...init, headers });
  });
}

/**
 * fetch() for /api/admin/*: adds the device signature headers (x-admin-ts, x-admin-key-id, x-admin-sig), signed with the ACTIVE device key.
 * Without a device key in this browser it sends a plain request; the server then answers 403 { device: "missing" }.
 * The signature covers the timestamp, method and path + query (not the body) and is valid for two minutes.
 */
export async function adminFetch(input: string | URL, init: RequestInit = {}): Promise<Response> {
  const key = await getDeviceKey();
  return key ? signedFetch(key, input, init) : fetch(input, init);
}
