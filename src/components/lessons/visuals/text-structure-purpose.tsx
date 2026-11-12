import { C, Css, Svg } from "./kit";

// Text structure and purpose: label each sentence's job (belief, then correction); the choice that names that job locks in.
export const alt =
  "\"Goldfish forget in seconds. In fact, they remember for months.\" The sentences are labeled belief and correction; the purpose \"To correct a belief\" locks in.";

const css = `
.v-text-structure-purpose-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-text-structure-purpose-scene { animation-name: v-text-structure-purpose-scene; }
@keyframes v-text-structure-purpose-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the first sentence gets its label */
.v-text-structure-purpose-tag1 { animation-name: v-text-structure-purpose-tag1; }
@keyframes v-text-structure-purpose-tag1 { 0%, 12% { opacity: 0; transform: translateX(-8px) } 19%, 100% { opacity: 1; transform: none } }

/* Beat 2: the turn lights up, the second sentence gets its label */
.v-text-structure-purpose-turn { fill: ${C.primary}; animation-name: v-text-structure-purpose-turn; }
@keyframes v-text-structure-purpose-turn { 0%, 28% { fill: ${C.ink} } 33%, 100% { fill: ${C.primary} } }
.v-text-structure-purpose-tag2 { animation-name: v-text-structure-purpose-tag2; }
@keyframes v-text-structure-purpose-tag2 { 0%, 34% { opacity: 0; transform: translateX(-8px) } 41%, 100% { opacity: 1; transform: none } }

/* Beat 3: the choice that only repeats a detail is rejected */
.v-text-structure-purpose-no { opacity: 0.5; animation-name: v-text-structure-purpose-no; }
@keyframes v-text-structure-purpose-no {
  0%, 50% { transform: translateX(0); opacity: 1 }
  52% { transform: translateX(-4px) }
  54% { transform: translateX(4px) }
  56% { transform: translateX(-3px) }
  58% { transform: translateX(0); opacity: 1 }
  66%, 100% { transform: translateX(0); opacity: 0.5 }
}
.v-text-structure-purpose-noBox { animation-name: v-text-structure-purpose-noBox; }
@keyframes v-text-structure-purpose-noBox {
  0%, 49% { fill: ${C.fill}; stroke: ${C.line} }
  52%, 60% { fill: ${C.badSoft}; stroke: ${C.bad} }
  66%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}

/* Beat 4: the choice that names the job locks in */
.v-text-structure-purpose-yes { transform-box: fill-box; transform-origin: center; animation-name: v-text-structure-purpose-yes; }
@keyframes v-text-structure-purpose-yes { 0%, 68% { transform: scale(1) } 72% { transform: scale(1.06) } 77%, 100% { transform: scale(1) } }
.v-text-structure-purpose-yesBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-text-structure-purpose-yesBox; }
@keyframes v-text-structure-purpose-yesBox { 0%, 68% { fill: ${C.fill}; stroke: ${C.line} } 72%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
`;

/** A small label above a sentence: what the sentence is doing. */
function Tag({ y, w, word, accent }: { y: number; w: number; word: string; accent?: boolean }) {
  return (
    <>
      <rect x={20} y={y} width={w} height={18} rx={9} fill={accent ? C.soft : C.fill} stroke={accent ? C.primary : C.line} strokeWidth={1.5} />
      <text x={20 + w / 2} y={y + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={accent ? C.primary : C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

/** An answer choice. Its box takes fill/stroke from the parent group. */
function Chip({ x, words }: { x: number; words: string }) {
  return (
    <>
      <rect x={x} y={130} width={136} height={28} rx={14} strokeWidth={1.5} />
      <text x={x + 68} y={148.5} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.ink} stroke="none">
        {words}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-text-structure-purpose-a v-text-structure-purpose-scene">
        {/* Sentence 1 and its job */}
        <g className="v-text-structure-purpose-a v-text-structure-purpose-tag1">
          <Tag y={20} w={50} word="belief" />
        </g>
        <text x={20} y={57} fontSize={15} fontWeight={600} fill={C.ink}>
          Goldfish forget in seconds.
        </text>

        {/* Sentence 2 and its job */}
        <g className="v-text-structure-purpose-a v-text-structure-purpose-tag2">
          <Tag y={72} w={78} word="correction" accent />
        </g>
        <text x={20} y={109} fontSize={15} fontWeight={600} fill={C.ink}>
          <tspan className="v-text-structure-purpose-a v-text-structure-purpose-turn">In fact,</tspan> they remember for months.
        </text>

        {/* The purpose choices */}
        <g className="v-text-structure-purpose-a v-text-structure-purpose-no">
          <g className="v-text-structure-purpose-a v-text-structure-purpose-noBox" fill={C.fill} stroke={C.line}>
            <Chip x={20} words="To explain training" />
          </g>
        </g>
        <g className="v-text-structure-purpose-a v-text-structure-purpose-yes">
          <g className="v-text-structure-purpose-a v-text-structure-purpose-yesBox">
            <Chip x={164} words="To correct a belief" />
          </g>
        </g>
      </g>
    </Svg>
  );
}
