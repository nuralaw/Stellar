"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { RichText } from "@/components/RichText";
import { DifficultyBadge } from "@/components/bank/QuestionCard";
import { SolveView, type Run } from "@/components/bank/SolveView";
import { lastResults, skillName, useBankIndex, type BankItem } from "@/components/bank/data";
import { I, Icon } from "@/components/bank/icons";
import { PlusLock } from "@/components/PlusLock";
import { Dismissible, HideButton } from "@/components/plus/Dismissible";
import { ReviewTimeline } from "@/components/plus/previews";
import { LINK_STRONG } from "@/components/plus/styles";
import { useAccess } from "@/lib/access";
import { sourceOpen } from "@/lib/sources";
import { INTERVALS, dueLabel, reviewQueue, type MistakeCard } from "@/lib/review";
import { useAttempts, useBookmarks, useHydrated, useNow } from "@/lib/store";
import type { Difficulty } from "@/lib/types";
import { PAGE, estMinutes } from "@/lib/ui";

type Tab = "due" | "upcoming" | "mastered";
const TABS: { id: Tab; label: string; short: string }[] = [
  { id: "due", label: "Due now", short: "Due" },
  { id: "upcoming", label: "Coming back", short: "Later" },
  { id: "mastered", label: "Mastered", short: "Mastered" },
];

const fmt = (n: number) => n.toLocaleString("en-US");

function Steps({ c, mastered }: { c: MistakeCard; mastered: boolean }) {
  // One dot per review step: filled = passed.
  const passed = mastered ? INTERVALS.length : c.stage;
  return (
    <span className="flex items-center gap-1" title={mastered ? "Mastered" : `Step ${c.stage + 1} of ${INTERVALS.length}: back after ${INTERVALS[c.stage]} day${INTERVALS[c.stage] === 1 ? "" : "s"}`}>
      {INTERVALS.map((d, i) => (
        <span key={d} className={`h-1.5 w-4 rounded-full ${i < passed ? "bg-primary" : "bg-surface-2"}`} />
      ))}
    </span>
  );
}

