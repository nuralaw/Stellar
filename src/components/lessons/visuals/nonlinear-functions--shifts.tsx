import { C, Css, Svg, Tex } from "./kit";

// Shifts of f(x) = (x − 5)² + 2 (vertex (5, 2)): f(x + 3) moves LEFT 3 (inside, "backward"), f(x + 3) − 4 then moves
// DOWN 4 (outside), and −f(x) flips it over the x-axis. Drawn: 17 px per x unit, 8 px per y unit.
export const alt =
  "The parabola f(x) = (x − 5)² + 2 with vertex (5, 2). f(x + 3) slides it left 3 to (2, 2), f(x + 3) − 4 slides it down 4 to (2, −2), and −f(x) flips it over the x-axis. Inside is backward.";

const P = "v-nonlinear-functions--shifts-";
const fc = (t: number) => `${P}f${t}`;
const wc = (t: number) => `${P}w${t}`;
const dc = (t: number) => `${P}d${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 4}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
// Visible only between t and u (the still frame hides it: its element carries opacity={0}).
const win = (t: number, u: number) => {
  const n = wc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 4}%, ${u}% { opacity: 1 } ${u + 4}%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 12}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const CP = `${P}copy`;
const FL = `${P}flip`;
const LB = `${P}lbl`;
const css = `
.v-nonlinear-functions--shifts-a { animation: 12s ease-in-out infinite; }
${[2, 18, 36, 52, 80].map(fade).join("\n")}
${win(30, 46)}
${win(38, 46)}
${win(46, 58)}
${win(68, 76)}
${draw(4)}
.${CP} { animation-name: ${CP}; }
@keyframes ${CP} {
  0%, 24% { opacity: 0; transform: none }
  28% { opacity: 1; transform: none }
  36%, 44% { opacity: 1; transform: translate(-51px, 0) }
  52%, 62% { opacity: 1; transform: translate(-51px, 32px) }
  66%, 76% { opacity: 0.12; transform: translate(-51px, 32px) }
  80%, 90% { opacity: 1; transform: translate(-51px, 32px) }
  97%, 100% { opacity: 0; transform: translate(-51px, 32px) }
}
.${LB} { animation-name: ${LB}; }
@keyframes ${LB} { 0%, 52% { opacity: 0 } 56%, 62% { opacity: 1 } 66%, 76% { opacity: 0.12 } 80%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }
.${FL} { transform-box: view-box; transform-origin: 0px 84px; animation-name: ${FL}; }
@keyframes ${FL} {
  0%, 64% { opacity: 0; transform: none }
  66% { opacity: 1; transform: none }
  72%, 76% { opacity: 1; transform: scaleY(-1) }
  81%, 100% { opacity: 0; transform: scaleY(-1) }
}
`;
const a = `${P}a`;
const lab = { stroke: "none" } as const;

// Point (x, y) -> (46 + 17x, 84 − 8y). The curve is f(x) = (x − 5)² + 2 drawn up to height 8.
const px = (x: number) => 46 + 17 * x;
const py = (y: number) => 84 - 8 * y;
const R = Math.sqrt(6);
const CURVE = Array.from({ length: 41 }, (_, i) => {
  const x = 5 - R + (2 * R * i) / 40;
  return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)} ${py((x - 5) ** 2 + 2).toFixed(1)}`;
}).join(" ");

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Axes, the original graph and its formula */}
      <g className={`${a} ${fc(2)}`}>
        <line x1={px(0)} y1={py(7.6)} x2={px(0)} y2={py(-8)} stroke={C.line} strokeWidth={1.5} />
        <line x1={px(-0.6)} y1={py(0)} x2={px(8.2)} y2={py(0)} stroke={C.muted} strokeWidth={1.5} />
        <Tex x={192} y={24} size={12} anchor="start" width={116}>{String.raw`f(x)=(x-5)^2+2`}</Tex>
      </g>
      <path className={`${a} ${dc(4)}`} d={CURVE} pathLength={100} fill="none" stroke={C.muted} strokeWidth={2.5} />
      <g className={`${a} ${fc(18)}`}>
        <circle cx={px(5)} cy={py(2)} r={4} fill={C.muted} />
        <text x={px(5) + 9} y={py(2) + 8} fontSize={11} fontWeight={600} fill={C.muted} {...lab}>(5, 2)</text>
      </g>

      {/* The moving copy: left 3, then down 4 */}
      <g className={`${a} ${CP}`} transform="translate(-51 32)">
        <path d={CURVE} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <circle cx={px(5)} cy={py(2)} r={5} fill={C.primary} />
      </g>
      <g className={`${a} ${wc(30)}`} opacity={0}>
        <path d={`M${px(5) - 10} ${py(2)} H${px(2) + 8} M${px(2) + 14} ${py(2) - 4} L${px(2) + 8} ${py(2)} L${px(2) + 14} ${py(2) + 4}`} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <text x={(px(2) + px(5)) / 2} y={py(2) + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>left 3</text>
      </g>
      <g className={`${a} ${wc(38)}`} opacity={0}>
        <text x={px(2)} y={py(2) - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>(2, 2)</text>
        <Tex x={192} y={46} size={14} anchor="start" width={112} color={C.primaryText}>{String.raw`f(x+3)`}</Tex>
        <Tex x={192} y={72} size={12} anchor="start" width={112} color={C.muted}>{String.raw`x+3=5\ \text{at}\ x=2`}</Tex>
      </g>
      <g className={`${a} ${wc(46)}`} opacity={0}>
        <path d={`M${px(2)} ${py(2) + 8} V${py(-2) - 8} M${px(2) - 4} ${py(-2) - 14} L${px(2)} ${py(-2) - 8} L${px(2) + 4} ${py(-2) - 14}`} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <text x={px(2) - 7} y={py(0) + 28} textAnchor="end" fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>down 4</text>
      </g>
      <g className={`${a} ${fc(52)}`}>
        <Tex x={192} y={46} size={14} anchor="start" width={112} color={C.primaryText}>{String.raw`f(x+3)-4`}</Tex>
      </g>
      <text className={`${a} ${LB}`} x={px(2) + 9} y={py(-2) + 8} fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>(2, −2)</text>

      {/* The flip: −f(x) mirrors the original over the x-axis */}
      <g className={`${a} ${FL}`} opacity={0}>
        <path d={CURVE} fill="none" stroke={C.ink} strokeWidth={2.5} />
      </g>
      <g className={`${a} ${wc(68)}`} opacity={0}>
        <Tex x={px(5)} y={py(-5.8)} size={13} width={60}>{String.raw`-f(x)`}</Tex>
      </g>

      {/* The rule */}
      <g className={`${a} ${fc(80)}`}>
        <text x={192} y={110} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>inside: left / right,</text>
        <text x={192} y={125} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>backward</text>
        <text x={192} y={150} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>outside: up / down</text>
      </g>
    </Svg>
  );
}
