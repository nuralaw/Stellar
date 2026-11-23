import { C, Css, Svg, Tex } from "./kit";

// y = x² − 6x + k touches the x-axis once: drag the slider k until the parabola's bottom sits on the axis (k = 9).
export const alt =
  "The constant k in y = x² − 6x + k becomes a slider. At k = 0, 5 and 7 the parabola crosses the x-axis twice; at k = 9 it touches once, at (3, 0); beyond 9 it floats above the axis.";

const P = "v-desmos--slider-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number, d = 5) => r(n, `0%, ${t}% { opacity: 0 } ${t + d}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 8) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100 200;");
/** Opacity 1 inside the given [from, to] windows (percent of the loop), 0 outside; the still frame is `base`. */
const win = (n: string, iv: [number, number][], base: 0 | 1) => {
  const stops: string[] = ["0% { opacity: 0 }"];
  for (const [s, e] of iv) stops.push(`${s - 2}% { opacity: 0 }`, `${s}%, ${e}% { opacity: 1 }`, ...(e < 100 ? [`${e + 2}% { opacity: 0 }`] : []));
  return r(n, stops.join(" "), `opacity: ${base};`);
};
// Slider positions k = 0, 5, 7, 9, 11, back to 9: the keyframe plateaus of the handle, the fill and the parabola.
const KS = [
  [0, 28],
  [5, 34, 41],
  [7, 45, 50],
  [9, 58, 70],
  [11, 75, 84],
  [9, 89, 100],
] as const;
const TRACK = 190;
const UY = 100 / 23;
const along = (mk: (k: number) => string) =>
  KS.map((s) => (s.length === 2 ? `0%, ${s[1]}% { ${mk(s[0])} }` : `${s[1]}%, ${s[2]}% { ${mk(s[0])} }`)).join(" ");
const css = [
  `.${a} { animation: 11s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 94% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("formula", 4),
  pop("shell", 8),
  draw("para", 10, 8),
  pop("slider", 12),
  r("handle", along((k) => `transform: translateX(${f((k * TRACK) / 12)}px)`), `transform: translateX(${f((9 * TRACK) / 12)}px);`),
  r("fill", along((k) => `transform: scaleX(${Math.max(0.001, k / 12).toFixed(3)})`), `transform: scaleX(0.75); transform-box: fill-box; transform-origin: left center;`),
  r("para-move", along((k) => `transform: translateY(${f(-k * UY)}px)`), `transform: translateY(${f(-9 * UY)}px);`),
  win("s0", [[16, 28]], 0),
  win("s1", [[34, 41]], 0),
  win("s2", [[45, 50]], 0),
  win("s3", [[58, 70], [91, 100]], 1),
  win("s4", [[77, 83]], 0),
  win("d0", [[18, 28]], 0),
  win("d1", [[34, 41]], 0),
  win("d2", [[45, 50]], 0),
  win("d3", [[58, 70], [91, 100]], 1),
  pop("tag", 92, 4),
].join(" ");

// Graph window: x from −1 to 7, y from −11 to 12.
const RX = 16;
const RY = 34;
const RW = 190;
const RH = 100;
const px = (x: number) => f(RX + ((x + 1) * RW) / 8);
const py = (y: number) => f(RY + ((12 - y) * RH) / 23);
const para = Array.from({ length: 33 }, (_, i) => {
  const x = -1 + i * 0.25;
  return `${i ? "L" : "M"}${px(x)} ${py(x * x - 6 * x)}`;
}).join(" ");
const lab = { stroke: "none" } as const;
const Y0 = py(0);

const dots = (n: string, xs: number[]) => (
  <g className={cls(n)}>
    {xs.map((x) => (
      <circle key={x} cx={px(x)} cy={Y0} r={5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
    ))}
  </g>
);

const states = [
  { n: "s0", k: "k=0", big: "2", fill: C.ink, cap: "two crossings", capFill: C.muted },
  { n: "s1", k: "k=5", big: "2", fill: C.ink, cap: "two crossings", capFill: C.muted },
  { n: "s2", k: "k=7", big: "2", fill: C.ink, cap: "two crossings", capFill: C.muted },
  { n: "s3", k: "k=9", big: "1", fill: C.primaryText, cap: "one touch", capFill: C.primaryText },
  { n: "s4", k: "k=11", big: "0", fill: C.muted, cap: "none", capFill: C.muted },
];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("formula")}>
          <Tex x={16} y={14} size={15} anchor="start" width={110}>{String.raw`y=x^2-6x+k`}</Tex>
          <text x={128} y={19} fontSize={11} fill={C.muted} {...lab}>touches the x-axis once</text>
        </g>

        {/* the graph: the parabola moves up by k */}
        <clipPath id="v-desmos--slider-clip">
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} />
        </clipPath>
        <g className={cls("shell")}>
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} fill={C.bg} stroke={C.line} strokeWidth={1.5} />
          <g stroke={C.muted} strokeWidth={1.5}>
            <line x1={RX} y1={Y0} x2={RX + RW} y2={Y0} />
            <line x1={px(0)} y1={RY} x2={px(0)} y2={RY + RH} />
          </g>
        </g>
        <g clipPath="url(#v-desmos--slider-clip)">
          <g className={cls("para-move")}>
            <path className={cls("para")} d={para} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
          </g>
        </g>
        {dots("d0", [0, 6])}
        {dots("d1", [1, 5])}
        {dots("d2", [3 - Math.SQRT2, 3 + Math.SQRT2])}
        <g className={cls("d3")}>
          <circle cx={px(3)} cy={Y0} r={11} fill={C.soft} />
          <circle cx={px(3)} cy={Y0} r={6} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
        </g>

        {/* the slider */}
        <g className={cls("slider")}>
          <line x1={RX} y1={152} x2={RX + TRACK} y2={152} stroke={C.line} strokeWidth={5} />
          <line className={cls("fill")} x1={RX} y1={152} x2={RX + TRACK} y2={152} stroke={C.primary} strokeWidth={5} />
          <g className={cls("handle")}>
            <circle cx={RX} cy={152} r={9} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
            <text x={RX} y={156} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.onPrimary} {...lab}>k</text>
          </g>
        </g>

        {/* the reading: k and how many times the graph meets the axis */}
        {states.map((s) => (
          <g key={s.n} className={cls(s.n)}>
            <Tex x={262} y={58} size={19} width={84} color={C.ink}>{s.k}</Tex>
            <text x={262} y={108} textAnchor="middle" fontSize={44} fontWeight={700} fill={s.fill} {...lab}>{s.big}</text>
            <text x={262} y={128} textAnchor="middle" fontSize={12} fontWeight={700} fill={s.capFill} {...lab}>{s.cap}</text>
          </g>
        ))}
        <g className={cls("tag")} {...lab}>
          <text x={262} y={149} textAnchor="middle" fontSize={11} fill={C.muted}>1 constant: slider</text>
          <text x={262} y={163} textAnchor="middle" fontSize={11} fill={C.muted}>several: algebra</text>
        </g>
      </g>
    </Svg>
  );
}
