import { C, Css, Svg, Tex } from "./kit";

// Pick the group: a two-way table with Total row and column. "Given that the student takes the bus" makes the Bus column the group.
export const alt = "A table of 50 students by grade and how they travel, with totals. Given the student takes the bus, the group is the Bus column, 30. Grade 9 on the bus is 18: probability 18/30 = 3/5.";

const P = "v-probability--table-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("tbl", 2)}
${at("col", 16)}
${at("grp", 30)}
.${n("txt1")} { opacity: 0; animation-name: ${n("txt1")}; }
@keyframes ${n("txt1")} { 0%, 32% { opacity: 0 } 37%, 52% { opacity: 1 } 56%, 100% { opacity: 0 } }
${at("fit", 48)}
${at("txt2", 56)}
`;

const COLX = [40, 112, 170, 228]; // label, Car, Bus, Total
const COLW = [72, 58, 58, 52];
const ROWY = [22, 46, 70, 96];
const HEAD = ["", "Car", "Bus", "Total"];
const ROWS: [string, number, number, number][] = [
  ["Grade 9", 6, 18, 24],
  ["Grade 10", 14, 12, 26],
  ["Total", 20, 30, 50],
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("tbl")}>
        {/* Grid */}
        <g fill="none" stroke={C.line} strokeWidth={1}>
          <rect x={40} y={22} width={280 - 40} height={98} rx={4} />
          {[1, 2, 3].map((r) => (
            <line key={`h${r}`} x1={40} y1={ROWY[r]} x2={280} y2={ROWY[r]} />
          ))}
          {[1, 2, 3].map((c) => (
            <line key={`v${c}`} x1={COLX[c]} y1={22} x2={COLX[c]} y2={120} />
          ))}
        </g>
        <line x1={40} y1={ROWY[3]} x2={280} y2={ROWY[3]} stroke={C.muted} strokeWidth={1.5} />
        <line x1={COLX[3]} y1={22} x2={COLX[3]} y2={120} stroke={C.muted} strokeWidth={1.5} />
        <g fontSize={12} fontWeight={600} fill={C.muted} textAnchor="middle">
          {HEAD.map((h, c) => (
            <text key={h + c} x={COLX[c] + COLW[c] / 2} y={39}>
              {h}
            </text>
          ))}
        </g>
        {ROWS.map(([label, car, bus, tot], r) => {
          const y = ROWY[r + 1] + 17;
          const bold = r === 2;
          return (
            <g key={label} fontSize={13} fill={C.ink} textAnchor="middle" fontWeight={bold ? 700 : 500}>
              <text x={COLX[0] + COLW[0] / 2} y={y} fill={C.muted} fontWeight={600} fontSize={12}>
                {label}
              </text>
              <text x={COLX[1] + COLW[1] / 2} y={y}>
                {car}
              </text>
              <text x={COLX[2] + COLW[2] / 2} y={y}>
                {bus}
              </text>
              <text x={COLX[3] + COLW[3] / 2} y={y} fontWeight={700}>
                {tot}
              </text>
            </g>
          );
        })}
      </g>

      {/* The group: the Bus column */}
      <rect className={cls("col")} x={COLX[2]} y={22} width={COLW[2]} height={98} rx={4} fill={C.soft} fillOpacity={0.9} stroke={C.primary} strokeWidth={1.5} />
      {/* Re-draw the Bus numbers on top of the highlight */}
      <g className={cls("col")} fontSize={13} fill={C.ink} textAnchor="middle">
        <text x={COLX[2] + COLW[2] / 2} y={39} fontSize={12} fontWeight={600} fill={C.muted}>
          Bus
        </text>
        <text x={COLX[2] + COLW[2] / 2} y={ROWY[1] + 17}>
          18
        </text>
        <text x={COLX[2] + COLW[2] / 2} y={ROWY[2] + 17}>
          12
        </text>
        <text x={COLX[2] + COLW[2] / 2} y={ROWY[3] + 17} fontWeight={700}>
          30
        </text>
      </g>
      <g className={cls("grp")}>
        <rect x={COLX[2] + 8} y={ROWY[3] + 3} width={COLW[2] - 16} height={18} rx={9} fill={C.primary} />
        <text x={COLX[2] + COLW[2] / 2} y={ROWY[3] + 17} fontSize={13} fontWeight={700} fill={C.onPrimary} textAnchor="middle">
          30
        </text>
      </g>
      <g className={cls("fit")}>
        <rect x={COLX[2] + 8} y={ROWY[1] + 3} width={COLW[2] - 16} height={18} rx={9} fill={C.good} />
        <text x={COLX[2] + COLW[2] / 2} y={ROWY[1] + 17} fontSize={13} fontWeight={700} fill={C.bg} textAnchor="middle">
          18
        </text>
      </g>

      <text className={cls("txt1")} x={160} y={142} fontSize={13} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        group: the 30 bus riders
      </text>
      <g className={cls("txt2")}>
        <Tex x={160} y={146} size={18} width={200} color={C.good}>{String.raw`\dfrac{18}{30}=\dfrac{3}{5}`}</Tex>
      </g>
    </Svg>
  );
}
