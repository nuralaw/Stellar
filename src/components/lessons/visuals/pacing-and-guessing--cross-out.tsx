import { C, Css, Svg } from "./kit";

// Cross out, then guess: the mean of 10, 20, 30 must sit between 10 and 30,
// so 5 and 45 are struck out and a guess goes from 1 in 4 to 1 in 2.
export const alt =
  "Mean of 10, 20, 30, with choices 5, 18, 20 and 45. The mean must be between 10 and 30, so 5 and 45 are crossed out: a guess goes from 1 in 4 to 1 in 2.";

const X0 = 26; // left edge of the first choice
const BW = 58; // choice width
const STEP = 70; // choice + gap (12)
const Y = 56; // top of the choices
const BH = 40;

const CHOICES = [
  { letter: "A", value: "5", out: "v-pacing-and-guessing--cross-out-o1", x: "v-pacing-and-guessing--cross-out-o1-x" },
  { letter: "B", value: "18", out: "", x: "" },
  { letter: "C", value: "20", out: "", x: "" },
  { letter: "D", value: "45", out: "v-pacing-and-guessing--cross-out-o2", x: "v-pacing-and-guessing--cross-out-o2-x" },
];

/** A choice that dims at `at` percent while its strike line is drawn. */
function strike(name: string, at: number) {
  return `
.v-pacing-and-guessing--cross-out-${name} { opacity: 0.4; animation-name: v-pacing-and-guessing--cross-out-${name}; }
@keyframes v-pacing-and-guessing--cross-out-${name} { 0%, ${at}% { opacity: 1 } ${at + 6}%, 100% { opacity: 0.4 } }
.v-pacing-and-guessing--cross-out-${name}-x { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: v-pacing-and-guessing--cross-out-${name}-x; }
@keyframes v-pacing-and-guessing--cross-out-${name}-x { 0%, ${at}% { stroke-dashoffset: 100 } ${at + 6}%, 100% { stroke-dashoffset: 0 } }`;
}

const css = `
.v-pacing-and-guessing--cross-out-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-pacing-and-guessing--cross-out-scene { animation-name: v-pacing-and-guessing--cross-out-scene; }
@keyframes v-pacing-and-guessing--cross-out-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* The reason: where the answer has to be. */
.v-pacing-and-guessing--cross-out-why { animation-name: v-pacing-and-guessing--cross-out-why; }
@keyframes v-pacing-and-guessing--cross-out-why { 0%, 24% { opacity: 0; transform: translateY(4px) } 30%, 100% { opacity: 1; transform: none } }

${strike("o1", 36)}
${strike("o2", 46)}

/* The odds: 1 in 4, then 1 in 2. */
.v-pacing-and-guessing--cross-out-odds1 { opacity: 0; animation-name: v-pacing-and-guessing--cross-out-odds1; }
@keyframes v-pacing-and-guessing--cross-out-odds1 { 0%, 56% { opacity: 1 } 60%, 100% { opacity: 0 } }
.v-pacing-and-guessing--cross-out-odds2 { animation-name: v-pacing-and-guessing--cross-out-odds2; }
@keyframes v-pacing-and-guessing--cross-out-odds2 { 0%, 60% { opacity: 0; transform: translateY(4px) } 66%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={`v-pacing-and-guessing--cross-out-a v-pacing-and-guessing--cross-out-scene`}>
        <text x={160} y={38} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
          Mean of 10, 20, 30?
        </text>

        {CHOICES.map((c, i) => {
          const x = X0 + STEP * i;
          return (
            <g key={c.letter}>
              <g className={c.out ? `v-pacing-and-guessing--cross-out-a ${c.out}` : undefined}>
                <rect x={x} y={Y} width={BW} height={BH} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
                <text x={x + 13} y={Y + 25} textAnchor="middle" fontSize={11} fill={C.muted}>
                  {c.letter}
                </text>
                <text x={x + 36} y={Y + 26} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.ink}>
                  {c.value}
                </text>
              </g>
              {c.out && (
                <path
                  className={`v-pacing-and-guessing--cross-out-a ${c.x}`}
                  d={`M${x + 6} ${Y + BH - 7} L${x + BW - 6} ${Y + 7}`}
                  pathLength={100}
                  fill="none"
                  stroke={C.bad}
                  strokeWidth={2.5}
                />
              )}
            </g>
          );
        })}

        <text className={`v-pacing-and-guessing--cross-out-a v-pacing-and-guessing--cross-out-why`} x={160} y={120} textAnchor="middle" fontSize={12} fill={C.muted}>
          must be between 10 and 30
        </text>

        <text className={`v-pacing-and-guessing--cross-out-a v-pacing-and-guessing--cross-out-odds1`} x={160} y={152} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
          Guess: 1 in 4
        </text>
        <text className={`v-pacing-and-guessing--cross-out-a v-pacing-and-guessing--cross-out-odds2`} x={160} y={152} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.primary}>
          Guess: 1 in 2
        </text>
      </g>
    </Svg>
  );
}
