import { C, Css, Svg, Tex } from "./kit";

// "$5 for the first 2 km, $3 for each additional km": only the km after the first 2 pay $3, so C(d) = 5 + 3(d - 2).
export const alt =
  "A taxi costs $5 for the first 2 km and $3 for each extra km. Rule C(d) = 5 + 3(d - 2), tested at d = 2 (cost 5). The wrong rule 5 + 3d fails. Simplified: 3d - 1.";

const P = "v-linear-functions--first-n-units-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** Fades in at s% (taking d%), optionally from a transform, holds, then leaves with the scene. */
const fx = (n: string, s: number, d = 4, from = "none") =>
  r(n, `0%, ${s}% { opacity: 0; transform: ${from} } ${s + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`, "transform-box: fill-box; transform-origin: center;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  fx("b0", 0, 5),
  fx("b3", 7, 4, "translateY(-8px)"),
  fx("b4", 10, 4, "translateY(-8px)"),
  fx("b5", 13, 4, "translateY(-8px)"),
  fx("brk", 17, 5),
  fx("f1", 24, 5),
  fx("gx", 30, 4),
  fx("p2", 32, 3, "scale(0)"),
  fx("p3", 35, 3, "scale(0)"),
  fx("p4", 38, 3, "scale(0)"),
  fx("p5", 41, 3, "scale(0)"),
  r("gl", "0%, 33% { stroke-dashoffset: 100; opacity: 1 } 43%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }", "stroke-dasharray: 100;"),
  fx("test", 47, 5),
  r("wrong", "0%, 55% { opacity: 0 } 59%, 66% { opacity: 1 } 70%, 100% { opacity: 0 }", "opacity: 0;"),
  fx("f3", 71, 5),
  fx("ext", 77, 4),
  fx("p0", 80, 3, "scale(0)"),
  fx("np", 82, 4),
].join("\n");

