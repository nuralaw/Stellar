import { C, Css, Svg } from "./kit";

// Cross-text connections, "Test the claim": Text 2 never mentions Text 1's claim, so predict what it would show, then compare.
export const alt = "Text 1 claims old trees speed up seedling growth. Text 2 shows equal bars near and far. The scale swings from match to clash: the results do not support the view.";

const P = "v-cross-text-connections--evidence-test-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(6px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const fade = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 } }`;

const css = `
.v-cross-text-connections--evidence-test-a { animation: 11s ease-in-out infinite; }
.v-cross-text-connections--evidence-test-scene { animation-name: v-cross-text-connections--evidence-test-scene; }
@keyframes v-cross-text-connections--evidence-test-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${show("claim", 4)}
${show("bubble", 16)}
${show("evid", 32)}
.v-cross-text-connections--evidence-test-bar { transform-box: fill-box; transform-origin: 50% 100%; animation-name: v-cross-text-connections--evidence-test-bar; }
@keyframes v-cross-text-connections--evidence-test-bar { 0%, 42% { transform: scaleY(0) } 52%, 100% { transform: none } }
${fade("chart", 40)}
${fade("gauge", 54)}
.v-cross-text-connections--evidence-test-ptr { animation-name: v-cross-text-connections--evidence-test-ptr; }
@keyframes v-cross-text-connections--evidence-test-ptr { 0%, 60% { transform: translateX(-168px) } 74%, 100% { transform: none } }
.v-cross-text-connections--evidence-test-clash { fill: ${C.bad}; animation-name: v-cross-text-connections--evidence-test-clash; }
@keyframes v-cross-text-connections--evidence-test-clash { 0%, 68% { fill: ${C.muted} } 76%, 100% { fill: ${C.bad} } }
.v-cross-text-connections--evidence-test-match { fill: ${C.muted}; animation-name: v-cross-text-connections--evidence-test-match; }
@keyframes v-cross-text-connections--evidence-test-match { 0%, 60% { fill: ${C.good} } 68%, 100% { fill: ${C.muted} } }
${show("verdict", 76)}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-scene">
        {/* Claim, Text 1 */}
        <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-claim">
          <rect x={16} y={22} width={138} height={38} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan x={26} y={41}>Old trees speed up</tspan>
            <tspan x={26} y={55}>seedling growth.</tspan>
          </text>
          <rect x={26} y={15} width={96} height={14} rx={7} fill={C.muted} />
          <text x={74} y={25.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>Claim (Text 1)</text>
        </g>

        {/* The prediction */}
        <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-bubble">
          <path d="M40 68 L48 61 L56 68" fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <rect x={16} y={68} width={138} height={52} rx={9} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <path d="M41 68.8 H55" stroke={C.soft} strokeWidth={2} />
          <text fontSize={11} fontWeight={700} fill={C.primaryText}>
            <tspan x={26} y={84}>If true, seedlings</tspan>
            <tspan x={26} y={98}>near old trees</tspan>
            <tspan x={26} y={112}>should grow faster.</tspan>
          </text>
        </g>

        {/* Evidence, Text 2 */}
        <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-evid">
          <rect x={166} y={22} width={138} height={38} rx={9} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text fontSize={12} fontWeight={600} fill={C.ink}>
            <tspan x={176} y={41}>Same growth</tspan>
            <tspan x={176} y={55}>near and far.</tspan>
          </text>
          <rect x={176} y={15} width={112} height={14} rx={7} fill={C.muted} />
          <text x={232} y={25.5} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bg}>Evidence (Text 2)</text>
        </g>

        {/* Two equal bars */}
        <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-chart">
          <path d="M184 106 H290" stroke={C.muted} strokeWidth={1.5} />
          <text x={210} y={118} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>near</text>
          <text x={264} y={118} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>far</text>
        </g>
        <rect className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-bar" x={196} y={70} width={28} height={36} rx={3} fill={C.primary} />
        <rect className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-bar" x={250} y={70} width={28} height={36} rx={3} fill={C.primary} />

        {/* The scale: match → clash */}
        <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-gauge">
          <path d="M72 138 H248" stroke={C.line} strokeWidth={4} />
          <text className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-match" x={16} y={142} fontSize={12} fontWeight={700}>match</text>
          <text className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-clash" x={304} y={142} textAnchor="end" fontSize={12} fontWeight={700}>clash</text>
          <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-ptr">
            <circle cx={240} cy={138} r={7} fill={C.bad} stroke={C.bg} strokeWidth={2} />
          </g>
        </g>

        <g className="v-cross-text-connections--evidence-test-a v-cross-text-connections--evidence-test-verdict">
          <text x={160} y={166} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>Results do not support the view</text>
        </g>
      </g>
    </Svg>
  );
}
