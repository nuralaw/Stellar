import Link from "next/link";
import { domainsFor, SECTIONS, type SectionId } from "@/lib/taxonomy";

const FEATURES = [
  {
    title: "Question bank",
    body: "Original Math and Reading & Writing questions, sorted by skill and difficulty, each with a step-by-step explanation.",
    href: "/practice",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    title: "Adaptive practice test",
    body: "Full-length tests in the real Digital SAT format: two modules per section, a timer, and an estimated 400–1600 score.",
    href: "/test",
    icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "Lessons",
    body: "Short, focused lessons on every tested skill — the formulas, grammar rules, and strategies that actually matter.",
    href: "/lessons",
    icon: "M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h12",
  },
  {
    title: "Progress tracking",
    body: "Sign in to save your work and see accuracy by skill, so you know exactly what to study next.",
    href: "/login",
    icon: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  },
];

const STEPS = [
  { n: "1", title: "Take a practice test", body: "Get a baseline score under real timing." },
  { n: "2", title: "Find your weak skills", body: "See your accuracy broken down by skill." },
  { n: "3", title: "Practice and learn", body: "Drill targeted questions and read short lessons." },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function SampleQuestion() {
  const choices = [
    { l: "A", t: "10" },
    { l: "B", t: "26", correct: true },
    { l: "C", t: "30" },
    { l: "D", t: "34" },
  ];
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.35)]">
      <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted">
        <span>Math · Algebra</span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-ink">Easy</span>
      </div>
      <p className="mb-5 text-[15px] leading-relaxed">
        If <span className="font-serif italic">3x</span> + 7 = 22, what is the value of{" "}
        <span className="font-serif italic">6x</span> − 4?
      </p>
      <ul className="space-y-2">
        {choices.map((c) => (
          <li
            key={c.l}
            className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm ${
              c.correct ? "border-success bg-success-soft" : "border-line"
            }`}
          >
            <span
              className={`grid h-6 w-6 place-items-center rounded-full border text-xs font-semibold ${
                c.correct ? "border-success bg-success text-surface" : "border-line text-muted"
              }`}
            >
              {c.l}
            </span>
            {c.t}
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-4 text-sm text-muted">
        <span className="font-semibold text-success">Correct.</span> 3x = 15, so x = 5 and 6x − 4 = 30 − 4 = 26.
      </p>
    </div>
  );
}

function SectionBreakdown({ id }: { id: SectionId }) {
  const s = SECTIONS[id];
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-lg font-semibold">{s.name}</h3>
      <p className="mt-1 text-sm text-muted">
        {s.modules} modules · {s.questionsPerModule} questions each · {s.minutesPerModule} min each
      </p>
      <ul className="mt-5 space-y-3">
        {domainsFor(id).map((d) => (
          <li key={d.id}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-medium">{d.name}</span>
              <span className="tabular-nums text-muted">≈{d.weight}</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-muted" style={{ width: d.weight }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 md:px-8 xl:grid-cols-[1.1fr_1fr] md:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            100% free · Digital SAT format
          </p>
          <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-balance md:text-5xl 2xl:text-6xl">
            Your free path to a higher SAT score.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-pretty text-muted">
            Practice with original questions, take full-length adaptive tests, and learn every skill the Digital SAT
            measures — no paywalls.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/practice"
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
            >
              Start practicing
            </Link>
            <Link
              href="/test"
              className="rounded-xl border border-line bg-surface px-5 py-3 font-semibold transition-colors hover:bg-surface-2"
            >
              Take a practice test
            </Link>
          </div>
        </div>
        <SampleQuestion />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Everything you need to prepare</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-primary"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon d={f.icon} />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What's on the test */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What&apos;s on the Digital SAT</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Two sections, four modules, 2 hours 14 minutes. The second module of each section adapts to how you did on
          the first.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <SectionBreakdown id="rw" />
          <SectionBreakdown id="math" />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How it works</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-line bg-surface p-6">
              <span className="text-3xl font-bold text-accent">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 md:px-8 pt-8">
        <div className="rounded-3xl bg-side px-6 py-12 text-center text-side-ink md:py-16">
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Start preparing today. <span className="text-accent">It&apos;s free.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-side-muted">No credit card, no trial. Just practice.</p>
          <Link
            href="/practice"
            className="mt-8 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-primary-ink transition-colors hover:bg-primary-hover"
          >
            Start practicing
          </Link>
        </div>
      </section>
    </>
  );
}
