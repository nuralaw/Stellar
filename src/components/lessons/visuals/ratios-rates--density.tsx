import { C, Css, Svg, Tex } from "./kit";

// Density: a combined density is total people over total area (48,000 / 100 = 480), not the average of 300 and 750.
export const alt = "Two regions: 18,000 people on 60 square miles and 30,000 on 40. Averaging 300 and 750 gives 525, which is wrong. The regions merge: 48,000 people over 100 square miles is 480 per square mile.";

const P = "v-ratios-rates--density-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
// Visible only between two moments; hidden in the still frame.
const win = (k: string, a: number, b: number) => `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${a}% { opacity: 0 } ${a + 4}%, ${b}% { opacity: 1 } ${b + 4}%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 12s ease-in-out infinite; }
${at("dots", 2)}
${win("init", 2, 22)}
${win("wrong", 26, 42)}
.${n("slideX")} { animation-name: ${n("slideX")}; }
@keyframes ${n("slideX")} { 0%, 46% { transform: translateX(-8px) } 56%, 100% { transform: none } }
.${n("slideY")} { animation-name: ${n("slideY")}; }
@keyframes ${n("slideY")} { 0%, 46% { transform: translateX(8px) } 56%, 100% { transform: none } }
${at("box", 50)}
${at("eq", 60)}
${at("line", 70)}
${at("mark", 78)}
`;

const TOP = 36;
const H = 44;
const XL = 70;
const XW = 108;
const YL = XL + XW;
const YW = 72;

const dotsX = Array.from({ length: 18 }, (_, i) => ({ x: XL + (XW / 7) * ((i % 6) + 1), y: TOP + (H / 4) * (Math.floor(i / 6) + 1) }));
const dotsY = Array.from({ length: 30 }, (_, i) => ({ x: YL + (YW / 6) * ((i % 5) + 1), y: TOP + (H / 7) * (Math.floor(i / 5) + 1) }));

// Number line: 300 to 750.
const NX0 = 50;
const NX1 = 270;
const nx = (v: number) => NX0 + ((v - 300) / 450) * (NX1 - NX0);
const NY = 148;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The two regions: dots are thousands of people */}
      <g className={cls("slideX")}>
        <g className={cls("dots")} fill={C.primary}>
          {dotsX.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.2} />
          ))}
        </g>
        <g className={cls("init")}>
          <rect x={XL} y={TOP} width={XW} height={H} rx={3} fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text x={XL + XW / 2} y={TOP - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            18,000 people
          </text>
          <Tex x={XL + XW / 2} y={TOP + H + 14} size={12} width={100} color={C.muted}>{String.raw`60\ \text{mi}^2`}</Tex>
          <Tex x={XL + XW / 2} y={TOP + H + 32} size={13} width={100} color={C.primaryText}>{String.raw`300\,/\,\text{mi}^2`}</Tex>
        </g>
      </g>
      <g className={cls("slideY")}>
        <g className={cls("dots")} fill={C.primary}>
          {dotsY.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.2} />
          ))}
        </g>
        <g className={cls("init")}>
          <rect x={YL} y={TOP} width={YW} height={H} rx={3} fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text x={YL + YW / 2} y={TOP - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
            30,000 people
          </text>
          <Tex x={YL + YW / 2} y={TOP + H + 14} size={12} width={90} color={C.muted}>{String.raw`40\ \text{mi}^2`}</Tex>
          <Tex x={YL + YW / 2} y={TOP + H + 32} size={13} width={90} color={C.primaryText}>{String.raw`750\,/\,\text{mi}^2`}</Tex>
        </g>
      </g>

      {/* The tempting average */}
      <g className={cls("wrong")}>
        <Tex x={160} y={112} size={15} width={160} color={C.bad}>{String.raw`\dfrac{300+750}{2}=525`}</Tex>
        <line x1={96} y1={130} x2={224} y2={94} stroke={C.bad} strokeWidth={2.5} />
        <text x={160} y={142} textAnchor="middle" fontSize={12} fill={C.muted}>
          averages ignore size
        </text>
      </g>

      {/* One big region */}
      <rect className={cls("box")} x={XL} y={TOP} width={XW + YW} height={H} rx={3} fill="none" stroke={C.ink} strokeWidth={2} />
      <g className={cls("eq")}>
        <Tex x={160} y={112} size={14} width={290}>{String.raw`\dfrac{\text{total people}}{\text{total area}}=\dfrac{48000}{100}=480`}</Tex>
      </g>

      {/* Where 480 sits */}
      <g className={cls("line")}>
        <line x1={NX0} y1={NY} x2={NX1} y2={NY} stroke={C.muted} strokeWidth={2} />
        {[300, 750].map((v) => (
          <g key={v}>
            <line x1={nx(v)} y1={NY - 5} x2={nx(v)} y2={NY + 5} stroke={C.muted} strokeWidth={2} />
            <text x={nx(v)} y={NY + 20} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted}>
              {v}
            </text>
          </g>
        ))}
        <line x1={nx(525)} y1={NY - 6} x2={nx(525)} y2={NY + 6} stroke={C.bad} strokeWidth={2} opacity={0.45} />
      </g>
      <g className={cls("mark")}>
        <circle cx={nx(480)} cy={NY} r={5.5} fill={C.good} />
        <text x={nx(480)} y={NY + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
          480
        </text>
      </g>
    </Svg>
  );
}
