import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { Suspense } from "react";
import { DomainLessons } from "@/components/lessons/DomainLessons";
import { LessonCoverSkeleton, LessonLocked } from "@/components/lessons/LessonLocked";
import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { getAccess } from "@/lib/access-server";
import { getLesson, getLessons, getNextLesson, lessonQuestions, lessonVisuals } from "@/lib/lessons";
import { domainLessons } from "@/lib/lesson-order";
import { PLUS } from "@/lib/plus-config";
import { lessonBlocks } from "@/lib/plus-facts";
import { LINK_STRONG } from "@/components/plus/styles";
import { DOMAINS, SECTIONS, getDomain, getSkill, type SectionId } from "@/lib/taxonomy";
import { PAGE } from "@/lib/ui";

// /lessons/<slug> is a lesson, or a domain id (/lessons/algebra): the domain's lesson list.
export function generateStaticParams() {
  const lessons = getLessons();
  const clash = lessons.find((l) => getDomain(l.slug));
  if (clash) throw new Error(`Lesson slug "${clash.slug}" is also a domain id (taxonomy.ts): /lessons/${clash.slug} would be ambiguous. Rename the lesson file.`);
  return [...lessons.map((l) => ({ slug: l.slug })), ...DOMAINS.map((d) => ({ slug: d.id }))];
}

export async function generateMetadata({ params }: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const slug = (await params).slug;
  const d = getDomain(slug);
  if (d) {
    const n = domainLessons(getLessons(), d.id).length;
    return { title: `${d.name} — Lessons`, description: `${n} short interactive Digital SAT lessons on ${d.name} (${SECTIONS[d.section].name}).` };
  }
  const l = getLesson(slug);
  return l ? { title: `${l.title} — Lesson`, description: l.summary } : { title: "Lesson" };
}

/** The lesson list of one domain. Not gated: like /lessons, it only lists; the lesson itself is checked on its own page. */
function DomainPage({ domainId }: { domainId: string }) {
  const d = getDomain(domainId);
  if (!d) notFound();
  const section = SECTIONS[d.section];
  const all = domainLessons(getLessons(), d.id);
  const lessons = all.map(({ slug, section, domain, skill, title, minutes, stepCount, partCount, sig }) => ({ slug, section, domain, skill, title, minutes, stepCount, partCount, sig }));
  const visuals = Object.fromEntries(all.map((l) => [l.slug, lessonVisual(l.slug)]));
  const minutes = all.reduce((sum, l) => sum + l.minutes, 0);
  return (
    <section className={PAGE}>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        <Link href="/lessons" className={LINK_STRONG}>
          Lessons
        </Link>
        <span aria-hidden="true">›</span>
        <Link href="/lessons" className={LINK_STRONG}>
          {section.name}
        </Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{d.name}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{d.name}</h1>
      <p className="mt-2 max-w-2xl text-muted">
        ≈{d.weight} of {section.name} questions · {all.length} {all.length === 1 ? "lesson" : "lessons"} · ~{minutes} min
      </p>
      <DomainLessons section={d.section} domainName={d.name} lessons={lessons} visuals={visuals} />
    </section>
  );
}

// The server decides: the visitor's session is read at request time (so nothing of the lesson is prerendered),
// and the steps, parts and questions are only passed to the player after the "lessons" check passes.
async function Lesson({ slug }: { slug: string }) {
  // Request time from the first line: the lesson depends on the visitor's session, so none of it is prerendered. Reading the
  // lesson files and the session after this point may use the clock and other per-request values (blocking-prerender-current-time).
  await connection();
  const l = getLesson(slug);
  if (!l) notFound();
  const dom = l.section !== "strategy" ? getDomain(l.domain) : undefined;
  const domain = dom ? { name: dom.name, href: `/lessons/${dom.id}` } : null;

  if (!(await getAccess()).can("lessons")) {
    const all = getLessons();
    const strategy = l.section === "strategy";
    const skill = getSkill(l.skill)?.name ?? l.title;
    return (
      <LessonLocked
        where={strategy ? "Start here" : SECTIONS[l.section as SectionId].short}
        domain={domain}
        title={l.title}
        summary={l.summary}
        visual={lessonVisual(l.slug)}
        parts={l.partCount}
        minutes={l.minutes}
        blocks={lessonBlocks(l)}
        partTitles={PLUS.lockShowsPartTitles ? l.subtopics.map((p) => p.title) : []}
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

  const next = getNextLesson(l.slug);
  const strategy = l.section === "strategy";

  return (
    <LessonPlayer
      visual={lessonVisual(l.slug)}
      stepVisuals={Object.fromEntries(lessonVisuals(l).map((id) => [id, lessonVisual(id)]))}
      lesson={{
        slug: l.slug,
        sig: l.sig,
        title: l.title,
        summary: l.summary,
        section: l.section,
        where: strategy ? "Start here" : SECTIONS[l.section as SectionId].short,
        domain,
        minutes: l.minutes,
        subtopics: l.subtopics,
        questions: lessonQuestions(l),
        practice: strategy ? null : `/practice?section=${l.section}&skills=${l.skill}&status=new&practice=1`,
        next,
      }}
    />
  );
}

async function Route({ params }: { params: PageProps<"/lessons/[slug]">["params"] }) {
  const slug = (await params).slug;
  return getDomain(slug) ? <DomainPage domainId={slug} /> : <Lesson slug={slug} />;
}

export default function Page({ params }: PageProps<"/lessons/[slug]">) {
  return (
    <Suspense fallback={<LessonCoverSkeleton />}>
      <Route params={params} />
    </Suspense>
  );
}
