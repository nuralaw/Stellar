import { C, Css, Svg } from "./kit";

// Mean moves, median stays: the dot at 10 slides out to 20. The mean goes 6 → 8, the median stays 6.
export const alt = "A dot plot of 2, 4, 6, 8 and 10. The dot at 10 slides to 20. The mean marker moves from 6 to 8, while the median marker stays at 6.";

const P = "v-one-var-data--mean-median-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const px = (v: number) => 28 + 13.5 * v;
const SHIFT = 10 * 13.5;
const MEAN_SHIFT = 2 * 13.5;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("dots", 2)}
${at("med", 16)}
${at("mean", 26)}
.${n("far")} { animation-name: ${n("far")}; }
@keyframes ${n("far")} { 0%, 3% { opacity: 0; transform: translateX(-${SHIFT}px) } 8%, 40% { opacity: 1; transform: translateX(-${SHIFT}px) } 56%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }
.${n("mm")} { animation-name: ${n("mm")}; }
@keyframes ${n("mm")} { 0%, 22% { opacity: 0; transform: translateX(-${MEAN_SHIFT}px) } 28%, 40% { opacity: 1; transform: translateX(-${MEAN_SHIFT}px) } 56%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }
.${n("l6")} { opacity: 0; animation-name: ${n("l6")}; }
@keyframes ${n("l6")} { 0%, 26% { opacity: 0 } 31%, 48% { opacity: 1 } 54%, 100% { opacity: 0 } }
.${n("l8")} { animation-name: ${n("l8")}; }
@keyframes ${n("l8")} { 0%, 54% { opacity: 0 } 60%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }
`;

const NEAR = [2, 4, 6, 8];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Axis */}
      <path d="M28 100 H300" fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle" stroke={C.muted} strokeWidth={1.5}>
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={100} x2={px(v)} y2={105} />
            <text x={px(v)} y={119} stroke="none">
              {v}
            </text>
          </g>
        ))}
      </g>

      {/* Dots */}
      <g className={cls("dots")} fill={C.ink}>
        {NEAR.map((v) => (
          <circle key={v} cx={px(v)} cy={92} r={6} />
        ))}
      </g>
      <circle className={cls("far")} cx={px(20)} cy={92} r={6} fill={C.primary} />

      {/* Median: stays at 6 */}
      <g className={cls("med")}>
        <path d={`M${px(6) - 6} 64 L${px(6)} 74 L${px(6) + 6} 64 Z`} fill={C.ink} />
        <text x={px(6)} y={56} fontSize={13} fontWeight={700} fill={C.ink} textAnchor="middle">
          median 6
        </text>
      </g>

      {/* Mean: 6 → 8 */}
      <g transform={`translate(${px(8)} 126)`}>
        <path className={cls("mm")} d="M-6 10 L0 0 L6 10 Z" fill={C.primary} />
      </g>
      <text className={cls("l6")} x={px(6)} y={156} fontSize={13} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        mean 6
      </text>
      <text className={cls("l8")} x={px(8)} y={156} fontSize={13} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        mean 6 → 8
      </text>
    </Svg>
  );
}
