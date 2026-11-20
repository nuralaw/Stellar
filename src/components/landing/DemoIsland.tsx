"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { CarouselTimer, useCarousel } from "@/components/auth/carousel";
import { CountUp } from "@/components/home/CountUp";
import { Stage } from "@/components/lessons/visuals/Stage";
import { ExampleChip } from "@/components/plus/PlusMark";
import { LESSON_STEPS } from "@/components/plus/previews";
import { FOCUS } from "@/components/plus/styles";
import { INTERVALS } from "@/lib/review";
import { Tag, type TagKind } from "./Tag";

// The landing page's "product demo" island: an app window in the centre that plays one animated mini-UI per feature, and the
// selector under it (its text is the feature list for search engines). All scenes are CSS/SVG with theme tokens, choreographed
// with animation delays (demo-* in globals.css; every element's own style is its final state, so reduced motion shows finished
// scenes). The fake UI is aria-hidden; each scene has an sr-only sentence. The carousel logic is shared with the sign-up screen.

export interface DemoScene {
  id: "bank" | "tests" | "lessons" | "vocab" | "mistakes" | "stats";
  label: string;
  /** One or two real sentences: shown in the selector button. */
  benefit: string;
  tag: TagKind;
  /** The fake address-bar path, e.g. "/practice". */
  address: string;
  /** What the scene shows, for screen readers. */
  description: string;
}

interface Props {
  scenes: DemoScene[];
  word: { word: string; pos: string; def: string } | null;
  vocabWords: number | null;
  /** Three real skill names for the "Weakest skills" example. */
  weakSkills: string[];
  /** The lesson's animated visual, made on the server (null if there is none). */
  lesson: ReactNode;
}

const INTERVAL_MS = 6500;
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });
const days = (d: number) => (d === 1 ? "day" : "days");

const CHIPS = [
  { text: "Free to start · no card", pos: "-left-8 top-36", delay: "0s" },
  { text: "Questions come with explanations", pos: "-right-8 top-44", delay: "-1.3s" },
  { text: "Progress saved on every device", pos: "-left-6 bottom-28", delay: "-2.4s" },
  { text: "Past Digital SAT papers", pos: "-right-7 bottom-20", delay: "-3.1s" },
];

