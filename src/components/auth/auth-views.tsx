import Link from "next/link";
import type { ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { CountUp } from "@/components/home/CountUp";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { ExampleChip, PlusMark } from "@/components/plus/PlusMark";
import { LaunchSentence } from "@/components/plus/PlusPersonal";
import { ReviewMini, ReviewTimeline, SampleMistake, ScoreMini, ScreenFrame, StepsStrip, TestsPreview } from "@/components/plus/previews";
import { BTN_PRIMARY, EYEBROW, LINK_STRONG } from "@/components/plus/styles";
import type { AuthFacts } from "@/lib/auth-facts";
import { getLessons } from "@/lib/lessons";
import { MAIN_NAV, PLUS_NAV, STATS_ICON } from "@/lib/nav";
import { PLAN_ORDER, PLUS } from "@/lib/plus-config";
import { INTERVALS } from "@/lib/review";
import { DOMAINS } from "@/lib/taxonomy";
import { FeatureCarousel, type FeatureSlide } from "./FeatureCarousel";
import { TabLink } from "./AuthTabs";
import { PlanPicker } from "./PlanPicker";
import { PlusShowcase, type Benefit } from "./PlusShowcase";
import { StellarArt } from "./StellarArt";
import { makeStars } from "./stars";

// The three panels of /register and /login (server-rendered; the tab switching and the carousel are client components).
// Every number comes from AuthFacts / lib/plus-config / lib/review, never typed in by hand.

/** Which lesson the Features tab shows (the owner can change this). */
const LESSON_SLUG = "linear-functions";

const num = (n: number) => n.toLocaleString("en-US");
const iconOf = (href: string) => MAIN_NAV.find((i) => i.href === href)?.icon ?? "";
const H2 = "lesson-in mt-2 text-2xl font-bold tracking-tight text-balance md:text-3xl";
const CARD = "rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)]";

/* ------------------------------------------------------------------ Account */

export function AccountView({ mode, facts, children }: { mode: "register" | "signin"; facts: AuthFacts; children: ReactNode }) {
  return (
    <>
      <AuthBackdrop variant="account" />
      {/* One tree: below xl a centred single column; at xl a two-column grid (card | art) with the links under the card. */}
      <div className="flex w-full flex-col items-center xl:ml-[calc(37.5vw-12rem-16rem)] xl:grid xl:max-w-[68.5rem] xl:min-w-0 xl:flex-1 xl:grid-cols-[24rem_minmax(0,42rem)] xl:grid-rows-[auto_auto] xl:items-stretch xl:gap-x-10 xl:gap-y-4">
        <p className="lesson-in mb-5 w-full max-w-sm text-2xl leading-tight font-bold tracking-tight text-balance xl:hidden">Prep for the Digital SAT, all in one place</p>
        <div className="lesson-in w-full max-w-sm [animation-delay:80ms] xl:col-start-1 xl:row-start-1 xl:h-full xl:max-w-none">{children}</div>
        {/* /register: the art's minimum = the sign-up card's height, so the row doesn't grow (and jump) when the form
            replaces the shorter "Loading…" card. /login's card fits the default 26rem. */}
        <StellarArt facts={facts} className={`hidden xl:col-start-2 xl:row-start-1 xl:flex ${mode === "register" ? "xl:min-h-[30rem]" : ""}`} />
        <p className="lesson-in mt-4 flex w-full max-w-sm flex-wrap gap-x-5 gap-y-1 text-sm [animation-delay:160ms] xl:col-start-1 xl:row-start-2 xl:mt-0 xl:max-w-none">
          <TabLink to="features" className={LINK_STRONG}>
            See all features →
          </TabLink>
          <TabLink to="pricing" className={LINK_STRONG}>
            Pricing →
          </TabLink>
        </p>
      </div>
    </>
  );
}

/* ----------------------------------------------------------------- Backdrop */

type Variant = "features" | "pricing" | "account";

const CONSTELLATION: Record<Variant, [number, number][]> = {
  features: [[20, 150], [70, 130], [115, 140], [150, 105], [215, 95], [240, 40], [285, 60]],
  pricing: [[20, 60], [80, 30], [140, 70], [200, 40], [260, 90], [230, 160], [150, 150]],
  account: [[20, 100], [70, 60], [130, 80], [180, 30], [240, 70], [280, 140]],
};
const SEED: Record<Variant, number> = { features: 1000, pricing: 2000, account: 3000 };
/** Where the glow, the constellation and the shooting star sit. The account panel has the art on its right, so its decorations lean left. */
const POSITION: Record<Variant, { glowA: string; glowB: string; constellation: string; shoot: string }> = {
  features: {
    glowA: "-top-40 -right-40",
    glowB: "-bottom-48 -left-24",
    constellation: "right-10 w-[16rem] lg:block",
    shoot: "left-[62%]",
  },
  pricing: {
    glowA: "-top-40 -right-40",
    glowB: "-bottom-48 -left-24",
    constellation: "left-[38%] w-[14rem] lg:block",
    shoot: "left-[48%] [animation-delay:4.5s]",
  },
  account: {
    glowA: "-top-40 -left-40",
    glowB: "-right-24 -bottom-48",
    constellation: "left-10 w-[11rem] xl:block",
    shoot: "left-[34%] [animation-delay:2s]",
  },
};

/** Quiet star-themed background of the Features and Pricing panels (the panel must be `relative isolate overflow-hidden`). */
function AuthBackdrop({ variant }: { variant: Variant }) {
  const pts = CONSTELLATION[variant];
  const pos = POSITION[variant];
  const last = pts[pts.length - 1];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className={`absolute ${pos.glowA} h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_10%,transparent),transparent)]`} />
      <div className={`absolute ${pos.glowB} h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_6%,transparent),transparent)]`} />
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(var(--color-line)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      <svg viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-ink opacity-40 dark:opacity-60">
        {makeStars(60, SEED[variant]).map((st, i) => (
          <circle
            key={i}
            cx={st.cx}
            cy={st.cy}
            r={st.r}
            fill="currentColor"
            opacity={st.o}
            className={st.twinkle ? "art-twinkle" : undefined}
            style={st.twinkle ? { animationDelay: `${st.delay}s`, animationDuration: `${st.dur}s` } : undefined}
          />
        ))}
      </svg>
      <svg
        viewBox="0 0 300 200"
        className={`absolute ${variant === "account" ? "top-4" : "top-6"} hidden text-ink opacity-25 dark:opacity-35 ${pos.constellation}`}
      >
        <polyline pathLength={1} fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="stat-line" points={pts.map((p) => p.join(",")).join(" ")} />
        {pts.slice(0, -1).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" />
        ))}
        <circle cx={last[0]} cy={last[1]} r="3.5" fill="#f97316" className="art-pulse" />
      </svg>
      <span
        className={`art-shoot absolute top-[14%] h-px w-32 bg-linear-to-r from-transparent via-ink/50 to-transparent ${pos.shoot}`}
      />
    </div>
  );
}

