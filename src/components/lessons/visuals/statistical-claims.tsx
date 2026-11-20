import { C, Css, Svg } from "./kit";

// Statistical claims: 60 nurses are picked at random from one hospital's 400, so the result spreads to all 400
// in that hospital, and stops there: "all city nurses" gets a cross.
export const alt = "60 nurses are picked at random from one hospital's 400. The result spreads to all 400 in that hospital, not to all city nurses.";

// The hospital: 8 × 5 dots, each dot stands for 10 nurses. 6 highlighted dots = the sample of 60.
const DX = (c: number) => 41 + c * 14;
const DY = (r: number) => 78 + r * 14;
const SAMPLE: Record<string, number> = { "1-0": 1, "6-0": 2, "3-1": 3, "0-3": 2, "5-3": 1, "7-4": 3 };
const CELLS = [0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2, 3, 4, 5, 6, 7].map((c) => ({ c, r, wave: SAMPLE[`${c}-${r}`] ?? 0 })));

// Nurses elsewhere in the city: never sampled.
const OUTSIDE = [
  [180, 34], [201, 29], [223, 36], [245, 30], [266, 35], [287, 30],
  [191, 52], [213, 55], [235, 50], [256, 55], [277, 51],
];

const pick = (n: number, at: number) => `
.v-statistical-claims-p${n} { fill: ${C.primary}; stroke: ${C.primary}; transform-box: fill-box; transform-origin: center; animation-name: v-statistical-claims-p${n}; }
@keyframes v-statistical-claims-p${n} {
  0%, ${at}% { fill: ${C.fill}; stroke: ${C.muted}; transform: scale(1) }
  ${at + 3}% { fill: ${C.primary}; stroke: ${C.primary}; transform: scale(1.7) }
  ${at + 7}%, 100% { fill: ${C.primary}; stroke: ${C.primary}; transform: scale(1) }
}`;

const css = `
.v-statistical-claims-a { animation: 8s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-statistical-claims-scene { animation-name: v-statistical-claims-scene; }
@keyframes v-statistical-claims-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: six dots are picked at random */
${pick(1, 9)}${pick(2, 14)}${pick(3, 19)}
.v-statistical-claims-in1 { animation-name: v-statistical-claims-in1; }
@keyframes v-statistical-claims-in1 { 0%, 24% { opacity: 0; transform: translateX(-8px) } 31%, 100% { opacity: 1; transform: none } }

/* Beat 2: the result spreads to the whole hospital */
.v-statistical-claims-spread { transform-box: fill-box; transform-origin: center; animation-name: v-statistical-claims-spread; }
@keyframes v-statistical-claims-spread { 0%, 38% { opacity: 0; transform: scale(0.5) } 50%, 100% { opacity: 1; transform: scale(1) } }
.v-statistical-claims-box { stroke: ${C.good}; animation-name: v-statistical-claims-box; }
@keyframes v-statistical-claims-box { 0%, 44% { stroke: ${C.muted} } 50%, 100% { stroke: ${C.good} } }
.v-statistical-claims-rest { stroke: ${C.good}; animation-name: v-statistical-claims-rest; }
@keyframes v-statistical-claims-rest { 0%, 40% { stroke: ${C.muted} } 50%, 100% { stroke: ${C.good} } }
.v-statistical-claims-in2 { animation-name: v-statistical-claims-in2; }
@keyframes v-statistical-claims-in2 { 0%, 48% { opacity: 0; transform: translateX(-8px) } 55%, 100% { opacity: 1; transform: none } }
.v-statistical-claims-tick { stroke-dasharray: 100; animation-name: v-statistical-claims-tick; }
@keyframes v-statistical-claims-tick { 0%, 54% { stroke-dashoffset: 100; opacity: 0 } 55% { opacity: 1 } 60%, 100% { stroke-dashoffset: 0; opacity: 1 } }

/* Beat 3: but it stops at the hospital wall */
.v-statistical-claims-strike { stroke-dasharray: 100; animation-name: v-statistical-claims-strike; }
@keyframes v-statistical-claims-strike { 0%, 66% { stroke-dashoffset: 100; opacity: 0 } 67% { opacity: 1 } 73%, 100% { stroke-dashoffset: 0; opacity: 1 } }
.v-statistical-claims-out { opacity: 0.4; animation-name: v-statistical-claims-out; }
@keyframes v-statistical-claims-out { 0%, 66% { opacity: 1 } 74%, 100% { opacity: 0.4 } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-statistical-claims-a v-statistical-claims-scene">
        {/* The city: everyone the claim might want to cover */}
        <rect x={16} y={16} width={288} height={148} rx={10} fill="none" stroke={C.line} strokeWidth={1.5} strokeDasharray="5 5" />
        <text x={28} y={36} fontSize={12} fontWeight={600} fill={C.muted}>
          all city nurses
        </text>
        <path className="v-statistical-claims-a v-statistical-claims-strike" d="M126 27 l10 10 M136 27 l-10 10" pathLength={100} fill="none" stroke={C.bad} strokeWidth={2.5} />
        <g className="v-statistical-claims-a v-statistical-claims-out" fill={C.fill} stroke={C.muted} strokeWidth={1.5}>
          {OUTSIDE.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={4} />
          ))}
        </g>

        {/* One hospital: the group the sample came from */}
        <rect className="v-statistical-claims-a v-statistical-claims-spread" x={28} y={46} width={124} height={104} rx={8} fill={C.goodSoft} />
        <rect className="v-statistical-claims-a v-statistical-claims-box" x={28} y={46} width={124} height={104} rx={8} fill="none" strokeWidth={2} />
        <text x={38} y={64} fontSize={11} fontWeight={600} fill={C.muted}>
          one hospital
        </text>
        <g strokeWidth={1.5}>
          {CELLS.map(({ c, r, wave }) =>
            wave ? (
              <circle key={`${c}-${r}`} className={`v-statistical-claims-a v-statistical-claims-p${wave}`} cx={DX(c)} cy={DY(r)} r={4} />
            ) : (
              <circle key={`${c}-${r}`} className="v-statistical-claims-a v-statistical-claims-rest" cx={DX(c)} cy={DY(r)} r={4} fill={C.fill} />
            ),
          )}
        </g>

        {/* What the study did, and how far its result reaches */}
        <g className="v-statistical-claims-a v-statistical-claims-in1">
          <text x={174} y={86} fontSize={12} fill={C.muted}>
            random sample
          </text>
          <text x={174} y={105} fontSize={17} fontWeight={700} fill={C.ink}>
            <tspan fill={C.primaryText}>60</tspan> of 400
          </text>
        </g>
        <g className="v-statistical-claims-a v-statistical-claims-in2">
          <text x={174} y={127} fontSize={12} fill={C.muted}>
            result fits
          </text>
          <text x={174} y={146} fontSize={17} fontWeight={700} fill={C.ink}>
            all 400
          </text>
        </g>
        <path className="v-statistical-claims-a v-statistical-claims-tick" d="M246 139 l5 5 l10 -12" pathLength={100} fill="none" stroke={C.good} strokeWidth={2.5} />
      </g>
    </Svg>
  );
}
