import { C, Css, Svg } from "./kit";

// Inferences, "Match the strength": the stronger the evidence, the stronger the verb. Three kinds of evidence land on three verbs.
export const alt = "Three kinds of evidence point to three verbs on a scale from weaker to stronger: one small study points to may, a fair test on 12 islands to likely, and a fact that rules it out to is or is not.";

const P = "v-inferences--strength-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
/** A tick dot turns to the accent at t%. */
const light = (n: string, t: number) => `.${P}${n} { fill: ${C.primary}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.fill} } ${t + 5}%, 100% { fill: ${C.primary} } }`;
const word = (n: string, t: number) => `.${P}${n} { fill: ${C.primary}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.ink} } ${t + 5}%, 100% { fill: ${C.primary} } }`;

const css = `
.v-inferences--strength-a { animation: 9s ease-in-out infinite; }
.v-inferences--strength-scene { animation-name: v-inferences--strength-scene; }
@keyframes v-inferences--strength-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("c1", 8)}
${show("c2", 32)}
${show("c3", 56)}
${light("d1", 18)}
${light("d2", 42)}
${light("d3", 66)}
${word("w1", 18)}
${word("w2", 42)}
${word("w3", 66)}
`;

const XS = [64, 160, 256];

function Card({ cx, cls, l1, l2 }: { cx: number; cls: string; l1: string; l2: string }) {
  return (
    <g className={`v-inferences--strength-a ${cls}`}>
      <rect x={cx - 46} y={14} width={92} height={44} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={cx} y={33} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
        {l1}
      </text>
      <text x={cx} y={48} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
        {l2}
      </text>
      <path d={`M${cx} 62 V98 M${cx - 5} 92 L${cx} 99 L${cx + 5} 92`} fill="none" stroke={C.primary} strokeWidth={2} />
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-inferences--strength-a v-inferences--strength-scene`}>
        <Card cx={XS[0]} cls={`v-inferences--strength-c1`} l1="1 small" l2="study" />
        <Card cx={XS[1]} cls={`v-inferences--strength-c2`} l1="fair test," l2="12 islands" />
        <Card cx={XS[2]} cls={`v-inferences--strength-c3`} l1="a fact rules" l2="it out" />

        <path d="M24 112 H296" stroke={C.muted} strokeWidth={2} fill="none" />
        {XS.map((x, i) => (
          <circle key={x} className={`v-inferences--strength-a v-inferences--strength-d${i + 1}`} cx={x} cy={112} r={6} stroke={C.primary} strokeWidth={2} />
        ))}
        <text className={`v-inferences--strength-a v-inferences--strength-w1`} x={XS[0]} y={138} textAnchor="middle" fontSize={15} fontWeight={700}>
          may
        </text>
        <text className={`v-inferences--strength-a v-inferences--strength-w2`} x={XS[1]} y={138} textAnchor="middle" fontSize={15} fontWeight={700}>
          likely
        </text>
        <text className={`v-inferences--strength-a v-inferences--strength-w3`} x={XS[2]} y={138} textAnchor="middle" fontSize={15} fontWeight={700}>
          is / is not
        </text>

        <text x={24} y={162} fontSize={11} fill={C.muted}>
          weaker evidence
        </text>
        <path d="M118 158 H202 M196 154 L203 158 L196 162" stroke={C.muted} strokeWidth={1.5} fill="none" />
        <text x={296} y={162} textAnchor="end" fontSize={11} fill={C.muted}>
          stronger evidence
        </text>
      </g>
    </Svg>
  );
}
