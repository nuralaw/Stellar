import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { MoreTools } from "@/components/resources/MoreTools";
import { ResourceCta } from "@/components/resources/ResourceCta";
import { ScoreCalculator } from "@/components/resources/ScoreCalculator";
import { CARD, H1, H2, H3, LEAD, PROSE, SECTION, TABLE, TABLE_WRAP, TD, TH, TR } from "@/components/resources/styles";
import { breadcrumbJsonLd } from "@/lib/breadcrumbs";
import { BREAK_MINUTES, SCORE_QUESTIONS, SECTION_MINUTES, SECTION_SCORE, TOTAL_SCORE } from "@/lib/score-calculator";
import { OG_BASE } from "@/lib/site";
import type { SectionId } from "@/lib/taxonomy";
import { scaledScore } from "@/lib/test-score";
import { fmtMinutes } from "@/lib/test-types";
import { PAGE } from "@/lib/ui";

// Public and static: a signed-out visitor can open it and search engines index it (docs/SEO.md). The calculator is the only
// client piece; the explanation, the conversion tables and the FAQ are plain server HTML.

const PATH = "/sat-score-calculator";
const TITLE = "Digital SAT Score Calculator | Stellar";
const TOTAL_QUESTIONS = SCORE_QUESTIONS.rw + SCORE_QUESTIONS.math;
const TOTAL_MINUTES = SECTION_MINUTES.rw + SECTION_MINUTES.math;

export function generateMetadata(): Metadata {
  const description = `Estimate your Digital SAT score from correct answers: ${SCORE_QUESTIONS.rw} Reading and Writing and ${SCORE_QUESTIONS.math} Math questions. Free, with the full conversion table.`;
  return {
    title: { absolute: TITLE },
    description,
    alternates: { canonical: PATH },
    openGraph: { ...OG_BASE, title: TITLE, description, url: PATH },
  };
}

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "rw", label: "Reading and Writing" },
  { id: "math", label: "Math" },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is the SAT score range?",
    a: `Each section is scored from ${SECTION_SCORE.min} to ${SECTION_SCORE.max}, and the total is the sum of the two, from ${TOTAL_SCORE.min} to ${TOTAL_SCORE.max}.`,
  },
  {
    q: "How many questions are on the Digital SAT?",
    a: `${SCORE_QUESTIONS.rw} in Reading and Writing (${SECTION_MINUTES.rw} minutes) and ${SCORE_QUESTIONS.math} in Math (${SECTION_MINUTES.math} minutes): ${TOTAL_QUESTIONS} in total, in ${fmtMinutes(TOTAL_MINUTES)} of testing, with a ${BREAK_MINUTES}-minute break between the sections.`,
  },
  {
    q: "Is there a penalty for wrong answers?",
    a: "No. A wrong answer counts the same as a blank one, so answer every question.",
  },
];

function ConversionTable({ id, label }: { id: SectionId; label: string }) {
  const total = SCORE_QUESTIONS[id];
  const rows = Array.from({ length: total + 1 }, (_, correct) => ({ correct, score: scaledScore(id, correct, total) }));
  return (
    <div className="min-w-0">
      <h3 className={H3}>{label}</h3>
      <div className={`${TABLE_WRAP} mt-3`}>
        <table className={TABLE}>
          <caption className="sr-only">{`${label}: correct answers out of ${total} and the estimated scaled score`}</caption>
          <thead>
            <tr>
              <th scope="col" className={TH}>
                Correct answers
              </th>
              <th scope="col" className={TH}>
                Section score
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.correct} className={TR}>
                <th scope="row" className={`${TD} font-medium`}>
                  {r.correct}
                </th>
                <td className={TD}>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className={PAGE}>
      <JsonLd json={breadcrumbJsonLd([{ name: "SAT score calculator", path: PATH }])} />
      <h1 className={H1}>Digital SAT score calculator</h1>
      <p className={LEAD}>
        Enter how many questions you answered correctly in each section. You get an estimated section score ({SECTION_SCORE.min}–{SECTION_SCORE.max}) and total score ({TOTAL_SCORE.min}–{TOTAL_SCORE.max}).
      </p>

      <ScoreCalculator />

      <section aria-labelledby="how-title" className={SECTION}>
        <h2 id="how-title" className={H2}>
          How the estimate works
        </h2>
        <p className={PROSE}>
          The calculator turns your correct answers in each section into a scaled score, then adds the two. The curve is an estimate, modeled on published conversion tables for the linear (non-adaptive) Digital SAT practice forms.
        </p>
        <p className={PROSE}>
          The real test is adaptive: how you do on module 1 decides whether module 2 is more or less difficult. So a real score can differ from this estimate.
        </p>
      </section>

      <section aria-labelledby="table-title" className={SECTION}>
        <h2 id="table-title" className={H2}>
          Raw score to scaled score
        </h2>
        <p className={PROSE}>The estimated section score for every number of correct answers.</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {SECTIONS.map((s) => (
            <ConversionTable key={s.id} id={s.id} label={s.label} />
          ))}
        </div>
      </section>

      <section aria-labelledby="faq-title" className={SECTION}>
        <h2 id="faq-title" className={H2}>
          SAT score questions
        </h2>
        <div className="mt-4 grid max-w-3xl gap-3">
          {FAQ.map((item) => (
            <div key={item.q} className={`${CARD} p-5`}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <ResourceCta text="Take a timed practice test and see your own estimated score." href="/test" label="Open practice tests" />
      <MoreTools current={PATH} />
    </div>
  );
}
