import { C, Css, Svg } from "./kit";

// Trap: the flipped group. A chess player picked: group is the Chess column (10), 8/10. A girl picked: group is the Girls row (20), 8/20.
export const alt = "A table of 30 club members by girls and boys and by chess. Picking a chess player uses the Chess column total, 10, so 8/10. Picking a girl uses the Girls row total, 20, so 8/20. The group decides.";

const P = "v-probability--flipped-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("tbl", 2)}
${at("col", 14)}
${at("txt1", 18)}
${at("row", 48)}
${at("txt2", 52)}
`;

const COLX = [40, 112, 170, 228];
const COLW = [72, 58, 58, 52];
const ROWY = [22, 46, 70, 96];
const HEAD = ["", "Chess", "No chess", "Total"];
const ROWS: [string, number, number, number][] = [
  ["Girls", 8, 12, 20],
  ["Boys", 2, 8, 10],
  ["Total", 10, 20, 30],
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
            <text key={h + c} x={cx(c)} y={39} fontSize={c === 2 ? 11 : 12}>
              {h}
            </text>
          ))}
        </g>
        {ROWS.map(([label, chess, no, tot], r) => {
          const y = ROWY[r + 1] + 17;
          return (
            <g key={label} fontSize={13} fill={C.ink} textAnchor="middle" fontWeight={r === 2 ? 700 : 500}>
              <text x={cx(0)} y={y} fill={C.muted} fontWeight={600} fontSize={12}>
                {label}
              </text>
              <text x={cx(1)} y={y}>
                {chess}
              </text>
              <text x={cx(2)} y={y}>
                {no}
              </text>
              <text x={cx(3)} y={y} fontWeight={700}>
                {tot}
              </text>
            </g>
          );
        })}
      </g>

      {/* The right group: the Chess column. The flipped group: the Girls row. */}
      <rect className={cls("col")} x={COLX[1]} y={22} width={COLW[1]} height={98} rx={3} fill="none" stroke={C.good} strokeWidth={2.5} />
      <rect className={cls("row")} x={40} y={ROWY[1]} width={240} height={24} rx={3} fill="none" stroke={C.bad} strokeWidth={2.5} strokeDasharray="5 3" />

      <text className={cls("txt1")} x={160} y={142} fontSize={13} fontWeight={700} fill={C.good} textAnchor="middle">
        pick a chess player: 8/10
      </text>
      <text className={cls("txt2")} x={160} y={162} fontSize={13} fontWeight={700} fill={C.bad} textAnchor="middle">
        pick a girl: 8/20 (different group)
      </text>
    </Svg>
  );
}
