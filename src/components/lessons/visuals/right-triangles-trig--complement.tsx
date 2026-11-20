import { C, Css, Svg } from "./kit";

// Right angle at C. Side BC (3) is opposite A and adjacent to B, so sin(A) = cos(B) = 3/5. Drawn 3 : 4 : 5.
export const alt =
  "Right triangle with sides 3, 4, 5. The side of length 3 is opposite angle A and adjacent to angle B, so sin(A) = 3/5 = cos(B). A and B add to 90 degrees.";

const P = "v-right-triangles-trig--complement-";
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
  pop("angs", 24),
  pop("side", 38),
  pop("tag", 46),
  pop("p1", 54),
  pop("p2", 64),
  pop("p3", 78),
].join(" ");

const wedge = (cx: number, cy: number, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(cx + rr * Math.cos(rad(d)))} ${f(cy + rr * Math.sin(rad(d)))}`;
  return `M${cx} ${cy} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
// C bottom-left (right angle), B right along the base (3 long), A straight above C (4 tall), 24 px per unit.
const U = 24;
const Cc = { x: 52, y: 132 };
const B = { x: Cc.x + 3 * U, y: Cc.y };
const A = { x: Cc.x, y: Cc.y - 4 * U };
const angA = (Math.atan(3 / 4) * 180) / Math.PI; // 36.87 at A
const angB = 90 - angA; // 53.13 at B
const num = { fontSize: 14, fontWeight: 700, fill: C.muted, stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("tri")} d={`M${Cc.x} ${Cc.y} L${B.x} ${B.y} L${A.x} ${A.y} Z`} pathLength={100} fill="none" stroke={C.muted} strokeWidth={2} />
        <path d={`M${Cc.x} ${Cc.y - 9} h9 v9`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
          <text x={Cc.x - 14} y={Cc.y + 14}>C</text>
          <text x={B.x + 6} y={B.y + 14}>B</text>
          <text x={A.x} y={A.y - 8} textAnchor="middle">A</text>
        </g>
        <text x={Cc.x - 8} y={f((Cc.y + A.y) / 2 + 5)} textAnchor="end" {...num}>4</text>
        <text x={f((B.x + A.x) / 2 + 10)} y={f((B.y + A.y) / 2 - 4)} {...num}>5</text>

        {/* A and B add to 90 degrees: the angle at A is 36.9, at B 53.1 */}
        <g className={cls("angs")}>
          <path d={wedge(A.x, A.y, 22, 90 - angA, 90)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <path d={wedge(B.x, B.y, 20, 180, 180 + angB)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
        </g>

        {/* the shared side */}
        <g className={cls("side")}>
          <line x1={Cc.x} y1={Cc.y} x2={B.x} y2={B.y} stroke={C.primary} strokeWidth={4} />
          <text x={f((Cc.x + B.x) / 2)} y={Cc.y + 18} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.primaryText} stroke="none">
            3
          </text>
        </g>
        <text className={cls("tag")} x={f((Cc.x + B.x) / 2)} y={Cc.y + 32} textAnchor="middle" fontSize={11} fill={C.muted} stroke="none">
          opposite A · adjacent to B
        </text>

        <text className={cls("p1")} x={196} y={46} fontSize={13} fontWeight={600} fill={C.muted} stroke="none">
          A + B = 90°
        </text>
        <text className={cls("p2")} x={196} y={82} fontSize={16} fontWeight={700} fill={C.ink} stroke="none">
          sin(A) = 3/5
        </text>
        <text className={cls("p3")} x={196} y={110} fontSize={16} fontWeight={700} fill={C.primaryText} stroke="none">
          cos(B) = 3/5
        </text>
      </g>
    </Svg>
  );
}
