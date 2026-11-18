import { C, Css, Svg } from "./kit";

// Isosceles △PQR: PQ = PR (one tick each), apex P = 50°, so the base angles Q and R are 65° each (50 + 65 + 65 = 180).
export const alt =
  "Isosceles triangle PQR with equal sides PQ and PR marked by ticks. The apex angle P is 50 degrees, so the angles at Q and R are 65 degrees each, because 50 + 65 + 65 = 180.";

const P = "v-lines-angles-triangles--isosceles-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  r("tri", "0%, 6% { stroke-dashoffset: 100 } 20%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  pop("ticks", 24),
  pop("p1", 26),
  pop("apex", 38),
  pop("p2", 40),
  pop("base", 54),
  pop("p3", 56),
  pop("p4", 74),
].join(" ");

// P at the top; PQ = PR = 108; apex 50° (25° each side of straight down)
const L = 108;
const Pp = { x: 100, y: 30 };
const Q = { x: f(Pp.x - L * Math.sin(rad(25))), y: f(Pp.y + L * Math.cos(rad(25))) };
const R = { x: f(Pp.x + L * Math.sin(rad(25))), y: Q.y };
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
/** A tick across the middle of the side from p to q. */
const tick = (p: { x: number; y: number }, q: { x: number; y: number }) => {
  const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  const len = Math.hypot(q.x - p.x, q.y - p.y);
  const n = { x: -(q.y - p.y) / len, y: (q.x - p.x) / len };
  return `M${f(m.x - 6 * n.x)} ${f(m.y - 6 * n.y)} L${f(m.x + 6 * n.x)} ${f(m.y + 6 * n.y)}`;
};
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("tri")} d={`M${Pp.x} ${Pp.y} L${Q.x} ${Q.y} L${R.x} ${R.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <path className={cls("ticks")} d={`${tick(Pp, Q)} ${tick(Pp, R)}`} fill="none" stroke={C.primary} strokeWidth={2.5} />

        {/* apex angle: 25° either side of straight down means SVG angles 65°..115° */}
        <path className={cls("apex")} d={wedge(Pp, 22, 65, 115)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
        <text className={cls("apex")} x={Pp.x} y={Pp.y + 44} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>50°</text>
        {/* base angles: at Q the angle runs from straight along QR (0°) up to QP; at R mirrored */}
        <g className={cls("base")}>
          <path d={wedge(Q, 20, -65, 0)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <path d={wedge(R, 20, 180, 245)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={Q.x + 30} y={Q.y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary} {...lab}>65°</text>
          <text x={R.x - 30} y={R.y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary} {...lab}>65°</text>
        </g>
        <g fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
          <text x={Pp.x} y={Pp.y - 8} textAnchor="middle">P</text>
          <text x={Q.x - 8} y={Q.y + 6} textAnchor="end">Q</text>
          <text x={R.x + 8} y={R.y + 6}>R</text>
        </g>

        <text className={cls("p1")} x={200} y={44} fontSize={14} fontWeight={700} fill={C.ink} {...lab}>PQ = PR</text>
        <text className={cls("p1")} x={200} y={62} fontSize={11} fill={C.muted} {...lab}>ticks: equal sides</text>
        <text className={cls("p2")} x={200} y={92} fontSize={11} fill={C.muted} {...lab}>equal sides face</text>
        <text className={cls("p2")} x={200} y={108} fontSize={11} fill={C.muted} {...lab}>equal angles</text>
        <text className={cls("p3")} x={200} y={132} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>∠Q = ∠R = 65°</text>
        <text className={cls("p4")} x={200} y={152} fontSize={13} fontWeight={700} fill={C.primary} {...lab}>∠P = 50°</text>
      </g>
    </Svg>
  );
}
