import { C, Css, Svg, Tex } from "./kit";

// Two lines cross once, never, or are the same line: the slopes (and intercepts) decide.
export const alt =
  "Three graphs. Different slopes: the lines cross once, 1 solution. Same slope, different intercepts: parallel, 0 solutions. Same line written twice: infinitely many solutions.";

const P = "v-systems-linear--three-cases-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay to the end of the loop, then fade out. */
const show = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 }`);
/** Draw a line: dash offset 100 -> 0 between t% and t+8%. */
const draw = (n: string, t: number) =>
  r(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 8}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }`, "stroke-dasharray: 100;");
const pop = (n: string, t: number) =>
  r(n, `0%, ${t}% { opacity: 0; transform: scale(0.2) } ${t + 3}% { opacity: 1; transform: scale(1.5) } ${t + 6}%, 90% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`, "transform-box: fill-box; transform-origin: center;");

const STARTS = [4, 34, 64];
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  ...STARTS.flatMap((t, i) => [
    show(`g${i}`, t),
    draw(`l${i}a`, t + 2),
    draw(`l${i}b`, t + 9),
    show(`e${i}a`, t + 2),
    show(`e${i}b`, t + 9),
    pop(`d${i}`, t + 17),
    show(`m${i}`, t + 17),
    show(`w${i}`, t + 21),
    show(`z${i}`, t + 22),
  ]),
].join(" ");

// Each panel is 90 wide at x0; the grid box is 90 x 64 at y 10, origin at (x0 + 45, 42), 6 px per unit.
const OX = (x0: number, x: number) => x0 + 45 + 6 * x;
const OY = (y: number) => 42 - 6 * y;
const XS = [16, 115, 214];

type Pair = { l1: [number, number, number, number]; l2: [number, number, number, number]; e1: string; e2: string; m: string; word: string; res: string; resColor: string };
// Lines as [x1, y1, x2, y2] in grid units.
const PANELS: Pair[] = [
  { l1: [-2.3, -3.6, 2.1, 5.2], l2: [-1.2, 5.2, 7.2, -3.2], e1: String.raw`y=2x+1`, e2: String.raw`y=-x+4`, m: String.raw`m=2,\;m=-1`, word: "different slopes", res: "1 solution", resColor: C.good },
  { l1: [-2.3, -3.6, 2.1, 5.2], l2: [-1.1, -5.2, 4.1, 5.2], e1: String.raw`y=2x+1`, e2: String.raw`y=2x-3`, m: String.raw`m=2,\;m=2`, word: "same slope", res: "0 solutions", resColor: C.bad },
  { l1: [-2.3, -3.6, 2.1, 5.2], l2: [-2.3, -3.6, 2.1, 5.2], e1: String.raw`y=2x+1`, e2: String.raw`2y=4x+2`, m: String.raw`m=2,\;m=2`, word: "same line", res: "infinitely many", resColor: C.good },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {PANELS.map((p, i) => {
        const x0 = XS[i];
        const same = i === 2;
        return (
          <g key={i}>
            <g className={cls(`g${i}`)}>
              <rect x={x0} y={10} width={90} height={64} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <path d={`M${OX(x0, -7.2)} ${OY(0)} H${OX(x0, 7.2)} M${OX(x0, 0)} ${OY(5.2)} V${OY(-5.2)}`} fill="none" stroke={C.line} strokeWidth={1.5} />
            </g>
            <line
              className={cls(`l${i}a`)}
              x1={OX(x0, p.l1[0])}
              y1={OY(p.l1[1])}
              x2={OX(x0, p.l1[2])}
              y2={OY(p.l1[3])}
              pathLength={100}
              stroke={same ? C.muted : C.ink}
              strokeWidth={same ? 6 : 2.5}
            />
            <line className={cls(`l${i}b`)} x1={OX(x0, p.l2[0])} y1={OY(p.l2[1])} x2={OX(x0, p.l2[2])} y2={OY(p.l2[3])} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
            {i === 0 && <circle className={cls("d0")} cx={OX(x0, 1)} cy={OY(3)} r={4.5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />}
            <g className={cls(`e${i}a`)}>
              <Tex x={x0 + 45} y={90} size={12} width={90}>
                {p.e1}
              </Tex>
            </g>
            <g className={cls(`e${i}b`)}>
              <Tex x={x0 + 45} y={105} size={12} color={C.primaryText} width={90}>
                {p.e2}
              </Tex>
            </g>
            <g className={cls(`m${i}`)}>
              <Tex x={x0 + 45} y={124} size={13} color={C.primaryText} width={90}>
                {p.m}
              </Tex>
            </g>
            <text className={cls(`w${i}`)} x={x0 + 45} y={146} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} stroke="none">
              {p.word}
            </text>
            <text className={cls(`z${i}`)} x={x0 + 45} y={164} textAnchor="middle" fontSize={i === 2 ? 12 : 14} fontWeight={700} fill={p.resColor} stroke="none">
              {p.res}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}
