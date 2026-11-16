import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LessonCoverSkeleton, LessonLocked } from "@/components/lessons/LessonLocked";
import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { getAccess } from "@/lib/access-server";
import { getLesson, getLessons, lessonQuestions, lessonStepVisuals } from "@/lib/lessons";
import { PLUS } from "@/lib/plus-config";
import { lessonBlocks } from "@/lib/plus-facts";
import { SECTIONS, getDomain, getSkill, type SectionId } from "@/lib/taxonomy";

export function generateStaticParams() {
  return getLessons().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const l = getLesson((await params).slug);
  return l ? { title: `${l.title} — Lesson`, description: l.summary } : { title: "Lesson" };
}

// The server decides: the visitor's session is read at request time (so nothing of the lesson is prerendered),
// and the steps, parts and questions are only passed to the player after the "lessons" check passes.
async function Lesson({ params }: { params: PageProps<"/lessons/[slug]">["params"] }) {
  const l = getLesson((await params).slug);
  if (!l) notFound();

  if (!(await getAccess()).can("lessons")) {
    const all = getLessons();
    const strategy = l.section === "strategy";
    const skill = getSkill(l.skill)?.name ?? l.title;
    return (
      <LessonLocked
        where={strategy ? "Start here" : `${SECTIONS[l.section as SectionId].short} · ${getDomain(l.domain)?.name ?? ""}`}
        title={l.title}
        summary={l.summary}
        visual={lessonVisual(l.slug)}
        parts={l.partCount}
        minutes={l.minutes}
        blocks={lessonBlocks(l)}
        partTitles={PLUS.lockShowsPartTitles ? l.parts.map((p) => p.title) : []}
        counts={{
          total: all.length,
          strategy: all.filter((x) => x.section === "strategy").length,
          rw: all.filter((x) => x.section === "rw").length,
          math: all.filter((x) => x.section === "math").length,
        }}
        strategy={strategy}
        free={strategy ? { href: "/test", label: "try a free practice test" } : { href: `/practice?section=${l.section}&skills=${l.skill}`, label: `practice ${skill} questions` }}
      />
    );
  }

  // Next lesson: the following one in the same section (strategy → first R&W lesson).
  const all = getLessons();
  const i = all.findIndex((x) => x.slug === l.slug);
  const after = all[i + 1];
  const next = after && (after.section === l.section || l.section === "strategy") ? { slug: after.slug, title: after.title } : null;
  const strategy = l.section === "strategy";

  return (
    <LessonPlayer
      visual={lessonVisual(l.slug)}
      stepVisuals={Object.fromEntries(lessonStepVisuals(l).map((id) => [id, lessonVisual(id)]))}
      lesson={{
        slug: l.slug,
        sig: l.sig,
        title: l.title,
        summary: l.summary,
        section: l.section,
        where: strategy ? "Start here" : `${SECTIONS[l.section as SectionId].short} · ${getDomain(l.domain)?.name ?? ""}`,
        minutes: l.minutes,
        steps: l.steps,
        parts: l.parts,
        questions: lessonQuestions(l),
        practice: strategy ? null : `/practice?section=${l.section}&skills=${l.skill}&status=new&practice=10`,
        next,
      }}
    />
  );
}

export default function Page({ params }: PageProps<"/lessons/[slug]">) {
  return (
    <Suspense fallback={<LessonCoverSkeleton />}>
      <Lesson params={params} />
    </Suspense>
  );
}
