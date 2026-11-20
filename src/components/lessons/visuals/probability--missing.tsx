import { C, Css, Svg } from "./kit";

// Fill a missing cell: each row and column adds up to its Total. Grade 9: 12 + ? = 30, so ? = 18.
export const alt = "A table with a Total row and column and one missing cell. The Grade 9 row must add to 30 and already has 12, so the missing cell is 30 − 12 = 18. The Cat column then adds to 30 as well.";

const P = "v-probability--missing-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("tbl", 2)}
${at("row", 14)}
${at("txt1", 18)}
.${n("q")} { opacity: 0; animation-name: ${n("q")}; }
@keyframes ${n("q")} { 0%, 6% { opacity: 0 } 11%, 46% { opacity: 1 } 52%, 100% { opacity: 0 } }
${at("ans", 50)}
${at("col", 66)}
${at("txt2", 56)}
`;

const COLX = [40, 112, 170, 228];
const COLW = [72, 58, 58, 52];
const ROWY = [22, 46, 70, 96];
const HEAD = ["", "Dog", "Cat", "Total"];
const ROWS: [string, string, string, number][] = [
  ["Grade 9", "12", "?", 30],
  ["Grade 10", "8", "12", 20],
  ["Total", "20", "30", 50] as unknown as [string, string, string, number],
];

export default function Visual() {
  const cx = (c: number) => COLX[c] + COLW[c] / 2;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("tbl")}>
        <g fill="none" stroke={C.line} strokeWidth={1}>
          <rect x={40} y={22} width={240} height={98} rx={4} />
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
            <text key={h + c} x={cx(c)} y={39}>
              {h}
            </text>
          ))}
        </g>
        {ROWS.map(([label, dog, cat, tot], r) => {
          const y = ROWY[r + 1] + 17;
          return (
            <g key={label} fontSize={13} fill={C.ink} textAnchor="middle" fontWeight={r === 2 ? 700 : 500}>
              <text x={cx(0)} y={y} fill={C.muted} fontWeight={600} fontSize={12}>
                {label}
              </text>
              <text x={cx(1)} y={y}>
                {dog}
              </text>
              {cat !== "?" && (
                <text x={cx(2)} y={y}>
                  {cat}
                </text>
              )}
              <text x={cx(3)} y={y} fontWeight={700}>
                {tot}
              </text>
            </g>
          );
        })}
      </g>

      {/* The missing cell: ? becomes 18 */}
      <text className={cls("q")} x={cx(2)} y={ROWY[1] + 18} fontSize={15} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        ?
      </text>
      <g className={cls("ans")}>
        <rect x={COLX[2] + 8} y={ROWY[1] + 3} width={COLW[2] - 16} height={18} rx={9} fill={C.good} />
        <text x={cx(2)} y={ROWY[1] + 17} fontSize={13} fontWeight={700} fill={C.bg} textAnchor="middle">
          18
        </text>
      </g>

      {/* The row that has the missing cell */}
      <rect className={cls("row")} x={40} y={ROWY[1]} width={240} height={24} rx={3} fill="none" stroke={C.primary} strokeWidth={2} />
      {/* Check with the column */}
      <rect className={cls("col")} x={COLX[2]} y={22} width={COLW[2]} height={98} rx={3} fill="none" stroke={C.good} strokeWidth={2} />

      <text className={cls("txt1")} x={160} y={142} fontSize={13} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        row adds to 30: 12 + ? = 30
      </text>
      <text className={cls("txt2")} x={160} y={162} fontSize={14} fontWeight={700} fill={C.good} textAnchor="middle">
        ? = 30 − 12 = 18
      </text>
    </Svg>
  );
}
