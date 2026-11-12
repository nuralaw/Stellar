import { C, Css, Svg } from "./kit";

// Inferences: two facts, then "So ___". The ending that claims too much is rejected; the small, careful one locks in.
export const alt = "Belief: rain splits tomatoes. But in a dry summer they split the same. \"Rain never matters\" is too strong; \"it may not be rain\" fits.";

const css = `
.v-inferences-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-inferences-scene { animation-name: v-inferences-scene; }
@keyframes v-inferences-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* The two facts, then "So" + the blank */
.v-inferences-f1 { animation-name: v-inferences-f1; }
@keyframes v-inferences-f1 { 0%, 4% { opacity: 0; transform: translateY(4px) } 10%, 100% { opacity: 1; transform: none } }
.v-inferences-f2 { animation-name: v-inferences-f2; }
@keyframes v-inferences-f2 { 0%, 14% { opacity: 0; transform: translateY(4px) } 20%, 100% { opacity: 1; transform: none } }
.v-inferences-so { animation-name: v-inferences-so; }
@keyframes v-inferences-so { 0%, 24% { opacity: 0 } 30%, 100% { opacity: 1 } }

/* "rain never matters" flies up, gets rejected, goes back */
.v-inferences-try { opacity: 0.6; animation-name: v-inferences-try; }
@keyframes v-inferences-try {
  0%, 34% { transform: translate(0, 0); opacity: 1 }
  43% { transform: translate(-112px, -48px); opacity: 1 }
  46% { transform: translate(-116px, -48px); opacity: 1 }
  48% { transform: translate(-108px, -48px); opacity: 1 }
  50% { transform: translate(-115px, -48px); opacity: 1 }
  52%, 56% { transform: translate(-112px, -48px); opacity: 1 }
  64%, 100% { transform: translate(0, 0); opacity: 0.6 }
}
.v-inferences-tryBox { animation-name: v-inferences-tryBox; }
@keyframes v-inferences-tryBox {
  0%, 43% { fill: ${C.fill}; stroke: ${C.line} }
  46%, 56% { fill: ${C.badSoft}; stroke: ${C.bad} }
  64%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}
.v-inferences-bad { opacity: 0; animation-name: v-inferences-bad; }
@keyframes v-inferences-bad { 0%, 44% { opacity: 0 } 48%, 56% { opacity: 1 } 61%, 100% { opacity: 0 } }

/* "it may not be rain" flies up and locks in */
.v-inferences-win { transform: translate(36px, -48px); animation-name: v-inferences-win; }
@keyframes v-inferences-win { 0%, 66% { transform: translate(0, 0) } 76%, 100% { transform: translate(36px, -48px) } }
.v-inferences-winBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-inferences-winBox; }
@keyframes v-inferences-winBox { 0%, 76% { fill: ${C.fill}; stroke: ${C.line} } 80%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
.v-inferences-ok { animation-name: v-inferences-ok; }
@keyframes v-inferences-ok { 0%, 78% { opacity: 0; transform: translateY(4px) } 84%, 100% { opacity: 1; transform: none } }
`;

/** A choice chip. Its box takes fill/stroke from the parent group; the words never get a stroke. */
function Chip({ x, words }: { x: number; words: string }) {
  return (
    <>
      <rect x={x} y={130} width={132} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 66} y={147.5} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink} stroke="none">
        {words}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-inferences-a v-inferences-scene">
        {/* Fact 1: the belief */}
        <g className="v-inferences-a v-inferences-f1">
          <text x={20} y={40} fontSize={11} fontWeight={600} fill={C.muted}>
            Belief
          </text>
          <text x={64} y={40} fontSize={15} fontWeight={600} fill={C.ink}>
            Rain splits tomatoes.
          </text>
        </g>

        {/* Fact 2: the twist */}
        <g className="v-inferences-a v-inferences-f2">
          <text x={20} y={64} fontSize={11} fontWeight={600} fill={C.muted}>
            But
          </text>
          <text x={64} y={64} fontSize={15} fontWeight={600} fill={C.ink}>
            Dry summer: same splits.
          </text>
        </g>

        {/* So + the blank */}
        <g className="v-inferences-a v-inferences-so">
          <text x={20} y={100} fontSize={15} fontWeight={700} fill={C.primary}>
            So
          </text>
          <rect x={56} y={82} width={132} height={26} rx={13} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        </g>

        {/* Verdicts next to the blank */}
        <text className="v-inferences-a v-inferences-bad" x={198} y={99.5} fontSize={12} fontWeight={600} fill={C.bad}>
          too strong
        </text>
        <text className="v-inferences-a v-inferences-ok" x={198} y={99.5} fontSize={12} fontWeight={600} fill={C.good}>
          one small step
        </text>

        {/* Choices */}
        <g className="v-inferences-a v-inferences-try">
          <g className="v-inferences-a v-inferences-tryBox" fill={C.fill} stroke={C.line}>
            <Chip x={168} words="rain never matters" />
          </g>
        </g>
        <g className="v-inferences-a v-inferences-win">
          <g className="v-inferences-a v-inferences-winBox">
            <Chip x={20} words="it may not be rain" />
          </g>
        </g>
      </g>
    </Svg>
  );
}
