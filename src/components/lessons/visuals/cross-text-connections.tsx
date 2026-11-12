import type { ReactNode } from "react";
import { C, Css, Svg } from "./kit";

// Cross-text connections: two claims side by side; Text 2 answers Text 1 with "yes, but", not all or nothing.
export const alt = "Text 1: parks cool streets. Text 2: only large parks do. Agrees and Disagrees are rejected; Yes, but locks in.";

const css = `
.v-cross-text-connections-a { animation: 9s ease-in-out infinite; }

.v-cross-text-connections-scene { animation-name: v-cross-text-connections-scene; }
@keyframes v-cross-text-connections-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Text 2 slides in next to Text 1 */
.v-cross-text-connections-two { animation-name: v-cross-text-connections-two; }
@keyframes v-cross-text-connections-two { 0%, 10% { opacity: 0; transform: translateX(14px) } 18%, 100% { opacity: 1; transform: none } }

/* Text 2 answers Text 1: the arrow */
.v-cross-text-connections-arrow { stroke-dasharray: 100; animation-name: v-cross-text-connections-arrow; }
@keyframes v-cross-text-connections-arrow { 0%, 22% { stroke-dashoffset: 100 } 30%, 100% { stroke-dashoffset: 0 } }
.v-cross-text-connections-head { animation-name: v-cross-text-connections-head; }
@keyframes v-cross-text-connections-head { 0%, 28% { opacity: 0 } 32%, 100% { opacity: 1 } }

/* The limit Text 2 adds */
.v-cross-text-connections-limit { fill: ${C.primary}; animation-name: v-cross-text-connections-limit; }
@keyframes v-cross-text-connections-limit { 0%, 32% { fill: ${C.ink} } 37%, 100% { fill: ${C.primary} } }

/* "Agrees" and "Disagrees": tried, rejected, dimmed */
.v-cross-text-connections-no1 { opacity: 0.55; animation-name: v-cross-text-connections-no1; }
@keyframes v-cross-text-connections-no1 {
  0%, 42% { opacity: 1; transform: none }
  44% { opacity: 1; transform: translateX(-4px) }
  46% { opacity: 1; transform: translateX(4px) }
  48% { opacity: 1; transform: translateX(-3px) }
  50% { opacity: 1; transform: none }
  56%, 100% { opacity: 0.55; transform: none }
}
.v-cross-text-connections-no1Box { animation-name: v-cross-text-connections-no1Box; }
@keyframes v-cross-text-connections-no1Box {
  0%, 41% { fill: ${C.fill}; stroke: ${C.line} }
  44%, 51% { fill: ${C.badSoft}; stroke: ${C.bad} }
  56%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}
.v-cross-text-connections-no2 { opacity: 0.55; animation-name: v-cross-text-connections-no2; }
@keyframes v-cross-text-connections-no2 {
  0%, 54% { opacity: 1; transform: none }
  56% { opacity: 1; transform: translateX(-4px) }
  58% { opacity: 1; transform: translateX(4px) }
  60% { opacity: 1; transform: translateX(-3px) }
  62% { opacity: 1; transform: none }
  68%, 100% { opacity: 0.55; transform: none }
}
.v-cross-text-connections-no2Box { animation-name: v-cross-text-connections-no2Box; }
@keyframes v-cross-text-connections-no2Box {
  0%, 53% { fill: ${C.fill}; stroke: ${C.line} }
  56%, 63% { fill: ${C.badSoft}; stroke: ${C.bad} }
  68%, 100% { fill: ${C.fill}; stroke: ${C.line} }
}

/* "Yes, but" locks in */
.v-cross-text-connections-yes { transform-box: fill-box; transform-origin: center; animation-name: v-cross-text-connections-yes; }
@keyframes v-cross-text-connections-yes { 0%, 68% { transform: scale(1) } 72% { transform: scale(1.08) } 76%, 100% { transform: scale(1) } }
.v-cross-text-connections-yesBox { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-cross-text-connections-yesBox; }
@keyframes v-cross-text-connections-yesBox { 0%, 68% { fill: ${C.fill}; stroke: ${C.line} } 72%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} } }
`;

/** One text card: a small label and its claim on two lines. */
function Card({ x, label, children }: { x: number; label: string; children: ReactNode }) {
  return (
    <>
      <rect x={x} y={26} width={124} height={72} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <text x={x + 14} y={46} fontSize={11} fontWeight={600} fill={C.muted}>
        {label}
      </text>
      <text fontSize={15} fontWeight={700} fill={C.ink}>
        {children}
      </text>
    </>
  );
}

/** A relationship chip. Its box takes fill/stroke from its group; the word never gets a stroke. */
function Chip({ x, word }: { x: number; word: string }) {
  return (
    <>
      <rect x={x} y={124} width={84} height={26} rx={13} strokeWidth={1.5} />
      <text x={x + 42} y={141.5} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ink} stroke="none">
        {word}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-cross-text-connections-a v-cross-text-connections-scene">
        <Card x={16} label="Text 1">
          <tspan x={30} y={68}>Parks cool</tspan>
          <tspan x={30} y={86}>streets.</tspan>
        </Card>

        <g className="v-cross-text-connections-a v-cross-text-connections-two">
          <Card x={180} label="Text 2">
            <tspan x={194} y={68} className="v-cross-text-connections-a v-cross-text-connections-limit">Only large</tspan>
            <tspan x={194} y={86}>parks do.</tspan>
          </Card>
        </g>

        {/* Text 2 answers Text 1 */}
        <path
          className="v-cross-text-connections-a v-cross-text-connections-arrow"
          d="M174 62 H148"
          pathLength={100}
          fill="none"
          stroke={C.primary}
          strokeWidth={2}
        />
        <path
          className="v-cross-text-connections-a v-cross-text-connections-head"
          d="M154 56 L147 62 L154 68"
          fill="none"
          stroke={C.primary}
          strokeWidth={2}
        />

        {/* How does Text 2 answer? */}
        <g className="v-cross-text-connections-a v-cross-text-connections-no1">
          <g className="v-cross-text-connections-a v-cross-text-connections-no1Box" fill={C.fill} stroke={C.line}>
            <Chip x={22} word="Agrees" />
          </g>
        </g>
        <g className="v-cross-text-connections-a v-cross-text-connections-yes">
          <g className="v-cross-text-connections-a v-cross-text-connections-yesBox">
            <Chip x={118} word="Yes, but…" />
          </g>
        </g>
        <g className="v-cross-text-connections-a v-cross-text-connections-no2">
          <g className="v-cross-text-connections-a v-cross-text-connections-no2Box" fill={C.fill} stroke={C.line}>
            <Chip x={214} word="Disagrees" />
          </g>
        </g>
      </g>
    </Svg>
  );
}
