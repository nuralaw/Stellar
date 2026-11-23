import { C, Css, Svg } from "./kit";

// Transitions, "and" bucket: In fact pushes the same idea further (taller bar); In other words repeats it
// (same height); Moreover starts a different point (its own level).
export const alt =
  "A level line marks sentence 1. In fact gives a taller bar (stronger); In other words a bar of the same height (same idea); Moreover a bar on its own line (a different point).";

const P = "v-transitions--in-fact-";
const A = P + "a";
const n = (s: string) => P + s;

const BASE = 126; // baseline of the bars
const H1 = 36; // height of sentence 1's bar = the level line
const COLS = [
  { cx: 89, chip: "In fact,", tag: "stronger", h: 66, base: BASE, w: 58 },
  { cx: 170, chip: "In other words,", tag: "same idea", h: H1, base: BASE, w: 92 },
  { cx: 261, chip: "Moreover,", tag: "different point", h: H1, base: BASE - 14, w: 74 },
];
const BW = 30;

const T = (i: number) => 22 + i * 22;
const colCss = COLS.map((_, i) => {
  const t = T(i);
  const b = n("b" + i);
  const o = n("o" + i);
  return `.${b} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${b}; }
@keyframes ${b} { 0%, ${t}% { opacity: 0; transform: scaleY(0.05) } ${t + 3}% { opacity: 1; transform: scaleY(0.05) } ${t + 12}%, 100% { opacity: 1; transform: none } }
.${o} { animation-name: ${o}; }
@keyframes ${o} { 0%, ${t + 4}% { opacity: 0 } ${t + 12}%, 100% { opacity: 1 } }`;
}).join("\n");

const css = `
.${A} { animation: 10s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
.${n("first")} { animation-name: ${n("first")}; }
@keyframes ${n("first")} { 0%, 4% { opacity: 0 } 12%, 100% { opacity: 1 } }
.${n("ref")} { animation-name: ${n("ref")}; }
@keyframes ${n("ref")} { 0%, 10% { opacity: 0; transform: scaleY(0.05) } 20%, 100% { opacity: 1; transform: none } }
.${n("guide")} { animation-name: ${n("guide")}; stroke-dasharray: 100; stroke-dashoffset: 0; }
@keyframes ${n("guide")} { 0%, 14% { stroke-dashoffset: 100; opacity: 0 } 26%, 100% { stroke-dashoffset: 0; opacity: 1 } }
${colCss}
`;

const pale = { fill: C.fill, stroke: C.line, strokeWidth: 1.5 } as const;

export default function Visual() {
  const gy = BASE - H1;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${n("scene")}`}>
        {/* Sentence 1 */}
        <text className={`${A} ${n("first")}`} x={16} y={30} fontSize={13} fontWeight={600} fill={C.ink}>
          Many students find the exam stressful.
        </text>

        {/* Baseline and the level line of sentence 1 */}
        <path d={`M16 ${BASE} H304`} fill="none" stroke={C.line} strokeWidth={1.5} />
        <path
          className={`${A} ${n("guide")}`}
          d={`M16 ${gy} H304`}
          pathLength={100}
          fill="none"
          stroke={C.muted}
          strokeWidth={1.5}
          strokeDasharray="100"
        />
        <rect className={`${A} ${n("ref")}`} x={22} y={gy} width={BW} height={H1} rx={4} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={37} y={BASE + 20} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
          claim
        </text>

        {COLS.map((col, i) => {
          const x = col.cx - BW / 2;
          const top = col.base - col.h;
          const hot = i === 0;
          return (
            <g key={col.chip}>
              {i === 2 && <path className={`${A} ${n("o2")}`} d={`M${col.cx - 22} ${col.base} H${col.cx + 22}`} fill="none" stroke={C.line} strokeWidth={1.5} />}
              <rect
                className={`${A} ${n("b" + i)}`}
                x={x}
                y={top}
                width={BW}
                height={col.h}
                rx={4}
                fill={hot ? C.soft : C.fill}
                stroke={hot ? C.primary : C.muted}
                strokeWidth={1.5}
              />
              {hot && (
                <path
                  className={`${A} ${n("o0")}`}
                  d={`M${col.cx} ${BASE - 8} V${top + 8} M${col.cx - 6} ${top + 14} L${col.cx} ${top + 7} L${col.cx + 6} ${top + 14}`}
                  fill="none"
                  stroke={C.primary}
                  strokeWidth={2}
                />
              )}
              <g className={`${A} ${n("o" + i)}`}>
                <text x={col.cx} y={top - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={hot ? C.primaryText : C.muted} stroke="none">
                  {col.tag}
                </text>
                <rect x={col.cx - col.w / 2} y={BASE + 6} width={col.w} height={24} rx={12} {...(hot ? { fill: C.soft, stroke: C.primary, strokeWidth: 1.5 } : pale)} />
                <text x={col.cx} y={BASE + 22} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={C.ink} stroke="none">
                  {col.chip}
                </text>
              </g>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
