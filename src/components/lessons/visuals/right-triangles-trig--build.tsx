import { C, Css, Svg } from "./kit";

// sin(A) = 8/17 gives opposite 8 and hypotenuse 17; Pythagoras gives adjacent 15; then tan(A) = 8/15. Drawn 8 : 15 : 17.
export const alt =
  "From sin(A) = 8/17 a right triangle gets opposite 8 and hypotenuse 17. The Pythagorean theorem gives the adjacent side 15, so tan(A) = 8/15.";

const P = "v-right-triangles-trig--build-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  r("tri", "0%, 6% { stroke-dashoffset: 100 } 20%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  pop("s1", 14),
  pop("opp", 24),
  pop("angA", 12),
  pop("hyp", 24),
  pop("q", 36),
  pop("s2", 46),
  pop("adj", 58),
  pop("s3", 72),
  r("qgone", "0%, 56% { opacity: 1 } 60%, 100% { opacity: 0 }", "opacity: 0;"),
].join(" ");

// 8-15-17, 8 px per unit. Right angle at B.
const U = 8;
const B = { x: 50, y: 142 };
const A = { x: B.x + 15 * U, y: B.y };
const Cc = { x: B.x, y: B.y - 8 * U };
const rad = (d: number) => (d * Math.PI) / 180;
const f = (n: number) => Math.round(n * 10) / 10;
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <path className={cls("tri")} d={`M${B.x} ${B.y} L${A.x} ${A.y} L${Cc.x} ${Cc.y} Z`} pathLength={100} fill="none" stroke={C.muted} strokeWidth={2} />
        <path d={`M${B.x} ${B.y - 10} h10 v10`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g fontSize={13} fontWeight={700} fill={C.ink} stroke="none">
          <text x={B.x - 10} y={B.y + 14}>B</text>
          <text x={A.x + 6} y={A.y + 14}>A</text>
          <text x={Cc.x} y={Cc.y - 8} textAnchor="middle">C</text>
        </g>

        <g className={cls("angA")}>
          <path d={wedge(A, 22, 180, 180 + (Math.atan2(8, 15) * 180) / Math.PI)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        </g>
        {/* the two sides sin(A) gives */}
        <g className={cls("opp")}>
          <line x1={B.x} y1={B.y} x2={Cc.x} y2={Cc.y} stroke={C.primary} strokeWidth={4} />
          <text x={B.x - 8} y={(B.y + Cc.y) / 2 + 5} textAnchor="end" fontSize={16} fontWeight={700} fill={C.primaryText} stroke="none">
            8
          </text>
        </g>
        <text className={cls("hyp")} x={(A.x + Cc.x) / 2 + 12} y={(A.y + Cc.y) / 2 - 8} fontSize={16} fontWeight={700} fill={C.primaryText} stroke="none">
          17
        </text>
        {/* the missing side */}
        <text className={cls("qgone")} x={(B.x + A.x) / 2} y={B.y + 22} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.muted} stroke="none">
          ?
        </text>
        <g className={cls("adj")}>
          <line x1={B.x} y1={B.y} x2={A.x} y2={A.y} stroke={C.ink} strokeWidth={4} />
          <text x={(B.x + A.x) / 2} y={B.y + 22} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink} stroke="none">
            15
          </text>
        </g>

        {/* the work */}
        <text className={cls("s1")} x={200} y={44} fontSize={15} fontWeight={700} fill={C.ink} stroke="none">
          sin(A) = 8/17
        </text>
        <g className={cls("s2")} fill={C.ink} stroke="none">
          <text x={200} y={86} fontSize={13} fill={C.muted}>
            √(17² − 8²)
          </text>
          <text x={200} y={106} fontSize={15} fontWeight={700}>
            = 15
          </text>
        </g>
        <text className={cls("s3")} x={200} y={146} fontSize={15} fontWeight={700} fill={C.primaryText} stroke="none">
          tan(A) = 8/15
        </text>
      </g>
    </Svg>
  );
}
