import { C, Css, Svg, Tex } from "./kit";

// A radian: the angle that cuts an arc as long as the radius. Three radii and a bit (0.14) make a half turn, π ≈ 3.14 radians = 180°.
// Then the benchmark angles, the two conversion factors, and a π-or-not warning: 33/5 rad vs 33π/5 rad. Circle r = 52, center (100, 112).
export const alt =
  "A string as long as the radius wraps onto a circle: one radian is about 57°, and three radii and a bit make a half turn, π radians = 180°. Benchmarks, conversion factors, and a π means radians.";

const P = "v-right-triangles-trig--radians-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
/** Visible only between t0 and t1 (hidden in the still frame). */
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");

const O = { x: 100, y: 112 };
const R = 52;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const at = (deg: number, rr = R) => ({ x: f(O.x + rr * Math.cos(rad(deg))), y: f(O.y - rr * Math.sin(rad(deg))) });
const arc = (d0: number, d1: number) => `M${at(d0).x} ${at(d0).y} A${R} ${R} 0 0 0 ${at(d1).x} ${at(d1).y}`;
const RAD = 180 / Math.PI; // one radian in degrees: 57.3
const BENCH = [
  { d: 30, tex: String.raw`30^\circ=\pi/6`, t: 58.5 },
  { d: 45, tex: String.raw`45^\circ=\pi/4`, t: 59.7 },
  { d: 60, tex: String.raw`60^\circ=\pi/3`, t: 61 },
  { d: 90, tex: String.raw`90^\circ=\pi/2`, t: 63.5 },
  { d: 180, tex: String.raw`180^\circ=\pi`, t: 70 },
];
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  win("str", 5, 15),
  draw("strd", 5, 6),
  win("arcs", 14, 54),
  draw("a1", 14),
  pop("wedge", 18),
  draw("a2", 23),
  draw("a3", 30),
  draw("a4", 37, 3),
  pop("half", 40),
  pop("l1", 17),
  pop("l2", 27),
  pop("l3", 34),
  win("tz1", 15, 32),
  win("tz2", 40, 54),
  win("f3", 56, 71),
  r("ptr", "0%, 56% { transform: rotate(0deg) } 71%, 100% { transform: rotate(-180deg) }", `animation-timing-function: linear; transform-box: view-box; transform-origin: ${O.x}px ${O.y}px;`),
  ...BENCH.map((b, i) => pop(`rw${i}`, b.t)),
  pop("conv", 74),
  pop("warn", 79),
].join(" ");

const lab = { stroke: "none" } as const;

