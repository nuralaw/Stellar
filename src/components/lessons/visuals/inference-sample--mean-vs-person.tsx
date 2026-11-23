import { C, Css, Svg, Tex } from "./kit";

// The 80 ± 3 range is about the mean of everyone; individual scores scatter far outside 77 to 83.
export const alt = "30 quiz scores spread from 50 to 96 on a number line. A narrow band 77 to 83 around the mean 80 holds only some of them, so the range is about the mean, not about each student.";

const P = "v-inference-sample--mean-vs-person-";
const n = (k: string) => P + k;
const at = (k: string, t: number) => `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 92% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
const grow = (k: string, t: number, d: number) => `.${n(k)} { transform-box: fill-box; transform-origin: center; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { opacity: 0; transform: scaleX(0) } ${t + 1}% { opacity: 1; transform: scaleX(0) } ${t + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 1}% { opacity: 1 } ${t + d}%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const css = `
.${n("a")} { animation: 10s ease-in-out infinite; }
${at("dots", 2)}
${at("one", 12)}
${at("mean", 24)}
${grow("band", 26, 8)}
${at("pm", 34)}
${at("sub", 40)}
${at("ring", 50)}
${at("claim1", 60)}
${draw("strike", 68, 6)}
${at("claim2", 76)}
`;

// 30 quiz scores, mean exactly 80.
const SCORES = [50, 58, 60, 63, 67, 70, 72, 74, 76, 77, 78, 79, 80, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96];
const px = (v: number) => 30 + (260 / 60) * (v - 40);
const AXIS = 118;
// Beeswarm: each dot sits at its exact score, at the lowest height where it does not touch another dot.
const DOTS: { x: number; y: number }[] = [];
for (const v of SCORES) {
  const x = px(v);
  let y = AXIS - 7;
  while (DOTS.some((d) => Math.hypot(d.x - x, d.y - y) < 9.6)) y -= 2;
  DOTS.push({ x, y });
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The narrow band around the mean */}
      <rect className={cls("band")} x={px(77)} y={54} width={px(83) - px(77)} height={AXIS - 54} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={2} />
      <line className={cls("mean")} x1={px(80)} y1={54} x2={px(80)} y2={AXIS} stroke={C.primary} strokeWidth={2} strokeDasharray="4 3" />
      <g className={cls("pm")}>
        <Tex x={px(80)} y={22} size={16} width={190} color={C.primaryText}>{String.raw`\text{mean } 80\pm3`}</Tex>
      </g>
      <g className={cls("sub")}>
        <Tex x={px(80) - 5} y={42} size={12} anchor="end" width={84} color={C.primaryText}>{String.raw`80-3=77`}</Tex>
        <Tex x={px(80) + 5} y={42} size={12} anchor="start" width={84} color={C.primaryText}>{String.raw`80+3=83`}</Tex>
      </g>

      {/* The number line and every student */}
      <line x1={26} y1={AXIS} x2={294} y2={AXIS} stroke={C.muted} strokeWidth={1.5} />
      <g fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
        {[40, 60, 100].map((v) => (
          <text key={v} x={px(v)} y={AXIS + 15}>
            {v}
          </text>
        ))}
        <text x={px(80)} y={AXIS + 15} fill={C.primaryText} fontWeight={700}>
          80
        </text>
      </g>
      <g className={cls("dots")} fill={C.muted}>
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={4.5} />
        ))}
      </g>

      <g className={cls("one")}>
        <text x={px(50) - 14} y={AXIS - 36} fontSize={11} fontWeight={600} fill={C.ink}>
          one student
        </text>
      </g>
      <circle className={cls("ring")} cx={px(50)} cy={AXIS - 7} r={9} fill="none" stroke={C.ink} strokeWidth={2} />

      {/* The claim about the mean is fine; the claim about each student is not */}
      <g className={cls("claim1")}>
        <text x={160} y={152} fontSize={12} fontWeight={600} fill={C.bad} textAnchor="middle">
          every student is between 77 and 83
        </text>
      </g>
      <path className={cls("strike")} d="M42 148 H278" pathLength={100} fill="none" stroke={C.bad} strokeWidth={2} />
      <g className={cls("claim2")}>
        <text x={160} y={168} fontSize={12} fontWeight={700} fill={C.good} textAnchor="middle">
          the mean is plausibly between 77 and 83
        </text>
      </g>
    </Svg>
  );
}
