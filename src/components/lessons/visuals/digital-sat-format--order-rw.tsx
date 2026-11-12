import { C, Css, Svg } from "./kit";

// Question order in Reading and Writing: questions come type by type. Inside a type they get harder,
// and each new type starts easy again. (The run lengths are a sketch: the real counts vary by test.)
export const alt =
  "A Reading and Writing module: 27 bars, one per question, in short climbing runs. Each run is one question type, and every new type starts easy again.";

const P = "v-digital-sat-format--order-rw-";
const BASE = 114;
const RUNS = [5, 3, 1, 3, 4, 2, 5, 2, 2]; // 27 questions
const bars = RUNS.flatMap((n, r) => Array.from({ length: n }, (_, k) => ({ r, k }))).map((b, i) => ({ ...b, i, x: 27 + i * 10, h: 20 + b.k * 12 }));

/** Each bar grows in turn; the first bar of every type ends as the accent. */
const barCss = bars
  .map(({ i, k }) => {
    const t = 8 + i * 1.7;
    const n = P + "b" + i;
    const end = k === 0 ? C.primary : C.muted;
    return `@keyframes ${n} { 0%, ${t.toFixed(1)}% { transform: scaleY(0); fill: ${C.muted} } ${(t + 4).toFixed(1)}%, 62% { transform: scaleY(1); fill: ${C.muted} } 68%, 100% { transform: scaleY(1); fill: ${end} } }`;
  })
  .join("\n");

const css = `
.v-digital-sat-format--order-rw-a { animation: 9s ease-in-out infinite; }
.v-digital-sat-format--order-rw-scene { animation-name: v-digital-sat-format--order-rw-scene; }
@keyframes v-digital-sat-format--order-rw-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }
.v-digital-sat-format--order-rw-bar { transform-box: fill-box; transform-origin: center bottom; }
${barCss}
.v-digital-sat-format--order-rw-tag { animation-name: v-digital-sat-format--order-rw-tag; }
@keyframes v-digital-sat-format--order-rw-tag { 0%, 64% { opacity: 0; transform: translateY(4px) } 70%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--order-rw-a v-digital-sat-format--order-rw-scene">
        <text x={27} y={34} fontSize={15} fontWeight={700} fill={C.ink}>
          Reading and Writing
        </text>

        {/* One bar per question: height = difficulty */}
        <line x1={23} y1={BASE + 1} x2={298} y2={BASE + 1} stroke={C.line} strokeWidth={1.5} />
        {bars.map((b) => (
          <rect
            key={b.i}
            className="v-digital-sat-format--order-rw-a v-digital-sat-format--order-rw-bar"
            style={{ animationName: `${P}b${b.i}` }}
            x={b.x}
            y={BASE - b.h}
            width={7}
            height={b.h}
            rx={2}
            fill={b.k === 0 ? C.primary : C.muted}
          />
        ))}
        <text x={30.5} y={130} textAnchor="middle" fontSize={11} fill={C.muted}>
          1
        </text>
        <text x={290.5} y={130} textAnchor="middle" fontSize={11} fill={C.muted}>
          27
        </text>

        {/* The point */}
        <g className="v-digital-sat-format--order-rw-a v-digital-sat-format--order-rw-tag">
          <rect x={27} y={142} width={7} height={14} rx={2} fill={C.primary} />
          <text x={42} y={154} fontSize={13} fontWeight={700} fill={C.primary}>
            new type: easy again
          </text>
        </g>
      </g>
    </Svg>
  );
}
