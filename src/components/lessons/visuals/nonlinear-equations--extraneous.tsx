import { C, Css, Svg } from "./kit";

// √(x + 6) = x: squaring adds the lower branch −√(x + 6). The line y = x meets the top branch at (3, 3) only; (−2, −2) is a fake.
export const alt =
  "The line y = x meets the top branch y = √(x + 6) at (3, 3), a real solution. It meets the bottom branch y = −√(x + 6) at (−2, −2): a fake solution.";

const P = "v-nonlinear-equations--extraneous-";
const fc = (t: number) => `${P}f${t}`;
const dc = (t: number) => `${P}d${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 12}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const css = `
.v-nonlinear-equations--extraneous-a { animation: 9s ease-in-out infinite; }
${[4, 44, 56, 70, 80].map(fade).join("\n")}
${[8, 24, 56].map(draw).join("\n")}
`;
const a = `${P}a`;

// Grid unit 14 px, origin (110, 92): point (x, y) -> (110 + 14x, 92 - 14y).
const px = (x: number) => 110 + 14 * x;
const py = (y: number) => 92 - 14 * y;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {/* Axes */}
      <g className={`${a} ${fc(4)}`}>
        <path d={`M${px(-6.5)} ${py(0)} H${px(5)} M${px(0)} ${py(3.5)} V${py(-3.5)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      </g>

      {/* Top branch y = √(x + 6): (−6, 0) to (3, 3), control (−6, 1.5) */}
      <path className={`${a} ${dc(8)}`} d={`M${px(-6)} ${py(0)} Q${px(-6)} ${py(1.5)} ${px(3)} ${py(3)}`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
      {/* The line y = x */}
      <line className={`${a} ${dc(24)}`} x1={px(-3.2)} y1={py(-3.2)} x2={px(3.5)} y2={py(3.5)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      {/* Bottom branch y = −√(x + 6), shown after squaring */}
      <path
        className={`${a} ${dc(56)}`}
        d={`M${px(-6)} ${py(0)} Q${px(-6)} ${py(-1.5)} ${px(3)} ${py(-3)}`}
        pathLength={100}
        fill="none"
        stroke={C.muted}
        strokeWidth={2.5}
      />

      {/* (3, 3): real */}
      <g className={`${a} ${fc(44)}`}>
        <circle cx={px(3)} cy={py(3)} r={5} fill={C.good} />
      </g>
      {/* (−2, −2): fake */}
      <g className={`${a} ${fc(70)}`}>
        <circle cx={px(-2)} cy={py(-2)} r={5} fill={C.bad} />
      </g>

      {/* Verdicts */}
      <g className={`${a} ${fc(4)}`}>
        <text x={200} y={44} fontSize={14} fontWeight={700} fill={C.ink}>
          √(x + 6) = x
        </text>
      </g>
      <g className={`${a} ${fc(44)}`}>
        <text x={200} y={78} fontSize={14} fontWeight={700} fill={C.good}>
          x = 3 works
        </text>
      </g>
      <g className={`${a} ${fc(70)}`}>
        <text x={200} y={108} fontSize={14} fontWeight={700} fill={C.bad}>
          x = −2 fails
        </text>
      </g>
      <g className={`${a} ${fc(80)}`}>
        <text x={200} y={128} fontSize={11} fill={C.muted}>
          √4 is 2, not −2
        </text>
      </g>
    </Svg>
  );
}
