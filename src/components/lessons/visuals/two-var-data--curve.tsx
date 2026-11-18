import { C, Css, Svg } from "./kit";

// Line or curve: four dots (0, 5), (1, 10), (2, 20), (3, 40). A line misses them, the curve y = 5(2)^x hits all four.
export const alt = "A scatterplot with dots at (0, 5), (1, 10), (2, 20) and (3, 40). A straight line misses every dot by a clear gap. The curve y = 5(2)^x passes through all four.";

const P = "v-two-var-data--curve-";
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
${at("miss", 34)}
${draw("curve", 50, 22)}
${at("hit", 74)}
`;

const px = (x: number) => 48 + 70 * x;
const py = (y: number) => 150 - 2.5 * y;
const DOTS: [number, number][] = [[0, 5], [1, 10], [2, 20], [3, 40]];
// Least-squares line through the four dots: y = 11.5x + 1.5
const line = (x: number) => 11.5 * x + 1.5;
const CURVE = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 3.3) / 33;
  return `${i ? "L" : "M"}${px(x).toFixed(1)} ${py(5 * 2 ** x).toFixed(1)}`;
}).join(" ");

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g stroke={C.line} strokeWidth={1}>
        {[1, 2, 3].map((x) => (
          <line key={`gx${x}`} x1={px(x)} y1={150} x2={px(x)} y2={28} />
        ))}
        {[10, 20, 30, 40, 50].map((y) => (
          <line key={`gy${y}`} x1={48} y1={py(y)} x2={px(3.3)} y2={py(y)} />
        ))}
      </g>
      <path d="M48 150 H286 M48 150 V24" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 1, 2, 3].map((x) => (
          <text key={`tx${x}`} x={px(x)} y={165}>
            {x}
          </text>
        ))}
        {[0, 10, 20, 30, 40, 50].map((y) => (
          <text key={`ty${y}`} x={36} y={py(y) + 4}>
            {y}
          </text>
        ))}
      </g>

      {/* The straight line and its misses */}
      <line className={cls("line")} x1={px(0)} y1={py(line(0))} x2={px(3.3)} y2={py(line(3.3))} pathLength={100} stroke={C.muted} strokeWidth={2.5} />
      <g className={cls("miss")} stroke={C.bad} strokeWidth={2.5}>
        {DOTS.map(([x, y]) => (
          <line key={`m${x}`} x1={px(x)} y1={py(y)} x2={px(x)} y2={py(line(x))} />
        ))}
      </g>

      {/* The curve y = 5(2)^x */}
      <path className={cls("curve")} d={CURVE} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />

      <g fill={C.ink}>
        {DOTS.map(([x, y]) => (
          <circle key={`d${x}`} cx={px(x)} cy={py(y)} r={4.5} />
        ))}
      </g>

      {/* Key */}
      <g className={cls("hit")}>
        <text x={64} y={40} fontSize={14} fontWeight={700} fill={C.primary}>
          y = 5(2)
          <tspan dy={-6} fontSize={11}>
            x
          </tspan>
          <tspan dy={6}> fits all 4</tspan>
        </text>
      </g>
      <text className={cls("miss")} x={64} y={58} fontSize={12} fill={C.muted}>
        line: misses every dot
      </text>
    </Svg>
  );
}
