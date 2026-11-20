import { C, Css, Svg } from "./kit";

// Command of evidence (quantitative), "Read the lines": two series over four years; Site X starts below Site Y and ends above it.
export const alt = "Line graph of daily visitors, 2019 to 2022. Site X: 40, 50, 70, 90. Site Y: 60, 60, 60, 50. The lines cross between 2020 and 2021, when Site X passes Site Y.";

const P = "v-command-of-evidence-quantitative--line-trend-";

const show = (n: string, t: number) => `.${P}${n} { animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { opacity: 0; transform: translateY(4px) } ${t + 6}%, 100% { opacity: 1; transform: none } }`;
const draw = (n: string, t: number, d: number) => `.${P}${n} { stroke-dasharray: 100; animation-name: ${P}${n}; }
@keyframes ${P}${n} { 0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 } }`;

const css = `
.v-command-of-evidence-quantitative--line-trend-a { animation: 10s ease-in-out infinite; }
.v-command-of-evidence-quantitative--line-trend-scene { animation-name: v-command-of-evidence-quantitative--line-trend-scene; }
@keyframes v-command-of-evidence-quantitative--line-trend-scene { 0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }
${draw("ly", 6, 20)}
${draw("lx", 28, 24)}
${show("py", 22)}
${show("px", 50)}
${show("cross", 62)}
${show("names", 52)}
`;

const XS = [48, 112, 176, 240];
const yOf = (v: number) => 142 - (v - 40) * 1.3;
const X = [40, 50, 70, 90];
const Y = [60, 60, 60, 50];
const pts = (vs: number[]) => vs.map((v, i) => `${XS[i]} ${yOf(v)}`);
const line = (vs: number[]) => "M" + pts(vs).join(" L");

// X below the point where it would hit the Y line, above elsewhere.
const xLabelDy = [-8, 14, -8, -8];
const yLabelDy = [-8, -8, 14, 14];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-scene`}>
        <text x={16} y={22} fontSize={11} fill={C.muted}>
          visitors per day
        </text>
        <path d="M34 150 H252" stroke={C.muted} strokeWidth={1.5} fill="none" />
        {XS.map((x, i) => (
          <text key={x} x={x} y={165} textAnchor="middle" fontSize={11} fill={C.muted}>
            {2019 + i}
          </text>
        ))}

        {/* Site Y */}
        <path className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-ly`} d={line(Y)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
        <g className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-py`}>
          {Y.map((v, i) => (
            <g key={i}>
              <rect x={XS[i] - 4} y={yOf(v) - 4} width={8} height={8} fill={C.bg} stroke={C.ink} strokeWidth={2} />
              <text x={XS[i]} y={yOf(v) + yLabelDy[i]} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>
                {v}
              </text>
            </g>
          ))}
        </g>

        {/* Site X */}
        <path className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-lx`} d={line(X)} pathLength={100} fill="none" stroke={C.primary} strokeWidth={3} />
        <g className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-px`}>
          {X.map((v, i) => (
            <g key={i}>
              <circle cx={XS[i]} cy={yOf(v)} r={4.5} fill={C.primary} />
              <text x={XS[i]} y={yOf(v) + xLabelDy[i]} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText}>
                {v}
              </text>
            </g>
          ))}
        </g>

        <g className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-names`}>
          <text x={250} y={yOf(90) + 4} fontSize={12} fontWeight={700} fill={C.primaryText}>
            Site X
          </text>
          <text x={250} y={yOf(50) + 4} fontSize={12} fontWeight={700} fill={C.ink}>
            Site Y
          </text>
        </g>

        {/* The crossing: X passes Y between 2020 and 2021 */}
        <g className={`v-command-of-evidence-quantitative--line-trend-a v-command-of-evidence-quantitative--line-trend-cross`}>
          <circle cx={144} cy={116} r={8} fill="none" stroke={C.primary} strokeWidth={2} />
          <path d="M144 96 V107" stroke={C.primary} strokeWidth={1.5} fill="none" />
          <text x={150} y={92} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            X passes Y
          </text>
        </g>
      </g>
    </Svg>
  );
}
