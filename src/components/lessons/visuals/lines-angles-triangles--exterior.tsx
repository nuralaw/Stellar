import { C, Css, Svg } from "./kit";

// Triangle ABC with A = 50°, B = 60°, C = 70°. Extend BC to D: the exterior angle at C is 180 − 70 = 110 = 50 + 60.
export const alt =
  "Triangle ABC with angles A = 50 degrees, B = 60 degrees and C = 70 degrees. The side BC is extended to D. The exterior angle at C is 110 degrees, which equals 50 + 60, the two angles not touching it.";

const P = "v-lines-angles-triangles--exterior-";
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
  pop("far", 24),
  pop("near", 34),
  r("ext", "0%, 44% { stroke-dashoffset: 100 } 52%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  pop("extang", 54),
  pop("p1", 56),
  pop("p2", 68),
  pop("p3", 80),
].join(" ");

// Law of sines with BC = 100: AB = 100 · sin70° / sin50° = 122.7
const B = { x: 34, y: 140 };
const Cc = { x: 134, y: 140 };
const D = { x: 192, y: 140 };
const AB = (100 * Math.sin(rad(70))) / Math.sin(rad(50));
const A = { x: f(B.x + AB * Math.cos(rad(60))), y: f(B.y - AB * Math.sin(rad(60))) };
const dirOf = (p: { x: number; y: number }, q: { x: number; y: number }) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const lab = { stroke: "none" } as const;
const angA = [dirOf(A, B), dirOf(A, Cc)].sort((m, n) => m - n); // 50° apart
const angC = dirOf(Cc, A); // up-left, 180 + 70 = 250° → −110°

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("tri")} d={`M${B.x} ${B.y} L${Cc.x} ${Cc.y} L${A.x} ${A.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <line className={cls("ext")} x1={Cc.x} y1={Cc.y} x2={D.x} y2={D.y} pathLength={100} stroke={C.ink} strokeWidth={2} />

        {/* the two angles far from C (A and B) */}
        <g className={cls("far")}>
          <path d={wedge(A, 22, angA[0], angA[1])} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <path d={wedge(B, 24, -60, 0)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={A.x} y={A.y + 40} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary} {...lab}>50°</text>
          <text x={B.x + 36} y={B.y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary} {...lab}>60°</text>
        </g>
        {/* the angle inside at C */}
        <g className={cls("near")}>
          <path d={wedge(Cc, 18, 180, angC + 360)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <text x={Cc.x - 32} y={Cc.y - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>70°</text>
        </g>
        {/* the exterior angle at C: from CD (0°) up to CA */}
        <g className={cls("extang")}>
          <path d={wedge(Cc, 24, angC, 0)} fill={C.soft} stroke={C.primary} strokeWidth={2} />
          <text x={Cc.x + 30} y={Cc.y - 14} fontSize={12} fontWeight={700} fill={C.primary} {...lab}>110°</text>
        </g>
        <g fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
          <text x={A.x} y={A.y - 8} textAnchor="middle">A</text>
          <text x={B.x - 8} y={B.y + 14} textAnchor="end">B</text>
          <text x={Cc.x + 4} y={Cc.y + 15}>C</text>
          <text x={D.x + 4} y={D.y + 15}>D</text>
        </g>

        <text className={cls("p1")} x={212} y={52} fontSize={11} fill={C.muted} {...lab}>exterior angle</text>
        <text className={cls("p1")} x={212} y={78} fontSize={22} fontWeight={700} fill={C.primary} {...lab}>110°</text>
        <text className={cls("p2")} x={212} y={104} fontSize={14} fontWeight={700} fill={C.ink} {...lab}>= 50° + 60°</text>
        <text className={cls("p3")} x={212} y={130} fontSize={11} fill={C.muted} {...lab}>the two far angles</text>
      </g>
    </Svg>
  );
}
