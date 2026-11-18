import { C, Css, Svg } from "./kit";

// Nonlinear functions: two shapes. A parabola has a vertex (its turning point); an exponential has a start and
// a multiplier. Left: y = −5(x − 3)² + 45, vertex (3, 45). Right: y = 300(1.2)^x, start 300, × 1.2 each step.
export const alt =
  "Left: the parabola y = −5(x − 3)² + 45 has its vertex, the turning point, at (3, 45). Right: the exponential y = 300(1.2)^x starts at 300 and multiplies by 1.2 at each step.";

const P = "v-nonlinear-functions-";
const fc = (t: number) => `${P}f${t}`;
const dc = (t: number) => `${P}d${t}`;
const pc = (t: number) => `${P}p${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 16}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const pop = (t: number) => {
  const n = pc(t);
  return `.${n} { transform-box: fill-box; transform-origin: center; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { transform: scale(0); opacity: 1 } ${t + 3}% { transform: scale(1.6) } ${t + 6}%, 90% { transform: none; opacity: 1 } 97%, 100% { transform: none; opacity: 0 } }`;
};
const css = `
.v-nonlinear-functions-a { animation: 9s ease-in-out infinite; }
${[4, 30, 36, 48, 74, 80, 86].map(fade).join("\n")}
${[8, 52].map(draw).join("\n")}
${[26, 72].map(pop).join("\n")}
`;
const a = `${P}a`;

// Left panel at x0 = 16, right panel at x0 = 164; both 140 wide, y 34 to 130, x-axis at y = 124.
// Left: x px = x0 + 14 + 18x (x from 0 to 6), y px = 124 − 1.8y (y from 0 to 45).
// Right: x px = x0 + 14 + 18x, y px = 124 − 0.09y.
const PX = (x0: number, x: number) => x0 + 14 + 18 * x;
const EXP = Array.from({ length: 25 }, (_, i) => {
  const x = i / 4;
  return `${i === 0 ? "M" : "L"}${PX(164, x).toFixed(1)} ${(124 - 0.09 * 300 * Math.pow(1.2, x)).toFixed(1)}`;
}).join(" ");

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Left: the parabola and its vertex */}
      <g className={`${a} ${fc(4)}`}>
        <rect x={16} y={34} width={140} height={96} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <path d="M30 42 V124 H146" fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={86} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          y = −5(x − 3)² + 45
        </text>
      </g>
      <path className={`${a} ${dc(8)}`} d={`M${PX(16, 0)} 124 Q${PX(16, 3)} ${124 - 1.8 * 90} ${PX(16, 6)} 124`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
      <circle className={`${a} ${pc(26)}`} cx={PX(16, 3)} cy={124 - 1.8 * 45} r={5} fill={C.primary} />
      <g className={`${a} ${fc(30)}`}>
        <text x={PX(16, 3)} y={84} textAnchor="middle" fontSize={12} fill={C.muted}>
          vertex
        </text>
        <text x={PX(16, 3)} y={100} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary}>
          (3, 45)
        </text>
      </g>
      <g className={`${a} ${fc(36)}`}>
        <text x={86} y={148} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          quadratic
        </text>
        <text x={86} y={163} textAnchor="middle" fontSize={11} fill={C.muted}>
          vertex = turning point
        </text>
      </g>

      {/* Right: the exponential, its start and its multiplier */}
      <g className={`${a} ${fc(48)}`}>
        <rect x={164} y={34} width={140} height={96} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <path d="M178 42 V124 H294" fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={234} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          y = 300 · 1.2
          <tspan dy={-5} fontSize={10}>
            x
          </tspan>
        </text>
      </g>
      <path className={`${a} ${dc(52)}`} d={EXP} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
      <circle className={`${a} ${pc(72)}`} cx={PX(164, 0)} cy={124 - 27} r={5} fill={C.primary} />
      <g className={`${a} ${fc(74)}`}>
        <text x={PX(164, 0) + 10} y={116} fontSize={12} fontWeight={700} fill={C.primary}>
          start 300
        </text>
      </g>
      <g className={`${a} ${fc(80)}`}>
        <text x={252} y={98} fontSize={13} fontWeight={700} fill={C.primary}>
          × 1.2
        </text>
        <text x={252} y={112} fontSize={11} fill={C.muted}>
          each step
        </text>
      </g>
      <g className={`${a} ${fc(86)}`}>
        <text x={234} y={148} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          exponential
        </text>
        <text x={234} y={163} textAnchor="middle" fontSize={11} fill={C.muted}>
          start × multiplier
        </text>
      </g>
    </Svg>
  );
}
