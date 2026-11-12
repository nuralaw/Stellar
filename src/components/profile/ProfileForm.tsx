"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar, fileToAvatar, isPhotoAvatar } from "@/components/Avatar";
import { AVATARS, resetAllData, updateProfile, useAttempts, useHydrated, useLessonProgress, useProfile, useTestResults } from "@/lib/store";
import { COUNTRY_ZONES } from "@/lib/tz-data";
import { countryList, countryName, countryOfZone, deviceZone, mainZone, utcOffsetLabel, zoneCity } from "@/lib/timezone";

const selectCls =
  "mt-2 block w-full max-w-sm cursor-pointer rounded-xl border border-line bg-bg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary";

/** Where the student takes the SAT: sets the time zone of the Home countdown. */
function TestLocation() {
  const profile = useProfile();
  const [countries] = useState(countryList);
  const [now] = useState(() => Date.now());
  const device = deviceZone();
  const deviceCountry = countryOfZone(device);
  const tz = profile.testTimeZone;
  const cc = tz ? countryOfZone(tz) : undefined;
  const zones = cc ? COUNTRY_ZONES[cc] : [];
  const label = (z: string) => `${zoneCity(z)} (${utcOffsetLabel(z, now)})`;

  // Home's "Change" link points here; the section renders after hydration, so scroll to it ourselves.
  useEffect(() => {
    if (window.location.hash === "#test-location") document.getElementById("test-location")?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div id="test-location" className="scroll-mt-20 rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-semibold">Test location</h2>
      <p className="mt-1 text-sm text-muted">The test-day countdown on Home counts down to 8:00 a.m. in this country&apos;s time.</p>

      <label htmlFor="test-country" className="mt-5 block text-sm font-medium text-muted">
        Country
      </label>
      <select
        id="test-country"
        value={cc ?? ""}
        onChange={(e) => updateProfile({ testTimeZone: e.target.value ? (mainZone(e.target.value) ?? null) : null })}
        className={selectCls}
      >
        <option value="">Automatic: this device ({deviceCountry ? countryName(deviceCountry) : label(device)})</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>

      {zones.length > 1 && (
        <>
          <label htmlFor="test-zone" className="mt-4 block text-sm font-medium text-muted">
            Time zone
          </label>
          <select id="test-zone" value={tz ?? ""} onChange={(e) => updateProfile({ testTimeZone: e.target.value })} className={selectCls}>
            {zones.map(([z, note]) => (
              <option key={z} value={z}>
                {label(z)}
                {note ? ` · ${note}` : ""}
              </option>
            ))}
          </select>
        </>
      )}

      <p className="mt-3 text-xs text-muted">Current: {label(tz ?? device)}{tz ? "" : " · detected from this device"}</p>
    </div>
  );
}

function Editor() {
  const profile = useProfile();
  const attempts = useAttempts();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  /** Uploaded photo (saved or just picked), kept as an option even while an emoji is selected. */
  const [photo, setPhoto] = useState<string | null>(isPhotoAvatar(profile.avatar) ? profile.avatar : null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  // Reset asks twice: "ask" warns, "confirm" names what will be lost; "done" confirms it happened.
  const [reset, setReset] = useState<"idle" | "ask" | "confirm" | "done">("idle");
  const testResults = useTestResults();
  const lessonCount = Object.keys(useLessonProgress()).length;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const losing = [
    attempts.length > 0 && plural(attempts.length, "answered question"),
    testResults.length > 0 && plural(testResults.length, "practice test result"),
    lessonCount > 0 && `progress in ${plural(lessonCount, "lesson")}`,
  ].filter((x): x is string => Boolean(x));
  const dirty = name.trim() !== profile.name || avatar !== profile.avatar;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setPhotoError(null);
    try {
      const url = await fileToAvatar(file);
      setPhoto(url);
      setAvatar(url);
      setSaved(false);
    } catch (err) {
      setPhotoError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim().slice(0, 40), avatar });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <Avatar value={avatar} className="h-20 w-20 text-5xl" alt="Your avatar" />
          <div className="min-w-0">
            <p className="truncate text-xl font-semibold">{name.trim() || "Guest student"}</p>
            <p className="text-sm text-muted">{attempts.length} questions answered</p>
          </div>
        </div>

        <label htmlFor="name" className="mt-8 block text-sm font-medium text-muted">
          Name
        </label>
        <input
          id="name"
          value={name}
          maxLength={40}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          placeholder="What should we call you?"
          className="mt-2 block w-full max-w-sm rounded-xl border border-line bg-bg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        <p className="mt-6 text-sm font-medium text-muted">Avatar</p>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Avatar">
          {photo && (
            <span className="relative">
              <button
                type="button"
                role="radio"
                aria-checked={avatar === photo}
                aria-label="Your photo"
                onClick={() => {
                  setAvatar(photo);
                  setSaved(false);
                }}
                className={`grid h-12 w-12 place-items-center rounded-full border p-0.5 transition-colors ${
                  avatar === photo ? "border-primary ring-1 ring-primary" : "border-line hover:border-muted"
                }`}
              >
                <Avatar value={photo} className="h-full w-full" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoto(null);
                  if (avatar === photo) setAvatar(isPhotoAvatar(profile.avatar) ? AVATARS[0] : profile.avatar);
                  setSaved(false);
                }}
                aria-label="Remove photo"
                title="Remove photo"
                className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-line bg-surface text-muted shadow-sm hover:text-danger"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true">
                  <path d="M7 7l10 10M17 7 7 17" />
                </svg>
              </button>
            </span>
          )}
          {AVATARS.map((a) => (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={avatar === a}
              onClick={() => {
                setAvatar(a);
                setSaved(false);
              }}
              className={`grid h-12 w-12 place-items-center rounded-full border text-2xl transition-colors ${
                avatar === a ? "border-primary bg-primary-soft ring-1 ring-primary" : "border-line bg-bg hover:border-muted"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Upload your own */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" id="avatar-file" onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
            {uploading ? "Processing…" : photo ? "Upload another photo" : "Upload your photo"}
          </button>
          <span className="text-xs text-muted">JPG, PNG or WebP · cropped to a square</span>
        </div>
        {photoError && (
          <p className="mt-2 text-sm text-danger" role="alert">
            {photoError}
          </p>
        )}

        <div className="mt-8 flex items-center gap-3">
          <button
            type="submit"
            disabled={!dirty}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save profile
          </button>
          {saved && !dirty && <span className="text-sm font-medium text-success">Saved</span>}
        </div>
      </form>

      <TestLocation />

      <div className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-semibold">Your goal and progress</h2>
        <p className="mt-1 text-sm text-muted">
          Your target score, test date, and stats live on the{" "}
          <Link href="/" className="font-medium text-primary hover:underline">
            Home
          </Link>{" "}
          tab.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-semibold">Your data</h2>
        <p className="mt-1 text-sm text-muted">
          Everything is saved in this browser only. Sign-in to sync across devices is coming soon.
        </p>
        {reset === "idle" || reset === "done" ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={() => setReset("ask")} className="text-sm font-semibold text-danger hover:underline">
              Reset all progress…
            </button>
            {reset === "done" && (
              <span className="text-sm text-muted" role="status">
                Done: everything was deleted from this browser.
              </span>
            )}
          </div>
        ) : reset === "ask" ? (
          <div className="mt-4 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm">
            <p className="font-medium">This deletes your profile, goal, and all answered questions from this browser. It can&apos;t be undone.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setReset("confirm")} className="rounded-lg bg-danger px-4 py-2 font-semibold text-surface">
                Yes, continue
              </button>
              <button type="button" onClick={() => setReset("idle")} className="rounded-lg px-4 py-2 font-semibold text-muted hover:text-ink">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm" role="alertdialog" aria-labelledby="reset-title">
            <p id="reset-title" className="font-semibold">
              Are you sure? This is the last step.
            </p>
            <p className="mt-1">
              {losing.length ? `You'll lose ${new Intl.ListFormat("en").format(losing)}.` : "Your profile and goal will be deleted."} There&apos;s no backup, so
              it can&apos;t be brought back.
            </p>
            {/* The safe button sits where "Yes, continue" was, so a double click can't delete anything. */}
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setReset("idle")} className="rounded-lg bg-surface px-4 py-2 font-semibold ring-1 ring-line hover:bg-surface-2">
                No, keep my data
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setReset("done");
                  setName("");
                  setAvatar(AVATARS[0]);
                  setPhoto(null);
                }}
                className="rounded-lg bg-danger px-4 py-2 font-semibold text-surface"
              >
                Delete everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfileForm() {
  const hydrated = useHydrated();
  // Wait for browser data so the form starts with the saved values.
  if (!hydrated) return <div className="h-96 animate-pulse rounded-2xl bg-surface-2" />;
  return <Editor />;
}
