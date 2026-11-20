import { C, Css, Svg } from "./kit";

// A line crossing two parallel lines at 70°: eight angles, only two sizes (70° and 110°), and 70 + 110 = 180.
export const alt =
  "A line crosses two parallel lines. Of the eight angles, four measure 70 degrees (orange) and four measure 110 degrees (dark). A 70 degree and a 110 degree angle next to each other add to 180 degrees.";

const P = "v-lines-angles-triangles--transversal-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 10) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  draw("l1", 6, 8),
  draw("l2", 10, 8),
  draw("tr", 18, 10),
  pop("g1", 32),
  pop("g2", 50),
  pop("k1", 62),
  pop("k2", 72),
].join(" ");

const TH = 70; // the transversal makes 70° with the lines
const yTop = 44;
const yBot = 134;
const dx = (yBot - yTop) / Math.tan(rad(TH)); // horizontal shift between the two crossings
const P1 = { x: 96, y: yBot }; // lower crossing
const P2 = { x: f(P1.x + dx), y: yTop }; // upper crossing
// Four wedges around a crossing (SVG angles, clockwise from the right): [start, end, size, label angle]
const QUADS = [
  { a0: -TH, a1: 0, big: false },
  { a0: 0, a1: 180 - TH, big: true },
  { a0: 180 - TH, a1: 180, big: false },
  { a0: 180, a1: 360 - TH, big: true },
];
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const label = (c: { x: number; y: number }, q: (typeof QUADS)[number]) => {
  const m = (q.a0 + q.a1) / 2;
  return { x: f(c.x + 28 * Math.cos(rad(m))), y: f(c.y + 28 * Math.sin(rad(m)) + 4) };
};
const Angles = ({ c }: { c: { x: number; y: number } }) => (
  <>
    {QUADS.map((q) => (
      <path key={q.a0} d={wedge(c, 15, q.a0, q.a1)} fill={q.big ? C.fill : C.soft} stroke={q.big ? C.ink : C.primary} strokeWidth={1.5} />
    ))}
    {QUADS.map((q) => {
      const l = label(c, q);
      return (
        <text key={`t${q.a0}`} x={l.x} y={l.y} textAnchor="middle" fontSize={11} fontWeight={700} fill={q.big ? C.ink : C.primaryText} stroke="none">
          {q.big ? 110 : 70}°
        </text>
      );
    })}
  </>
);
// Transversal endpoints, 40 px past each crossing along the line
const dir = { x: Math.cos(rad(TH)), y: -Math.sin(rad(TH)) };
const T0 = { x: f(P1.x - 30 * dir.x), y: f(P1.y - 30 * dir.y) };
const T1 = { x: f(P2.x + 30 * dir.x), y: f(P2.y + 30 * dir.y) };

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* the two parallel lines, with arrow marks */}
        <line className={cls("l1")} x1={24} y1={yTop} x2={186} y2={yTop} pathLength={100} stroke={C.muted} strokeWidth={2} />
        <line className={cls("l2")} x1={24} y1={yBot} x2={186} y2={yBot} pathLength={100} stroke={C.muted} strokeWidth={2} />
        <g stroke={C.muted} strokeWidth={1.5} fill="none">
          <path d={`M170 ${yTop - 5} l6 5 l-6 5`} />
          <path d={`M170 ${yBot - 5} l6 5 l-6 5`} />
        </g>
        <line className={cls("tr")} x1={T0.x} y1={T0.y} x2={T1.x} y2={T1.y} pathLength={100} stroke={C.ink} strokeWidth={2} />

        {/* all eight angles */}
        <g className={cls("g1")}>
          <Angles c={P1} />
        </g>
        <g className={cls("g2")}>
          <Angles c={P2} />
        </g>

        {/* key */}
        <g className={cls("k1")} stroke="none">
          <rect x={206} y={44} width={12} height={12} rx={3} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={224} y={55} fontSize={14} fontWeight={700} fill={C.primaryText}>70° × 4</text>
          <rect x={206} y={68} width={12} height={12} rx={3} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <text x={224} y={79} fontSize={14} fontWeight={700} fill={C.ink}>110° × 4</text>
        </g>
        <g className={cls("k2")} stroke="none">
          <text x={206} y={112} fontSize={11} fill={C.muted}>next to each other:</text>
          <text x={206} y={132} fontSize={14} fontWeight={700} fill={C.ink}>70° + 110°</text>
          <text x={206} y={152} fontSize={14} fontWeight={700} fill={C.ink}>= 180°</text>
        </g>
      </g>
    </Svg>
  );
}
