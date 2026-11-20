import { C, Css, Svg } from "./kit";

// Command of Evidence (quantitative): a choice must be true in the data AND about the claim.
export const alt =
  "A bar chart: coffee 65, tea 40, juice 20. Claim: coffee sold the most. A true fact about tea is rejected; the coffee fact is true and on target.";


const css = `
.v-command-of-evidence-quantitative-a { animation: 9s ease-in-out infinite; }

.v-command-of-evidence-quantitative-scene { animation-name: v-command-of-evidence-quantitative-scene; }
@keyframes v-command-of-evidence-quantitative-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Bars grow from the baseline */
.v-command-of-evidence-quantitative-bar { transform-box: fill-box; transform-origin: 50% 100%; animation-name: v-command-of-evidence-quantitative-bar; }
@keyframes v-command-of-evidence-quantitative-bar { 0%, 5% { transform: scaleY(0) } 18%, 100% { transform: scaleY(1) } }
.v-command-of-evidence-quantitative-val { animation-name: v-command-of-evidence-quantitative-val; }
@keyframes v-command-of-evidence-quantitative-val { 0%, 16% { opacity: 0 } 21%, 100% { opacity: 1 } }

/* The claim's key word */
.v-command-of-evidence-quantitative-key { fill: ${C.primaryText}; animation-name: v-command-of-evidence-quantitative-key; }
@keyframes v-command-of-evidence-quantitative-key { 0%, 22% { fill: ${C.ink} } 27%, 100% { fill: ${C.primaryText} } }

/* Choice 1: true, but about tea. Tea and juice bars light up, then it is rejected. */
.v-command-of-evidence-quantitative-c1 { animation-name: v-command-of-evidence-quantitative-c1; }
@keyframes v-command-of-evidence-quantitative-c1 {
  0%, 28% { opacity: 0; transform: translate(8px, 0) }
  33%, 43% { opacity: 1; transform: translate(0, 0) }
  45% { transform: translate(-4px, 0) }
  47% { transform: translate(4px, 0) }
  49% { transform: translate(-3px, 0) }
  51%, 100% { opacity: 1; transform: translate(0, 0) }
}
.v-command-of-evidence-quantitative-c1box { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-command-of-evidence-quantitative-c1box; }
@keyframes v-command-of-evidence-quantitative-c1box { 0%, 43% { fill: ${C.fill}; stroke: ${C.line} } 47%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
.v-command-of-evidence-quantitative-t1 { animation-name: v-command-of-evidence-quantitative-t1; }
@keyframes v-command-of-evidence-quantitative-t1 { 0%, 47% { opacity: 0 } 52%, 100% { opacity: 1 } }
.v-command-of-evidence-quantitative-other { opacity: 0; animation-name: v-command-of-evidence-quantitative-other; }
@keyframes v-command-of-evidence-quantitative-other { 0%, 33% { opacity: 0 } 37%, 47% { opacity: 1 } 52%, 100% { opacity: 0 } }

/* Choice 2: true and about coffee. The coffee bar lights up, the choice locks in. */
.v-command-of-evidence-quantitative-c2 { animation-name: v-command-of-evidence-quantitative-c2; }
@keyframes v-command-of-evidence-quantitative-c2 { 0%, 56% { opacity: 0; transform: translate(8px, 0) } 61%, 100% { opacity: 1; transform: translate(0, 0) } }
.v-command-of-evidence-quantitative-c2box { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-command-of-evidence-quantitative-c2box; }
@keyframes v-command-of-evidence-quantitative-c2box { 0%, 68% { fill: ${C.fill}; stroke: ${C.line} } 72%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-command-of-evidence-quantitative-t2 { animation-name: v-command-of-evidence-quantitative-t2; }
@keyframes v-command-of-evidence-quantitative-t2 { 0%, 70% { opacity: 0 } 75%, 100% { opacity: 1 } }
.v-command-of-evidence-quantitative-top { animation-name: v-command-of-evidence-quantitative-top; }
@keyframes v-command-of-evidence-quantitative-top { 0%, 61% { opacity: 0 } 66%, 100% { opacity: 1 } }
`;

const BASE = 148;
const K = 1.3; // units of height per cup
const bars = [
  { x: 24, v: 65, name: "Coffee" },
  { x: 62, v: 40, name: "Tea" },
  { x: 100, v: 20, name: "Juice" },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-scene">
        {/* The claim */}
        <text x={24} y={34} fontSize={15} fontWeight={600} fill={C.ink}>
          <tspan fill={C.muted} fontWeight={500}>
            Claim:{" "}
          </tspan>
          <tspan className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-key">coffee</tspan> sold the most.
        </text>

        {/* The data */}
        <line x1={20} y1={BASE} x2={132} y2={BASE} stroke={C.muted} strokeWidth={1.5} />
        {bars.map((b, i) => (
          <g key={b.name}>
            <g className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-bar">
              <rect x={b.x} y={BASE - b.v * K} width={28} height={b.v * K} rx={3} fill={C.muted} opacity={0.35} />
              <rect
                className={i === 0 ? "v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-top" : "v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-other"}
                x={b.x}
                y={BASE - b.v * K}
                width={28}
                height={b.v * K}
                rx={3}
                fill={i === 0 ? C.primary : C.muted}
              />
            </g>
            <text className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-val" x={b.x + 14} y={BASE - b.v * K - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
              {b.v}
            </text>
            <text x={b.x + 14} y={BASE + 15} textAnchor="middle" fontSize={11} fill={C.muted}>
              {b.name}
            </text>
          </g>
        ))}

        {/* Choice 1 */}
        <g className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-c1">
          <rect className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-c1box" x={152} y={58} width={152} height={26} rx={13} strokeWidth={1.5} />
          <text x={228} y={75.5} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.ink}>
            Tea: 40, twice juice
          </text>
          <text className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-t1" x={228} y={99} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.bad}>
            true, but not about coffee
          </text>
        </g>

        {/* Choice 2 */}
        <g className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-c2">
          <rect className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-c2box" x={152} y={112} width={152} height={26} rx={13} strokeWidth={1.5} />
          <text x={228} y={129.5} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.ink}>
            Coffee: 65, the highest
          </text>
          <text className="v-command-of-evidence-quantitative-a v-command-of-evidence-quantitative-t2" x={228} y={153} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.good}>
            true + proves the claim
          </text>
        </g>
      </g>
    </Svg>
  );
}
