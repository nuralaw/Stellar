import { C, Css, Svg, Tex } from "./kit";

// A parabola is a mirror image about its axis: two points at the same height are symmetric about it, so the vertex
// is halfway between them, x = −b/2a. Drawn: f(x) = −2x² + 8x + 3, vertex (2, 11), mirror points (0, 3) and (4, 3).
export const alt =
  "The parabola f(x) = −2x² + 8x + 3 is a mirror image about its axis. The points at x = 0 and x = 4 share a height, their midpoint is x = 2, and −b/2a agrees: the vertex is (2, 11).";

const P = "v-nonlinear-functions--axis-";
const fc = (t: number) => `${P}f${t}`;
const wc = (t: number) => `${P}w${t}`;
const dc = (t: number) => `${P}d${t}`;
const pc = (t: number) => `${P}p${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
// Visible only between t and u (the still frame hides it: its element carries opacity={0}).
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
const css = `
.v-nonlinear-functions--axis-a { animation: 10s ease-in-out infinite; }
${[2, 28, 40, 46, 56, 62, 68, 76, 84].map(fade).join("\n")}
${[40].map((t) => win(t, 50)).join("\n")}
${[6, 24, 38].map(draw).join("\n")}
${[42, 68].map(pop).join("\n")}
`;
const a = `${P}a`;

// f(x) = −2x² + 8x + 3. Point (x, y) -> (40 + 30x, 152 − 10.5y). Zero line y = 0 is at 152.
const px = (x: number) => 40 + 30 * x;
const py = (y: number) => 152 - 10.5 * y;
const f = (x: number) => -2 * x * x + 8 * x + 3;
const CURVE = Array.from({ length: 47 }, (_, i) => {
  const x = -0.3 + i * 0.1;
  return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py(f(x)).toFixed(1)}`;
}).join(" ");
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Axes and the function */}
      <g className={`${a} ${fc(2)}`}>
        <path d={`M${px(0)} ${py(11.6)} V${py(0)} H${px(4.6)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <Tex x={184} y={24} size={13} anchor="start" width={124}>{String.raw`f(x)=-2x^2+8x+3`}</Tex>
      </g>
      <path className={`${a} ${dc(6)}`} d={CURVE} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />

      {/* The axis of symmetry */}
      <line className={`${a} ${dc(24)}`} x1={px(2)} y1={py(11.4)} x2={px(2)} y2={py(0)} pathLength={100} stroke={C.primary} strokeWidth={2} strokeDasharray="4 4" />
      <text className={`${a} ${fc(28)}`} x={px(2)} y={22} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.primaryText} {...lab}>
        axis of symmetry
      </text>

      {/* Two points at the same height: mirror images of each other */}
      <g className={`${a} ${fc(38)}`}>
        <line x1={px(-0.3)} y1={py(3)} x2={px(4.3)} y2={py(3)} stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
        <line x1={px(0)} y1={py(3)} x2={px(0)} y2={py(0)} stroke={C.ink} strokeWidth={1.5} strokeDasharray="2 3" />
        <line x1={px(4)} y1={py(3)} x2={px(4)} y2={py(0)} stroke={C.ink} strokeWidth={1.5} strokeDasharray="2 3" />
        <text x={px(0)} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>0</text>
        <text x={px(4)} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>4</text>
      </g>
      <circle className={`${a} ${pc(40)}`} cx={px(0)} cy={py(3)} r={4.5} fill={C.ink} />
      <circle className={`${a} ${pc(40)}`} cx={px(4)} cy={py(3)} r={4.5} fill={C.ink} />
      <path className={`${a} ${pc(42)}`} d={`M${px(2)} ${py(3) - 6} L${px(2) + 6} ${py(3)} L${px(2)} ${py(3) + 6} L${px(2) - 6} ${py(3)} Z`} fill={C.primary} />

      {/* Midpoint arithmetic (then replaced by the formula) */}
      <g className={`${a} ${wc(40)}`} opacity={0}>
        <Tex x={190} y={66} size={14} anchor="start" width={110} color={C.primaryText}>{String.raw`\dfrac{0+4}{2}=2`}</Tex>
        <text x={190} y={98} fontSize={12} fill={C.muted} {...lab}>same height,</text>
        <text x={190} y={113} fontSize={12} fill={C.muted} {...lab}>mirror points</text>
      </g>

      {/* The formula agrees */}
      <g className={`${a} ${fc(56)}`}>
        <Tex x={190} y={62} size={14} anchor="start" width={110} color={C.primaryText}>{String.raw`x=-\dfrac{b}{2a}`}</Tex>
      </g>
      <g className={`${a} ${fc(62)}`}>
        <Tex x={190} y={96} size={14} anchor="start" width={116} color={C.primaryText}>{String.raw`=-\dfrac{8}{2(-2)}=2`}</Tex>
      </g>

      {/* The vertex: where and how high */}
      <circle className={`${a} ${pc(68)}`} cx={px(2)} cy={py(11)} r={5.5} fill={C.primary} />
      <text className={`${a} ${fc(68)}`} x={px(2)} y={166} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>2</text>
      <g className={`${a} ${fc(68)}`}>
        <text x={190} y={138} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>where</text>
        <Tex x={238} y={134} size={14} anchor="start" width={60} color={C.primaryText}>{String.raw`x=2`}</Tex>
      </g>
      <g className={`${a} ${fc(76)}`}>
        <line x1={px(-0.3)} y1={py(11)} x2={px(4.3)} y2={py(11)} stroke={C.good} strokeWidth={2} strokeDasharray="4 3" />
        <text x={px(0) - 10} y={py(11) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.good} {...lab}>11</text>
        <text x={190} y={162} fontSize={12} fontWeight={700} fill={C.good} {...lab}>how high</text>
        <Tex x={250} y={158} size={14} anchor="start" width={60} color={C.good}>{String.raw`f(2)=11`}</Tex>
      </g>
      <g className={`${a} ${fc(84)}`}>
        <text x={142} y={52} fontSize={11} fontWeight={600} fill={C.good} {...lab}>touches</text>
        <text x={142} y={64} fontSize={11} fontWeight={600} fill={C.good} {...lab}>once</text>
      </g>
    </Svg>
  );
}