export function Mistakes() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const access = useAccess();
  const canReview = access.can("mistake-review");
  const now = useNow();
  const attempts = useAttempts();
  const bookmarkList = useBookmarks();
  const { items, error } = useBankIndex();
  const [tab, setTab] = useState<Tab>("due");
  const [run, setRun] = useState<Run | null>(null);

  const byId = useMemo(() => new Map((items ?? []).map((it) => [it.id, it])), [items]);
  const results = useMemo(() => lastResults(attempts), [attempts]);
  const bookmarks = useMemo(() => new Set(bookmarkList), [bookmarkList]);
  // While a set is open the list isn't shown, so the queue only matters between sets.
  const queue = useMemo(() => (now ? reviewQueue(attempts, now) : { due: [], upcoming: [], mastered: [] }), [attempts, now]);
  const canBank = access.can("question-bank");
  // Only questions the visitor can open (without Plus, General-bank questions stay hidden).
  const known = (list: MistakeCard[]) => list.filter((c) => byId.has(c.qid) && sourceOpen(byId.get(c.qid)!.source, canBank));
  const lists: Record<Tab, MistakeCard[]> = { due: known(queue.due), upcoming: known(queue.upcoming), mastered: known(queue.mastered) };
  const hiddenCount = canBank ? 0 : [...queue.due, ...queue.upcoming, ...queue.mastered].filter((c) => byId.has(c.qid) && !sourceOpen(byId.get(c.qid)!.source, false)).length;
  // Free: one flat list of every mistake, newest first (no schedule).
  const all = [...lists.due, ...lists.upcoming, ...lists.mastered].sort((a, b) => b.lastAt - a.lastAt);
  const shown = canReview ? lists[tab] : all;

  const start = (ids: string[], title: string, at = 0) => {
    setRun({ ids, items: byId, title, start: at, from: "Mistakes" });
    window.scrollTo({ top: 0 });
  };
  const reviewDue = () => start(lists.due.map((c) => c.qid), `Review · ${lists.due.length} due`);

  // ?review=1 (Home's "Next up"): start the due set right away, once.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStarted.current || !items || !now || !access.ready || params.get("review") !== "1") return;
    autoStarted.current = true;
    window.history.replaceState(null, "", "/mistakes");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time start from a link
    if (canReview && lists.due.length) reviewDue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, now, access.ready]);

  if (run)
    return (
      <SolveView
        key={run.ids.join() + run.start}
        run={run}
        results={results}
        bookmarks={bookmarks}
        onExit={() => setRun(null)}
        onRestart={(ids, title) => start(ids, title)}
      />
    );

  const loading = !hydrated || !items || !now || !access.ready;
  const dueMinutes = estMinutes(lists.due.length, lists.due.every((c) => c.section === "math") ? "math" : lists.due.some((c) => c.section === "math") ? "mixed" : "rw");

  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Mistakes</h1>
      <p className="mt-2 max-w-2xl text-muted">
        {canReview ? (
          "Every question you got wrong comes back after 1, 3 and 7 days. Get it right each time and it's mastered. Practicing early is fine, but only reviews on the due day move it forward."
        ) : (
          <>
            Every question you got wrong in the Question Bank, in one place. Practice them again whenever you like.
            {access.ready && (
              <>
                {" "}
                Plus adds{" "}
                <Link href="/plus#review" className={LINK_STRONG}>
                  spaced review
                </Link>
                .
              </>
            )}
          </>
        )}
      </p>

      {error && <p className="mt-6 rounded-xl border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger">Couldn&apos;t load the question bank ({error}).</p>}

      {/* Summary + main action */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-center">
        {loading ? (
          <div className="h-16 animate-pulse rounded-xl bg-surface-2" />
        ) : !canReview ? (
          <>
            <div>
              <p className="text-sm font-medium text-muted">Mistakes</p>
              <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{fmt(all.length)}</p>
            </div>
            {all.length > 0 ? (
              <button
                type="button"
                onClick={() => start(all.map((c) => c.qid), `Mistakes · ${all.length}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
              >
                <Icon d={I.play} className="h-4 w-4" filled />
                Practice all {fmt(all.length)}
              </button>
            ) : (
              <p className="text-sm text-muted md:text-right">Nothing to review yet.</p>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              {[
                { label: "Due now", value: lists.due.length, cls: lists.due.length ? "text-primary" : "" },
                { label: "Coming back", value: lists.upcoming.length, cls: "" },
                { label: "Mastered", value: lists.mastered.length, cls: "" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-sm font-medium text-muted">{s.label}</p>
                  <p className={`mt-1 text-3xl font-bold tracking-tight tabular-nums ${s.cls}`}>{fmt(s.value)}</p>
                </div>
              ))}
            </div>
            {lists.due.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[13px] text-muted">about {dueMinutes} min</span>
                <button type="button" onClick={reviewDue} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
                  <Icon d={I.play} className="h-4 w-4" filled />
                  Review {fmt(lists.due.length)} due
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted md:text-right">
                {lists.upcoming.length ? `Nothing due. Next review ${dueLabel(lists.upcoming[0].dueDay, now)}.` : "Nothing to review yet."}
              </p>
            )}
          </>
        )}
      </div>

      {/* Mistakes from the General bank (Plus) aren't listed without Plus */}
      {!loading && hiddenCount > 0 && (
        <p className="mt-3 text-sm text-muted">
          {fmt(hiddenCount)} more from the General bank open with Plus.{" "}
          <Link href="/plus#compare" className={LINK_STRONG}>
            See what&apos;s in Plus
          </Link>
        </p>
      )}

      {/* Spaced review is Plus */}
      {!loading && !canReview && all.length > 0 && (
        <Dismissible id="mistakes">
          {(hide) => (
            <PlusLock
              variant="card"
              feature="review"
              className="mt-4"
              title={
                lists.due.length > 0
                  ? `${lists.due.length} of your ${all.length} mistakes would be due for review today`
                  : `Spaced review would bring your ${all.length} ${all.length === 1 ? "mistake" : "mistakes"} back on a schedule`
              }
              body="With Plus, each one comes back after 1, 3 and 7 days until you get it right every time. Your list below stays free."
              preview={<ReviewTimeline compact />}
              aside={<HideButton onClick={hide} />}
            />
          )}
        </Dismissible>
      )}

      {/* Tabs */}
      {canReview && (
      <div className="mt-8 flex gap-6 border-b border-line" role="tablist" aria-label="Mistakes">
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.id)}
              className={`relative -mb-px flex shrink-0 items-center gap-2 border-b-2 pb-3 text-[15px] font-semibold whitespace-nowrap transition-colors ${on ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              <span className="sm:hidden">{t.short}</span>
              <span className="hidden sm:inline">{t.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${on ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted"}`}>
                {loading ? "–" : fmt(lists[t.id].length)}
              </span>
            </button>
          );
        })}
      </div>
      )}

      {/* List */}
      {loading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface-2" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
          <p className="font-semibold">
            {!canReview ? "No mistakes yet" : tab === "due" ? "You're all caught up" : tab === "upcoming" ? "Nothing scheduled" : "Nothing mastered yet"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {attempts.length === 0 || !canReview
              ? "Questions you get wrong in the Question Bank will show up here."
              : tab === "mastered"
                ? "Get a mistake right on its 1-, 3- and 7-day reviews to master it."
                : "Wrong answers from the Question Bank land here automatically."}
          </p>
          {attempts.length === 0 && (
            <Link href="/practice" className="mt-4 inline-block rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-2">
              Open the Question Bank
            </Link>
          )}
        </div>
      ) : (
        <>
          {canReview && tab !== "due" && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => start(shown.map((c) => c.qid), `${tab === "upcoming" ? "Mistakes coming back" : "Mastered mistakes"} · ${shown.length}`)}
                className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:bg-surface-2"
              >
                Practice these {fmt(shown.length)}
              </button>
            </div>
          )}
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {shown.map((c, i) => {
              const it = byId.get(c.qid) as BankItem;
              return (
                <li key={c.qid}>
                  <button
                    type="button"
                    onClick={() => start(shown.map((x) => x.qid), `${canReview ? TABS.find((t) => t.id === tab)!.label : "Mistakes"} · ${shown.length}`, i)}
                    className="group flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-surface-2/50 sm:px-5"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                        <span className="font-mono font-medium text-ink/70">#{it.n}</span>
                        <span className="font-medium">{skillName(it)}</span>
                        <span>· wrong {c.wrong}×</span>
                        {canReview && (
                          <span className={`sm:hidden ${tab === "due" ? "font-semibold text-primary" : ""}`}>· {tab === "mastered" ? "mastered" : dueLabel(c.dueDay, now)}</span>
                        )}
                      </span>
                      <span className="mt-1 line-clamp-2 text-[15px] leading-relaxed">
                        {it.preview ? <RichText text={it.preview} math={it.section === "math"} /> : <span className="text-muted italic">Question with a figure</span>}
                      </span>
                    </span>
                    <span className="hidden shrink-0 flex-col items-end gap-2 self-center sm:flex">
                      <DifficultyBadge d={it.difficulty as Difficulty} />
                      {canReview && (
                        <span className="flex items-center gap-2 text-xs text-muted">
                          <Steps c={c} mastered={tab === "mastered"} />
                          <span className={tab === "due" ? "font-semibold text-primary" : ""}>{tab === "mastered" ? "mastered" : dueLabel(c.dueDay, now)}</span>
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
