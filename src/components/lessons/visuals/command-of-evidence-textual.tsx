import { C, Css, Svg } from "./kit";

// Command of Evidence (textual): two findings are tested against the claim. The one that is only on topic is
// rejected; the one that shows the claim's own link (noise → higher) locks in.
export const alt =
  "Claim: noise makes birds sing higher. \"City birds lay more eggs\" is rejected: no link. \"Noise on: birds sing higher\" matches the claim and locks in.";

const css = `
.v-command-of-evidence-textual-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-command-of-evidence-textual-scene { animation-name: v-command-of-evidence-textual-scene; }
@keyframes v-command-of-evidence-textual-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the claim's two key words light up */
.v-command-of-evidence-textual-key { fill: ${C.primary}; animation-name: v-command-of-evidence-textual-key; }
@keyframes v-command-of-evidence-textual-key { 0%, 9% { fill: ${C.ink} } 15%, 100% { fill: ${C.primary} } }

/* Beat 2: finding A is tested, shakes, is rejected */
.v-command-of-evidence-textual-shake { animation-name: v-command-of-evidence-textual-shake; }
@keyframes v-command-of-evidence-textual-shake {
  0%, 27% { transform: translate(0, 0) }
  29% { transform: translate(-4px, 0) }
  31% { transform: translate(4px, 0) }
  33% { transform: translate(-3px, 0) }
  35%, 100% { transform: translate(0, 0) }
}
.v-command-of-evidence-textual-boxA { animation-name: v-command-of-evidence-textual-boxA; }
@keyframes v-command-of-evidence-textual-boxA {
  0%, 18% { fill: ${C.fill}; stroke: ${C.line} }
  22%, 26% { fill: ${C.soft}; stroke: ${C.primary} }
  29%, 37% { fill: ${C.badSoft}; stroke: ${C.bad} }
  43%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}
.v-command-of-evidence-textual-textA { opacity: 0.55; animation-name: v-command-of-evidence-textual-textA; }
@keyframes v-command-of-evidence-textual-textA { 0%, 37% { opacity: 1 } 43%, 100% { opacity: 0.55 } }
.v-command-of-evidence-textual-tagA { animation-name: v-command-of-evidence-textual-tagA; }
@keyframes v-command-of-evidence-textual-tagA { 0%, 30% { opacity: 0; transform: translateX(-4px) } 35%, 100% { opacity: 1; transform: none } }

/* Beat 3: finding B is tested, its words match the claim, it locks in */
.v-command-of-evidence-textual-boxB { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-command-of-evidence-textual-boxB; }
@keyframes v-command-of-evidence-textual-boxB {
  0%, 46% { fill: ${C.fill}; stroke: ${C.line} }
  50%, 62% { fill: ${C.soft}; stroke: ${C.primary} }
  67%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }
}
.v-command-of-evidence-textual-keyB { fill: ${C.primary}; animation-name: v-command-of-evidence-textual-keyB; }
@keyframes v-command-of-evidence-textual-keyB { 0%, 52% { fill: ${C.ink} } 58%, 100% { fill: ${C.primary} } }
.v-command-of-evidence-textual-tagB { animation-name: v-command-of-evidence-textual-tagB; }
@keyframes v-command-of-evidence-textual-tagB { 0%, 64% { opacity: 0; transform: translateX(-4px) } 70%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-command-of-evidence-textual-a v-command-of-evidence-textual-scene">
        {/* The claim */}
        <text x={24} y={36} fontSize={11} fontWeight={700} fill={C.muted} letterSpacing={1}>
          CLAIM
        </text>
        <text x={24} y={58} fontSize={17} fontWeight={700} fill={C.ink}>
          <tspan className="v-command-of-evidence-textual-a v-command-of-evidence-textual-key">Noise</tspan> makes birds sing{" "}
          <tspan className="v-command-of-evidence-textual-a v-command-of-evidence-textual-key">higher</tspan>.
        </text>

        {/* Finding A: on topic, but not the claim's link */}
        <g className="v-command-of-evidence-textual-a v-command-of-evidence-textual-shake">
          <rect className="v-command-of-evidence-textual-a v-command-of-evidence-textual-boxA" x={16} y={76} width={288} height={32} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text className="v-command-of-evidence-textual-a v-command-of-evidence-textual-textA" x={28} y={97} fontSize={14} fontWeight={600} fill={C.ink}>
            City birds lay more eggs.
          </text>
          <text className="v-command-of-evidence-textual-a v-command-of-evidence-textual-tagA" x={292} y={97} textAnchor="end" fontSize={12} fontWeight={700} fill={C.bad}>
            ✕ no link
          </text>
        </g>

        {/* Finding B: shows the link itself */}
        <rect className="v-command-of-evidence-textual-a v-command-of-evidence-textual-boxB" x={16} y={120} width={288} height={32} rx={10} strokeWidth={1.5} />
        <text x={28} y={141} fontSize={14} fontWeight={600} fill={C.ink}>
          <tspan className="v-command-of-evidence-textual-a v-command-of-evidence-textual-keyB">Noise</tspan> on: birds sing{" "}
          <tspan className="v-command-of-evidence-textual-a v-command-of-evidence-textual-keyB">higher</tspan>.
        </text>
        <text className="v-command-of-evidence-textual-a v-command-of-evidence-textual-tagB" x={292} y={141} textAnchor="end" fontSize={12} fontWeight={700} fill={C.good}>
          ✓ supports
        </text>
      </g>
    </Svg>
  );
}
