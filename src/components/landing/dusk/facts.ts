import "server-only";
import { cacheLife } from "next/cache";
import { POINTS, ROUND_MIX, ROUNDS, SPEED_BONUS } from "@/lib/competition";
import type { AuthFacts } from "@/lib/auth-facts";
import { PLUS, formatPrice } from "@/lib/plus-config";
import { INTERVALS } from "@/lib/review";
import { SAT_DATES, TEST_START_HOUR } from "@/lib/sat-dates";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { MODULE_INFO, fmtMinutes, questionCount, type ModuleId } from "@/lib/test-types";
import { getTestIndex } from "@/lib/tests";

// Every number and date on the public landing page, computed from the data (never typed in by hand). Server only; the page
// stays static: only `satClock` looks at the clock, and it does so inside a cache entry ("use cache").

const num = (n: number) => n.toLocaleString("en-US");

export interface DuskFacts {
  /** Formatted counts; null when the bank can't be read. */
  questions: { total: string | null; free: string | null; general: string | null };
  vocabWords: string | null;
  lessons: { total: number; skill: number; strategy: number };
  tests: { total: number; full: number; rwOnly: number; free: number; freeLabel: string; rwMin: number; mathMin: number };
  /** A full-length test: its module count, question count and duration. null if there is none. */
  format: { modules: number; questions: number; duration: string } | null;
  tournament: {
    rounds: string;
    rwMin: number;
    mathMin: number;
    questions: number;
    easy: number;
    medium: number;
    hard: number;
    points: string;
    speedBonus: string;
    max: number;
    reset: string;
  };
  /** "$9.61", or null while Monthly has no price. */
  monthlyPrice: string | null;
  review: readonly [number, number, number];
  startHour: number;
}

/** The most common question count among the full-length tests, with the modules and minutes of one such test. */
function fullTestFormat(): DuskFacts["format"] {
  const full = getTestIndex().filter((t) => t.sections.length === 2);
  if (full.length === 0) return null;
  const tally = new Map<number, number>();
  for (const t of full) tally.set(questionCount(t), (tally.get(questionCount(t)) ?? 0) + 1);
  const [questions] = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  const sample = full.find((t) => questionCount(t) === questions)!;
  const modules = Object.keys(sample.counts) as ModuleId[];
  return { modules: modules.length, questions, duration: fmtMinutes(modules.reduce((n, m) => n + (MODULE_INFO[m]?.minutes ?? 0), 0)) };
}

export function duskFacts(facts: AuthFacts): DuskFacts {
  const { tests: t, lessons: l, free: f, questions } = facts;
  const monthly = PLUS.plans.monthly.amountCents;
  const rounds = Object.keys(ROUNDS).length;
  const perRound = ROUND_MIX.easy + ROUND_MIX.medium + ROUND_MIX.hard;
  const base = ROUND_MIX.easy * POINTS.easy + ROUND_MIX.medium * POINTS.medium + ROUND_MIX.hard * POINTS.hard;
  return {
    questions: {
      total: questions !== null ? num(questions) : null,
      free: f.cbQuestions !== null ? num(f.cbQuestions) : null,
      general: f.generalQuestions !== null ? num(f.generalQuestions) : null,
    },
    vocabWords: f.vocabWords !== null ? num(f.vocabWords) : null,
    lessons: { total: l.total, skill: l.rw + l.math, strategy: l.strategy },
    tests: { total: t.total, full: t.full, rwOnly: t.rwOnly, free: t.free, freeLabel: t.freeLabel, rwMin: t.rwMin, mathMin: t.mathMin },
    format: fullTestFormat(),
    tournament: {
      rounds: rounds === 2 ? "Two" : String(rounds),
      rwMin: ROUNDS.rw.minutes,
      mathMin: ROUNDS.math.minutes,
      questions: perRound,
      easy: ROUND_MIX.easy,
      medium: ROUND_MIX.medium,
      hard: ROUND_MIX.hard,
      points: `${POINTS.easy}, ${POINTS.medium} or ${POINTS.hard}`,
      speedBonus: `${Math.round(SPEED_BONUS * 100)}%`,
      max: Math.round(base * (1 + SPEED_BONUS)),
      reset: "Monday at 00:00 UTC",
    },
    monthlyPrice: monthly !== null ? formatPrice(monthly) : null,
    review: INTERVALS,
    startHour: TEST_START_HOUR,
  };
}

