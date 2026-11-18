import type { Metadata } from "next";
import Link from "next/link";
import { I, Icon } from "@/components/bank/icons";
import { Reveal } from "@/components/home/Reveal";
import { SampleInsights } from "@/components/home/PlusInsights";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { PlanCards } from "@/components/plus/PlanCards";
import { PlusMark } from "@/components/plus/PlusMark";
import { MemberPanel, PlusCta } from "@/components/plus/PlusCta";
import { HeroPersonal, ReviewPersonal, TrustLine } from "@/components/plus/PlusPersonal";
import { HeroArt, LessonsPreview, ReviewTimeline, SampleMistake, StepsStrip, TestsPreview } from "@/components/plus/previews";
import { CheckList, FaqSection, FinalBand, FreeSection, SectionHead } from "@/components/plus/sections";
import { FOCUS, LINK_STRONG, PLUS_SURFACE, SECTION } from "@/components/plus/styles";
import { PLUS } from "@/lib/plus-config";
import { freeFacts, lessonFacts, testFacts } from "@/lib/plus-facts";
import { getLessons } from "@/lib/lessons";
import { INTERVALS } from "@/lib/review";
import { PAGE } from "@/lib/ui";

// Which lessons the page shows (the owner can change these).
const HERO_VISUAL = "linear-functions";
const LESSON_VISUAL = "boundaries";
const LESSON_THUMBS = ["circles", "transitions", "percentages"];

export async function generateMetadata(): Promise<Metadata> {
  const t = testFacts();
  const l = lessonFacts();
  const description = `Stellar stays free. Plus adds all ${t.total} past-paper practice tests, the full question bank, ${l.total} interactive lessons, a predicted score and spaced review of your mistakes.`;
  return { title: "Stellar Plus", description, openGraph: { title: "Stellar Plus: every past paper, every lesson", description, type: "website" } };
}

const JUMP: [string, string][] = [
  ["tests", "Tests"],
  ["lessons", "Lessons"],
  ["insights", "Score"],
  ["review", "Review"],
  ["plans", "Pricing"],
  ["faq", "FAQ"],
];

