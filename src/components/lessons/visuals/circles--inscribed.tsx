import { C, Css, Svg } from "./kit";

// The inscribed angle ACB = 40° sees the same arc AB as the central angle AOB = 80°: double it. Arc AB = 80/360 = 2/9 of the circle.
export const alt =
  "A circle with points A, B and C. The inscribed angle ACB is 40 degrees and the central angle AOB on the same arc is 80 degrees, double. Arc AB is 80/360 = 2/9 of the circle.";

const P = "v-circles--inscribed-";
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
  draw("ring", 6, 12),
  pop("pts", 14),
  draw("ch1", 22, 8),
  draw("ch2", 28, 8),
  pop("ins", 36),
  pop("e1", 38),
  draw("rad1", 50, 8),
  draw("rad2", 54, 8),
  pop("cen", 60),
  pop("e2", 62),
  draw("arc", 72, 10),
  pop("e3", 74),
].join(" ");

const O = { x: 104, y: 90 };
const R = 58;
// Math angles (counterclockwise from the right): A at 130°, B at 50°, C at 270°. SVG y points down.
const at = (deg: number) => ({ x: f(O.x + R * Math.cos(rad(deg))), y: f(O.y - R * Math.sin(rad(deg))) });
const A = at(130);
const B = at(50);
const Cc = at(270);
/** Direction of the line from p to q as an SVG angle in degrees. */
const dir = (p: { x: number; y: number }, q: { x: number; y: number }) => (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const aC = [dir(Cc, A), dir(Cc, B)].sort((m, n) => m - n); // 40° apart
const aO = [dir(O, A), dir(O, B)].sort((m, n) => m - n); // 80° apart (A at −130°→230°, B at −50°→310°)
const arcPath = `M${A.x} ${A.y} A${R} ${R} 0 0 1 ${B.x} ${B.y}`;
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={R} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2} />

        {/* the inscribed angle at C */}
        <path className={cls("ins")} d={wedge(Cc, 24, aC[0], aC[1])} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
        <line className={cls("ch1")} x1={Cc.x} y1={Cc.y} x2={A.x} y2={A.y} pathLength={100} stroke={C.ink} strokeWidth={2} />
        <line className={cls("ch2")} x1={Cc.x} y1={Cc.y} x2={B.x} y2={B.y} pathLength={100} stroke={C.ink} strokeWidth={2} />

        {/* the central angle at O */}
        <path className={cls("cen")} d={wedge(O, 22, aO[0], aO[1])} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
        <line className={cls("rad1")} x1={O.x} y1={O.y} x2={A.x} y2={A.y} pathLength={100} stroke={C.primary} strokeWidth={2} />
        <line className={cls("rad2")} x1={O.x} y1={O.y} x2={B.x} y2={B.y} pathLength={100} stroke={C.primary} strokeWidth={2} />
        <path className={cls("arc")} d={arcPath} pathLength={100} fill="none" stroke={C.primary} strokeWidth={4.5} />

        <g className={cls("pts")} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>
          <text x={A.x - 6} y={A.y - 6} textAnchor="end">A</text>
          <text x={B.x + 6} y={B.y - 6}>B</text>
          <text x={Cc.x} y={Cc.y + 14} textAnchor="middle">C</text>
          <text x={O.x} y={O.y + 18} textAnchor="middle">O</text>
        </g>
        <circle cx={O.x} cy={O.y} r={3} fill={C.ink} />

        {/* the numbers */}
        <text className={cls("e1")} x={194} y={46} fontSize={14} fontWeight={700} fill={C.ink} {...lab}>∠ACB = 40°</text>
        <text className={cls("e1")} x={194} y={64} fontSize={11} fill={C.muted} {...lab}>on the circle</text>
        <text className={cls("e2")} x={194} y={98} fontSize={14} fontWeight={700} fill={C.primary} {...lab}>∠AOB = 80°</text>
        <text className={cls("e2")} x={194} y={116} fontSize={11} fill={C.muted} {...lab}>2 × 40°</text>
        <text className={cls("e3")} x={194} y={146} fontSize={14} fontWeight={700} fill={C.primary} {...lab}>arc = 80/360</text>
      </g>
    </Svg>
  );
}
