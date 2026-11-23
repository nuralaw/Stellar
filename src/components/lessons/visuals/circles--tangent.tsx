import { C, Css, Svg, Tex } from "./kit";

// Center (1, 2), tangent point (3, 3). The radius has slope 1/2; the tangent is perpendicular, slope −2. 28 px per unit.
export const alt =
  "A circle with center (1, 2) and a tangent line touching it at (3, 3). A right-angle mark shows the radius is perpendicular to the tangent. Radius slope 1/2, tangent slope −2.";

const P = "v-circles--tangent-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 12) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  draw("ring", 6, 14),
  draw("rad", 22, 10),
  pop("pts", 22),
  draw("tan", 38, 12),
  pop("sq", 52),
  pop("s1", 28),
  pop("s2", 58),
  pop("s3", 74),
].join(" ");

const U = 28;
const O = { x: 104, y: 100 };
const Pt = { x: O.x + 2 * U, y: O.y - 1 * U }; // (3, 3)
const R = Math.hypot(Pt.x - O.x, Pt.y - O.y); // √5 · 28 = 62.6
// Tangent direction: slope −2 in math = (1, 2) on screen (right and down)
const L = Math.hypot(1, 2);
const d = { x: 1 / L, y: 2 / L };
const e = { x: (O.x - Pt.x) / R, y: (O.y - Pt.y) / R }; // from P toward the center
const t1 = { x: f(Pt.x - 55 * d.x), y: f(Pt.y - 55 * d.y) };
const t2 = { x: f(Pt.x + 55 * d.x), y: f(Pt.y + 55 * d.y) };
const k = 10;
const mark = `M${f(Pt.x + k * e.x)} ${f(Pt.y + k * e.y)} L${f(Pt.x + k * e.x - k * d.x)} ${f(Pt.y + k * e.y - k * d.y)} L${f(Pt.x - k * d.x)} ${f(Pt.y - k * d.y)}`;
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={f(R)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
        <line className={cls("rad")} x1={O.x} y1={O.y} x2={Pt.x} y2={Pt.y} pathLength={100} stroke={C.primary} strokeWidth={3} />
        <g className={cls("pts")}>
          <circle cx={O.x} cy={O.y} r={4.5} fill={C.primary} />
          <circle cx={Pt.x} cy={Pt.y} r={4.5} fill={C.ink} />
          <text x={O.x - 8} y={O.y + 18} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(1, 2)</text>
          <text x={Pt.x + 8} y={Pt.y - 8} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(3, 3)</text>
        </g>
        <line className={cls("tan")} x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        <path className={cls("sq")} d={mark} fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* the slopes */}
        <g className={cls("s1")} {...lab}>
          <text x={212} y={36} fontSize={11} fill={C.muted}>radius slope</text>
          <Tex x={212} y={62} size={18} anchor="start" width={60} color={C.primaryText}>{String.raw`\dfrac{1}{2}`}</Tex>
        </g>
        <g className={cls("s2")} {...lab}>
          <text x={212} y={98} fontSize={11} fill={C.muted}>tangent slope</text>
          <Tex x={212} y={118} size={18} anchor="start" width={60}>{String.raw`-2`}</Tex>
        </g>
        <text className={cls("s3")} x={212} y={150} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>
          flip, change sign
        </text>
      </g>
    </Svg>
  );
}
