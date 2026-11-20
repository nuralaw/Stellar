import Link from "next/link";
import { I, Icon } from "@/components/bank/icons";
import { LESSON_SLUG } from "@/components/auth/auth-views";
import { Card } from "@/components/home/parts";
import { lessonVisual } from "@/components/lessons/lessonVisual";
import { PlusMark } from "@/components/plus/PlusMark";
import { BTN_GHOST_DARK, BTN_ON_DARK, BTN_PRIMARY, BTN_SECONDARY, EYEBROW, FOCUS, LINK_STRONG, PLUS_SURFACE, SECTION } from "@/components/plus/styles";
import type { AuthFacts } from "@/lib/auth-facts";
import { INTERVALS } from "@/lib/review";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { DOMAINS } from "@/lib/taxonomy";
import { PAGE } from "@/lib/ui";
import { DemoIsland, type DemoScene } from "./DemoIsland";

// The public home page for signed-out visitors and search engines (shown at "/" by src/proxy.ts, served from app/landing).
// Static: every number comes from AuthFacts (never typed in by hand), and every claim reuses the wording of /plus and the sign-up
// screen, so it stays true. Free vs Plus is marked the same way as on /plus.

const num = (n: number) => n.toLocaleString("en-US");
/** The Q&As rendered in the FAQ section and sent to search engines as FAQPage JSON-LD (one list, so they always match). */
function faqItems(facts: AuthFacts): { q: string; a: string }[] {
  const { tests: t, lessons: l, free: f } = facts;
  return [
    {
      q: "Is Stellar really free?",
      a: `Yes, with no time limit and no card. The College Board question bank, ${f.vocabWords !== null ? `${f.vocabWords} vocabulary words` : "the vocabulary"}, the weekly tournament, basic statistics, your Mistakes list and the practice tests from ${t.freeLabel} are free, and they stay free.`,
    },
    {
      q: "Do I need an account?",
      a: "Yes, a free one. Registration is required to practice, and your answers, test scores and progress are then saved to your account on every device.",
    },
    {
      q: "What are the practice tests?",
      a: `They're past Digital SAT papers, rebuilt in Stellar: timed modules (${t.rwMin} minutes for each Reading and Writing module, ${t.mathMin} for each Math module), then an estimated score out of 1600 (800 for Reading and Writing tests) from a typical scoring curve and a review of every question. Unlike the real test, module 2 doesn't change based on how you did in module 1. SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.`,
    },
    {
      q: "What does Plus add?",
      a: `All ${t.total} past-paper practice tests (free covers the ${t.free} newest), the General question bank${
        f.generalQuestions ? ` (${num(f.generalQuestions)} past-paper questions)` : ""
      }, all ${l.total} lessons, a predicted score with your weakest skills and a topic breakdown, and spaced review of your mistakes.`,
    },
    { q: "Is there a free trial?", a: "There's no trial clock. The free plan is the way to try Stellar, and it doesn't run out." },
  ];
}

