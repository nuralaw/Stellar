import type { ReactNode } from "react";
import { C, Css, Svg } from "./kit";

// Bluebook tools grouped by where they exist: both sections, Reading and Writing only, Math only. Scratch paper is not an app tool.
export const alt =
  "Bluebook tools by section. Both: flag, cross out, timer, review, zoom, directions. R&W only: annotate. Math only: Desmos, reference sheet. Scratch paper is not an app tool; allowed in both.";

const A = "v-digital-sat-format--tools-by-section-a";
const TW = 62;
const TH = 36;

/** Tile n arrives at t%, is the accent while it is new, then calms down. */
const tile = (n: number, t: number) => `.v-digital-sat-format--tools-by-section-t${n} { transform-box: fill-box; transform-origin: center; animation-name: v-digital-sat-format--tools-by-section-t${n}; }
@keyframes v-digital-sat-format--tools-by-section-t${n} { 0%, ${t}% { opacity: 0; transform: scale(0.88) } ${t + 4}%, 100% { opacity: 1; transform: none } }
.v-digital-sat-format--tools-by-section-o${n} { animation-name: v-digital-sat-format--tools-by-section-o${n}; }
@keyframes v-digital-sat-format--tools-by-section-o${n} { 0%, ${t + 4}% { stroke: ${C.primary}; fill: ${C.soft} } ${t + 11}%, 100% { stroke: ${C.line}; fill: ${C.fill} } }`;

// start time (%) per tile, in order: six shared tiles, the R&W tile, two Math tiles, the scratch-paper note
const T = [10, 17, 24, 31, 38, 45, 54, 63, 70, 77];

const css = `
.v-digital-sat-format--tools-by-section-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--tools-by-section-scene { animation-name: v-digital-sat-format--tools-by-section-scene; }
@keyframes v-digital-sat-format--tools-by-section-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }
.v-digital-sat-format--tools-by-section-head { animation-name: v-digital-sat-format--tools-by-section-head; }
@keyframes v-digital-sat-format--tools-by-section-head { 0%, 4% { opacity: 0 } 9%, 100% { opacity: 1 } }
.v-digital-sat-format--tools-by-section-badge { animation-name: v-digital-sat-format--tools-by-section-badge; }
@keyframes v-digital-sat-format--tools-by-section-badge { 0%, 84% { opacity: 0 } 89%, 100% { opacity: 1 } }
${T.map((t, i) => tile(i + 1, t)).join("\n")}
`;

function Tile({ n, x, y, label, children }: { n: number; x: number; y: number; label: string; children: ReactNode }) {
  return (
    <g className={`${A} v-digital-sat-format--tools-by-section-t${n}`}>
      <rect className={`${A} v-digital-sat-format--tools-by-section-o${n}`} x={x} y={y} width={TW} height={TH} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
      <g transform={`translate(${x + 22} ${y + 12}) scale(0.78)`} fill="none" stroke={C.ink} strokeWidth={1.9}>
        {children}
      </g>
      <text x={x + TW / 2} y={y + 31} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
        {label}
      </text>
    </g>
  );
}

