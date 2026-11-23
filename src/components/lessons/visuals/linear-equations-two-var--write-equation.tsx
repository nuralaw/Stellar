import { C, Css, Svg, Tex } from "./kit";

// Write a line in two moves: the slope from two points, then one point plugged into y = mx + b to find b.
// Points (1, 7) and (4, -2): m = -3, b = 10, y = -3x + 10, checked with the second point.
export const alt =
  "Two points, (1, 7) and (4, −2), on a line. Step 1: the slope is (−2 − 7) over (4 − 1), which is −3. Step 2: put (1, 7) into y = −3x + b to get b = 10. The line is y = −3x + 10, and (4, −2) checks.";

const P = "v-linear-equations-two-var--write-equation-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d: number) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const seq = (n: string, t0: number, t1: number) => {
  const end = t1 >= 100; // the last of a series stays: it is the final frame
  const on = t0 === 0 ? `0%, ${t1}% { opacity: 1 }` : `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 }`;
  const off = end ? "" : ` ${t1 + 3}%, 100% { opacity: 0 }`;
  return r(n, on + off, end ? "" : "opacity: 0;");
};
const fly = (n: string, t: number, dx: number, dy: number) =>
  r(n, `0%, ${t}% { opacity: 0; transform: none } ${t + 2}% { opacity: 1; transform: none } ${t + 8}% { opacity: 1; transform: translate(${dx}px, ${dy}px) } ${t + 10}%, 100% { opacity: 0; transform: translate(${dx}px, ${dy}px) }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 3%, 94% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  pop("pts", 3),
  draw("line", 8, 8),
  pop("h1", 18),
  draw("run", 18, 5),
  draw("rise", 23, 6),
  pop("tl", 24),
  pop("f1", 30),
  pop("f2", 38),
  pop("h2", 46),
  seq("r1", 46, 53),
  seq("r2", 53, 64),
  seq("r3", 64, 74),
  seq("r4", 74, 100),
  fly("fly1", 50, 105, 54),
  pop("yb", 66),
  fly("fly2", 79, 66, -6),
  pop("chk", 86),
].join("\n");

// grid: x from -1 to 5 (one unit = 16), y from -3 to 11 (one unit = 10.5)
const U = 10.5;
const UX = 16;
const OX = 34;
const OY = 131.5;
const px = (x: number) => OX + UX * x;
const py = (y: number) => OY - U * y;
const lab = { stroke: "none" } as const;
const T = (x: number, y: number, s: string, o: { color?: string; size?: number; w?: number; anchor?: "start" | "middle" | "end" } = {}) => (
  <Tex x={x} y={y} size={o.size ?? 18} anchor={o.anchor ?? "start"} width={o.w ?? 190} color={o.color ?? C.ink}>
    {s}
  </Tex>
);
const layer = (parts: string[], show: number[]) => parts.map((p, i) => (show.includes(i) ? p : String.raw`\phantom{${p}}`)).join("");
const SLOPE = [String.raw`m=\dfrac{-2-7}{4-1}`, String.raw`={-}3`];
const X = 148;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the grid and the line */}
        <g stroke={C.line} strokeWidth={1}>
          {[-1, 1, 2, 3, 4, 5].map((k) => (
            <line key={`x${k}`} x1={px(k)} y1={py(-3)} x2={px(k)} y2={py(11)} />
          ))}
          {[-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => (
            <line key={`y${k}`} x1={px(-1)} y1={py(k)} x2={px(5)} y2={py(k)} />
          ))}
        </g>
        <path d={`M${px(-1)} ${py(0)} H${px(5)} M${px(0)} ${py(-3)} V${py(11)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <line className={cls("line")} x1={px(0)} y1={py(10)} x2={px(4.33)} y2={py(-3)} pathLength={100} stroke={C.muted} strokeWidth={2.5} />

        {/* the slope triangle: run 3, rise -9 */}
        <path className={cls("run")} d={`M${px(1)} ${py(7)} H${px(4)}`} pathLength={100} stroke={C.ink} strokeWidth={2.5} fill="none" />
        <path className={cls("rise")} d={`M${px(4)} ${py(7)} V${py(-2)}`} pathLength={100} stroke={C.ink} strokeWidth={2.5} fill="none" />
        <g className={cls("tl")} fontSize={11} fontWeight={700} fill={C.ink} {...lab}>
          <text x={px(2.5)} y={py(7) - 6} textAnchor="middle">
            run 3
          </text>
          <text x={px(4) + 6} y={py(2.5) + 4}>
            rise −9
          </text>
        </g>

        {/* the two given points */}
        <g className={cls("pts")}>
          <circle cx={px(1)} cy={py(7)} r={5} fill={C.primary} />
          <circle cx={px(4)} cy={py(-2)} r={5} fill={C.primary} />
        </g>
        <g className={cls("yb")}>
          <circle cx={px(0)} cy={py(10)} r={9} fill={C.primary} opacity={0.2} />
          <circle cx={px(0)} cy={py(10)} r={4.5} fill={C.primary} />
          <text x={px(0) + 9} y={py(10) + 4} fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>
            10
          </text>
        </g>

        {/* move 1: the slope */}
        <text className={cls("h1")} x={X} y={20} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>
          1. slope
        </text>
        <g className={cls("f1")}>{T(X, 54, layer(SLOPE, [0]), { size: 16, w: 160 })}</g>
        <g className={cls("f2")}>{T(X, 54, layer(SLOPE, [1]), { size: 16, w: 160, color: C.primaryText })}</g>

        {/* move 2: one point gives b */}
        <text className={cls("h2")} x={X} y={96} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>
          2. find b
        </text>
        <g className={cls("r1")}>{T(X, 118, String.raw`y={-}3x+b`, { size: 17, w: 150 })}</g>
        <g className={cls("r2")}>{T(X, 118, String.raw`7={-}3(1)+b`, { size: 17, w: 150 })}</g>
        <g className={cls("r3")}>{T(X, 118, String.raw`b=10`, { size: 17, w: 150, color: C.primaryText })}</g>
        <g className={cls("r4")}>{T(X, 118, String.raw`y={-}3x+10`, { size: 17, w: 150 })}</g>
        <circle className={cls("fly1")} cx={px(1)} cy={py(7)} r={5} fill={C.primary} />

        {/* the check: the second point fits */}
        <g className={cls("chk")}>
          <text x={X} y={142} fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
            check (4, −2)
          </text>
          {T(X, 158, String.raw`-3(4)+10={-}2`, { size: 15, w: 130, color: C.good })}
          <path d={`M ${X + 126} 158 l 5 5 l 10 -11`} fill="none" stroke={C.good} strokeWidth={2.5} />
        </g>
        <circle className={cls("fly2")} cx={px(4)} cy={py(-2)} r={5} fill={C.primary} />
      </g>
    </Svg>
  );
}
