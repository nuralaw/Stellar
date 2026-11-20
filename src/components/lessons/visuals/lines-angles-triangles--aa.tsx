import { C, Css, Svg } from "./kit";

// △ABC with AB = 6, AC = 8 and angle A = 70°. D on AB with AD = 4, E on AC with AE = 3.
// AD/AC = AE/AB = 1/2 and ∠A is shared, so △ADE ~ △ACB (SAS) and ∠ADE = ∠ACB. 16 px per unit.
export const alt =
  "Triangle ABC with D on AB and E on AC. Angle ADE equals angle ACB and angle A is shared, so triangle ADE is similar to triangle ACB: AD/AC = AE/AB, 4/8 = 3/AB, so AB is 6.";

const P = "v-lines-angles-triangles--aa-";
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
  draw("tri", 6, 12),
  pop("pts", 18),
  draw("de", 28, 10),
  pop("lens", 38),
  pop("eq", 48),
  pop("w1", 54),
  pop("w2", 66),
  pop("w3", 78),
].join(" ");

const U = 16;
const A = { x: 96, y: 26 };
const at = (len: number, deg: number) => ({ x: f(A.x + len * U * Math.cos(rad(deg))), y: f(A.y + len * U * Math.sin(rad(deg))) });
// The two sides leave A at 125° (down-left) and 55° (down-right): angle A = 70°.
const B = at(6, 125);
const Cc = at(8, 55);
const D = at(4, 125);
const E = at(3, 55);
const dirOf = (p: { x: number; y: number }, q: { x: number; y: number }) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
/** The angle at c between the rays to p and q (the smaller side, sweeping clockwise). */
const between = (c: { x: number; y: number }, p: { x: number; y: number }, q: { x: number; y: number }, rr: number) => {
  const m = dirOf(c, p);
  const n = dirOf(c, q);
  const diff = ((n - m + 540) % 360) - 180;
  return diff > 0 ? wedge(c, rr, m, m + diff) : wedge(c, rr, n, n - diff);
};
const lab = { stroke: "none" } as const;
const mid = (p: { x: number; y: number }, q: { x: number; y: number }) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });

export default function Visual() {
  const mAD = mid(A, D);
  const mAE = mid(A, E);
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("tri")} d={`M${A.x} ${A.y} L${B.x} ${B.y} L${Cc.x} ${Cc.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <line className={cls("de")} x1={D.x} y1={D.y} x2={E.x} y2={E.y} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
        {/* the equal angles: ADE and ACB */}
        <g className={cls("eq")}>
          <path d={between(D, A, E, 14)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <path d={between(Cc, A, B, 20)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        </g>
        <g className={cls("pts")} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
          <text x={A.x} y={A.y - 8} textAnchor="middle">A</text>
          <text x={B.x - 8} y={B.y + 14} textAnchor="end">B</text>
          <text x={Cc.x + 8} y={Cc.y + 14}>C</text>
          <text x={D.x - 8} y={D.y + 2} textAnchor="end">D</text>
          <text x={E.x + 8} y={E.y + 2}>E</text>
        </g>
        <g className={cls("lens")} fontSize={12} fontWeight={700} fill={C.muted} {...lab}>
          <text x={f(mAD.x - 8)} y={f(mAD.y + 2)} textAnchor="end">4</text>
          <text x={f(mAE.x + 8)} y={f(mAE.y - 2)}>3</text>
        </g>

        <text className={cls("w1")} x={206} y={40} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>△ADE ~ △ACB</text>
        <text className={cls("w1")} x={206} y={56} fontSize={11} fill={C.muted} {...lab}>∠A is shared</text>
        <text className={cls("w1")} x={206} y={70} fontSize={11} fill={C.muted} {...lab}>∠ADE = ∠ACB</text>
        <text className={cls("w1")} x={206} y={90} fontSize={11} fontWeight={700} fill={C.ink} {...lab}>AC = 8</text>
        <text className={cls("w2")} x={206} y={112} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>AD/AC = AE/AB</text>
        <text className={cls("w2")} x={206} y={130} fontSize={14} fontWeight={700} fill={C.ink} {...lab}>4/8 = 3/AB</text>
        <text className={cls("w3")} x={206} y={154} fontSize={17} fontWeight={700} fill={C.primaryText} {...lab}>AB = 6</text>
      </g>
    </Svg>
  );
}
