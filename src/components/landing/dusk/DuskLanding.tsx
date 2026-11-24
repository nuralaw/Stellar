import { Sora } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { featureSlides, PricingGrid, Watermark } from "@/components/auth/auth-views";
import { FeatureCarousel } from "@/components/auth/FeatureCarousel";
import { PlanPicker } from "@/components/auth/PlanPicker";
import { LaunchSentence } from "@/components/plus/PlusPersonal";
import { BTN_PRIMARY } from "@/components/plus/styles";
import type { AuthFacts } from "@/lib/auth-facts";
import { RESOURCE_NAV } from "@/lib/nav";
import { PLAN_ORDER, PLUS } from "@/lib/plus-config";
import logo from "../../../../public/logo.png";
import logoDark from "../../../../public/logo-dark.png";
import { DuskBehavior } from "./DuskBehavior";
import { JsFlag } from "./JsFlag";
import { dateWithYear, duskFacts, faqItems, seasonLabel, shortDate } from "./facts";
import { STARS } from "./stars";
import "./dusk.css";

// The public home page for signed-out visitors and search engines ("Dusk to Stars"): one evening from day to night,
// one path, five chapters, then the app's Features and Pricing, the FAQ and the final call to action. Shown at "/" by
// src/proxy.ts (served from app/landing). A Server Component: static HTML, every number from AuthFacts / lib data.
// Behaviour (reveal, countdown, dock, "Follow the path") lives in DuskBehavior.tsx. Styles: dusk.css (all under .dk).

// Weights 300 to 600 are used; Sora is a variable font, so one file covers them.
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

const styleVars = (v: Record<string, string>) => v as CSSProperties;

type TagKind = "free" | "plus" | "both";

function Tag({ kind }: { kind: TagKind }) {
  if (kind === "both")
    return (
      <span className="tag tag--both">
        <span className="tag__half tag__half--free">Free</span>
        <span className="sr-only"> and </span>
        <span className="tag__half tag__half--plus">Plus</span>
      </span>
    );
  return <span className={`tag tag--${kind}`}>{kind === "free" ? "Free" : "Plus"}</span>;
}

const Spark = ({ className }: { className: string }) => (
  <svg className={className} aria-hidden="true" focusable="false">
    <use href="#dk-spark" />
  </svg>
);

const PathSeg = ({ className = "" }: { className?: string }) => (
  <div className={`path-seg ${className}`.trim()} aria-hidden="true">
    <span className="path-seg__fill" />
    <span className="path-seg__head" />
  </div>
);

const Milestone = () => (
  <span className="milestone" aria-hidden="true">
    <svg className="milestone__base" focusable="false">
      <use href="#dk-spark" />
    </svg>
    <svg className="milestone__lit" focusable="false">
      <use href="#dk-spark" />
    </svg>
  </span>
);

const Connector = ({ className }: { className: string }) => (
  <div className={`connector ${className}`} aria-hidden="true">
    <svg className="connector__track" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
      <path vectorEffect="non-scaling-stroke" d="M0 0 C0 60 100 40 100 100" />
    </svg>
    <svg className="connector__draw" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
      <path vectorEffect="non-scaling-stroke" d="M0 0 C0 60 100 40 100 100" />
    </svg>
  </div>
);

const ChapterLabel = ({ n, name }: { n: number; name: string }) => (
  <p className="chapter-label">
    <span>Chapter {n}</span>
    <span aria-hidden="true">·</span>
    <span className="chapter-label__name">{name}</span>
  </p>
);

const Icon = ({ id, size, className = "icon" }: { id: string; size: number; className?: string }) => (
  <svg className={className} width={size} height={size} aria-hidden="true" focusable="false">
    <use href={`#dk-${id}`} />
  </svg>
);

const ROUTE = [
  { href: "#chapter-1", n: 1, name: "Start free" },
  { href: "#chapter-2", n: 2, name: "Practice daily" },
  { href: "#chapter-3", n: 3, name: "Fix your mistakes" },
  { href: "#chapter-4", n: 4, name: "Take full tests" },
  { href: "#chapter-5", n: 5, name: "Test day" },
];

