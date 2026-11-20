import { C, Css, Svg } from "./kit";

// Elimination when nothing cancels yet: multiply one equation first so 4y and −4y cancel.
export const alt =
  "The system 3x + 2y = 13 and 5x − 4y = 7. Multiply the first equation by 2 to get 6x + 4y = 26. Now 4y and −4y cancel when you add: 11x = 33, so x = 3.";

const P = "v-systems-linear--multiply-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-systems-linear--multiply-a { animation: 9s ease-in-out infinite; }
${[4, 20, 30, 44, 56, 70].map(fade).join("\n")}
.v-systems-linear--multiply-hot { fill: ${C.primaryText}; animation-name: v-systems-linear--multiply-hot; }
@keyframes v-systems-linear--multiply-hot { 0%, 44% { fill: ${C.ink} } 50%, 90% { fill: ${C.primaryText} } 97%, 100% { fill: ${C.ink} } }
`;
const a = `${P}a`;
const hot = `${P}hot`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The system */}
      <g className={`${a} ${fc(4)}`}>
        <text x={16} y={46} fontSize={15} fontWeight={700} fill={C.ink}>
          3x + 2y = 13
        </text>
        <text x={16} y={82} fontSize={15} fontWeight={700} fill={C.ink}>
          5x − 4y = 7
        </text>
      </g>

      {/* Multiply the first by 2 */}
      <g className={`${a} ${fc(20)}`}>
        <path d="M130 41 H154 M148 36 L154 41 L148 46" fill="none" stroke={C.primary} strokeWidth={2} />
        <text x={142} y={32} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
          × 2
        </text>
      </g>
      <g className={`${a} ${fc(30)}`}>
        <text x={170} y={46} fontSize={15} fontWeight={700} fill={C.ink}>
          6x + <tspan className={`${a} ${hot}`}>4y</tspan> = 26
        </text>
        <text x={170} y={82} fontSize={15} fontWeight={700} fill={C.ink}>
          5x <tspan className={`${a} ${hot}`}>− 4y</tspan> = 7
        </text>
      </g>

      {/* Add them */}
      <g className={`${a} ${fc(44)}`}>
        <line x1={166} y1={96} x2={300} y2={96} stroke={C.muted} strokeWidth={1.5} />
        <text x={150} y={102} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.muted}>
          +
        </text>
        <text x={170} y={122} fontSize={16} fontWeight={700} fill={C.ink}>
          11x = 33
        </text>
        <text x={20} y={122} fontSize={12} fill={C.muted}>
          4y and −4y cancel
        </text>
      </g>
      <g className={`${a} ${fc(70)}`}>
        <rect x={166} y={134} width={96} height={30} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <text x={214} y={156} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.good}>
          x = 3
        </text>
      </g>
    </Svg>
  );
}
