"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { I, Icon } from "@/components/bank/icons";
import { LEADERBOARD_MIN_MATCHES } from "@/lib/elo-config";
import { BOARD_MAX_PAGES, BOARD_PAGE_SIZE, seasonLabel, seasonRange, timeUntil, weekLabel, weekRange } from "@/lib/elo-season";
import type { LeaderBoardId, LeaderboardResponse, RankedError } from "@/lib/elo-api-types";
import { AUTH_CONFIGURED, useAuth } from "@/lib/auth-client";
import { getUserId } from "@/lib/store";
import { PAGE } from "@/lib/ui";
import { Podium } from "./Podium";
import { PlayerRow, RowSkeletons, TableHead, type AnyRow } from "./Rows";

const TABS: readonly { id: LeaderBoardId; label: string; blurb: string }[] = [
  { id: "global", label: "Global", blurb: `Current ELO of every player who finished placement (${LEADERBOARD_MIN_MATCHES.global} ranked matches).` },
  { id: "season", label: "Season", blurb: `ELO this month, for players with ${LEADERBOARD_MIN_MATCHES.season}+ ranked matches in it. Resets monthly.` },
  { id: "week", label: "This week", blurb: "Points earned in ranked matches since Monday (UTC). Resets every week." },
];

const btn =
  "inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-surface-2 disabled:opacity-40";
const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover";

type Loaded = { key: string; res: LeaderboardResponse; at: number } | { key: string; err: string; code: RankedError["code"] | "network" };

const asBoard = (v: string | null): LeaderBoardId => (v === "season" || v === "week" ? v : "global");
const asPage = (v: string | null) => {
  const n = Number.parseInt(v ?? "1", 10);
  return Number.isFinite(n) ? Math.min(BOARD_MAX_PAGES, Math.max(1, n)) : 1;
};

