import { C, Css, Svg } from "./kit";

// Think in totals: four numbers (16, 8, 8, 8) have mean 10 and total 40. Remove the 16: the total is 24 and the mean of 3 numbers is 8.
export const alt = "Four bars of height 16, 8, 8 and 8 with a mean line at 10, so the total is 4 × 10 = 40. The 16 is removed: three bars of 8 remain, the mean is 8 and the total is 24.";

const P = "v-one-var-data--totals-";
const n = (k: string) => P + k;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const K = 6; // px per unit
const BASE = 142;
const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0%, 3% { opacity: 0 } 9%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }
.${n("big")} { opacity: 0.35; animation-name: ${n("big")}; }
@keyframes ${n("big")} { 0%, 44% { opacity: 0 } 52%, 92% { opacity: 0.35 } 97%, 100% { opacity: 0 } }
.${n("norm")} { opacity: 0; animation-name: ${n("norm")}; }
@keyframes ${n("norm")} { 0%, 3% { opacity: 0 } 9%, 44% { opacity: 1 } 52%, 100% { opacity: 0 } }
.${n("mean")} { animation-name: ${n("mean")}; }
@keyframes ${n("mean")} { 0%, 8% { transform: translateY(-${2 * K}px); opacity: 0 } 12%, 44% { transform: translateY(-${2 * K}px); opacity: 1 } 62%, 92% { transform: none; opacity: 1 } 97%, 100% { transform: none; opacity: 0 } }
.${n("t1")} { opacity: 0; animation-name: ${n("t1")}; }
@keyframes ${n("t1")} { 0%, 14% { opacity: 0 } 20%, 46% { opacity: 1 } 52%, 100% { opacity: 0 } }
.${n("t2")} { animation-name: ${n("t2")}; }
@keyframes ${n("t2")} { 0%, 62% { opacity: 0 } 68%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }
`;

const BARS = [16, 8, 8, 8];
const bx = (i: number) => 60 + i * 48;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <path d={`M48 ${BASE} H250`} fill="none" stroke={C.muted} strokeWidth={1.5} />

      <g className={cls("scene")}>
        {BARS.slice(1).map((v, i) => (
          <g key={i}>
            <rect x={bx(i + 1)} y={BASE - v * K} width={36} height={v * K} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
            <text x={bx(i + 1) + 18} y={BASE - v * K + 18} fontSize={13} fontWeight={700} fill={C.ink} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
      </g>

      {/* The 16 looks normal first */}
      <g className={cls("norm")}>
        <rect x={bx(0)} y={BASE - 16 * K} width={36} height={16 * K} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={bx(0) + 18} y={BASE - 16 * K + 18} fontSize={13} fontWeight={700} fill={C.ink} textAnchor="middle">
          16
        </text>
      </g>

      {/* Then it is removed */}
      <g className={cls("big")}>
        <rect x={bx(0)} y={BASE - 16 * K} width={36} height={16 * K} rx={3} fill={C.badSoft} stroke={C.bad} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={bx(0) + 18} y={BASE - 16 * K + 18} fontSize={13} fontWeight={700} fill={C.bad} textAnchor="middle">
          16
        </text>
      </g>

      {/* Mean line: 10, then 8 */}
      <g transform={`translate(0 ${BASE - 8 * K})`}>
        <g className={cls("mean")}>
          <line x1={52} y1={0} x2={246} y2={0} stroke={C.primary} strokeWidth={2.5} strokeDasharray="6 4" />
        </g>
      </g>
      <text className={cls("t1")} x={254} y={BASE - 10 * K + 4} fontSize={13} fontWeight={700} fill={C.primary}>
        mean 10
      </text>
      <text className={cls("t2")} x={254} y={BASE - 8 * K + 4} fontSize={13} fontWeight={700} fill={C.primary}>
        mean 8
      </text>

      {/* Totals */}
      <text className={cls("t1")} x={160} y={30} fontSize={16} fontWeight={700} fill={C.ink} textAnchor="middle">
        total: 4 × 10 = 40
      </text>
      <text className={cls("t2")} x={160} y={30} fontSize={16} fontWeight={700} fill={C.ink} textAnchor="middle">
        total: 40 − 16 = 24, 24 ÷ 3
      </text>
    </Svg>
  );
}
