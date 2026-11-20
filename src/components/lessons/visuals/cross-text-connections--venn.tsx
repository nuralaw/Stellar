import { C, Css, Svg } from "./kit";

// Cross-text connections, "Find the overlap": each author's points are a circle; the agreement is only the overlap.
export const alt = "Two overlapping circles. Lee: bans cars. Novak: no ban. The overlap, walkers at risk, is the one point both authors state, and it is the answer.";

const P = "v-cross-text-connections--venn-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;

const css = `
.v-cross-text-connections--venn-a { animation: 10s ease-in-out infinite; }
.v-cross-text-connections--venn-scene { animation-name: v-cross-text-connections--venn-scene; }
@keyframes v-cross-text-connections--venn-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("left", 6)}
${show("right", 20)}
${show("cap", 62)}
.v-cross-text-connections--venn-lens { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-cross-text-connections--venn-lens; }
@keyframes v-cross-text-connections--venn-lens { 0%, 40% { fill: ${C.fill}; stroke: ${C.line} } 50%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-cross-text-connections--venn-lt { fill: ${C.ink}; animation-name: v-cross-text-connections--venn-lt; }
@keyframes v-cross-text-connections--venn-lt { 0%, 40% { opacity: 0 } 50%, 100% { opacity: 1 } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-scene`}>
        <g className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-left`}>
          <circle cx={126} cy={80} r={60} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text x={98} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            Lee
          </text>
          <text x={98} y={86} textAnchor="middle" fontSize={11} fill={C.muted}>
            bans cars
          </text>
        </g>
        <g className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-right`}>
          <circle cx={194} cy={80} r={60} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text x={222} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            Novak
          </text>
          <text x={222} y={86} textAnchor="middle" fontSize={11} fill={C.muted}>
            no ban
          </text>
        </g>

        {/* The overlap: the one point on both lists */}
        <g className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-right`}>
        <path className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-lens`} d="M160 30.6 A60 60 0 0 1 160 129.4 A60 60 0 0 1 160 30.6 Z" strokeWidth={2} />
        <g className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-lt`}>
          <text x={160} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            walkers
          </text>
          <text x={160} y={91} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            at risk
          </text>
        </g>

        </g>

        <g className={`v-cross-text-connections--venn-a v-cross-text-connections--venn-cap`}>
          <text x={160} y={162} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            agreement = only the overlap
          </text>
        </g>
      </g>
    </Svg>
  );
}
