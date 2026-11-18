import { C, Css, Svg } from "./kit";

// Trap: only the radius doubles. V = πr²h becomes π(2r)²h = 4πr²h: × 4, not × 8.
export const alt =
  "Two cylinders with the same height. The second has double the radius, 2r. Its volume π(2r)²h = 4πr²h is 4 times the first, not 8 times, because only the radius changed and it is squared.";

const P = "v-area-volume--trap-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("small", 6),
  pop("big", 20),
  pop("p1", 34),
  pop("p2", 48),
  pop("p3", 62),
  pop("p4", 76),
].join(" ");

const yTop = 78;
const hh = 48;
const Cyl = ({ cx, rx, fill }: { cx: number; rx: number; fill: string }) => (
  <>
    <path d={`M${cx - rx} ${yTop} V${yTop + hh} A${rx} ${rx * 0.3} 0 0 0 ${cx + rx} ${yTop + hh} V${yTop}`} fill={C.fill} stroke={C.ink} strokeWidth={2} />
    <ellipse cx={cx} cy={yTop} rx={rx} ry={rx * 0.3} fill={fill} stroke={C.ink} strokeWidth={2} />
    <line x1={cx} y1={yTop} x2={cx + rx} y2={yTop} stroke={C.primary} strokeWidth={2.5} />
  </>
);
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <g className={cls("small")}>
          <Cyl cx={52} rx={20} fill={C.fill} />
          <text x={52} y={yTop + hh + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink} {...lab}>r</text>
        </g>
        <g className={cls("big")}>
          <Cyl cx={134} rx={40} fill={C.soft} />
          <text x={134} y={yTop + hh + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primary} {...lab}>2r</text>
          <text x={93} y={46} textAnchor="middle" fontSize={11} fill={C.muted} {...lab}>same height</text>
        </g>

        <text className={cls("p1")} x={196} y={50} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>πr²h</text>
        <g className={cls("p2")} {...lab}>
          <text x={196} y={76} fontSize={13} fontWeight={700} fill={C.ink}>π(<tspan fill={C.primary}>2r</tspan>)²h</text>
        </g>
        <text className={cls("p3")} x={196} y={102} fontSize={13} fontWeight={700} fill={C.ink} {...lab}>= 4 · πr²h</text>
        <text className={cls("p4")} x={196} y={140} fontSize={22} fontWeight={700} fill={C.primary} {...lab}>× 4</text>
        <text className={cls("p4")} x={246} y={140} fontSize={11} fill={C.muted} {...lab}>not × 8</text>
      </g>
    </Svg>
  );
}
