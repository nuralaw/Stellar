import { C, Css, Svg } from "./kit";

// Pacing and guessing: answers go in fast, question 9 stalls and eats the clock,
// so a guess goes in with a flag and the rest still get answered.
export const alt =
  "Questions 6 to 11 get answered while a time bar drains. Question 9 stalls, so a guess is entered and flagged, and the rest get answered.";

const X0 = 27; // left edge of the first box
const STEP = 46; // box (36) + gap (10)

/** Keyframes for something that pops in at `at` percent of the loop. */
function pop(name: string, at: number) {
  return `
.v-pacing-and-guessing-${name} { transform-box: fill-box; transform-origin: center; animation-name: v-pacing-and-guessing-${name}; }
@keyframes v-pacing-and-guessing-${name} {
  0%, ${at}% { opacity: 0; transform: scale(0.4) }
  ${at + 3}% { opacity: 1; transform: scale(1.2) }
  ${at + 6}%, 100% { opacity: 1; transform: scale(1) }
}`;
}

const css = `
.v-pacing-and-guessing-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-pacing-and-guessing-scene { animation-name: v-pacing-and-guessing-scene; }
@keyframes v-pacing-and-guessing-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Time left: drains slowly, then fast while question 9 is stuck. */
.v-pacing-and-guessing-time { transform-box: fill-box; transform-origin: left center; transform: scaleX(0.48); animation-name: v-pacing-and-guessing-time; }
@keyframes v-pacing-and-guessing-time {
  0%, 6% { transform: scaleX(1) }
  22% { transform: scaleX(0.88) }
  50% { transform: scaleX(0.56) }
  74%, 100% { transform: scaleX(0.48) }
}

/* The cursor: which question you are on. */
.v-pacing-and-guessing-cur { opacity: 0; transform: translateX(${STEP * 5}px); animation-name: v-pacing-and-guessing-cur; }
@keyframes v-pacing-and-guessing-cur {
  0%, 9% { transform: translateX(0); opacity: 1 }
  12%, 14% { transform: translateX(${STEP}px); opacity: 1 }
  17%, 19% { transform: translateX(${STEP * 2}px); opacity: 1 }
  22%, 60% { transform: translateX(${STEP * 3}px); opacity: 1 }
  63%, 66% { transform: translateX(${STEP * 4}px); opacity: 1 }
  69%, 74% { transform: translateX(${STEP * 5}px); opacity: 1 }
  78%, 100% { transform: translateX(${STEP * 5}px); opacity: 0 }
}

${pop("l1", 6)}
${pop("l2", 12)}
${pop("l3", 17)}
${pop("l4", 50)}
${pop("l5", 63)}
${pop("l6", 69)}
${pop("flag", 55)}

/* Question 9's box: neutral, then the accent once it is flagged. */
.v-pacing-and-guessing-box9 { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-pacing-and-guessing-box9; }
@keyframes v-pacing-and-guessing-box9 { 0%, 50% { fill: ${C.fill}; stroke: ${C.line} } 55%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }

/* Captions: the problem, then the move. */
.v-pacing-and-guessing-cap1 { opacity: 0; animation-name: v-pacing-and-guessing-cap1; }
@keyframes v-pacing-and-guessing-cap1 { 0%, 28% { opacity: 0 } 33%, 48% { opacity: 1 } 52%, 100% { opacity: 0 } }
.v-pacing-and-guessing-cap2 { animation-name: v-pacing-and-guessing-cap2; }
@keyframes v-pacing-and-guessing-cap2 { 0%, 54% { opacity: 0; transform: translateY(4px) } 60%, 100% { opacity: 1; transform: none } }
`;

const QS = [
  { n: 6, letter: "C", cls: "v-pacing-and-guessing-l1" },
  { n: 7, letter: "A", cls: "v-pacing-and-guessing-l2" },
  { n: 8, letter: "D", cls: "v-pacing-and-guessing-l3" },
  { n: 9, letter: "B", cls: "v-pacing-and-guessing-l4" },
  { n: 10, letter: "A", cls: "v-pacing-and-guessing-l5" },
  { n: 11, letter: "C", cls: "v-pacing-and-guessing-l6" },
];

export default function Visual() {
  const x9 = X0 + STEP * 3;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-pacing-and-guessing-a v-pacing-and-guessing-scene">
        {/* Time left */}
        <text x={X0} y={30} fontSize={11} fill={C.muted}>
          time left
        </text>
        <rect x={X0} y={38} width={266} height={8} rx={4} fill={C.fill} />
        {/* The chunk question 9 ate (88% → 56%), uncovered as the bar drains */}
        <rect x={X0 + 266 * 0.56} y={38} width={266 * 0.32} height={8} fill={C.bad} opacity={0.55} />
        <rect className="v-pacing-and-guessing-a v-pacing-and-guessing-time" x={X0} y={38} width={266} height={8} rx={4} fill={C.primary} />

        {/* Questions 6 to 11 */}
        {QS.map((q, i) => {
          const x = X0 + STEP * i;
          return (
            <g key={q.n}>
              {q.n === 9 ? (
                <rect className="v-pacing-and-guessing-a v-pacing-and-guessing-box9" x={x} y={70} width={36} height={36} rx={8} strokeWidth={1.5} />
              ) : (
                <rect x={x} y={70} width={36} height={36} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              )}
              <text className={`v-pacing-and-guessing-a ${q.cls}`} x={x + 18} y={94} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.ink}>
                {q.letter}
              </text>
              <text x={x + 18} y={122} textAnchor="middle" fontSize={11} fill={C.muted}>
                {q.n}
              </text>
            </g>
          );
        })}

        {/* The flag on question 9 */}
        <g className="v-pacing-and-guessing-a v-pacing-and-guessing-flag">
          <line x1={x9 + 14} y1={52} x2={x9 + 14} y2={68} stroke={C.primary} strokeWidth={2} />
          <path d={`M${x9 + 14} 52 L${x9 + 27} 56.5 L${x9 + 14} 61 Z`} fill={C.primary} stroke={C.primary} strokeWidth={1.5} />
        </g>

        {/* Cursor */}
        <rect
          className="v-pacing-and-guessing-a v-pacing-and-guessing-cur"
          x={X0 - 3}
          y={67}
          width={42}
          height={42}
          rx={10}
          fill="none"
          stroke={C.primary}
          strokeWidth={2}
        />

        {/* Captions */}
        <text className="v-pacing-and-guessing-a v-pacing-and-guessing-cap1" x={160} y={154} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.primary}>
          95 s gone, no plan
        </text>
        <text className="v-pacing-and-guessing-a v-pacing-and-guessing-cap2" x={160} y={154} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
          Guess, flag, move on
        </text>
      </g>
    </Svg>
  );
}
