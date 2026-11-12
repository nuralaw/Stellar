"use client";

import { useEffect, useId, useRef, useState } from "react";
import { I, Icon } from "@/components/bank/icons";
import { CONTACT_ICONS, loadContacts, saveContacts } from "@/lib/contacts";
import { getUserId } from "@/lib/store";

const P = {
  chat: "M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.5-5.4A8.5 8.5 0 1 1 21 12Z",
  at: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2",
  upload: "M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  gift: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7S10.5 3 8 3.5 7 7 12 7Zm0 0s1.5-4 4-3.5S17 7 12 7Z",
};

const CONTACTS = [
  { key: "telegram", label: "Telegram", placeholder: "@username", icon: CONTACT_ICONS.telegram },
  { key: "instagram", label: "Instagram", placeholder: "@username", icon: CONTACT_ICONS.instagram },
  { key: "other", label: "Other", placeholder: "WhatsApp, email…", icon: P.at },
] as const;
type ContactKey = (typeof CONTACTS)[number]["key"];

const MIN_MESSAGE = 10;

/** Screenshot shrunk in the browser (max 2000 px, JPEG) so uploads stay small. */
async function shrink(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.");
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    throw new Error("Couldn't open that image. Try a PNG or JPG screenshot.");
  }
  const k = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * k);
  canvas.height = Math.round(bmp.height * k);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't read that image."))), "image/jpeg", 0.85));
}

/**
 * Home page "Support" button (bottom right). Opens a panel from the right: contacts (Telegram / Instagram / other),
 * a screenshot of the question, and what went wrong. What's typed stays if the panel is closed before sending.
 */
