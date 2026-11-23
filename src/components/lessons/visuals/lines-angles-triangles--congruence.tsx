import { C, Css, Svg, Tex } from "./kit";

// Which matching parts pin a triangle down: SAS, ASA/AAS and SSS do (one triangle), SSA does not (two triangles fit) and
// AAA does not (same shape, any size). A list of the five verdicts on the right fills in as each case is shown.
export const alt =
  "Which matching parts fix a triangle. SAS, ASA or AAS and SSS give exactly one triangle: a green check. SSA can give two different triangles and AAA only gives the same shape in any size: a red cross.";

const P = "v-lines-angles-triangles--congruence-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 3}%, 100% { opacity: 1 }`);
/** Visible only between t0 and t1 (hidden in the still frame). */
const win = (n: string, t0: number, t1: number) => r(n, `0%, ${t0}% { opacity: 0 } ${t0 + 3}%, ${t1}% { opacity: 1 } ${t1 + 3}%, 100% { opacity: 0 }`, "opacity: 0;");
const css = [
  `.${a} { animation: 12s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 4%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  // 1 SAS
  win("s1", 4, 20),
  pop("s1a", 6),
  pop("s1b", 8.5),
  pop("s1c", 11),
  pop("s1d", 13),
  pop("s1e", 15),
  pop("s1f", 17),
  // 2 ASA / AAS
  win("s2", 22, 37),
  pop("s2a", 23),
  pop("s2b", 26),
  pop("s2c", 29),
  pop("s2d", 31),
  pop("s2e", 33),
  // 3 SSS
  win("s3", 40, 55),
  pop("s3a", 41),
  pop("s3b", 44),
  pop("s3c", 47),
  pop("s3d", 50),
  pop("s3e", 52),
  // 4 SSA
  win("s4", 58, 74),
  pop("s4a", 59),
  pop("s4b", 62),
  pop("s4c", 65),
  pop("s4d", 68),
  pop("s4e", 71),
  // 5 AAA (the last one stays)
  pop("s5", 77),
  pop("s5a", 79),
  pop("s5b", 83),
  pop("s5c", 87),
  // the list on the right
  ...[0, 1, 2, 3].map((i) => win(`hl${i}`, [4, 22, 40, 58][i] - 1, [20, 37, 55, 74][i])),
  win("hl4", 76, 92),
  ...[17, 35, 53, 72, 90].map((t, i) => pop(`vd${i}`, t)),
].join(" ");

const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
type Pt = { x: number; y: number };
const pol = (c: Pt, rr: number, deg: number): Pt => ({ x: f(c.x + rr * Math.cos(rad(deg))), y: f(c.y + rr * Math.sin(rad(deg))) });
const pts = (...p: Pt[]) => p.map((q) => `${q.x},${q.y}`).join(" ");
const ang = (c: Pt, p: Pt) => (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI;
/** The small arc at corner c between the directions to p and q; n arcs (n = 2, 3 for "equal angle" marks). */
function Arc({ c, p, q, rr = 14, n = 1, stroke = C.primary }: { c: Pt; p: Pt; q: Pt; rr?: number; n?: number; stroke?: string }) {
  const a1 = ang(c, p);
  const a2 = ang(c, q);
  const d = ((a2 - a1 + 540) % 360) - 180;
  return (
    <g fill="none" stroke={stroke} strokeWidth={2}>
      {Array.from({ length: n }, (_, i) => {
        const s = pol(c, rr + 4 * i, a1);
        const e = pol(c, rr + 4 * i, a2);
        return <path key={i} d={`M${s.x} ${s.y} A${rr + 4 * i} ${rr + 4 * i} 0 0 ${d > 0 ? 1 : 0} ${e.x} ${e.y}`} />;
      })}
    </g>
  );
}
/** n short marks across the middle of a side: sides with the same number of marks are equal. */
function Ticks({ p, q, n }: { p: Pt; q: Pt; n: number }) {
  const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  const L = Math.hypot(q.x - p.x, q.y - p.y);
  const u = { x: (q.x - p.x) / L, y: (q.y - p.y) / L };
  return (
    <g stroke={C.ink} strokeWidth={2.5}>
      {Array.from({ length: n }, (_, i) => {
        const o = (i - (n - 1) / 2) * 5;
        const c = { x: m.x + u.x * o, y: m.y + u.y * o };
        return <line key={i} x1={f(c.x - u.y * 5)} y1={f(c.y + u.x * 5)} x2={f(c.x + u.y * 5)} y2={f(c.y - u.x * 5)} />;
      })}
    </g>
  );
}
const Check = () => <path d="M176 40 l9 10 l17 -20" fill="none" stroke={C.good} strokeWidth={4.5} />;
const Cross = () => <path d="M178 28 l22 22 M200 28 l-22 22" fill="none" stroke={C.bad} strokeWidth={4.5} />;
const Cap = ({ n, children, color = C.ink }: { n: string; children: string; color?: string }) => (
  <text className={cls(n)} x={118} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill={color} stroke="none">
    {children}
  </text>
);
const side = { fill: "none", stroke: C.ink, strokeWidth: 3 } as const;
const lab = { stroke: "none" } as const;

// the five cases, in the order they are shown
const ROWS = [
  { n: "SAS", ok: true },
  { n: "ASA/AAS", ok: true },
  { n: "SSS", ok: true },
  { n: "SSA", ok: false },
  { n: "AAA", ok: false },
];

// 1: two sides and the angle between
const A1 = { x: 36, y: 120 };
const B1 = { x: 136, y: 120 };
const C1 = pol(A1, 70, -50);
// 2: a side and two angles
const A2 = { x: 30, y: 120 };
const B2 = { x: 150, y: 120 };
const C2 = pol(A2, 97.8, -60);
// 3: three sides (and its mirror image)
const A3 = { x: 40, y: 82 };
const B3 = { x: 140, y: 82 };
const C3 = { x: 82.5, y: 26.4 };
const M3 = { x: 82.5, y: 137.6 };
// 4: SSA, 40° at A, side AC = 90, side BC = 64 opposite the angle: the circle around C meets the base twice
const A4 = { x: 30, y: 120 };
const C4 = pol(A4, 90, -40);
const D4 = { x: 27.3, y: 57.9 }; // sqrt(64² − 57.9²)
const X1 = { x: f(C4.x - D4.x), y: 120 };
const X2 = { x: f(C4.x + D4.x), y: 120 };
// 5: AAA, a small triangle nested in a big one (same corner A, same angles 50°, 60°, 70°)
const A5 = { x: 36, y: 120 };
const B5 = { x: 180, y: 120 };
const C5 = pol(A5, 132.7, -50);
const B5s = { x: 108, y: 120 };
const C5s = { x: f((A5.x + C5.x) / 2), y: f((A5.y + C5.y) / 2) };

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* 1: SAS */}
        <g className={cls("s1")}>
          <polygon className={cls("s1e")} points={pts(A1, B1, C1)} fill={C.goodSoft} stroke="none" />
          <line className={cls("s1d")} x1={B1.x} y1={B1.y} x2={C1.x} y2={C1.y} stroke={C.muted} strokeWidth={2.5} strokeDasharray="1 6" />
          <g className={cls("s1a")}>
            <line x1={A1.x} y1={A1.y} x2={B1.x} y2={B1.y} {...side} />
            <Ticks p={A1} q={B1} n={1} />
          </g>
          <g className={cls("s1b")}>
            <line x1={A1.x} y1={A1.y} x2={C1.x} y2={C1.y} {...side} />
            <Ticks p={A1} q={C1} n={2} />
          </g>
          <g className={cls("s1c")}>
            <Arc c={A1} p={B1} q={C1} rr={18} />
          </g>
          <line className={cls("s1e")} x1={B1.x} y1={B1.y} x2={C1.x} y2={C1.y} {...side} />
          <g className={cls("s1f")}><Check /></g>
          <Cap n="s1a">SAS: two sides + the angle between</Cap>
        </g>

        {/* 2: ASA / AAS */}
        <g className={cls("s2")}>
          <polygon className={cls("s2d")} points={pts(A2, B2, C2)} fill={C.goodSoft} stroke="none" />
          <g className={cls("s2a")}>
            <line x1={A2.x} y1={A2.y} x2={B2.x} y2={B2.y} {...side} />
            <Ticks p={A2} q={B2} n={1} />
            <Arc c={A2} p={B2} q={C2} rr={18} />
            <Arc c={B2} p={A2} q={C2} rr={18} />
          </g>
          <g className={cls("s2b")}>
            <line x1={A2.x} y1={A2.y} x2={C2.x} y2={C2.y} {...side} />
            <line x1={B2.x} y1={B2.y} x2={C2.x} y2={C2.y} {...side} />
          </g>
          <g className={cls("s2c")}>
            <Arc c={C2} p={A2} q={B2} rr={14} stroke={C.muted} />
            <Tex x={118} y={72} size={12} anchor="start" width={104} color={C.muted}>{String.raw`180^\circ-110^\circ=70^\circ`}</Tex>
          </g>
          <g className={cls("s2e")}><Check /></g>
          <Cap n="s2a">ASA / AAS: two angles + a side</Cap>
        </g>

        {/* 3: SSS */}
        <g className={cls("s3")}>
          <g className={cls("s3d")} opacity={0.45}>
            <polygon points={pts(A3, B3, M3)} fill="none" stroke={C.ink} strokeWidth={2} strokeDasharray="4 4" />
            <text x={146} y={118} fontSize={11} fontWeight={600} fill={C.muted} {...lab}>same triangle,</text>
            <text x={146} y={132} fontSize={11} fontWeight={600} fill={C.muted} {...lab}>flipped</text>
          </g>
          <polygon className={cls("s3c")} points={pts(A3, B3, C3)} fill={C.goodSoft} stroke="none" />
          <g className={cls("s3a")}>
            <line x1={A3.x} y1={A3.y} x2={B3.x} y2={B3.y} {...side} />
            <Ticks p={A3} q={B3} n={1} />
          </g>
          <g className={cls("s3b")}>
            <line x1={A3.x} y1={A3.y} x2={C3.x} y2={C3.y} {...side} />
            <Ticks p={A3} q={C3} n={2} />
            <line x1={B3.x} y1={B3.y} x2={C3.x} y2={C3.y} {...side} />
            <Ticks p={B3} q={C3} n={3} />
          </g>
          <g className={cls("s3e")}><Check /></g>
          <Cap n="s3a">SSS: three sides</Cap>
        </g>

        {/* 4: SSA fails */}
        <g className={cls("s4")}>
          <line x1={A4.x} y1={A4.y} x2={206} y2={A4.y} stroke={C.muted} strokeWidth={1.5} />
          <polygon className={cls("s4d")} points={pts(A4, X2, C4)} fill={C.badSoft} stroke={C.bad} strokeWidth={2.5} />
          <polygon className={cls("s4c")} points={pts(A4, X1, C4)} fill={C.soft} stroke={C.primary} strokeWidth={3} />
          <path className={cls("s4b")} d={`M${pol(C4, 64, 150).x} ${pol(C4, 64, 150).y} A64 64 0 0 0 ${pol(C4, 64, 30).x} ${pol(C4, 64, 30).y}`} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
          <g className={cls("s4a")}>
            <line x1={A4.x} y1={A4.y} x2={C4.x} y2={C4.y} {...side} />
            <Ticks p={A4} q={C4} n={1} />
            <Arc c={A4} p={X2} q={C4} rr={20} />
            <line x1={C4.x} y1={C4.y} x2={X1.x} y2={X1.y} {...side} />
            <Ticks p={C4} q={X1} n={2} />
          </g>
          <g className={cls("s4d")}>
            <line x1={C4.x} y1={C4.y} x2={X2.x} y2={X2.y} stroke={C.bad} strokeWidth={3} />
            <Ticks p={C4} q={X2} n={2} />
            <circle cx={X2.x} cy={X2.y} r={4.5} fill={C.bad} />
          </g>
          <circle className={cls("s4c")} cx={X1.x} cy={X1.y} r={4.5} fill={C.primary} />
          <g className={cls("s4e")}><Cross /></g>
          <Cap n="s4a" color={C.bad}>SSA: two triangles fit</Cap>
        </g>

        {/* 5: AAA fails */}
        <g className={cls("s5")}>
          <polygon className={cls("s5a")} points={pts(A5, B5, C5)} fill={C.fill} stroke={C.ink} strokeWidth={3} />
          <polygon className={cls("s5b")} points={pts(A5, B5s, C5s)} fill={C.badSoft} stroke={C.bad} strokeWidth={3} />
          <g className={cls("s5a")}>
            <Arc c={A5} p={B5} q={C5} rr={16} stroke={C.ink} />
            <Arc c={B5} p={A5} q={C5} rr={22} n={2} stroke={C.ink} />
            <Arc c={C5} p={A5} q={B5} rr={22} n={3} stroke={C.ink} />
          </g>
          <g className={cls("s5b")}>
            <Arc c={B5s} p={A5} q={C5s} rr={11} n={2} stroke={C.bad} />
            <Arc c={C5s} p={A5} q={B5s} rr={11} n={3} stroke={C.bad} />
          </g>
          <g className={cls("s5c")}><Cross /></g>
          <Cap n="s5c" color={C.bad}>AAA: same shape, different size</Cap>
        </g>

        {/* the list of verdicts */}
        {ROWS.map((row, i) => {
          const y = 18 + 31 * i;
          return (
            <g key={row.n}>
              <rect x={226} y={y} width={86} height={26} rx={7} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <rect className={cls(`hl${i}`)} x={226} y={y} width={86} height={26} rx={7} fill="none" stroke={C.primary} strokeWidth={2.5} />
              <g className={cls(`vd${i}`)}>
                <rect x={226} y={y} width={86} height={26} rx={7} fill={row.ok ? C.goodSoft : C.badSoft} stroke={row.ok ? C.good : C.bad} strokeWidth={2} />
                {row.ok ? <path d={`M236 ${y + 14} l4 4 l8 -9`} fill="none" stroke={C.good} strokeWidth={2.5} /> : <path d={`M236 ${y + 8} l9 10 M245 ${y + 8} l-9 10`} fill="none" stroke={C.bad} strokeWidth={2.5} />}
              </g>
              <text x={row.n.length > 4 ? 250 : 254} y={y + 18} fontSize={row.n.length > 4 ? 12 : 13} fontWeight={700} fill={C.ink} {...lab}>{row.n}</text>
            </g>
          );
        })}
      </g>
    </Svg>
  );
}
