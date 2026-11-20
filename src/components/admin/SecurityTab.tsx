"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  createDeviceKey,
  createPendingDeviceKey,
  createSealKey,
  dropPendingDeviceKey,
  getDeviceKey,
  getPendingDeviceKey,
  getSealKey,
  onKeysChange,
  promotePendingDeviceKey,
  restoreSealKey,
  verifyBackup,
  type DeviceKey,
  type SealKey,
} from "@/lib/admin-keys";
import { deviceKeyId } from "@/lib/seal-format";

// Admin -> Security: set up what keeps the personal data private.
//  1. This device: a signing key that never leaves this browser. The admin APIs only answer browsers whose public key is in ADMIN_DEVICE_KEYS.
//     A replacement key stays "pending" (the working one keeps signing) until the server accepts it.
//  2. Decryption key: personal data (contacts, messages, notes, buyer emails, screenshots) is encrypted for the public key in
//     ADMIN_SEAL_PUBLIC_KEY; only the private key in this browser (restorable from the passphrase-protected backup file) can read it.
// Both are P-256 public keys that look alike, so every key is shown with a short fingerprint and the env var it belongs to.
// Libraries: lib/admin-keys.ts (IndexedDB) and lib/seal-format.ts (formats). The server side is lib/admin.ts and lib/seal-server.ts.

export type SecurityMe = {
  device?: "ok" | "missing" | "unknown" | "bad" | "none-configured";
  sealPublicKey?: string | null;
  /** The server's ADMIN_SEAL_PUBLIC_KEY is also in ADMIN_DEVICE_KEYS (mixed up). */
  sealKeyIsDeviceKey?: boolean;
  deviceKeysConfigured?: boolean;
};

const card = "rounded-2xl border border-line bg-surface p-4 sm:p-5";
const field = "w-full rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
const primary = "inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40";
const secondary = "inline-flex min-h-10 items-center justify-center rounded-xl border border-line px-4 text-sm font-semibold hover:bg-surface-2 disabled:opacity-50";
const MIN_PASSPHRASE = 12;

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function Note({ kind, children }: { kind: "warn" | "ok" | "info"; children: ReactNode }) {
  const tone = kind === "warn" ? "bg-danger-soft text-danger" : kind === "ok" ? "bg-accent-soft text-ink" : "bg-surface-2 text-muted";
  return (
    <p role={kind === "warn" ? "alert" : undefined} className={`rounded-xl px-4 py-3 text-sm ${tone}`}>
      {children}
    </p>
  );
}

/** First 16 characters of b64url(SHA-256(SPKI)): the same id the server and the device signature use. */
function useFingerprint(spki: string | null | undefined): string | null {
  const [fp, setFp] = useState<{ spki: string; id: string } | null>(null);
  useEffect(() => {
    if (!spki) return;
    let live = true;
    deviceKeyId(spki)
      .then((id) => live && setFp({ spki, id }))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [spki]);
  return spki && fp?.spki === spki ? fp.id : null;
}

function Fingerprint({ spki }: { spki: string }) {
  const id = useFingerprint(spki);
  return <code className="font-mono text-ink">{id ?? "…"}</code>;
}

/** A public key in a copyable box, named by the env var it goes into. */
function KeyBox({ envName, what, value }: { envName: string; what: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">
          {what} <span className="text-muted">-&gt; goes into</span> <code className="font-mono">{envName}</code>
        </span>
        <button type="button" onClick={copy} className={secondary}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-1 text-[13px] text-muted">
        Fingerprint: <Fingerprint spki={value} />
      </p>
      <textarea readOnly value={value} rows={3} onFocus={(e) => e.currentTarget.select()} className={`${field} mt-1.5 font-mono text-xs break-all`} />
    </div>
  );
}

export function SecurityTab({ me, onChanged }: { me: SecurityMe; onChanged: () => unknown }) {
  const [device, setDevice] = useState<DeviceKey | null | undefined>(undefined);
  const [pending, setPending] = useState<DeviceKey | null>(null);
  const [seal, setSeal] = useState<SealKey | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    const read = () => {
      getDeviceKey().then((k) => live && setDevice(k));
      getPendingDeviceKey().then((k) => live && setPending(k));
      getSealKey().then((k) => live && setSeal(k));
    };
    read();
    const off = onKeysChange(read);
    return () => {
      live = false;
      off();
    };
  }, []);

  return (
    <div className="mt-5 space-y-4">
      <DeviceSection me={me} device={device} pending={pending} onChanged={onChanged} />
      <SealSection me={me} seal={seal} deviceSpkis={[device?.spki, pending?.spki]} onChanged={onChanged} />
    </div>
  );
}

