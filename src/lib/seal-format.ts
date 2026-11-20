// Sealed personal data, and the admin device signature. Isomorphic (WebCrypto only, no imports, no "server-only"):
// the server seals with the admin's PUBLIC key, only the admin's browser (private key in IndexedDB) can open,
// and the same primitives sign/verify admin API requests with a per-browser device key.
// Node scripts import this file directly (scripts/seal-existing.mjs), so keep it dependency-free.
//
//  - Seal key: ECDH P-256, public key shipped as SPKI base64url (env ADMIN_SEAL_PUBLIC_KEY).
//  - Seal = ephemeral ECDH P-256 -> deriveBits(256) -> HKDF-SHA256 (salt = ephemeral raw point, info "stellar-seal-v1") -> AES-GCM-256, random 12-byte IV.
//      text:   s1.<b64url eph raw (65 B)>.<b64url iv>.<b64url ciphertext+tag>   (payload = JSON.stringify(obj))
//      binary: "SS1" + eph raw (65 B) + iv (12 B) + ciphertext+tag             (screenshots)
//  - Private-key backup: JSON { v, kdf: PBKDF2-SHA256, iter, salt, iv, ct, pub }, ct = AES-GCM(PBKDF2(passphrase), PKCS8).
//  - Device signature: ECDSA P-256 / SHA-256 (raw r||s) over `stellar-admin-v1\n<ts>\n<METHOD>\n<path+query>`.

const enc = new TextEncoder();
const dec = new TextDecoder();
const subtle = () => globalThis.crypto.subtle;
type Bytes = Uint8Array<ArrayBuffer>;

const EC = { name: "ECDH", namedCurve: "P-256" } as const;
const SEAL_INFO = enc.encode("stellar-seal-v1");
const MAGIC = enc.encode("SS1");
const EPH_LEN = 65;
const IV_LEN = 12;

// ── base64url ──

export function b64uEncode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64uDecode(s: string): Bytes {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) throw new Error("Not base64url");
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const concat = (...parts: Uint8Array[]): Bytes => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
};

const random = (n: number): Bytes => globalThis.crypto.getRandomValues(new Uint8Array(n));

// ── Seal (ECDH + HKDF + AES-GCM) ──

/** The recipient's public seal key (SPKI, base64url) as a CryptoKey. */
export function importSealPublic(spkiB64u: string): Promise<CryptoKey> {
  return subtle().importKey("spki", b64uDecode(spkiB64u), EC, true, []);
}

/** The seal key pair: private key usable for deriveBits only. */
export function generateSealPair(extractable: boolean): Promise<CryptoKeyPair> {
  return subtle().generateKey(EC, extractable, ["deriveBits"]);
}

/** Imports a PKCS8 seal private key (usable only for opening). */
export function importSealPrivate(pkcs8: Uint8Array<ArrayBuffer>, extractable = false): Promise<CryptoKey> {
  return subtle().importKey("pkcs8", pkcs8, EC, extractable, ["deriveBits"]);
}

export async function exportSpki(publicKey: CryptoKey): Promise<string> {
  return b64uEncode(new Uint8Array(await subtle().exportKey("spki", publicKey)));
}

async function aesKey(privateKey: CryptoKey, publicKey: CryptoKey, salt: Bytes, usage: "encrypt" | "decrypt"): Promise<CryptoKey> {
  const bits = await subtle().deriveBits({ name: "ECDH", public: publicKey }, privateKey, 256);
  const hkdf = await subtle().importKey("raw", bits, "HKDF", false, ["deriveKey"]);
  return subtle().deriveKey({ name: "HKDF", hash: "SHA-256", salt, info: SEAL_INFO }, hkdf, { name: "AES-GCM", length: 256 }, false, [usage]);
}

/** Encrypts for the recipient: returns the ephemeral public point, the IV and the ciphertext (with tag). */
async function seal(plain: Bytes, recipient: string): Promise<{ eph: Bytes; iv: Bytes; ct: Bytes }> {
  const pub = await importSealPublic(recipient);
  const pair = await subtle().generateKey(EC, false, ["deriveBits"]);
  const eph = new Uint8Array(await subtle().exportKey("raw", pair.publicKey));
  const iv = random(IV_LEN);
  const key = await aesKey(pair.privateKey, pub, eph, "encrypt");
  const ct = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv }, key, plain));
  return { eph, iv, ct };
}

