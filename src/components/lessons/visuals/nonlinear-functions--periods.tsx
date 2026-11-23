import { C, Css, Svg, Tex } from "./kit";

// Over several periods the multipliers multiply: two +20% steps make 1.2² = 1.44 (+44%), not +40%. In
// f(x) = 50(1.5)^(x/4) one period is 4 units (× 1.5), two periods are × 2.25. Backwards: (1.84)^(x/4) has one-unit
// factor 1.84^(1/4) ≈ 1.165, not 84 ÷ 4 = 21% (1.21⁴ ≈ 2.14).
export const alt =
  "Two 20% increases multiply: 100, 120, 144 is +44%, not +40%. In 50(1.5)^(x/4) each 4-unit period multiplies by 1.5, so 8 units give 2.25. For 1.84^(x/4) each unit multiplies by about 1.165, not 1.21.";

const P = "v-nonlinear-functions--periods-";
const fc = (t: number) => `${P}f${t}`;
const wc = (t: number) => `${P}w${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
// Visible only between t and u (the still frame hides it: its element carries opacity={0}).
const win = (t: number, u: number) => {
  const n = wc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 4}%, ${u}% { opacity: 1 } ${u + 4}%, 100% { opacity: 0 } }`;
};
const css = `
.v-nonlinear-functions--periods-a { animation: 12s ease-in-out infinite; }
${[4, 8, 13, 18, 23, 28, 31, 41, 46, 51, 56, 62, 66, 70, 71, 72, 73].map(fade).join("\n")}
${win(3, 34)}
${win(76, 88)}
`;
const a = `${P}a`;
const lab = { stroke: "none" } as const;

