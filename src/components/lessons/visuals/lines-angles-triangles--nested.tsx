import { C, Css, Svg } from "./kit";

// △ABC with BC = 9, AB = 6, AC = 7. D on AB with DB = 2, E on AC with CE = 7/3, so DE ∥ BC and DE = 6.
// △ADE ~ △ABC: AD/AB = DE/BC = 4/6 = 6/9 = 2/3. Drawn to scale, 16 px per unit.
export const alt =
  "Triangle ABC with a line DE parallel to the base BC. AD is 4 and DB is 2, so AB is 6. DE is 6 and BC is 9. The small triangle ADE is similar to ABC, so AD/AB = DE/BC = 4/6 = 6/9 = 2/3.";

const P = "v-lines-angles-triangles--nested-";
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
  draw("tri", 6, 14),
  draw("de", 24, 10),
  pop("lens", 34),
  pop("tag", 44),
  pop("sm", 48),
  pop("w1", 58),
  pop("w2", 68),
  pop("w3", 80),
].join(" ");

const U = 16;
// B = origin of the triangle. AB = 6, BC = 9, AC = 7: A.x = (36 − 49 + 81)/18, A.y = √(36 − A.x²)
const Ax = (36 - 49 + 81) / 18;
const Ay = Math.sqrt(36 - Ax * Ax);
const B = { x: 36, y: 146 };
const at = (x: number, y: number) => ({ x: f(B.x + x * U), y: f(B.y - y * U) });
const Bp = at(0, 0);
const Cp = at(9, 0);
const A = at(Ax, Ay);
const D = at(Ax / 3, Ay / 3); // DB = 2 of AB = 6
const E = at(9 + (Ax - 9) / 3, Ay / 3); // CE = 1/3 of CA
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const dirOf = (p: { x: number; y: number }, q: { x: number; y: number }) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
const aB = dirOf(Bp, A); // up-right from B
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("tri")} d={`M${Bp.x} ${Bp.y} L${Cp.x} ${Cp.y} L${A.x} ${A.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <path className={cls("sm")} d={`M${A.x} ${A.y} L${D.x} ${D.y} L${E.x} ${E.y} Z`} fill={C.soft} stroke="none" />
        <line className={cls("de")} x1={D.x} y1={D.y} x2={E.x} y2={E.y} pathLength={100} stroke={C.primary} strokeWidth={3} />

        {/* equal corresponding angles at D and B (DE ∥ BC) */}
        <g className={cls("tag")}>
          <path d={wedge(Bp, 16, aB, 0)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <path d={wedge(D, 12, aB, 0)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
        </g>
        <g fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
          <text x={A.x} y={A.y - 8} textAnchor="middle">A</text>
          <text x={Bp.x - 8} y={Bp.y + 14} textAnchor="end">B</text>
          <text x={Cp.x + 6} y={Cp.y + 14}>C</text>
          <text x={D.x - 8} y={D.y + 2} textAnchor="end">D</text>
          <text x={E.x + 8} y={E.y + 2}>E</text>
        </g>

        {/* the lengths */}
        <g className={cls("lens")} fontSize={12} fontWeight={700} fill={C.muted} {...lab}>
          <text x={f((A.x + D.x) / 2 - 8)} y={f((A.y + D.y) / 2 + 4)} textAnchor="end">4</text>
          <text x={f((D.x + Bp.x) / 2 - 8)} y={f((D.y + Bp.y) / 2 + 4)} textAnchor="end">2</text>
          <text x={f((D.x + E.x) / 2)} y={D.y - 6} textAnchor="middle" fill={C.primary}>6</text>
          <text x={f((Bp.x + Cp.x) / 2)} y={Bp.y + 16} textAnchor="middle">9</text>
        </g>

        {/* the ratios */}
        <text className={cls("w1")} x={206} y={44} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>DE ∥ BC</text>
        <text className={cls("w1")} x={206} y={62} fontSize={11} fill={C.muted} {...lab}>△ADE ~ △ABC</text>
        <text className={cls("w2")} x={206} y={96} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>AD/AB = DE/BC</text>
        <text className={cls("w3")} x={206} y={122} fontSize={15} fontWeight={700} fill={C.primary} {...lab}>4/6 = 6/9</text>
        <text className={cls("w3")} x={206} y={144} fontSize={15} fontWeight={700} fill={C.primary} {...lab}>= 2/3</text>
      </g>
    </Svg>
  );
}
