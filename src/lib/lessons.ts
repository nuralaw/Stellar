import "server-only";
import fs from "node:fs";
import path from "node:path";
import { estimateMinutes, parseLesson, type Subtopic } from "./lesson-format";
import { orderLessons } from "./lesson-order";
import { getQuestionsByIds } from "./bank";
import type { Question } from "./types";

// Lessons: Markdown files in content/lessons/{strategy,rw,math}/<slug>.md, played as subtopics: a Learn screen, then an
// Easy, a Medium and a Hard task (format: content/lessons/README.md, spec docs/lessons-v2.md, parser: lib/lesson-format.ts).

export type LessonSection = "rw" | "math" | "strategy";

export interface LessonMeta {
  slug: string;
  section: LessonSection;
  domain: string;
  skill: string;
  title: string;
  summary: string;
  minutes: number;
  /** Screens in the lesson: 4 per subtopic (Learn, Easy, Medium, Hard); the overview and the complete screen are extra. */
  stepCount: number;
  /** Subtopics. */
  partCount: number;
  /** Fingerprint of the lesson's structure: saved progress only applies to the same version. */
  sig: string;
}

export interface Lesson extends LessonMeta {
  subtopics: Subtopic[];
}

const ROOT = path.join(process.cwd(), "content", "lessons");
const SECTIONS: LessonSection[] = ["strategy", "rw", "math"];
// Strategy lessons in reading order (the rest sort by file name).
const STRATEGY_ORDER = ["digital-sat-format", "pacing-and-guessing", "desmos"];

function load(file: string, section: LessonSection): Lesson | null {
  const parsed = parseLesson(fs.readFileSync(file, "utf8"));
  const slug = path.basename(file, ".md");
  if (!parsed || !parsed.subtopics.length) return null;
  // A lesson with format errors is not shown (npm run lessons:check lists them): the player expects complete subtopics.
  if (parsed.errors.length) {
    const first = parsed.errors.slice(0, 3).join(" | ");
    console.error(`lesson ${path.relative(process.cwd(), file)} skipped: ${parsed.errors.length} format error(s) (npm run lessons:check -- ${slug}). First: ${first}`);
    return null;
  }
  const { meta, subtopics } = parsed;
  return {
    slug,
    section,
    domain: meta.domain ?? section,
    skill: meta.skill ?? slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    minutes: estimateMinutes(subtopics, section),
    stepCount: subtopics.length * 4,
    partCount: subtopics.length,
    sig: signature(subtopics),
    subtopics,
  };
}

/**
 * Short hash of the lesson's structure: the subtopic titles, and for each task its slot and what it is (the bank id,
 * or an own question's kind). It changes when the lesson is restructured or a question is swapped, not when texts or
 * explanations are edited.
 */
function signature(subtopics: Subtopic[]): string {
  const task = (t: Subtopic["tasks"][number]) => `${t.level}:${t.kind === "bank" ? t.id : t.question.answers.length ? "typed" : "mc"}`;
  let h = 5381;
  for (const ch of subtopics.map((s) => `${s.title}:${s.example ? "e" : ""}${s.desmos ? "d" : ""}:${s.tasks.map(task).join(",")}`).join("|")) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
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
  return all().map(({ subtopics, ...meta }) => meta);
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

/** Ids of the visuals a lesson's subtopics use (one per subtopic, in order; render each with lessonVisual(id)). */
export function lessonVisuals(l: Lesson): string[] {
  return [...new Set(l.subtopics.map((s) => s.visual).filter(Boolean))];
}

/** The bank questions the lesson's tasks use, by id (own questions are not in the bank). */
export function lessonQuestions(l: Lesson): Record<string, Question> {
  const ids = l.subtopics.flatMap((s) => s.tasks.flatMap((t) => (t.kind === "bank" ? [t.id] : [])));
  return Object.fromEntries(getQuestionsByIds(ids).map((q) => [q.id, q]));
}
