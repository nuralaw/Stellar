import { C, Css, Svg, Tex } from "./kit";

// One parabola, three forms: y = (x − 2)(x − 8) shows the zeros, y = (x − 5)² − 9 shows the vertex, y = x² − 10x + 16
// shows the y-intercept. Drawn once: zeros (2, 0) and (8, 0), vertex (5, −9), y-intercept (0, 16).
export const alt =
  "The parabola y = x² − 10x + 16 written three ways: (x − 2)(x − 8) gives the zeros 2 and 8, (x − 5)² − 9 gives the vertex (5, −9), and the standard form gives the y-intercept 16.";

const P = "v-nonlinear-functions--forms-";
const fc = (t: number) => `${P}f${t}`;
const wc = (t: number) => `${P}w${t}`;
const dc = (t: number) => `${P}d${t}`;
const pc = (t: number) => `${P}p${t}`;
const yc = (t: number) => `${P}y${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const win = (t: number, u: number) => {
  const n = wc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, ${u}% { opacity: 1 } ${u + 5}%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 14}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const pop = (t: number) => {
  const n = pc(t);
  return `.${n} { transform-box: fill-box; transform-origin: center; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { transform: scale(0); opacity: 1 } ${t + 3}% { transform: scale(1.5) } ${t + 6}%, 90% { transform: none; opacity: 1 } 97%, 100% { transform: none; opacity: 0 } }`;
};
// A number that flies out of the bracket (down onto its dot).
const fly = (t: number) => {
  const n = yc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0; transform: translateY(-18px) } ${t + 5}%, 90% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
};
const css = `
.v-nonlinear-functions--forms-a { animation: 10s ease-in-out infinite; }
${[2, 20, 30, 48, 64, 76, 82].map(fade).join("\n")}
${[
  [28, 40],
  [46, 56],
  [62, 72],
]
  .map(([t, u]) => win(t, u))
  .join("\n")}
${[4].map(draw).join("\n")}
${[30, 48, 64].map(pop).join("\n")}
${[30].map(fly).join("\n")}
`;
const a = `${P}a`;

// y = x² − 10x + 16. Point (x, y) -> (70 + 18x, 20 + 3.8 (16 − y)).
const px = (x: number) => 70 + 18 * x;
const py = (y: number) => 20 + 3.8 * (16 - y);
const CURVE = Array.from({ length: 41 }, (_, i) => {
  const x = i * 0.25;
  return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py(x * x - 10 * x + 16).toFixed(1)}`;
}).join(" ");
const lab = { stroke: "none" } as const;
const ZEROS = [2, 8];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={`${a} ${fc(2)}`}>
        <path d={`M${px(0)} ${py(17)} V${py(0)} M${px(-0.8)} ${py(0)} H${px(10.8)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      </g>
      <path className={`${a} ${dc(4)}`} d={CURVE} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />

      {/* The three features: hollow first, filled when their form shows them */}
      <g className={`${a} ${fc(20)}`}>
        {ZEROS.map((x) => (
          <circle key={x} cx={px(x)} cy={py(0)} r={5} fill={C.bg} stroke={C.primary} strokeWidth={2} />
        ))}
        <circle cx={px(5)} cy={py(-9)} r={5} fill={C.bg} stroke={C.good} strokeWidth={2} />
        <circle cx={px(0)} cy={py(16)} r={5} fill={C.bg} stroke={C.ink} strokeWidth={2} />
      </g>
      {ZEROS.map((x) => (
        <circle key={x} className={`${a} ${pc(30)}`} cx={px(x)} cy={py(0)} r={5} fill={C.primary} />
      ))}
      <circle className={`${a} ${pc(48)}`} cx={px(5)} cy={py(-9)} r={5} fill={C.good} />
      <circle className={`${a} ${pc(64)}`} cx={px(0)} cy={py(16)} r={5} fill={C.ink} />

      {ZEROS.map((x) => (
        <text key={x} className={`${a} ${yc(30)}`} x={px(x)} y={py(0) + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>
          {x}
        </text>
      ))}
      <text className={`${a} ${fc(30)}`} x={px(2) - 12} y={py(0) + 17} textAnchor="end" fontSize={12} fontWeight={600} fill={C.primaryText} {...lab}>
        zeros
      </text>
      <text className={`${a} ${fc(48)}`} x={px(5) + 11} y={py(-9) + 4} fontSize={12} fontWeight={700} fill={C.good} {...lab}>
        vertex (5, −9)
      </text>
      <text className={`${a} ${fc(64)}`} x={px(0) + 12} y={py(16) + 4} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>
        y-intercept (0, 16)
      </text>

      {/* One form at a time (the still frame shows the strip instead) */}
      <g className={`${a} ${wc(28)}`} opacity={0}>
        <Tex x={160} y={142} size={17} width={200} color={C.primaryText}>{String.raw`(x-2)(x-8)`}</Tex>
      </g>
      <g className={`${a} ${wc(46)}`} opacity={0}>
        <Tex x={160} y={142} size={17} width={200} color={C.good}>{String.raw`(x-5)^2-9`}</Tex>
      </g>
      <g className={`${a} ${wc(62)}`} opacity={0}>
        <Tex x={160} y={142} size={17} width={200} color={C.ink}>{String.raw`x^2-10x+16`}</Tex>
      </g>

      {/* All three together, and the vertex halfway between the zeros */}
      <g className={`${a} ${fc(76)}`}>
        <Tex x={56} y={142} size={14} width={96} color={C.primaryText}>{String.raw`(x-2)(x-8)`}</Tex>
        <text x={110} y={147} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.muted} {...lab}>=</text>
        <Tex x={160} y={142} size={14} width={80} color={C.good}>{String.raw`(x-5)^2-9`}</Tex>
        <text x={210} y={147} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.muted} {...lab}>=</text>
        <Tex x={264} y={142} size={14} width={96} color={C.ink}>{String.raw`x^2-10x+16`}</Tex>
        <text x={160} y={166} textAnchor="middle" fontSize={12} fill={C.muted} {...lab}>same graph, three views</text>
      </g>
      <g className={`${a} ${fc(82)}`}>
        <line x1={px(2)} y1={py(0)} x2={px(8)} y2={py(0)} stroke={C.primary} strokeWidth={2.5} />
        <line x1={px(5)} y1={py(0)} x2={px(5)} y2={py(-9) - 7} stroke={C.good} strokeWidth={2} strokeDasharray="4 3" />
        <Tex x={160} y={48} size={13} width={110} color={C.good}>{String.raw`\dfrac{2+8}{2}=5`}</Tex>
      </g>
    </Svg>
  );
}