const X0 = 22; // both-sections column
const X1 = X0 + TW + 4;
const XR = X0 + 2 * TW + 4 + 12; // R&W column
const XM = XR + TW + 12; // Math column
const Y0 = 34;
const row = (r: number) => Y0 + r * (TH + 3);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${A} v-digital-sat-format--tools-by-section-scene`}>
        {/* Column headers stay visible */}
        <g className={`${A} v-digital-sat-format--tools-by-section-head`} fontSize={11} fontWeight={700} fill={C.muted} stroke="none" textAnchor="middle">
          <text x={X0 + TW + 2} y={26}>Both sections</text>
          <text x={XR + TW / 2} y={14}>Reading and</text>
          <text x={XR + TW / 2} y={26}>Writing only</text>
          <text x={XM + TW / 2} y={26}>Math only</text>
        </g>

        {/* Both sections */}
        <Tile n={1} x={X0} y={row(0)} label="Flag">
          <line x1={-5} y1={-8} x2={-5} y2={9} />
          <path d="M-5 -8 H6 L3 -3 L6 2 H-5" fill={C.soft} />
          {/* bookmark: a flag is not an answer circle */}
          <path d="M11 -7 H17 V3 L14 0.5 L11 3 Z" fill={C.primary} stroke="none" />
        </Tile>
        <Tile n={2} x={X1} y={row(0)} label="Cross out">
          <rect x={-10} y={-7} width={22} height={14} rx={7} fill={C.bg} />
          <line x1={-14} y1={0} x2={16} y2={0} stroke={C.bad} strokeWidth={2} />
        </Tile>
        <Tile n={3} x={X0} y={row(1)} label="Timer">
          <circle cx={0} cy={0} r={8} fill={C.bg} />
          <path d="M0 -4 V0 L3 2" />
        </Tile>
        <Tile n={4} x={X1} y={row(1)} label="Review">
          {[0, 1, 2].map((c) =>
            [0, 1].map((r) => <rect key={`${c}${r}`} x={-11 + c * 8} y={-7 + r * 8} width={6} height={6} rx={1.5} fill={C.bg} />),
          )}
        </Tile>
        <Tile n={5} x={X0} y={row(2)} label="Zoom">
          <circle cx={-2} cy={-2} r={6} fill={C.bg} />
          <line x1={2.5} y1={2.5} x2={8} y2={8} strokeWidth={2} />
        </Tile>
        <Tile n={6} x={X1} y={row(2)} label="Directions">
          <path d="M-6 -9 H3 L7 -5 V9 H-6 Z" fill={C.bg} />
          <path d="M-3 -1 H4 M-3 3 H4 M-3 6 H1" />
        </Tile>

        {/* Reading and Writing only */}
        <Tile n={7} x={XR} y={row(0)} label="Annotate">
          <rect x={-10} y={-5} width={18} height={6} rx={1.5} fill={C.soft} stroke={C.primary} />
          <path d="M-10 4 H8 M-10 8 H2" stroke={C.muted} />
          <path d="M9 -6 H16 V1 L9 1 Z" fill={C.bg} />
        </Tile>

        {/* Math only */}
        <Tile n={8} x={XM} y={row(0)} label="Desmos">
          <path d="M-10 9 H10 M-8 -9 V9" stroke={C.muted} />
          <path d="M-6 -7 C-3 9 3 9 8 -7" stroke={C.primary} strokeWidth={2} />
        </Tile>
        <Tile n={9} x={XM} y={row(1)} label="Ref. sheet">
          <path d="M-8 -9 H8 V9 H-8 Z" fill={C.bg} />
          <path d="M-4 -4 L-2 -1 L1 -6 H5 M-4 3 H4" />
        </Tile>
        {/* Not an app tool: scratch paper, allowed in both sections */}
        <g className={`${A} v-digital-sat-format--tools-by-section-t10`}>
          <rect className={`${A} v-digital-sat-format--tools-by-section-o10`} x={XR} y={row(2)} width={XM + TW - XR} height={TH} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} strokeDasharray="4 3" />
          <g transform={`translate(${XR + 22} ${row(2) + TH / 2}) scale(0.78)`} fill="none" stroke={C.ink} strokeWidth={1.9}>
            <path d="M-9 -8 H4 V9 H-9 Z" fill={C.bg} />
            <path d="M-5 -3 H0 M-5 2 H0" stroke={C.muted} />
            <path d="M10 -9 L14 -5 L6 4 L3 5 L4 2 Z" fill={C.soft} stroke={C.primary} />
          </g>
          <text x={XR + 44} y={row(2) + 16} fontSize={11} fontWeight={600} fill={C.ink} stroke="none">
            Scratch paper
          </text>
          <text x={XR + 44} y={row(2) + 29} fontSize={11} fill={C.muted} stroke="none">
            Not in app · both
          </text>
        </g>

        {/* Timer returns at 5 minutes */}
        <g className={`${A} v-digital-sat-format--tools-by-section-badge`}>
          <rect x={X0 + 37} y={row(1) + 4} width={24} height={13} rx={6} fill={C.primary} />
          <text x={X0 + 49} y={row(1) + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary} stroke="none">
            5:00
          </text>
        </g>

        <text x={160} y={164} textAnchor="middle" fontSize={11} fill={C.muted} stroke="none">
          Names in the app may differ a little.
        </text>
      </g>
    </Svg>
  );
}
