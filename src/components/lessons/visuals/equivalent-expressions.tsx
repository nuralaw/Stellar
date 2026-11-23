import { C, Css, Svg, Tex } from "./kit";

// Equivalent expressions: a rectangle with sides (x + 3) and (x + 2) is cut into four tiles.
// Sides multiplied = tiles added, so (x + 3)(x + 2) = x² + 5x + 6. Unit = 13: x is drawn as 65, 3 as 39, 2 as 26.
export const alt = "A rectangle with sides x + 3 and x + 2 is cut into four tiles: x², 2x, 3x and 6. Added up, (x + 3)(x + 2) = x² + 5x + 6.";

const P = "v-equivalent-expressions-";
const cls = (n: string) => `${P}a ${P}${n}`;
/** A formula in two layers (ink and accent) that cross-fade, because a typeset formula cannot animate its fill.
 *  `wins` are the loop ranges (%) where the accent shows; it stays on at the end if the last range reaches 100. */
const lit = (n: string, wins: [number, number][]) => {
  const pts: [number, number][] = [[0, 0]];
  for (const [s, e] of wins) pts.push([s, 0], [s + 2, 1], [e, 1], ...(e >= 100 ? [] : [[e + 2, 0] as [number, number]]));
  const last = wins[wins.length - 1][1] >= 100;
  const h = last ? 1 : 0;
  const frames = (inv: boolean) => pts.map(([p, v]) => `${p}% { opacity: ${inv ? 1 - v : v} }`).join(" ");
  const [hc, cc] = [`${P}${n}h`, `${P}${n}c`];
  return `.${hc} { opacity: ${h}; animation-name: ${hc}; } @keyframes ${hc} { ${frames(false)} }
.${cc} { opacity: ${1 - h}; animation-name: ${cc}; } @keyframes ${cc} { ${frames(true)} }`;
};

