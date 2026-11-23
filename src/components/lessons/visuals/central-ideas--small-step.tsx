import { C, Css, Svg } from "./kit";

// Central ideas, "One small step": an inference is one short step from the text's facts; a long jump is a leap.
export const alt = "Two facts, boats stuck in ice and Tomas repairing nets. A short solid arrow reaches the supported conclusion, he repairs gear; a long dashed arrow leaps to he will sell the boat and is rejected.";

const P = "v-central-ideas--small-step-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const fade = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 } }`;
const draw = (n: string, t: number, d = 8) => `.${P}${n} { stroke-dasharray: 100; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 } }`;

const css = `
.v-central-ideas--small-step-a { animation: 10s ease-in-out infinite; }
.v-central-ideas--small-step-scene { animation-name: v-central-ideas--small-step-scene; }
@keyframes v-central-ideas--small-step-scene { 0% { opacity: 0 } 6%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("f1", 4)}
${show("f2", 10)}
${fade("joint", 16)}
${show("c1", 24)}
${draw("step", 30, 7)}
${fade("stephead", 36)}
${fade("steplab", 38)}
${show("c2", 48)}
.v-central-ideas--small-step-leap { animation-name: v-central-ideas--small-step-leap; }
@keyframes v-central-ideas--small-step-leap { 0%, 52% { opacity: 0; stroke: ${C.muted} } 58% { opacity: 1; stroke: ${C.muted} } 66%, 100% { opacity: 1; stroke: ${C.bad} } }
${fade("leaplab", 64)}
${show("cap", 76)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-central-ideas--small-step-a v-central-ideas--small-step-scene">
        <text x={14} y={16} fontSize={11} fontWeight={700} fill={C.muted}>fact</text>

        {/* The two facts */}
        <g className="v-central-ideas--small-step-a v-central-ideas--small-step-f1">
          <rect x={14} y={22} width={100} height={36} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={600} fill={C.ink}>
            <tspan x={22} y={37}>Boats stuck in</tspan>
            <tspan x={22} y={50}>ice in February</tspan>
          </text>
        </g>
        <g className="v-central-ideas--small-step-a v-central-ideas--small-step-f2">
          <rect x={14} y={64} width={100} height={36} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={600} fill={C.ink}>
            <tspan x={22} y={79}>Tomas repairs</tspan>
            <tspan x={22} y={92}>his nets</tspan>
          </text>
        </g>
        <g className="v-central-ideas--small-step-a v-central-ideas--small-step-joint">
          <path d="M114 40 H126 V82 H114" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <circle cx={126} cy={61} r={3.5} fill={C.muted} />
        </g>

        {/* One small step: short, solid */}
        <g className="v-central-ideas--small-step-a v-central-ideas--small-step-c1">
          <rect x={160} y={18} width={146} height={40} rx={9} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={700} fill={C.ink}>
            <tspan x={168} y={34}>He cannot fish, so</tspan>
            <tspan x={168} y={48}>he repairs gear</tspan>
          </text>
        </g>
        <path className="v-central-ideas--small-step-a v-central-ideas--small-step-step" d="M128 59 L156 40" pathLength={100} fill="none" stroke={C.good} strokeWidth={2.5} />
        <path className="v-central-ideas--small-step-a v-central-ideas--small-step-stephead" d="M147 38 L157 39.5 L151 47" fill="none" stroke={C.good} strokeWidth={2.5} />
        <text className="v-central-ideas--small-step-a v-central-ideas--small-step-steplab" x={166} y={74} fontSize={11} fontWeight={700} fill={C.good}>
          one small step
        </text>

        {/* A leap: long, dashed */}
        <g className="v-central-ideas--small-step-a v-central-ideas--small-step-c2">
          <rect x={224} y={102} width={82} height={36} rx={9} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} />
          <text fontSize={11} fontWeight={700} fill={C.ink}>
            <tspan x={232} y={117}>He will sell</tspan>
            <tspan x={232} y={130}>the boat</tspan>
          </text>
        </g>
        <path className="v-central-ideas--small-step-a v-central-ideas--small-step-leap" d="M128 63 C150 124 190 124 220 120" fill="none" stroke={C.bad} strokeWidth={2.5} strokeDasharray="5 5" />
        <path className="v-central-ideas--small-step-a v-central-ideas--small-step-leap" d="M212 114 L221 120 L212 126" fill="none" stroke={C.bad} strokeWidth={2.5} />
        <text className="v-central-ideas--small-step-a v-central-ideas--small-step-leaplab" x={168} y={141} fontSize={11} fontWeight={700} fill={C.bad}>
          a leap
        </text>

        {/* The rule */}
        <g className="v-central-ideas--small-step-a v-central-ideas--small-step-cap">
          <text textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
            <tspan x={160} y={158}>Point to the lines that support it.</tspan>
            <tspan x={160} y={171}>If you need a third, you stepped too far.</tspan>
          </text>
        </g>
      </g>
    </Svg>
  );
}
