import { C, Css, Svg, Tex } from "./kit";

// Sticks a = 8 and b = 10 (9 px per unit) hinged at one end; a third stick c closes the triangle. The hinge opens from 90° to
// 180° (c = 18 = a + b: flat), folds to 0° (c = 2 = b − a: flat), then swings through the real triangles. The bar shows c.
export const alt =
  "Sticks of length 8 and 10 and a third stick c close a triangle. Stretch c to 18 or fold it to 2 and the triangle goes flat. Only 2 < c < 18 makes a triangle: |a − b| < c < a + b.";

const P = "v-lines-angles-triangles--inequality-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 4}%, 100% { opacity: 1 }`);
/** Visible only between t0 and t1 (hidden in the still frame). */
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");

const U = 9;
const H = { x: 151, y: 90 }; // the hinge
const Eb = { x: H.x + 10 * U, y: H.y }; // free end of b (fixed)
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const ease = (u: number) => u * u * (3 - 2 * u);
// The hinge angle over the loop: [from %, to %, from °, to °]
const SEGS = [
  [0, 12, 90, 90],
  [12, 26, 90, 180],
  [26, 34, 180, 180],
  [34, 52, 180, 0],
  [52, 58, 0, 0],
  [58, 68, 0, 58.7],
  [68, 76, 58.7, 105],
  [76, 82, 105, 30],
  [82, 87, 30, 58.7],
  [87, 100, 58.7, 58.7],
] as const;
const STOPS: { p: number; th: number }[] = [];
for (const [p0, p1, t0, t1] of SEGS) {
  const n = t0 === t1 ? 1 : 6;
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    const s = { p: f(p0 + (p1 - p0) * u), th: f(t0 + (t1 - t0) * (t0 === t1 ? 0 : ease(u))) };
    if (!STOPS.length || STOPS[STOPS.length - 1].p !== s.p) STOPS.push(s);
  }
}
const geo = (th: number) => {
  const Ea = { x: H.x + 8 * U * Math.cos(rad(th)), y: H.y - 8 * U * Math.sin(rad(th)) };
  const v = { x: Eb.x - Ea.x, y: Eb.y - Ea.y };
  const L = Math.hypot(v.x, v.y);
  return { Ea, L, phi: (Math.atan2(v.y, v.x) * 180) / Math.PI, c: L / U };
};
const flat = (p: number) => (p >= 25 && p <= 34) || (p >= 52 && p <= 58);
const kf = (fn: (th: number) => string) => STOPS.map((s) => `${s.p}% { transform: ${fn(s.th)} }`).join(" ");
const kd = STOPS.map((s) => `${s.p}% { stroke-dasharray: ${f(geo(s.th).L)}px 1000px; stroke: ${flat(s.p) ? C.bad : C.good} }`).join(" ");
const cT = (th: number) => {
  const g = geo(th);
  return `translate(${f(g.Ea.x)}px, ${f(g.Ea.y)}px) rotate(${f(g.phi)}deg)`;
};
const END = 58.7;
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  r("rot", kf((th) => `rotate(${-th}deg)`), `animation-timing-function: linear; transform-box: view-box; transform-origin: ${H.x}px ${H.y}px; transform: rotate(${-END}deg);`),
  r("cs", kf(cT), `animation-timing-function: linear; transform-box: view-box; transform-origin: 0 0; transform: ${cT(END)};`),
  r("cd", kd, `animation-timing-function: linear; stroke: ${C.good}; stroke-dasharray: ${f(geo(END).L)}px 1000px;`),
  r("mk", kf((th) => `translateX(${f(geo(th).c * 14)}px)`), `animation-timing-function: linear; transform: translateX(${f(geo(END).c * 14)}px);`),
  pop("sticks", 5),
  win("m1", 24, 33),
  win("m2", 52, 59),
  pop("o18", 24),
  pop("o2", 52),
  r("green", "0%, 58% { transform: scaleX(0) } 68%, 100% { transform: scaleX(1) }", "transform-box: fill-box; transform-origin: center;"),
  r("q", "0%, 62% { opacity: 1 } 65%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("c9", 65),
  pop("fin", 64),
].join(" ");

const lab = { stroke: "none" } as const;
const BX = (c: number) => 20 + 14 * c; // the bar: c = 0 … 20

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* legend */}
        <Tex x={16} y={22} size={13} anchor="start" width={60}>{String.raw`a=8`}</Tex>
        <Tex x={16} y={40} size={13} anchor="start" width={60} color={C.primaryText}>{String.raw`b=10`}</Tex>
        <g className={cls("q")}>
          <Tex x={16} y={58} size={13} anchor="start" width={60} color={C.good}>{String.raw`c=\,?`}</Tex>
        </g>
        <g className={cls("c9")}>
          <Tex x={16} y={58} size={13} anchor="start" width={60} color={C.good}>{String.raw`c=9`}</Tex>
        </g>

        {/* the sticks: b is fixed, a swings around the hinge, c closes the triangle */}
        <g className={cls("sticks")}>
          <line x1={H.x} y1={H.y} x2={Eb.x} y2={Eb.y} stroke={C.primary} strokeWidth={8} />
          <line className={cls("rot")} x1={H.x} y1={H.y} x2={H.x + 8 * U} y2={H.y} stroke={C.ink} strokeWidth={8} />
          <g className={cls("cs")}>
            <line className={cls("cd")} x1={0} y1={0} x2={200} y2={0} strokeWidth={5} />
          </g>
          <circle cx={H.x} cy={H.y} r={6} fill={C.bg} stroke={C.ink} strokeWidth={2.5} />
        </g>

        {/* what the collapse says */}
        <g className={cls("m1")}>
          <Tex x={160} y={110} size={14} width={260} color={C.bad}>{String.raw`c=a+b:\ \text{flat, no triangle}`}</Tex>
        </g>
        <g className={cls("m2")}>
          <Tex x={160} y={110} size={14} width={260} color={C.bad}>{String.raw`c=b-a:\ \text{flat, no triangle}`}</Tex>
        </g>
        <g className={cls("fin")}>
          <text x={160} y={106} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted} {...lab}>Any side is shorter than the other two combined.</text>
          <Tex x={160} y={123} size={14} width={280}>{String.raw`\lvert a-b\rvert<c<a+b\ \Rightarrow\ 2<c<18`}</Tex>
        </g>

        {/* the range of c */}
        <rect x={BX(0)} y={138} width={280} height={8} rx={4} fill={C.fill} />
        <rect className={cls("green")} x={BX(2)} y={138} width={224} height={8} fill={C.good} />
        <g className={cls("o18")}>
          <circle cx={BX(18)} cy={142} r={6} fill={C.bg} stroke={C.ink} strokeWidth={2.5} />
          <text x={BX(18)} y={163} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>18</text>
        </g>
        <g className={cls("o2")}>
          <circle cx={BX(2)} cy={142} r={6} fill={C.bg} stroke={C.ink} strokeWidth={2.5} />
          <text x={BX(2)} y={163} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>2</text>
        </g>
        <g className={cls("mk")}>
          <circle cx={BX(0)} cy={142} r={5} fill={C.ink} stroke={C.bg} strokeWidth={1.5} />
        </g>
      </g>
    </Svg>
  );
}
