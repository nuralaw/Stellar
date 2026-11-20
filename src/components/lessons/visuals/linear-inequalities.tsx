import { C, Css, Svg } from "./kit";

// Linear inequalities: divide by a negative and the sign flips; the answer is a whole range on the number line.
export const alt = "−2x > 8 is divided by −2: the > sign flips over into <, giving x < −4, drawn on a number line as an open dot at −4 with a ray going left.";

const css = `
.v-linear-inequalities-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-linear-inequalities-scene { animation-name: v-linear-inequalities-scene; }
@keyframes v-linear-inequalities-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the −2 we divide by lights up and the "÷ (−2)" step appears */
.v-linear-inequalities-coef { animation-name: v-linear-inequalities-coef; }
@keyframes v-linear-inequalities-coef { 0%, 7% { fill: ${C.ink} } 10%, 24% { fill: ${C.primaryText} } 30%, 100% { fill: ${C.ink} } }
.v-linear-inequalities-chip { transform-box: fill-box; transform-origin: center; animation-name: v-linear-inequalities-chip; }
@keyframes v-linear-inequalities-chip { 0%, 8% { opacity: 0; transform: scale(0.7) } 14%, 100% { opacity: 1; transform: scale(1) } }
.v-linear-inequalities-arrow { stroke-dasharray: 100; animation-name: v-linear-inequalities-arrow; }
@keyframes v-linear-inequalities-arrow { 0%, 11% { stroke-dashoffset: 100; opacity: 0 } 12% { opacity: 1 } 20%, 100% { stroke-dashoffset: 0; opacity: 1 } }
.v-linear-inequalities-head { animation-name: v-linear-inequalities-head; }
@keyframes v-linear-inequalities-head { 0%, 18% { opacity: 0 } 21%, 100% { opacity: 1 } }

/* Beat 2: the sign lifts out of −2x > 8, arcs over the step and lands flipped (half a turn).
   It rises before it travels, so it never crosses the 8. Its old place refills afterwards. */
.v-linear-inequalities-old { animation-name: v-linear-inequalities-old; }
@keyframes v-linear-inequalities-old { 0%, 40% { opacity: 0 } 47%, 100% { opacity: 1 } }
.v-linear-inequalities-hopx { animation-name: v-linear-inequalities-hopx; }
@keyframes v-linear-inequalities-hopx {
  0%, 24% { transform: translateX(-170px); animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1) }
  40%, 100% { transform: translateX(0px) }
}
.v-linear-inequalities-hopy { animation-name: v-linear-inequalities-hopy; }
@keyframes v-linear-inequalities-hopy { 0%, 22% { transform: translateY(0px) } 32% { transform: translateY(-30px) } 42%, 100% { transform: translateY(0px) } }
.v-linear-inequalities-spin { transform-box: fill-box; transform-origin: center; animation-name: v-linear-inequalities-spin; }
@keyframes v-linear-inequalities-spin {
  0%, 24% { transform: rotate(-180deg); stroke: ${C.ink}; animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1) }
  32% { stroke: ${C.ink} }
  40%, 100% { transform: rotate(0deg); stroke: ${C.primary} }
}
.v-linear-inequalities-cap { animation-name: v-linear-inequalities-cap; }
@keyframes v-linear-inequalities-cap { 0%, 28% { opacity: 0 } 36%, 100% { opacity: 1 } }
.v-linear-inequalities-res { animation-name: v-linear-inequalities-res; }
@keyframes v-linear-inequalities-res { 0%, 38% { opacity: 0 } 45%, 100% { opacity: 1 } }

/* Beat 3: the answer on the number line: open dot at −4, everything to its left */
.v-linear-inequalities-dot { transform-box: fill-box; transform-origin: center; animation-name: v-linear-inequalities-dot; }
@keyframes v-linear-inequalities-dot { 0%, 50% { transform: scale(0) } 54% { transform: scale(1.5) } 58%, 100% { transform: scale(1) } }
.v-linear-inequalities-at { fill: ${C.ink}; animation-name: v-linear-inequalities-at; }
@keyframes v-linear-inequalities-at { 0%, 50% { fill: ${C.muted} } 56%, 100% { fill: ${C.ink} } }
.v-linear-inequalities-band { transform-box: fill-box; transform-origin: 100% 50%; animation-name: v-linear-inequalities-band; }
@keyframes v-linear-inequalities-band { 0%, 56% { transform: scaleX(0) } 72%, 100% { transform: scaleX(1) } }
.v-linear-inequalities-ray { stroke-dasharray: 100; animation-name: v-linear-inequalities-ray; }
@keyframes v-linear-inequalities-ray { 0%, 56% { stroke-dashoffset: 100; opacity: 0 } 57% { opacity: 1 } 72%, 100% { stroke-dashoffset: 0; opacity: 1 } }
.v-linear-inequalities-tip { animation-name: v-linear-inequalities-tip; }
@keyframes v-linear-inequalities-tip { 0%, 56% { transform: translateX(124px); opacity: 0 } 57% { opacity: 1 } 72%, 100% { transform: translateX(0px); opacity: 1 } }
`;

