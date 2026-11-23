import Link from "next/link";
import type { ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { Skeleton } from "@/components/home/parts";
import { inline } from "@/components/lessons/Markdown";
import { Stage } from "@/components/lessons/visuals/Stage";
import { PlusBadge, PlusLock } from "@/components/PlusLock";
import { SignInHint } from "@/components/plus/SignInHint";
import { LINK_STRONG } from "@/components/plus/styles";
import { RememberTab } from "@/lib/lesson-tab";
import type { LessonBlocks } from "@/lib/plus-facts";
import { PAGE } from "@/lib/ui";

const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export interface LessonLockedProps {
  where: string;
  /** The lesson's domain page (null for strategy lessons). */
  domain: { name: string; href: string } | null;
  title: string;
  summary: string;
  visual: ReactNode;
  parts: number;
  minutes: number;
  blocks: LessonBlocks;
  partTitles: string[];
  counts: { total: number; strategy: number; rw: number; math: number };
  strategy: boolean;
  free: { href: string; label: string };
}

/**
 * What a visitor without Plus sees at /lessons/[slug]: the lesson's cover and what's inside, as strings and numbers only
 * (never the steps, parts or questions; part titles only when PLUS.lockShowsPartTitles is on).
 */
export function LessonLocked({ where, domain, title, summary, visual, parts, minutes, blocks, partTitles, counts, strategy, free }: LessonLockedProps) {
  const inside: { icon: string; label: string }[] = [
    ...(visual ? [{ icon: I.play, label: "The idea, animated" }] : []),
    ...(blocks.examples ? [{ icon: I.layers, label: pl(blocks.examples, "worked example", "worked examples") }] : []),
    ...(blocks.quizzes + blocks.checks ? [{ icon: I.check, label: `${pl(blocks.quizzes + blocks.checks, "task", "tasks")}: Easy, Medium and Hard after every subtopic` }] : []),
    ...(blocks.desmos ? [{ icon: I.calculator, label: blocks.desmos === 1 ? "A Desmos walkthrough" : `${blocks.desmos} Desmos walkthroughs` }] : []),
    ...(blocks.checks ? [{ icon: I.badge, label: pl(blocks.checks, "real SAT question among the tasks", "real SAT questions among the tasks") }] : []),
  ];
  const points = [
    ...(visual && blocks.examples ? ["See the idea animated, then follow a worked example"] : visual ? ["See the idea animated"] : blocks.examples ? ["Follow a worked example"] : []),
    ...(blocks.quizzes + blocks.checks > 0 ? ["Easy, Medium and Hard tasks after every subtopic, with hints and full explanations"] : []),
    ...(blocks.desmos > 0 ? [blocks.desmos === 1 ? "A step-by-step Desmos walkthrough" : `${blocks.desmos} Desmos walkthroughs`] : []),
    ...(blocks.checks ? [`Includes ${pl(blocks.checks, "real SAT question", "real SAT questions")} on this ${strategy ? "topic" : "skill"}`] : []),
  ];
  const meta = [pl(parts, "subtopic", "subtopics"), `~${minutes} min`, blocks.checks ? pl(blocks.checks, "real SAT question", "real SAT questions") : null].filter(Boolean).join(" · ");
  return (
    <div className={PAGE}>
      <div className="mx-auto max-w-3xl">
        {strategy && <RememberTab tab="strategy" />}
        <Link href={domain?.href ?? "/lessons"} aria-label={domain ? `Back to ${domain.name}` : "All lessons"} className={`text-sm ${LINK_STRONG}`}>
          ← {domain ? domain.name : "All lessons"}
        </Link>
        <div className="mt-6 text-center">
          <p className="lesson-in text-sm font-medium text-primary-strong">
            {where}
            {domain && (
              <>
                {" · "}
                <Link href={domain.href} className="hover:underline">
                  {domain.name}
                </Link>
              </>
            )}
          </p>
          <h1 className="lesson-in mt-1 text-3xl font-bold tracking-tight [animation-delay:60ms] md:text-4xl">{title}</h1>
        </div>
        {visual && (
          <div className="lesson-cover relative mt-6 overflow-hidden rounded-3xl bg-surface shadow-[0_1px_0_var(--color-line),0_12px_40px_-12px_rgb(0_0_0/0.18)] ring-1 ring-line [animation-delay:120ms]">
            <Stage className="aspect-[16/9] w-full p-[3%]">{visual}</Stage>
            <PlusBadge className="absolute top-3 right-3" />
          </div>
        )}
        {summary && <p className="lesson-in mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed [animation-delay:200ms]">{summary}</p>}
        <p className="mt-2 text-center text-sm text-muted tabular-nums">{meta}</p>

        <section aria-labelledby="inside-title" className="mt-8 rounded-2xl border border-line bg-surface p-5">
          <h2 id="inside-title" className="text-base font-semibold">
            What&apos;s inside
          </h2>
          <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            {inside.map((x) => (
              <li key={x.label} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-strong">
                  <Icon d={x.icon} className="h-4 w-4" />
                </span>
                {x.label}
              </li>
            ))}
          </ul>
          {partTitles.length > 0 && (
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm">
              {partTitles.map((t) => (
                <li key={t}>{inline(t)}</li>
              ))}
            </ol>
          )}
        </section>

        <PlusLock
          variant="panel"
          feature="lessons"
          className="mt-8"
          title={`Unlock this lesson and ${counts.total - 1} more`}
          points={points.length > 0 ? points : undefined}
          fact={`Every lesson is in Plus: ${counts.rw} Reading and Writing, ${counts.math} Math and ${counts.strategy} on how the test works.`}
          free={free}
          footer={<SignInHint />}
        />
      </div>
    </div>
  );
}

export function LessonCoverSkeleton() {
  return (
    <div className={PAGE} aria-busy="true">
      <span className="sr-only">Loading lesson…</span>
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mx-auto mt-6 h-4 w-48" />
        <Skeleton className="mx-auto mt-3 h-9 w-72 max-w-full" />
        <Skeleton className="mt-6 aspect-[16/9] w-full rounded-3xl" />
        <Skeleton className="mx-auto mt-6 h-5 w-2/3" />
      </div>
    </div>
  );
}
