import { C, Css, Svg } from "./kit";

// Compare two estimates: Town A 52% ± 4 is 48 to 56. Town B 55% ± 3 is 52 to 58. They overlap from 52 to 56: no convincing difference.
export const alt = "Two plausible ranges on a number line: Town A from 48% to 56% and Town B from 52% to 58%. They overlap from 52% to 56%, so the data do not convincingly show a difference.";

const P = "v-inference-sample--overlap-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: left center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${grow("ba", 4, 14)}
${at("ta", 16)}
${grow("bb", 26, 14)}
${at("tb", 38)}
${at("ov", 52)}
${at("res", 68)}
`;

const px = (v: number) => 36 + 14 * (v - 44);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Overlap band */}
      <g className={cls("ov")}>
        <rect x={px(52)} y={40} width={px(56) - px(52)} height={82} rx={4} fill={C.soft} stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={(px(52) + px(56)) / 2} y={34} fontSize={12} fontWeight={700} fill={C.primary} textAnchor="middle">
          overlap
        </text>
      </g>

      {/* Town A: 52 ± 4 */}
      <g fontSize={14} fontWeight={700} fill={C.ink}>
        <text x={14} y={69}>
          A
        </text>
        <text x={14} y={103}>
          B
        </text>
      </g>
      <rect className={cls("ba")} x={px(48)} y={56} width={px(56) - px(48)} height={18} rx={4} fill={C.fill} stroke={C.ink} strokeWidth={2} />
      <text className={cls("ta")} x={px(52)} y={69} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
        52 ± 4
      </text>

      {/* Town B: 55 ± 3 */}
      <rect className={cls("bb")} x={px(52)} y={90} width={px(58) - px(52)} height={18} rx={4} fill={C.fill} stroke={C.ink} strokeWidth={2} />
      <text className={cls("tb")} x={px(55)} y={103} fontSize={12} fontWeight={700} fill={C.ink} textAnchor="middle">
        55 ± 3
      </text>

      {/* Scale */}
      <path d={`M${px(46)} 128 H${px(60)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle" stroke={C.muted} strokeWidth={1.5}>
        {[48, 52, 56, 60].map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={128} x2={px(v)} y2={133} />
            <text x={px(v)} y={146} stroke="none">
              {v}%
            </text>
          </g>
        ))}
      </g>

      <text className={cls("res")} x={160} y={166} fontSize={14} fontWeight={700} fill={C.primary} textAnchor="middle">
        overlap: no convincing difference
      </text>
    </Svg>
  );
}
