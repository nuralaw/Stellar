import { C, Css, Svg } from "./kit";

// Trap: a dot is actual, the line predicts. Line y = 3x + 12; the dot (8, 40) sits 4 above the prediction (8, 36).
export const alt = "A scatterplot with the line y = 3x + 12. At x = 8 the line predicts 36, but the data dot is at 40. The gap between them is 4, actual minus predicted.";

const P = "v-two-var-data--gap-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("dots", 2)}
${draw("line", 10, 16)}
${at("dot", 32)}
${at("pred", 48)}
${at("gap", 62)}
${at("gapt", 66)}
${at("eq", 78)}
`;

const px = (x: number) => 44 + 21 * x;
// The y-axis starts at 10 so the gap of 4 is tall enough to see.
const py = (y: number) => 152 - 3.6 * (y - 10);
const DOTS: [number, number][] = [[1, 16], [2, 17], [3, 24], [4, 27], [5, 25], [6, 32], [9, 39], [10, 44], [11, 43]];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g stroke={C.line} strokeWidth={1}>
        {[2, 4, 6, 8, 10].map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={152} x2={px(x)} y2={22} />
        ))}
        {[20, 30, 40].map((y) => (
          <line key={`gy${y}`} x1={44} y1={py(y)} x2={px(11)} y2={py(y)} />
        ))}
      </g>
      <path d="M44 152 H282 M44 152 V18" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 2, 4, 6, 8, 10].map((x) => (
          <text key={`tx${x}`} x={px(x)} y={167}>
            {x}
          </text>
        ))}
        {[10, 20, 30, 40].map((y) => (
          <text key={`ty${y}`} x={30} y={py(y) + 4}>
            {y}
          </text>
        ))}
      </g>

      <g className={cls("dots")} fill={C.muted}>
        {DOTS.map(([x, y]) => (
          <circle key={`d${x}`} cx={px(x)} cy={py(y)} r={3} />
        ))}
      </g>

      {/* Line of best fit, y = 3x + 12 */}
      <line className={cls("line")} x1={px(0)} y1={py(12)} x2={px(11)} y2={py(45)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      {/* The actual dot, the predicted point and the gap */}
      <g className={cls("dot")}>
        <circle cx={px(8)} cy={py(40)} r={4} fill={C.primary} />
        <text x={px(8) - 10} y={py(40) - 8} fontSize={12} fontWeight={700} fill={C.primary} textAnchor="end">
          dot: 40
        </text>
      </g>
      <g className={cls("pred")}>
        <circle cx={px(8)} cy={py(36)} r={3.5} fill={C.good} />
        <text x={px(8) + 10} y={py(36) + 18} fontSize={12} fontWeight={700} fill={C.good}>
          line: 36
        </text>
      </g>
      <g className={cls("gap")} stroke={C.bad} strokeWidth={2.5} fill="none">
        <path d={`M${px(8) - 12} ${py(40)} h5 V${py(36)} h-5`} />
        <line x1={px(8)} y1={py(40) + 4} x2={px(8)} y2={py(36) - 3.5} />
      </g>
      <text className={cls("gapt")} x={px(8) - 18} y={(py(40) + py(36)) / 2 + 4} fontSize={12} fontWeight={700} fill={C.bad} textAnchor="end">
        gap 4
      </text>

      <text className={cls("eq")} x={228} y={122} fontSize={16} fontWeight={700} fill={C.ink} textAnchor="middle">
        40 − 36 = 4
      </text>
    </Svg>
  );
}