// ── 1. This device ──

function DeviceSection({ me, device, pending, onChanged }: { me: SecurityMe; device: DeviceKey | null | undefined; pending: DeviceKey | null; onChanged: () => unknown }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const run = async (f: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await f();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(false);
  };
  const first = () =>
    run(async () => {
      await createDeviceKey();
      await onChanged();
    });
  const rotate = () => run(() => createPendingDeviceKey());
  const cancel = () => run(() => dropPendingDeviceKey());
  const check = () =>
    run(async () => {
      const r = await promotePendingDeviceKey();
      setMessage(r === "promoted" ? "The server accepts the new key: it is the active device key now." : "The server doesn't accept the new key yet. Add it to ADMIN_DEVICE_KEYS, redeploy, then check again.");
      await onChanged();
    });
  const ok = me.device === "ok";
  return (
    <section className={card}>
      <h2 className="font-semibold">1. This device</h2>
      <p className="mt-1 text-sm text-muted">
        The admin pages only answer browsers that sign every request with a key stored here. The key can&apos;t be copied out of this browser. Keys are per browser <em>and</em> per site address:
        localhost and the real domain each need their own.
      </p>
      {device === undefined ? (
        <p className="mt-3 text-sm text-muted">Checking…</p>
      ) : !device ? (
        <button type="button" onClick={first} disabled={busy} className={`${primary} mt-4`}>
          {busy ? "Creating…" : "Create the device key"}
        </button>
      ) : (
        <>
          <div className="mt-3">
            {ok ? (
              <Note kind="ok">This browser is an allowed admin device.</Note>
            ) : (
              <Note kind="warn">
                {me.device === "bad"
                  ? "The server rejected this browser's signature. Check this computer's clock, then reload."
                  : me.device === "none-configured"
                    ? "ADMIN_DEVICE_KEYS isn't set on the server yet."
                    : "This device key isn't in ADMIN_DEVICE_KEYS yet."}{" "}
                Add the key below, then redeploy (Vercel) or restart the dev server (localhost).
              </Note>
            )}
          </div>
          <KeyBox envName="ADMIN_DEVICE_KEYS" what="This browser's device public key" value={device.spki} />
          {!ok && (
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
              <li>
                Vercel -&gt; your project -&gt; Settings -&gt; Environment Variables: add or edit <code className="font-mono text-ink">ADMIN_DEVICE_KEYS</code>. Several keys go in one value, separated by commas.
              </li>
              <li>
                For localhost, put the same line in <code className="font-mono text-ink">.env.local</code>.
              </li>
              <li>Redeploy (or restart <code className="font-mono text-ink">npm run dev</code>), then reload this page.</li>
            </ol>
          )}
          {pending ? (
            <div className="mt-4 rounded-xl bg-surface-2 p-4">
              <p className="text-sm font-medium">A new device key is waiting. The current key keeps working until the server accepts the new one.</p>
              <KeyBox envName="ADMIN_DEVICE_KEYS" what="Pending device public key (add it next to the current one, don't replace it)" value={pending.spki} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={check} disabled={busy} className={primary}>
                  Check again
                </button>
                <button type="button" onClick={cancel} disabled={busy} className={secondary}>
                  Cancel
                </button>
              </div>
              {message && <p role="status" className="mt-3 text-sm">{message}</p>}
            </div>
          ) : (
            <button type="button" onClick={rotate} disabled={busy} className={`${secondary} mt-4`}>
              Make a new device key
            </button>
          )}
        </>
      )}
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </section>
  );
}

// ── 2. Decryption key ──

type Mode = "create" | "restore" | null;

