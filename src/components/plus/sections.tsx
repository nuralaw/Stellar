import type { ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { FreeFacts, LessonFacts, TestFacts } from "@/lib/plus-facts";
import { PLUS, paymentsLive } from "@/lib/plus-config";
import { INTERVALS } from "@/lib/review";
import { PlusCta } from "./PlusCta";
import { FinalDateLine, LaunchSentence } from "./PlusPersonal";
import { PlusMark } from "./PlusMark";
import { OpenOnHash } from "./OpenOnHash";
import { EYEBROW, FOCUS, PLUS_SURFACE, SECTION } from "./styles";

// The static sections of /plus (server-safe). Every number comes from the facts passed in or from the config.

const num = (n: number) => n.toLocaleString("en-US");

export function SectionHead({ id, eyebrow, title, body, center = false }: { id: string; eyebrow: string; title: string; body?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 id={`${id}-title`} className="mt-2 text-2xl font-bold tracking-tight text-balance md:text-3xl">
        {title}
      </h2>
      {body && <p className={`mt-3 text-muted ${center ? "mx-auto max-w-2xl" : "max-w-xl"}`}>{body}</p>}
    </div>
  );
}

export function CheckList({ items, className = "mt-5" }: { items: string[]; className?: string }) {
  return (
    <ul className={`${className} space-y-2.5 text-[15px]`}>
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <Icon d={I.check} className="mt-0.5 h-5 w-5 shrink-0 text-primary-strong" strokeWidth={2.4} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm">{value}</span>;
  return value ? (
    <>
      <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5 text-success" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
      <span className="sr-only">Included</span>
    </>
  ) : (
    <>
      <span className="text-muted" aria-hidden="true">
        –
      </span>
      <span className="sr-only">Not included</span>
    </>
  );
}

export function FreeSection({ t, l, f }: { t: TestFacts; l: LessonFacts; f: FreeFacts }) {
  const tiles = [
    { title: "College Board question bank", line: f.cbQuestions ? `${num(f.cbQuestions)} official College Board questions` : "Official College Board questions" },
    { title: "Vocabulary", line: f.vocabWords ? `${f.vocabWords} words, with practice` : "SAT words, with practice" },
    { title: "Weekly tournament", line: "Rounds and leaderboards every week" },
    { title: "Statistics", line: "Score trend, accuracy and sections" },
    { title: "Mistakes list", line: "Every wrong answer, ready to practice again" },
    { title: "Newest practice tests", line: `The ${t.free} tests from ${t.freeLabel}` },
  ];
  const rows: { name: string; free: boolean | string; plus: boolean | string }[] = [
    { name: "Practice tests", free: `${t.free} newest`, plus: `All ${t.total}` },
    { name: "Question Bank", free: "College Board", plus: f.generalQuestions ? `+ ${num(f.generalQuestions)} past-paper questions` : "+ past-paper questions" },
    { name: "Lessons", free: false, plus: `All ${l.total}` },
    { name: "Predicted score", free: false, plus: true },
    { name: "Weakest skills and topic breakdown", free: false, plus: `${f.skills} skills` },
    { name: "Mistakes", free: "List to practice again", plus: `Spaced review (${INTERVALS.join(", ")} days)` },
    { name: "Vocabulary, tournament", free: true, plus: true },
  ];
  return (
    <section id="free" aria-labelledby="free-title" className={SECTION}>
      <SectionHead id="free" eyebrow="Free plan" title="Free stays free" body="No trial clock and no card. Whether or not you get Plus, you keep:" />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((x) => (
          <li key={x.title} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success-soft text-success">
              <Icon d={I.check} className="h-4 w-4" strokeWidth={3} />
            </span>
            <span>
              <span className="block font-semibold">{x.title}</span>
              <span className="block text-sm text-muted">{x.line}</span>
            </span>
          </li>
        ))}
      </ul>
      <h3 id="compare" className="mt-12 scroll-mt-20 text-lg font-semibold lg:scroll-mt-8">
        Free and Plus, side by side
      </h3>
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <table className="w-full table-fixed text-left text-sm">
          <caption className="sr-only">Free compared with Stellar Plus</caption>
          <thead>
            <tr className="border-b border-line text-sm">
              <th scope="col" className="px-3 py-3 sm:px-4">
                <span className="sr-only">Feature</span>
              </th>
              <th scope="col" className="w-[28%] px-3 py-3 text-center font-semibold sm:px-4">
                Free
              </th>
              <th scope="col" className="w-[30%] bg-accent-soft/40 px-3 py-3 text-center font-semibold text-primary-strong sm:px-4">
                <span className="inline-flex items-center gap-1">
                  <Icon d={I.star} filled className="h-3.5 w-3.5" />
                  Plus
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-line last:border-0">
                <th scope="row" className="px-3 py-3 font-medium sm:px-4">
                  {r.name}
                </th>
                <td className="px-3 py-3 text-center sm:px-4">
                  <Cell value={r.free} />
                </td>
                <td className="bg-accent-soft/40 px-3 py-3 text-center sm:px-4">
                  <Cell value={r.plus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FaqSection({ t, l, f }: { t: TestFacts; l: LessonFacts; f: FreeFacts }) {
  const items: { id: string; q: string; a: ReactNode; show?: boolean }[] = [
    {
      id: "faq-free",
      q: "Is the free plan really free?",
      a: `Yes, with no time limit and no card. The College Board question bank, ${f.vocabWords !== null ? `${f.vocabWords} vocabulary words` : "the vocabulary"}, the weekly tournament, basic statistics, your Mistakes list and the practice tests from ${t.freeLabel} are free, and they stay free.`,
    },
    {
      id: "faq-what",
      q: "What does Plus add?",
      a: `All ${t.total} past-paper practice tests (free covers the ${t.free} newest), the General question bank${
        f.generalQuestions ? ` (${num(f.generalQuestions)} past-paper questions)` : ""
      }, all ${l.total} lessons, a predicted score with your weakest skills and a topic breakdown, and spaced review of your mistakes.`,
    },
    { id: "faq-trial", q: "Is there a free trial?", a: "There's no trial clock. The free plan is the way to try Stellar, and it doesn't run out." },
    {
      id: "faq-when",
      q: "When can I buy Plus?",
      show: !paymentsLive(),
      a: (
        <>
          <LaunchSentence format="long" /> Until then, everything free works as usual.
        </>
      ),
    },
    {
      id: "faq-plans",
      q: "What's the difference between Monthly and Until test day?",
      a: `It's the same Plus, paid differently. Monthly is billed every month until it's cancelled. Until test day is one payment that covers you through the SAT date you pick, and it doesn't renew.${
        PLUS.plans.pass.amountCents === null ? " Its price will be announced when payments open." : ""
      } If your SAT is less than ${Math.round(PLUS.passRecommendMinDays / 7)} weeks away, Monthly is usually the better fit.`,
    },
    {
      id: "faq-renew",
      q: "Does Monthly renew automatically?",
      a: `Yes. Monthly renews every month until it's cancelled.${PLUS.cancelText ? " " + PLUS.cancelText : ""} Until test day doesn't renew: it's one payment and it simply ends after your test date.`,
    },
    { id: "faq-cancel", q: "How do I cancel?", show: Boolean(PLUS.cancelText), a: PLUS.cancelText },
    { id: "faq-refund", q: "Can I get a refund?", show: Boolean(PLUS.refundDays), a: `Yes, within ${PLUS.refundDays} days of paying. Write to us through Support.` },
    {
      id: "faq-end",
      q: "What happens when Plus ends?",
      a: "Nothing is deleted. Your answers, test scores, lesson progress and mistakes stay in your account. Lessons, older tests, the predicted score and spaced review lock again, and if you come back, spaced review picks up from your history.",
    },
    {
      id: "faq-tests",
      q: "What are the practice tests?",
      a: `They're past Digital SAT papers, rebuilt in Stellar: timed modules (${t.rwMin} minutes for each Reading and Writing module, ${t.mathMin} for each Math module), then an estimated score out of 1600 (800 for Reading and Writing tests) from a typical scoring curve and a review of every question. Unlike the real test, module 2 doesn't change based on how you did in module 1. SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.`,
    },
    {
      id: "faq-bug",
      q: "I reported a bug. Do I get a discount?",
      show: Boolean(PLUS.bugDiscountPercent),
      a: `Yes. If we confirm a bug you reported through Support, you get ${PLUS.bugDiscountPercent}% off a Stellar subscription. We'll contact you using the details you left in your report.`,
    },
    {
      id: "faq-family",
      q: "Several students in one family, or a class?",
      a: "Each Plus is for one student account. For brothers and sisters or a class, write to us through Support.",
    },
  ];
  return (
    <section id="faq" aria-labelledby="faq-title" className={SECTION}>
      <SectionHead id="faq" eyebrow="FAQ" title="Questions and answers" center />
      <OpenOnHash />
      <div className="mx-auto mt-8 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
        {items
          .filter((i) => i.show !== false)
          .map((i) => (
            <details key={i.id} id={i.id} className="group scroll-mt-20 lg:scroll-mt-8">
              <summary className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden ${FOCUS}`}>
                {i.q}
                <Icon d={I.chevronD} className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-[15px] leading-relaxed text-muted">{i.a}</div>
            </details>
          ))}
      </div>
    </section>
  );
}

export function FinalBand() {
  return (
    <>
      <section aria-labelledby="final-title" className={`mt-20 rounded-3xl px-6 py-10 text-center sm:px-10 md:mt-28 md:py-14 ${PLUS_SURFACE}`}>
        <PlusMark size="lg" className="mx-auto" />
        <h2 id="final-title" className="mt-5 text-3xl font-bold tracking-tight text-balance text-side-ink">
          Every past paper. Every lesson. A plan for every mistake.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-side-ink/80">The College Board question bank, vocabulary, weekly tournament and newest tests stay free for everyone.</p>
        <FinalDateLine />
        <PlusCta variant="final" />
      </section>
      {/* PAGE has pb-12: with this, 96px in all, so the Support button never covers the last CTA. */}
      <div aria-hidden="true" className="h-12" />
    </>
  );
}
