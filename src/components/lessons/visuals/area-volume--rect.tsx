import { C, Css, Svg } from "./kit";

// Perimeter is the distance around; area is the squares inside. A 9-by-w rectangle with perimeter 30: w = 6, area 54.
export const alt =
  "A rectangle 9 long. Its perimeter, the distance around, is 30, so 2 × (9 + w) = 30 and the width is 6. The area, the number of unit squares inside, is 9 × 6 = 54.";

const P = "v-area-volume--rect-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("box", 6),
  pop("nine", 10),
  r("walk", "0%, 18% { stroke-dashoffset: 100 } 42%, 100% { stroke-dashoffset: 0 }", "stroke-dasharray: 100;"),
  pop("p1", 20),
  pop("p2", 38),
  r("q", "0%, 40% { opacity: 1 } 46%, 100% { opacity: 0 }", "opacity: 0;"),
  pop("six", 46),
  pop("cells", 56),
  pop("p3", 58),
  pop("p4", 70),
].join(" ");

const U = 14;
const x0 = 34;
const y0 = 52;
const W = 9 * U;
const H = 6 * U;
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        <rect className={cls("box")} x={x0} y={y0} width={W} height={H} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        {/* unit squares: the area */}
        <g className={cls("cells")} stroke={C.muted} strokeWidth={1} opacity={0.6}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <line key={`v${i}`} x1={x0 + i * U} y1={y0} x2={x0 + i * U} y2={y0 + H} />
          ))}
          {[1, 2, 3, 4, 5].map((j) => (
            <line key={`h${j}`} x1={x0} y1={y0 + j * U} x2={x0 + W} y2={y0 + j * U} />
          ))}
        </g>
        {/* the walk around the edge: the perimeter */}
        <rect className={cls("walk")} x={x0} y={y0} width={W} height={H} pathLength={100} fill="none" stroke={C.primary} strokeWidth={3.5} />
        <text className={cls("nine")} x={x0 + W / 2} y={y0 - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink} {...lab}>9</text>
        <text className={cls("q")} x={x0 - 8} y={y0 + H / 2 + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={C.muted} {...lab}>w</text>
        <text className={cls("six")} x={x0 - 8} y={y0 + H / 2 + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={C.primaryText} {...lab}>6</text>

        <g className={cls("p1")} {...lab}>
          <text x={186} y={46} fontSize={11} fill={C.muted}>perimeter = 30</text>
          <text x={186} y={64} fontSize={12} fontWeight={700} fill={C.ink}>2 × (9 + w) = 30</text>
        </g>
        <text className={cls("p2")} x={186} y={84} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>9 + w = 15, w = 6</text>
        <text className={cls("p3")} x={186} y={122} fontSize={11} fill={C.muted} {...lab}>area: squares inside</text>
        <text className={cls("p4")} x={186} y={146} fontSize={17} fontWeight={700} fill={C.primaryText} {...lab}>9 × 6 = 54</text>
      </g>
    </Svg>
  );
}
