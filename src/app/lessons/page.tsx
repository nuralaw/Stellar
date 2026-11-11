import type { Metadata } from "next";
import Link from "next/link";
import { getLessons, type LessonMeta } from "@/lib/lessons";
import { SECTIONS, domainsFor, type SectionId } from "@/lib/taxonomy";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Lessons",
  description: "Plain-language Digital SAT lessons for every skill: the method, the rules, worked examples and the traps.",
};

function LessonCard({ l }: { l: LessonMeta }) {
  return (
    <Link href={`/lessons/${l.slug}`} className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-muted">
      <span className="font-semibold leading-snug group-hover:text-primary">{l.title}</span>
      {l.summary && <span className="mt-1.5 line-clamp-2 text-sm text-muted">{l.summary}</span>}
      <span className="mt-auto pt-3 text-xs font-medium text-muted tabular-nums">{l.minutes} min read</span>
    </Link>
  );
}

function Missing({ name }: { name: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-dashed border-line p-5">
      <span className="font-semibold leading-snug text-muted">{name}</span>
      <span className="mt-auto pt-3 text-xs text-muted">Lesson coming soon</span>
    </div>
  );
}

export default function Page() {
  const lessons = getLessons();
  const bySkill = new Map(lessons.map((l) => [l.skill, l]));
  const strategy = lessons.filter((l) => l.section === "strategy");

  return (
    <section className={PAGE}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Lessons</h1>
      <p className="mt-2 max-w-2xl text-muted">
        One short lesson for every skill on the Digital SAT: how to spot the question, a step-by-step method, the rules to know, worked examples and the traps.
      </p>

      {strategy.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold">Start here</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {strategy.map((l) => (
              <LessonCard key={l.slug} l={l} />
            ))}
          </div>
        </>
      )}

      {(["rw", "math"] as SectionId[]).map((s) => (
        <div key={s} className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">{SECTIONS[s].name}</h2>
          {domainsFor(s).map((d) => (
            <div key={d.id} className="mt-6">
              <h3 className="text-sm font-semibold tracking-wide text-muted uppercase">{d.name}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {d.skills.map((sk) => {
                  const l = bySkill.get(sk.id);
                  return l ? <LessonCard key={sk.id} l={l} /> : <Missing key={sk.id} name={sk.name} />;
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
