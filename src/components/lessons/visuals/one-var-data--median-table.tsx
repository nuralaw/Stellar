import { C, Css, Svg } from "./kit";

// Median from a table: 15 scores as stacked bars (6: 4, 7: 5, 8: 3, 9: 3). Count up to position (15 + 1)/2 = 8, which lands in the 7s.
export const alt = "A histogram of 15 quiz scores: four 6s, five 7s, three 8s and three 9s. Counting the scores from the left, the 8th one is in the bar for 7, so the median is 7.";

const P = "v-one-var-data--median-table-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const VALUES = [6, 7, 8, 9];
const COUNTS = [4, 5, 3, 3];
const BX = (i: number) => 47 + i * 60;
const BASE = 132;
const SQ = 17;

// Squares in counting order: number 1..15, bar by bar, bottom to top.
const squares: { num: number; x: number; y: number }[] = [];
let num = 0;
COUNTS.forEach((c, i) => {
  for (let j = 0; j < c; j++) squares.push({ num: ++num, x: BX(i), y: BASE - (j + 1) * SQ });
});

const lit = (i: number) => 8 + i * 4;
const sqCss = squares
  .slice(0, 8)
  .map((s) => {
    const t = lit(s.num - 1);
    const col = s.num === 8 ? C.primary : C.soft;
    return `.${n("s" + s.num)} { fill: ${col}; animation-name: ${n("s" + s.num)}; }
@keyframes ${n("s" + s.num)} { 0%, ${t}% { fill: ${C.fill} } ${t + 3}%, 92% { fill: ${col} } 97%, 100% { fill: ${C.fill} } }`;
  })
  .join("\n");

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("top", 1)}
${at("res", 58)}
${sqCss}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <text className={cls("top")} x={160} y={30} fontSize={15} fontWeight={700} fill={C.ink} textAnchor="middle">
        (15 + 1)/2 = 8th score
      </text>

      {squares.map((s) => (
        <g key={s.num}>
          <rect className={s.num <= 8 ? cls("s" + s.num) : undefined} x={s.x} y={s.y} width={46} height={SQ - 1.5} rx={2} fill={C.fill} stroke={C.line} strokeWidth={1} />
          <text x={s.x + 23} y={s.y + 12.5} fontSize={11.5} fontWeight={600} fill={s.num === 8 ? C.onPrimary : C.ink} textAnchor="middle">
            {s.num}
          </text>
        </g>
      ))}

      <path d={`M40 ${BASE} H${BX(3) + 52}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
        {VALUES.map((v, i) => (
          <text key={v} x={BX(i) + 23} y={BASE + 15}>
            {v}
          </text>
        ))}
      </g>

      <text className={cls("res")} x={160} y={168} fontSize={14} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        the 8th is a 7: median = 7
      </text>
    </Svg>
  );
}