export function Leaderboard() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const auth = useAuth();
  const board = asBoard(params.get("board"));
  const page = asPage(params.get("page"));
  const key = `${board}:${page}`;

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    const q = new URLSearchParams({ board, page: String(page), userId: getUserId() });
    fetch(`/api/leaderboard?${q}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (r) => {
        const j = (await r.json().catch(() => null)) as (LeaderboardResponse & Partial<RankedError>) | null;
        if (!r.ok || !j || !Array.isArray(j.rows)) setLoaded({ key, err: j?.error ?? "Couldn't load the leaderboard.", code: j?.code ?? "network" });
        else setLoaded({ key, res: j, at: Date.now() });
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setLoaded({ key, err: "Couldn't reach the server. Check your connection.", code: "network" });
      });
    return () => ctrl.abort();
  }, [board, page, key, retry]);

  const go = useCallback(
    (next: { board?: LeaderBoardId; page?: number }) => {
      const q = new URLSearchParams();
      const b = next.board ?? board;
      const p = next.page ?? 1;
      if (b !== "global") q.set("board", b);
      if (p > 1) q.set("page", String(p));
      const s = q.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [board, pathname, router],
  );

  // Anything loaded for another board/page is stale: show the skeleton until the matching response arrives.
  const cur = loaded && loaded.key === key ? loaded : null;
  const res = cur && "res" in cur ? cur.res : null;
  const tab = TABS.find((t) => t.id === board)!;
  const pages = res ? Math.max(1, Math.min(BOARD_MAX_PAGES, Math.ceil(res.total / BOARD_PAGE_SIZE))) : 1;
  const showPodium = res !== null && res.page === 1 && res.rows.length >= 3;
  const tableRows = res ? (showPodium ? res.rows.slice(3) : res.rows) : [];
  const signedOut = AUTH_CONFIGURED && auth.ready && !auth.user;

  return (
    <section className={PAGE}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="mt-1 text-muted">Ranked matches: the best SAT players by ELO.</p>
        </div>
        <Link href="/ranked" className={btnPrimary}>
          Play ranked
        </Link>
      </div>

      <div className="mt-6 flex rounded-xl border border-line bg-surface-2/60 p-1 sm:inline-flex" role="tablist" aria-label="Leaderboard">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={board === t.id}
            onClick={() => go({ board: t.id })}
            className={`flex-1 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors sm:flex-none ${board === t.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        {tab.blurb}
        {res?.period && <Period board={board} period={res.period} now={cur && "at" in cur ? cur.at : 0} />}
      </p>

      <div className="mt-5" role="tabpanel" aria-label={tab.label} aria-busy={!cur}>
        {!cur ? (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <RowSkeletons />
          </div>
        ) : !res ? (
          <ErrorBox message={(cur as { err: string }).err} setup={(cur as { code: string }).code === "setup"} onRetry={() => { setLoaded(null); setRetry((n) => n + 1); }} />
        ) : res.total === 0 ? (
          <div className="rounded-2xl border border-line bg-surface px-5 py-12 text-center">
            <p className="font-semibold">No ranked players yet</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
              {board === "week" ? "Nobody has played a ranked match this week." : "Nobody has made this board yet."} Be the first.
            </p>
            <Link href="/ranked" className={`${btnPrimary} mt-5`}>
              Play ranked
            </Link>
          </div>
        ) : (
          <>
            {showPodium && (
              <div className="rounded-2xl border border-line bg-surface px-3 pt-6 sm:px-8">
                <Podium rows={res.rows} board={board} />
              </div>
            )}
            {tableRows.length > 0 && (
              <div className={`overflow-hidden rounded-2xl border border-line bg-surface ${showPodium ? "mt-4" : ""}`} role="table" aria-label={`${tab.label} leaderboard`}>
                <TableHead board={board} />
                <div className="divide-y divide-line" role="rowgroup">
                  {tableRows.map((r) => (
                    <PlayerRow key={r.rank} row={r} board={board} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
              <span className="tabular-nums">
                {res.total} player{res.total === 1 ? "" : "s"}
                {res.total > BOARD_PAGE_SIZE * BOARD_MAX_PAGES && ` · showing the top ${BOARD_PAGE_SIZE * BOARD_MAX_PAGES}`}
              </span>
              {pages > 1 && (
                <nav className="flex items-center gap-2" aria-label="Pages">
                  <button type="button" className={btn} disabled={page <= 1} onClick={() => go({ page: page - 1 })} aria-label="Previous page">
                    <Icon d={I.chevronL} className="h-4 w-4" />
                  </button>
                  <span className="min-w-24 text-center font-medium text-ink tabular-nums">
                    {(page - 1) * BOARD_PAGE_SIZE + 1}–{Math.min(page * BOARD_PAGE_SIZE, res.total)}
                  </span>
                  <button type="button" className={btn} disabled={page >= pages} onClick={() => go({ page: page + 1 })} aria-label="Next page">
                    <Icon d={I.chevronR} className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </div>
          </>
        )}

        {/* The viewer's own place, pinned whatever page is open, unless their row is already on screen (then it is just highlighted). */}
        {res && <YouBar me={res.me} board={board} signedOut={signedOut} visible={res.rows.some((r) => r.me)} />}
      </div>
    </section>
  );
}

function Period({ board, period, now }: { board: LeaderBoardId; period: string; now: number }) {
  const range = board === "season" ? seasonRange(period) : weekRange(period);
  // `now` is the time the response arrived (kept in state: reading the clock while rendering isn't allowed).
  const ends = range ? ` · resets in ${timeUntil(range.to, now)}` : "";
  return (
    <span className="font-medium text-ink">
      {" "}
      {board === "season" ? seasonLabel(period) : weekLabel(period)}
      <span className="font-normal text-muted">{ends}</span>
    </span>
  );
}

function YouBar({ me, board, signedOut, visible }: { me: LeaderboardResponse["me"]; board: LeaderBoardId; signedOut: boolean; visible: boolean }) {
  const shell = "sticky bottom-3 z-10 mt-4 overflow-hidden rounded-2xl border border-primary/40 bg-surface shadow-lg";
  if (me && me.rank !== null) {
    if (visible) return null;
    const row: AnyRow = me;
    return (
      <div className={shell} aria-label="Your place">
        <PlayerRow row={row} board={board} />
      </div>
    );
  }
  const need =
    board === "week"
      ? "Play a ranked match this week to get on this board."
      : board === "season"
        ? `Play ${LEADERBOARD_MIN_MATCHES.season} ranked matches this month to join the season board.`
        : me
          ? `Finish placement (${Math.max(0, LEADERBOARD_MIN_MATCHES.global - me.matches)} more match${LEADERBOARD_MIN_MATCHES.global - me.matches === 1 ? "" : "es"}) to join the global board.`
          : `Finish placement (${LEADERBOARD_MIN_MATCHES.global} ranked matches) to join the global board.`;
  return (
    <div className={`${shell} flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-5`}>
      <p>
        <span className="mr-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-ink uppercase">You</span>
        {signedOut ? (
          <>
            <Link href="/login?next=/leaderboard" className="font-semibold underline">
              Sign in
            </Link>{" "}
            to see your place and play ranked.
          </>
        ) : (
          <span className="text-muted">Not ranked yet. {need}</span>
        )}
      </p>
      {!signedOut && (
        <Link href="/ranked" className="font-semibold text-primary-strong underline">
          Play ranked
        </Link>
      )}
    </div>
  );
}

function ErrorBox({ message, setup, onRetry }: { message: string; setup: boolean; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-danger/40 bg-danger-soft px-5 py-8 text-center text-danger" role="alert">
      <p className="font-semibold">{setup ? "Ranked isn't set up yet" : "Couldn't load the leaderboard"}</p>
      <p className="mx-auto mt-1 max-w-md text-sm">{message}</p>
      {!setup && (
        <button type="button" onClick={onRetry} className={`${btn} mt-4 text-ink`}>
          Try again
        </button>
      )}
    </div>
  );
}
