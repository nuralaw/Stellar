import { C, Css, Svg, Tex } from "./kit";

// Parts: a ratio 2 to 7 is 2 parts and 7 parts of the same size k. 9 parts = 36 L, so k = 4 and white = 7k = 28 L.
export const alt = "A bar of 9 equal blocks holds 36 liters. Two blocks are blue (2k) and seven are white (7k). 9k = 36 gives k = 4 liters per block, so the white paint is 7 × 4 = 28 liters.";

const P = "v-ratios-rates--parts-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 11s ease-in-out infinite; }
${at("top", 2)}
${at("blank", 4)}
${at("blue", 14)}
${at("white", 20)}
${at("ratio", 12)}
${at("lab", 26)}
${at("eq", 38)}
${at("k", 52)}
${at("ring", 52)}
${at("num", 54)}
${at("ans", 68)}
${at("note", 80)}
.${n("glow")} { animation-name: ${n("glow")}; }
@keyframes ${n("glow")} {
  0%, 68% { opacity: 0 }
  72%, 80% { opacity: 1 }
  84% { opacity: 0.35 }
  88%, 92% { opacity: 1 }
  97%, 100% { opacity: 0 }
}
`;

const X0 = 34;
const BW = 28;
const BY = 44;
const BH = 28;
const blocks = Array.from({ length: 9 }, (_, i) => i);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Total: 36 L over the whole bar, and the ratio */}
      <g className={cls("top")}>
        <path d={`M${X0} ${BY - 6} V${BY - 10} H${X0 + 9 * BW} V${BY - 6}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={X0 + 4.5 * BW} y={BY - 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          36 L
        </text>
      </g>
      <text className={cls("ratio")} x={X0} y={BY - 16} fontSize={13} fontWeight={600} fill={C.primaryText}>
        2 to 7
      </text>

      {/* Nine equal blocks */}
      <g className={cls("blank")}>
        {blocks.map((i) => (
          <rect key={i} x={X0 + i * BW} y={BY} width={BW} height={BH} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        ))}
      </g>
      <g className={cls("blue")}>
        {blocks.slice(0, 2).map((i) => (
          <rect key={i} x={X0 + i * BW} y={BY} width={BW} height={BH} fill={C.primary} stroke={C.ink} strokeWidth={1.5} />
        ))}
      </g>
      <g className={cls("white")}>
        {blocks.slice(2).map((i) => (
          <rect key={i} x={X0 + i * BW} y={BY} width={BW} height={BH} fill={C.bg} stroke={C.ink} strokeWidth={1.5} />
        ))}
      </g>

      {/* 4 L in each block */}
      <g className={cls("num")} fontSize={12} fontWeight={700} textAnchor="middle">
        {blocks.map((i) => (
          <text key={i} x={X0 + i * BW + BW / 2} y={BY + 18} fill={i < 2 ? C.onPrimary : C.ink}>
            4 L
          </text>
        ))}
      </g>
      <rect className={cls("ring")} x={X0 - 1.5} y={BY - 1.5} width={BW + 3} height={BH + 3} rx={2} fill="none" stroke={C.ink} strokeWidth={2.5} />

      {/* The white blocks glow at the end */}
      <rect className={cls("glow")} x={X0 + 2 * BW - 2} y={BY - 2} width={7 * BW + 4} height={BH + 4} rx={4} fill="none" stroke={C.good} strokeWidth={2.5} />

      {/* Labels under the groups */}
      <g className={cls("lab")}>
        <path d={`M${X0 + 3} ${BY + BH + 7} H${X0 + 2 * BW - 3}`} stroke={C.primary} strokeWidth={2} />
        <path d={`M${X0 + 2 * BW + 3} ${BY + BH + 7} H${X0 + 9 * BW - 3}`} stroke={C.ink} strokeWidth={2} />
        <Tex x={X0 + BW} y={BY + BH + 22} size={13} width={70} color={C.primaryText}>{String.raw`\text{blue}\ 2k`}</Tex>
        <Tex x={X0 + 5.5 * BW} y={BY + BH + 22} size={13} width={90}>{String.raw`\text{white}\ 7k`}</Tex>
      </g>

      {/* The work */}
      <g className={cls("eq")}>
        <Tex x={X0} y={116} size={15} anchor="start" width={140}>{String.raw`2k+7k=9k=36`}</Tex>
      </g>
      <g className={cls("k")}>
        <Tex x={X0} y={138} size={15} anchor="start" width={80} color={C.primaryText}>{String.raw`k=4`}</Tex>
      </g>
      <g className={cls("ans")}>
        <Tex x={X0 + 9 * BW} y={127} size={17} anchor="end" width={120} color={C.good}>{String.raw`7k=28\ \text{L}`}</Tex>
      </g>

      {/* The trap, quiet */}
      <g className={cls("note")}>
        <Tex x={160} y={158} size={12} width={290} color={C.muted}>{String.raw`\text{white is }\dfrac{7}{9}\text{ of the total, not }\dfrac{2}{7}`}</Tex>
      </g>
    </Svg>
  );
}
