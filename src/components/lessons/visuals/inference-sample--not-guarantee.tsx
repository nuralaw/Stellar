import { C, Css, Svg, Tex } from "./kit";

// Different random samples land on different estimates around one fixed true value (39%); no estimate is a guarantee.
export const alt = "Three samples give 38%, 41% and 36% with bands that all cover the true value 39%. None is exactly 39%, so exactly 38% and the next sample showing 38% are rejected; plausibly 33% to 43% is kept.";

const P = "v-inference-sample--not-guarantee-";
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
${at("axis", 1)}
${grow("b1", 4, 8)}
${at("s1", 10)}
${grow("b2", 20, 8)}
${at("s2", 26)}
${grow("b3", 36, 8)}
${at("s3", 42)}
${draw("true", 52, 8)}
${at("truel", 56)}
${at("c1", 64)}
${at("c2", 70)}
${at("c3", 76)}
`;

const px = (v: number) => 40 + (250 / 22) * (v - 28);
const SAMPLES = [
  { id: "1", est: 38, y: 40, tex: String.raw`38\%\pm5\%` },
  { id: "2", est: 41, y: 58, tex: String.raw`41\%\pm5\%` },
  { id: "3", est: 36, y: 76, tex: String.raw`36\%\pm5\%` },
];
const CARDS = [
  { id: "1", x: 16, l1: "exactly", l2: "38%", bad: true },
  { id: "2", x: 115, l1: "next sample", l2: "shows 38%", bad: true },
  { id: "3", x: 214, l1: "plausibly", l2: "33% to 43%", bad: false },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={cls("axis")}>
        <line x1={40} y1={98} x2={290} y2={98} stroke={C.muted} strokeWidth={1.5} />
        <g fontSize={11} fontWeight={600} fill={C.muted} textAnchor="middle">
          {[30, 40, 50].map((v) => (
            <g key={v}>
              <line x1={px(v)} y1={98} x2={px(v)} y2={103} stroke={C.muted} strokeWidth={1.5} />
              <text x={px(v)} y={115}>
                {v}%
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* Three samples: the band moves around the same value */}
      {SAMPLES.map((s) => (
        <g key={s.id}>
          <rect className={cls(`b${s.id}`)} x={px(s.est - 5)} y={s.y - 6} width={px(s.est + 5) - px(s.est - 5)} height={12} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <g className={cls(`s${s.id}`)}>
            <circle cx={px(s.est)} cy={s.y} r={4.5} fill={C.ink} />
            <text x={16} y={s.y + 4} fontSize={11} fontWeight={600} fill={C.muted}>
              sample {s.id}
            </text>
            <Tex x={px(s.est + 5) + 6} y={s.y} size={11} anchor="start" width={64} color={C.primaryText}>{s.tex}</Tex>
          </g>
        </g>
      ))}

      {/* The true value, revealed */}
      <line className={cls("true")} x1={px(39)} y1={32} x2={px(39)} y2={98} pathLength={100} stroke={C.ink} strokeWidth={1.5} strokeDasharray="100" />
      <text className={cls("truel")} x={px(39)} y={26} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
        true value 39%
      </text>

      {/* What each statement gets */}
      {CARDS.map((c) => {
        const col = c.bad ? C.bad : C.good;
        return (
          <g key={c.id} className={cls(`c${c.id}`)}>
            <rect x={c.x} y={128} width={90} height={32} rx={6} fill={c.bad ? C.badSoft : C.goodSoft} stroke={col} strokeWidth={1.5} />
            <text x={c.x + 45} y={142} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
              {c.l1}
            </text>
            <text x={c.x + 45} y={155} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
              {c.l2}
            </text>
            <circle cx={c.x + 86} cy={128} r={8} fill={col} />
            <path d={c.bad ? `M${c.x + 82.5} 124.5 l7 7 m0 -7 l-7 7` : `M${c.x + 82} 128 l3 3 l5 -6`} fill="none" stroke={C.bg} strokeWidth={2} />
          </g>
        );
      })}
    </Svg>
  );
}