/**
 * The official SAT dates still ahead, up to four ("YYYY-MM-DD"), and the current year: the static list of the countdown and
 * the hero chip, the dates the browser counts down to, and the footer year. Cached for a day, so the static page never needs a
 * request-time clock; the browser picks the next date itself.
 */
export async function satClock(): Promise<{ dates: string[]; year: number }> {
  "use cache";
  cacheLife("days");
  const now = Date.now();
  const yesterday = new Date(now - 86_400_000).toISOString().slice(0, 10);
  const ahead = SAT_DATES.filter((d) => d.date >= yesterday);
  const official = ahead.filter((d) => !d.anticipated);
  return { dates: (official.length > 0 ? official : ahead).slice(0, 4).map((d) => d.date), year: new Date(now).getUTCFullYear() };
}

const UTC = { timeZone: "UTC" } as const;
const SHORT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...UTC });
const WITH_YEAR = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", ...UTC });
const at = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** "Dec 5" */
export const shortDate = (iso: string) => SHORT.format(at(iso));
/** "Dec 5, 2026" */
export const dateWithYear = (iso: string) => WITH_YEAR.format(at(iso));
/** "2026–27", or "2027" when every date falls in one year. */
export function seasonLabel(dates: string[]): string {
  if (dates.length === 0) return "";
  const first = dates[0].slice(0, 4);
  const last = dates[dates.length - 1].slice(0, 4);
  return first === last ? first : `${first}–${last.slice(2)}`;
}

/** The Q&As shown in the FAQ section and sent to search engines as FAQPage JSON-LD (one list, so they always match). */
export function faqItems(d: DuskFacts): { q: string; a: string }[] {
  const { tests: t, lessons: l } = d;
  return [
    {
      q: "Is Stellar really free?",
      a: `Yes, with no time limit and no card. The College Board question bank, ${d.vocabWords !== null ? `${d.vocabWords} vocabulary words` : "the vocabulary"} and the weekly tournament are free. So are basic statistics, your Mistakes list and the practice tests from ${t.freeLabel}. They stay free.`,
    },
    {
      q: "Do I need an account?",
      a: "Yes, a free one. You need it to practice. Your answers, test scores and progress are saved to your account on every device.",
    },
    {
      q: "What are the practice tests?",
      a: `They’re ${t.total} past Digital SAT papers, rebuilt in Stellar: ${t.full} full-length and ${t.rwOnly} Reading and Writing only. Each module is timed: ${t.rwMin} minutes for Reading and Writing, ${t.mathMin} for Math. Then you get an estimated score out of 1600 and a review of every question. Reading and Writing tests are scored out of 800. The score comes from a typical scoring curve. Unlike the real test, module 2 doesn’t change based on how you did in module 1.`,
    },
    {
      q: "What does Plus add?",
      a: `Plus adds all ${t.total} past-paper practice tests; the free plan covers the ${t.free} newest. It also adds ${d.questions.general !== null ? `${d.questions.general} past-paper questions in the General bank` : "past-paper questions in the General bank"} and all ${l.total} lessons. You also get a predicted score, your weakest skills, a topic breakdown and spaced review of your mistakes.${d.monthlyPrice ? ` Plus Monthly costs ${d.monthlyPrice} a month.` : ""}`,
    },
    { q: "Is there a free trial?", a: "There’s no trial clock. The free plan is the way to try Stellar, and it doesn’t run out." },
  ];
}

/** JSON-LD: WebSite, Organization and the FAQPage. Serialized so it can't close the script tag. */
export function jsonLd(faq: { q: string; a: string }[]): string {
  const data = [
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
