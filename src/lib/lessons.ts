import "server-only";
import fs from "node:fs";
import path from "node:path";
import { estimateMinutes, parseLesson, type Step } from "./lesson-format";
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
  stepCount: number;
}

export interface Lesson extends LessonMeta {
  steps: Step[];
}

const ROOT = path.join(process.cwd(), "content", "lessons");
const SECTIONS: LessonSection[] = ["strategy", "rw", "math"];
// Strategy lessons in reading order (the rest sort by file name).
const STRATEGY_ORDER = ["digital-sat-format", "pacing-and-guessing", "desmos"];

function load(file: string, section: LessonSection): Lesson | null {
  const parsed = parseLesson(fs.readFileSync(file, "utf8"));
  if (!parsed || !parsed.steps.length) return null;
  const { meta, steps } = parsed;
  const slug = path.basename(file, ".md");
  return {
    slug,
    section,
    domain: meta.domain ?? section,
    skill: meta.skill ?? slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    minutes: estimateMinutes(steps, section),
    stepCount: steps.length,
    steps,
  };
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
  return all().map(({ steps, ...meta }) => meta);
}

export function getLesson(slug: string): Lesson | null {
  if (!/^[\w-]+$/.test(slug)) return null;
  return all().find((l) => l.slug === slug) ?? null;
}

/** The bank questions a lesson's check steps use, by id. */
export function lessonQuestions(l: Lesson): Record<string, Question> {
  const ids = l.steps.flatMap((s) => (s.block?.t === "check" ? [s.block.id] : []));
  return Object.fromEntries(getQuestionsByIds(ids).map((q) => [q.id, q]));
}
