import { C, Css, Svg } from "./kit";

// Inferences, "Draw the circle": the circle is what the text covers; only the choice inside it is a safe conclusion.
export const alt = "A circle labelled one bay, one factory. The choice warm water, maybe slides inside and turns green. The choices all bays and adds poisons stay outside and turn red.";


const css = `
.v-inferences--scope-a { animation: 9s ease-in-out infinite; }
.v-inferences--scope-scene { animation-name: v-inferences--scope-scene; }
@keyframes v-inferences--scope-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

.v-inferences--scope-circle { animation-name: v-inferences--scope-circle; }
@keyframes v-inferences--scope-circle { 0%, 6% { opacity: 0 } 14%, 100% { opacity: 1 } }

/* the good chip slides into the circle */
.v-inferences--scope-in { transform: translateX(-148px); animation-name: v-inferences--scope-in; }
@keyframes v-inferences--scope-in { 0%, 56% { transform: translateX(0) } 70%, 100% { transform: translateX(-148px) } }
.v-inferences--scope-inBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-inferences--scope-inBox; }
@keyframes v-inferences--scope-inBox { 0%, 68% { fill: ${C.fill}; stroke: ${C.line} } 74%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }

/* the two bad chips try to enter, get stopped and turn red */
.v-inferences--scope-out1 { animation-name: v-inferences--scope-out1; }
@keyframes v-inferences--scope-out1 {
  0%, 18% { transform: translateX(0) }
  28% { transform: translateX(-42px) }
  38%, 100% { transform: translateX(0) }
}
.v-inferences--scope-out2 { animation-name: v-inferences--scope-out2; }
@keyframes v-inferences--scope-out2 {
  0%, 34% { transform: translateX(0) }
  44% { transform: translateX(-42px) }
  54%, 100% { transform: translateX(0) }
}
.v-inferences--scope-bad1 { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-inferences--scope-bad1; }
@keyframes v-inferences--scope-bad1 { 0%, 24% { fill: ${C.fill}; stroke: ${C.line} } 30%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
.v-inferences--scope-bad2 { fill: ${C.badSoft}; stroke: ${C.bad}; animation-name: v-inferences--scope-bad2; }
@keyframes v-inferences--scope-bad2 { 0%, 40% { fill: ${C.fill}; stroke: ${C.line} } 46%, 100% { fill: ${C.badSoft}; stroke: ${C.bad} } }
.v-inferences--scope-x1 { animation-name: v-inferences--scope-x1; }
@keyframes v-inferences--scope-x1 { 0%, 28% { opacity: 0 } 34%, 100% { opacity: 1 } }
.v-inferences--scope-x2 { animation-name: v-inferences--scope-x2; }
@keyframes v-inferences--scope-x2 { 0%, 44% { opacity: 0 } 50%, 100% { opacity: 1 } }
`;

const CHIP_W = 112;
const CHIP_H = 24;

function Chip({ y, word, dx = -6 }: { y: number; word: string; dx?: number }) {
  return (
    <>
      <rect x={192} y={y} width={CHIP_W} height={CHIP_H} rx={12} strokeWidth={1.5} />
      <text x={192 + CHIP_W / 2 + dx} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

/** A small cross at the right end of a chip. */
function Cross({ y, cls }: { y: number; cls: string }) {
  const cx = 192 + CHIP_W - 14;
  const cy = y + CHIP_H / 2;
  return <path className={`v-inferences--scope-a ${cls}`} d={`M${cx - 4} ${cy - 4} L${cx + 4} ${cy + 4} M${cx + 4} ${cy - 4} L${cx - 4} ${cy + 4}`} fill="none" stroke={C.bad} strokeWidth={2} />;
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-inferences--scope-a v-inferences--scope-scene`}>
        {/* What the text covers */}
        <g className={`v-inferences--scope-a v-inferences--scope-circle`}>
          <circle cx={100} cy={92} r={70} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={100} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
            the text covers
          </text>
          <text x={100} y={67} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            one bay,
          </text>
          <text x={100} y={83} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            one factory
          </text>
        </g>

        <text x={248} y={28} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
          choices
        </text>

        {/* Choices */}
        <g className={`v-inferences--scope-a v-inferences--scope-out1`}>
          <g className={`v-inferences--scope-a v-inferences--scope-bad1`} fill={C.badSoft} stroke={C.bad}>
            <Chip y={38} word="all bays" />
          </g>
          <Cross y={38} cls={`v-inferences--scope-x1`} />
        </g>
        <g className={`v-inferences--scope-a v-inferences--scope-out2`}>
          <g className={`v-inferences--scope-a v-inferences--scope-bad2`} fill={C.badSoft} stroke={C.bad}>
            <Chip y={66} word="adds poisons" />
          </g>
          <Cross y={66} cls={`v-inferences--scope-x2`} />
        </g>
        <g className={`v-inferences--scope-a v-inferences--scope-in`}>
          <g className={`v-inferences--scope-a v-inferences--scope-inBox`}>
            <Chip y={94} word="warm water, maybe" dx={0} />
          </g>
        </g>
      </g>
    </Svg>
  );
}
