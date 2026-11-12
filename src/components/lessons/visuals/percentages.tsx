import { C, Css, Svg } from "./kit";

// Percentages: a $50 bar is 100%. It grows by one 20% step to 120%, so the new price is 50 × 1.2 = 60.
export const alt = "A $50 bar marked 100% grows by a 20% step to 120%, so the price is multiplied by 1.2: $50 × 1.2 = $60.";

const css = `
.v-percentages-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-percentages-scene { animation-name: v-percentages-scene; }
@keyframes v-percentages-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* The bar sits in the middle, then moves up to make room for the calculation. */
.v-percentages-top { animation-name: v-percentages-top; }
@keyframes v-percentages-top { 0%, 54% { transform: translateY(20px) } 62%, 100% { transform: none } }

/* Set up: the old price fills the bar. That is 100%. */
.v-percentages-old { transform-box: fill-box; transform-origin: left center; animation-name: v-percentages-old; }
@keyframes v-percentages-old { 0%, 1% { transform: scaleX(0) } 8%, 100% { transform: none } }
.v-percentages-tag { animation-name: v-percentages-tag; }
@keyframes v-percentages-tag { 0%, 5% { opacity: 0 } 9%, 100% { opacity: 1 } }

/* The key move: one more 20% step grows out of the end. */
.v-percentages-new { transform-box: fill-box; transform-origin: left center; animation-name: v-percentages-new; }
@keyframes v-percentages-new { 0%, 17% { transform: scaleX(0) } 29%, 100% { transform: none } }
.v-percentages-p20 { animation-name: v-percentages-p20; }
@keyframes v-percentages-p20 { 0%, 25% { opacity: 0; transform: translateY(5px) } 31%, 100% { opacity: 1; transform: none } }

/* Together: 120% */
.v-percentages-span { stroke-dasharray: 100; animation-name: v-percentages-span; }
@keyframes v-percentages-span {
  0%, 36% { stroke-dashoffset: 100; opacity: 0 }
  37% { stroke-dashoffset: 100; opacity: 1 }
  47%, 100% { stroke-dashoffset: 0; opacity: 1 }
}
.v-percentages-p120 { animation-name: v-percentages-p120; }
@keyframes v-percentages-p120 { 0%, 45% { opacity: 0 } 51%, 100% { opacity: 1 } }

/* The calculation: the price drops in, 120% drops in as the multiplier, the answer locks in. */
.v-percentages-price { animation-name: v-percentages-price; }
@keyframes v-percentages-price { 0%, 56% { opacity: 0; transform: translateY(-12px) } 63%, 100% { opacity: 1; transform: none } }
.v-percentages-mult { animation-name: v-percentages-mult; }
@keyframes v-percentages-mult { 0%, 60% { opacity: 0; transform: translate(8px, -16px) } 67%, 100% { opacity: 1; transform: none } }
.v-percentages-res { transform-box: fill-box; transform-origin: center; animation-name: v-percentages-res; }
@keyframes v-percentages-res {
  0%, 69% { opacity: 0; transform: scale(0.8) }
  72.5% { opacity: 1; transform: scale(1.08) }
  75%, 100% { opacity: 1; transform: none }
}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-percentages-a v-percentages-scene">
        <g className="v-percentages-a v-percentages-top">
          {/* The old price: five 20% steps = 100% */}
          <g className="v-percentages-a v-percentages-old" stroke={C.muted} strokeOpacity={0.45} strokeWidth={1.5}>
            <rect x={40} y={44} width={200} height={32} rx={7} fill={C.fill} />
            {[80, 120, 160, 200].map((x) => (
              <path key={x} d={`M${x} 44 v7 M${x} 69 v7`} />
            ))}
          </g>
          <g className="v-percentages-a v-percentages-tag">
            <text x={140} y={35} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted}>
              100%
            </text>
            <text x={140} y={65.5} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
              $50
            </text>
          </g>

          {/* One more step: +20% */}
          <rect className="v-percentages-a v-percentages-new" x={240} y={44} width={40} height={32} rx={7} fill={C.primary} />
          <text className="v-percentages-a v-percentages-p20" x={260} y={35} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary}>
            +20%
          </text>

          {/* The whole bar is now 120% */}
          <path className="v-percentages-a v-percentages-span" d="M40 84 V90 H280 V84" pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text className="v-percentages-a v-percentages-p120" x={160} y={107} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            120%
          </text>
        </g>

        {/* The calculation: $50 × 1.2 = $60 */}
        <text className="v-percentages-a v-percentages-price" x={87} y={148} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.ink}>
          $50
        </text>
        <g className="v-percentages-a v-percentages-mult">
          <rect x={119} y={126} width={66} height={30} rx={15} fill={C.soft} />
          <text x={152} y={148} textAnchor="middle" fontSize={21} fontWeight={700} fill={C.primary}>
            × 1.2
          </text>
        </g>
        <g className="v-percentages-a v-percentages-res">
          <text x={226} y={148} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.ink}>
            = <tspan fill={C.good}>$60</tspan>
          </text>
        </g>
      </g>
    </Svg>
  );
}
