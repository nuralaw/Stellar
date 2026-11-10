"use client";

import Link from "next/link";
import { useState } from "react";
import { AVATARS, resetAllData, updateProfile, useAttempts, useHydrated, useProfile } from "@/lib/store";

function Editor() {
  const profile = useProfile();
  const attempts = useAttempts();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = name.trim() !== profile.name || avatar !== profile.avatar;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim().slice(0, 40), avatar });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-accent-soft text-5xl">{avatar}</span>
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
        {!confirmReset ? (
          <button type="button" onClick={() => setConfirmReset(true)} className="mt-4 text-sm font-semibold text-danger hover:underline">
            Reset all progress…
          </button>
        ) : (
          <div className="mt-4 rounded-xl border border-danger/40 bg-danger-soft p-4 text-sm">
            <p className="font-medium">This deletes your profile, goal, and all answered questions from this browser. It can&apos;t be undone.</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setConfirmReset(false);
                  setName("");
                  setAvatar(AVATARS[0]);
                }}
                className="rounded-lg bg-danger px-4 py-2 font-semibold text-surface"
              >
                Yes, reset everything
              </button>
              <button type="button" onClick={() => setConfirmReset(false)} className="rounded-lg px-4 py-2 font-semibold text-muted hover:text-ink">
                Cancel
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
