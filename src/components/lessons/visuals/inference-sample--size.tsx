import { C, Css, Svg } from "./kit";

// Sample size and margin: the same poll with 200 people has a wide range; with 2,000 people the range is narrower.
export const alt = "Two ranges around the same 50% estimate: Poll A, 200 people, is wide (± 7). Poll B, 2,000 people, is narrower (± 2). A bigger sample usually gives a smaller margin.";

const P = "v-inference-sample--size-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("la", 3)}
${grow("ba", 10, 16)}
${at("ma", 28)}
${at("lb", 40)}
${grow("bb", 46, 16)}
${at("mb", 64)}
${at("res", 74)}
`;

const px = (v: number) => 40 + 12 * (v - 40);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <path d={`M${px(40)} 140 H${px(60)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle" stroke={C.muted} strokeWidth={1.5}>
        {[40, 45, 50, 55, 60].map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={140} x2={px(v)} y2={145} />
            <text x={px(v)} y={158} stroke="none">
              {v}%
            </text>
          </g>
        ))}
      </g>
      <line x1={px(50)} y1={40} x2={px(50)} y2={140} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />

      {/* Poll A: 200 people, ± 7 */}
      <text className={cls("la")} x={24} y={46} fontSize={12} fontWeight={700} fill={C.ink}>
        Poll A: 200 people
      </text>
      <rect className={cls("ba")} x={px(43)} y={52} width={px(57) - px(43)} height={14} rx={3} fill={C.fill} stroke={C.muted} strokeWidth={2} />
      <text className={cls("ma")} x={px(57) + 8} y={64} fontSize={13} fontWeight={700} fill={C.ink}>
        ± 7
      </text>

      {/* Poll B: 2,000 people, ± 2 */}
      <text className={cls("lb")} x={24} y={96} fontSize={12} fontWeight={700} fill={C.ink}>
        Poll B: 2,000 people
      </text>
      <rect className={cls("bb")} x={px(48)} y={102} width={px(52) - px(48)} height={14} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={2} />
      <text className={cls("mb")} x={px(52) + 8} y={114} fontSize={13} fontWeight={700} fill={C.primaryText}>
        ± 2
      </text>

      <text className={cls("res")} x={160} y={26} fontSize={15} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        bigger sample: narrower range
      </text>
    </Svg>
  );
}