async function open(eph: Bytes, iv: Bytes, ct: Bytes, privateKey: CryptoKey): Promise<Bytes> {
  if (eph.length !== EPH_LEN || iv.length !== IV_LEN || ct.length < 16) throw new Error("Sealed data is malformed.");
  try {
    const pub = await subtle().importKey("raw", eph, EC, true, []);
    const key = await aesKey(privateKey, pub, eph, "decrypt");
    return new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv }, key, ct));
  } catch {
    throw new Error("Couldn't decrypt: this isn't the key the data was sealed for, or the data is damaged.");
  }
}

/** Text form `s1.<eph>.<iv>.<ct>` of JSON.stringify(value). */
export async function sealJson(value: unknown, recipientSpki: string): Promise<string> {
  const { eph, iv, ct } = await seal(enc.encode(JSON.stringify(value)), recipientSpki);
  return `s1.${b64uEncode(eph)}.${b64uEncode(iv)}.${b64uEncode(ct)}`;
}

export async function openJson<T = unknown>(sealed: string, privateKey: CryptoKey): Promise<T> {
  const parts = typeof sealed === "string" ? sealed.split(".") : [];
  if (parts.length !== 4 || parts[0] !== "s1") throw new Error("Not a sealed value (unknown format).");
  let eph: Bytes, iv: Bytes, ct: Bytes;
  try {
    [eph, iv, ct] = [b64uDecode(parts[1]), b64uDecode(parts[2]), b64uDecode(parts[3])];
  } catch {
    throw new Error("Sealed data is malformed.");
  }
  const plain = await open(eph, iv, ct, privateKey);
  return JSON.parse(dec.decode(plain)) as T;
}

/** Binary form `SS1` + eph + iv + ct. */
export async function sealBytes(bytes: Uint8Array, recipientSpki: string): Promise<Bytes> {
  const { eph, iv, ct } = await seal(concat(bytes), recipientSpki);
  return concat(MAGIC, eph, iv, ct);
}

export async function openBytes(sealed: Uint8Array, privateKey: CryptoKey): Promise<Bytes> {
  const head = MAGIC.length;
  if (sealed.length < head + EPH_LEN + IV_LEN + 16 || !MAGIC.every((b, i) => sealed[i] === b)) throw new Error("Not a sealed file (unknown format).");
  const eph = sealed.slice(head, head + EPH_LEN);
  const iv = sealed.slice(head + EPH_LEN, head + EPH_LEN + IV_LEN);
  return open(eph, iv, sealed.slice(head + EPH_LEN + IV_LEN), privateKey);
}

// ── Private-key backup (passphrase) ──

export interface SealBackup {
  v: 1;
  kdf: "PBKDF2-SHA256";
  iter: number;
  salt: string;
  iv: string;
  ct: string;
  /** The matching public key (SPKI base64url), so a restore can be checked against the server's configured key. */
  pub: string;
}

const PBKDF2_ITER = 600_000;

async function passKey(pass: string, salt: Bytes, iter: number): Promise<CryptoKey> {
  const base = await subtle().importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return subtle().deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iter }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function wrapPrivateKey(pkcs8: Uint8Array, pass: string, pubSpki: string): Promise<SealBackup> {
  const salt = random(16);
  const iv = random(IV_LEN);
  const key = await passKey(pass, salt, PBKDF2_ITER);
  const ct = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv }, key, concat(pkcs8)));
  return { v: 1, kdf: "PBKDF2-SHA256", iter: PBKDF2_ITER, salt: b64uEncode(salt), iv: b64uEncode(iv), ct: b64uEncode(ct), pub: pubSpki };
}

