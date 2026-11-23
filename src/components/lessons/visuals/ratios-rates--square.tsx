import { C, Css, Svg, Tex } from "./kit";

// Trap: square and cubic units. 1 yd = 3 ft, but 1 yd² = 3 × 3 = 9 ft² and 1 yd³ = 3 × 3 × 3 = 27 ft³.
export const alt = "A square yard as a 3 by 3 grid of square feet: 9 ft². Three stacked layers of 9 make a cubic yard: 27 ft³. So 1 yd is 3 ft, but 1 yd² is 9 ft² and 1 yd³ is 27 ft³.";

const P = "v-ratios-rates--square-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("top", 2)}
${at("side", 6)}
${at("r1", 12)}
${at("r2", 20)}
${at("r3", 28)}
${at("l1", 38)}
${at("k1", 46)}
${at("k2", 54)}
${at("k3", 62)}
${at("l2", 72)}
`;

// 1 yd² as a 3 × 3 grid of 1 ft² (cell 22)
const GX = 38;
const GY = 54;
const CELL = 22;
// 1 yd³: three 3 × 3 layers of 1 ft² (cell 15), each layer shifted up and right
const LX = 182;
const LY = 78;
const LC = 15;
const layer = (i: number) => ({ x: LX + i * 11, y: LY - i * 11 });

const Grid = ({ x, y, c, fill }: { x: number; y: number; c: number; fill: string }) => (
  <g>
    <rect x={x} y={y} width={c * 3} height={c * 3} fill={fill} stroke={C.muted} strokeWidth={1.5} />
    <path d={`M${x + c} ${y} v${c * 3} M${x + 2 * c} ${y} v${c * 3} M${x} ${y + c} h${c * 3} M${x} ${y + 2 * c} h${c * 3}`} stroke={C.muted} strokeWidth={1} fill="none" />
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("top")}>
        <Tex x={160} y={24} size={15} width={120}>{String.raw`1\ \text{yd}=3\ \text{ft}`}</Tex>
      </g>

      {/* Side labels: 1 yd across the top, 3 ft down the side */}
      <g className={cls("side")} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
        <path d={`M${GX} ${GY - 8} H${GX + 3 * CELL} M${GX} ${GY - 12} V${GY - 4} M${GX + 3 * CELL} ${GY - 12} V${GY - 4}`} stroke={C.ink} strokeWidth={1.5} fill="none" />
        <text x={GX + 33} y={GY - 14}>
          1 yd
        </text>
        <path d={`M${GX - 8} ${GY} V${GY + 3 * CELL} M${GX - 12} ${GY} H${GX - 4} M${GX - 12} ${GY + 3 * CELL} H${GX - 4}`} stroke={C.ink} strokeWidth={1.5} fill="none" />
        <text transform={`translate(${GX - 17} ${GY + 33}) rotate(-90)`}>3 ft</text>
      </g>

      {/* Square yard: rows of 3 square feet */}
      <g>
        {[0, 1, 2].map((r) => (
          <g key={r} className={cls("r" + (r + 1))}>
            <rect x={GX} y={GY + r * CELL} width={CELL * 3} height={CELL} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
            <path d={`M${GX + CELL} ${GY + r * CELL} v${CELL} M${GX + 2 * CELL} ${GY + r * CELL} v${CELL}`} stroke={C.primary} strokeWidth={1} fill="none" />
          </g>
        ))}
      </g>
      <g className={cls("l1")}>
        <Tex x={GX + 33} y={GY + 3 * CELL + 20} size={12} width={130} color={C.primaryText}>{String.raw`1\ \text{yd}^2=3\times3=9\ \text{ft}^2`}</Tex>
      </g>

      {/* Cubic yard: 3 layers of 9 */}
      <g>
        <g className={cls("k3")}>
          <Grid x={layer(2).x} y={layer(2).y} c={LC} fill={C.fill} />
        </g>
        <g className={cls("k2")}>
          <Grid x={layer(1).x} y={layer(1).y} c={LC} fill={C.fill} />
        </g>
        <g className={cls("k1")}>
          <Grid x={layer(0).x} y={layer(0).y} c={LC} fill={C.soft} />
        </g>
      </g>
      <g className={cls("l2")}>
        <Tex x={LX + 38} y={GY + 3 * CELL + 20} size={12} width={150} color={C.primaryText}>{String.raw`1\ \text{yd}^3=3\times3\times3=27\ \text{ft}^3`}</Tex>
      </g>
    </Svg>
  );
}
