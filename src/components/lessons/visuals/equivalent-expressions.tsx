import { C, Css, Svg } from "./kit";

// Equivalent expressions: a rectangle with sides (x + 3) and (x + 2) is cut into four tiles.
// Sides multiplied = tiles added, so (x + 3)(x + 2) = x² + 5x + 6. Unit = 13: x is drawn as 65, 3 as 39, 2 as 26.
export const alt = "A rectangle with sides x + 3 and x + 2 is cut into four tiles: x², 2x, 3x and 6. Added up, (x + 3)(x + 2) = x² + 5x + 6.";

// Beats (% of 10 s): 0–5 in · 6–22 each factor is a side · 22–34 cut · 35–56 each tile = its two sides multiplied ·
// 57–77 add the tiles, 2x + 3x = 5x · hold · 92–100 out
const css = `
.v-equivalent-expressions-a { animation: 10s ease-in-out infinite; }

.v-equivalent-expressions-scene { animation-name: v-equivalent-expressions-scene; }
@keyframes v-equivalent-expressions-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: each factor lights up with its side */
.v-equivalent-expressions-fa { animation-name: v-equivalent-expressions-fa; }
@keyframes v-equivalent-expressions-fa { 0%, 6% { fill: ${C.ink} } 9%, 12% { fill: ${C.primaryText} } 15%, 100% { fill: ${C.ink} } }
.v-equivalent-expressions-fb { animation-name: v-equivalent-expressions-fb; }
@keyframes v-equivalent-expressions-fb { 0%, 13% { fill: ${C.ink} } 16%, 19% { fill: ${C.primaryText} } 22%, 100% { fill: ${C.ink} } }
.v-equivalent-expressions-pa { animation-name: v-equivalent-expressions-pa; }
@keyframes v-equivalent-expressions-pa { 0%, 6% { fill: ${C.muted} } 9%, 12% { fill: ${C.primaryText} } 15%, 100% { fill: ${C.muted} } }
.v-equivalent-expressions-pb { animation-name: v-equivalent-expressions-pb; }
@keyframes v-equivalent-expressions-pb { 0%, 13% { fill: ${C.muted} } 16%, 19% { fill: ${C.primaryText} } 22%, 100% { fill: ${C.muted} } }
.v-equivalent-expressions-ea { stroke-dasharray: 100; opacity: 0; animation-name: v-equivalent-expressions-ea; }
@keyframes v-equivalent-expressions-ea {
  0%, 6% { stroke-dashoffset: 100; opacity: 0 }
  7% { stroke-dashoffset: 100; opacity: 1 }
  10%, 12% { stroke-dashoffset: 0; opacity: 1 }
  15%, 100% { stroke-dashoffset: 0; opacity: 0 }
}
.v-equivalent-expressions-eb { stroke-dasharray: 100; opacity: 0; animation-name: v-equivalent-expressions-eb; }
@keyframes v-equivalent-expressions-eb {
  0%, 13% { stroke-dashoffset: 100; opacity: 0 }
  14% { stroke-dashoffset: 100; opacity: 1 }
  17%, 19% { stroke-dashoffset: 0; opacity: 1 }
  22%, 100% { stroke-dashoffset: 0; opacity: 0 }
}

/* Side labels: lit with their factor (beat 1), then with each tile they multiply into (beat 3) */
.v-equivalent-expressions-tx { animation-name: v-equivalent-expressions-tx; }
@keyframes v-equivalent-expressions-tx {
  0%, 6% { fill: ${C.ink} } 9%, 12% { fill: ${C.primaryText} } 15%, 34.5% { fill: ${C.ink} }
  36.5%, 44% { fill: ${C.primaryText} } 46%, 100% { fill: ${C.ink} }
}
.v-equivalent-expressions-t3 { animation-name: v-equivalent-expressions-t3; }
@keyframes v-equivalent-expressions-t3 {
  0%, 6% { fill: ${C.ink} } 9%, 12% { fill: ${C.primaryText} } 15%, 44.5% { fill: ${C.ink} }
  46.5%, 54% { fill: ${C.primaryText} } 56%, 100% { fill: ${C.ink} }
}
.v-equivalent-expressions-sx { animation-name: v-equivalent-expressions-sx; }
@keyframes v-equivalent-expressions-sx {
  0%, 13% { fill: ${C.ink} } 16%, 19% { fill: ${C.primaryText} } 22%, 34.5% { fill: ${C.ink} }
  36.5%, 39% { fill: ${C.primaryText} } 41%, 44.5% { fill: ${C.ink} }
  46.5%, 49% { fill: ${C.primaryText} } 51%, 100% { fill: ${C.ink} }
}
.v-equivalent-expressions-s2 { animation-name: v-equivalent-expressions-s2; }
@keyframes v-equivalent-expressions-s2 {
  0%, 13% { fill: ${C.ink} } 16%, 19% { fill: ${C.primaryText} } 22%, 39.5% { fill: ${C.ink} }
  41.5%, 44% { fill: ${C.primaryText} } 46%, 49.5% { fill: ${C.ink} }
  51.5%, 54% { fill: ${C.primaryText} } 56%, 100% { fill: ${C.ink} }
}

/* Beat 2: two cuts, then the four tiles move apart */
.v-equivalent-expressions-cut { stroke-dasharray: 100; opacity: 0; animation-name: v-equivalent-expressions-cut; }
@keyframes v-equivalent-expressions-cut {
  0%, 22% { stroke-dashoffset: 100; opacity: 0 }
  23% { stroke-dashoffset: 100; opacity: 1 }
  28%, 29% { stroke-dashoffset: 0; opacity: 1 }
  33%, 100% { stroke-dashoffset: 0; opacity: 0 }
}
.v-equivalent-expressions-whole { opacity: 0; animation-name: v-equivalent-expressions-whole; }
@keyframes v-equivalent-expressions-whole { 0%, 28% { opacity: 1 } 32%, 100% { opacity: 0 } }
.v-equivalent-expressions-m1 { animation-name: v-equivalent-expressions-m1; }
@keyframes v-equivalent-expressions-m1 { 0%, 28% { transform: translate(2px, 2px) } 34%, 100% { transform: none } }
.v-equivalent-expressions-m2 { animation-name: v-equivalent-expressions-m2; }
@keyframes v-equivalent-expressions-m2 { 0%, 28% { transform: translate(2px, -2px) } 34%, 100% { transform: none } }
.v-equivalent-expressions-m3 { animation-name: v-equivalent-expressions-m3; }
@keyframes v-equivalent-expressions-m3 { 0%, 28% { transform: translate(-2px, 2px) } 34%, 100% { transform: none } }
.v-equivalent-expressions-m4 { animation-name: v-equivalent-expressions-m4; }
@keyframes v-equivalent-expressions-m4 { 0%, 28% { transform: translate(-2px, -2px) } 34%, 100% { transform: none } }

/* Beat 3: each tile's area pops in, lit together with its two sides (x² and 6 pulse again when they join the sum) */
.v-equivalent-expressions-l { transform-box: fill-box; transform-origin: center; }
.v-equivalent-expressions-l1 { animation-name: v-equivalent-expressions-l1; }
@keyframes v-equivalent-expressions-l1 {
  0%, 35.5% { opacity: 0; transform: scale(0.4); fill: ${C.primaryText} }
  38.5% { opacity: 1; transform: scale(1.18); fill: ${C.primaryText} }
  40.5% { opacity: 1; transform: none; fill: ${C.primaryText} }
  43%, 57% { opacity: 1; transform: none; fill: ${C.ink} }
  59% { opacity: 1; transform: scale(1.22); fill: ${C.ink} }
  61%, 100% { opacity: 1; transform: none; fill: ${C.ink} }
}
.v-equivalent-expressions-l2 { animation-name: v-equivalent-expressions-l2; }
@keyframes v-equivalent-expressions-l2 {
  0%, 40.5% { opacity: 0; transform: scale(0.4); fill: ${C.primaryText} }
  43.5% { opacity: 1; transform: scale(1.18); fill: ${C.primaryText} }
  45.5% { opacity: 1; transform: none; fill: ${C.primaryText} }
  48%, 62% { opacity: 1; transform: none; fill: ${C.ink} }
  65%, 100% { opacity: 1; transform: none; fill: ${C.primaryText} }
}
.v-equivalent-expressions-l3 { animation-name: v-equivalent-expressions-l3; }
@keyframes v-equivalent-expressions-l3 {
  0%, 45.5% { opacity: 0; transform: scale(0.4); fill: ${C.primaryText} }
  48.5% { opacity: 1; transform: scale(1.18); fill: ${C.primaryText} }
  50.5% { opacity: 1; transform: none; fill: ${C.primaryText} }
  53%, 62% { opacity: 1; transform: none; fill: ${C.ink} }
  65%, 100% { opacity: 1; transform: none; fill: ${C.primaryText} }
}
.v-equivalent-expressions-l4 { animation-name: v-equivalent-expressions-l4; }
@keyframes v-equivalent-expressions-l4 {
  0%, 50.5% { opacity: 0; transform: scale(0.4); fill: ${C.primaryText} }
  53.5% { opacity: 1; transform: scale(1.18); fill: ${C.primaryText} }
  55.5% { opacity: 1; transform: none; fill: ${C.primaryText} }
  58%, 67% { opacity: 1; transform: none; fill: ${C.ink} }
  69% { opacity: 1; transform: scale(1.22); fill: ${C.ink} }
  71%, 100% { opacity: 1; transform: none; fill: ${C.ink} }
}

/* Beat 4: add the tiles up. The like terms 2x and 3x light up and become 5x */
.v-equivalent-expressions-like { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-equivalent-expressions-like; }
@keyframes v-equivalent-expressions-like { 0%, 62% { fill: ${C.fill}; stroke: ${C.line} } 65%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-equivalent-expressions-r1 { animation-name: v-equivalent-expressions-r1; }
@keyframes v-equivalent-expressions-r1 { 0%, 57% { opacity: 0; transform: translateY(6px) } 61%, 100% { opacity: 1; transform: none } }
.v-equivalent-expressions-r2 { animation-name: v-equivalent-expressions-r2; }
@keyframes v-equivalent-expressions-r2 { 0%, 62% { opacity: 0; transform: translateY(6px) } 66%, 100% { opacity: 1; transform: none } }
.v-equivalent-expressions-r3 { animation-name: v-equivalent-expressions-r3; }
@keyframes v-equivalent-expressions-r3 { 0%, 67% { opacity: 0; transform: translateY(6px) } 71%, 100% { opacity: 1; transform: none } }
.v-equivalent-expressions-cap { animation-name: v-equivalent-expressions-cap; }
@keyframes v-equivalent-expressions-cap { 0%, 72% { opacity: 0 } 77%, 100% { opacity: 1 } }
`;

