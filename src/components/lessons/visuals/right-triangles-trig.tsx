import { C, Css, Svg } from "./kit";

// Right triangles and trig: one ratio (sin θ = 3/5) builds the whole 3-4-5 triangle, then any other ratio reads off it.
export const alt = "A right triangle with sin θ = 3/5: the missing side is 4 because 5² − 3² = 4², so tan θ = 3/4.";

const css = `
.v-right-triangles-trig-a { animation: 9s ease-in-out infinite; }
.v-right-triangles-trig-scene { animation-name: v-right-triangles-trig-scene; }
@keyframes v-right-triangles-trig-scene { 0% { opacity: 0 } 6%, 91% { opacity: 1 } 97%, 100% { opacity: 0 } }

.v-right-triangles-trig-draw { stroke-dasharray: 100; animation-name: v-right-triangles-trig-draw; }
@keyframes v-right-triangles-trig-draw { 0%, 5% { stroke-dashoffset: 100 } 20%, 100% { stroke-dashoffset: 0 } }
.v-right-triangles-trig-body { animation-name: v-right-triangles-trig-body; }
@keyframes v-right-triangles-trig-body { 0%, 16% { opacity: 0 } 24%, 100% { opacity: 1 } }

.v-right-triangles-trig-opp { animation-name: v-right-triangles-trig-opp; }
@keyframes v-right-triangles-trig-opp { 0%, 26% { stroke: ${C.ink} } 31%, 100% { stroke: ${C.primary} } }
.v-right-triangles-trig-hyp { animation-name: v-right-triangles-trig-hyp; }
@keyframes v-right-triangles-trig-hyp { 0%, 26% { stroke: ${C.ink} } 31%, 64% { stroke: ${C.primary} } 70%, 100% { stroke: ${C.ink} } }
.v-right-triangles-trig-adj { animation-name: v-right-triangles-trig-adj; }
@keyframes v-right-triangles-trig-adj { 0%, 48% { stroke: ${C.ink} } 54%, 100% { stroke: ${C.primary} } }

.v-right-triangles-trig-n3 { animation-name: v-right-triangles-trig-n3; }
@keyframes v-right-triangles-trig-n3 { 0%, 26% { fill: ${C.ink} } 31%, 100% { fill: ${C.primaryText} } }
.v-right-triangles-trig-n5 { animation-name: v-right-triangles-trig-n5; }
@keyframes v-right-triangles-trig-n5 { 0%, 26% { fill: ${C.ink} } 31%, 64% { fill: ${C.primaryText} } 70%, 100% { fill: ${C.ink} } }

.v-right-triangles-trig-sin { animation-name: v-right-triangles-trig-sin; }
@keyframes v-right-triangles-trig-sin { 0%, 24% { opacity: 0; transform: translateX(-8px) } 31%, 100% { opacity: 1; transform: none } }
.v-right-triangles-trig-pyth { animation-name: v-right-triangles-trig-pyth; }
@keyframes v-right-triangles-trig-pyth { 0%, 44% { opacity: 0; transform: translateX(-8px) } 51%, 100% { opacity: 1; transform: none } }
.v-right-triangles-trig-tan { animation-name: v-right-triangles-trig-tan; }
@keyframes v-right-triangles-trig-tan { 0%, 64% { opacity: 0; transform: translateX(-8px) } 71%, 100% { opacity: 1; transform: none } }

.v-right-triangles-trig-q { opacity: 0; animation-name: v-right-triangles-trig-q; }
@keyframes v-right-triangles-trig-q { 0%, 16% { opacity: 0 } 24%, 48% { opacity: 1 } 53%, 100% { opacity: 0 } }
.v-right-triangles-trig-four { transform-box: fill-box; transform-origin: center; animation-name: v-right-triangles-trig-four; }
@keyframes v-right-triangles-trig-four {
  0%, 50% { opacity: 0; transform: scale(0.6) }
  55% { opacity: 1; transform: scale(1.25) }
  60%, 100% { opacity: 1; transform: scale(1) }
}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-right-triangles-trig-a v-right-triangles-trig-scene">
        {/* The 3-4-5 triangle: A (28,134), C (148,134), B (148,44). 1 unit = 30. */}
        <polygon className="v-right-triangles-trig-a v-right-triangles-trig-body" points="28,134 148,134 148,44" fill={C.fill} />
        <g className="v-right-triangles-trig-a v-right-triangles-trig-body">
          <path d="M138 134 V124 H148" stroke={C.muted} strokeWidth={1.5} fill="none" />
          <path d="M52 134 A24 24 0 0 0 47.2 119.6" stroke={C.muted} strokeWidth={1.5} fill="none" />
          <text x={59} y={129} fontSize={12} fontWeight={600} fill={C.muted}>
            θ
          </text>
          <text className="v-right-triangles-trig-a v-right-triangles-trig-n3" x={159} y={94} fontSize={15} fontWeight={700} fill={C.primaryText}>
            3
          </text>
          <text className="v-right-triangles-trig-a v-right-triangles-trig-n5" x={80} y={80} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
            5
          </text>
        </g>
        <line
          className="v-right-triangles-trig-a v-right-triangles-trig-draw v-right-triangles-trig-adj"
          x1={28} y1={134} x2={148} y2={134} pathLength={100} stroke={C.primary} strokeWidth={2.5}
        />
        <line
          className="v-right-triangles-trig-a v-right-triangles-trig-draw v-right-triangles-trig-opp"
          x1={148} y1={134} x2={148} y2={44} pathLength={100} stroke={C.primary} strokeWidth={2.5}
        />
        <line
          className="v-right-triangles-trig-a v-right-triangles-trig-draw v-right-triangles-trig-hyp"
          x1={148} y1={44} x2={28} y2={134} pathLength={100} stroke={C.ink} strokeWidth={2.5}
        />
        <text className="v-right-triangles-trig-a v-right-triangles-trig-q" x={88} y={153} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText}>
          ?
        </text>
        <text className="v-right-triangles-trig-a v-right-triangles-trig-four" x={88} y={153} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText}>
          4
        </text>

        {/* The work, line by line */}
        <g className="v-right-triangles-trig-a v-right-triangles-trig-sin">
          <text x={196} y={46} fontSize={11} fill={C.muted}>
            given
          </text>
          <text x={196} y={66} fontSize={17} fontWeight={700} fill={C.ink}>
            sin θ = 3/5
          </text>
        </g>
        <text className="v-right-triangles-trig-a v-right-triangles-trig-pyth" x={196} y={96} fontSize={14} fontWeight={600} fill={C.muted}>
          5² − 3² = 4²
        </text>
        <g className="v-right-triangles-trig-a v-right-triangles-trig-tan">
          <rect x={188} y={112} width={116} height={32} rx={8} fill={C.goodSoft} />
          <text x={196} y={134} fontSize={17} fontWeight={700} fill={C.good}>
            tan θ = 3/4
          </text>
        </g>
      </g>
    </Svg>
  );
}
