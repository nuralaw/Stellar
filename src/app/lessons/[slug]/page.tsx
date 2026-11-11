import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown, headings } from "@/components/lessons/Markdown";
import { getLesson, getLessons } from "@/lib/lessons";
import { SECTIONS, getDomain } from "@/lib/taxonomy";

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

  const all = getLessons();
  const same = all.filter((x) => x.section === l.section);
  const i = same.findIndex((x) => x.slug === l.slug);
  const prev = same[i - 1];
  const next = same[i + 1];
  const toc = headings(l.body);
  const domain = l.section === "strategy" ? null : getDomain(l.domain);
  const practice = l.section === "strategy" ? null : `/practice?section=${l.section}&skills=${l.skill}&status=new&practice=10`;
  const where = l.section === "strategy" ? "Start here" : `${SECTIONS[l.section].short} · ${domain?.name ?? ""}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 md:px-8 md:pt-12">
      <Link href="/lessons" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
        <span aria-hidden="true">←</span> Lessons
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <article className="min-w-0 max-w-3xl">
          <p className="text-sm font-medium text-primary">{where}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{l.title}</h1>
          {l.summary && <p className="mt-3 text-lg text-muted">{l.summary}</p>}
          <p className="mt-3 text-sm text-muted tabular-nums">{l.minutes} min read</p>

          <div className="mt-10">
            <Markdown source={l.body} />
          </div>

          {practice && (
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
              <div>
                <p className="font-semibold">Now try it</p>
                <p className="mt-0.5 text-sm text-muted">10 questions on {l.title}, fresh ones first.</p>
              </div>
              <Link href={practice} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-hover">
                Practice this skill
              </Link>
            </div>
          )}

          <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="More lessons">
            {prev ? (
              <Link href={`/lessons/${prev.slug}`} className="rounded-2xl border border-line p-4 transition-colors hover:border-muted">
                <span className="text-xs text-muted">← Previous</span>
                <span className="mt-0.5 block font-semibold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/lessons/${next.slug}`} className="rounded-2xl border border-line p-4 text-right transition-colors hover:border-muted">
                <span className="text-xs text-muted">Next →</span>
                <span className="mt-0.5 block font-semibold">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>

        {/* On this page */}
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">On this page</p>
            <ul className="mt-3 space-y-1 border-l border-line">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="-ml-px block border-l border-transparent py-1 pl-3 text-sm text-muted transition-colors hover:border-primary hover:text-ink">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
            {practice && (
              <Link href={practice} className="mt-6 block rounded-xl border border-line px-4 py-2.5 text-center text-sm font-semibold transition-colors hover:bg-surface-2">
                Practice this skill
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
