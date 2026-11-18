import type { ReactNode } from "react";
import { C, Css, Svg } from "./kit";

// The nine Bluebook tools, by Bluebook's own names, appear one by one.
export const alt =
  "Nine Bluebook tools appear one by one: Testing Timer, Calculator, Reference Sheet, Highlights & Notes, Mark for Review, Line Reader, Option Eliminator, Question Menu and Zoom.";

const P = "v-digital-sat-format--tools-";
const A = P + "a";
const SCENE = P + "scene";
/** Tile n arrives at t%, is the accent while it is new, then calms down. */
const tile = (n: number, t: number) => {
  const g = P + "t" + n;
  const b = P + "o" + n;
  return `.${g} { transform-box: fill-box; transform-origin: center; animation-name: ${g}; }
@keyframes ${g} { 0%, ${t}% { opacity: 0; transform: scale(0.88) } ${t + 4}%, 100% { opacity: 1; transform: none } }
.${b} { animation-name: ${b}; }
@keyframes ${b} { 0%, ${t + 4}% { stroke: ${C.primary}; fill: ${C.soft} } ${t + 11}%, 100% { stroke: ${C.line}; fill: ${C.fill} } }`;
};

const css = `
.v-digital-sat-format--tools-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--tools-scene { animation-name: v-digital-sat-format--tools-scene; }
@keyframes v-digital-sat-format--tools-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => tile(i + 1, 5 + i * 8.5)).join("\n")}
`;

const TW = 92;
const TH = 46;

function Tile({ n, label, children }: { n: number; label: string[]; children: ReactNode }) {
  const col = (n - 1) % 3;
  const row = Math.floor((n - 1) / 3);
  const x = 16 + col * (TW + 6);
  const y = 16 + row * (TH + 5);
  return (
    <g className={`${A} ${P + "t" + n}`}>
      <rect className={`${A} ${P + "o" + n}`} x={x} y={y} width={TW} height={TH} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <g transform={`translate(${x + 19} ${y + 23})`} fill="none" stroke={C.ink} strokeWidth={1.75}>
        {children}
      </g>
      {label.map((t, i) => (
        <text key={t} x={x + 36} y={y + (label.length === 1 ? 27 : 20 + i * 13)} fontSize={11} fontWeight={700} fill={C.ink} stroke="none">
          {t}
        </text>
      ))}
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} ${SCENE}`}>
        {/* 1 Testing Timer */}
        <Tile n={1} label={["Testing", "Timer"]}>
          <circle cx={0} cy={1} r={9} fill={C.bg} />
          <line x1={0} y1={-8} x2={0} y2={-12} />
          <line x1={-3} y1={-12} x2={3} y2={-12} />
          <line x1={0} y1={1} x2={0} y2={-5} />
          <line x1={0} y1={1} x2={4} y2={3} />
        </Tile>

        {/* 2 Calculator (Desmos): axes and a parabola */}
        <Tile n={2} label={["Calculator"]}>
          <rect x={-11} y={-11} width={22} height={22} rx={3} fill={C.bg} stroke={C.line} strokeWidth={1.25} />
          <line x1={-8} y1={5} x2={8} y2={5} stroke={C.muted} strokeWidth={1.25} />
          <line x1={0} y1={-8} x2={0} y2={8} stroke={C.muted} strokeWidth={1.25} />
          <path d="M-7 -7 Q0 17 7 -7" stroke={C.primary} strokeWidth={2} />
        </Tile>

        {/* 3 Reference Sheet */}
        <Tile n={3} label={["Reference", "Sheet"]}>
          <rect x={-8} y={-11} width={16} height={22} rx={2} fill={C.bg} />
          <line x1={-4} y1={-5} x2={4} y2={-5} strokeWidth={1.5} />
          <line x1={-4} y1={0} x2={4} y2={0} strokeWidth={1.5} />
          <line x1={-4} y1={5} x2={1} y2={5} strokeWidth={1.5} />
        </Tile>

        {/* 4 Highlights & Notes */}
        <Tile n={4} label={["Highlights", "& Notes"]}>
          <rect x={-11} y={-4} width={22} height={7} rx={2} fill={C.soft} stroke="none" />
          <line x1={-10} y1={-8} x2={10} y2={-8} strokeWidth={1.5} stroke={C.muted} />
          <line x1={-10} y1={0} x2={10} y2={0} strokeWidth={1.5} />
          <line x1={-10} y1={8} x2={3} y2={8} strokeWidth={1.5} stroke={C.muted} />
        </Tile>

        {/* 5 Mark for Review: a bookmark */}
        <Tile n={5} label={["Mark for", "Review"]}>
          <path d="M-6 -11 H6 V11 L0 6 L-6 11 Z" fill={C.primary} stroke={C.primary} strokeWidth={1.5} />
        </Tile>

        {/* 6 Line Reader: one line in focus, the others dimmed */}
        <Tile n={6} label={["Line", "Reader"]}>
          <line x1={-10} y1={-8} x2={10} y2={-8} strokeWidth={1.5} stroke={C.line} />
          <rect x={-12} y={-4} width={24} height={8} rx={2} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <line x1={-9} y1={0} x2={9} y2={0} strokeWidth={1.5} />
          <line x1={-10} y1={8} x2={10} y2={8} strokeWidth={1.5} stroke={C.line} />
        </Tile>

        {/* 7 Option Eliminator: a crossed-out choice */}
        <Tile n={7} label={["Option", "Eliminator"]}>
          <rect x={-12} y={-7} width={24} height={14} rx={7} fill={C.bg} stroke={C.muted} strokeWidth={1.5} />
          <line x1={-15} y1={0} x2={15} y2={0} strokeWidth={2.25} />
        </Tile>

        {/* 8 Question Menu: a grid of questions, one marked */}
        <Tile n={8} label={["Question", "Menu"]}>
          <rect x={-11} y={-11} width={9} height={9} rx={2} fill={C.bg} strokeWidth={1.5} />
          <rect x={2} y={-11} width={9} height={9} rx={2} fill={C.primary} stroke={C.primary} strokeWidth={1.5} />
          <rect x={-11} y={2} width={9} height={9} rx={2} fill={C.bg} strokeWidth={1.5} />
          <rect x={2} y={2} width={9} height={9} rx={2} fill={C.bg} strokeWidth={1.5} />
        </Tile>

        {/* 9 Zoom: a magnifier */}
        <Tile n={9} label={["Zoom"]}>
          <circle cx={-2} cy={-2} r={8} fill={C.bg} />
          <line x1={4} y1={4} x2={11} y2={11} strokeWidth={2.5} />
          <line x1={-5} y1={-2} x2={1} y2={-2} strokeWidth={1.5} stroke={C.primary} />
          <line x1={-2} y1={-5} x2={-2} y2={1} strokeWidth={1.5} stroke={C.primary} />
        </Tile>
      </g>
    </Svg>
  );
}