export function DemoIsland({ scenes, word, vocabWords, weakSkills, lesson }: Props) {
  const c = useCarousel(scenes.length, { intervalMs: INTERVAL_MS });
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Nothing animates while the island is scrolled out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scene = scenes[c.cur];
  // The mini-UIs are drawn for a 400px stage; on wider stages they are scaled up so they don't float in empty space.
  const zoomed = (node: ReactNode) => <div className="flex h-full w-full items-center justify-center xl:[zoom:1.3]">{node}</div>;
  const view: Record<DemoScene["id"], ReactNode> = {
    bank: zoomed(<SceneBank />),
    tests: zoomed(<SceneTests />),
    lessons: <SceneLessons lesson={lesson} />,
    vocab: zoomed(<SceneVocab word={word} vocabWords={vocabWords} />),
    mistakes: zoomed(<SceneMistakes />),
    stats: zoomed(<SceneStats weakSkills={weakSkills} />),
  };

  return (
    <section ref={rootRef} aria-roledescription="carousel" aria-label="Stellar demo" data-demo-play={inView ? "on" : "off"} {...c.root} className="mt-10 md:mt-12">
      {/* The window, with a soft glow behind it and decorative chips at its edges (large screens). */}
      <div className="relative isolate mx-auto max-w-5xl">
        <div aria-hidden="true" className="demo-glow absolute -inset-x-8 -inset-y-10 -z-10" />
        <div aria-hidden="true" className="hidden 2xl:block">
          {CHIPS.map((x) => (
            <div key={x.text} className={`absolute z-20 ${x.pos}`}>
              <span className="feat-float inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink shadow-lg ring-1 ring-line" style={{ animationDelay: x.delay }}>
                <Icon d={I.check} className="h-3.5 w-3.5 text-success" strokeWidth={3} />
                {x.text}
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl bg-surface ring-1 ring-line shadow-[0_30px_80px_-40px_rgb(0_0_0/0.35)]">
          <div className="flex h-11 items-center gap-3 border-b border-line px-4">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
            </span>
            <span aria-hidden="true" className="mx-auto flex h-7 w-full max-w-xs items-center justify-center truncate rounded-full bg-surface-2 px-4 text-xs font-medium text-muted">
              stellar1600.com{scene.address}
            </span>
            {!c.reduced && (
              <button
                type="button"
                onClick={() => c.setPlaying((p) => !p)}
                aria-label={c.playing ? "Pause demo" : "Play demo"}
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink ${FOCUS}`}
              >
                {c.playing ? <Icon d="M9 6v12M15 6v12" className="h-4 w-4" /> : <Icon d={I.play} className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* The stage has a fixed size, so a scene change never moves the page. */}
          <div className="relative h-[400px] overflow-hidden bg-bg/40 md:h-auto md:min-h-[420px] md:aspect-[16/9]" aria-live={c.running ? "off" : "polite"} {...c.swipe}>
            <div
              key={`${c.cur}-${c.visits[c.cur]}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${c.cur + 1} of ${c.n}: ${scene.label}`}
              className="demo-scene-in absolute inset-0 touch-pan-y"
            >
              <p className="sr-only">{scene.description}</p>
              <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center p-4 [container-type:size] sm:p-6">
                {view[scene.id]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One button per scene: title, a real benefit sentence, Free / Plus, and the autoplay progress of the current one. */}
      <ul
        aria-label="Choose a feature"
        className="mt-8 -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3"
      >
        {scenes.map((s, i) => {
          const active = i === c.cur;
          return (
            <li key={s.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => c.pick(i)}
                aria-current={active ? "true" : undefined}
                className={`flex h-full w-full flex-col rounded-2xl p-4 text-left transition-colors ${
                  active ? "bg-surface ring-2 ring-primary-strong" : "bg-surface ring-1 ring-line hover:bg-surface-2"
                } ${FOCUS}`}
              >
                <span className="text-base font-semibold tracking-tight">{s.label}</span>
                <span className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.benefit}</span>
                <span className="mt-3 block">
                  <Tag kind={s.tag} />
                </span>
                <span aria-hidden="true" className="mt-auto block pt-3">
                  <span className="relative block h-1 overflow-hidden rounded-full bg-line">{active && <CarouselTimer c={c} className="absolute inset-0 rounded-full bg-primary-strong" />}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ scenes */

/** a. Question bank: a cursor picks C, it turns green, then the explanation slides up. */
function SceneBank() {
  const rows = [
    ["A", "3"],
    ["B", "4"],
    ["C", "5"],
    ["D", "15"],
  ];
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-surface-2 px-2.5 py-1 font-semibold">Algebra · Medium</span>
        <ExampleChip />
      </div>
      <p className="mt-3 text-sm font-semibold sm:text-base">If 3x + 5 = 20, what is the value of x?</p>
      <div className="relative mt-3">
        <ul className="space-y-1.5">
          {rows.map(([l, t]) => {
            const right = l === "C";
            return (
              <li
                key={l}
                className={`flex h-9 items-center gap-3 rounded-xl border px-3 text-sm sm:h-10 ${right ? "demo-choice border-success bg-success-soft" : "border-line bg-surface"}`}
                style={right ? at(1900) : undefined}
              >
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${right ? "bg-surface text-success ring-1 ring-success" : "bg-surface-2"}`}>
                  {right ? <Icon d={I.check} className="h-3.5 w-3.5" strokeWidth={3} /> : l}
                </span>
                <span className="font-medium">{t}</span>
                {right && (
                  <span className="demo-pop ml-auto text-xs font-semibold text-success" style={at(2000)}>
                    Correct
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <svg viewBox="0 0 24 24" className="demo-cursor pointer-events-none absolute top-[100px] left-[58%] z-10 h-6 w-6 text-ink drop-shadow sm:top-[110px]" style={at(400)}>
          <path d="M5 3l14 7-6 2-2 6L5 3Z" fill="currentColor" stroke="var(--surface)" strokeWidth={1.5} strokeLinejoin="round" />
        </svg>
      </div>
      <div className="demo-rise mt-3 rounded-xl bg-surface-2 p-3 text-[13px] leading-relaxed" style={at(2700)}>
        <p className="font-semibold">Explanation</p>
        <p className="mt-0.5 text-muted">
          Subtract 5 from both sides to get{" "}
          <span className="demo-mark rounded bg-accent-soft px-1 font-semibold text-ink" style={at(3300)}>
            3x = 15
          </span>
          , then divide by 3. So x = 5.
        </p>
      </div>
    </div>
  );
}

/** b. Practice tests: a ticking timer and a filling question navigator, then a crossfade to the score report. */
function SceneTests() {
  const secs = [59, 58, 57, 56, 55, 54, 53, 52];
  return (
    <div className="relative h-full w-full max-w-lg">
      <div className="demo-phase-out absolute inset-0 flex flex-col justify-center opacity-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">Module 1 · Reading and Writing</p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold tabular-nums">
            <Icon d={I.clock} className="h-4 w-4 text-muted" />
            <span className="flex">
              31:
              <span className="inline-block h-[1.25em] overflow-hidden leading-[1.25em]">
                <span className="demo-tick block -translate-y-[87.5%]" style={at(300)}>
                  {secs.map((s) => (
                    <span key={s} className="block h-[1.25em]">
                      {s}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2.5 w-full rounded bg-surface-2" />
          <div className="h-2.5 w-[88%] rounded bg-surface-2" />
          <div className="h-2.5 w-[64%] rounded bg-surface-2" />
        </div>
        <p className="mt-5 text-xs font-semibold text-muted">Question navigator</p>
        <div className="mt-2 grid grid-cols-10 gap-1.5">
          {Array.from({ length: 20 }, (_, i) => (
            <span key={i} className="demo-lit h-5 rounded-md bg-primary-soft text-primary-strong ring-1 ring-primary/30" style={at(400 + i * 120)} />
          ))}
        </div>
      </div>

      <div className="demo-fade absolute inset-0 flex flex-col justify-center" style={at(3500)}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          Score report
          <ExampleChip />
        </div>
        <p className="mt-2 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight">
            <CountUp value={1450} delay={3700} duration={1200} />
          </span>
          <span className="text-sm text-muted">out of 1600</span>
        </p>
        <ul className="mt-5 space-y-3">
          {[
            { label: "Reading and Writing", v: 730, delay: 3900 },
            { label: "Math", v: 720, delay: 4100 },
          ].map((r) => (
            <li key={r.label}>
              <div className="flex justify-between text-xs">
                <span className="font-medium">{r.label}</span>
                <span className="text-muted tabular-nums">{r.v} / 800</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-line">
                <div className="demo-grow-x h-full rounded-full bg-primary-strong" style={{ width: `${(r.v / 800) * 100}%`, ...at(r.delay) }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** c. Lessons: the stages light up one by one above the real lesson animation. */
function SceneLessons({ lesson }: { lesson: ReactNode }) {
  return (
    <div className="flex h-full w-full max-w-2xl flex-col items-center gap-3">
      <ol className="flex flex-wrap justify-center gap-1.5">
        {LESSON_STEPS.map((s, i) => (
          <li key={s.label} className="demo-lit inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-strong ring-1 ring-primary/30" style={at(500 + i * 1100)}>
            <Icon d={s.icon} className="h-3.5 w-3.5" />
            {s.label}
          </li>
        ))}
      </ol>
      {lesson && (
        <div className="mx-auto aspect-[16/9] overflow-hidden rounded-xl bg-surface ring-1 ring-line" style={{ width: "min(100cqw, calc((100cqh - 4.5rem) * 16 / 9))" }}>
          <Stage className="h-full w-full p-[3%]">{lesson}</Stage>
        </div>
      )}
    </div>
  );
}

/** d. Vocabulary: a flashcard flips to its definition, then "Got it" is pressed. */
function SceneVocab({ word, vocabWords }: { word: Props["word"]; vocabWords: number | null }) {
  const w = word ?? { word: "ephemeral", pos: "adjective", def: "Lasting for a very short time." };
  return (
    <div className="flex w-full max-w-xs flex-col items-center">
      <div className="[perspective:900px] w-full">
        <div className="grid">
          <div className="demo-out col-start-1 row-start-1 rounded-2xl bg-surface p-6 text-center opacity-0 shadow-xl ring-1 ring-line" style={at(1500)}>
            <p className="text-3xl font-bold tracking-tight">{w.word}</p>
            <p className="text-sm text-muted italic">{w.pos}</p>
          </div>
          <div className="demo-flip-in col-start-1 row-start-1 rounded-2xl bg-surface p-6 shadow-xl ring-1 ring-line" style={at(1850)}>
            <p className="text-2xl font-bold tracking-tight">{w.word}</p>
            <p className="text-sm text-muted italic">{w.pos}</p>
            <p className="mt-3 text-[15px]">{w.def}</p>
          </div>
        </div>
      </div>
      <div className="demo-rise mt-5 flex gap-2" style={at(2400)}>
        <span className="rounded-full border border-line px-4 py-1.5 text-sm font-semibold">Again</span>
        <span className="demo-press rounded-full bg-primary-strong px-4 py-1.5 text-sm font-semibold text-primary-ink" style={at(3200)}>
          Got it
        </span>
      </div>
      {vocabWords !== null && (
        <p className="demo-fade mt-4 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold tabular-nums" style={at(600)}>
          {vocabWords.toLocaleString("en-US")} SAT words
        </p>
      )}
    </div>
  );
}

/** e. Mistakes: a wrong answer lands in the list, then the review schedule lights up to "Due today". */
function SceneMistakes() {
  const steps = INTERVALS.map((d) => `${d} ${days(d)}`);
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between gap-2 text-sm font-semibold">
        Mistakes
        <ExampleChip />
      </div>
      <div className="demo-rise mt-3 flex items-center gap-3 rounded-xl border border-line bg-surface p-3" style={at(300)}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-danger-soft text-danger">
          <Icon d={I.x} className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs text-muted">Algebra · Medium · wrong once</p>
          <div className="h-2 w-[80%] rounded bg-surface-2" />
        </div>
      </div>
      <p className="mt-5 text-xs font-semibold text-muted">Review schedule: {INTERVALS.join(" → ")} days</p>
      <ol className="mt-3 grid grid-cols-4 gap-1 text-center">
        {[{ l: "Missed", miss: true }, ...steps.map((l) => ({ l, miss: false }))].map((s, i) => (
          <li key={s.l} className="flex flex-col items-center gap-1.5">
            <span
              className={`demo-lit grid h-9 w-9 place-items-center rounded-full text-xs font-bold ${s.miss ? "bg-danger-soft text-danger" : "bg-primary-soft text-primary-strong ring-1 ring-primary/30"}`}
              style={at(1100 + i * 600)}
            >
              {s.miss ? <Icon d={I.x} className="h-4 w-4" strokeWidth={2.5} /> : INTERVALS[i - 1]}
            </span>
            <span className="text-xs font-medium">{s.l}</span>
          </li>
        ))}
      </ol>
      <p className="demo-pop mt-5 w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-primary-strong" style={at(3300)}>
        Due today
      </p>
    </div>
  );
}

/** f. Score progress: a line draws up through four example tests toward the target, then the weakest skills slide in. */
function SceneStats({ weakSkills }: { weakSkills: string[] }) {
  const pts = [
    { x: 40, y: 134, v: 1150 },
    { x: 125, y: 111, v: 1220 },
    { x: 210, y: 82, v: 1310 },
    { x: 295, y: 59, v: 1380 },
  ];
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join("");
  const acc = [48, 55, 61];
  return (
    <div className="grid w-full max-w-2xl items-center gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div>
        <div className="flex items-center justify-between gap-2 text-sm font-semibold">
          Score trend
          <ExampleChip />
        </div>
        <svg viewBox="0 0 340 170" className="mt-2 block w-full">
          {[150, 100, 50].map((y) => (
            <line key={y} x1={30} x2={330} y1={y} y2={y} stroke="var(--line)" strokeWidth={1} />
          ))}
          <line x1={30} x2={330} y1={36} y2={36} stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 4" />
          <text x={34} y={30} className="fill-muted text-[10px] font-medium">
            Target 1450
          </text>
          <path d={line} pathLength={1} fill="none" stroke="var(--primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" className="demo-draw" style={at(300)} />
          {pts.map((p, i) => (
            <circle
              key={p.x}
              cx={p.x}
              cy={p.y}
              r={i === pts.length - 1 ? 5 : 4}
              fill={i === pts.length - 1 ? "var(--primary)" : "var(--surface)"}
              stroke={i === pts.length - 1 ? "var(--surface)" : "var(--primary)"}
              strokeWidth={i === pts.length - 1 ? 2 : 1.5}
              className="demo-pop [transform-box:fill-box] [transform-origin:center]"
              style={at(500 + i * 420)}
            />
          ))}
          <text x={pts[3].x + 10} y={pts[3].y} dy="0.32em" className="demo-fade fill-ink text-xs font-bold" style={at(2000)}>
            1380
          </text>
          {pts.map((p, i) => (
            <text key={p.x} x={p.x} y={166} textAnchor="middle" className="fill-muted text-[9px]">
              Test {i + 1}
            </text>
          ))}
        </svg>
      </div>
      <div className="demo-rise" style={at(2600)}>
        <p className="text-sm font-semibold">Weakest skills</p>
        <ul className="mt-2 space-y-2.5">
          {weakSkills.slice(0, 3).map((s, i) => (
            <li key={s}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="min-w-0 truncate font-medium">{s}</span>
                <span className="shrink-0 text-muted tabular-nums">{acc[i]}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-line">
                <div className="demo-grow-x h-full rounded-full bg-primary-strong" style={{ width: `${acc[i]}%`, ...at(2900 + i * 200) }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
