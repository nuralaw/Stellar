import { C, Css, Svg } from "./kit";

// Slope and intercept: a rise/run triangle with units on the line y = 2.5x + 30 (plant height in cm, x in weeks).
export const alt = "A scatterplot of plant height in cm against weeks with the line y = 2.5x + 30. A triangle shows a run of 4 weeks and a rise of 10 cm, so the slope is 2.5 cm per week. The line starts at 30 cm.";

const P = "v-two-var-data--slope-";
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
${at("int", 30)}
${draw("run", 44, 10)}
${at("runt", 52)}
${draw("rise", 58, 10)}
${at("riset", 66)}
${at("res", 76)}
`;

const px = (x: number) => 36 + 27 * x;
const py = (y: number) => 154 - 2.5 * y;
const DOTS: [number, number][] = [[1, 31], [1.5, 33], [3, 38], [4, 39.5], [5, 41], [7, 49], [8, 49.5]];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g stroke={C.line} strokeWidth={1}>
        {[2, 4, 6, 8].map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={154} x2={px(x)} y2={26} />
        ))}
        {[20, 40].map((y) => (
          <line key={`gy${y}`} x1={36} y1={py(y)} x2={px(8)} y2={py(y)} />
        ))}
      </g>
      <path d="M36 154 H262 M36 154 V24" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 2, 4, 6, 8].map((x) => (
          <text key={`tx${x}`} x={px(x)} y={168}>
            {x}
          </text>
        ))}
        {[0, 20, 40].map((y) => (
          <text key={`ty${y}`} x={24} y={py(y) + 4}>
            {y}
          </text>
        ))}
        <text x={282} y={168}>
          weeks
        </text>
        <text x={48} y={26}>
          cm
        </text>
      </g>

      <g className={cls("dots")} fill={C.muted}>
        {DOTS.map(([x, y]) => (
          <circle key={`d${x}`} cx={px(x)} cy={py(y)} r={3} />
        ))}
      </g>

      <line className={cls("line")} x1={px(0)} y1={py(30)} x2={px(8)} y2={py(50)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      {/* Intercept */}
      <g className={cls("int")}>
        <circle cx={px(0)} cy={py(30)} r={4.5} fill={C.good} />
        <text x={46} y={py(30) + 20} fontSize={12} fontWeight={700} fill={C.good}>
          starts at 30 cm
        </text>
      </g>

      {/* Rise and run */}
      <line className={cls("run")} x1={px(2)} y1={py(35)} x2={px(6)} y2={py(35)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      <text className={cls("runt")} x={(px(2) + px(6)) / 2} y={py(35) + 16} fontSize={12} fontWeight={700} fill={C.primary} textAnchor="middle">
        run: 4 weeks
      </text>
      <line className={cls("rise")} x1={px(6)} y1={py(35)} x2={px(6)} y2={py(45)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      <text className={cls("riset")} x={px(6) + 8} y={(py(35) + py(45)) / 2 + 4} fontSize={12} fontWeight={700} fill={C.primary}>
        rise: 10 cm
      </text>

      <g className={cls("res")} textAnchor="middle">
        <text x={216} y={124} fontSize={16} fontWeight={700} fill={C.ink}>
          10 ÷ 4 = 2.5
        </text>
        <text x={216} y={142} fontSize={12} fill={C.muted}>
          cm per week
        </text>
      </g>
    </Svg>
  );
}
