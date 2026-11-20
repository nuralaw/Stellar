import { C, Css, Svg } from "./kit";

// Transitions: try a word in the blank; the one that matches the logic (contrast here) locks in.
export const alt = "\"The test was easy. ___, most failed.\" Therefore is tried and rejected; However fits, because easy and failed contrast.";

const css = `
.v-transitions-a { animation: 8s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-transitions-scene { animation-name: v-transitions-scene; }
@keyframes v-transitions-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* "Therefore" flies up, gets rejected, goes back */
.v-transitions-try { animation-name: v-transitions-try; }
@keyframes v-transitions-try {
  0%, 12% { transform: translate(0, 0) }
  22% { transform: translate(0, -48px) }
  26% { transform: translate(-4px, -48px) }
  28% { transform: translate(4px, -48px) }
  30% { transform: translate(-3px, -48px) }
  32% { transform: translate(0, -48px) }
  40%, 100% { transform: translate(0, 0) }
}
.v-transitions-tryBox { animation-name: v-transitions-tryBox; }
@keyframes v-transitions-tryBox {
  0%, 22% { fill: ${C.fill}; stroke: ${C.line} }
  25%, 33% { fill: ${C.badSoft}; stroke: ${C.bad} }
  40%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}

/* "However" flies up and locks in */
.v-transitions-win { transform: translate(-96px, -48px); animation-name: v-transitions-win; }
@keyframes v-transitions-win { 0%, 44% { transform: translate(0, 0) } 56%, 100% { transform: translate(-96px, -48px) } }
.v-transitions-winBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-transitions-winBox; }
@keyframes v-transitions-winBox { 0%, 56% { fill: ${C.fill}; stroke: ${C.line} } 60%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }

/* The clue: easy vs failed */
.v-transitions-clue { fill: ${C.primaryText}; animation-name: v-transitions-clue; }
@keyframes v-transitions-clue { 0%, 62% { fill: ${C.ink} } 66%, 100% { fill: ${C.primaryText} } }
.v-transitions-tag { animation-name: v-transitions-tag; }
@keyframes v-transitions-tag { 0%, 64% { opacity: 0; transform: translateY(4px) } 70%, 100% { opacity: 1; transform: none } }
`;

/** A word chip. Its box takes fill/stroke from the parent group; the word never gets a stroke. */
function Chip({ x, word }: { x: number; word: string }) {
  return (
    <>
      <rect x={x} y={128} width={88} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 44} y={146} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-transitions-a v-transitions-scene">
        {/* The sentence with a blank */}
        <text x={24} y={50} fontSize={16} fontWeight={600} fill={C.ink}>
          The test was <tspan className="v-transitions-a v-transitions-clue">easy</tspan>.
        </text>
        <rect x={24} y={80} width={88} height={26} rx={13} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        <text x={118} y={98} fontSize={16} fontWeight={600} fill={C.ink}>
          , most <tspan className="v-transitions-a v-transitions-clue">failed</tspan>.
        </text>

        {/* Choices */}
        <g fill={C.fill} stroke={C.line}>
          <Chip x={216} word="Similarly" />
        </g>
        <g className="v-transitions-a v-transitions-try">
          <g className="v-transitions-a v-transitions-tryBox" fill={C.fill} stroke={C.line}>
            <Chip x={24} word="Therefore" />
          </g>
        </g>
        <g className="v-transitions-a v-transitions-win">
          <g className="v-transitions-a v-transitions-winBox">
            <Chip x={120} word="However" />
          </g>
        </g>

        <g className="v-transitions-a v-transitions-tag">
          <text x={296} y={50} textAnchor="end" fontSize={12} fontWeight={600} fill={C.primaryText}>
            easy ↔ failed
          </text>
          <text x={296} y={66} textAnchor="end" fontSize={11} fill={C.muted}>
            contrast
          </text>
        </g>
      </g>
    </Svg>
  );
}