export function SupportButton() {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Record<ContactKey, string>>(() => ({ ...loadContacts(), other: "" }));
  const [message, setMessage] = useState("");
  const [shot, setShot] = useState<{ blob: Blob; url: string } | null>(null);
  const [shotError, setShotError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);
  const titleId = useId();

  const hasContact = Object.values(contacts).some((v) => v.trim());
  const ready = hasContact && message.trim().length >= MIN_MESSAGE;

  const pickImage = async (file: File | undefined | null) => {
    if (!file) return;
    setShotError(null);
    try {
      const blob = await shrink(file);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = URL.createObjectURL(blob);
      setShot({ blob, url: urlRef.current });
    } catch (e) {
      setShotError((e as Error).message);
    }
  };

  const removeImage = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setShot(null);
  };

  const close = () => {
    setOpen(false);
    if (state === "sent") {
      // Sent: start clean next time (remembered usernames stay).
      setContacts({ ...loadContacts(), other: "" });
      setMessage("");
      removeImage();
      setState("idle");
    }
  };

  // While open: Esc closes, Ctrl+V pastes a screenshot, the page behind doesn't scroll.
  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files ?? [])].find((f) => f.type.startsWith("image/"));
      if (file) {
        e.preventDefault();
        void pickImage(file);
      }
    };
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    document.addEventListener("paste", onPaste);
    return () => {
      html.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("paste", onPaste);
    };
  }, [open]);

  useEffect(() => () => void (urlRef.current && URL.revokeObjectURL(urlRef.current)), []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError(null);
    const form = new FormData();
    for (const c of CONTACTS) form.set(c.key, contacts[c.key].trim());
    form.set("message", message.trim());
    form.set("userId", getUserId());
    form.set("website", honeypot);
    if (shot) form.set("screenshot", shot.blob, "screenshot.jpg");
    try {
      const res = await fetch("/api/support", { method: "POST", body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? `Something went wrong (${res.status}). Try again.`);
      saveContacts(contacts);
      setState("sent");
    } catch (err) {
      setState("idle");
      setError((err as Error).message);
    }
  };

  const replyOn = CONTACTS.find((c) => contacts[c.key].trim());

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full bg-side py-3 pr-5 pl-4 text-sm font-semibold text-side-ink shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] ring-1 ring-side-line hover:bg-side-2 sm:right-6 sm:bottom-6"
        >
          <Icon d={P.chat} className="h-5 w-5 text-accent" />
          Support
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 starting:opacity-0" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl ring-1 ring-line transition-transform duration-300 ease-out starting:translate-x-full"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 id={titleId} className="text-lg font-bold tracking-tight">
                Support
              </h2>
              <button type="button" onClick={close} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink">
                <Icon d={I.x} className="h-5 w-5" />
              </button>
            </div>

            {state === "sent" ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-success-soft text-success">
                  <Icon d={I.check} className="h-7 w-7" strokeWidth={2.5} />
                </span>
                <p className="mt-4 text-lg font-semibold">Message sent</p>
                <p className="mt-1 max-w-xs text-sm text-muted">
                  We&apos;ll reply on {replyOn ? `${replyOn.label} (${contacts[replyOn.key].trim()})` : "the contact you left"}. If we confirm the bug, your 50% discount
                  comes there too.
                </p>
                <button type="button" onClick={close} className="mt-6 rounded-xl border border-line px-5 py-2.5 font-semibold hover:bg-surface-2">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={send} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                  <p className="text-sm text-muted">Found a bug or stuck on something? Tell us what happened and we&apos;ll get back to you.</p>

                  <div className="mt-4 flex gap-3 rounded-xl bg-accent-soft p-3.5 text-sm">
                    <Icon d={P.gift} className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <p>
                      <span className="font-semibold">50% off for real bugs.</span> If we confirm the bug you report, you get 50% off a Stellar subscription.
                    </p>
                  </div>

                  {/* 1. Contacts */}
                  <fieldset className="mt-6">
                    <legend className="text-sm font-semibold">How can we reach you?</legend>
                    <p className="mt-0.5 text-xs text-muted">Fill in at least one.</p>
                    <div className="mt-3 space-y-2">
                      {CONTACTS.map((c, i) => (
                        <label key={c.key} className="flex items-center gap-3 rounded-xl border border-line bg-bg px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                          <Icon d={c.icon} className="h-5 w-5 shrink-0 text-muted" />
                          <span className="w-20 shrink-0 text-sm font-medium">{c.label}</span>
                          <input
                            ref={i === 0 ? firstRef : undefined}
                            value={contacts[c.key]}
                            onChange={(e) => setContacts((v) => ({ ...v, [c.key]: e.target.value }))}
                            placeholder={c.placeholder}
                            maxLength={c.key === "other" ? 200 : 100}
                            autoComplete="off"
                            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted/70"
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* 2. Screenshot */}
                  <div className="mt-6">
                    <p className="text-sm font-semibold">
                      Screenshot of the question <span className="font-normal text-muted">(optional)</span>
                    </p>
                    {shot ? (
                      <div className="relative mt-3 overflow-hidden rounded-xl ring-1 ring-line">
                        {/* eslint-disable-next-line @next/next/no-img-element -- a local preview (blob: URL) */}
                        <img src={shot.url} alt="Your screenshot" className="max-h-56 w-full bg-surface-2 object-contain" />
                        <button
                          type="button"
                          onClick={removeImage}
                          aria-label="Remove screenshot"
                          className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
                        >
                          <Icon d={I.x} className="h-4 w-4" strokeWidth={2.2} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          void pickImage(e.dataTransfer.files[0]);
                        }}
                        className={`mt-3 flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                          dragging ? "border-primary bg-primary-soft" : "border-line hover:border-muted hover:bg-surface-2"
                        }`}
                      >
                        <Icon d={P.upload} className="h-6 w-6 text-muted" />
                        <span className="text-sm font-semibold">Upload a screenshot</span>
                        <span className="text-xs text-muted">or drag it here · Ctrl+V to paste</span>
                      </button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        void pickImage(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                    {shotError && (
                      <p className="mt-2 text-sm text-danger" role="alert">
                        {shotError}
                      </p>
                    )}
                  </div>

                  {/* 3. The problem */}
                  <div className="mt-6">
                    <label htmlFor="support-message" className="text-sm font-semibold">
                      What&apos;s the problem?
                    </label>
                    <textarea
                      id="support-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={3000}
                      rows={5}
                      placeholder="E.g. Question #10101: the answer key says B, but C is right because…"
                      className="mt-3 block w-full resize-y rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none placeholder:text-muted/70 focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Hidden from people; bots fill it. */}
                  <input
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />
                </div>

                <div className="border-t border-line px-5 py-4">
                  {error && (
                    <p className="mb-3 text-sm text-danger" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!ready || state === "sending"}
                    className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:opacity-40"
                  >
                    {state === "sending" ? "Sending…" : "Send to support"}
                  </button>
                  {!ready && (
                    <p className="mt-2 text-center text-xs text-muted">
                      {!hasContact ? "Add a contact so we can reply" : `Describe the problem (at least ${MIN_MESSAGE} characters)`}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
