"use client";

import { useAppPathname } from "@/lib/use-app-pathname";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { LogoMark } from "@/components/Logo";
import { AUTH_CONFIGURED, useAuth } from "@/lib/auth-client";
import { ACCOUNT_NAV, NAV_GROUPS, PLUS_NAV } from "@/lib/nav";
import { isBarePath } from "@/lib/public-paths";
import { INTERVALS } from "@/lib/review";
import { useHydrated, useProfile } from "@/lib/store";

// First-run tour of the sidebar: a square "dynamic island" that explains one sidebar button at a time.
// Desktop (lg+): it sits next to the real item (data-tour="<href>" on the desktop sidebar, see Sidebar.tsx), with a
// notch pointing at it, and slides from item to item. Mobile: fixed at the bottom, no pointer.
// Shows once after sign-up (on Home, signed in, flag "stellar:tour-done" not set); startTour() runs it again.

const DONE_KEY = "stellar:tour-done";
const SIZE = 288; // island is w-72 h-72 on desktop
const GAP = 16; // between sidebar item and island
const EDGE = 8; // min distance to the viewport edge
const MOVE = "500ms cubic-bezier(0.2, 0.8, 0.2, 1)";
const ACTIVE = "data-tour-active";

// ---- what each button says (keyed by href; the label comes from lib/nav.ts) ----
const COPY: Record<string, string> = {
  "/": "Today's plan, your SAT countdown, your streak and what to practice next.",
  "/lessons": "Short interactive lessons for every SAT skill, with worked examples and Desmos walkthroughs. Lessons come with Plus.",
  "/vocabulary": "SAT words and math terms, with flashcards and quizzes to make them stick.",
  "/statistics": "Your accuracy, score trend and progress by section and skill. Plus adds a predicted score.",
  "/practice": "Questions by topic and difficulty. College Board questions are free; the General bank comes with Plus.",
  "/mistakes": `Every question you got wrong, ready to try again. With Plus they come back on a ${INTERVALS.join("-")} day schedule.`,
  "/test": "Timed past-paper tests, module by module, with an estimated score and a full review.",
  "/compete": "Timed rounds every week, with leaderboards to see how you rank.",
  "/profile": "Your name, avatar, SAT date and account.",
  "/plus": "See what Plus adds to the free site, from every past paper to spaced review of your mistakes.",
};

type Step = { key: string; title: string; body: string; icon: string | null };

/** Every sidebar item in sidebar order (Learn, Practice, Tournaments, then Profile and Stellar Plus; not the admin one). */
const ITEMS = [...NAV_GROUPS.flatMap((g) => g.items), ...ACCOUNT_NAV, PLUS_NAV];
const STEPS: Step[] = [
  { key: "intro", title: "Welcome to Stellar!", body: "Here's what each button in the sidebar does.", icon: null },
  ...ITEMS.map((i) => ({ key: i.href, title: i.label, body: COPY[i.href] ?? `Opens ${i.label}.`, icon: i.icon })),
];
const LAST = STEPS.length - 1;

// ---- tour state: a tiny external store, so startTour() works from anywhere ----
type TourState = { active: boolean; step: number; closing: boolean };
const IDLE: TourState = { active: false, step: 0, closing: false };
let tour = IDLE;
const subs = new Set<() => void>();
let doneInMemory = false; // when localStorage is blocked, at least don't nag again this visit

function setTour(patch: Partial<TourState>) {
  tour = { ...tour, ...patch };
  subs.forEach((f) => f());
}
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function isDone() {
  if (doneInMemory) return true;
  try {
    return localStorage.getItem(DONE_KEY) !== null;
  } catch {
    return false;
  }
}

function markDone() {
  doneInMemory = true;
  try {
    localStorage.setItem(DONE_KEY, "1");
  } catch {}
}

/** Runs the tour from the start, even if it was done before ("Show the sidebar tour again" on /profile). */
export function startTour() {
  doneInMemory = false;
  try {
    localStorage.removeItem(DONE_KEY);
  } catch {}
  setTour({ active: true, step: 0, closing: false });
}

/** Skip and Finish: remember it's done, fade out. */
function finishTour() {
  if (!tour.active || tour.closing) return;
  markDone();
  if (reducedMotion()) return setTour({ ...IDLE });
  setTour({ closing: true });
  setTimeout(() => setTour({ ...IDLE }), 230);
}

function nextStep() {
  if (!tour.active || tour.closing) return;
  if (tour.step >= LAST) finishTour();
  else setTour({ step: tour.step + 1 });
}

// ---- geometry (desktop) ----
type Pos = { left: number; top: number; /** Y of the notch inside the island; null = no pointer. */ notch: number | null };

