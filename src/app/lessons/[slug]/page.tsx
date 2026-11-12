import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { getLesson, getLessons, lessonQuestions } from "@/lib/lessons";
import { SECTIONS, getDomain, type SectionId } from "@/lib/taxonomy";

export function generateStaticParams() {
  return getLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const l = getLesson((await params).slug);
  return l ? { title: `${l.title} — Lesson`, description: l.summary } : { title: "Lesson" };
}

export default async function Page({ params }: PageProps<"/lessons/[slug]">) {
  const l = getLesson((await params).slug);
  if (!l) notFound();

  // Next lesson: the following one in the same section (strategy → first R&W lesson).
  const all = getLessons();
  const i = all.findIndex((x) => x.slug === l.slug);
  const after = all[i + 1];
  const next = after && (after.section === l.section || l.section === "strategy") ? { slug: after.slug, title: after.title } : null;
  const strategy = l.section === "strategy";

  return (
    <LessonPlayer
      visual={lessonVisual(l.slug)}
      lesson={{
        slug: l.slug,
        title: l.title,
        summary: l.summary,
        section: l.section,
        where: strategy ? "Start here" : `${SECTIONS[l.section as SectionId].short} · ${getDomain(l.domain)?.name ?? ""}`,
        minutes: l.minutes,
        steps: l.steps,
        questions: lessonQuestions(l),
        practice: strategy ? null : `/practice?section=${l.section}&skills=${l.skill}&status=new&practice=10`,
        next,
      }}
    />
  );
}