const lab = { stroke: "none" } as const;
const UX = 58.4; // width of one km in the row of boxes
const bx = (i: number) => 14 + UX * i;
// Mini graph: 17 per km across, 4.2 per $ up; origin (216, 144). The line is C = 3d - 1.
const gx = (d: number) => 216 + 17 * d;
const gy = (c: number) => 144 - 4.2 * c;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The first 2 km: one box, one price (neutral) */}
      <g className={cls("b0")}>
        <rect x={bx(0)} y={16} width={2 * UX - 4} height={27} rx={7} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <text x={bx(1) - 2} y={34} textAnchor="middle" fontSize={12} fill={C.muted} {...lab}>
          <tspan fontSize={17} fontWeight={700} fill={C.ink}>$5</tspan> first 2 km
        </text>
        {[1, 2, 3, 4, 5].map((k) => (
          <text key={k} x={bx(k - 1) + (UX - 4) / 2} y={57} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>
            {k}
          </text>
        ))}
        <text x={310} y={57} textAnchor="end" fontSize={11} fill={C.muted} {...lab}>km</text>
      </g>

      {/* Each extra km: $3 (accent) */}
      {[2, 3, 4].map((i) => (
        <g key={i} className={cls(`b${i + 1}`)}>
          <rect x={bx(i)} y={16} width={UX - 4} height={27} rx={7} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={bx(i) + (UX - 4) / 2} y={35} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.primaryText} {...lab}>$3</text>
        </g>
      ))}

      {/* The extra km: d - 2 of them */}
      <g className={cls("brk")}>
        <path d={`M${bx(2)} 62 V66 H${bx(5) - 4} V62`} fill="none" stroke={C.primary} strokeWidth={2} />
        <Tex x={bx(3.5) - 2} y={80} size={13} width={150} color={C.primaryText}>{String.raw`(d-2)\text{ extra km}`}</Tex>
      </g>

      {/* The rule, then the checks */}
      <g className={cls("f1")}>
        <Tex x={14} y={100} size={14} anchor="start" width={130}>{String.raw`C(d)=5+\phantom{3(d-2)}`}</Tex>
        <Tex x={14} y={100} size={14} anchor="start" width={130} color={C.primaryText}>{String.raw`\phantom{C(d)=5+}3(d-2)`}</Tex>
      </g>
      <g className={cls("test")}>
        <Tex x={14} y={124} size={14} anchor="start" width={70} color={C.good}>{String.raw`C(2)=5`}</Tex>
        <path d="M76 123 l4 4.5 l8 -9" fill="none" stroke={C.good} strokeWidth={2.5} />
      </g>
      <g className={cls("wrong")}>
        <Tex x={14} y={148} size={12} anchor="start" width={110} color={C.muted}>{String.raw`5+3d:\ C(2)=11`}</Tex>
        <path d="M106 143 l9 9 M115 143 l-9 9" fill="none" stroke={C.bad} strokeWidth={2.5} />
      </g>
      <g className={cls("f3")}>
        <Tex x={14} y={148} size={15} anchor="start" width={110} color={C.primaryText}>{String.raw`C(d)=3d-1`}</Tex>
      </g>

      {/* Mini graph: the cost at d = 2, 3, 4, 5 */}
      <g className={cls("gx")}>
        <path d={`M${gx(0)} ${gy(14.8)} V${gy(-1.6)} M${gx(0) - 4} ${gy(0)} H${gx(5.5)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={gx(5.5)} y={gy(0) + 13} textAnchor="end" fontSize={11} fontWeight={600} fill={C.muted} {...lab}>d</text>
      </g>
      <line className={cls("gl")} x1={gx(2)} y1={gy(5)} x2={gx(5)} y2={gy(14)} pathLength={100} stroke={C.ink} strokeWidth={2} />
      <g className={cls("test")}>
        <path d={`M${gx(2)} ${gy(0)} V${gy(5) + 7}`} fill="none" stroke={C.good} strokeWidth={2} strokeDasharray="3 3" />
        <path d={`M${gx(2) - 3.5} ${gy(5) + 12} L${gx(2)} ${gy(5) + 6} L${gx(2) + 3.5} ${gy(5) + 12}`} fill="none" stroke={C.good} strokeWidth={2} />
        <text x={gx(2)} y={gy(0) + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.good} {...lab}>2</text>
      </g>
      <g className={cls("p2")}>
        <circle cx={gx(2)} cy={gy(5)} r={4} fill={C.ink} stroke={C.bg} strokeWidth={1.5} />
        <text x={gx(2) - 7} y={gy(5) - 4} textAnchor="end" fontSize={11} fontWeight={700} fill={C.ink} {...lab}>5</text>
      </g>
      {[3, 4, 5].map((d) => (
        <g key={d} className={cls(`p${d}`)}>
          <circle cx={gx(d)} cy={gy(3 * d - 1)} r={4} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
          <text x={gx(d) - 7} y={gy(3 * d - 1) - 4} textAnchor="end" fontSize={11} fontWeight={700} fill={C.primaryText} {...lab}>{3 * d - 1}</text>
        </g>
      ))}

      {/* Extended back to d = 0: -1 is not a price */}
      <g className={cls("ext")}>
        <line x1={gx(0)} y1={gy(-1)} x2={gx(2)} y2={gy(5)} stroke={C.muted} strokeWidth={2} strokeDasharray="4 3" />
      </g>
      <g className={cls("p0")}>
        <circle cx={gx(0)} cy={gy(-1)} r={4} fill={C.bg} stroke={C.muted} strokeWidth={2} />
      </g>
      <g className={cls("np")}>
        <text x={gx(0) - 8} y={gy(-1) + 4} textAnchor="end" fontSize={11} fill={C.muted} {...lab}>
          <tspan fontWeight={700} fill={C.ink}>−1</tspan> not a price
        </text>
      </g>
    </Svg>
  );
}
