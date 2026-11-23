import { C, Css, Svg } from "./kit";

// Cross-text connections, "Builds on": Text 2 can add to Text 1 as an explanation, a solution or an example, without arguing.
export const alt = "Text 2 builds on Text 1 without arguing: it can give a possible explanation (dredged reeds, falling perch), a solution to a problem, or an example of a rule. Ask what Text 2 does.";

const P = "v-cross-text-connections--adds-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
/** Visible between s and e (percent of the loop); hidden otherwise. With `hidden`, the still frame hides it. */
const win = (n: string, s: number, e: number, hidden = false) => `.${P}${n} { ${hidden ? "opacity: 0; " : ""}animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${s}% { opacity: 0 } ${s + 3}%, ${e}% { opacity: 1 } ${e + 3}%, 100% { opacity: 0 } }`;

const css = `
.v-cross-text-connections--adds-a { animation: 12s ease-in-out infinite; }
.v-cross-text-connections--adds-scene { animation-name: v-cross-text-connections--adds-scene; }
@keyframes v-cross-text-connections--adds-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("cards", 2)}
${win("t1a", 6, 44)}
${win("t2a", 15, 44)}
${win("lab1", 30, 44)}
.v-cross-text-connections--adds-arrow { stroke-dasharray: 100; animation-name: v-cross-text-connections--adds-arrow; }
@keyframes v-cross-text-connections--adds-arrow { 0%, 22% { stroke-dashoffset: 100 } 29%, 100% { stroke-dashoffset: 0 } }
.v-cross-text-connections--adds-head { animation-name: v-cross-text-connections--adds-head; }
@keyframes v-cross-text-connections--adds-head { 0%, 27% { opacity: 0 } 31%, 100% { opacity: 1 } }
${win("t1b", 47, 61, true)}
${win("t2b", 47, 61, true)}
${win("lab2", 51, 61, true)}
${win("t1c", 65, 88, true)}
${win("t2c", 65, 88, true)}
${win("lab3", 69, 88, true)}
${show("cap", 40)}
`;

const T = { fontSize: 12, fontWeight: 600, fill: C.ink } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-scene">
        {/* The two cards */}
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-cards">
          <rect x={16} y={24} width={288} height={40} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <rect x={26} y={17} width={46} height={14} rx={7} fill={C.muted} />
          <text x={49} y={27.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>Text 1</text>
          <rect x={16} y={106} width={288} height={40} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <rect x={26} y={99} width={46} height={14} rx={7} fill={C.muted} />
          <text x={49} y={109.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>Text 2</text>
        </g>

        {/* Phase 1: explanation */}
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-t1a">
          <text {...T}>
            <tspan x={28} y={42}>Perch in Lake Verda have</tspan>
            <tspan x={28} y={56}>declined for ten years.</tspan>
          </text>
          <path d="M262 36 L273 43 L279 40 L289 51 M281 51 H289 V43" fill="none" stroke={C.ink} strokeWidth={2} />
        </g>
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-t2a">
          <text {...T}>
            <tspan x={28} y={124}>The lake’s reeds were dredged;</tspan>
            <tspan x={28} y={138}>perch lay eggs in reeds.</tspan>
          </text>
        </g>
        <text className="v-cross-text-connections--adds-a v-cross-text-connections--adds-lab1" x={106} y={91} fontSize={12} fontWeight={700}>
          <tspan fill={C.muted}>because: </tspan>
          <tspan fill={C.primaryText}>possible explanation</tspan>
        </text>

        {/* Phase 2: solution */}
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-t1b">
          <text x={28} y={49} {...T} fontSize={13}>a problem</text>
        </g>
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-t2b">
          <text x={28} y={131} {...T} fontSize={13}>a fix</text>
        </g>
        <text className="v-cross-text-connections--adds-a v-cross-text-connections--adds-lab2" x={106} y={91} fontSize={13} fontWeight={700} fill={C.primaryText}>
          solution
        </text>

        {/* Phase 3: example */}
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-t1c">
          <text x={28} y={49} {...T} fontSize={13}>a general rule</text>
        </g>
        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-t2c">
          <text x={28} y={131} {...T} fontSize={13}>one case</text>
        </g>
        <text className="v-cross-text-connections--adds-a v-cross-text-connections--adds-lab3" x={106} y={91} fontSize={13} fontWeight={700} fill={C.primaryText}>
          example
        </text>

        {/* Text 2 builds on Text 1 */}
        <path className="v-cross-text-connections--adds-a v-cross-text-connections--adds-arrow" d="M90 102 V72" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <path className="v-cross-text-connections--adds-a v-cross-text-connections--adds-head" d="M83 79 L90 70 L97 79" fill="none" stroke={C.primary} strokeWidth={2.5} />

        <g className="v-cross-text-connections--adds-a v-cross-text-connections--adds-cap">
          <text x={160} y={168} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            Ask: what does Text 2 DO with Text 1’s idea?
          </text>
        </g>
      </g>
    </Svg>
  );
}
