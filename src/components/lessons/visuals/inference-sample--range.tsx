import { C, Css, Svg, Tex } from "./kit";

// Estimate ± margin: 62% ± 4% gives the plausible range 58% to 66%.
export const alt = "A number line with the sample estimate 62%. A bar reaches 4 below and 4 above it, from 58% to 66%. That range is plausible for the whole population.";

const P = "v-inference-sample--range-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number, origin: string) => `.${n(k)} { transform-box: fill-box; transform-origin: ${origin}; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 9s ease-in-out infinite; }
${at("est", 3)}
${grow("left", 20, 14, "right center")}
${grow("right", 20, 14, "left center")}
${at("pm", 36)}
${at("res", 56)}
`;

const px = (v: number) => 44 + 15 * (v - 54);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Number line */}
      <path d={`M${px(54)} 118 H${px(70)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fill={C.muted} textAnchor="middle" stroke={C.muted} strokeWidth={1.5}>
        {[54, 58, 62, 66, 70].map((v) => (
          <g key={v}>
            <line x1={px(v)} y1={118} x2={px(v)} y2={123} />
            <text x={px(v)} y={138} stroke="none">
              {v}%
            </text>
          </g>
        ))}
      </g>

      {/* The range: 4 below and 4 above the estimate */}
      <rect className={cls("left")} x={px(58)} y={86} width={px(62) - px(58)} height={14} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={2} />
      <rect className={cls("right")} x={px(62)} y={86} width={px(66) - px(62)} height={14} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={2} />
      <g className={cls("pm")} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3">
        <line x1={px(58)} y1={100} x2={px(58)} y2={118} />
        <line x1={px(66)} y1={100} x2={px(66)} y2={118} />
      </g>
      <g className={cls("pm")}>
        <Tex x={(px(58) + px(62)) / 2} y={76} size={15} width={50} color={C.primaryText}>{String.raw`-4`}</Tex>
        <Tex x={(px(62) + px(66)) / 2} y={76} size={15} width={50} color={C.primaryText}>{String.raw`+4`}</Tex>
      </g>

      {/* The estimate */}
      <g className={cls("est")}>
        <circle cx={px(62)} cy={93} r={7} fill={C.ink} />
        <text x={px(62)} y={58} fontSize={12} fill={C.muted} textAnchor="middle">
          sample estimate
        </text>
        <path d={`M${px(62)} 62 V84`} stroke={C.muted} strokeWidth={1.5} fill="none" />
      </g>

      <text className={cls("res")} x={160} y={30} fontSize={16} fontWeight={700} fill={C.primaryText} textAnchor="middle">
        plausible: 58% to 66%
      </text>
    </Svg>
  );
}
