import { C, Css, Svg } from "./kit";

// Read a graph: the same 11 values (1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9) as a dot plot and a box plot. Median 5, range 9 − 1 = 8.
export const alt = "A dot plot of 11 values and, below it on the same scale, their box plot: minimum 1, Q1 2, median 5, Q3 7, maximum 9. The range is 9 − 1 = 8.";

const P = "v-one-var-data--read-plots-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("dots", 2)}
.${n("med")} { fill: ${C.primary}; animation-name: ${n("med")}; }
@keyframes ${n("med")} { 0%, 14% { fill: ${C.ink}; opacity: 1 } 20%, 92% { fill: ${C.primary}; opacity: 1 } 97%, 100% { fill: ${C.ink}; opacity: 0 } }
${draw("wh", 28, 12)}
${at("box", 38)}
${at("mline", 46)}
${at("mtxt", 50)}
${draw("rng", 66, 12)}
${at("rtxt", 72)}
`;

const px = (v: number) => 30 + 26 * v;
// value → how many dots
const COUNTS: [number, number][] = [[1, 1], [2, 2], [3, 1], [4, 1], [5, 2], [6, 1], [7, 1], [8, 1], [9, 1]];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Shared scale */}
      <g stroke={C.line} strokeWidth={1}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <line key={v} x1={px(v)} y1={56} x2={px(v)} y2={148} />
        ))}
      </g>
      <path d="M30 148 H290" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
          <text key={v} x={px(v)} y={163}>
            {v}
          </text>
        ))}
      </g>

      {/* Dot plot */}
      <g className={cls("dots")} fill={C.ink}>
        {COUNTS.flatMap(([v, c]) =>
          Array.from({ length: c }, (_, k) => {
            const hot = v === 5;
            return <circle key={`${v}-${k}`} className={hot ? cls("med") : undefined} cx={px(v)} cy={80 - 11 * k} r={4.5} />;
          }),
        )}
      </g>

      {/* Box plot: min 1, Q1 2, median 5, Q3 7, max 9 */}
      <g className={cls("wh")} fill="none" stroke={C.ink} strokeWidth={2}>
        <line x1={px(1)} y1={121} x2={px(9)} y2={121} pathLength={100} />
      </g>
      <g stroke={C.ink} strokeWidth={2} className={cls("box")}>
        <line x1={px(1)} y1={113} x2={px(1)} y2={129} />
        <line x1={px(9)} y1={113} x2={px(9)} y2={129} />
        <rect x={px(2)} y={107} width={px(7) - px(2)} height={28} fill={C.soft} />
      </g>
      <line className={cls("mline")} x1={px(5)} y1={107} x2={px(5)} y2={135} stroke={C.primary} strokeWidth={3.5} />
      <text className={cls("mtxt")} x={px(5)} y={101} fontSize={12} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        median 5
      </text>

      {/* Range */}
      <path className={cls("rng")} d={`M${px(1)} 48 H${px(9)} M${px(1)} 43 V53 M${px(9)} 43 V53`} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
      <text className={cls("rtxt")} x={160} y={37} fontSize={14} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        range = 9 − 1 = 8
      </text>
    </Svg>
  );
}