function SealSection({ me, seal, deviceSpkis, onChanged }: { me: SecurityMe; seal: SealKey | null | undefined; deviceSpkis: (string | undefined)[]; onChanged: () => unknown }) {
  const server = me.sealPublicKey ?? null;
  const [mode, setMode] = useState<Mode>(null);
  /** The backup made in this visit: kept so it can be downloaded again until the page is left. */
  const [fresh, setFresh] = useState<string | null>(null);
  const [replacing, setReplacing] = useState(false);

  const loading = seal === undefined;
  // The device key pasted into the seal variable: sealing is off on the server, and anything sealed to it could never be opened.
  const clash = Boolean(server && (me.sealKeyIsDeviceKey || deviceSpkis.includes(server)));
  const matches = Boolean(seal && server && seal.spki === server) && !clash;
  const needsCreate = !loading && !seal && !server;
  const needsRestore = !loading && Boolean(server) && !matches && !clash;
  const done = () => {
    setMode(null);
    setReplacing(false);
    return onChanged();
  };
  const created = (backupJson: string) => {
    setFresh(backupJson);
    return done();
  };
  const restored = () => {
    setFresh(null);
    return done();
  };
  const cancel = () => {
    setMode(null);
    setReplacing(false);
  };

  return (
    <section className={card}>
      <h2 className="font-semibold">2. Decryption key</h2>
      <p className="mt-1 text-sm text-muted">
        Contacts, messages, notes, buyer emails and screenshots are encrypted for you when they arrive. The server, the database and Vercel only ever hold the public key, so nobody but this browser can read them.
      </p>
      <div className="mt-3">
        <Note kind="warn">
          If you lose both this browser&apos;s key and the backup file or its passphrase, the encrypted data is gone forever. Keep the backup file somewhere safe (not only on this computer) and remember the passphrase.
        </Note>
      </div>

      {loading ? (
        <p className="mt-3 text-sm text-muted">Checking…</p>
      ) : (
        <>
          {clash && (
            <div className="mt-3">
              <Note kind="warn">
                ADMIN_SEAL_PUBLIC_KEY is a DEVICE key (it is also in ADMIN_DEVICE_KEYS, or equals this browser&apos;s device key). You pasted the device key into the wrong variable. New support requests and reports are refused until ADMIN_SEAL_PUBLIC_KEY holds the decryption public key from this section.
              </Note>
            </div>
          )}
          <p className="mt-3 space-y-0.5 text-[13px] text-muted">
            {server && (
              <span className="block">
                Server&apos;s <code className="font-mono">ADMIN_SEAL_PUBLIC_KEY</code> fingerprint: <Fingerprint spki={server} />
              </span>
            )}
            <span className="block">{seal ? <>This browser&apos;s decryption key fingerprint: <Fingerprint spki={seal.spki} /></> : "This browser has no decryption key."}</span>
          </p>
          {matches && (
            <div className="mt-3">
              <Note kind="ok">This browser can decrypt. Its key matches the server&apos;s ADMIN_SEAL_PUBLIC_KEY.</Note>
            </div>
          )}
          {seal && server && !matches && !clash && (
            <div className="mt-3">
              <Note kind="warn">The key in this browser doesn&apos;t match the server&apos;s ADMIN_SEAL_PUBLIC_KEY, so new data can&apos;t be read here. Restore the right backup below, or fix the environment variable.</Note>
            </div>
          )}
          {needsCreate && <p className="mt-3 text-sm text-muted">No key exists yet. Create one to start storing personal data safely.</p>}

          {seal && !seal.verified && (
            <div className="mt-3 space-y-3">
              {fresh && <Note kind="ok">Key created. The backup file was downloaded as stellar-admin-key.json: store it safely.</Note>}
              <Note kind="warn">Verify the backup before you use this key: choose the downloaded file and type its passphrase. The public key for the server is shown only after that.</Note>
              {fresh && (
                <button type="button" onClick={() => download("stellar-admin-key.json", fresh)} className={secondary}>
                  Download the backup again
                </button>
              )}
              <VerifyForm onDone={() => onChanged()} />
            </div>
          )}
          {seal?.verified && !server && (
            <>
              <div className="mt-3">
                <Note kind="warn">The server doesn&apos;t have the public key yet: new support requests and reports are refused until it does.</Note>
              </div>
              <KeyBox envName="ADMIN_SEAL_PUBLIC_KEY" what="Decryption public key" value={seal.spki} />
              <p className="mt-2 text-sm text-muted">
                Put it in Vercel -&gt; Settings -&gt; Environment Variables (and <code className="font-mono text-ink">.env.local</code> for localhost), then redeploy / restart.
              </p>
            </>
          )}
          {seal?.verified && clash && (
            <>
              <KeyBox envName="ADMIN_SEAL_PUBLIC_KEY" what="The correct decryption public key (this browser's)" value={seal.spki} />
              <p className="mt-2 text-sm text-muted">
                Replace the value of <code className="font-mono text-ink">ADMIN_SEAL_PUBLIC_KEY</code> with this one, keep the device key only in <code className="font-mono text-ink">ADMIN_DEVICE_KEYS</code>, then redeploy / restart.
              </p>
            </>
          )}
          {server && me.deviceKeysConfigured === false && (
            <div className="mt-3">
              <Note kind="warn">ADMIN_DEVICE_KEYS isn&apos;t set, so sealing is off (the device key may have been pasted into ADMIN_SEAL_PUBLIC_KEY instead). Set up section 1 first, then the decryption key.</Note>
            </div>
          )}
          {seal?.verified && server && !matches && !clash && (
            <>
              <KeyBox envName="ADMIN_SEAL_PUBLIC_KEY" what="This browser's decryption public key" value={seal.spki} />
              <p className="mt-2 text-sm text-muted">Only if you meant to switch to this key: put it into the variable and redeploy. Data sealed for the server&apos;s current key needs that key&apos;s backup.</p>
            </>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {needsCreate && mode === null && (
              <button type="button" onClick={() => setMode("create")} className={primary}>
                Create the key
              </button>
            )}
            {needsRestore && mode === null && (
              <button type="button" onClick={() => setMode("restore")} className={primary}>
                Restore from backup file
              </button>
            )}
          </div>

          {mode === "create" && <CreateForm replacing={replacing} onDone={created} onCancel={cancel} />}
          {mode === "restore" && <RestoreForm expected={server} onDone={restored} onCancel={cancel} />}

          {mode === null && (seal || server) && !matches && (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-sm">
              <button
                type="button"
                onClick={() => {
                  setReplacing(true);
                  setMode("create");
                }}
                className="text-muted underline underline-offset-2 hover:text-ink"
              >
                Lost the backup? Create a new key (data sealed for the old key stays unreadable)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

/** Passphrase (twice) -> new key + backup download. */
function CreateForm({ replacing, onDone, onCancel }: { replacing: boolean; onDone: (backupJson: string) => unknown; onCancel: () => void }) {
  const [pass, setPass] = useState("");
  const [again, setAgain] = useState("");
  const [sure, setSure] = useState(!replacing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.length < MIN_PASSPHRASE) return setError(`Use at least ${MIN_PASSPHRASE} characters.`);
    if (pass !== again) return setError("The two passphrases don't match.");
    setBusy(true);
    setError(null);
    try {
      const { backupJson } = await createSealKey(pass);
      download("stellar-admin-key.json", backupJson);
      onDone(backupJson);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create the key.");
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl bg-surface-2 p-4">
      {replacing && (
        <label className="flex items-start gap-2.5 text-sm">
          <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0" />
          <span>I understand: the current key is only archived in this browser (not backed up elsewhere), and data sealed for it becomes unreadable if this browser loses it.</span>
        </label>
      )}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Backup passphrase (min. {MIN_PASSPHRASE} characters)</span>
        <input type="password" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Repeat it</span>
        <input type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={field} />
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy || !sure} className={primary}>
          {busy ? "Creating…" : "Create key and download backup"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={secondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Backup file + passphrase -> proves the file holds this browser's key. */
function VerifyForm({ onDone }: { onDone: () => unknown }) {
  const [file, setFile] = useState<File | null>(null);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Choose the backup file (stellar-admin-key.json).");
    setBusy(true);
    setError(null);
    try {
      await verifyBackup(await file.text(), pass);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't verify the backup.");
    }
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl bg-surface-2 p-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Backup file</span>
        <input type="file" accept=".json,application/json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Passphrase</span>
        <input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} className={field} />
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={busy || !file || !pass} className={primary}>
        {busy ? "Verifying…" : "Verify backup"}
      </button>
    </form>
  );
}

/** Backup file + passphrase -> key in this browser (must match the server's public key). */
function RestoreForm({ expected, onDone, onCancel }: { expected: string | null; onDone: () => unknown; onCancel: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Choose the backup file (stellar-admin-key.json).");
    setBusy(true);
    setError(null);
    try {
      await restoreSealKey(await file.text(), pass, expected);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't restore the key.");
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl bg-surface-2 p-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Backup file</span>
        <input type="file" accept=".json,application/json" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Passphrase</span>
        <input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} className={field} />
      </label>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy || !file || !pass} className={primary}>
          {busy ? "Restoring…" : "Restore key"}
        </button>
        <button type="button" onClick={onCancel} disabled={busy} className={secondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}
