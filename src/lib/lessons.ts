import "server-only";
import fs from "node:fs";
import path from "node:path";
import { estimateMinutes, parseLesson, type Part, type Step } from "./lesson-format";
import { orderLessons } from "./lesson-order";
import { getQuestionsByIds } from "./bank";
import type { Question } from "./types";

// Lessons: Markdown files in content/lessons/{strategy,rw,math}/<slug>.md, played as steps
// (format: content/lessons/README.md, parser: lib/lesson-format.ts).

export type LessonSection = "rw" | "math" | "strategy";

export interface LessonMeta {
  slug: string;
  section: LessonSection;
  domain: string;
  skill: string;
  title: string;
  summary: string;
  minutes: number;
  /** Screens in the player: the cover + one per step. */
  stepCount: number;
  /** Parts (subtopics). */
  partCount: number;
  /** Fingerprint of the lesson's steps: saved progress only applies to the same version. */
  sig: string;
}

export interface Lesson extends LessonMeta {
  steps: Step[];
  parts: Part[];
}

const ROOT = path.join(process.cwd(), "content", "lessons");
const SECTIONS: LessonSection[] = ["strategy", "rw", "math"];
// Strategy lessons in reading order (the rest sort by file name).
const STRATEGY_ORDER = ["digital-sat-format", "pacing-and-guessing", "desmos"];

function load(file: string, section: LessonSection): Lesson | null {
  const parsed = parseLesson(fs.readFileSync(file, "utf8"));
  if (!parsed || !parsed.steps.length) return null;
  const { meta, steps, parts } = parsed;
  const slug = path.basename(file, ".md");
  return {
    slug,
    section,
    domain: meta.domain ?? section,
    skill: meta.skill ?? slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    minutes: estimateMinutes(steps, section),
    // + the cover screen the player shows first
    stepCount: steps.length + 1,
    partCount: parts.length,
    sig: signature(steps),
    steps,
    parts,
  };
}

/**
 * Short hash of the step titles and what each step shows (changes when the lesson is restructured). A step with a
 * visual and a block counts as "<block>+visual"; a ```more block doesn't change it (it adds no screen).
 */
function signature(steps: Step[]): string {
  const kind = (s: Step) => {
    const b = s.block;
    const t = b ? (b.t === "quiz" && b.answers.length ? "quiz:typed" : b.t) : "";
    return s.visual ? (t ? `${t}+visual` : "visual") : t;
  };
  let h = 5381;
  for (const ch of steps.map((s) => `${s.title}:${kind(s)}`).join("|")) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
  return (h >>> 0).toString(36);
}

let cache: Lesson[] | null = null;

/** Every lesson on disk (cached in production; re-read in dev so edits show on reload). */
function all(): Lesson[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const out: Lesson[] = [];
  for (const section of SECTIONS) {
    const dir = path.join(ROOT, section);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((x) => x.endsWith(".md"));
    if (section === "strategy") {
      const rank = (f: string) => (STRATEGY_ORDER.indexOf(path.basename(f, ".md")) + 1 || 99);
      files.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
    } else files.sort();
    for (const f of files) {
      const l = load(path.join(dir, f), section);
      if (l) out.push(l);
    }
  }
  cache = out;
  return out;
}

export function getLessons(): LessonMeta[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return all().map(({ steps, parts, ...meta }) => meta);
}

export function getLesson(slug: string): Lesson | null {
  if (!/^[\w-]+$/.test(slug)) return null;
  return all().find((l) => l.slug === slug) ?? null;
}

/**
 * The lesson after this one, in the order the /lessons page shows (lib/lesson-order.ts): the same section only,
 * except that the last "Start here" lesson leads on to the first Reading and Writing one.
 */
export function getNextLesson(slug: string): { slug: string; title: string } | null {
  const ordered = orderLessons(getLessons());
  const i = ordered.findIndex((x) => x.slug === slug);
  const here = ordered[i];
  const after = ordered[i + 1];
  return here && after && (after.section === here.section || here.section === "strategy") ? { slug: after.slug, title: after.title } : null;
}

/** Ids of the step visuals (```visual blocks) a lesson uses. */
export function lessonStepVisuals(l: Lesson): string[] {
  return l.steps.flatMap((s) => (s.visual ? [s.visual] : []));
}

/** The bank questions a lesson's check steps use, by id. */
export function lessonQuestions(l: Lesson): Record<string, Question> {
  const ids = l.steps.flatMap((s) => (s.block?.t === "check" ? [s.block.id] : []));
  return Object.fromEntries(getQuestionsByIds(ids).map((q) => [q.id, q]));
}