/* ----------------------------------------------------------------- Features */

type TagKind = "free" | "plus" | "both";

function Tag({ kind }: { kind: TagKind }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold";
  if (kind === "free") return <span className={`${base} bg-success-soft text-success`}>Free</span>;
  if (kind === "plus")
    return (
      <span className={`${base} bg-accent-soft text-primary-strong`}>
        <Icon d={I.star} filled className="h-3 w-3" />
        Plus
      </span>
    );
  return <span className={`${base} bg-surface-2 text-ink`}>Free · more with Plus</span>;
}

function FeatureSlide({ icon, tag, title, stat, body, extra, visual }: { icon: string; tag: TagKind; title: string; stat?: ReactNode; body: string; extra?: ReactNode; visual?: ReactNode }) {
  return (
    <article className="grid items-center gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] xl:gap-12">
      <div>
        <span className="lesson-pop grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary-strong ring-1 ring-primary/20">
          <Icon d={icon} className="h-6 w-6" />
        </span>
        <p className="lesson-in mt-5 [animation-delay:60ms]">
          <Tag kind={tag} />
        </p>
        <h3 className="lesson-in mt-3 text-2xl font-bold tracking-tight md:text-3xl [animation-delay:100ms]">{title}</h3>
        {stat && <p className="lesson-in mt-2 text-lg font-semibold text-primary-strong [animation-delay:160ms]">{stat}</p>}
        <p className="lesson-in mt-3 max-w-md text-muted [animation-delay:220ms]">{body}</p>
        {extra && <div className="lesson-in [animation-delay:280ms]">{extra}</div>}
      </div>
      {visual && <div className="lesson-in [animation-delay:180ms]">{visual}</div>}
    </article>
  );
}

