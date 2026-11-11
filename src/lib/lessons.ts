import "server-only";
import fs from "node:fs";
import path from "node:path";

// Lessons: Markdown files in content/lessons/{rw,math,strategy}/<slug>.md (format: content/lessons/README.md).

export type LessonSection = "rw" | "math" | "strategy";

export interface LessonMeta {
  slug: string;
  section: LessonSection;
  domain: string;
  skill: string;
  title: string;
  summary: string;
  minutes: number;
}

export interface Lesson extends LessonMeta {
  body: string;
}

const ROOT = path.join(process.cwd(), "content", "lessons");
const SECTIONS: LessonSection[] = ["strategy", "rw", "math"];

function parse(file: string, section: LessonSection): Lesson | null {
  const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  const slug = path.basename(file, ".md");
  return {
    slug,
    section,
    domain: meta.domain ?? section,
    skill: meta.skill ?? slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    minutes: Number(meta.minutes) || Math.max(3, Math.round(m[2].split(/\s+/).length / 200)),
    body: m[2].trim(),
  };
}

let cache: Lesson[] | null = null;

/** Every lesson on disk (read once per server process; dev reloads pick up edits on restart). */
function all(): Lesson[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const out: Lesson[] = [];
  for (const section of SECTIONS) {
    const dir = path.join(ROOT, section);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) {
      const l = parse(path.join(dir, f), section);
      if (l) out.push(l);
    }
  }
  cache = out;
  return out;
}

export function getLessons(): LessonMeta[] {
  return all().map((l) => ({ slug: l.slug, section: l.section, domain: l.domain, skill: l.skill, title: l.title, summary: l.summary, minutes: l.minutes }));
}

export function getLesson(slug: string): Lesson | null {
  if (!/^[\w-]+$/.test(slug)) return null;
  return all().find((l) => l.slug === slug) ?? null;
}
