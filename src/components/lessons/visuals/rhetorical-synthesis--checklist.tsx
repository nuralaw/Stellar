import { C, Css, Svg } from "./kit";

// A goal checklist: every choice gets two ticks. Does it do the goal's job? Are its facts in the notes?
// Only the choice with two ticks locks in.
export const alt =
  "Goal: what sea otters eat. Each choice gets two checks, job and facts. Floating and coasts fail the job; fish fails the facts; sea urchins and crabs passes both and locks in green.";

const P = "v-rhetorical-synthesis--checklist-";
const A = P + "a";
const SCENE = P + "scene";
const GOAL = P + "goal";
const HEAD = P + "head";
const WIN = P + "win";

// [text, job ok, facts ok]
const ROWS: [string, boolean, boolean][] = [
  ["Otters float on their backs.", false, true],
  ["Otters live on Pacific coasts.", false, true],
  ["Otters eat sea urchins and fish.", true, false],
  ["Otters eat sea urchins and crabs.", true, true],
];
const Y0 = 52;
const STEP = 28;
const JOB_X = 252;
const FACT_X = 288;

const markCss = ROWS.map((_, r) => {
  const t = 20 + r * 15;
  const rowN = P + "r" + r;
  const jobN = P + "j" + r;
  const factN = P + "f" + r;
  const dimOrWin =
    r === 3
      ? ""
      : `
.${rowN} { opacity: 0.55; animation-name: ${rowN}; }
@keyframes ${rowN} { 0%, ${t + 9}% { opacity: 1 } ${t + 13}%, 100% { opacity: 0.55 } }`;
  return `${dimOrWin}
.${jobN} { transform-box: fill-box; transform-origin: center; animation-name: ${jobN}; }
@keyframes ${jobN} { 0%, ${t}% { opacity: 0; transform: scale(0.5) } ${t + 3}%, 100% { opacity: 1; transform: none } }
.${factN} { transform-box: fill-box; transform-origin: center; animation-name: ${factN}; }
@keyframes ${factN} { 0%, ${t + 5}% { opacity: 0; transform: scale(0.5) } ${t + 8}%, 100% { opacity: 1; transform: none } }`;
}).join("\n");

const css = `
.v-rhetorical-synthesis--checklist-a { animation: 9s ease-in-out infinite; }
.v-rhetorical-synthesis--checklist-scene { animation-name: v-rhetorical-synthesis--checklist-scene; }
@keyframes v-rhetorical-synthesis--checklist-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }
.v-rhetorical-synthesis--checklist-goal { animation-name: v-rhetorical-synthesis--checklist-goal; }
@keyframes v-rhetorical-synthesis--checklist-goal { 0%, 6% { opacity: 0; transform: translateY(-6px) } 14%, 100% { opacity: 1; transform: none } }
.v-rhetorical-synthesis--checklist-head { animation-name: v-rhetorical-synthesis--checklist-head; }
@keyframes v-rhetorical-synthesis--checklist-head { 0%, 12% { opacity: 0 } 18%, 100% { opacity: 1 } }
.v-rhetorical-synthesis--checklist-win { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-rhetorical-synthesis--checklist-win; }
@keyframes v-rhetorical-synthesis--checklist-win { 0%, 76% { fill: ${C.fill}; stroke: ${C.line} } 82%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
${markCss}
`;

function Tick({ x, y, cls, ok }: { x: number; y: number; cls: string; ok: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`${A} ${cls}`}>
        <g fill="none" strokeWidth={2.5} stroke={ok ? C.good : C.bad}>
          {ok ? <path d="M-5 0 L-1.5 4 L5 -4" /> : <path d="M-4 -4 L4 4 M4 -4 L-4 4" />}
        </g>
      </g>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        <g className={`${A} ${GOAL}`}>
          <text x={16} y={28} fontSize={14} fontWeight={700} fill={C.ink}>
            Goal: say what otters eat
          </text>
        </g>
        <g className={`${A} ${HEAD}`} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
          <text x={JOB_X} y={44}>
            job
          </text>
          <text x={FACT_X} y={44}>
            facts
          </text>
        </g>

        {ROWS.map(([text, jobOk, factOk], r) => {
          const y = Y0 + r * STEP;
          const last = r === ROWS.length - 1;
          return (
            <g key={text}>
              <g className={last ? undefined : `${A} ${P + "r" + r}`}>
                <rect
                  className={last ? `${A} ${WIN}` : undefined}
                  x={16}
                  y={y}
                  width={206}
                  height={24}
                  rx={12}
                  fill={C.fill}
                  stroke={C.line}
                  strokeWidth={1.5}
                />
                <text x={28} y={y + 16} fontSize={12} fontWeight={600} fill={C.ink}>
                  {text}
                </text>
                <Tick x={JOB_X} y={y + 12} cls={P + "j" + r} ok={jobOk} />
                <Tick x={FACT_X} y={y + 12} cls={P + "f" + r} ok={factOk} />
              </g>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
