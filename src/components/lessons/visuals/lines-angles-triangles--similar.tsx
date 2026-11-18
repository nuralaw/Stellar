import { C, Css, Svg } from "./kit";

// △PQR (PQ = 3, QR = 6, PR = 7) and △XYZ = 4 × △PQR (XY = 12, YZ = 24, XZ = 28), drawn to scale (8 px per unit for the big one's
// quarter: small 8 px per unit, big 32). P ↔ X, Q ↔ Y, R ↔ Z. Equal angles get the same arc marks: one arc at P/X, two at R/Z.
export const alt =
  "Triangle PQR and a triangle XYZ 4 times bigger, drawn to scale. Equal angles have the same arc marks: one arc at P and X, two arcs at R and Z. PQ = 3 matches XY = 12 and PR = 7 matches XZ = 28.";

const P = "v-lines-angles-triangles--similar-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 12) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  draw("small", 6),
  pop("sdots", 14),
  draw("big", 20, 14),
  pop("bdots", 32),
  pop("arcs", 42),
  pop("m1", 52),
  pop("m2", 64),
  pop("m3", 76),
].join(" ");

// Triangle with PR = 7 along the base, PQ = 3, QR = 6: Q = (22/14, √(9 − (22/14)²)).
const qx = 22 / 14;
const qy = Math.sqrt(9 - qx * qx);
const make = (x0: number, base: number, k: number) => ({
  P: { x: f(x0), y: base },
  R: { x: f(x0 + 7 * k), y: base },
  Q: { x: f(x0 + qx * k), y: f(base - qy * k) },
});
const T = make(232, 100, 8); // small: 56 wide
const X = make(26, 140, 32); // big: 4 times as large, 224 wide
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const arc = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)}`;
};
const dirOf = (p: { x: number; y: number }, q: { x: number; y: number }) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
const aP = dirOf(T.P, T.Q); // negative: PQ leaves P upward
const aRq = 360 + dirOf(T.R, T.Q); // RQ leaves R upward-left (180..360)
const tri = (t: typeof T) => `M${t.P.x} ${t.P.y} L${t.R.x} ${t.R.y} L${t.Q.x} ${t.Q.y} Z`;
const lab = { fontSize: 12, fontWeight: 700, fill: C.ink, stroke: "none" } as const;
const Dots = ({ t, names }: { t: typeof T; names: [string, string, string] }) => (
  <>
    {[t.P, t.Q, t.R].map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={C.ink} />
    ))}
    <text x={t.P.x} y={t.P.y + 16} textAnchor="middle" {...lab}>{names[0]}</text>
    <text x={t.Q.x} y={t.Q.y - 8} textAnchor="middle" {...lab}>{names[1]}</text>
    <text x={t.R.x} y={t.R.y + 16} textAnchor="middle" {...lab}>{names[2]}</text>
  </>
);
const Marks = ({ t, k }: { t: typeof T; k: number }) => (
  <>
    {/* one arc at P / X */}
    <path d={wedge(t.P, 2.4 * k, aP, 0)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
    {/* two arcs at R / Z */}
    <path d={wedge(t.R, 2.4 * k, 180, aRq)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
    <path d={arc(t.R, 3.4 * k, 180, aRq)} fill="none" stroke={C.ink} strokeWidth={1.5} />
  </>
);

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* big △XYZ */}
        <path className={cls("big")} d={tri(X)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <g className={cls("bdots")}>
          <Dots t={X} names={["X", "Y", "Z"]} />
        </g>
        {/* small △PQR */}
        <path className={cls("small")} d={tri(T)} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <g className={cls("sdots")}>
          <Dots t={T} names={["P", "Q", "R"]} />
        </g>
        <g className={cls("arcs")}>
          <Marks t={T} k={3.5} />
          <Marks t={X} k={9} />
        </g>

        {/* the matching sides: the one we use now is the accent */}
        <g className={cls("m2")}>
          <line x1={T.P.x} y1={T.P.y} x2={T.Q.x} y2={T.Q.y} stroke={C.primary} strokeWidth={3.5} />
          <line x1={X.P.x} y1={X.P.y} x2={X.Q.x} y2={X.Q.y} stroke={C.primary} strokeWidth={3.5} />
          <text x={f((T.P.x + T.Q.x) / 2 - 6)} y={f((T.P.y + T.Q.y) / 2 + 4)} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primary} stroke="none">3</text>
          <text x={f((X.P.x + X.Q.x) / 2 - 8)} y={f((X.P.y + X.Q.y) / 2 + 4)} textAnchor="end" fontSize={13} fontWeight={700} fill={C.primary} stroke="none">12</text>
        </g>
        <g className={cls("m3")}>
          <line x1={T.P.x} y1={T.P.y} x2={T.R.x} y2={T.R.y} stroke={C.primary} strokeWidth={3.5} />
          <line x1={X.P.x} y1={X.P.y} x2={X.R.x} y2={X.R.y} stroke={C.primary} strokeWidth={3.5} />
          <text x={f((T.P.x + T.R.x) / 2)} y={T.P.y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary} stroke="none">7</text>
          <text x={f((X.P.x + X.R.x) / 2)} y={X.P.y + 16} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary} stroke="none">28</text>
        </g>

        {/* the work (top middle, above the big triangle's long side) */}
        <text className={cls("m1")} x={128} y={30} fontSize={13} fontWeight={700} fill={C.ink} stroke="none">△PQR ~ △XYZ</text>
        <text className={cls("m2")} x={128} y={50} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">PQ 3 → XY 12</text>
        <text className={cls("m3")} x={128} y={68} fontSize={12} fontWeight={700} fill={C.ink} stroke="none">PR 7 → XZ 28</text>
        <text className={cls("m3")} x={270} y={138} fontSize={14} fontWeight={700} fill={C.primary} stroke="none">× 4</text>
      </g>
    </Svg>
  );
}