/** JSON-LD for the landing page: WebSite, Organization and the FAQPage. Serialized so it can't close the script tag. */
function jsonLd(faq: { q: string; a: string }[]): string {
  const data = [
    { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function Landing({ facts }: { facts: AuthFacts }) {
  const { tests: t, lessons: l, free: f, questions } = facts;
  const general = f.generalQuestions;
  const faq = faqItems(facts);
  // The facts row: only numbers we actually have.
  const stats: { value: number; label: string }[] = [
    ...(questions !== null ? [{ value: questions, label: "practice questions" }] : []),
    { value: t.total, label: "past-paper practice tests" },
    { value: l.total, label: "interactive lessons" },
    ...(f.vocabWords !== null ? [{ value: f.vocabWords, label: "vocabulary words" }] : []),
  ];

  const word = facts.word;
  // Three real skill names for the "Weakest skills" example (same picks as the sign-up Pricing tab).
  const weakSkills = [DOMAINS[0], DOMAINS[Math.floor(DOMAINS.length / 2)], DOMAINS[DOMAINS.length - 1]].map((d) => d.skills[0].name);
  const scenes: DemoScene[] = [
    {
      id: "bank",
      label: "Question bank with explanations",
      benefit: `Practice by topic and difficulty, with explanations.${questions !== null ? ` ${num(questions)} questions in all.` : ""} Official College Board questions are free${
        general ? `; Plus adds ${num(general)} past-paper questions` : "; Plus adds past-paper questions"
      }.`,
      tag: "both",
      address: "/practice",
      description: "A sample question: the answer is picked, it turns green and an explanation slides up.",
    },
    {
      id: "tests",
      label: "Full-length practice tests",
      benefit: `${t.total} Digital SAT past papers, timed module by module, scored out of 1600. The ${t.free} newest are free.`,
      tag: "both",
      address: "/test",
      description: "A timed module with a question navigator filling in, then an example score report out of 1600.",
    },
    {
      id: "lessons",
      label: "Interactive lessons",
      benefit: `${l.total} short lessons, one per skill: see the idea, follow a worked example, check yourself, then finish with real SAT questions.`,
      tag: "plus",
      address: "/lessons",
      description: "A lesson animation, with its four stages lighting up: idea, worked example, check, real SAT questions.",
    },
    {
      id: "vocab",
      label: "Vocabulary",
      benefit: `${f.vocabWords !== null ? `${num(f.vocabWords)} SAT words` : "SAT words"} with flashcards and quizzes.`,
      tag: "free",
      address: "/vocabulary",
      description: "A flashcard flips to show a definition and is marked as learned.",
    },
    {
      id: "mistakes",
      label: "Mistakes and spaced review",
      benefit: `Every wrong answer is saved to practice again. With Plus, each one comes back ${INTERVALS[0]} day later, then ${INTERVALS[1]} days after that, then ${INTERVALS[2]}, until it sticks.`,
      tag: "both",
      address: "/mistakes",
      description: "A wrong answer is saved to the Mistakes list and its review schedule lights up until it is due.",
    },
    {
      id: "stats",
      label: "Score progress",
      benefit: "Statistics track your score trend and accuracy for free. Plus adds a predicted score and ranks the skills costing you the most points.",
      tag: "both",
      address: "/statistics",
      description: "An example score trend rising toward a target, and a list of the weakest skills.",
    },
  ];

  const intro = `${questions !== null ? `${num(questions)} practice questions` : "Practice questions"}, ${t.total} past-paper practice tests and ${l.total} interactive lessons`;

  return (
    <div className={PAGE}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faq) }} />

      {/* Hero */}
      <section aria-labelledby="landing-title" className="mx-auto max-w-3xl text-center">
        <p className={`lesson-in ${EYEBROW}`}>Digital SAT prep</p>
        <h1 id="landing-title" className="lesson-in mt-3 text-3xl font-bold tracking-tight text-balance [animation-delay:70ms] md:text-4xl">
          Free Digital SAT practice: real-format questions, full-length practice tests and interactive lessons
        </h1>
        <p className="lesson-in mx-auto mt-4 max-w-2xl text-base text-muted [animation-delay:140ms] md:text-lg">
          {intro} for the Digital SAT, covering Math and Reading &amp; Writing. Start free: no card and no trial clock. Add Plus for every past paper and every lesson.
        </p>
        <div className="lesson-in mt-6 flex flex-wrap justify-center gap-3 [animation-delay:210ms]">
          <Link href="/register" className={BTN_PRIMARY}>
            Create a free account
          </Link>
          <Link href="/login" className={BTN_SECONDARY}>
            Sign in
          </Link>
        </div>
      </section>

      {/* The demo: one animated scene per feature, and the feature list under it */}
      <DemoIsland scenes={scenes} word={word} vocabWords={f.vocabWords} weakSkills={weakSkills} lesson={lessonVisual(LESSON_SLUG)} />

      <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse rounded-2xl border border-line bg-surface px-4 py-3">
            <dt className="text-[13px] text-muted">{s.label}</dt>
            <dd className="text-2xl font-bold tracking-tight tabular-nums">{num(s.value)}</dd>
          </div>
        ))}
      </dl>

      {/* How it works */}
      <section aria-labelledby="how-title" className={SECTION}>
        <p className={EYEBROW}>How it works</p>
        <h2 id="how-title" className="mt-2 text-2xl font-bold tracking-tight text-balance md:text-3xl">
          Three steps to a steady SAT routine
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Create a free account", body: "No card and no trial clock. Your progress is saved to your account on every device." },
            { title: "Set your test date and target score", body: "Stellar counts down to your SAT and shows how far you are from your target." },
            { title: "Practice a little every day", body: "Answer questions, take a lesson or a timed test. Your mistakes list and study streak keep you on track." },
          ].map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-strong text-sm font-bold text-primary-ink tabular-nums" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* Free and Plus */}
      <section aria-labelledby="plus-title" className={SECTION}>
        <div className="flex items-center gap-2.5">
          <PlusMark size="sm" />
          <p className={EYEBROW}>Stellar Plus</p>
        </div>
        <h2 id="plus-title" className="mt-2 text-2xl font-bold tracking-tight text-balance md:text-3xl">
          Free, with Plus when you need it
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          {`Stellar stays free. Plus adds all ${t.total} past-paper practice tests, the full question bank, ${l.total} interactive lessons, a predicted score and spaced review of your mistakes.`}
        </p>
        <p className="mt-5">
          <Link href="/plus" className={`${LINK_STRONG} text-[15px]`}>
            See Free vs Plus →
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className={SECTION}>
        <p className={EYEBROW}>FAQ</p>
        <h2 id="faq-title" className="mt-2 text-2xl font-bold tracking-tight text-balance md:text-3xl">
          Questions and answers
        </h2>
        <div className="mt-8 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
          {faq.map((i) => (
            <details key={i.q} className="group">
              <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden ${FOCUS}`}>
                {i.q}
                <Icon d={I.chevronD} className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-[15px] leading-relaxed text-muted">{i.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section aria-labelledby="start-title" className={`mt-20 rounded-3xl px-6 py-10 text-center sm:px-10 md:mt-28 md:py-14 ${PLUS_SURFACE}`}>
        <h2 id="start-title" className="text-3xl font-bold tracking-tight text-balance text-side-ink">
          Start your Digital SAT prep today
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-side-ink/80">Create a free account. The College Board question bank, vocabulary, weekly tournament and newest tests stay free for everyone.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className={BTN_ON_DARK}>
            Create a free account
          </Link>
          <Link href="/login" className={BTN_GHOST_DARK}>
            Sign in
          </Link>
        </div>
      </section>
      {/* PAGE has pb-12: with this, 96px in all, so the Support button never covers the last CTA. */}
      <div aria-hidden="true" className="h-12" />
    </div>
  );
}
