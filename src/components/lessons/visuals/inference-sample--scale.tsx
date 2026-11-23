import { C, Css, Svg, Tex } from "./kit";

// Apply the sample share to the population (12/50 of 2000 = 480); a percent margin becomes counts only at the end (0.37 and 0.43 of 2500).
export const alt = "12 of 50 sampled dots are highlighted, and the same share of a block of 2,000 members gives 480. Then 40% plus or minus 3% becomes 37% to 43%, which times 2,500 gives 925 to 1,075.";

const P = "v-inference-sample--scale-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const win = (k: string, a: number, b: number) => `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${a}% { opacity: 0 } ${a + 4}%, ${b}% { opacity: 1 } ${b + 4}%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("grid", 2)}
${win("lab1", 2, 24)}
${at("lab2", 30)}
${win("f1", 8, 26)}
${at("f2", 34)}
${at("f3", 38)}
${at("f4", 42)}
.${n("big")} { transform-box: fill-box; transform-origin: left center; animation-name: ${n("big")}; }
@keyframes ${n("big")} { 0%, 26% { transform: scale(0.6) } 34%, 100% { transform: none } }
${at("axis", 48)}
${at("est", 50)}
${grow("band", 52, 6)}
${at("pm", 54)}
${at("tl", 58)}
${at("tr", 62)}
${at("cl", 68)}
${at("cr", 76)}
${at("cap", 86)}
`;

const HL = new Set([3, 7, 12, 18, 21, 26, 29, 33, 38, 41, 44, 48]);
const px = (v: number) => 160 + 20 * (v - 40);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The sample, which grows into the whole population: same share highlighted */}
      <g className={cls("grid")}>
        <g className={cls("big")}>
          {Array.from({ length: 50 }, (_, i) => (
            <circle
              key={i}
              cx={28 + 9 * (i % 10)}
              cy={22 + 9 * Math.floor(i / 10)}
              r={3.8}
              fill={HL.has(i) ? C.primary : C.fill}
              stroke={HL.has(i) ? C.primary : C.muted}
              strokeWidth={1}
            />
          ))}
        </g>
      </g>
      <text className={cls("lab1")} x={24} y={78} fontSize={12} fontWeight={600} fill={C.muted}>
        sample: 50
      </text>
      <text className={cls("lab2")} x={24} y={78} fontSize={12} fontWeight={700} fill={C.primaryText}>
        2,000 members
      </text>
      <g className={cls("f1")}>
        <Tex x={176} y={40} size={18} anchor="end" width={60} color={C.muted}>{String.raw`\frac{12}{50}`}</Tex>
      </g>
      <g className={cls("f2")}>
        <Tex x={176} y={40} size={18} anchor="end" width={60} color={C.muted}>{String.raw`\frac{12}{50}`}</Tex>
        <Tex x={188} y={40} size={16} width={20} color={C.muted}>{String.raw`\cdot`}</Tex>
      </g>
      <g className={cls("f3")}>
        <Tex x={216} y={40} size={18} width={56} color={C.primaryText}>{String.raw`\mathbf{2000}`}</Tex>
      </g>
      <g className={cls("f4")}>
        <Tex x={244} y={40} size={18} anchor="start" width={50} color={C.ink}>{String.raw`=480`}</Tex>
      </g>

      {/* The margin of error: percent range first */}
      <g className={cls("axis")}>
        <line x1={40} y1={112} x2={280} y2={112} stroke={C.muted} strokeWidth={1.5} />
      </g>
      <rect className={cls("band")} x={px(37)} y={104} width={120} height={16} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={2} />
      <g className={cls("pm")}>
        <Tex x={160} y={92} size={14} width={110} color={C.primaryText}>{String.raw`40\%\pm3\%`}</Tex>
      </g>
      <circle className={cls("est")} cx={px(40)} cy={112} r={5} fill={C.ink} />
      <g className={cls("tl")} fontSize={11} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        <text x={px(37)} y={133}>37%</text>
      </g>
      <g className={cls("tr")} fontSize={11} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        <text x={px(43)} y={133}>43%</text>
      </g>

      {/* Then each end becomes a count: multiply by the population, 2,500 */}
      <g className={cls("cl")}>
        <Tex x={px(37) - 17} y={150} size={13} anchor="end" width={60} color={C.ink}>{String.raw`0.37\cdot`}</Tex>
        <Tex x={px(37)} y={150} size={13} width={44} color={C.primaryText}>{String.raw`\mathbf{2500}`}</Tex>
        <Tex x={px(37) + 17} y={150} size={13} anchor="start" width={50} color={C.ink}>{String.raw`=925`}</Tex>
      </g>
      <g className={cls("cr")}>
        <Tex x={px(43) - 17} y={150} size={13} anchor="end" width={60} color={C.ink}>{String.raw`0.43\cdot`}</Tex>
        <Tex x={px(43)} y={150} size={13} width={44} color={C.primaryText}>{String.raw`\mathbf{2500}`}</Tex>
        <Tex x={px(43) + 17} y={150} size={13} anchor="start" width={56} color={C.ink}>{String.raw`=1075`}</Tex>
      </g>
      <text className={cls("cap")} x={160} y={168} fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
        percent range first, then multiply
      </text>
    </Svg>
  );
}