// Tile block: left/top corner of the x² tile. Tiles end up 4 apart.
const X = 45;
const Y = 52;
// The sum is three texts laid out from the same start, each painting only its own term, so the spacing is the font's own.
const sum = { x: 183, y: 111, fontSize: 18, fontWeight: 600, fill: C.ink };

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-equivalent-expressions-a v-equivalent-expressions-scene">
        {/* Side lengths: x + 3 across the top, x + 2 down the left */}
        <g fontSize={14} fontWeight={600} textAnchor="middle" fill={C.ink}>
          <text className="v-equivalent-expressions-a v-equivalent-expressions-tx" x={X + 32.5} y={Y - 9}>
            x
          </text>
          <text className="v-equivalent-expressions-a v-equivalent-expressions-pa" x={X + 67} y={Y - 9} fontSize={12} fill={C.muted}>
            +
          </text>
          <text className="v-equivalent-expressions-a v-equivalent-expressions-t3" x={X + 88.5} y={Y - 9}>
            3
          </text>
          <text className="v-equivalent-expressions-a v-equivalent-expressions-sx" x={X - 14} y={Y + 37}>
            x
          </text>
          <text className="v-equivalent-expressions-a v-equivalent-expressions-pb" x={X - 14} y={Y + 71} fontSize={12} fill={C.muted}>
            +
          </text>
          <text className="v-equivalent-expressions-a v-equivalent-expressions-s2" x={X - 14} y={Y + 87}>
            2
          </text>
        </g>

        {/* The four tiles */}
        <g strokeWidth={1.5} fontWeight={700} textAnchor="middle" stroke="none">
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m1">
            <rect x={X} y={Y} width={65} height={65} rx={6} fill={C.fill} stroke={C.line} />
            <text className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l1" x={X + 32.5} y={Y + 39} fontSize={18} fill={C.ink}>
              x²
            </text>
          </g>
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m2">
            <rect className="v-equivalent-expressions-a v-equivalent-expressions-like" x={X} y={Y + 69} width={65} height={26} rx={6} />
            <text className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l2" x={X + 32.5} y={Y + 87} fontSize={15} fill={C.primaryText}>
              2x
            </text>
          </g>
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m3">
            <rect className="v-equivalent-expressions-a v-equivalent-expressions-like" x={X + 69} y={Y} width={39} height={65} rx={6} />
            <text className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l3" x={X + 88.5} y={Y + 38} fontSize={15} fill={C.primaryText}>
              3x
            </text>
          </g>
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m4">
            <rect x={X + 69} y={Y + 69} width={39} height={26} rx={6} fill={C.fill} stroke={C.line} />
            <text className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l4" x={X + 88.5} y={Y + 87} fontSize={15} fill={C.ink}>
              6
            </text>
          </g>
        </g>

        {/* Before the cut: one whole rectangle, its sides lighting up, then the two cut lines */}
        <rect className="v-equivalent-expressions-a v-equivalent-expressions-whole" x={X + 2} y={Y + 2} width={104} height={91} rx={6} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <g fill="none" stroke={C.primary} strokeWidth={2.5}>
          <line className="v-equivalent-expressions-a v-equivalent-expressions-ea" x1={X + 7} y1={Y + 2} x2={X + 101} y2={Y + 2} pathLength={100} />
          <line className="v-equivalent-expressions-a v-equivalent-expressions-eb" x1={X + 2} y1={Y + 7} x2={X + 2} y2={Y + 88} pathLength={100} />
          <line className="v-equivalent-expressions-a v-equivalent-expressions-cut" x1={X + 67} y1={Y + 2} x2={X + 67} y2={Y + 93} pathLength={100} strokeWidth={2} />
          <line className="v-equivalent-expressions-a v-equivalent-expressions-cut" x1={X + 2} y1={Y + 67} x2={X + 106} y2={Y + 67} pathLength={100} strokeWidth={2} />
        </g>

        {/* Sides multiplied … */}
        <text x={183} y={81} fontSize={18} fontWeight={600} fill={C.ink}>
          <tspan className="v-equivalent-expressions-a v-equivalent-expressions-fa">(x + 3)</tspan>
          <tspan className="v-equivalent-expressions-a v-equivalent-expressions-fb">(x + 2)</tspan>
        </text>

        {/* … = tiles added: x², then 2x + 3x = 5x, then 6 */}
        <text className="v-equivalent-expressions-a v-equivalent-expressions-r1" {...sum}>
          = x²<tspan fill="none"> + 5x + 6</tspan>
        </text>
        <text className="v-equivalent-expressions-a v-equivalent-expressions-r2" {...sum}>
          <tspan fill="none">= x² </tspan>+ <tspan fill={C.primaryText}>5x</tspan>
          <tspan fill="none"> + 6</tspan>
        </text>
        <text className="v-equivalent-expressions-a v-equivalent-expressions-r3" {...sum}>
          <tspan fill="none">= x² + 5x </tspan>+ 6
        </text>
        <text className="v-equivalent-expressions-a v-equivalent-expressions-cap" x={183} y={133} fontSize={11.5} fill={C.muted}>
          same area, new form
        </text>
      </g>
    </Svg>
  );
}
