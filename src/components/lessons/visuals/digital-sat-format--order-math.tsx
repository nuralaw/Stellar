import { C, Css, Svg } from "./kit";

// Question order in Math: across a module of 22 questions, difficulty climbs from easiest to hardest.
export const alt = "A Math module: 22 bars, one per question, rising steadily from easy at question 1 to hard at question 22. The hardest come last.";

const P = "v-digital-sat-format--order-math-";
const N = 22;
const BASE = 126;
const bars = Array.from({ length: N }, (_, i) => ({ i, x: 30 + i * 12, h: 12 + i * 4 }));

/** Each bar grows in turn; the last five end as the accent. */
const barCss = bars
  .map(({ i }) => {
    const t = 8 + i * 2;
    const hard = i >= N - 5;
    const n = P + "b" + i;
    return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { transform: scaleY(0); fill: ${C.muted} } ${t + 4}%, 60% { transform: scaleY(1); fill: ${C.muted} } 66%, 100% { transform: scaleY(1); fill: ${hard ? C.primary : C.muted} } }`;
  })
  .join("\n");

const css = `
.v-digital-sat-format--order-math-a { animation: 9s ease-in-out infinite; }
.v-digital-sat-format--order-math-scene { animation-name: v-digital-sat-format--order-math-scene; }
@keyframes v-digital-sat-format--order-math-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }
.v-digital-sat-format--order-math-bar { transform-box: fill-box; transform-origin: center bottom; }
${barCss}
.v-digital-sat-format--order-math-arrow { stroke-dasharray: 100; animation-name: v-digital-sat-format--order-math-arrow; }
@keyframes v-digital-sat-format--order-math-arrow { 0%, 10% { stroke-dashoffset: 100 } 54%, 100% { stroke-dashoffset: 0 } }
.v-digital-sat-format--order-math-hard { animation-name: v-digital-sat-format--order-math-hard; }
@keyframes v-digital-sat-format--order-math-hard { 0%, 52% { opacity: 0 } 58%, 100% { opacity: 1 } }
.v-digital-sat-format--order-math-tag { animation-name: v-digital-sat-format--order-math-tag; }
@keyframes v-digital-sat-format--order-math-tag { 0%, 62% { opacity: 0; transform: translateY(4px) } 68%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--order-math-a v-digital-sat-format--order-math-scene">
        <text x={30} y={36} fontSize={15} fontWeight={700} fill={C.ink}>
          Math
        </text>
        <text className="v-digital-sat-format--order-math-a v-digital-sat-format--order-math-tag" x={30} y={54} fontSize={12} fontWeight={600} fill={C.primaryText}>
          hardest last
        </text>

        {/* One bar per question: height = difficulty */}
        <line x1={26} y1={BASE + 1} x2={294} y2={BASE + 1} stroke={C.line} strokeWidth={1.5} />
        {bars.map((b) => (
          <rect
            key={b.i}
            className="v-digital-sat-format--order-math-a v-digital-sat-format--order-math-bar"
            style={{ animationName: `${P}b${b.i}` }}
            x={b.x}
            y={BASE - b.h}
            width={8}
            height={b.h}
            rx={2}
            fill={b.i >= N - 5 ? C.primary : C.muted}
          />
        ))}
        <text x={34} y={142} textAnchor="middle" fontSize={11} fill={C.muted}>
          1
        </text>
        <text x={286} y={142} textAnchor="middle" fontSize={11} fill={C.muted}>
          22
        </text>

        {/* easy → hard */}
        <text x={30} y={162} fontSize={12} fontWeight={600} fill={C.ink}>
          easy
        </text>
        <path className="v-digital-sat-format--order-math-a v-digital-sat-format--order-math-arrow" d="M64 158 H252" pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g className="v-digital-sat-format--order-math-a v-digital-sat-format--order-math-hard">
          <path d="M247 153.5 L253 158 L247 162.5" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text x={290} y={162} textAnchor="end" fontSize={12} fontWeight={600} fill={C.ink}>
            hard
          </text>
        </g>
      </g>
    </Svg>
  );
}
