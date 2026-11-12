import type { ReactNode } from "react";
import { C, Css, Svg } from "./kit";

// The Bluebook tools: a countdown timer, the Desmos calculator, the formula (reference) sheet,
// the flag (Mark for Review) and the cross-out (Option Eliminator).
export const alt =
  "Five built-in tools appear one by one: a timer, the Desmos graphing calculator drawing a parabola, a formula sheet, a flag to mark a question, and a line crossing out an answer choice.";

const P = "v-digital-sat-format--tools-";
/** Tile n arrives at t%, is the accent while its tool acts, then calms down. */
const tile = (n: number, t: number) => {
  const g = P + "t" + n;
  const b = P + "o" + n;
  return `.${g} { transform-box: fill-box; transform-origin: center; animation-name: ${g}; }
@keyframes ${g} { 0%, ${t}% { opacity: 0; transform: scale(0.85) } ${t + 4}%, 100% { opacity: 1; transform: none } }
.${b} { animation-name: ${b}; }
@keyframes ${b} { 0%, ${t + 13}% { stroke: ${C.primary}; fill: ${C.soft} } ${t + 17}%, 100% { stroke: ${C.line}; fill: ${C.fill} } }`;
};
/** A stroke that draws itself between a% and b%. */
const draw = (n: string, a: number, b: number) => {
  const k = P + n;
  return `.${k} { stroke-dasharray: 100; animation-name: ${k}; }
@keyframes ${k} { 0%, ${a}% { stroke-dashoffset: 100 } ${b}%, 100% { stroke-dashoffset: 0 } }`;
};

const css = `
.v-digital-sat-format--tools-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--tools-scene { animation-name: v-digital-sat-format--tools-scene; }
@keyframes v-digital-sat-format--tools-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
${tile(1, 5)}
${tile(2, 22)}
${tile(3, 39)}
${tile(4, 56)}
${tile(5, 73)}
.v-digital-sat-format--tools-hand { transform-box: view-box; transform-origin: 64px 44px; animation-name: v-digital-sat-format--tools-hand; }
@keyframes v-digital-sat-format--tools-hand { 0%, 8% { transform: rotate(0deg) } 20%, 100% { transform: rotate(360deg) } }
${draw("curve", 27, 37)}
.v-digital-sat-format--tools-form { animation-name: v-digital-sat-format--tools-form; }
@keyframes v-digital-sat-format--tools-form { 0%, 44% { opacity: 0 } 50%, 100% { opacity: 1 } }
.v-digital-sat-format--tools-flag { transform-box: fill-box; transform-origin: left center; animation-name: v-digital-sat-format--tools-flag; }
@keyframes v-digital-sat-format--tools-flag { 0%, 61% { transform: scaleX(0) } 68%, 100% { transform: scaleX(1) } }
${draw("strike", 78, 86)}
`;

function Tile({ x, y, label, g, b, children }: { x: number; y: number; label: string; g: string; b: string; children: ReactNode }) {
  return (
    <g className={g}>
      <rect className={b} x={x} y={y} width={84} height={62} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      {children}
      <text x={x + 42} y={y + 54} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>
        {label}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--tools-a v-digital-sat-format--tools-scene">
        {/* Timer */}
        <Tile x={22} y={20} label="timer" g="v-digital-sat-format--tools-a v-digital-sat-format--tools-t1" b="v-digital-sat-format--tools-a v-digital-sat-format--tools-o1">
          <circle cx={64} cy={44} r={13} fill={C.bg} stroke={C.ink} strokeWidth={2} />
          <line x1={64} y1={31} x2={64} y2={27} stroke={C.ink} strokeWidth={2} />
          <line x1={60} y1={26.5} x2={68} y2={26.5} stroke={C.ink} strokeWidth={2} />
          <line className="v-digital-sat-format--tools-a v-digital-sat-format--tools-hand" x1={64} y1={44} x2={64} y2={35} stroke={C.ink} strokeWidth={2.5} />
          <circle cx={64} cy={44} r={1.8} fill={C.ink} />
        </Tile>

        {/* Desmos: axes and a parabola */}
        <Tile x={118} y={20} label="Desmos" g="v-digital-sat-format--tools-a v-digital-sat-format--tools-t2" b="v-digital-sat-format--tools-a v-digital-sat-format--tools-o2">
          <rect x={138} y={27} width={44} height={33} rx={4} fill={C.bg} stroke={C.line} strokeWidth={1} />
          <line x1={141} y1={52} x2={179} y2={52} stroke={C.muted} strokeWidth={1.5} />
          <line x1={160} y1={30} x2={160} y2={57} stroke={C.muted} strokeWidth={1.5} />
          <path className="v-digital-sat-format--tools-a v-digital-sat-format--tools-curve" d="M144 33 Q160 71 176 33" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        </Tile>

        {/* Formula sheet */}
        <Tile x={214} y={20} label="formulas" g="v-digital-sat-format--tools-a v-digital-sat-format--tools-t3" b="v-digital-sat-format--tools-a v-digital-sat-format--tools-o3">
          <rect x={230} y={28} width={52} height={31} rx={4} fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
          <text className="v-digital-sat-format--tools-a v-digital-sat-format--tools-form" x={256} y={48} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            A = πr²
          </text>
        </Tile>

        {/* Flag: mark for review */}
        <Tile x={70} y={98} label="flag" g="v-digital-sat-format--tools-a v-digital-sat-format--tools-t4" b="v-digital-sat-format--tools-a v-digital-sat-format--tools-o4">
          <line x1={104} y1={107} x2={104} y2={138} stroke={C.ink} strokeWidth={2.5} />
          <path className="v-digital-sat-format--tools-a v-digital-sat-format--tools-flag" d="M105 108 L126 115 L105 123 Z" fill={C.primary} stroke={C.primary} strokeWidth={1.5} />
        </Tile>

        {/* Cross-out: rule out a choice */}
        <Tile x={166} y={98} label="cross out" g="v-digital-sat-format--tools-a v-digital-sat-format--tools-t5" b="v-digital-sat-format--tools-a v-digital-sat-format--tools-o5">
          <rect x={180} y={111} width={56} height={22} rx={11} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <text x={192} y={126} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            B
          </text>
          <rect x={201} y={119} width={27} height={6} rx={3} fill={C.line} />
          <line className="v-digital-sat-format--tools-a v-digital-sat-format--tools-strike" x1={176} y1={122} x2={240} y2={122} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        </Tile>
      </g>
    </Svg>
  );
}
