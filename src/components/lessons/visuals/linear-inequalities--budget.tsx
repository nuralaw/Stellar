import { C, Css, Svg, Tex } from "./kit";

// A budget inequality: every number has a job (price, count, limit), and a test point is just put in and compared.
export const alt =
  "In 7s + 4m ≤ 80 the 7 is the price of a sandwich, s is how many, 80 is the limit. The point (6, 9) gives 78 ≤ 80 and works. The point (8, 7) gives 84, over 80, and fails.";

const P = "v-linear-inequalities--budget-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay until `until`% (default: the end of the loop), then fade out. Hidden in the still frame when until < 90. */
const show = (n: string, t: number, until = 90) =>
  r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, ${until}% { opacity: 1 } ${until + (until >= 90 ? 7 : 4)}%, 100% { opacity: 0 }`, until < 90 ? "opacity: 0;" : "");
/** A dot drops onto the graph. */
const drop = (n: string, t: number) =>
  r(n, `0%, ${t}% { opacity: 0; transform: translateY(-22px) } ${t + 5}%, 90% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`);
const draw = (n: string, t: number) =>
  r(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 8}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }`, "stroke-dasharray: 100;");
/** A legend row lights up (text turns orange) and its part of the inequality gets a box, while the row is the current one. */
const lit = (n: string, t: number) => r(n, `0%, ${t}% { fill: ${C.ink} } ${t + 3}%, ${t + 8}% { fill: ${C.primaryText} } ${t + 11}%, 100% { fill: ${C.ink} }`);
const box = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 3}%, ${t + 8}% { opacity: 1 } ${t + 11}%, 100% { opacity: 0 }`, "opacity: 0;");

const ROWS = [8, 17, 26];
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  show("ineq", 3),
  ...ROWS.flatMap((t, i) => [show(`row${i}`, t), lit(`lit${i}`, t), box(`box${i}`, t)]),
  show("axes", 34),
  draw("line", 36),
  show("region", 42),
  drop("p1", 52),
  show("rowA", 58),
  drop("p2", 68),
  show("rowB", 74),
].join(" ");

const SZ = 24;
const X0 = 16;
const IY = 26;
// Graph: origin (202, 148); 8 px per sandwich (s) and 5.8 px per m.
const GX = (s: number) => 202 + 8 * s;
const GY = (m: number) => 148 - 5.8 * m;

export default function Visual() {
  const wdBeforeLe = (0.5 + 0.47 + 1.222 + 0.5 + 0.878) * SZ; // 7s+4m
  const wd80 = X0 + wdBeforeLe + 1.333 * SZ;
  const legend: { y: number; sym: string; text: string }[] = [
    { y: 62, sym: String.raw`7`, text: "price of a sandwich" },
    { y: 82, sym: String.raw`s`, text: "how many sandwiches" },
    { y: 102, sym: String.raw`80`, text: "limit" },
  ];
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The inequality, with a box on the part being explained */}
      <g className={cls("box0")}>
        <rect x={X0 - 3} y={IY - 16} width={18} height={30} rx={6} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>
      <g className={cls("box1")}>
        <rect x={X0 + 0.5 * SZ - 1} y={IY - 16} width={15} height={30} rx={6} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>
      <g className={cls("box2")}>
        <rect x={wd80 - 3} y={IY - 16} width={SZ + 6} height={30} rx={6} fill="none" stroke={C.primary} strokeWidth={1.5} />
      </g>
      <g className={cls("ineq")}>
        <Tex x={X0} y={IY} size={SZ} anchor="start" width={170}>
          {String.raw`7s+4m\le 80`}
        </Tex>
      </g>

      {/* What each number is */}
      {legend.map((l, i) => (
        <g key={i} className={cls(`row${i}`)}>
          <Tex x={X0} y={l.y} size={15} anchor="start" width={36}>
            {l.sym}
          </Tex>
          <text className={cls(`lit${i}`)} x={X0 + 30} y={l.y + 4.5} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">
            {l.text}
          </text>
        </g>
      ))}

      {/* The graph: boundary 7s + 4m = 80, region below it */}
      <g className={cls("axes")}>
        <path d={`M${GX(0)} ${GY(21)} V${GY(0)} H${GX(12.4)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <Tex x={GX(12.4) + 2} y={GY(0) + 11} size={13} anchor="start" color={C.muted} width={20}>
          {String.raw`s`}
        </Tex>
        <Tex x={GX(0) + 6} y={GY(21) + 6} size={13} anchor="start" color={C.muted} width={20}>
          {String.raw`m`}
        </Tex>
      </g>
      <g className={cls("region")}>
        <polygon points={`${GX(0)},${GY(0)} ${GX(80 / 7)},${GY(0)} ${GX(0)},${GY(20)}`} fill={C.soft} />
      </g>
      <line className={cls("line")} x1={GX(0)} y1={GY(20)} x2={GX(80 / 7)} y2={GY(0)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />

      {/* Test points */}
      <g className={cls("p1")}>
        <circle cx={GX(6)} cy={GY(9)} r={5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />
        <text x={GX(6) - 8} y={GY(9) + 15} textAnchor="end" fontSize={12} fontWeight={700} fill={C.good} stroke="none">
          (6, 9)
        </text>
      </g>
      <g className={cls("p2")}>
        <circle cx={GX(8)} cy={GY(7)} r={5} fill={C.bad} stroke={C.bg} strokeWidth={1.5} />
        <text x={GX(8) + 8} y={GY(7) - 6} fontSize={12} fontWeight={700} fill={C.bad} stroke="none">
          (8, 7)
        </text>
      </g>

      {/* The two checks */}
      <g className={cls("rowA")}>
        <circle cx={22} cy={136} r={4.5} fill={C.good} />
        <Tex x={34} y={136} size={16} anchor="start" color={C.good} width={130}>
          {String.raw`42+36=78\le 80`}
        </Tex>
        <path d="M174 136 l5 5 l9 -10" fill="none" stroke={C.good} strokeWidth={2.5} />
      </g>
      <g className={cls("rowB")}>
        <circle cx={22} cy={162} r={4.5} fill={C.bad} />
        <Tex x={34} y={162} size={16} anchor="start" color={C.bad} width={130}>
          {String.raw`56+28=84\nleq 80`}
        </Tex>
        <path d="M174 157 l10 10 M184 157 l-10 10" fill="none" stroke={C.bad} strokeWidth={2.5} />
      </g>
    </Svg>
  );
}