export default function Visual() {
  const p1 = at(RAD);
  const w1 = { x: 164, y: 82 }; // label of 33/5 rad (a full turn and a bit)
  const w2 = at(108, R + 22); // 33π/5 rad: three full turns and 108°
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the circle and its radius */}
        <circle cx={O.x} cy={O.y} r={R} fill="none" stroke={C.ink} strokeWidth={2.5} />
        <line x1={O.x} y1={O.y} x2={at(0).x} y2={at(0).y} stroke={C.ink} strokeWidth={2.5} />
        <circle cx={O.x} cy={O.y} r={3.5} fill={C.ink} />
        <text x={O.x + 24} y={O.y + 15} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>r</text>

        {/* 1: a string as long as the radius, wrapped onto the edge */}
        <g className={cls("str")}>
          <line className={cls("strd")} x1={at(0).x} y1={at(0).y} x2={at(0).x} y2={at(0).y - R} pathLength={100} stroke={C.primary} strokeWidth={4.5} />
          <text x={at(0).x + 8} y={O.y - R / 2 + 4} fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>r</text>
        </g>
        <g className={cls("arcs")}>
          <path className={cls("wedge")} d={`M${O.x} ${O.y} L${at(0).x} ${at(0).y} A${R} ${R} 0 0 0 ${p1.x} ${p1.y} Z`} fill={C.soft} stroke="none" />
          <path className={cls("a1")} d={arc(0, RAD)} pathLength={100} fill="none" stroke={C.primary} strokeWidth={4.5} />
          <path className={cls("a2")} d={arc(RAD, 2 * RAD)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={4.5} />
          <path className={cls("a3")} d={arc(2 * RAD, 3 * RAD)} pathLength={100} fill="none" stroke={C.primary} strokeWidth={4.5} />
          <path className={cls("a4")} d={arc(3 * RAD, 180)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={4.5} />
          <g fontSize={12} fontWeight={700} {...lab}>
            <text className={cls("l1")} x={at(RAD / 2, R + 11).x} y={at(RAD / 2, R + 11).y + 4} textAnchor="middle" fill={C.primaryText}>1</text>
            <text className={cls("l2")} x={at(1.5 * RAD, R + 11).x} y={at(1.5 * RAD, R + 11).y + 4} textAnchor="middle" fill={C.ink}>2</text>
            <text className={cls("l3")} x={at(2.5 * RAD, R + 12).x} y={at(2.5 * RAD, R + 12).y + 4} textAnchor="middle" fill={C.primaryText}>3</text>
          </g>
          <g className={cls("half")}>
            <circle cx={at(180).x} cy={at(180).y} r={4.5} fill={C.primary} />
            <Tex x={at(180).x - 9} y={at(180).y - 12} size={14} anchor="end" width={30} color={C.primaryText}>{String.raw`\pi`}</Tex>
          </g>
        </g>
        <g className={cls("tz1")}>
          <Tex x={186} y={44} size={15} anchor="start" width={126} color={C.primaryText}>{String.raw`1\text{ rad}\approx57^\circ`}</Tex>
        </g>
        <g className={cls("tz2")}>
          <Tex x={186} y={34} size={16} anchor="start" width={126} color={C.primaryText}>{String.raw`\pi\approx3.14`}</Tex>
          <text x={186} y={54} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>radians: a half turn</text>
          <Tex x={186} y={72} size={14} anchor="start" width={126}>{String.raw`2\pi=\text{full turn}`}</Tex>
        </g>

        {/* 3: benchmark angles, a pointer sweeps counterclockwise */}
        <g className={cls("f3")}>
          {BENCH.map((b, i) => (
            <g key={b.d} className={cls(`rw${i}`)}>
              <line x1={O.x} y1={O.y} x2={at(b.d).x} y2={at(b.d).y} stroke={C.muted} strokeWidth={2} />
              <Tex x={186} y={22 + 14 * i} size={13} anchor="start" width={126} color={C.primaryText}>{b.tex}</Tex>
            </g>
          ))}
          <line className={cls("ptr")} x1={O.x} y1={O.y} x2={at(0).x} y2={at(0).y} stroke={C.primary} strokeWidth={3.5} />
        </g>

        {/* 4: the two conversion factors */}
        <g className={cls("conv")}>
          <text x={186} y={102} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>deg → rad</text>
          <Tex x={252} y={98} size={14} anchor="start" width={60} color={C.primaryText}>{String.raw`\times\dfrac{\pi}{180}`}</Tex>
          <text x={186} y={140} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>rad → deg</text>
          <Tex x={252} y={136} size={14} anchor="start" width={60} color={C.primaryText}>{String.raw`\times\dfrac{180}{\pi}`}</Tex>
          <Tex x={186} y={160} size={14} anchor="start" width={126}>{String.raw`150^\circ\to5\pi/6`}</Tex>
        </g>

        {/* 5: a π in the number means radians */}
        <g className={cls("warn")}>
          <line x1={O.x} y1={O.y} x2={at(33 / 5 * RAD - 360).x} y2={at(33 / 5 * RAD - 360).y} stroke={C.muted} strokeWidth={2.5} />
          <line x1={O.x} y1={O.y} x2={at(108).x} y2={at(108).y} stroke={C.primary} strokeWidth={3.5} />
          <circle cx={at(33 / 5 * RAD - 360).x} cy={at(33 / 5 * RAD - 360).y} r={4} fill={C.muted} />
          <circle cx={at(108).x} cy={at(108).y} r={4.5} fill={C.primary} />
          <Tex x={w1.x} y={w1.y} size={13} width={30} color={C.muted}>{String.raw`\dfrac{33}{5}`}</Tex>
          <Tex x={w2.x} y={w2.y - 2} size={13} width={34} color={C.primaryText}>{String.raw`\dfrac{33\pi}{5}`}</Tex>
          <text x={186} y={30} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>A π in the number</text>
          <text x={186} y={47} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>means radians.</text>
          <text x={186} y={64} fontSize={12} fontWeight={600} fill={C.muted} {...lab}>Read the unit.</text>
        </g>
      </g>
    </Svg>
  );
}