// Top row: the math axis (the middle of the signs) and the text baseline.
const AX = 48;
const BL = 56;
// Number line: 24 units per 1, so −4 sits at x = 160.
const NY = 120;
const nx = (v: number) => 160 + (v + 4) * 24;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-linear-inequalities-a v-linear-inequalities-scene">
        {/* −2x > 8 */}
        <text x={69} y={BL} textAnchor="end" fontSize={22} fontWeight={700} fill={C.ink}>
          <tspan className="v-linear-inequalities-a v-linear-inequalities-coef">−2</tspan>x
        </text>
        <polyline className="v-linear-inequalities-a v-linear-inequalities-old" points={`77.5,${AX - 6.5} 88.5,${AX} 77.5,${AX + 6.5}`} fill="none" stroke={C.ink} strokeWidth={2.6} />
        <text x={97} y={BL} fontSize={22} fontWeight={700} fill={C.ink}>
          8
        </text>

        {/* The step: divide both sides by −2 */}
        <line className="v-linear-inequalities-a v-linear-inequalities-arrow" x1={119} y1={AX} x2={217} y2={AX} pathLength={100} stroke={C.muted} strokeWidth={1.5} />
        <polyline className="v-linear-inequalities-a v-linear-inequalities-head" points={`212,${AX - 4.5} 217.5,${AX} 212,${AX + 4.5}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g className="v-linear-inequalities-a v-linear-inequalities-chip">
          <rect x={136} y={AX - 12} width={64} height={24} rx={12} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={168} y={AX + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            ÷ (−2)
          </text>
        </g>
        <text className="v-linear-inequalities-a v-linear-inequalities-cap" x={168} y={AX + 30} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.primaryText}>
          negative → flip
        </text>

        {/* x < −4: the sign arrives from the left expression, flipped */}
        <text className="v-linear-inequalities-a v-linear-inequalities-res" x={239} y={BL} textAnchor="end" fontSize={22} fontWeight={700} fill={C.ink}>
          x
        </text>
        <text className="v-linear-inequalities-a v-linear-inequalities-res" x={267} y={BL} fontSize={22} fontWeight={700} fill={C.ink}>
          −4
        </text>
        <g className="v-linear-inequalities-a v-linear-inequalities-hopx">
          <g className="v-linear-inequalities-a v-linear-inequalities-hopy">
            <polyline className="v-linear-inequalities-a v-linear-inequalities-spin" points={`258.5,${AX - 6.5} 247.5,${AX} 258.5,${AX + 6.5}`} fill="none" stroke={C.primary} strokeWidth={2.6} />
          </g>
        </g>

        {/* Number line */}
        <rect className="v-linear-inequalities-a v-linear-inequalities-band" x={22} y={NY - 9} width={138} height={18} rx={9} fill={C.soft} />
        <line x1={24} y1={NY} x2={296} y2={NY} stroke={C.muted} strokeWidth={1.5} />
        {[-8, -6, -4, -2, 0].map((v) => (
          <line key={v} x1={nx(v)} y1={NY - 5} x2={nx(v)} y2={NY + 5} stroke={C.muted} strokeWidth={1.5} />
        ))}
        {[-8, -6, -2, 0].map((v) => (
          <text key={v} x={nx(v)} y={NY + 24} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.muted}>
            {String(v).replace("-", "−")}
          </text>
        ))}
        <text className="v-linear-inequalities-a v-linear-inequalities-at" x={nx(-4)} y={NY + 24} textAnchor="middle" fontSize={12} fontWeight={700}>
          −4
        </text>

        {/* The solutions: everything left of −4; −4 itself is out (open dot) */}
        <line className="v-linear-inequalities-a v-linear-inequalities-ray" x1={nx(-4)} y1={NY} x2={36} y2={NY} pathLength={100} stroke={C.primary} strokeWidth={4} />
        <g className="v-linear-inequalities-a v-linear-inequalities-tip">
          <polygon points={`26,${NY} 38,${NY - 6.5} 38,${NY + 6.5}`} fill={C.primary} stroke={C.primary} strokeWidth={1} />
        </g>
        <circle className="v-linear-inequalities-a v-linear-inequalities-dot" cx={nx(-4)} cy={NY} r={5.5} fill={C.bg} stroke={C.primary} strokeWidth={2.5} />
      </g>
    </Svg>
  );
}
