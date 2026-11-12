import { C, Css, Svg } from "./kit";

// Form, Structure, and Sense: the verb matches the true subject. "are" is pulled in by "maps" and rejected;
// cross out "of old maps", the subject "box" is one thing, so "is" locks in.
export const alt = "\"The box of old maps ___ dusty.\" Are is tried and rejected; of old maps is crossed out, box is marked as the subject, and is locks in.";

const css = `
.v-form-structure-sense-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-form-structure-sense-scene { animation-name: v-form-structure-sense-scene; }
@keyframes v-form-structure-sense-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* "are" flies into the blank, gets rejected, goes back */
.v-form-structure-sense-try { opacity: 0.45; animation-name: v-form-structure-sense-try; }
@keyframes v-form-structure-sense-try {
  0%, 9% { transform: translate(0, 0); opacity: 1 }
  18% { transform: translate(84px, -62px) }
  21% { transform: translate(80px, -62px) }
  23% { transform: translate(88px, -62px) }
  25% { transform: translate(81px, -62px) }
  27% { transform: translate(84px, -62px) }
  35% { transform: translate(0, 0); opacity: 1 }
  40%, 100% { transform: translate(0, 0); opacity: 0.45 }
}
.v-form-structure-sense-tryBox { animation-name: v-form-structure-sense-tryBox; }
@keyframes v-form-structure-sense-tryBox {
  0%, 18% { fill: ${C.fill}; stroke: ${C.line} }
  21%, 28% { fill: ${C.badSoft}; stroke: ${C.bad} }
  35%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}

/* Cross out the extra: "of old maps" */
.v-form-structure-sense-extra { fill: ${C.muted}; animation-name: v-form-structure-sense-extra; }
@keyframes v-form-structure-sense-extra { 0%, 38% { fill: ${C.ink} } 46%, 100% { fill: ${C.muted} } }
.v-form-structure-sense-strike { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: v-form-structure-sense-strike; }
@keyframes v-form-structure-sense-strike { 0%, 38% { stroke-dashoffset: 100 } 46%, 100% { stroke-dashoffset: 0 } }
.v-form-structure-sense-extraTag { animation-name: v-form-structure-sense-extraTag; }
@keyframes v-form-structure-sense-extraTag { 0%, 42% { opacity: 0; transform: translateY(4px) } 48%, 100% { opacity: 1; transform: none } }

/* The subject: "box" */
.v-form-structure-sense-subj { fill: ${C.primary}; animation-name: v-form-structure-sense-subj; }
@keyframes v-form-structure-sense-subj { 0%, 50% { fill: ${C.ink} } 56%, 100% { fill: ${C.primary} } }
.v-form-structure-sense-subjTag { animation-name: v-form-structure-sense-subjTag; }
@keyframes v-form-structure-sense-subjTag { 0%, 52% { opacity: 0; transform: translateY(-4px) } 58%, 100% { opacity: 1; transform: none } }

/* "is" flies up and locks in */
.v-form-structure-sense-win { transform: translate(30px, -62px); animation-name: v-form-structure-sense-win; }
@keyframes v-form-structure-sense-win { 0%, 63% { transform: translate(0, 0) } 73%, 100% { transform: translate(30px, -62px) } }
.v-form-structure-sense-winBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-form-structure-sense-winBox; }
@keyframes v-form-structure-sense-winBox { 0%, 73% { fill: ${C.fill}; stroke: ${C.line} } 77%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
`;

const BASE = 68; // sentence baseline

/** A word chip. Its box takes fill/stroke from the parent group; the word never gets a stroke. */
function Chip({ x, word }: { x: number; word: string }) {
  return (
    <>
      <rect x={x} y={112} width={46} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 23} y={130} textAnchor="middle" fontSize={15} fontWeight={600} fill={C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-form-structure-sense-a v-form-structure-sense-scene">
        {/* The sentence: The box of old maps ___ dusty. (fixed widths, so the marks line up) */}
        <g fontSize={16} fontWeight={600}>
          <text x={33} y={BASE} textLength={29} lengthAdjust="spacingAndGlyphs" fill={C.ink}>
            The
          </text>
          <text x={67} y={BASE} textLength={28} lengthAdjust="spacingAndGlyphs" className="v-form-structure-sense-a v-form-structure-sense-subj">
            box
          </text>
          <text x={100} y={BASE} textLength={88} lengthAdjust="spacingAndGlyphs" className="v-form-structure-sense-a v-form-structure-sense-extra">
            of old maps
          </text>
          <text x={246} y={BASE} textLength={46} lengthAdjust="spacingAndGlyphs" fill={C.ink}>
            dusty.
          </text>
        </g>
        <rect x={194} y={50} width={46} height={26} rx={13} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />

        {/* Cross out the extra */}
        <path
          d="M 100 63 H 188"
          pathLength={100}
          fill="none"
          stroke={C.muted}
          strokeWidth={1.75}
          className="v-form-structure-sense-a v-form-structure-sense-strike"
        />
        <text x={144} y={41} textAnchor="middle" fontSize={12} fill={C.muted} className="v-form-structure-sense-a v-form-structure-sense-extraTag">
          extra
        </text>

        {/* The subject */}
        <g className="v-form-structure-sense-a v-form-structure-sense-subjTag">
          <path d="M 67 76 H 95" fill="none" stroke={C.primary} strokeWidth={2} />
          <text x={81} y={94} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.primary}>
            one box
          </text>
        </g>

        {/* Choices */}
        <g className="v-form-structure-sense-a v-form-structure-sense-try">
          <g className="v-form-structure-sense-a v-form-structure-sense-tryBox" fill={C.fill} stroke={C.line}>
            <Chip x={110} word="are" />
          </g>
        </g>
        <g className="v-form-structure-sense-a v-form-structure-sense-win">
          <g className="v-form-structure-sense-a v-form-structure-sense-winBox">
            <Chip x={164} word="is" />
          </g>
        </g>
      </g>
    </Svg>
  );
}
