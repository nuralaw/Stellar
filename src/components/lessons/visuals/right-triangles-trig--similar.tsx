import { C, Css, Svg } from "./kit";

// Two right triangles with the same angle A: 3-4-5 and 6-8-10 (drawn 1 : 2). The ratio sin(A) is 3/5 in both.
export const alt =
  "A small 3-4-5 right triangle and a big 6-8-10 right triangle share the same angle A. Opposite over hypotenuse is 3/5 in the small one and 6/10 in the big one: the same value, 0.6.";

const P = "v-right-triangles-trig--similar-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const f = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + 14}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  draw("big", 6),
  pop("bigl", 18),
  draw("small", 26),
  pop("smalll", 38),
  pop("arcs", 48),
  pop("p1", 58),
  pop("p2", 66),
  pop("p3", 78),
].join(" ");

const U = 11;
const wedge = (cx: number, cy: number, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(cx + rr * Math.cos(rad(d)))} ${f(cy + rr * Math.sin(rad(d)))}`;
  return `M${cx} ${cy} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const ang = (Math.atan(3 / 4) * 180) / Math.PI;
// big 8 x 6 (right angle at bottom-left), small 4 x 3
const BB = { x: 30, y: 140 };
const BA = { x: BB.x + 8 * U, y: 140 };
const BC = { x: BB.x, y: 140 - 6 * U };
const SB = { x: 172, y: 140 };
const SA = { x: SB.x + 4 * U, y: 140 };
const SC = { x: SB.x, y: 140 - 3 * U };

const lab = { fontSize: 13, fontWeight: 700, fill: C.ink, stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("big")} d={`M${BB.x} ${BB.y} L${BA.x} ${BA.y} L${BC.x} ${BC.y} Z`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />
        <g className={cls("bigl")}>
          <text x={BB.x - 6} y={BB.y - 30} textAnchor="end" {...lab}>6</text>
          <text x={BB.x + 4 * U} y={BB.y + 16} textAnchor="middle" {...lab}>8</text>
          <text x={f((BA.x + BC.x) / 2 + 12)} y={f((BA.y + BC.y) / 2 - 6)} {...lab}>10</text>
        </g>
        <path className={cls("small")} d={`M${SB.x} ${SB.y} L${SA.x} ${SA.y} L${SC.x} ${SC.y} Z`} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <g className={cls("smalll")}>
          <text x={SB.x - 6} y={SB.y - 14} textAnchor="end" {...lab} fill={C.primary}>3</text>
          <text x={SB.x + 2 * U} y={SB.y + 16} textAnchor="middle" {...lab} fill={C.primary}>4</text>
          <text x={f((SA.x + SC.x) / 2 + 10)} y={f((SA.y + SC.y) / 2 - 4)} {...lab} fill={C.primary}>5</text>
        </g>
        {/* the equal angle A in both */}
        <g className={cls("arcs")}>
          <path d={wedge(BA.x, BA.y, 20, 180, 180 + ang)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <path d={wedge(SA.x, SA.y, 14, 180, 180 + ang)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={BA.x + 8} y={BA.y + 14} {...lab}>A</text>
          <text x={SA.x + 8} y={SA.y + 14} {...lab}>A</text>
        </g>

        {/* the ratio, side by side */}
        <text className={cls("p1")} x={150} y={36} fontSize={11} fill={C.muted} stroke="none">
          sin A = opp/hyp
        </text>
        <g className={cls("p2")} stroke="none">
          <text x={150} y={62} fontSize={11} fill={C.muted}>big</text>
          <text x={186} y={64} fontSize={19} fontWeight={700} fill={C.ink}>6/10</text>
          <text x={150} y={88} fontSize={11} fill={C.muted}>small</text>
          <text x={186} y={90} fontSize={19} fontWeight={700} fill={C.primary}>3/5</text>
        </g>
        <text className={cls("p3")} x={244} y={128} fontSize={14} fontWeight={700} fill={C.ink} stroke="none">
          both 0.6
        </text>
      </g>
    </Svg>
  );
}