const targetFor = (step: number) => document.querySelector<HTMLElement>(`aside[data-rail] [data-tour="${STEPS[step].key}"]`);

function place(el: HTMLElement | null): Pos {
  const vh = window.innerHeight;
  const r = el?.getBoundingClientRect();
  if (!el || !r || r.width === 0) return { left: Math.round((window.innerWidth - SIZE) / 2), top: Math.round(Math.max(EDGE, (vh - SIZE) / 2)), notch: null };
  const cy = r.top + r.height / 2;
  const top = Math.min(Math.max(cy - SIZE / 2, EDGE), Math.max(EDGE, vh - SIZE - EDGE));
  return { left: Math.round(r.right + GAP), top: Math.round(top), notch: Math.round(Math.min(Math.max(cy - top, 28), SIZE - 28)) };
}

const DESKTOP = "(min-width: 1024px)";
function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(DESKTOP);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
}

export function SidebarTour() {
  const t = useSyncExternalStore(subscribe, () => tour, () => IDLE);
  const pathname = useAppPathname();
  const auth = useAuth();
  const hydrated = useHydrated();
  const bare = isBarePath(pathname);
  // (Without Supabase there are no accounts: let the tour run from the button on /profile.)
  const signedIn = Boolean(auth.user) || !AUTH_CONFIGURED;
  const signedOut = auth.ready && !signedIn;

  // First run: on Home, signed in, not done yet. Starts a moment after the page is up.
  useEffect(() => {
    if (t.active || !hydrated || pathname !== "/" || !auth.ready || !auth.user) return;
    let id: ReturnType<typeof setTimeout>;
    const attempt = () => {
      if (isDone() || tour.active) return;
      // Mobile menu drawer open (it's not inert then): wait until it's closed.
      const drawer = document.querySelector("[data-tour-skip]");
      if (drawer && !drawer.hasAttribute("inert")) id = setTimeout(attempt, 600);
      else setTour({ active: true, step: 0, closing: false });
    };
    id = setTimeout(attempt, 600);
    return () => clearTimeout(id);
  }, [t.active, hydrated, pathname, auth.ready, auth.user]);

  // Signed out (another tab) or on a bare page: drop it without marking it done.
  useEffect(() => {
    if (t.active && (bare || signedOut)) setTour({ ...IDLE });
  }, [t.active, bare, signedOut]);

  // The page changed under the tour (browser Back, …): end it, without marking it done.
  const startPath = useRef<string | null>(null);
  useEffect(() => {
    if (!t.active) startPath.current = null;
    else if (startPath.current === null) startPath.current = pathname;
    else if (startPath.current !== pathname) setTour({ ...IDLE });
  }, [t.active, pathname]);

  // Esc = Skip, Enter / → = Next, only with focus in the island or on the page itself (never while typing somewhere).
  // Enter on a focused button keeps its own meaning.
  useEffect(() => {
    if (!t.active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target instanceof HTMLElement ? e.target : null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      const inScope = !el || el === document.body || Boolean(el.closest("[data-tour-root]"));
      if (e.key === "Escape") {
        e.preventDefault();
        finishTour();
      } else if (inScope && (e.key === "ArrowRight" || (e.key === "Enter" && !el?.closest("button, a")))) {
        e.preventDefault();
        nextStep();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t.active]);

  if (!t.active || !hydrated || bare || !signedIn) return null;
  return <TourIsland step={t.step} closing={t.closing} />;
}

function TourIsland({ step, closing }: { step: number; closing: boolean }) {
  const desktop = useDesktop();
  const name = useProfile().name.trim();
  const id = useId();
  const islandRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const lastPos = useRef<Pos | null>(null);
  const prevStep = useRef(step);
  const [pos, setPos] = useState<Pos | null>(null);
  const [settled, setSettled] = useState(false); // false until the first placement: no sliding in from the corner
  const s = STEPS[step];
  const n = step + 1;

  const title = step === 0 && name ? `Welcome to Stellar, ${name}!` : s.title;
  const body = step === 0 && !desktop ? `${s.body} Open the menu ☰ to find these pages.` : s.body;
  const ready = !desktop || pos !== null;
  const slide = settled && !reducedMotion(); // reduced motion: the island jumps to the next item

  // Desktop: follow the target item (it moves when the sidebar collapses or scrolls) and ring it.
  useEffect(() => {
    if (!desktop) return;
    targetFor(step)?.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
    let raf = 0;
    let first = true;
    const tick = () => {
      const el = targetFor(step);
      if (el && !el.hasAttribute(ACTIVE)) el.setAttribute(ACTIVE, "");
      const next = place(el);
      const p = lastPos.current;
      if (!p || p.left !== next.left || p.top !== next.top || p.notch !== next.notch) {
        lastPos.current = next;
        setPos(next);
      }
      if (first) {
        first = false;
        raf = requestAnimationFrame(() => {
          setSettled(true);
          raf = requestAnimationFrame(tick);
        });
      } else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.querySelectorAll(`[${ACTIVE}]`).forEach((e) => e.removeAttribute(ACTIVE));
    };
  }, [desktop, step]);

  // A little "dynamic island" squish on every step change.
  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    if (reducedMotion()) return;
    islandRef.current?.animate([{ transform: "scale(0.96)" }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
  }, [step]);

  // The tour is modal: everything else on the page is inert (no clicks, no Tab) until it closes, and focus goes back
  // to where it was. Runs before the "focus Next" effect below, so it can remember the previous focus.
  useEffect(() => {
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const made: Element[] = [];
    // The page's own top-level pieces: sidebar, top bar, drawer, theme switch, content, support button. The island, its
    // overlay (data-tour-root) and toasts (data-tour-keep) stay live. The mobile drawer (data-tour-skip) manages its own
    // inert (closed = inert) and the tour never starts while it is open. Any other already-inert node is left alone.
    document.querySelectorAll("body > :is(aside, div, button, nav, header, footer, main):not([data-tour-root], [data-tour-keep], [data-tour-skip])").forEach((el) => {
      if (el.hasAttribute("inert")) return;
      el.setAttribute("inert", "");
      made.push(el);
    });
    return () => {
      made.forEach((el) => el.removeAttribute("inert"));
      if (prev && prev !== document.body && prev.isConnected) prev.focus({ preventScroll: true });
    };
  }, []);

  // Focus Next as soon as the island is on screen.
  useEffect(() => {
    if (ready) nextRef.current?.focus({ preventScroll: true });
  }, [ready]);

  return (
    <>
      {/* Dims the page (on desktop: not the sidebar). Doesn't close the tour when clicked. */}
      <div
        data-tour-root
        data-chrome
        data-closing={closing || undefined}
        aria-hidden="true"
        className="tour-overlay fixed inset-0 z-[45] bg-black/40 lg:left-64 lg:sb-collapsed:left-[72px]"
      />
      {ready && (
        <div
          data-tour-root
          data-chrome
          className={desktop ? "fixed z-[60]" : "pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"}
          style={desktop && pos ? { left: pos.left, top: pos.top, transition: slide ? `top ${MOVE}, left ${MOVE}` : "none" } : undefined}
        >
          <div
            ref={islandRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-body`}
            data-closing={closing || undefined}
            className="tour-island pointer-events-auto relative flex aspect-square max-h-[calc(100dvh-2rem)] w-[min(20rem,calc(100vw-2rem))] flex-col rounded-3xl bg-side/75 p-5 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.55)] ring-1 ring-white/10 backdrop-blur-xl lg:aspect-auto lg:h-72 lg:w-72"
          >
            {/* Points at the sidebar item */}
            {desktop && pos?.notch != null && (
              <span
                aria-hidden="true"
                className="absolute -left-2 h-4 w-2 bg-side/75"
                style={{ top: pos.notch - 8, clipPath: "polygon(100% 0, 100% 100%, 0 50%)", transition: slide ? `top ${MOVE}` : "none" }}
              />
            )}

            <p className="text-xs font-medium text-side-muted tabular-nums" aria-hidden="true">
              Step {n} of {STEPS.length}
            </p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${(n / STEPS.length) * 100}%` }} />
            </div>

            {/* Keyed by step: the tile pops in, its icon draws itself, the text fades up one line after the other. */}
            <div key={step} className="mt-4 min-h-0 flex-1 overflow-y-auto">
              <span className="lesson-pop grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-side-accent">
                {s.icon ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={s.icon} pathLength={1} className="tour-draw" />
                  </svg>
                ) : (
                  <LogoMark variant="onDark" className="h-6" />
                )}
              </span>
              <h2 id={`${id}-title`} className="lesson-in mt-3 text-lg leading-tight font-semibold break-words text-side-ink [animation-delay:120ms]">
                {title}
              </h2>
              <p id={`${id}-body`} className="lesson-in mt-1.5 text-[13px] leading-snug text-side-muted [animation-delay:200ms]">
                {body}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={finishTour}
                className="-ml-2 inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-medium text-side-muted transition-colors hover:text-side-ink"
              >
                Skip
              </button>
              <button
                ref={nextRef}
                type="button"
                onClick={nextStep}
                className="inline-flex min-h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
              >
                {step === LAST ? "Finish" : "Next"}
              </button>
            </div>

            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {`Step ${n} of ${STEPS.length}. ${title}. ${body}`}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
