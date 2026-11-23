import type { Metadata } from "next";
import { LessonList } from "@/components/lessons/LessonList";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { getLessons } from "@/lib/lessons";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Short interactive Digital SAT lessons for every skill: see the idea animated, read the key ideas, then an Easy, Medium and Hard task after every subtopic.",
};

export default function Page() {
  const all = getLessons();
  const lessons = all.map(({ slug, section, domain, skill, title, minutes, stepCount, partCount, sig }) => ({ slug, section, domain, skill, title, minutes, stepCount, partCount, sig }));
  const visuals = Object.fromEntries(all.map((l) => [l.slug, lessonVisual(l.slug)]));
  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Lessons</h1>
      <p className="mt-2 max-w-2xl text-muted">One short lesson per skill: see the idea animated, read the key ideas, then try an Easy, Medium and Hard task after every subtopic.</p>
      <LessonList lessons={lessons} visuals={visuals} />
    </section>
  );
}