const TWINKLES: [string, string, string, string][] = [
  ["6%", "29%", "4px", "1600ms"],
  ["13%", "55%", "3px", "1700ms"],
  ["21%", "35%", "3px", "1000ms"],
  ["28%", "51%", "4px", "1500ms"],
  ["34%", "44%", "3px", "1400ms"],
  ["66%", "32%", "3px", "200ms"],
  ["72%", "59%", "4px", "1700ms"],
  ["79%", "29%", "3px", "2000ms"],
  ["86%", "92%", "4px", "1200ms"],
  ["93%", "70%", "4px", "1400ms"],
  ["17%", "34%", "4px", "1100ms"],
  ["83%", "33%", "3px", "1500ms"],
];

const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** `clock`: the SAT dates still ahead and the year, from satClock() (the page itself never reads the clock). */
export function DuskLanding({ facts, clock }: { facts: AuthFacts; clock: { dates: string[]; year: number } }) {
  const d = duskFacts(facts);
  const { dates, year } = clock;
  const { tests: t, lessons: l, tournament: tr, review: r } = d;
  const faq = faqItems(d);
  const anyPrice = PLAN_ORDER.some((id) => PLUS.plans[id].amountCents !== null);
  const next = dates[0];
  const startAt = `${String(d.startHour).padStart(2, "0")}:00`;
  const startText = d.startHour < 12 ? `${d.startHour}:00 a.m.` : `${d.startHour - 12 || 12}:00 p.m.`;
  const features = <FeatureCarousel slides={featureSlides(facts)} />;

  return (
    <div id="dk-root" className={`dk ${sora.variable}`}>
      <JsFlag />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <svg className="sprite" aria-hidden="true" focusable="false" width="0" height="0">
        <symbol id="dk-spark" viewBox="0 0 100 100">
          <path vectorEffect="non-scaling-stroke" d="M50 0 A50 50 0 0 0 100 50 A50 50 0 0 0 50 100 A50 50 0 0 0 0 50 A50 50 0 0 0 50 0 Z" />
        </symbol>
        <symbol id="dk-i-arrow-down" viewBox="0 0 24 24">
          <path vectorEffect="non-scaling-stroke" d="M12 5v14M6 13l6 6 6-6" />
        </symbol>
        <symbol id="dk-i-check" viewBox="0 0 24 24">
          <path vectorEffect="non-scaling-stroke" d="M5 12.5l4.5 4.5L19 7.5" />
        </symbol>
        <symbol id="dk-i-cross" viewBox="0 0 24 24">
          <path vectorEffect="non-scaling-stroke" d="M7 7l10 10M17 7L7 17" />
        </symbol>
        <symbol id="dk-i-pause" viewBox="0 0 24 24">
          <path vectorEffect="non-scaling-stroke" d="M8.5 5.5v13M15.5 5.5v13" />
        </symbol>
        <symbol id="dk-i-play" viewBox="0 0 24 24">
          <path vectorEffect="non-scaling-stroke" d="M8 5.5l11 6.5-11 6.5z" />
        </symbol>
      </svg>

      <header className="site-header">
        <div className="wrap site-header__inner">
          <Link className="logo-link" href="/">
            <Image src={logo} alt="Stellar" loading="eager" />
          </Link>
          <nav aria-label="Sections">
            <a className="header-link" href="#features">
              Features
            </a>
            <a className="header-link" href="#pricing">
              Pricing
            </a>
          </nav>
          <nav aria-label="Account">
            <Link className="header-link" href="/login">
              Sign in
            </Link>
            <Link className="btn btn--sm" href="/register">
              Create account
            </Link>
          </nav>
        </div>
      </header>

      {/* The page's content. (The app frame around it already provides the <main> landmark.) */}
      <div id="main" className="dk-main" tabIndex={-1}>
        <div className="daytime">
          <div className="zone--day">
            {/* Hero */}
            <section className="hero" aria-labelledby="hero-title" data-dock-hide>
              <div className="sun" aria-hidden="true">
                <span className="sun__halo" />
                <span className="sun__disc" />
              </div>
              <div className="wrap hero__grid">
                <div className="hero__copy">
                  <h1 id="hero-title">
                    <span className="kicker">Free Digital SAT prep</span> From today
                    <br /> to test day.
                  </h1>
                  <p className="hero__sub">One path: practice daily, fix your mistakes, take full tests.</p>
                  <div className="hero__cta">
                    <Link className="btn" href="/register">
                      Create a free account
                    </Link>
                    <p className="trust">Free. No card. No trial clock.</p>
                  </div>
                </div>
                <nav className="route" aria-label="Chapters">
                  <p className="route__label">The path</p>
                  <ol>
                    {ROUTE.map((c) => (
                      <li key={c.n}>
                        <a href={c.href}>
                          {c.n === 5 ? (
                            <svg className="route__dot route__dot--spark" aria-hidden="true" focusable="false">
                              <use href="#dk-spark" />
                            </svg>
                          ) : (
                            <span className={`route__dot route__dot--${c.n}`} aria-hidden="true" />
                          )}
                          <span className="route__text">
                            <span className="route__chapter">
                              Chapter {c.n}
                              <span className="sr-only"> · </span>
                            </span>
                            <span className="route__name">{c.name}</span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
              <div className="hero__trail">
                <div className="wrap hero__trail-row">
                  <a className="link trail-link" href="#chapter-1">
                    Follow the path <Icon id="i-arrow-down" size={20} className="icon trail-link__down" />
                    <svg className="trail-link__play" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle cx="12" cy="12" r="10.25" />
                      <path d="M10 8.2l6 3.8-6 3.8z" />
                    </svg>
                    <span className="sr-only trail-link__hint">, scrolls the page down slowly</span>
                  </a>
                  {next && (
                    <p className="next-chip" data-next-chip>
                      <span className="next-chip__face next-chip__face--static">
                        <Spark className="next-chip__star" />
                        <span>SAT: {dates.map(shortDate).join(" · ")}</span>
                      </span>
                      <span className="next-chip__face next-chip__face--live">
                        <Spark className="next-chip__star" />
                        <span>
                          Next SAT:{" "}
                          <time dateTime={next} data-chip-date>
                            {shortDate(next)}
                          </time>{" "}
                          · <span data-chip-left>00 days</span>
                        </span>
                      </span>
                    </p>
                  )}
                </div>
                <PathSeg className="path-seg--start" />
                <Connector className="connector--hero" />
                <span className="trailhead" aria-hidden="true" />
              </div>
            </section>

            {/* Chapter 1 */}
            <section className="chapter chapter--1" id="chapter-1" aria-labelledby="ch1-title">
              <PathSeg />
              <Milestone />
              <div className="wrap">
                <div className="chapter__inner">
                  <div className="chapter__head">
                    <ChapterLabel n={1} name="Start free" />
                    <h2 id="ch1-title">Start free in three steps</h2>
                  </div>
                  <ol className="steps">
                    {[
                      { h: "Create a free account", p: "Your progress is saved on every device." },
                      { h: "Set your test date and target score", p: "Stellar counts down to your SAT and shows how far you are from your target." },
                      { h: "Practice a little every day", p: "Answer questions or take a timed test. Your Mistakes list and study streak keep you on track." },
                    ].map((s, i) => (
                      <li className="step" key={s.h}>
                        <span className="step__dot" aria-hidden="true">
                          <span className="step__dot-lit" />
                        </span>
                        <p className="step__label">Step {i + 1}</p>
                        <h3>{s.h}</h3>
                        <p>{s.p}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="free-note">
                    <a className="link" href="#plans">
                      See everything that’s free
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Chapter 2 */}
          <section className="chapter chapter--2 zone--golden" id="chapter-2" aria-labelledby="ch2-title">
            <PathSeg />
            <Milestone />
            <div className="wrap">
              <div className="chapter__inner">
                <div className="chapter__head">
                  <ChapterLabel n={2} name="Practice daily" />
                  <h2 id="ch2-title">Daily SAT practice: questions, lessons, words</h2>
                </div>
                <p className="intro">Pick a topic, answer a few questions and read why each answer is right. Small steps add up.</p>
                <div className="features">
                  <p>
                    {d.questions.total !== null ? `${d.questions.total} practice questions` : "Thousands of practice questions"}, {l.total} interactive lessons
                    {d.vocabWords !== null ? ` and ${d.vocabWords} vocabulary words` : " and a vocabulary list"}, with what is free and what is Plus marked on each.
                  </p>
                  <a className="link" href="#features">
                    See every feature
                  </a>
                </div>
                <figure className="panel panel--cloud qcard">
                  <figcaption className="qcard__cap">
                    <span className="chip">Example</span>
                    <span className="qcard__meta">Math · Algebra</span>
                  </figcaption>
                  <p className="qcard__q">If 3x + 5 = 20, what is the value of x?</p>
                  <ol className="qcard__options" aria-label="Answer choices">
                    <li>
                      <span className="qcard__letter">A</span>
                      <span>3</span>
                    </li>
                    <li>
                      <span className="qcard__letter">B</span>
                      <span>4</span>
                    </li>
                    <li className="is-correct">
                      <span className="qcard__letter">C</span>
                      <span>5</span>
                      <Icon id="i-check" size={20} className="icon qcard__tick" />
                    </li>
                    <li>
                      <span className="qcard__letter">D</span>
                      <span>15</span>
                    </li>
                  </ol>
                  <p className="qcard__answer">Correct answer: C</p>
                  <div className="qcard__why">
                    <p className="label">Explanation</p>
                    <p>Subtract 5 from both sides to get 3x = 15. Then divide both sides by 3, so x = 5.</p>
                  </div>
                </figure>
              </div>
            </div>
          </section>

          {/* Chapter 3 */}
          <section className="chapter chapter--3 zone--late" id="chapter-3" aria-labelledby="ch3-title">
            <PathSeg />
            <Milestone />
            <div className="wrap">
              <div className="chapter__inner">
                <div className="chapter__head">
                  <ChapterLabel n={3} name="Fix your mistakes" />
                  <h2 id="ch3-title">Your SAT mistakes, saved and reviewed</h2>
                  <p className="intro">Wrong answers show you what to study next. Stellar keeps every one.</p>
                </div>
                <div className="feature feature--mistakes">
                  <p>
                    Every wrong answer goes to your Mistakes list, and the list is free. With Plus, each mistake comes back after {r[0]} day, then {r[1]} days, then {r[2]}.
                  </p>
                </div>
                <figure className="review">
                  <ol className="review__steps" aria-label="Spaced review schedule">
                    <li>
                      <span className="review__icon">
                        <Icon id="i-cross" size={14} />
                      </span>
                      <span className="review__label">Missed</span>
                    </li>
                    <li>
                      <Spark className="review__star" />
                      <span className="review__label">{r[0]} day</span>
                    </li>
                    <li>
                      <Spark className="review__star" />
                      <span className="review__label">{r[1]} days</span>
                    </li>
                    <li>
                      <Spark className="review__star" />
                      <span className="review__label">{r[2]} days</span>
                    </li>
                  </ol>
                </figure>
              </div>
            </div>
          </section>
        </div>

        {/* Dusk band: no text, no controls */}
        <div className="dusk" aria-hidden="true">
          <span className="dusk__cloud dusk__cloud--1" />
          <span className="dusk__cloud dusk__cloud--2" />
          <span className="dusk__cloud dusk__cloud--3" />
          <span className="dusk__shore" />
          <span className="dusk__water dusk__water--1" />
          <span className="dusk__water dusk__water--2" />
          <span className="dusk__water dusk__water--3" />
          <span className="dusk__water dusk__water--4" />
          <div className="path-seg path-seg--dusk">
            <span className="path-seg__fill" />
            <span className="path-seg__head" />
          </div>
          <span className="dusk__glow" />
          <span className="dusk__horizon" />
          <svg className="dusk__sun" viewBox="0 0 88 132" focusable="false">
            <defs>
              <radialGradient id="dk-setSun" cx="50%" cy="100%" r="100%">
                <stop className="stop-core" offset="0" />
                <stop className="stop-core" offset="0.55" />
                <stop className="stop-rim" offset="1" />
              </radialGradient>
            </defs>
            <path d="M0 44 A44 44 0 0 1 88 44 Z" fill="url(#dk-setSun)" />
            <rect className="glint" x="13" y="52" width="62" height="3" rx="1" opacity="0.8" />
            <rect className="glint" x="21" y="62" width="46" height="2" rx="1" opacity="0.6" />
            <rect className="glint" x="29" y="74" width="30" height="2" rx="1" opacity="0.45" />
            <rect className="glint" x="36" y="88" width="16" height="2" rx="1" opacity="0.3" />
          </svg>
        </div>

        <div className="after-dusk">
          {/* Chapter 4 */}
          <section className="chapter chapter--4 zone--twilight" id="chapter-4" aria-labelledby="ch4-title">
            <PathSeg />
            <Milestone />
            <div className="wrap">
              <div className="chapter__inner">
                <div className="chapter__head">
                  <ChapterLabel n={4} name="Take full tests" />
                  <h2 id="ch4-title">{t.total} past-paper practice tests</h2>
                </div>
                <div className="tests">
                  <p className="intro">
                    Real past Digital SAT papers, rebuilt in Stellar. {t.full} are full-length and {t.rwOnly} are Reading and Writing only. The {t.free} newest are free ({t.freeLabel}); Plus unlocks all {t.total}.
                  </p>
                  {d.format && (
                    <dl className="facts">
                      <div className="facts__item">
                        <dt>modules</dt>
                        <dd>{d.format.modules}</dd>
                      </div>
                      <div className="facts__item">
                        <dt>questions</dt>
                        <dd>{d.format.questions}</dd>
                      </div>
                      <div className="facts__item">
                        <dt>full test</dt>
                        <dd>{d.format.duration}</dd>
                      </div>
                    </dl>
                  )}
                </div>
                <figure className="panel panel--night score">
                  <figcaption className="score__cap">
                    <span className="chip">Example</span>
                    <span className="score__meta">Score report</span>
                  </figcaption>
                  <p className="score__label">Estimated score</p>
                  <p className="score__total">
                    1450<span className="score__of"> / 1600</span>
                  </p>
                  <dl className="score__parts">
                    <div className="score__row score__row--rw">
                      <dt>Reading and Writing</dt>
                      <dd>730</dd>
                    </div>
                    <div className="score__row score__row--math">
                      <dt>Math</dt>
                      <dd>720</dd>
                    </div>
                  </dl>
                  <p className="score__note">Estimated from a typical scoring curve.</p>
                </figure>
                <div className="feature tournament">
                  <div className="feature__head">
                    <h3>Weekly tournament</h3>
                    <Tag kind="free" />
                  </div>
                  <p>{tr.rounds} timed rounds every week, with a leaderboard.</p>
                  <details className="more">
                    <summary>
                      <span>Tournament rules</span>
                      <span className="disclosure__icon" aria-hidden="true" />
                    </summary>
                    <ul className="rules">
                      <li>
                        Reading and Writing: {tr.rwMin} minutes. Math: {tr.mathMin} minutes.
                      </li>
                      <li>
                        {tr.questions} questions per round: {tr.easy} easy, {tr.medium} medium, {tr.hard} hard.
                      </li>
                      <li>
                        {tr.points} points per question, plus a speed bonus of up to {tr.speedBonus}. The maximum is {tr.max}.
                      </li>
                      <li>One attempt per round, in full screen. If you leave full screen, the attempt doesn’t count.</li>
                      <li>A new week starts every {tr.reset}.</li>
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 5 */}
          <section className="chapter chapter--5 zone--night" id="chapter-5" aria-labelledby="ch5-title">
            <div className="arrival" aria-hidden="true">
              <Connector className="connector--arrive" />
              <PathSeg className="path-seg--arrive" />
              {TWINKLES.map(([left, top, s, delay]) => (
                <i key={`${left}-${top}`} className="twinkle" style={styleVars({ left, top, "--dk-s": s, "--dk-d": delay })} />
              ))}
              <span className="spark-big">
                <span className="spark-big__glow" />
                <svg className="spark-big__shape" focusable="false">
                  <use href="#dk-spark" />
                </svg>
              </span>
            </div>
            <div className="wrap">
              <div className="chapter__inner">
                <ChapterLabel n={5} name="Test day" />
                <h2 id="ch5-title">Count down to SAT test day</h2>
                {next && (
                  <div className="countdown" data-countdown data-start-hour={d.startHour}>
                    <div className="countdown__face countdown__face--static">
                      <p className="countdown__label">Official SAT dates, {seasonLabel(dates)}</p>
                      <ul className="date-list">
                        {dates.map((iso) => (
                          <li key={iso}>
                            <time dateTime={iso}>{dateWithYear(iso)}</time>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="countdown__face countdown__face--live">
                      <p className="countdown__label">Next official SAT</p>
                      <p className="count" aria-hidden="true">
                        <span className="count__days">00</span> <span className="count__unit">days</span>
                      </p>
                      <p className="count__hours" aria-hidden="true">
                        and 00 hours
                      </p>
                      <p className="sr-only" data-count-sr />
                      <p className="count__date">
                        Next official SAT: <time dateTime={`${next}T${startAt}`}>{longDate.format(new Date(`${next}T00:00:00Z`))}</time>, {startText} local time
                      </p>
                      <p className="count__later">{dates.length > 1 ? `Later: ${dates.slice(1).map(dateWithYear).join(" · ")}` : ""}</p>
                    </div>
                  </div>
                )}
                <div className="feature feature--center">
                  <div className="feature__head">
                    <h3>Test-day countdown</h3>
                    <Tag kind="free" />
                  </div>
                  <p>Your free dashboard counts down to your own test date.</p>
                </div>
                <p className="target">Set your target score. Then take the first step.</p>
                <div className="cta-block" data-dock-hide>
                  <Link className="btn" href="/register">
                    Create a free account
                  </Link>
                  <p className="trust">Free. No card. No trial clock.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Features: the app's own carousel, restyled with the night palette (see .dk-app in dusk.css) */}
          <section className="plans features-sec zone--deep" id="features" aria-labelledby="features-title">
            <div className="wrap">
              <div className="sec-head">
                <p className="section-label">Features</p>
                <h2 id="features-title">What’s inside Stellar</h2>
                <p className="sec-head__sub">Free to start. Plus unlocks the rest, see Pricing.</p>
              </div>
              <div className="dk-app dk-app--features" data-theme="dark" data-dk-watch>
                {features}
              </div>
            </div>
          </section>

          {/* Pricing: Free card + Plus showcase (the /plus layout without the buy button) */}
          <section className="plans pricing-sec zone--deep" id="plans" aria-labelledby="pricing-title">
            <span id="pricing" className="anchor-alias" aria-hidden="true" />
            <div className="wrap">
              <div className="sec-head sec-head--row">
                <div>
                  <p className="section-label">Pricing</p>
                  <h2 id="pricing-title">Start free. Add Plus when you need it.</h2>
                </div>
                <div className="sec-head__aside">
                  <Link className="link" href="/plus">
                    Compare plans and FAQ →
                  </Link>
                  <p className="sec-note">
                    {anyPrice && `${PLUS.priceNote} `}
                    <LaunchSentence format="short" />
                  </p>
                </div>
              </div>
              <div className="dk-app dk-app--pricing" data-theme="dark" data-dk-watch>
                <Watermark />
                <PricingGrid
                  facts={facts}
                  freeCta={
                    <Link href="/register" data-dock-hide className={`${BTN_PRIMARY} w-full`}>
                      Create a free account
                    </Link>
                  }
                  picker={<PlanPicker />}
                />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="faq zone--deep" id="faq" aria-labelledby="faq-title">
            <svg className="night-sep" viewBox="0 0 360 56" aria-hidden="true" focusable="false">
              <polyline points="34,30 98,10 146,42 232,24 318,44" />
              <circle cx="34" cy="30" r="2" />
              <circle cx="98" cy="10" r="2.6" />
              <circle cx="146" cy="42" r="2" />
              <circle cx="232" cy="24" r="2.4" />
              <circle cx="318" cy="44" r="2" />
            </svg>
            <div className="wrap">
              <h2 id="faq-title">Questions about Stellar and the SAT</h2>
              <div className="faq__list">
                {faq.map((item) => (
                  <details key={item.q}>
                    <summary>
                      <span>{item.q}</span>
                      <span className="disclosure__icon" aria-hidden="true" />
                    </summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Final call to action */}
          <section className="final zone--deep" id="start" aria-labelledby="start-title" data-dock-hide>
            <div className="wrap">
              <svg className="final__sky" viewBox="0 0 360 96" aria-hidden="true" focusable="false">
                <polyline points="22,62 66,34 118,60 180,52 214,20" />
                <polyline points="180,52 262,68 330,36" />
                <circle cx="22" cy="62" r="2" />
                <circle cx="66" cy="34" r="2.6" />
                <circle cx="118" cy="60" r="2" />
                <circle cx="214" cy="20" r="2.4" />
                <circle cx="262" cy="68" r="2" />
                <circle cx="330" cy="36" r="2.6" />
                <use href="#dk-spark" x="166" y="38" width="28" height="28" />
              </svg>
              <h2 id="start-title">Your path starts today.</h2>
              <p className="final__text">One free account. Then one small step a day.</p>
              <Link className="btn" href="/register">
                Create a free account
              </Link>
              <p className="final__signin">
                Already have an account?{" "}
                <Link className="link" href="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </section>

          <svg className="starfield" aria-hidden="true" focusable="false">
            {STARS.map(([kind, x, y, size, opacity], i) =>
              kind === "c" ? (
                <circle key={i} cx={`${x}%`} cy={`${y}%`} r={size} opacity={opacity} />
              ) : (
                <use key={i} href="#dk-spark" x={`${x}%`} y={`${y}%`} width={size} height={size} opacity={opacity} transform="translate(-4 -4)" />
              ),
            )}
          </svg>
        </div>
      </div>

      <footer className="site-footer zone--deep" data-dock-hide>
        <div className="wrap">
          <div className="site-footer__row">
            <Link className="logo-link" href="/">
              <Image src={logoDark} alt="Stellar" />
            </Link>
            <nav aria-label="Footer">
              <ul>
                <li>
                  <Link className="link" href="/register">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link className="link" href="/login">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link className="link" href="/plus">
                    Free vs Plus
                  </Link>
                </li>
                {RESOURCE_NAV.map((item) => (
                  <li key={item.href}>
                    <Link className="link" href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="disclaimer">SAT® is a trademark registered by the College Board, which is not affiliated with, and does not endorse, this website.</p>
          <p className="copyright">© {year} Stellar</p>
        </div>
      </footer>

      {/* Slow descent (JS, no reduced motion): one fixed pill and one polite live region */}
      <FollowUi />
      <p className="sr-only" role="status" aria-live="polite" data-follow-live />

      {/* Sticky dock (mobile, JS only) */}
      <div className="dock" data-dock>
        <Link className="btn" href="/register">
          Create a free account
        </Link>
      </div>

      <DuskBehavior />
    </div>
  );
}

function FollowUi(): ReactNode {
  return (
    <div className="follow-pill" data-follow-pill data-follow-ui role="group" aria-label="Following the path">
      <div className="follow-pill__full">
        <svg className="follow-pill__spark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <use href="#dk-spark" />
        </svg>
        <span className="follow-pill__text">Following the path</span>
        <button type="button" className="follow-pill__btn" data-follow-pause aria-pressed="false">
          <Icon id="i-pause" size={22} />
          <span className="sr-only">Pause scrolling</span>
        </button>
        <button type="button" className="follow-pill__btn" data-follow-stop>
          <Icon id="i-cross" size={22} />
          <span className="sr-only">Stop scrolling</span>
        </button>
      </div>
      <div className="follow-pill__mini">
        <button type="button" className="follow-pill__go" data-follow-continue>
          <Icon id="i-play" size={18} className="icon icon--fill" />
          <span className="follow-pill__label">Continue</span>
        </button>
        <button type="button" className="follow-pill__btn" data-follow-dismiss>
          <Icon id="i-cross" size={22} />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}
