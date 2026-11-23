import { C, Css, Svg, Tex } from "./kit";

// A system of inequalities: the solutions are where all the shadings overlap.
export const alt =
  "A graph of y > 3x − 2 (dashed line, shade above) and x + y ≤ 6 (solid line, shade below). Where the shadings overlap is the solution. (1, 4) is inside both; (3, 1) and (1, 7) each miss one.";

const P = "v-linear-inequalities--overlap-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fade in at t%, stay to the end of the loop, then fade out. */
const show = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 }`);
const draw = (n: string, t: number) =>
  r(n, `0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 10}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }`, "stroke-dasharray: 100;");
/** A point drops onto the graph. */
const drop = (n: string, t: number) =>
  r(n, `0%, ${t}% { opacity: 0; transform: translateY(-22px) } ${t + 5}%, 90% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`);
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  show("grid", 3),
  show("l1", 7),
  show("s1", 12),
  show("t1", 8),
  draw("l2", 21),
  show("s2", 26),
  show("t2", 22),
  show("both", 38),
  drop("p1", 50),
  show("rowA", 54),
  drop("p2", 62),
  show("rowB", 66),
  drop("p3", 74),
  show("rowC", 78),
].join(" ");

// Grid: x from -2 to 9, y from -2 to 8, 16 px per unit. Box (12, 10) to (188, 170).
const X = (x: number) => 44 + 16 * x;
const Y = (y: number) => 138 - 16 * y;
const pts = (v: [number, number][]) => v.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");

const tick = (x: number, y: number) => `M${X(x) - 17} ${Y(y) - 2} l4 4 l7 -9`;
const cross = (x: number, y: number) => `M${X(x) + 7} ${Y(y) - 7} l8 8 M${X(x) + 15} ${Y(y) - 7} l-8 8`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The grid */}
      <g className={cls("grid")}>
        <rect x={12} y={10} width={176} height={160} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <path d={`M${X(-2)} ${Y(0)} H${X(9)} M${X(0)} ${Y(8)} V${Y(-2)}`} fill="none" stroke={C.line} strokeWidth={1.5} />
      </g>

      {/* The two shadings (pale) and where they overlap (strong) */}
      <polygon className={cls("s1")} points={pts([[-2, -2], [0, -2], [10 / 3, 8], [-2, 8]])} fill={C.muted} fillOpacity={0.2} />
      <polygon className={cls("s2")} points={pts([[-2, -2], [8, -2], [-2, 8]])} fill={C.muted} fillOpacity={0.2} />
      <g className={cls("both")}>
        <polygon points={pts([[-2, -2], [0, -2], [2, 4], [-2, 8]])} fill={C.primary} fillOpacity={0.6} />
        <text x={X(-0.8)} y={Y(2.4) + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
          both
        </text>
      </g>

      {/* y > 3x - 2: dashed.   x + y <= 6: solid. */}
      <line className={cls("l1")} x1={X(0)} y1={Y(-2)} x2={X(10 / 3)} y2={Y(8)} stroke={C.ink} strokeWidth={2.5} strokeDasharray="7 5" />
      <line className={cls("l2")} x1={X(-2)} y1={Y(8)} x2={X(8)} y2={Y(-2)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      {/* Test points */}
      <g className={cls("p1")}>
        <circle cx={X(1)} cy={Y(4)} r={5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />
        <path d={tick(1, 4)} fill="none" stroke={C.good} strokeWidth={2.5} />
      </g>
      <g className={cls("p2")}>
        <circle cx={X(3)} cy={Y(1)} r={5} fill={C.bad} stroke={C.bg} strokeWidth={1.5} />
        <path d={cross(3, 1)} fill="none" stroke={C.bad} strokeWidth={2.5} />
      </g>
      <g className={cls("p3")}>
        <circle cx={X(1)} cy={Y(7)} r={5} fill={C.bad} stroke={C.bg} strokeWidth={1.5} />
        <path d={cross(1, 7)} fill="none" stroke={C.bad} strokeWidth={2.5} />
      </g>

      {/* The two inequalities */}
      <g className={cls("t1")}>
        <line x1={198} y1={28} x2={218} y2={28} stroke={C.ink} strokeWidth={2.5} strokeDasharray="5 4" />
        <Tex x={224} y={28} size={14} anchor="start" width={90}>
          {String.raw`y>3x-2`}
        </Tex>
      </g>
      <g className={cls("t2")}>
        <line x1={198} y1={56} x2={218} y2={56} stroke={C.ink} strokeWidth={2.5} />
        <Tex x={224} y={56} size={14} anchor="start" width={90}>
          {String.raw`x+y\le 6`}
        </Tex>
      </g>
      <g className={cls("both")}>
        <rect x={198} y={78} width={20} height={12} rx={3} fill={C.primary} fillOpacity={0.6} />
        <text x={224} y={88.5} fontSize={13} fontWeight={700} fill={C.primaryText} stroke="none">
          both
        </text>
      </g>

      {/* The checks */}
      <g className={cls("rowA")}>
        <circle cx={204} cy={116} r={4.5} fill={C.good} />
        <text x={214} y={120} fontSize={12} fontWeight={700} fill={C.good} stroke="none">
          (1, 4)
        </text>
        <text x={256} y={120} fontSize={12} fontWeight={700} fill={C.good} stroke="none">
          in both
        </text>
      </g>
      <g className={cls("rowB")}>
        <circle cx={204} cy={138} r={4.5} fill={C.bad} />
        <text x={214} y={142} fontSize={12} fontWeight={700} fill={C.bad} stroke="none">
          (3, 1)
        </text>
        <Tex x={258} y={138} size={13} anchor="start" color={C.bad} width={50}>
          {String.raw`1\ngtr 7`}
        </Tex>
      </g>
      <g className={cls("rowC")}>
        <circle cx={204} cy={160} r={4.5} fill={C.bad} />
        <text x={214} y={164} fontSize={12} fontWeight={700} fill={C.bad} stroke="none">
          (1, 7)
        </text>
        <Tex x={258} y={160} size={13} anchor="start" color={C.bad} width={50}>
          {String.raw`8\nleq 6`}
        </Tex>
      </g>
    </Svg>
  );
}