/** Parses a backup file's text (or object) and checks its shape. */
export function parseBackup(input: string | unknown): SealBackup {
  let b: Record<string, unknown>;
  try {
    b = typeof input === "string" ? JSON.parse(input) : (input as Record<string, unknown>);
  } catch {
    throw new Error("This isn't a Stellar key backup file.");
  }
  const ok =
    b && typeof b === "object" && b.v === 1 && b.kdf === "PBKDF2-SHA256" && Number.isInteger(b.iter) && (b.iter as number) >= 1 && (b.iter as number) <= 5_000_000 &&
    typeof b.salt === "string" && typeof b.iv === "string" && typeof b.ct === "string" && typeof b.pub === "string";
  if (!ok) throw new Error("This isn't a Stellar key backup file.");
  return b as unknown as SealBackup;
}

export async function unwrapPrivateKey(backup: SealBackup | string, pass: string): Promise<Bytes> {
  const b = parseBackup(backup);
  try {
    const key = await passKey(pass, b64uDecode(b.salt), b.iter);
    return new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv: b64uDecode(b.iv) }, key, b64uDecode(b.ct)));
  } catch {
    throw new Error("Wrong passphrase, or the backup file is damaged.");
  }
}

// ── Device signature (admin API access) ──

const DEVICE_EC = { name: "ECDSA", namedCurve: "P-256" } as const;
const SIGN = { name: "ECDSA", hash: "SHA-256" } as const;

export type DeviceStatus = "ok" | "missing" | "unknown" | "bad" | "none-configured";

/** Longest allowed gap between the signed timestamp and the server's clock. */
export const DEVICE_MAX_SKEW_MS = 120_000;

export const signingMessage = (ts: number | string, method: string, pathAndQuery: string) => `stellar-admin-v1\n${ts}\n${method.toUpperCase()}\n${pathAndQuery}`;

export function generateDevicePair(): Promise<CryptoKeyPair> {
  return subtle().generateKey(DEVICE_EC, false, ["sign", "verify"]);
}

/** First 16 characters of b64url(SHA-256(SPKI bytes)). */
export async function deviceKeyId(spkiB64u: string): Promise<string> {
  return b64uEncode(new Uint8Array(await subtle().digest("SHA-256", b64uDecode(spkiB64u)))).slice(0, 16);
}

export async function signDevice(privateKey: CryptoKey, message: string): Promise<string> {
  return b64uEncode(new Uint8Array(await subtle().sign(SIGN, privateKey, enc.encode(message))));
}

export async function verifyDevice(spkiB64u: string, sigB64u: string, message: string): Promise<boolean> {
  try {
    const key = await subtle().importKey("spki", b64uDecode(spkiB64u), DEVICE_EC, false, ["verify"]);
    return await subtle().verify(SIGN, key, b64uDecode(sigB64u), enc.encode(message));
  } catch {
    return false;
  }
}

/**
 * Checks a request's x-admin-ts / x-admin-key-id / x-admin-sig headers against the allowed device keys (SPKI base64url).
 * "none-configured" when no key is allowed at all; the caller must fail closed on anything but "ok".
 */
export async function checkDeviceSignature(o: {
  method: string;
  /** pathname + search of the request URL. */
  pathAndQuery: string;
  header: (name: string) => string | null;
  spkis: string[];
  now?: number;
}): Promise<DeviceStatus> {
  if (!o.spkis.length) return "none-configured";
  const ts = o.header("x-admin-ts");
  const keyId = o.header("x-admin-key-id");
  const sig = o.header("x-admin-sig");
  if (!ts || !keyId || !sig) return "missing";
  let spki: string | null = null;
  for (const k of o.spkis) {
    try {
      if ((await deviceKeyId(k)) === keyId) {
        spki = k;
        break;
      }
    } catch {} // a malformed entry in ADMIN_DEVICE_KEYS never matches
  }
  if (!spki) return "unknown";
  const at = /^\d{1,15}$/.test(ts) ? Number(ts) : NaN;
  if (!Number.isFinite(at) || Math.abs((o.now ?? Date.now()) - at) > DEVICE_MAX_SKEW_MS) return "bad";
  return (await verifyDevice(spki, sig, signingMessage(ts, o.method, o.pathAndQuery))) ? "ok" : "bad";
}
