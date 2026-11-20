import { C, Css, Svg } from "./kit";

// Boundaries: both sides of the blank are full sentences, so a comma is rejected and a semicolon locks in.
export const alt = "\"The rain stopped ___ the game began.\" Both sides are full sentences: a comma is tried and rejected, a semicolon locks in.";

const css = `
.v-boundaries-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-boundaries-scene { animation-name: v-boundaries-scene; }
@keyframes v-boundaries-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: underline each side, label it */
.v-boundaries-line { stroke-dasharray: 100; stroke-dashoffset: 0; }
.v-boundaries-l1 { animation-name: v-boundaries-l1; }
@keyframes v-boundaries-l1 { 0%, 8% { stroke-dashoffset: 100 } 16%, 100% { stroke-dashoffset: 0 } }
.v-boundaries-t1 { animation-name: v-boundaries-t1; }
@keyframes v-boundaries-t1 { 0%, 13% { opacity: 0; transform: translateY(-4px) } 18%, 100% { opacity: 1; transform: none } }
.v-boundaries-l2 { animation-name: v-boundaries-l2; }
@keyframes v-boundaries-l2 { 0%, 20% { stroke-dashoffset: 100 } 28%, 100% { stroke-dashoffset: 0 } }
.v-boundaries-t2 { animation-name: v-boundaries-t2; }
@keyframes v-boundaries-t2 { 0%, 25% { opacity: 0; transform: translateY(-4px) } 30%, 100% { opacity: 1; transform: none } }

/* Beat 2: the comma flies up, gets rejected and drops out below the blank, still red */
.v-boundaries-try { transform: translate(30px, 0); animation-name: v-boundaries-try; }
@keyframes v-boundaries-try {
  0%, 34% { transform: translate(0, 0) }
  43% { transform: translate(30px, -74px) }
  46% { transform: translate(26px, -74px) }
  48% { transform: translate(34px, -74px) }
  50% { transform: translate(27px, -74px) }
  52%, 54% { transform: translate(30px, -74px) }
  62%, 100% { transform: translate(30px, 0) }
}
.v-boundaries-tryBox { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-boundaries-tryBox; }
@keyframes v-boundaries-tryBox {
  0%, 43% { fill: ${C.fill}; stroke: ${C.line} }
  46%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} }
}
.v-boundaries-why { animation-name: v-boundaries-why; }
@keyframes v-boundaries-why { 0%, 60% { opacity: 0; transform: translateY(-4px) } 66%, 100% { opacity: 1; transform: none } }

/* Beat 3: the semicolon flies up and locks in */
.v-boundaries-win { transform: translate(-30px, -74px); animation-name: v-boundaries-win; }
@keyframes v-boundaries-win { 0%, 66% { transform: translate(0, 0) } 76%, 100% { transform: translate(-30px, -74px) } }
.v-boundaries-winBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-boundaries-winBox; }
@keyframes v-boundaries-winBox { 0%, 76% { fill: ${C.fill}; stroke: ${C.line} } 80%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
`;

/** A punctuation chip. Its box takes fill/stroke from the parent group; the mark never gets a stroke. */
function Chip({ x, mark, dy }: { x: number; mark: string; dy: number }) {
  return (
    <>
      <rect x={x} y={108} width={28} height={28} rx={8} strokeWidth={1.5} />
      <text x={x + 14} y={128 + dy} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.ink} stroke="none">
        {mark}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-boundaries-a v-boundaries-scene">
        {/* The sentence with a blank between its two halves */}
        <text x={140} y={54} textAnchor="end" fontSize={15} fontWeight={600} fill={C.ink}>
          The rain stopped
        </text>
        <rect x={146} y={34} width={28} height={28} rx={8} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        <text x={180} y={54} fontSize={15} fontWeight={600} fill={C.ink}>
          the game began.
        </text>

        {/* Both sides can stand alone */}
        <path className="v-boundaries-a v-boundaries-line v-boundaries-l1" d="M22 68 H140" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <text className="v-boundaries-a v-boundaries-t1" x={81} y={86} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.primaryText}>
          full sentence
        </text>
        <path className="v-boundaries-a v-boundaries-line v-boundaries-l2" d="M180 68 H298" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <text className="v-boundaries-a v-boundaries-t2" x={239} y={86} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.primaryText}>
          full sentence
        </text>

        {/* Choices */}
        <g className="v-boundaries-a v-boundaries-try">
          <g className="v-boundaries-a v-boundaries-tryBox" fill={C.fill} stroke={C.line}>
            <Chip x={116} mark="," dy={-4} />
          </g>
        </g>
        <text className="v-boundaries-a v-boundaries-why" x={160} y={153} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.bad}>
          comma splice
        </text>
        <g className="v-boundaries-a v-boundaries-win">
          <g className="v-boundaries-a v-boundaries-winBox">
            <Chip x={176} mark=";" dy={0} />
          </g>
        </g>
      </g>
    </Svg>
  );
}
