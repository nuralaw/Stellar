import { C, Css, Svg, Tex } from "./kit";

// Predict with the line: read two points off the drawn line, get y = 3x + 20, then predict y at x = 6.
export const alt = "A scatterplot with a line of best fit through (0, 20) and (10, 50). The equation is y = 3x + 20, and at x = 6 the line predicts y = 38.";

const P = "v-two-var-data--predict-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("dots", 2)}
${draw("line", 12, 16)}
${at("pts", 32)}
${at("eq", 46)}
${draw("v", 60, 10)}
${draw("h", 68, 10)}
${at("pred", 74)}
`;

const px = (x: number) => 44 + 19 * x;
const py = (y: number) => 150 - 1.7 * y;
const DOTS: [number, number][] = [[1, 22], [2, 28], [3, 27], [4, 35], [5, 34], [7, 43], [8, 46], [9, 47], [11, 55], [12, 54]];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Grid, axes and numbers */}
      <g stroke={C.line} strokeWidth={1}>
        {[2, 4, 6, 8, 10, 12].map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={150} x2={px(x)} y2={30} />
        ))}
        {[10, 20, 30, 40, 50, 60].map((y) => (
          <line key={`gy${y}`} x1={44} y1={py(y)} x2={272} y2={py(y)} />
        ))}
      </g>
      <path d="M44 150 H276 M44 150 V26" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 2, 4, 6, 8, 10, 12].map((x) => (
          <text key={`tx${x}`} x={px(x)} y={165}>
            {x}
          </text>
        ))}
        {[0, 20, 40, 60].map((y) => (
          <text key={`ty${y}`} x={30} y={py(y) + 4}>
            {y}
          </text>
        ))}
      </g>

      {/* The data */}
      <g className={cls("dots")} fill={C.muted}>
        {DOTS.map(([x, y]) => (
          <circle key={`d${x}`} cx={px(x)} cy={py(y)} r={3} />
        ))}
      </g>

      {/* The line of best fit, y = 3x + 20 */}
      <line className={cls("line")} x1={px(0)} y1={py(20)} x2={px(12)} y2={py(56)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      {/* Two points read off the line */}
      <g className={cls("pts")}>
        <circle cx={px(0)} cy={py(20)} r={4.5} fill={C.primary} />
        <circle cx={px(10)} cy={py(50)} r={4.5} fill={C.primary} />
        <text x={52} y={136} fontSize={12} fontWeight={700} fill={C.primaryText}>
          (0, 20)
        </text>
        <text x={226} y={57} fontSize={12} fontWeight={700} fill={C.primaryText} textAnchor="end">
          (10, 50)
        </text>
      </g>

      <g className={cls("eq")}>
        <Tex x={56} y={40} size={16} anchor="start" width={110}>{String.raw`y=3x+20`}</Tex>
      </g>

      {/* Predict at x = 6 */}
      <line className={cls("v")} x1={px(6)} y1={150} x2={px(6)} y2={py(38)} pathLength={100} stroke={C.good} strokeWidth={2} />
      <line className={cls("h")} x1={px(6)} y1={py(38)} x2={44} y2={py(38)} pathLength={100} stroke={C.good} strokeWidth={2} />
      <g className={cls("pred")}>
        <circle cx={px(6)} cy={py(38)} r={4.5} fill={C.good} />
        <text x={50} y={py(38) - 5} fontSize={14} fontWeight={700} fill={C.good}>
          38
        </text>
      </g>
    </Svg>
  );
}
