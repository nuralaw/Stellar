import { C, Css, Svg } from "./kit";

// Scaled data: every y doubles, so y = 2x + 10 becomes y = 4x + 20.
export const alt = "Four dots on the line y = 2x + 10 each move straight up to twice their height. The new line through them is y = 4x + 20: slope 2 becomes 4 and intercept 10 becomes 20.";

const P = "v-two-var-data--scale-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("dots", 2)}
${draw("la", 10, 14)}
${at("arrows", 34)}
${at("dots2", 40)}
${draw("lb", 52, 16)}
${at("txt", 72)}
`;

const px = (x: number) => 44 + 22 * x;
const py = (y: number) => 152 - 2 * y;
const A: [number, number][] = [[2, 15], [4, 17], [6, 23], [8, 27]];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g stroke={C.line} strokeWidth={1}>
        {[2, 4, 6, 8, 10].map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={152} x2={px(x)} y2={30} />
        ))}
        {[20, 40, 60].map((y) => (
          <line key={`gy${y}`} x1={44} y1={py(y)} x2={px(10)} y2={py(y)} />
        ))}
      </g>
      <path d="M44 152 H270 M44 152 V26" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 2, 4, 6, 8, 10].map((x) => (
          <text key={`tx${x}`} x={px(x)} y={167}>
            {x}
          </text>
        ))}
        {[0, 20, 40, 60].map((y) => (
          <text key={`ty${y}`} x={30} y={py(y) + 4}>
            {y}
          </text>
        ))}
      </g>

      {/* Original data and line y = 2x + 10 */}
      <line className={cls("la")} x1={px(0)} y1={py(10)} x2={px(10)} y2={py(30)} pathLength={100} stroke={C.muted} strokeWidth={2.5} />
      <g className={cls("dots")} fill={C.muted}>
        {A.map(([x, y]) => (
          <circle key={`a${x}`} cx={px(x)} cy={py(y)} r={3.5} />
        ))}
      </g>

      {/* Every y doubles */}
      <g className={cls("arrows")} stroke={C.primary} strokeWidth={1.5} fill="none">
        {A.map(([x, y]) => (
          <path key={`r${x}`} d={`M${px(x)} ${py(y) - 6} V${py(2 * y) + 8} m-4 5 l4 -5 l4 5`} />
        ))}
      </g>
      <g className={cls("dots2")} fill={C.primary}>
        {A.map(([x, y]) => (
          <circle key={`b${x}`} cx={px(x)} cy={py(2 * y)} r={3.5} />
        ))}
      </g>

      {/* New line y = 4x + 20 */}
      <line className={cls("lb")} x1={px(0)} y1={py(20)} x2={px(10)} y2={py(60)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />

      <g className={cls("txt")}>
        <text x={56} y={42} fontSize={13} fontWeight={700} fill={C.ink}>
          slope 2 → 4
        </text>
        <text x={56} y={60} fontSize={13} fontWeight={700} fill={C.ink}>
          intercept 10 → 20
        </text>
      </g>
    </Svg>
  );
}
