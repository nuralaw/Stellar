import { C, Css, Svg } from "./kit";

// Cross-text connections, "Match the strength": the answer must be as strong as Text 2's wording. Doubt is not disproof.
export const alt = "Text 2 says 12 people are too few to show anything. On a scale from weak to strong, that matches needs more testing or premature, not the strong claim that the tea does not work.";

const P = "v-cross-text-connections--strength-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const drop = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(-12px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const fade = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 } }`;
const lit = (n: string, t: number, to: { stroke: string; fill: string }) => `.${P}${n} { stroke: ${to.stroke}; fill: ${to.fill}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke: ${C.muted}; fill: ${C.fill} } ${t + 6}%, 100% { stroke: ${to.stroke}; fill: ${to.fill} } }`;

const GOOD = { stroke: C.good, fill: C.goodSoft };
const BAD = { stroke: C.bad, fill: C.badSoft };

const css = `
.v-cross-text-connections--strength-a { animation: 11s ease-in-out infinite; }
.v-cross-text-connections--strength-scene { animation-name: v-cross-text-connections--strength-scene; }
@keyframes v-cross-text-connections--strength-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("quote", 4)}
${fade("hl", 12)}
.v-cross-text-connections--strength-few { fill: ${C.primaryText}; animation-name: v-cross-text-connections--strength-few; }
@keyframes v-cross-text-connections--strength-few { 0%, 12% { fill: ${C.ink} } 18%, 100% { fill: ${C.primaryText} } }
${show("scale", 20)}
${show("rowa", 24)}
${show("rowb", 28)}
${drop("p1", 38)}
.v-cross-text-connections--strength-seg { stroke-dasharray: 100; animation-name: v-cross-text-connections--strength-seg; }
@keyframes v-cross-text-connections--strength-seg { 0%, 46% { stroke-dashoffset: 100 } 54%, 100% { stroke-dashoffset: 0 } }
.v-cross-text-connections--strength-c3 { fill: ${C.fill}; stroke: ${C.muted}; }
${lit("c1", 48, GOOD)}
${lit("c2", 48, GOOD)}
${lit("d1", 48, GOOD)}
${lit("d2", 48, GOOD)}
${drop("p2", 60)}
${lit("c4", 68, BAD)}
${lit("d4", 68, BAD)}
${fade("tag", 70)}
${show("cap", 78)}
`;

const chip = (cls: string, x: number, y: number, w: number, label: string) => (
  <g key={label}>
    <rect className={cls} x={x} y={y} width={w} height={16} rx={8} strokeWidth={1.5} />
    <text x={x + w / 2} y={y + 11.5} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>{label}</text>
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-scene">
        {/* Text 2's wording */}
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-quote">
          <rect x={16} y={12} width={288} height={26} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <rect className="v-cross-text-connections--strength-a v-cross-text-connections--strength-hl" x={106} y={17} width={44} height={16} rx={5} fill={C.soft} stroke={C.primary} strokeWidth={1} />
          <text x={28} y={29} fontSize={12} fontWeight={600} fill={C.ink}>
            12 people are <tspan fontWeight={700} className="v-cross-text-connections--strength-a v-cross-text-connections--strength-few">too few</tspan> to show anything.
          </text>
        </g>

        {/* The strength scale */}
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-scale">
          <path d="M48 76 H272" stroke={C.line} strokeWidth={4} />
          <text x={14} y={80} fontSize={11} fontWeight={700} fill={C.muted}>weak</text>
          <text x={306} y={80} textAnchor="end" fontSize={11} fontWeight={700} fill={C.muted}>strong</text>
          <path d="M66 76 V90 M196 76 V90 M136 76 V116 M258 76 V116" stroke={C.muted} strokeWidth={1} />
        </g>
        <path className="v-cross-text-connections--strength-a v-cross-text-connections--strength-seg" d="M66 76 H136" pathLength={100} stroke={C.good} strokeWidth={5} fill="none" />
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-scale">
          <circle className="v-cross-text-connections--strength-a v-cross-text-connections--strength-d1" cx={66} cy={76} r={5} strokeWidth={1.5} />
          <circle className="v-cross-text-connections--strength-a v-cross-text-connections--strength-d2" cx={136} cy={76} r={5} strokeWidth={1.5} />
          <circle cx={196} cy={76} r={5} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <circle className="v-cross-text-connections--strength-a v-cross-text-connections--strength-d4" cx={258} cy={76} r={5} strokeWidth={1.5} />
        </g>

        {/* The four markers, in two rows */}
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-rowa">
          {chip("v-cross-text-connections--strength-a v-cross-text-connections--strength-c1", 14, 90, 112, "needs more testing")}
          {chip("v-cross-text-connections--strength-a v-cross-text-connections--strength-c3", 168, 90, 84, "not supported")}
        </g>
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-rowb">
          {chip("v-cross-text-connections--strength-a v-cross-text-connections--strength-c2", 98, 116, 76, "premature")}
          {chip("v-cross-text-connections--strength-a v-cross-text-connections--strength-c4", 238, 116, 48, "false")}
        </g>

        {/* Pointer 1: lands on the match */}
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-p1">
          <path d="M92 54 H110 L101 68 Z" fill={C.good} stroke={C.good} strokeWidth={1.5} />
        </g>

        {/* Pointer 2: the too-strong choice */}
        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-p2">
          <rect x={160} y={44} width={144} height={16} rx={8} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text x={232} y={55.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>the tea does not work</text>
          <path d="M251 61 H265 L258 70 Z" fill={C.bad} stroke={C.bad} strokeWidth={1.5} />
        </g>
        <text className="v-cross-text-connections--strength-a v-cross-text-connections--strength-tag" x={290} y={145} textAnchor="end" fontSize={11} fontWeight={700} fill={C.bad}>
          too strong
        </text>

        <g className="v-cross-text-connections--strength-a v-cross-text-connections--strength-cap">
          <text x={160} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>Doubt is not disproof.</text>
        </g>
      </g>
    </Svg>
  );
}
