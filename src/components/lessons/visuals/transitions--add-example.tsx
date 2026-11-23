import { C, Css, Svg } from "./kit";

// Transitions, "and" bucket: the second sentence can sit next to the first (Moreover), inside it (For example)
// or zoom in on one spot of it (Specifically).
export const alt =
  "After \"The library offers free help.\", three second sentences relate to it by position: Moreover is a new block beside it, For example is one case inside it, Specifically is a zoomed-in detail.";

const P = "v-transitions--add-example-";
const A = P + "a";
const n = (s: string) => P + s;

const COLS = [
  { x: 16, chip: "Moreover,", tag: "new point" },
  { x: 115, chip: "For example,", tag: "one case" },
  { x: 214, chip: "Specifically,", tag: "exact detail" },
];

// Beat i starts at T(i) percent of the loop.
const T = (i: number) => 14 + i * 22;

const colCss = COLS.map((_, i) => {
  const t = T(i);
  const nc = P + "c" + i;
  const h = P + "h" + i;
  const b = P + "b" + i;
  return `.${nc} { animation-name: ${nc}; }
@keyframes ${nc} { 0%, ${t}% { opacity: 0; transform: translateY(8px) } ${t + 6}%, 100% { opacity: 1; transform: none } }
.${h} { opacity: 0; animation-name: ${h}; }
@keyframes ${h} { 0%, ${t + 4}% { opacity: 0 } ${t + 9}%, ${t + 17}% { opacity: 1 } ${t + 22}%, 100% { opacity: 0 } }
.${b} { transform-box: fill-box; transform-origin: left center; animation-name: ${b}; }
@keyframes ${b} { 0%, ${t + 3}% { opacity: 0; transform: scale(0.4, 1) } ${t + 10}%, 100% { opacity: 1; transform: none } }`;
}).join("\n");

const css = `
.${A} { animation: 9s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
.${n("first")} { animation-name: ${n("first")}; }
@keyframes ${n("first")} { 0%, 4% { opacity: 0; transform: translateY(-6px) } 11%, 100% { opacity: 1; transform: none } }
${colCss}
`;

const soft = { fill: C.soft, stroke: C.primary, strokeWidth: 1.5 } as const;
const pale = { fill: C.fill, stroke: C.line, strokeWidth: 1.5 } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${n("scene")}`}>
        {/* Sentence 1 */}
        <g className={`${A} ${n("first")}`}>
          <rect x={16} y={16} width={288} height={30} rx={8} {...pale} />
          <text x={160} y={36} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
            The library offers free help.
          </text>
        </g>

        {COLS.map((col, i) => {
          const x0 = col.x;
          const cx = x0 + 45;
          return (
            <g key={col.chip} className={`${A} ${n("c" + i)}`}>
              {/* Connector chip with a moving highlight */}
              <rect x={x0 + 2} y={62} width={86} height={24} rx={12} {...pale} />
              <rect className={`${A} ${n("h" + i)}`} x={x0 + 2} y={62} width={86} height={24} rx={12} fill="none" stroke={C.primary} strokeWidth={2.5} />
              <text x={cx} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
                {col.chip}
              </text>

              {/* The relation, by position */}
              {i === 0 && (
                <>
                  <rect x={x0 + 4} y={102} width={38} height={24} rx={5} {...pale} />
                  <rect className={`${A} ${n("b0")}`} x={x0 + 48} y={102} width={38} height={24} rx={5} {...soft} />
                </>
              )}
              {i === 1 && (
                <>
                  <rect x={x0 + 4} y={98} width={82} height={34} rx={6} {...pale} />
                  <rect className={`${A} ${n("b1")}`} x={x0 + 46} y={104} width={30} height={22} rx={4} {...soft} />
                </>
              )}
              {i === 2 && (
                <>
                  <rect x={x0 + 4} y={96} width={82} height={14} rx={5} {...pale} />
                  <circle cx={x0 + 68} cy={103} r={6} fill="none" stroke={C.primary} strokeWidth={2} />
                  <path d={`M${x0 + 63} 107 L${x0 + 24} 122 M${x0 + 73} 107 L${x0 + 86} 122`} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
                  <g className={`${A} ${n("b2")}`}>
                    <rect x={x0 + 18} y={122} width={68} height={20} rx={5} {...soft} />
                    <path d={`M${x0 + 26} 129 H${x0 + 78} M${x0 + 26} 135 H${x0 + 62}`} fill="none" stroke={C.primary} strokeWidth={1.5} />
                  </g>
                </>
              )}

              <text x={cx} y={160} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} stroke="none">
                {col.tag}
              </text>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