// Beats (% of 10 s): 0–5 in · 6–22 each factor is a side · 22–34 cut · 35–56 each tile = its two sides multiplied ·
// 57–77 add the tiles, 2x + 3x = 5x · hold · 92–100 out
const css = `
.v-equivalent-expressions-a { animation: 10s ease-in-out infinite; }

.v-equivalent-expressions-scene { animation-name: v-equivalent-expressions-scene; }
@keyframes v-equivalent-expressions-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: each factor lights up with its side (the formula layers cross-fade) */
${lit("fa", [[8, 13]])}
${lit("fb", [[15, 20]])}
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
  0%, 35.5% { opacity: 0; transform: scale(0.4) }
  38.5% { opacity: 1; transform: scale(1.18) }
  40.5%, 57% { opacity: 1; transform: none }
  59% { opacity: 1; transform: scale(1.22) }
  61%, 100% { opacity: 1; transform: none }
}
.v-equivalent-expressions-l2 { animation-name: v-equivalent-expressions-l2; }
@keyframes v-equivalent-expressions-l2 {
  0%, 40.5% { opacity: 0; transform: scale(0.4) }
  43.5% { opacity: 1; transform: scale(1.18) }
  45.5%, 100% { opacity: 1; transform: none }
}
.v-equivalent-expressions-l3 { animation-name: v-equivalent-expressions-l3; }
@keyframes v-equivalent-expressions-l3 {
  0%, 45.5% { opacity: 0; transform: scale(0.4) }
  48.5% { opacity: 1; transform: scale(1.18) }
  50.5%, 100% { opacity: 1; transform: none }
}
.v-equivalent-expressions-l4 { animation-name: v-equivalent-expressions-l4; }
@keyframes v-equivalent-expressions-l4 {
  0%, 50.5% { opacity: 0; transform: scale(0.4) }
  53.5% { opacity: 1; transform: scale(1.18) }
  55.5%, 67% { opacity: 1; transform: none }
  69% { opacity: 1; transform: scale(1.22) }
  71%, 100% { opacity: 1; transform: none }
}
${lit("g1", [[36, 41]])}
${lit("g2", [[41, 46], [64, 100]])}
${lit("g3", [[46, 51], [64, 100]])}
${lit("g4", [[51, 56]])}

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
const SUM = { x: 176, y: 105, size: 18, width: 130 } as const;

/** A formula in an ink layer and an accent layer (see `lit`). */
function Lit({ n, x, y, size, width, anchor = "middle", children }: { n: string; x: number; y: number; size: number; width: number; anchor?: "start" | "middle" | "end"; children: string }) {
  return (
    <>
      <g className={cls(`${n}c`)}>
        <Tex x={x} y={y} size={size} width={width} anchor={anchor}>
          {children}
        </Tex>
      </g>
      <g className={cls(`${n}h`)}>
        <Tex x={x} y={y} size={size} width={width} anchor={anchor} color={C.primaryText}>
          {children}
        </Tex>
      </g>
    </>
  );
}

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
            <g className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l1">
              <Lit n="g1" x={X + 32.5} y={Y + 33} size={20} width={44}>{String.raw`x^2`}</Lit>
            </g>
          </g>
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m2">
            <rect className="v-equivalent-expressions-a v-equivalent-expressions-like" x={X} y={Y + 69} width={65} height={26} rx={6} />
            <g className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l2">
              <Lit n="g2" x={X + 32.5} y={Y + 82} size={17} width={36}>{String.raw`2x`}</Lit>
            </g>
          </g>
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m3">
            <rect className="v-equivalent-expressions-a v-equivalent-expressions-like" x={X + 69} y={Y} width={39} height={65} rx={6} />
            <g className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l3">
              <Lit n="g3" x={X + 88.5} y={Y + 33} size={17} width={36}>{String.raw`3x`}</Lit>
            </g>
          </g>
          <g className="v-equivalent-expressions-a v-equivalent-expressions-m4">
            <rect x={X + 69} y={Y + 69} width={39} height={26} rx={6} fill={C.fill} stroke={C.line} />
            <g className="v-equivalent-expressions-a v-equivalent-expressions-l v-equivalent-expressions-l4">
              <Lit n="g4" x={X + 88.5} y={Y + 82} size={17} width={30}>{String.raw`6`}</Lit>
            </g>
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

        {/* Sides multiplied … : two formula halves meeting at one seam, so the accent keeps its place whatever the font */}
        <Lit n="fa" x={230} y={75} size={18} width={80} anchor="end">{String.raw`(x+3)`}</Lit>
        <Lit n="fb" x={231} y={75} size={18} width={80} anchor="start">{String.raw`(x+2)`}</Lit>

        {/* … = tiles added: x², then 2x + 3x = 5x, then 6. Phantoms keep every layer in the same place. */}
        <g className="v-equivalent-expressions-a v-equivalent-expressions-r1">
          <Tex x={SUM.x} y={SUM.y} size={SUM.size} width={SUM.width} anchor="start">{String.raw`=x^2`}</Tex>
        </g>
        <g className="v-equivalent-expressions-a v-equivalent-expressions-r2">
          <Tex x={SUM.x} y={SUM.y} size={SUM.size} width={SUM.width} anchor="start">{String.raw`\phantom{=x^2}+`}</Tex>
          <Tex x={SUM.x} y={SUM.y} size={SUM.size} width={SUM.width} anchor="start" color={C.primaryText}>{String.raw`\phantom{=x^2+}5x`}</Tex>
        </g>
        <g className="v-equivalent-expressions-a v-equivalent-expressions-r3">
          <Tex x={SUM.x} y={SUM.y} size={SUM.size} width={SUM.width} anchor="start">{String.raw`\phantom{=x^2+5x}+6`}</Tex>
        </g>
        <text className="v-equivalent-expressions-a v-equivalent-expressions-cap" x={176} y={133} fontSize={11.5} fill={C.muted}>
          same area, new form
        </text>
      </g>
    </Svg>
  );
}
