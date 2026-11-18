import { C, Css, Svg } from "./kit";

// Text structure and purpose, "Map the order": the text's jobs in order, checked against each part of each choice.
export const alt = "The text has two jobs in order: a belief, then the opposite. Choice A (belief, then opposite) matches both parts in order. Choice B (describes a house, explains why empty) fails both.";

const P = "v-text-structure-purpose--structure-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const ok = (n: string, t: number) => `.${P}${n} { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }`;
const no = (n: string, t: number) => `.${P}${n} { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }`;
const lit = (n: string, t: number) => `.${P}${n} { fill: ${C.soft}; stroke: ${C.primary}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { fill: ${C.fill}; stroke: ${C.line} } ${t + 5}%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }`;
const mark = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 100% { opacity: 1 } }`;

const css = `
.v-text-structure-purpose--structure-a { animation: 10s ease-in-out infinite; }
.v-text-structure-purpose--structure-scene { animation-name: v-text-structure-purpose--structure-scene; }
@keyframes v-text-structure-purpose--structure-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("jobs", 4)}
${lit("j1", 12)}
${lit("j2", 30)}
${ok("a1", 20)}
${ok("a2", 38)}
${mark("ca1", 20)}
${mark("ca2", 38)}
${show("rowB", 50)}
${no("b1", 60)}
${mark("cb1", 60)}
.v-text-structure-purpose--structure-dim { opacity: 0.6; animation-name: v-text-structure-purpose--structure-dim; }
@keyframes v-text-structure-purpose--structure-dim { 0%, 68% { opacity: 1 } 76%, 100% { opacity: 0.6 } }
`;

function Seg({ x, y, w, text, cls, check, cross, ccls }: { x: number; y: number; w: number; text: string; cls: string; check?: boolean; cross?: boolean; ccls?: string }) {
  return (
    <>
      <rect className={`v-text-structure-purpose--structure-a ${cls}`} x={x} y={y} width={w} height={26} rx={8} strokeWidth={1.5} />
      <text x={x + 8} y={y + 17} fontSize={11} fontWeight={600} fill={C.ink}>
        {text}
      </text>
      {check && <path className={`v-text-structure-purpose--structure-a ${ccls}`} d={`M${x + w - 18} ${y + 13} l4 4 l8 -8`} fill="none" stroke={C.good} strokeWidth={2} />}
      {cross && <path className={`v-text-structure-purpose--structure-a ${ccls}`} d={`M${x + w - 18} ${y + 9} l8 8 m0 -8 l-8 8`} fill="none" stroke={C.bad} strokeWidth={2} />}
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-text-structure-purpose--structure-a v-text-structure-purpose--structure-scene`}>
        {/* The text's jobs in order */}
        <g className={`v-text-structure-purpose--structure-a v-text-structure-purpose--structure-jobs`}>
          <text x={16} y={18} fontSize={11} fontWeight={600} fill={C.muted}>
            the text, in order
          </text>
          <rect className={`v-text-structure-purpose--structure-a v-text-structure-purpose--structure-j1`} x={16} y={24} width={130} height={26} rx={13} strokeWidth={1.5} />
          <text x={81} y={41} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            1  a belief
          </text>
          <path d="M150 37 H166 M161 33 L167 37 L161 41" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <rect className={`v-text-structure-purpose--structure-a v-text-structure-purpose--structure-j2`} x={170} y={24} width={134} height={26} rx={13} strokeWidth={1.5} />
          <text x={237} y={41} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            2  the opposite
          </text>
        </g>

        {/* Choice A: both parts match, in order */}
        <g>
          <text x={16} y={85} fontSize={12} fontWeight={700} fill={C.ink}>
            A
          </text>
          <Seg x={32} y={70} w={112} text="states a belief" cls={`v-text-structure-purpose--structure-a1`} check ccls={`v-text-structure-purpose--structure-ca1`} />
          <path d="M148 83 H158 M154 79 L159 83 L154 87" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <Seg x={162} y={70} w={124} text="then the opposite" cls={`v-text-structure-purpose--structure-a2`} check ccls={`v-text-structure-purpose--structure-ca2`} />
        </g>

        {/* Choice B: the parts are not in the text */}
        <g className={`v-text-structure-purpose--structure-a v-text-structure-purpose--structure-rowB`}>
          <g className={`v-text-structure-purpose--structure-a v-text-structure-purpose--structure-dim`}>
            <text x={16} y={129} fontSize={12} fontWeight={700} fill={C.ink}>
              B
            </text>
            <Seg x={30} y={114} w={126} text="describes a house" cls={`v-text-structure-purpose--structure-b1`} cross ccls={`v-text-structure-purpose--structure-cb1`} />
            <path d="M158 127 H164 M160 123 L165 127 L160 131" fill="none" stroke={C.muted} strokeWidth={1.5} />
            <Seg x={168} y={114} w={136} text="explains why empty" cls={`v-text-structure-purpose--structure-b1`} cross ccls={`v-text-structure-purpose--structure-cb1`} />
          </g>
        </g>

        <text x={160} y={164} textAnchor="middle" fontSize={11} fill={C.muted}>
          every part must match, in order
        </text>
      </g>
    </Svg>
  );
}
