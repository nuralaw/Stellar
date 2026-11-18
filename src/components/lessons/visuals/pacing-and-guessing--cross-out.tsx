import { C, Css, Svg } from "./kit";

// Cross out, then guess: a long probability problem you cannot finish in time. A probability is between 0 and 1,
// so -0.2 and 1.4 are struck out and a guess goes from 1 in 4 to 1 in 2.
export const alt =
  "A long probability problem with choices -0.2, 0.35, 0.6 and 1.4. A probability is between 0 and 1, so -0.2 and 1.4 are crossed out: a guess goes from 1 in 4 to 1 in 2.";

const P = "v-pacing-and-guessing--cross-out-";
const A = P + "a";
const SCENE = P + "scene";
const WHY = P + "why";
const ODDS1 = P + "odds1";
const ODDS2 = P + "odds2";
const X0 = 26; // left edge of the first choice
const BW = 58; // choice width
const STEP = 70; // choice + gap (12)
const Y = 70; // top of the choices
const BH = 40;

const CHOICES = [
  { letter: "A", value: "−0.2", out: P + "o1" },
  { letter: "B", value: "0.35", out: "" },
  { letter: "C", value: "0.6", out: "" },
  { letter: "D", value: "1.4", out: P + "o2" },
];

/** A choice that dims at `at` percent while its strike line is drawn. */
function strike(name: string, at: number) {
  return `
.${P + name} { opacity: 0.4; animation-name: ${P + name}; }
@keyframes ${P + name} { 0%, ${at}% { opacity: 1 } ${at + 6}%, 100% { opacity: 0.4 } }
.${P + name + "-x"} { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: ${P + name + "-x"}; }
@keyframes ${P + name + "-x"} { 0%, ${at}% { stroke-dashoffset: 100 } ${at + 6}%, 100% { stroke-dashoffset: 0 } }`;
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

      <g className={`${A} ${SCENE}`}>
        {/* The long problem: grey lines stand for text you have no time to read */}
        <g fill={C.line}>
          <rect x={26} y={20} width={110} height={7} rx={3.5} />
          <rect x={142} y={20} width={60} height={7} rx={3.5} />
          <rect x={26} y={34} width={150} height={7} rx={3.5} />
          <rect x={182} y={34} width={90} height={7} rx={3.5} />
        </g>
        <text x={26} y={60} fontSize={13} fontWeight={700} fill={C.ink}>
          Probability of the event = ?
        </text>

        {CHOICES.map((c, i) => {
          const x = X0 + STEP * i;
          return (
            <g key={c.letter}>
              <g className={c.out ? `${A} ${c.out}` : undefined}>
                <rect x={x} y={Y} width={BW} height={BH} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
                <text x={x + 13} y={Y + 25} textAnchor="middle" fontSize={11} fill={C.muted}>
                  {c.letter}
                </text>
                <text x={x + 36} y={Y + 26} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
                  {c.value}
                </text>
              </g>
              {c.out && (
                <path
                  className={`${A} ${c.out + "-x"}`}
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

        <text className={`${A} ${WHY}`} x={160} y={132} textAnchor="middle" fontSize={12} fill={C.muted}>
          a probability is between 0 and 1
        </text>

        <text className={`${A} ${ODDS1}`} x={160} y={162} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
          Guess: 1 in 4
        </text>
        <text className={`${A} ${ODDS2}`} x={160} y={162} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.primary}>
          Guess: 1 in 2
        </text>
      </g>
    </Svg>
  );
}
