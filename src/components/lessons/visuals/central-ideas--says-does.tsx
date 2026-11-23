import { C, Css, Svg } from "./kit";

// Central ideas, "Says vs does": in fiction, set what a character says against what he does; the main idea keeps both.
export const alt = "A blurb about Mr. Aldous and his roses. Two columns: he says he is indifferent to the prize, but he is up before dawn hiding in the far field. The main idea: he pretends not to care, but he does.";

const P = "v-central-ideas--says-does-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const fade = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 } }`;

const css = `
.v-central-ideas--says-does-a { animation: 9s ease-in-out infinite; }
.v-central-ideas--says-does-scene { animation-name: v-central-ideas--says-does-scene; }
@keyframes v-central-ideas--says-does-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("blurb", 4)}
${show("says", 18)}
${show("does", 30)}
.v-central-ideas--says-does-arrow { stroke-dasharray: 100; animation-name: v-central-ideas--says-does-arrow; }
@keyframes v-central-ideas--says-does-arrow { 0%, 46% { stroke-dashoffset: 100 } 54%, 100% { stroke-dashoffset: 0 } }
${fade("head", 52)}
${show("but", 54)}
${show("result", 66)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-central-ideas--says-does-a v-central-ideas--says-does-scene">
        {/* The blurb: quiet, but visible */}
        <g className="v-central-ideas--says-does-a v-central-ideas--says-does-blurb">
          <rect x={16} y={20} width={288} height={36} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={12} fontWeight={600} fill={C.muted}>
            <tspan x={28} y={38}>Mr. Aldous has entered his roses</tspan>
            <tspan x={28} y={51}>in a village contest.</tspan>
          </text>
          <rect x={26} y={13} width={42} height={14} rx={7} fill={C.muted} />
          <text x={47} y={23.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>blurb</text>
        </g>

        {/* What he says */}
        <g className="v-central-ideas--says-does-a v-central-ideas--says-does-says">
          <rect x={16} y={66} width={128} height={62} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text x={28} y={81} fontSize={11} fontWeight={700} fill={C.muted}>SAYS</text>
          <text fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan x={28} y={96}>“perfectly</tspan>
            <tspan x={28} y={110}>indifferent to</tspan>
            <tspan x={28} y={124}>the prize”</tspan>
          </text>
        </g>

        {/* What he does */}
        <g className="v-central-ideas--says-does-a v-central-ideas--says-does-does">
          <rect x={176} y={66} width={128} height={62} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <text x={188} y={81} fontSize={11} fontWeight={700} fill={C.muted}>DOES</text>
          <text fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan x={188} y={96}>up before dawn;</tspan>
            <tspan x={188} y={110}>hides in the</tspan>
            <tspan x={188} y={124}>far field</tspan>
          </text>
        </g>

        {/* The mismatch */}
        <path className="v-central-ideas--says-does-a v-central-ideas--says-does-arrow" d="M148 104 H168" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <path className="v-central-ideas--says-does-a v-central-ideas--says-does-head" d="M163 98 L171 104 L163 110" fill="none" stroke={C.primary} strokeWidth={2.5} />
        <g className="v-central-ideas--says-does-a v-central-ideas--says-does-but">
          <rect x={144} y={82} width={32} height={16} rx={8} fill={C.primary} />
          <text x={160} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.onPrimary}>but</text>
        </g>

        {/* The main idea keeps both */}
        <g className="v-central-ideas--says-does-a v-central-ideas--says-does-result">
          <rect x={16} y={142} width={288} height={30} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={160} y={162} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>He pretends not to care, but he does.</text>
          <rect x={26} y={135} width={64} height={14} rx={7} fill={C.primary} />
          <text x={58} y={145.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary}>main idea</text>
        </g>
      </g>
    </Svg>
  );
}
