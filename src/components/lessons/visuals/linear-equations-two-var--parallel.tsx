import { C, Css, Svg, Tex } from "./kit";

// Parallel lines share a slope and differ in b; in standard form their x and y coefficients are in the same ratio.
// y = 2x + 1 and y = 2x - 3 (same triangle: run 1, rise 2); a line with another tilt is not parallel; 3x + 4y = 28 with
// 24x + ry = 24 gives r = 32 (multiply the first by 8).
export const alt =
  "Lines y = 2x + 1 and y = 2x − 3 share one slope triangle, run 1 and rise 2, with different b: parallel. Another tilt is not parallel. In standard form 3x + 4y = 28 times 8 gives r = 32.";

const P = "v-linear-equations-two-var--parallel-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d: number) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 3%, 94% { opacity: 1 } 98%, 100% { opacity: 0 }"),
  draw("l1", 3, 8),
  draw("l2", 8, 8),
  pop("tri1", 17),
  pop("tri2", 19),
  pop("same", 21),
  pop("bs", 24),
  pop("diff", 26),
  // the second line slides away and back: the gap changes, the tilt does not
  r("slide", "0%, 32% { transform: none } 38%, 42% { transform: translateY(28px) } 48%, 100% { transform: none }"),
  r("bfade", "0%, 30% { opacity: 1 } 34%, 46% { opacity: 0 } 50%, 100% { opacity: 1 }"),
  draw("l3", 52, 8),
  pop("np", 62),
  pop("rows", 66),
  pop("badge", 72),
  r("old", "0%, 76% { opacity: 1 } 80%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("neu", 76),
  pop("rr", 84),
].join("\n");

// grid: x from -5 to 5, y from -5 to 5, one unit = 14, origin (97, 92)
const U = 14;
const OX = 97;
const OY = 92;
const px = (x: number) => OX + U * x;
const py = (y: number) => OY - U * y;
const lab = { stroke: "none" } as const;
const T = (x: number, y: number, s: string, o: { color?: string; size?: number; w?: number; anchor?: "start" | "middle" | "end" } = {}) => (
  <Tex x={x} y={y} size={o.size ?? 15} anchor={o.anchor ?? "start"} width={o.w ?? 100} color={o.color ?? C.ink}>
    {s}
  </Tex>
);
const layer = (parts: string[], show: number[]) => parts.map((p, i) => (show.includes(i) ? p : String.raw`\phantom{${p}}`)).join("");
const ROW2 = [String.raw`24x+`, "r", String.raw`y=24`];

const tri = (y0: number, n: string) => (
  <g className={cls(n)}>
    <path d={`M${px(0)} ${py(y0)} H${px(1)} V${py(y0 + 2)}`} fill="none" stroke={C.primary} strokeWidth={2.5} />
    <g fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>
      <text x={px(0.5)} y={py(y0) + 12} textAnchor="middle">
        1
      </text>
      <text x={px(1) + 5} y={py(y0 + 1) + 4}>
        2
      </text>
    </g>
  </g>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the grid */}
        <g stroke={C.line} strokeWidth={1}>
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((k) => (
            <line key={`x${k}`} x1={px(k)} y1={py(-5)} x2={px(k)} y2={py(5)} />
          ))}
          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((k) => (
            <line key={`y${k}`} x1={px(-5)} y1={py(k)} x2={px(5)} y2={py(k)} />
          ))}
        </g>
        <path d={`M${px(-5)} ${py(0)} H${px(5)} M${px(0)} ${py(-5)} V${py(5)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* the third line: another tilt crosses both and is not parallel */}
        <line className={cls("l3")} x1={px(-3)} y1={py(5)} x2={px(5)} y2={py(-3)} pathLength={100} stroke={C.muted} strokeWidth={2} opacity={0.7} />

        {/* y = 2x + 1 */}
        <line className={cls("l1")} x1={px(-2)} y1={py(-3)} x2={px(1.5)} y2={py(4)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        {tri(1, "tri1")}
        {/* y = 2x - 3 */}
        <g className={cls("slide")}>
          <line className={cls("l2")} x1={px(0)} y1={py(-3)} x2={px(3.5)} y2={py(4)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
          {tri(-3, "tri2")}
        </g>

        {/* where each line crosses the y-axis */}
        <g className={cls("bs")}>
          <g className={cls("bfade")}>
            <circle cx={px(0)} cy={py(1)} r={4} fill={C.ink} />
            <circle cx={px(0)} cy={py(-3)} r={4} fill={C.ink} />
          </g>
          <g fontSize={11} fontWeight={700} fill={C.ink} textAnchor="end" {...lab}>
            <text x={px(0) - 7} y={py(1) + 4}>
              1
            </text>
            <g className={cls("bfade")}>
              <text x={px(0) - 7} y={py(-3) + 4}>
                −3
              </text>
            </g>
          </g>
        </g>

        {/* what it means */}
        <text className={cls("same")} x={192} y={22} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>
          same slope
        </text>
        <g className={cls("same")}>{T(192, 44, String.raw`m_1=m_2`, { size: 17 })}</g>
        <text className={cls("diff")} x={192} y={66} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>
          different b
        </text>
        <text className={cls("np")} x={192} y={84} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>
          not parallel
        </text>

        {/* in standard form: same ratio of the coefficients */}
        <path className={cls("rows")} d="M 190 96 H 304" stroke={C.line} strokeWidth={1.5} />
        <g className={cls("rows")}>
          <g className={cls("old")}>{T(192, 112, String.raw`3x+4y=28`, { size: 14, w: 108 })}</g>
          {T(192, 150, layer(ROW2, [0, 2]), { size: 14, w: 108 })}
          {T(192, 150, layer(ROW2, [1]), { size: 14, w: 108, color: C.primaryText })}
        </g>
        <g className={cls("neu")}>{T(192, 112, String.raw`24x+32y=224`, { size: 14, w: 108, color: C.primaryText })}</g>
        <g className={cls("badge")}>
          <rect x={192} y={122} width={38} height={18} rx={9} fill={C.primary} />
          <Tex x={211} y={131} size={12} width={36} color={C.onPrimary}>
            {String.raw`\times 8`}
          </Tex>
        </g>
        <g className={cls("rr")}>{T(244, 131, String.raw`r=32`, { size: 17, w: 60, color: C.good })}</g>
      </g>
    </Svg>
  );
}
