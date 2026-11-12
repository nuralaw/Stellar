import type { Metadata } from "next";
import { LessonList } from "@/components/lessons/LessonList";
import { getLessons } from "@/lib/lessons";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Short interactive Digital SAT lessons for every skill: a method in a few steps, quick checks, then real SAT questions.",
};

export default function Page() {
  const lessons = getLessons().map(({ slug, section, domain, skill, title, minutes, stepCount }) => ({ slug, section, domain, skill, title, minutes, stepCount }));
  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Lessons</h1>
      <p className="mt-2 max-w-2xl text-muted">One short lesson per skill. Learn the method in a few steps, check yourself as you go, finish with real SAT questions.</p>
      <LessonList lessons={lessons} />
    </section>
  );
}
