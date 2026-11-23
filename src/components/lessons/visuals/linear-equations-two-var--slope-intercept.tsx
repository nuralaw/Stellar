import { C, Css, Svg, Tex } from "./kit";

// y = mx + b: b is where the line crosses the y-axis (the start), m is how far it rises per 1 step right.
// y = 2x + 1, then b becomes -2 (the line slides down), then m becomes -1 (the line tilts about its start).
export const alt =
  "A line y = 2x + 1 on a grid. It crosses the y-axis at (0, 1), the start b = 1, and rises 2 for each 1 step right, so m = 2. Changing b to −2 slides the line down; changing m to −1 tilts it down.";

const P = "v-linear-equations-two-var--slope-intercept-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d: number) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
// one text in a series: visible between t0 and t1 (a series ending the loop passes t1 = 100)
const seq = (n: string, t0: number, t1: number) => {
  const end = t1 >= 100; // the last of a series stays: it is the final frame
  const on = t0 === 0 ? `0%, ${t1}% { opacity: 1 }` : `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 }`;
  const off = end ? "" : ` ${t1 + 3}%, 100% { opacity: 0 }`;
  return r(n, on + off, end ? "" : "opacity: 0;");
};
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 3%, 94% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  // the dot lands, the triangle draws, the line is drawn through it
  r("dot", "0%, 12% { transform: scale(0); opacity: 0 } 16% { transform: scale(1.5); opacity: 1 } 19%, 100% { transform: scale(1); opacity: 1 }", "transform-box: fill-box; transform-origin: center;"),
  draw("run", 24, 6),
  draw("rise", 30, 6),
  pop("tl1", 30),
  pop("tl2", 36),
  draw("line", 36, 8),
  // b changes: everything slides down 3 units (3 x 15 = 45)
  r("slide", "0%, 50% { transform: none } 60%, 100% { transform: translateY(45px) }", "transform: translateY(45px);"),
  // m changes: the line tilts about its start; the old triangle gives way to the new one
  r("rot", "0%, 70% { transform: none } 80%, 100% { transform: rotate(108.43deg) }", "transform: rotate(108.43deg); transform-box: view-box; transform-origin: 92px 67px;"),
  r("tri1", "0%, 68% { opacity: 1 } 71%, 100% { opacity: 0 }", "opacity: 0;"),
  r("tri2", "0%, 78% { opacity: 0 } 82%, 100% { opacity: 1 }"),
  // equation, b and m readouts
  seq("e1", 0, 52),
  seq("e2", 52, 71),
  seq("e3", 71, 100),
  pop("brow", 12),
  seq("b1", 0, 52),
  seq("b2", 52, 100),
  pop("mrow", 38),
  seq("m1", 0, 71),
  seq("m2", 71, 100),
].join("\n");
// the b / m readouts fade in with their rows: b1 and m1 sit inside rows that pop in on their own

const O = { x: 92, y: 82 };
const U = 15;
const px = (x: number) => O.x + U * x;
const py = (y: number) => O.y - U * y;
const lab = { stroke: "none" } as const;
const T = (x: number, y: number, s: string, o: { color?: string; size?: number; w?: number } = {}) => (
  <Tex x={x} y={y} size={o.size ?? 22} width={o.w ?? 110} color={o.color ?? C.ink}>
    {s}
  </Tex>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the grid: x from -4 to 6, y from -5 to 4 */}
        <g stroke={C.line} strokeWidth={1}>
          {[-4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((k) => (
            <line key={`x${k}`} x1={px(k)} y1={py(-5)} x2={px(k)} y2={py(4)} />
          ))}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4].map((k) => (
            <line key={`y${k}`} x1={px(-4)} y1={py(k)} x2={px(6)} y2={py(k)} />
          ))}
        </g>
        <path d={`M${px(-4)} ${py(0)} H${px(6)} M${px(0)} ${py(-5)} V${py(4)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* the line, its start and its slope triangle: they slide down together, the line tilts on its own */}
        <g className={cls("slide")}>
          <g className={cls("rot")}>
            <line className={cls("line")} x1={74} y1={103} x2={110} y2={31} pathLength={100} stroke={C.muted} strokeWidth={3} />
          </g>
          <g className={cls("tri1")}>
            <path className={cls("run")} d={`M${px(0)} ${py(1)} H${px(1)}`} pathLength={100} stroke={C.ink} strokeWidth={2.5} fill="none" />
            <path className={cls("rise")} d={`M${px(1)} ${py(1)} V${py(3)}`} pathLength={100} stroke={C.ink} strokeWidth={2.5} fill="none" />
            <text className={cls("tl1")} x={px(0.5) + 6} y={py(1) + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
              run 1
            </text>
            <text className={cls("tl2")} x={px(1) + 6} y={py(2) + 4} fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
              rise 2
            </text>
          </g>
          <g className={cls("tri2")}>
            <path d={`M${px(0)} ${py(1)} H${px(1)} V${py(0)}`} stroke={C.ink} strokeWidth={2.5} fill="none" />
            <text x={px(0.5)} y={py(1) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
              run 1
            </text>
            <text x={px(1) + 6} y={py(0.5) + 4} fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
              rise −1
            </text>
          </g>
          <g className={cls("dot")} fill={C.primary}>
            <circle cx={px(0)} cy={py(1)} r={10} opacity={0.2} />
            <circle cx={px(0)} cy={py(1)} r={5} />
          </g>
        </g>

        {/* the equation */}
        <g className={cls("e1")}>{T(250, 28, String.raw`y=2x+1`)}</g>
        <g className={cls("e2")}>{T(250, 28, String.raw`y=2x-2`)}</g>
        <g className={cls("e3")}>{T(250, 28, String.raw`y={-}x-2`)}</g>

        {/* b: where the line starts on the y-axis */}
        <g className={cls("brow")}>
          <g className={cls("b1")}>
            {T(250, 76, String.raw`b=1`, { color: C.primaryText, w: 90 })}
            <text x={250} y={100} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
              start (0, 1)
            </text>
          </g>
          <g className={cls("b2")}>
            {T(250, 76, String.raw`b={-}2`, { color: C.primaryText, w: 90 })}
            <text x={250} y={100} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
              start (0, −2)
            </text>
          </g>
        </g>
        {/* m: how far it rises per 1 step right */}
        <g className={cls("mrow")}>
          <g className={cls("m1")}>{T(250, 130, String.raw`m=2`, { w: 90 })}</g>
          <g className={cls("m2")}>{T(250, 130, String.raw`m={-}1`, { w: 90 })}</g>
          <text x={250} y={154} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
            per 1 step right
          </text>
        </g>
      </g>
    </Svg>
  );
}
