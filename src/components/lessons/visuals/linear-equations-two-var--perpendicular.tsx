import { C, Css, Svg, Tex } from "./kit";

// Perpendicular slopes: the 2/5 slope triangle turns 90 degrees and becomes a −5/2 triangle.
export const alt =
  "A slope triangle with run 5 and rise 2 (slope 2/5) is turned a quarter turn. It becomes a triangle that goes 5 up and 2 left (slope −5/2). The two lines are perpendicular.";

const P = "v-linear-equations-two-var--perpendicular-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number, off = 90) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, ${off}% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-linear-equations-two-var--perpendicular-a { animation: 9s ease-in-out infinite; }
${[4, 70].map((t) => fade(t)).join("\n")}
.v-linear-equations-two-var--perpendicular-first { animation-name: v-linear-equations-two-var--perpendicular-first; }
@keyframes v-linear-equations-two-var--perpendicular-first { 0%, 4% { opacity: 0 } 9%, 34% { opacity: 1 } 40%, 100% { opacity: 0 } }
.v-linear-equations-two-var--perpendicular-turn { transform-box: view-box; transform-origin: 130px 120px; animation-name: v-linear-equations-two-var--perpendicular-turn; }
@keyframes v-linear-equations-two-var--perpendicular-turn {
  0%, 36% { transform: rotate(90deg); opacity: 0 }
  38% { transform: rotate(90deg); opacity: 1 }
  62%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: none; opacity: 0 }
}
.v-linear-equations-two-var--perpendicular-line2 { stroke-dasharray: 100; animation-name: v-linear-equations-two-var--perpendicular-line2; }
@keyframes v-linear-equations-two-var--perpendicular-line2 { 0%, 60% { stroke-dashoffset: 100; opacity: 1 } 72%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }
`;
const a = `${P}a`;
const first = `${P}first`;
const turn = `${P}turn`;
const line2 = `${P}line2`;

// Unit 14 px, pivot P = (130, 120). Original triangle: P, (200,120), (200,92). Turned (final) triangle: P, (130,50), (102,50).
export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Line 1: slope 2/5 */}
      <line x1={60} y1={148} x2={250} y2={72} stroke={C.muted} strokeWidth={2.5} />
      {/* Line 2: slope −5/2, perpendicular */}
      <line className={`${a} ${line2}`} x1={144} y1={155} x2={96.4} y2={36} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      {/* Right-angle mark at the pivot */}
      <path className={`${a} ${fc(70)}`} d="M141.1 115.5 L136.7 104.4 L125.5 108.9" fill="none" stroke={C.muted} strokeWidth={1.5} />

      {/* The slope triangle before the turn: run 5, rise 2 */}
      <g className={`${a} ${first}`}>
        <path d="M130 120 H200 V92 Z" fill={C.soft} stroke={C.primary} strokeWidth={2} />
        <text x={165} y={136} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
          run 5
        </text>
        <text x={207} y={110} fontSize={12} fontWeight={700} fill={C.primaryText}>
          rise 2
        </text>
      </g>

      {/* The same triangle after a quarter turn (its resting place is the final frame) */}
      <g className={`${a} ${turn}`}>
        <path d="M130 120 V50 H102 Z" fill={C.soft} stroke={C.primary} strokeWidth={2} />
      </g>
      <g className={`${a} ${fc(70)}`}>
        <text x={152} y={88} fontSize={12} fontWeight={700} fill={C.primaryText}>
          5 up
        </text>
        <text x={124} y={42} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
          2 left
        </text>
      </g>

      {/* Slopes */}
      <Tex x={254} y={68} size={16} anchor="start" width={40} color={C.muted}>
        {String.raw`\dfrac{2}{5}`}
      </Tex>
      <g className={`${a} ${fc(70)}`}>
        <Tex x={52} y={50} size={16} anchor="start" width={50} color={C.ink}>
          {String.raw`-\dfrac{5}{2}`}
        </Tex>
      </g>
    </Svg>
  );
}
