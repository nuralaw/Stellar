"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publicAvatar } from "@/components/Avatar";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/components/plus/styles";
import type { PlayResponse } from "@/lib/elo-api-types";
import { exitFullscreen, requestFullscreenNow, useCanFullscreen } from "@/lib/fullscreen";
import { useProfile } from "@/lib/store";
import { GO_KEY, RankedApiError, rankedPost } from "./api";
import { Rules, RulesIcon } from "./Rules";

/** "Play ranked": the rules dialog, then full screen (this click is the user gesture), then the server's match, then its page. */
export function useStartRanked() {
  const profile = useProfile();
  const router = useRouter();
  const canFullscreen = useCanFullscreen();
  const [gate, setGate] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<RankedApiError | null>(null);

  const start = async () => {
    setStarting(true);
    setError(null);
    if (canFullscreen && !(await requestFullscreenNow())) {
      setStarting(false);
      setGate(false);
      setError(new RankedApiError("Your browser didn't allow full screen, so the match wasn't started. Try again, or use another browser.", "fullscreen", 0));
      return;
    }
    try {
      const r = await rankedPost<PlayResponse>("/api/ranked/play", { mode: "mixed", name: profile.name, avatar: await publicAvatar(profile.avatar) });
      try {
        sessionStorage.setItem(GO_KEY, r.matchId);
      } catch {}
      router.push(`/ranked/${r.matchId}`);
    } catch (e) {
      exitFullscreen();
      setGate(false);
      setStarting(false);
      setError(e as RankedApiError);
    }
  };

  const dialog = gate ? <StartDialog fullscreen={canFullscreen} busy={starting} onCancel={() => !starting && setGate(false)} onStart={start} /> : null;
  return { openGate: () => setGate(true), starting, error, clearError: () => setError(null), dialog };
}

function StartDialog({ fullscreen, busy, onCancel, onStart }: { fullscreen: boolean; busy: boolean; onCancel: () => void; onStart: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="ranked-start-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <RulesIcon />
        <h2 id="ranked-start-title" className="mt-4 text-xl font-bold tracking-tight">
          Before you play
        </h2>
        <div className="mt-3">
          <Rules fullscreen={fullscreen} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" autoFocus onClick={onStart} disabled={busy} className={`${BTN_PRIMARY} flex-1 disabled:opacity-40`}>
            {busy ? "Finding a match…" : fullscreen ? "Start in full screen" : "I understand, start"}
          </button>
          <button type="button" onClick={onCancel} className={`${BTN_SECONDARY} border-transparent bg-transparent`}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
