import { C, Css, Svg } from "./kit";

// Trap: an acute angle (x + 10)° and an obtuse angle (4x − 30)° side by side. They add to 180°; they are not equal.
// 5x − 20 = 180 gives x = 40: acute 50°, obtuse 130°. The drawing uses a 50° crossing.
export const alt =
  "A line crosses two parallel lines. An acute angle (x + 10) and an obtuse angle (4x − 30) are side by side. They are not equal: they add to 180 degrees, so x = 40 and the angles are 50 and 130.";

const P = "v-lines-angles-triangles--trap-";
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
  draw("lines", 6, 10),
  draw("tr", 14, 10),
  pop("ac", 28),
  pop("ob", 34),
  pop("eq", 42),
  r("strike", "0%, 54% { stroke-dashoffset: 100 } 60%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  pop("add", 64),
  pop("fin", 78),
].join(" ");

const TH = 50;
const yTop = 62;
const yBot = 122;
const P1 = { x: 86, y: yBot };
const P2 = { x: f(P1.x + (yBot - yTop) / Math.tan(rad(TH))), y: yTop };
const dir = { x: Math.cos(rad(TH)), y: -Math.sin(rad(TH)) };
const T0 = { x: f(P1.x - 30 * dir.x), y: f(P1.y - 30 * dir.y) };
const T1 = { x: f(P2.x + 24 * dir.x), y: f(P2.y + 24 * dir.y) };
const wedge = (c: { x: number; y: number }, rr: number, a0: number, a1: number) => {
  const p = (d: number) => `${f(c.x + rr * Math.cos(rad(d)))} ${f(c.y + rr * Math.sin(rad(d)))}`;
  return `M${c.x} ${c.y} L${p(a0)} A${rr} ${rr} 0 0 1 ${p(a1)} Z`;
};
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("lines")}>
          <line x1={20} y1={yTop} x2={176} y2={yTop} pathLength={100} stroke={C.muted} strokeWidth={2} />
          <line x1={20} y1={yBot} x2={176} y2={yBot} pathLength={100} stroke={C.muted} strokeWidth={2} />
        </g>
        <line className={cls("tr")} x1={T0.x} y1={T0.y} x2={T1.x} y2={T1.y} pathLength={100} stroke={C.ink} strokeWidth={2} />

        {/* the acute angle (x + 10)°, between the line going right and the transversal */}
        <g className={cls("ac")}>
          <path d={wedge(P1, 20, -TH, 0)} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
          <text x={f(P1.x + 28)} y={f(P1.y - 14)} fontSize={12} fontWeight={700} fill={C.primaryText} {...lab}>(x + 10)°</text>
        </g>
        {/* the obtuse angle (4x − 30)° on the other side of the transversal */}
        <g className={cls("ob")}>
          <path d={wedge(P1, 20, 180, 360 - TH)} fill={C.fill} stroke={C.ink} strokeWidth={1.5} />
          <text x={f(P1.x + 2)} y={f(P1.y - 40)} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(4x − 30)°</text>
        </g>

        {/* the trap, struck out, then the right rule */}
        <g className={cls("eq")} {...lab}>
          <text x={186} y={38} fontSize={11} fill={C.muted}>equal?</text>
          <text x={186} y={56} fontSize={13} fontWeight={700} fill={C.bad}>x + 10 = 4x − 30</text>
        </g>
        <line className={cls("strike")} x1={184} y1={52} x2={296} y2={52} pathLength={100} stroke={C.bad} strokeWidth={2} />
        <g className={cls("add")} {...lab}>
          <text x={186} y={90} fontSize={11} fill={C.muted}>they add to 180°</text>
          <text x={186} y={110} fontSize={13} fontWeight={700} fill={C.ink}>5x − 20 = 180</text>
          <text x={186} y={130} fontSize={13} fontWeight={700} fill={C.ink}>x = 40</text>
        </g>
        <text className={cls("fin")} x={186} y={154} fontSize={13} fontWeight={700} fill={C.primaryText} {...lab}>50° and 130°</text>
      </g>
    </Svg>
  );
}
