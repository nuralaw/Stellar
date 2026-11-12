import { C, Css, Svg } from "./kit";

// Words in Context: the clue after the colon lights up, you predict a plain word, and the choice that means it locks in.
export const alt = "\"Her plants are ___: no water for weeks, still green.\" The clue gives the prediction tough; fragile is rejected and hardy fits the blank.";

const css = `
.v-words-in-context-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-words-in-context-scene { animation-name: v-words-in-context-scene; }
@keyframes v-words-in-context-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the clue lights up and gets underlined */
.v-words-in-context-clue { fill: ${C.primary}; animation-name: v-words-in-context-clue; }
@keyframes v-words-in-context-clue { 0%, 10% { fill: ${C.ink} } 16%, 100% { fill: ${C.primary} } }
.v-words-in-context-line { stroke-dasharray: 100; stroke-dashoffset: 0; animation-name: v-words-in-context-line; }
@keyframes v-words-in-context-line { 0%, 10% { stroke-dashoffset: 100 } 24%, 100% { stroke-dashoffset: 0 } }

/* Beat 2: the prediction */
.v-words-in-context-pred { animation-name: v-words-in-context-pred; }
@keyframes v-words-in-context-pred { 0%, 26% { opacity: 0; transform: translateY(-4px) } 33%, 100% { opacity: 1; transform: none } }

/* Beat 3: "fragile" flies to the blank, gets rejected, goes back */
.v-words-in-context-try { opacity: 0.5; animation-name: v-words-in-context-try; }
@keyframes v-words-in-context-try {
  0%, 38% { transform: translate(0, 0); opacity: 1 }
  48% { transform: translate(136px, -100px); opacity: 1 }
  50% { transform: translate(132px, -100px); opacity: 1 }
  52% { transform: translate(140px, -100px); opacity: 1 }
  54% { transform: translate(133px, -100px); opacity: 1 }
  56%, 59% { transform: translate(136px, -100px); opacity: 1 }
  68%, 100% { transform: translate(0, 0); opacity: 0.5 }
}
.v-words-in-context-tryBox { animation-name: v-words-in-context-tryBox; }
@keyframes v-words-in-context-tryBox {
  0%, 48% { fill: ${C.fill}; stroke: ${C.line} }
  51%, 59% { fill: ${C.badSoft}; stroke: ${C.bad} }
  68%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}

/* Beat 4: "hardy" flies to the blank and locks in */
.v-words-in-context-win { transform: translate(-56px, -100px); animation-name: v-words-in-context-win; }
@keyframes v-words-in-context-win { 0%, 70% { transform: translate(0, 0) } 80%, 100% { transform: translate(-56px, -100px) } }
.v-words-in-context-winBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-words-in-context-winBox; }
@keyframes v-words-in-context-winBox { 0%, 80% { fill: ${C.fill}; stroke: ${C.line} } 84%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
`;

/** A word chip. Its box takes fill/stroke from the parent group; the word never gets a stroke. */
function Chip({ x, word }: { x: number; word: string }) {
  return (
    <>
      <rect x={x} y={128} width={80} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 40} y={146} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-words-in-context-a v-words-in-context-scene">
        {/* The sentence: a blank, then the clue after the colon */}
        <text x={154} y={46} textAnchor="end" fontSize={16} fontWeight={600} fill={C.ink}>
          Her plants are
        </text>
        <rect x={160} y={28} width={80} height={26} rx={13} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        <text x={244} y={46} fontSize={16} fontWeight={600} fill={C.ink}>
          :
        </text>
        <text x={160} y={78} textAnchor="middle" fontSize={15} fontWeight={600} className="v-words-in-context-a v-words-in-context-clue">
          no water for weeks, still green.
        </text>
        <path d="M46 86 H274" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} className="v-words-in-context-a v-words-in-context-line" />

        {/* The prediction */}
        <g className="v-words-in-context-a v-words-in-context-pred">
          <text x={160} y={108} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted}>
            clue → predict: <tspan fill={C.primary} fontWeight={700}>tough</tspan>
          </text>
        </g>

        {/* Choices */}
        <g fill={C.fill} stroke={C.line}>
          <Chip x={120} word="pricey" />
        </g>
        <g className="v-words-in-context-a v-words-in-context-try">
          <g className="v-words-in-context-a v-words-in-context-tryBox" fill={C.fill} stroke={C.line}>
            <Chip x={24} word="fragile" />
          </g>
        </g>
        <g className="v-words-in-context-a v-words-in-context-win">
          <g className="v-words-in-context-a v-words-in-context-winBox">
            <Chip x={216} word="hardy" />
          </g>
        </g>
      </g>
    </Svg>
  );
}
