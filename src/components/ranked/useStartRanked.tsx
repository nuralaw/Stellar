"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publicAvatar } from "@/components/Avatar";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/components/plus/styles";
import type { QueueState } from "@/lib/elo-api-types";
import { useCanFullscreen } from "@/lib/fullscreen";
import { useProfile } from "@/lib/store";
import { RankedApiError, rankedPost } from "./api";
import { Rules, RulesIcon } from "./Rules";

/**
 * "Play ranked": the rules dialog, then the player joins the matchmaking queue (no full screen yet: that comes with the click on the
 * match's ready screen). `send` takes the join request and handles the queue state it answers with (the hub keeps the order of
 * its queue requests that way); without it the player goes on to /ranked (searching) or straight to the match when an opponent was
 * found at once. `search` joins without the dialog ("Search again").
 */
export function useStartRanked(send?: (req: Promise<QueueState>) => Promise<void>) {
  const profile = useProfile();
  const router = useRouter();
  const [gate, setGate] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<RankedApiError | null>(null);

  const search = async () => {
    setStarting(true);
    setError(null);
    try {
      const avatar = await publicAvatar(profile.avatar);
      const req = rankedPost<QueueState>("/api/ranked/queue", { mode: "mixed", name: profile.name, avatar });
      if (send) await send(req);
      else {
        const q = await req;
        router.push(q.status === "matched" && q.matchId ? `/ranked/${q.matchId}` : "/ranked");
      }
      setGate(false);
      setStarting(false);
    } catch (e) {
      setGate(false);
      setStarting(false);
      setError(e as RankedApiError);
    }
  };

  const dialog = gate ? <StartDialog busy={starting} onCancel={() => !starting && setGate(false)} onStart={search} /> : null;
  return { openGate: () => setGate(true), search, starting, error, clearError: () => setError(null), dialog };
}

function StartDialog({ busy, onCancel, onStart }: { busy: boolean; onCancel: () => void; onStart: () => void }) {
  const canFullscreen = useCanFullscreen();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4" onClick={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="ranked-start-title" onClick={(e) => e.stopPropagation()} className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <RulesIcon />
        <h2 id="ranked-start-title" className="mt-4 text-xl font-bold tracking-tight">
          Before you play
        </h2>
        <div className="mt-3">
          <Rules fullscreen={canFullscreen} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" autoFocus onClick={onStart} disabled={busy} className={`${BTN_PRIMARY} flex-1 disabled:opacity-40`}>
            {busy ? "Joining the queue…" : "Find an opponent"}
          </button>
          <button type="button" onClick={onCancel} className={`${BTN_SECONDARY} border-transparent bg-transparent`}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
