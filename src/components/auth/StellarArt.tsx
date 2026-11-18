import { I, Icon } from "@/components/bank/icons";
import type { AuthFacts } from "@/lib/auth-facts";
import { MAIN_NAV } from "@/lib/nav";
import { makeStars } from "@/lib/stars";

// The picture on the right of /register and /login (xl+): a constellation climbing the SAT score scale to 1600, on the
// charcoal Plus surface. An illustration, not data. Server component: the animations are CSS only (globals.css).

const num = (n: number) => n.toLocaleString("en-US");
const iconOf = (href: string) =>
  MAIN_NAV.find((i) => i.href === href)?.icon ?? "";

const STARS = makeStars(46, 0);

const P: [number, number][] = [
  [70, 292],
  [150, 259],
  [230, 267],
  [310, 218],
  [390, 185],
  [465, 135],
  [540, 50],
];
const GRID: [string, number][] = [
  ["400", 380],
  ["800", 270],
  ["1200", 160],
  ["1600", 50],
];
const POP = "lesson-pop [transform-box:fill-box] [transform-origin:center]";

function Chip({
  icon,
  text,
  pos,
  delay,
  floatDelay,
  floatDuration,
}: {
  icon: string;
  text: string;
  pos: string;
  delay: number;
  floatDelay: string;
  floatDuration: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`lesson-pop absolute ${pos}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="feat-float"
        style={{ animationDelay: floatDelay, animationDuration: floatDuration }}
      >
        <div className="flex items-center gap-2.5 rounded-2xl bg-surface/95 px-3 py-2 text-[13px] font-semibold text-ink shadow-xl ring-1 ring-line">
          <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary/10 text-primary-strong">
            <Icon d={icon} className="h-4 w-4" />
          </span>
          <span className="tabular-nums">{text}</span>
        </div>
      </div>
    </div>
  );
}

export function StellarArt({
  facts,
  className = "",
}: {
  facts: AuthFacts;
  className?: string;
}) {
  const { questions, tests, lessons } = facts;
  return (
    <div
      className={`relative min-h-[26rem] flex-col overflow-hidden rounded-2xl ring-1 ring-white/10 plus-surface ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="white"
            opacity={s.o}
            className={s.twinkle ? "art-twinkle" : undefined}
            style={
              s.twinkle
                ? {
                    animationDelay: `${s.delay}s`,
                    animationDuration: `${s.dur}s`,
                  }
                : undefined
            }
          />
        ))}
      </svg>
      <div className="relative flex flex-1 flex-col p-6">
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-[600/420] h-full max-w-full">
              <svg
                aria-hidden="true"
                viewBox="0 0 600 420"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="art-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f97316" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="art-glow">
                    <stop offset="0" stopColor="#fb923c" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#fb923c" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="art-star" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fdba74" />
                    <stop offset="1" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
                {GRID.map(([label, y]) => (
                  <g key={label}>
                    <line
                      x1="48"
                      x2="590"
                      y1={y}
                      y2={y}
                      stroke="white"
                      strokeOpacity="0.1"
                      strokeDasharray="4 6"
                    />
                    <text
                      x="0"
                      y={y + 4}
                      fill="white"
                      fillOpacity="0.45"
                      fontSize="12"
                      fontWeight="600"
                    >
                      {label}
                    </text>
                  </g>
                ))}
                <path
                  d={`M${P.map((p) => p.join(",")).join(" L")} L540,380 L70,380 Z`}
                  fill="url(#art-area)"
                  className="stat-fade"
                />
                <polyline
                  points={P.map((p) => p.join(",")).join(" ")}
                  pathLength={1}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stat-line"
                />
                {P.slice(0, 6).map(([x, y], i) => (
                  <g
                    key={i}
                    className={POP}
                    style={{ animationDelay: `${300 + i * 140}ms` }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r="9"
                      fill="#f97316"
                      fillOpacity="0.18"
                    />
                    <circle cx={x} cy={y} r="4" fill="white" />
                  </g>
                ))}
                <circle
                  cx="540"
                  cy="50"
                  r="48"
                  fill="url(#art-glow)"
                  className="art-pulse"
                />
                <g transform="translate(540 50) rotate(-20)">
                  <ellipse
                    rx="44"
                    ry="16"
                    fill="none"
                    stroke="white"
                    strokeOpacity="0.25"
                    strokeDasharray="3 5"
                    className="art-spin"
                  />
                </g>
                <g transform="translate(540 50) scale(2.2) translate(-12 -12)">
                  <path
                    d={I.star}
                    fill="url(#art-star)"
                    className={POP}
                    style={{ animationDelay: "1.2s" }}
                  />
                </g>
                <text
                  x="540"
                  y="112"
                  textAnchor="middle"
                  fill="#fb923c"
                  fontSize="26"
                  fontWeight="800"
                  className="lesson-in"
                  style={{ animationDelay: "1.4s" }}
                >
                  1600
                </text>
              </svg>
              {questions !== null && (
                <Chip
                  icon={iconOf("/practice")}
                  text={`${num(questions)} questions`}
                  pos="left-[9%] top-[17%]"
                  delay={600}
                  floatDelay="0s"
                  floatDuration="4s"
                />
              )}
              <Chip
                icon={iconOf("/test")}
                text={`${tests.total} practice tests`}
                pos="right-0 top-[60%]"
                delay={800}
                floatDelay="-1.3s"
                floatDuration="5s"
              />
              <Chip
                icon={iconOf("/lessons")}
                text={`${lessons.total} lessons`}
                pos="left-[10%] bottom-[4%]"
                delay={1000}
                floatDelay="-2.6s"
                floatDuration="4.5s"
              />
            </div>
          </div>
        </div>
        <div className="relative mt-3">
          <p className="lesson-in text-xs font-semibold tracking-[0.14em] text-side-ink/80 uppercase">
            Digital SAT prep
          </p>
          <p className="lesson-in mt-2 max-w-lg text-2xl leading-tight font-bold tracking-tight text-balance text-side-ink [animation-delay:70ms]">
            Prep for the Digital SAT, all in one place
          </p>
          <p className="lesson-in mt-2 line-clamp-2 max-w-md text-sm text-side-ink/80 [animation-delay:140ms]">
            Practice questions, full-length timed tests and short interactive
            lessons, with your progress saved to your account.
          </p>
        </div>
      </div>
    </div>
  );
}