// Part 1: bars 100, 120, 144 at 0.75 px per unit, baseline 140. The slices (20 and 24) are drawn to scale.
const BASE = 140;
const S = 0.75;
// Part 2 top: x (0 to 8) -> 40 + 32 x, axis y = 54. Part 2 bottom: x (0 to 4) -> 40 + 64 x, axis y = 126.
const tx = (x: number) => 40 + 32 * x;
const bx = (x: number) => 40 + 64 * x;
const arrow = (x1: number, x2: number, y: number) => `M${x1} ${y} H${x2} M${x2 - 6} ${y - 4} L${x2} ${y} L${x2 - 6} ${y + 4}`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Part 1: add the percents? No: multiply */}
      <g className={`${a} ${wc(3)}`} opacity={0}>
        <line x1={20} y1={BASE} x2={182} y2={BASE} stroke={C.muted} strokeWidth={1.5} />
        <g className={`${a} ${fc(4)}`}>
          <rect x={28} y={BASE - 100 * S} width={30} height={100 * S} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <text x={43} y={156} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>100</text>
        </g>
        <g className={`${a} ${fc(8)}`}>
          <rect x={84} y={BASE - 100 * S} width={30} height={100 * S} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <rect x={84} y={BASE - 120 * S} width={30} height={20 * S} rx={2} fill={C.primary} />
          <text x={99} y={BASE - 120 * S + 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary} {...lab}>+20</text>
          <text x={99} y={BASE - 120 * S - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>+20%</text>
          <text x={99} y={156} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>120</text>
        </g>
        <g className={`${a} ${fc(13)}`}>
          <rect x={140} y={BASE - 120 * S} width={30} height={120 * S} rx={2} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <rect x={140} y={BASE - 144 * S} width={30} height={24 * S} rx={2} fill={C.primary} />
          <text x={155} y={BASE - 144 * S + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary} {...lab}>+24</text>
          <text x={155} y={BASE - 144 * S - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>+20%</text>
          <text x={155} y={156} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>144</text>
        </g>
        {/* The wrong answer: 140 */}
        <g className={`${a} ${fc(18)}`}>
          <line x1={132} y1={BASE - 140 * S} x2={178} y2={BASE - 140 * S} stroke={C.bad} strokeWidth={2} strokeDasharray="4 3" />
          <text x={196} y={104} fontSize={12} fontWeight={600} fill={C.bad} {...lab}>20% + 20% = 40%</text>
          <line x1={194} y1={100} x2={296} y2={100} stroke={C.bad} strokeWidth={2} />
        </g>
        <g className={`${a} ${fc(23)}`}>
          <Tex x={196} y={34} size={15} anchor="start" width={116} color={C.primaryText}>{String.raw`1.2\times1.2=1.2^2`}</Tex>
          <Tex x={196} y={62} size={15} anchor="start" width={116} color={C.primaryText}>{String.raw`=1.44`}</Tex>
        </g>
        <text className={`${a} ${fc(28)}`} x={196} y={130} fontSize={24} fontWeight={700} fill={C.primaryText} {...lab}>+44%</text>
        <text className={`${a} ${fc(31)}`} x={196} y={156} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>multiply, don’t add</text>
      </g>

      {/* Part 2, top: f(x) = 50(1.5)^(x/4): each period of 4 units is × 1.5 */}
      <g className={`${a} ${fc(41)}`}>
        <Tex x={16} y={19} size={13} anchor="start" width={150} color={C.ink}>{String.raw`f(x)=50(1.5)^{x/4}`}</Tex>
        <line x1={tx(-0.5)} y1={57} x2={tx(8.5)} y2={57} stroke={C.muted} strokeWidth={1.5} />
        {[0, 4, 8].map((x) => (
          <g key={x}>
            <line x1={tx(x)} y1={52} x2={tx(x)} y2={62} stroke={C.muted} strokeWidth={2} />
            <text x={tx(x)} y={75} textAnchor="middle" fontSize={11} fill={C.muted} {...lab}>{x}</text>
          </g>
        ))}
      </g>
      {[0, 1].map((i) => (
        <g key={i} className={`${a} ${fc(i === 0 ? 46 : 51)}`}>
          <path d={arrow(tx(4 * i) + 6, tx(4 * i + 4) - 6, 47)} fill="none" stroke={C.primary} strokeWidth={2} />
          <text x={(tx(4 * i) + tx(4 * i + 4)) / 2} y={39} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>× 1.5</text>
        </g>
      ))}
      <text className={`${a} ${fc(56)}`} x={304} y={24} textAnchor="end" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>
        2 periods: × 2.25
      </text>

      {/* Part 2, bottom: (1.84)^(x/4): one period is × 1.84, one unit is the 4th root */}
      <g className={`${a} ${fc(62)}`}>
        <Tex x={16} y={90} size={13} anchor="start" width={110} color={C.ink}>{String.raw`(1.84)^{x/4}`}</Tex>
        <line x1={bx(-0.15)} y1={126} x2={bx(4.15)} y2={126} stroke={C.muted} strokeWidth={1.5} />
        {[0, 1, 2, 3, 4].map((x) => (
          <line key={x} x1={bx(x)} y1={121} x2={bx(x)} y2={131} stroke={C.muted} strokeWidth={2} />
        ))}
        <path d={`M${bx(0)} 112 V104 H${bx(4)} V112`} fill="none" stroke={C.ink} strokeWidth={1.5} />
        <rect x={bx(2) - 28} y={96} width={56} height={16} fill={C.bg} stroke="none" />
        <text x={bx(2)} y={109} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>× 1.84</text>
      </g>
      <g className={`${a} ${fc(66)}`}>
        <Tex x={304} y={90} size={13} anchor="end" width={150} color={C.primaryText}>{String.raw`1.84^{1/4}\approx1.165`}</Tex>
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={`${a} ${fc(70 + i * 1)}`}>
          <path d={arrow(bx(i) + 6, bx(i + 1) - 6, 138)} fill="none" stroke={C.primary} strokeWidth={2} />
          <text x={(bx(i) + bx(i + 1)) / 2} y={154} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>× 1.165</text>
        </g>
      ))}

      {/* The trap: four steps of +21% */}
      <g className={`${a} ${wc(76)}`} opacity={0}>
        <rect x={14} y={157} width={292} height={16} rx={8} fill={C.badSoft} stroke="none" />
        {[0, 1, 2, 3].map((i) => (
          <text key={i} x={38 + 38 * i} y={169} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bad} {...lab}>+21%</text>
        ))}
        <Tex x={186} y={165} size={12} anchor="start" width={116} color={C.bad}>{String.raw`1.21^4\approx2.14\ \times`}</Tex>
      </g>
    </Svg>
  );
}
