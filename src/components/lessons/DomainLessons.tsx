"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { LessonCard, isDone, type ListLesson } from "@/components/lessons/LessonList";
import { useAccess } from "@/lib/access";
import { rememberTab } from "@/lib/lesson-tab";
import type { SectionId } from "@/lib/taxonomy";
import { useHydrated, useLessonProgress } from "@/lib/store";

/** The lesson cards of one domain (in skill order), with a hint at the first lesson not done yet. */
export function DomainLessons({ section, domainName, lessons, visuals }: { section: SectionId; domainName: string; lessons: ListLesson[]; visuals: Record<string, ReactNode> }) {
  const hydrated = useHydrated();
  const progress = useLessonProgress();
  const access = useAccess();
  const locked = access.ready && !access.can("lessons");

  // Going back to /lessons lands on this domain's section.
  useEffect(() => rememberTab(section), [section]);

  const next = hydrated ? lessons.find((l) => !isDone(progress[l.slug])) : undefined;
  const done = hydrated ? lessons.filter((l) => isDone(progress[l.slug])).length : 0;

  return (
    <>
      <div className="mt-6 min-h-6 text-sm">
        {next && done > 0 && (
          <p className="text-muted">
            Next up in {domainName}:{" "}
            <Link href={`/lessons/${next.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary-strong hover:underline">
              {next.title}
              <Icon d={I.chevronR} className="h-3.5 w-3.5" strokeWidth={2.2} />
            </Link>
          </p>
        )}
        {hydrated && done === lessons.length && lessons.length > 0 && <p className="text-muted">All {lessons.length} lessons in {domainName} done.</p>}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l, i) => (
          <LessonCard key={l.slug} l={l} p={hydrated ? progress[l.slug] : undefined} visual={visuals[l.slug]} i={i} locked={locked} />
        ))}
      </div>
    </>
  );
}
