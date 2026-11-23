import { C, Css, Svg, Tex } from "./kit";

// f(a) = b: the number in the brackets is the input, the number after the equals sign is the output, and the pair is a point.
export const alt =
  "A function machine f(x) = 4x - 5: input 3 gives output 7, the point (3, 7) on the line. Reverse: output 19 gives input k = 6, the point (6, 19).";

const P = "v-linear-functions--input-output-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
/** One element: fades in at s% (taking d%), optionally moving from a transform, holds, then leaves with the scene. */
const fx = (n: string, s: number, d = 5, from = "none", box = false) =>
  r(n, `0%, ${s}% { opacity: 0; transform: ${from} } ${s + d}%, 92% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none }`, box ? "transform-box: fill-box; transform-origin: center;" : "");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  fx("hdr", 0, 4),
  fx("box1", 0, 4),
  fx("in1", 5, 7, "translateX(-34px)"),
  fx("lin", 8, 4),
  fx("eq1", 14, 4),
  fx("out1", 19, 7, "translateX(-40px)"),
  fx("lout", 24, 4),
  fx("cap1", 28, 4),
  fx("graph", 34, 4),
  r("line", "0%, 35% { stroke-dashoffset: 100; opacity: 1 } 43%, 92% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 }", "stroke-dasharray: 100;"),
  fx("g1", 43, 4),
  fx("pt1", 45, 4, "scale(0)", true),
  fx("box2", 51, 4),
  fx("out2", 54, 7, "translateX(40px)"),
  fx("eq2", 61, 4),
  fx("cap2a", 65, 4),
  r("q", "0%, 54% { opacity: 0; transform: scale(1) } 58% { opacity: 1; transform: scale(1) } 62% { transform: scale(1.14) } 66% { transform: scale(1) } 70% { opacity: 1; transform: scale(1.14) } 74%, 100% { opacity: 0; transform: scale(1) }", "opacity: 0; transform-box: fill-box; transform-origin: center;"),
  fx("six", 72, 4, "scale(0.6)", true),
  fx("cap2b", 72, 4),
  fx("g2", 76, 4),
  fx("pt2", 78, 4, "scale(0)", true),
].join("\n");

// Graph: 15 units per 1 across, 5.5 per 1 up; origin (190, 146). The line is y = 4x - 5.
const gx = (n: number) => 190 + 15 * n;
const gy = (n: number) => 146 - 5.5 * n;
const lab = { stroke: "none" } as const;

/** A number chip: the input is orange, the output is dark. */
function Chip({ x, y, kind, children, className }: { x: number; y: number; kind: "in" | "out"; children: string; className: string }) {
  return (
    <g className={className}>
      <rect x={x} y={y - 14} width={26} height={28} rx={8} fill={kind === "in" ? C.primary : C.ink} />
      <text x={x + 13} y={y + 6} textAnchor="middle" fontSize={kind === "out" && children.length > 1 ? 14 : 16} fontWeight={700} fill={kind === "in" ? C.onPrimary : C.bg} {...lab}>
        {children}
      </text>
    </g>
  );
}

/** A short arrow along the row, pointing right or left. */
function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const d = x2 > x1 ? -4 : 4;
  return <path d={`M${x1} ${y} H${x2} M${x2 + d} ${y - 3.5} L${x2} ${y} L${x2 + d} ${y + 3.5}`} fill="none" stroke={C.muted} strokeWidth={1.8} />;
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The rule above the machine */}
      <g className={cls("hdr")}>
        <Tex x={86} y={18} size={15} width={140}>{String.raw`f(x)=4x-5`}</Tex>
      </g>

      {/* Row 1: input 3 goes in, output 7 comes out */}
      <g className={cls("box1")}>
        <rect x={52} y={34} width={68} height={32} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <Arrow x1={40} x2={51} y={50} />
        <Arrow x1={121} x2={132} y={50} />
      </g>
      <g className={cls("eq1")}>
        <Tex x={86} y={50} size={12} width={64}>{String.raw`4(3)-5`}</Tex>
      </g>
      <Chip className={cls("in1")} x={12} y={50} kind="in">3</Chip>
      <Chip className={cls("out1")} x={134} y={50} kind="out">7</Chip>
      <text className={cls("lin")} x={25} y={80} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.primaryText} {...lab}>input</text>
      <text className={cls("lout")} x={147} y={80} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink} {...lab}>output</text>
      <g className={cls("cap1")}>
        <Tex x={86} y={80} size={15} width={64}>{String.raw`f(3)=7`}</Tex>
      </g>

      {/* Row 2: output 19 goes in, the input k comes out */}
      <g className={cls("box2")}>
        <rect x={52} y={102} width={68} height={32} rx={9} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        <Arrow x1={132} x2={121} y={118} />
        <Arrow x1={51} x2={40} y={118} />
      </g>
      <g className={cls("eq2")}>
        <Tex x={86} y={118} size={11.5} width={64}>{String.raw`4k-5=19`}</Tex>
      </g>
      <Chip className={cls("out2")} x={134} y={118} kind="out">19</Chip>
      <g className={cls("q")}>
        <rect x={12} y={104} width={26} height={28} rx={8} fill="none" stroke={C.primary} strokeWidth={2} strokeDasharray="4 3" />
        <text x={25} y={124} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.primaryText} {...lab}>?</text>
      </g>
      <Chip className={cls("six")} x={12} y={118} kind="in">6</Chip>
      <g className={cls("cap2a")}>
        <Tex x={14} y={154} size={14} anchor="start" width={60}>{String.raw`f(k)=19`}</Tex>
      </g>
      <g className={cls("cap2b")}>
        <Tex x={72} y={154} size={14} anchor="start" width={70} color={C.primaryText}>{String.raw`\Rightarrow k=6`}</Tex>
      </g>

      {/* The same pairs as points on the graph of y = 4x - 5 */}
      <g className={cls("graph")}>
        <path d={`M${gx(0)} ${gy(22.5)} V${gy(0)} H${gx(7.2)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <text x={192} y={159} fontSize={11} fontWeight={600} fill={C.primaryText} {...lab}>input</text>
        <text x={186} y={20} fontSize={11} fontWeight={600} fill={C.ink} {...lab}>output</text>
      </g>
      <line className={cls("line")} x1={gx(1.25)} y1={gy(0)} x2={gx(6.5)} y2={gy(21)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      <g className={cls("g1")}>
        <path d={`M${gx(3)} ${gy(7)} V${gy(0)}`} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
        <path d={`M${gx(3)} ${gy(7)} H${gx(0)}`} stroke={C.ink} strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
        <text x={gx(3)} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>3</text>
        <text x={gx(0) - 6} y={gy(7) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>7</text>
        <text x={gx(3) + 9} y={gy(7) + 4} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(3, 7)</text>
      </g>
      <circle className={cls("pt1")} cx={gx(3)} cy={gy(7)} r={5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />

      <g className={cls("g2")}>
        <path d={`M${gx(6)} ${gy(19)} V${gy(0)}`} stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
        <path d={`M${gx(6)} ${gy(19)} H${gx(0)}`} stroke={C.ink} strokeWidth={1.5} strokeDasharray="3 3" fill="none" />
        <text x={gx(6)} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>6</text>
        <text x={gx(0) - 6} y={gy(19) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>19</text>
        <text x={gx(6) - 9} y={gy(19) + 14} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(6, 19)</text>
      </g>
      <circle className={cls("pt2")} cx={gx(6)} cy={gy(19)} r={5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
    </Svg>
  );
}
