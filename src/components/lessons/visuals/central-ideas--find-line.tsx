import { C, Css, Svg } from "./kit";

// Central ideas, "Find the line": a detail question is answered by one sentence; match the restated choice.
export const alt = "A detail question: the words how and first are underlined, a magnifier lands on one sentence of the passage, and the choice that restates it turns green while a true-but-different choice is greyed.";

const P = "v-central-ideas--find-line-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const fade = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 } }`;
const draw = (n: string, t: number, d = 8) => `.${P}${n} { stroke-dasharray: 100; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 } }`;
const paint = (n: string, prop: string, from: string, to: string, t: number) => `.${P}${n} { ${prop}: ${to}; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { ${prop}: ${from} } ${t + 6}%, 100% { ${prop}: ${to} } }`;

const css = `
.v-central-ideas--find-line-a { animation: 9s ease-in-out infinite; }
.v-central-ideas--find-line-scene { animation-name: v-central-ideas--find-line-scene; }
@keyframes v-central-ideas--find-line-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("passage", 4)}
${show("question", 8)}
${draw("u1", 22)}
${draw("u2", 26)}
${paint("w1", "fill", C.ink, C.primaryText, 22)}
${paint("w2", "fill", C.ink, C.primaryText, 26)}
.v-central-ideas--find-line-mag { animation-name: v-central-ideas--find-line-mag; }
@keyframes v-central-ideas--find-line-mag { 0%, 32% { opacity: 0; transform: translateY(-40px) } 37% { opacity: 1; transform: translateY(-40px) } 52%, 100% { opacity: 1; transform: none } }
${fade("hl", 50)}
${paint("s2", "fill", C.muted, C.ink, 50)}
${fade("tagline", 52)}
${show("ca", 60)}
${show("cb", 62)}
${draw("la", 68, 7)}
${draw("lb", 74, 7)}
.v-central-ideas--find-line-cbox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-central-ideas--find-line-cbox; }
@keyframes v-central-ideas--find-line-cbox { 0%, 72% { fill: ${C.fill}; stroke: ${C.line} } 78%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
${fade("tagca", 74)}
${fade("tagcb", 78)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-scene`}>
        {/* The passage: three sentences, one of them is the line */}
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-passage`}>
          <rect x={14} y={16} width={144} height={122} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <rect className={`v-central-ideas--find-line-a v-central-ideas--find-line-hl`} x={20} y={52} width={132} height={52} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <g fontSize={12} fontWeight={600}>
            <text x={24} y={38} fill={C.muted}>Bikes changed a lot.</text>
            <text className={`v-central-ideas--find-line-a v-central-ideas--find-line-s2`} fill={C.ink}>
              <tspan x={24} y={70}>Riders pushed off</tspan>
              <tspan x={24} y={84}>the ground with</tspan>
              <tspan x={24} y={98}>their feet.</tspan>
            </text>
            <text x={24} y={121} fill={C.muted}>Pedals came later.</text>
          </g>
          <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-tagline`}>
            <rect x={22} y={45} width={50} height={14} rx={7} fill={C.primary} />
            <text x={47} y={55.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary}>the line</text>
          </g>
        </g>

        {/* The question */}
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-question`}>
          <rect x={178} y={26} width={128} height={50} rx={10} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <text fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan x={186} y={42}>According to the</tspan>
            <tspan x={186} y={56}>text, <tspan className={`v-central-ideas--find-line-a v-central-ideas--find-line-w1`}>how</tspan> did the</tspan>
            <tspan x={186} y={70}><tspan className={`v-central-ideas--find-line-a v-central-ideas--find-line-w2`}>first</tspan> riders move?</tspan>
          </text>
          <path className={`v-central-ideas--find-line-a v-central-ideas--find-line-u1`} d="M220 59 H240" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
          <path className={`v-central-ideas--find-line-a v-central-ideas--find-line-u2`} d="M186 73 H210" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
          <rect x={198} y={19} width={86} height={14} rx={7} fill={C.primary} />
          <text x={241} y={29.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary}>question word</text>
        </g>

        {/* The magnifier sweeps down and stops on the line */}
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-mag`}>
          <circle cx={140} cy={77} r={8} fill="none" stroke={C.primary} strokeWidth={2} />
          <path d="M146 83 L153 90" stroke={C.primary} strokeWidth={2.5} />
        </g>

        {/* Connectors */}
        <path className={`v-central-ideas--find-line-a v-central-ideas--find-line-la`} d="M152 77 C168 77 164 101 178 101" pathLength={100} fill="none" stroke={C.good} strokeWidth={2} />
        <path className={`v-central-ideas--find-line-a v-central-ideas--find-line-lb`} d="M178 151 C166 151 166 121 132 121" pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* Choices */}
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-ca`}>
          <rect className={`v-central-ideas--find-line-a v-central-ideas--find-line-cbox`} x={178} y={84} width={128} height={36} rx={9} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={600} fill={C.ink}>
            <tspan x={186} y={103}>Pushed off with</tspan>
            <tspan x={186} y={115}>their feet</tspan>
          </text>
        </g>
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-tagca`}>
          <rect x={196} y={77} width={52} height={14} rx={7} fill={C.good} />
          <text x={222} y={87.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>restated</text>
        </g>
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-cb`}>
          <rect x={178} y={134} width={128} height={36} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={600} fill={C.muted}>
            <tspan x={186} y={153}>True, but about</tspan>
            <tspan x={186} y={165}>pedals</tspan>
          </text>
        </g>
        <g className={`v-central-ideas--find-line-a v-central-ideas--find-line-tagcb`}>
          <rect x={190} y={127} width={104} height={14} rx={7} fill={C.muted} />
          <text x={242} y={137.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>different question</text>
        </g>
      </g>
    </Svg>
  );
}
