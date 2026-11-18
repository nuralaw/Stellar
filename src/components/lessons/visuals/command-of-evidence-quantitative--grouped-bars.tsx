import { C, Css, Svg } from "./kit";

// Command of evidence (quantitative), "True isn't enough": four tomato plots as grouped bars, with the two comparisons that prove "sun, not watering".
export const alt = "Grouped bars of tomato height in cm: 8 hours of sun, 95 daily and 92 weekly; 4 hours of sun, 60 daily and 58 weekly. Watering changes height by 2 to 3 cm; sun changes it by about 35 cm.";

const P = "v-command-of-evidence-quantitative--grouped-bars-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
/** A bar that grows up from the baseline. */
const grow = (n: string, t: number) => `.${P}${n} { transform-box: fill-box; transform-origin: center bottom; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { transform: scaleY(0) } ${t + 9}%, 100% { transform: scaleY(1) } }`;

const css = `
.v-command-of-evidence-quantitative--grouped-bars-a { animation: 10s ease-in-out infinite; }
.v-command-of-evidence-quantitative--grouped-bars-scene { animation-name: v-command-of-evidence-quantitative--grouped-bars-scene; }
@keyframes v-command-of-evidence-quantitative--grouped-bars-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${grow("g1", 6)}
${grow("g2", 10)}
${grow("g3", 24)}
${grow("g4", 28)}
${show("v1", 15)}
${show("v2", 19)}
${show("v3", 33)}
${show("v4", 37)}
${show("water", 44)}
${show("sun", 62)}
`;

const BASE = 136;
const K = 0.75; // canvas units per cm
const BAR_W = 30;
const BARS = [
  { x: 40, v: 95, n: 1, label: "daily", sun: true, plot: "A" },
  { x: 74, v: 92, n: 2, label: "weekly", sun: true, plot: "B" },
  { x: 128, v: 60, n: 3, label: "daily", sun: false, plot: "C" },
  { x: 162, v: 58, n: 4, label: "weekly", sun: false, plot: "D" },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-command-of-evidence-quantitative--grouped-bars-a v-command-of-evidence-quantitative--grouped-bars-scene`}>
        <text x={16} y={20} fontSize={11} fill={C.muted}>
          height (cm)
        </text>
        <path d={`M30 ${BASE} H200`} stroke={C.muted} strokeWidth={1.5} fill="none" />

        {BARS.map((b) => {
          const h = b.v * K;
          const top = BASE - h;
          return (
            <g key={b.n}>
              <rect
                className={`v-command-of-evidence-quantitative--grouped-bars-a v-command-of-evidence-quantitative--grouped-bars-g${b.n}`}
                x={b.x}
                y={top}
                width={BAR_W}
                height={h}
                rx={3}
                fill={b.sun ? C.soft : C.fill}
                stroke={b.sun ? C.primary : C.muted}
                strokeWidth={1.5}
              />
              <text className={`v-command-of-evidence-quantitative--grouped-bars-a v-command-of-evidence-quantitative--grouped-bars-v${b.n}`} x={b.x + BAR_W / 2} y={top - 3} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink}>
                {b.v}
              </text>
              <text className={`v-command-of-evidence-quantitative--grouped-bars-a v-command-of-evidence-quantitative--grouped-bars-v${b.n}`} x={b.x + BAR_W / 2} y={BASE - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.muted}>
                {b.plot}
              </text>
              <text x={b.x + BAR_W / 2} y={149} textAnchor="middle" fontSize={11} fill={C.muted}>
                {b.label}
              </text>
            </g>
          );
        })}

        <text x={72} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          8 h sun
        </text>
        <text x={160} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          4 h sun
        </text>

        {/* Watering: the two bars inside one group differ by 2–3 cm */}
        <g className={`v-command-of-evidence-quantitative--grouped-bars-a v-command-of-evidence-quantitative--grouped-bars-water`}>
          <path d="M40 50 V46 H104 V50" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text x={72} y={39} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
            watering: 2–3 cm
          </text>
        </g>

        {/* Sun: the two groups differ by about 35 cm */}
        <g className={`v-command-of-evidence-quantitative--grouped-bars-a v-command-of-evidence-quantitative--grouped-bars-sun`}>
          <path d={`M104 ${BASE - 95 * K} H212 M158 ${BASE - 60 * K} H212`} fill="none" stroke={C.primary} strokeWidth={1} strokeDasharray="3 3" />
          <path d={`M206 ${BASE - 95 * K} H214 V${BASE - 60 * K} H206`} fill="none" stroke={C.primary} strokeWidth={2} />
          <text x={222} y={BASE - 78 * K - 4} fontSize={12} fontWeight={700} fill={C.primary}>
            sun:
          </text>
          <text x={222} y={BASE - 78 * K + 12} fontSize={12} fontWeight={700} fill={C.primary}>
            about 35 cm
          </text>
        </g>
      </g>
    </Svg>
  );
}
