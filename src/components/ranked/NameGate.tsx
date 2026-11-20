"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { AVATARS, updateProfile, useProfile } from "@/lib/store";
import { BTN_PRIMARY, FOCUS } from "@/components/plus/styles";

/** Name + picture other players will see (same fields as the tournament and Profile). Saves into the profile. */
export function NameGate({ hint, onSaved }: { hint?: string | null; onSaved: () => void }) {
  const profile = useProfile();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const choices = AVATARS.includes(avatar as (typeof AVATARS)[number]) ? [...AVATARS] : [avatar, ...AVATARS];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const n = name.trim().slice(0, 24);
        if (!n) return;
        updateProfile({ name: n, avatar });
        onSaved();
      }}
      className="rounded-2xl border border-primary/40 bg-primary-soft/40 p-5 sm:p-6"
    >
      <label htmlFor="ranked-name" className="font-semibold">
        Choose your public name
      </label>
      <p className="mt-1 text-sm text-muted">Opponents and the leaderboard show it with your picture. You can change both later in Profile.</p>
      {hint && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {hint}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Avatar value={avatar} className="h-12 w-12 text-2xl" />
        <input
          id="ranked-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          autoComplete="nickname"
          placeholder="e.g. Aru"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:max-w-xs"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Picture">
        {choices.map((a, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={avatar === a}
            aria-label={`Picture ${i + 1}`}
            onClick={() => setAvatar(a)}
            className={`grid h-10 w-10 place-items-center rounded-full border text-xl transition-colors ${FOCUS} ${avatar === a ? "border-primary bg-surface ring-2 ring-primary" : "border-line bg-surface hover:bg-surface-2"}`}
          >
            <Avatar value={a} className="h-8 w-8 text-xl" />
          </button>
        ))}
      </div>
      <button type="submit" disabled={!name.trim()} className={`${BTN_PRIMARY} mt-4 disabled:opacity-40`}>
        Save and continue
      </button>
    </form>
  );
}