export default function Page() {
  const t = testFacts();
  const l = lessonFacts();
  const f = freeFacts();
  const metas = getLessons();
  const titleOf = (slug: string) => metas.find((m) => m.slug === slug)?.title ?? slug;
  const freeIds = t.freeRows.map((r) => r.id);
  const thumbs = LESSON_THUMBS.map((s) => ({ slug: s, title: titleOf(s), visual: lessonVisual(s) })).filter((x) => x.visual);
  const hours = Math.round(l.minutes / 60);
  const proof: [string, string][] = [
    [String(t.total), "past-paper tests"],
    [String(l.total), "interactive lessons"],
    [t.questions.toLocaleString("en-US"), t.allReviewed ? "test questions, each explained" : "test questions"],
    [INTERVALS.join(" → "), "day review of mistakes"],
  ];

  return (
    <div className={PAGE}>
      {/* Hero */}
      <section aria-labelledby="plus-title" className={`relative overflow-hidden rounded-3xl px-5 py-8 sm:px-10 sm:py-12 xl:px-12 ${PLUS_SURFACE}`}>
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:items-center">
          <div>
            <p className="lesson-in flex items-center gap-2.5">
              <PlusMark size="sm" />
              <span className="text-xs font-semibold tracking-[0.14em] text-side-ink/80 uppercase">Stellar Plus</span>
            </p>
            <h1 id="plus-title" className="lesson-in mt-5 text-4xl leading-[1.05] font-bold tracking-tight text-balance text-side-ink [animation-delay:70ms] sm:text-5xl xl:text-[3.5rem]">
              Practice like it&apos;s test day.
              <br />
              <span className="text-accent">Fix what&apos;s costing you points.</span>
            </h1>
            <p className="lesson-in mt-5 max-w-xl text-lg text-side-ink/80 [animation-delay:140ms]">
              Stellar stays free. Plus adds all {t.total} past-paper practice tests, the full question bank, {l.total} interactive lessons, your predicted score and a review plan for every mistake.
            </p>
            <PlusCta variant="hero" />
            <TrustLine />
            <HeroPersonal freeIds={freeIds} plusOnly={t.plusOnly} />
          </div>
          <HeroArt visual={lessonVisual(HERO_VISUAL)} title={titleOf(HERO_VISUAL)} />
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4">
          {proof.map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="text-sm text-side-ink/80">{label}</dt>
              <dd className="text-2xl font-bold tabular-nums text-side-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <MemberPanel tests={t.total} lessons={l.total} />

      <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
        {JUMP.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={`inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-4 text-sm font-medium text-muted transition-colors hover:text-ink ${FOCUS}`}>
            {label}
          </a>
        ))}
      </nav>

      {/* Practice tests */}
      <section id="tests" aria-labelledby="tests-title" className={SECTION}>
        <Reveal className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <SectionHead
              id="tests"
              eyebrow="Practice tests"
              title={`All ${t.total} past papers, timed like test day`}
              body={`Every Digital SAT past paper in Stellar, from ${t.firstYear} to ${t.lastYear}. Each one runs module by module with the real time limits, then gives you an estimated score and a question-by-question review.`}
            />
            <CheckList
              items={[
                `${t.full} full tests and ${t.rwOnly} Reading and Writing tests`,
                `${t.questions.toLocaleString("en-US")} questions${t.allReviewed ? ", every one with an explanation" : ""}`,
                `Free right now: the ${t.free} tests from ${t.freeLabel}`,
              ]}
            />
            <p className="mt-6 text-sm">
              <a href="#plans" className={LINK_STRONG}>
                See plans →
              </a>
            </p>
          </div>
          <div>
            <TestsPreview tiles={t.tiles} />
          </div>
        </Reveal>
      </section>

      {/* Lessons */}
      <section id="lessons" aria-labelledby="lessons-title" className={SECTION}>
        <Reveal className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <SectionHead
              id="lessons"
              eyebrow="Lessons"
              title={`${l.total} lessons that show the idea, then test you`}
              body="One short lesson per skill. Watch the idea play out, follow a worked example, check yourself, then finish with real SAT questions."
            />
            <StepsStrip />
            <p className="mt-4 text-sm text-muted tabular-nums">
              {l.examples} worked examples · {l.quizzes} quick checks · {l.checks} real SAT questions · Desmos walkthroughs in {l.desmosLessons} lessons
            </p>
            <p className="mt-1 text-sm text-muted">
              {l.strategy} to start with, {l.rw} Reading and Writing, {l.math} Math{hours >= 1 ? ` · about ${hours} hours in all` : ""}
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/lessons" className={LINK_STRONG}>
                Browse the lessons →
              </Link>
              <a href="#plans" className={LINK_STRONG}>
                See plans →
              </a>
            </p>
          </div>
          <div className="md:order-first">
            <LessonsPreview main={{ title: titleOf(LESSON_VISUAL), visual: lessonVisual(LESSON_VISUAL) }} thumbs={thumbs} />
          </div>
        </Reveal>
      </section>

      {/* Statistics */}
      <section id="insights" aria-labelledby="insights-title" className={SECTION}>
        <Reveal>
          <div className="max-w-2xl">
            <SectionHead
              id="insights"
              eyebrow="Statistics"
              title="Know your likely score before test day"
              body="After every full practice test, Plus estimates your score from your latest three, shows the likely range, and ranks the skills costing you the most points, each with a one-click practice set."
            />
            <CheckList items={["Predicted score with a likely range", "Your weakest skills, each with a Practice button", `A topic-by-topic breakdown of all ${f.skills} skills`]} />
            <p className="mt-4 text-[13px] text-muted">It&apos;s an estimate from your practice tests, not an official score.</p>
          </div>
          <SampleInsights className="mt-8" />
        </Reveal>
      </section>

      {/* Spaced review */}
      <section id="review" aria-labelledby="review-title" className={SECTION}>
        <Reveal className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <SectionHead
              id="review"
              eyebrow="Mistakes"
              title="Mistakes come back until they stick"
              body={`Get a question wrong and it comes back ${INTERVALS[0]} day later, then ${INTERVALS[1]} days after that, then ${INTERVALS[2]}. Get it right each time and it's mastered. A wrong answer starts it over, so your practice goes where you need it.`}
            />
            <CheckList items={["Free keeps the full list of your mistakes to practice any time. Plus adds the schedule."]} />
            <ReviewPersonal />
            <p className="mt-6 text-sm">
              <a href="#plans" className={LINK_STRONG}>
                See plans →
              </a>
            </p>
          </div>
          <div className="md:order-first">
            <ReviewTimeline />
            <SampleMistake />
          </div>
        </Reveal>
      </section>

      {/* Plans */}
      <section id="plans" aria-labelledby="plans-title" className={SECTION}>
        <SectionHead id="plans" eyebrow="Pricing" title="Pick how long you need Plus" body="Both plans include everything in Plus." center />
        <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {[`All ${t.total} practice tests`, "Full question bank", `All ${l.total} lessons`, "Predicted score and weak skills", "Spaced review of mistakes"].map((x) => (
            <li key={x} className="inline-flex items-center gap-1.5">
              <Icon d={I.check} className="h-4 w-4 text-primary-strong" strokeWidth={2.4} />
              {x}
            </li>
          ))}
        </ul>
        <PlanCards />
        <PlusCta variant="plans" />
        <div className="mx-auto mt-6 max-w-2xl space-y-1.5 text-center text-[13px] text-muted">
          <p>{PLUS.priceNote}</p>
          {PLUS.bugDiscountPercent ? (
            <p>
              Reported a real bug? Confirmed bug reports get {PLUS.bugDiscountPercent}% off a Stellar subscription.{" "}
              <a href="#faq-bug" className={LINK_STRONG}>
                How it works
              </a>
            </p>
          ) : null}
        </div>
      </section>

      <FreeSection t={t} l={l} f={f} />
      <FaqSection t={t} l={l} f={f} />
      <FinalBand />
    </div>
  );
}