function BankMini({ compact = false }: { compact?: boolean }) {
  const domains = [...DOMAINS.filter((d) => d.section === "rw").slice(0, 2), ...DOMAINS.filter((d) => d.section === "math").slice(0, 2)].slice(0, compact ? 3 : 4);
  const widths = [72, 48, 85, 60];
  return (
    <div aria-hidden="true" className={CARD}>
      <ExampleChip />
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-bg px-3 py-2 text-sm text-muted">
        <Icon d={I.search} className="h-4 w-4 shrink-0" />
        Filter by topic and difficulty
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2">
          {["Easy", "Medium", "Hard"].map((d) => (
            <span key={d} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium">
              {d}
            </span>
          ))}
        </div>
      )}
      <ul className={`${compact ? "mt-3 space-y-2.5" : "mt-4 space-y-3"}`}>
        {domains.map((d, i) => (
          <li key={d.id} className="lesson-in" style={{ animationDelay: `${250 + i * 70}ms` }}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">{d.name}</span>
              <span className="shrink-0 text-xs text-muted tabular-nums">{d.skills.length} skills</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-line">
              <div className="stat-grow h-full rounded-full bg-primary-strong" style={{ width: `${widths[i]}%`, animationDelay: `${350 + i * 70}ms` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VocabMini({ word }: { word: { word: string; pos: string; def: string } }) {
  return (
    <div aria-hidden="true" className="relative mx-auto my-3 max-w-sm">
      <div className="absolute inset-0 rotate-3 rounded-2xl bg-surface-2 ring-1 ring-line" />
      <div className="absolute inset-0 -rotate-2 rounded-2xl bg-surface-2 ring-1 ring-line" />
      <div className="feat-flip relative rounded-2xl bg-surface p-6 shadow-xl ring-1 ring-line">
        <p className="text-3xl font-bold tracking-tight">{word.word}</p>
        <p className="text-sm text-muted italic">{word.pos}</p>
        <p className="mt-3 text-[15px]">{word.def}</p>
        <div className="mt-5 flex gap-2">
          <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold">Again</span>
          <span className="rounded-full bg-primary-strong px-3 py-1 text-xs font-semibold text-primary-ink">Got it</span>
        </div>
      </div>
    </div>
  );
}

const TREND = [38, 46, 44, 58, 64, 72];

function StatsMini() {
  return (
    <div aria-hidden="true" className="grid gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-end">
      <div className={CARD}>
        <ExampleChip />
        <p className="mt-2 text-sm font-semibold">Score trend</p>
        <div className="mt-3 flex h-32 items-end gap-2 border-b border-line">
          {TREND.map((h, i) => (
            <div
              key={i}
              className={`stat-rise flex-1 rounded-t-md ${i === TREND.length - 1 ? "bg-primary-strong" : "bg-primary-strong/80"}`}
              style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      </div>
      <ScoreMini />
    </div>
  );
}

function TournamentMini() {
  // Order on screen: 2nd, 1st, 3rd.
  const podium = [
    { rank: 2, height: 60, delay: 120 },
    { rank: 1, height: 85, delay: 0 },
    { rank: 3, height: 45, delay: 240 },
  ];
  return (
    <div aria-hidden="true" className={CARD}>
      <div className="flex justify-center">
        <span className="feat-float">
          <span className="lesson-pop grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary-strong ring-1 ring-primary/20">
            <Icon d={iconOf("/compete")} className="h-6 w-6" />
          </span>
        </span>
      </div>
      <div className="mt-4 flex h-40 items-end gap-3">
        {podium.map((p) => (
          <div
            key={p.rank}
            className={`stat-rise flex flex-1 justify-center rounded-t-xl pt-2 text-2xl font-bold tabular-nums ${
              p.rank === 1 ? "bg-primary-strong text-primary-ink" : "bg-surface-2 text-ink ring-1 ring-line"
            }`}
            style={{ height: `${p.height}%`, animationDelay: `${p.delay}ms` }}
          >
            {p.rank}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturesView({ facts }: { facts: AuthFacts }) {
  const { tests: t, lessons: l, free: f, questions, word } = facts;
  const general = f.generalQuestions;
  const lessonTitle = getLessons().find((m) => m.slug === LESSON_SLUG)?.title ?? LESSON_SLUG;
  const lessonArt = lessonVisual(LESSON_SLUG);

  const slides: FeatureSlide[] = [
    {
      id: "bank",
      label: "Question Bank",
      content: (
        <FeatureSlide
          icon={iconOf("/practice")}
          tag="both"
          title="Question Bank"
          stat={
            questions !== null && (
              <>
                <CountUp value={questions} delay={200} /> practice questions
              </>
            )
          }
          body={`Official College Board questions are free.${general ? ` Plus adds ${num(general)} past-paper questions.` : " Plus adds past-paper questions."} Filter by topic and difficulty.`}
          visual={<BankMini />}
        />
      ),
    },
    {
      id: "tests",
      label: "Practice tests",
      content: (
        <FeatureSlide
          icon={iconOf("/test")}
          tag="both"
          title="Practice tests"
          stat={
            <>
              <CountUp value={t.total} delay={200} /> past-paper tests
            </>
          }
          body={`Every Digital SAT past paper from ${t.firstYear} to ${t.lastYear}, timed module by module, then an estimated score and a review of every question. The ${t.free} newest are free.`}
          visual={t.tiles.length > 0 ? <TestsPreview tiles={t.tiles} /> : undefined}
        />
      ),
    },
    {
      id: "lessons",
      label: "Lessons",
      content: (
        <FeatureSlide
          icon={iconOf("/lessons")}
          tag="plus"
          title="Lessons"
          stat={
            <>
              <CountUp value={l.total} delay={200} /> interactive lessons
            </>
          }
          body="One short lesson per skill. Watch the idea play out, follow a worked example, check yourself, then finish with real SAT questions."
          extra={<StepsStrip />}
          visual={
            lessonArt ? (
              <ScreenFrame tone="light" label={`Lesson · ${lessonTitle}`}>
                {lessonArt}
              </ScreenFrame>
            ) : undefined
          }
        />
      ),
    },
    {
      id: "vocab",
      label: "Vocabulary",
      content: (
        <FeatureSlide
          icon={iconOf("/vocabulary")}
          tag="free"
          title="Vocabulary"
          stat={
            f.vocabWords !== null && (
              <>
                <CountUp value={f.vocabWords} delay={200} /> SAT words
              </>
            )
          }
          body="Learn SAT words with flashcards and quizzes."
          visual={word ? <VocabMini word={word} /> : undefined}
        />
      ),
    },
    {
      id: "stats",
      label: "Statistics",
      content: (
        <FeatureSlide
          icon={STATS_ICON}
          tag="both"
          title="Statistics"
          stat="Score trend and accuracy"
          body="Track your score trend, accuracy and each section for free. Plus adds a predicted score and ranks the skills costing you the most points."
          visual={<StatsMini />}
        />
      ),
    },
    {
      id: "mistakes",
      label: "Mistakes",
      content: (
        <FeatureSlide
          icon={iconOf("/mistakes")}
          tag="both"
          title="Mistakes"
          stat={`${INTERVALS.join(" → ")} day review`}
          body={`Every wrong answer is saved to practice again. With Plus, each one comes back ${INTERVALS[0]} day later, then ${INTERVALS[1]} days after that, then ${INTERVALS[2]}, until it sticks.`}
          visual={
            <div aria-hidden="true">
              <div className="rounded-2xl border border-line bg-surface p-5">
                <ReviewTimeline />
              </div>
              <SampleMistake />
            </div>
          }
        />
      ),
    },
    {
      id: "compete",
      label: "Tournament",
      content: <FeatureSlide icon={iconOf("/compete")} tag="free" title="Weekly tournament" stat="Every week" body="Weekly rounds with leaderboards, free for everyone." visual={<TournamentMini />} />,
    },
  ];

  return (
    <>
      <AuthBackdrop variant="features" />
      <div className="relative mx-auto max-w-5xl">
        <p className={`lesson-in ${EYEBROW}`}>Features</p>
        <h2 className={`${H2} [animation-delay:70ms]`}>What&apos;s inside Stellar</h2>
        <p className="lesson-in mt-3 max-w-xl text-muted [animation-delay:140ms]">Free to start. Plus unlocks the rest, see Pricing.</p>
        <div className="lesson-in mt-8 [animation-delay:200ms]">
          <FeatureCarousel slides={slides} />
        </div>
      </div>
    </>
  );
}


/* ------------------------------------------------------------------ Pricing */

/** Pricing tab: "Weakest skills" with real skill names and sample accuracies. */
function WeakMini() {
  const picks = [DOMAINS[0], DOMAINS[Math.floor(DOMAINS.length / 2)], DOMAINS[DOMAINS.length - 1]].map((d) => d.skills[0]);
  const acc = [48, 55, 61];
  return (
    <div aria-hidden="true" className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <ExampleChip />
        <p className="text-sm font-semibold">Weak skills</p>
      </div>
      <ul className="mt-3 space-y-3">
        {picks.map((s, i) => (
          <li key={s.id} className="lesson-in" style={{ animationDelay: `${150 + i * 70}ms` }}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">{s.name}</span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted tabular-nums">{acc[i]}%</span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold">Practice</span>
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-line">
              <div className="stat-grow h-full rounded-full bg-primary-strong" style={{ width: `${acc[i]}%`, animationDelay: `${250 + i * 70}ms` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Big decorative "Stellar1600Plus" at the bottom right of the Pricing panel (the panel is `relative isolate overflow-hidden`). */
function Watermark() {
  return (
    <p
      aria-hidden="true"
      className="pointer-events-none absolute right-4 bottom-3 -z-10 select-none bg-linear-to-r from-ink/[0.06] via-accent/30 to-ink/[0.06] bg-[length:200%_100%] bg-clip-text text-[clamp(2.75rem,8vw,7rem)] leading-none font-black tracking-tighter text-transparent feat-shine sm:right-8 lg:right-12 lg:bottom-6"
    >
      Stellar1600Plus
    </p>
  );
}

function FreeCard({ mode, facts }: { mode: "register" | "signin"; facts: AuthFacts }) {
  const { tests: t, free: f } = facts;
  const items: { title: string; line: string }[] = [
    { title: "College Board bank", line: f.cbQuestions ? `${num(f.cbQuestions)} official questions` : "Official questions" },
    { title: "Newest practice tests", line: `The ${t.free} newest past papers` },
    { title: "Vocabulary", line: f.vocabWords ? `${num(f.vocabWords)} words, with practice` : "SAT words, with practice" },
    { title: "Statistics", line: "Score trend and accuracy" },
    { title: "Mistakes list", line: "Wrong answers to practice again" },
    { title: "Weekly tournament", line: "Rounds and leaderboards" },
  ];
  return (
    <div className="lesson-cover flex flex-col rounded-3xl bg-surface p-4 ring-1 ring-line [animation-delay:120ms]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-semibold">Free</p>
        <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">Forever</span>
      </div>
      <p className="mt-1 text-3xl font-bold tabular-nums">$0</p>
      <p className="text-[13px] text-muted">No card, no trial clock.</p>
      <ul className="mt-3 space-y-2">
        {items.map((x, i) => (
          <li key={x.title} className="lesson-in flex gap-2.5" style={{ animationDelay: `${200 + i * 60}ms` }}>
            <span className="lesson-pop mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-soft text-success" style={{ animationDelay: `${260 + i * 60}ms` }}>
              <Icon d={I.check} className="h-3 w-3" strokeWidth={3} />
            </span>
            <span>
              <span className="block text-sm leading-5 font-semibold">{x.title}</span>
              <span className="block text-xs leading-4 text-muted">{x.line}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <TabLink to="account" focusForm className={`${BTN_PRIMARY} w-full`}>
          {mode === "register" ? "Create a free account" : "Sign in"}
        </TabLink>
      </div>
    </div>
  );
}

export function PricingView({ mode, facts }: { mode: "register" | "signin"; facts: AuthFacts }) {
  const { tests: t, lessons: l, free: f } = facts;
  const general = f.generalQuestions;
  const anyPrice = PLAN_ORDER.some((id) => PLUS.plans[id].amountCents !== null);
  const lessonTitle = getLessons().find((m) => m.slug === LESSON_SLUG)?.title ?? LESSON_SLUG;
  const lessonArt = lessonVisual(LESSON_SLUG);
  const NOT_INCLUDED = "Not included";

  const benefits: Benefit[] = [
    {
      id: "tests",
      icon: iconOf("/test"),
      title: `All ${t.total} practice tests`,
      adds: `Free covers the ${t.free} newest. Plus opens every past paper from ${t.firstYear} to ${t.lastYear}, timed like test day.`,
      free: `${t.free} newest`,
      plus: `All ${t.total}`,
      visual: <TestsPreview tiles={t.tiles.slice(0, 2)} />,
    },
    {
      id: "bank",
      icon: iconOf("/practice"),
      title: "Full question bank",
      adds: general ? `Adds ${num(general)} past-paper questions to the free College Board bank.` : "Adds past-paper questions to the free College Board bank.",
      free: "College Board questions",
      plus: general ? `+ ${num(general)} past-paper questions` : "+ past-paper questions",
      visual: <BankMini compact />,
    },
    {
      id: "lessons",
      icon: iconOf("/lessons"),
      title: `All ${l.total} lessons`,
      adds: "A short interactive lesson for every skill: see the idea, work an example, check yourself, then try real SAT questions.",
      free: NOT_INCLUDED,
      plus: `All ${l.total}`,
      visual: lessonArt ? (
        <div className="mx-auto max-w-[18rem]">
          <ScreenFrame tone="light" label={`Lesson · ${lessonTitle}`}>
            {lessonArt}
          </ScreenFrame>
        </div>
      ) : null,
    },
    {
      id: "predicted",
      icon: STATS_ICON,
      title: "Predicted score",
      adds: "An estimate from your latest three full practice tests, with a likely range.",
      free: NOT_INCLUDED,
      plus: "Score + likely range",
      visual: <StatsMini />,
    },
    {
      id: "weak",
      icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
      title: "Weakest skills",
      adds: `Ranks the skills costing you the most points, with a breakdown of all ${f.skills} skills and a Practice button for each.`,
      free: NOT_INCLUDED,
      plus: `Breakdown of all ${f.skills} skills`,
      visual: <WeakMini />,
    },
    {
      id: "mistakes",
      icon: iconOf("/mistakes"),
      title: "Spaced review of mistakes",
      adds: `Free keeps the list. Plus brings each mistake back ${INTERVALS[0]} day later, then ${INTERVALS[1]} days after that, then ${INTERVALS[2]}, until it sticks.`,
      free: "List to practice again",
      plus: `Review after ${INTERVALS.join(", ")} days`,
      visual: (
        <div className="space-y-3">
          <div className="rounded-2xl bg-surface p-4 ring-1 ring-line">
            <ReviewTimeline compact />
          </div>
          <ReviewMini />
        </div>
      ),
    },
  ];

  return (
    <>
      <AuthBackdrop variant="pricing" />
      <Watermark />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="xl:flex xl:items-end xl:justify-between xl:gap-6">
          <div>
            <p className={`lesson-in ${EYEBROW}`}>Pricing</p>
            <h2 className={`${H2} [animation-delay:70ms]`}>Start free. Add Plus when you need it.</h2>
          </div>
          <div className="lesson-in mt-2 [animation-delay:140ms] xl:mt-0 xl:text-right">
            <Link href={PLUS_NAV.href} className={`${LINK_STRONG} text-sm`}>
              Compare plans and FAQ →
            </Link>
            <p className="mt-1 text-[12px] text-muted empty:hidden">
              {anyPrice && `${PLUS.priceNote} `}
              <LaunchSentence format="short" />
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)] xl:items-stretch">
          <FreeCard mode={mode} facts={facts} />
          <div className="lesson-cover rounded-3xl bg-surface/60 p-4 ring-1 ring-line [animation-delay:180ms]">
            <div className="flex flex-wrap items-center justify-between gap-3 xl:flex-nowrap">
              <div className="flex shrink-0 items-center gap-2.5">
                <PlusMark size="sm" />
                <p className="text-lg font-semibold">Plus</p>
                <p className="hidden text-sm text-muted 2xl:inline">Everything in Free, plus:</p>
              </div>
              <PlanPicker />
            </div>
            <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-5">
              <PlusShowcase benefits={benefits} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
