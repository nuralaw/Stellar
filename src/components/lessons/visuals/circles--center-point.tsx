import { C, Css, Svg } from "./kit";

// Center (1, 2) and a point (4, 6): the distance is 3-4-5, so r = 5 and the equation is (x − 1)² + (y − 2)² = 25. 14 px per unit.
export const alt =
  "A circle with center (1, 2) through the point (4, 6). A right triangle with legs 3 and 4 gives the radius 5, so the equation is (x − 1)² + (y − 2)² = 25.";

const P = "v-circles--center-point-";
const a = `${P}a`;
const cls = (n: string) => `${a} ${P}${n}`;
const r = (n: string, kf: string, extra = "") => `.${P}${n} { ${extra} animation-name: ${P}${n}; } @keyframes ${P}${n} { ${kf} }`;
const pop = (n: string, t: number) => r(n, `0%, ${t}% { opacity: 0 } ${t + 6}%, 100% { opacity: 1 }`);
const draw = (n: string, t: number, d = 12) => r(n, `0%, ${t}% { stroke-dashoffset: 100 } ${t + d}%, 100% { stroke-dashoffset: 0 }`, "stroke-dasharray: 100;");
const css = [
  `.${a} { animation: 10s ease-in-out infinite; }`,
  r("scene", "0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 }"),
  pop("pts", 8),
  draw("legx", 20, 8),
  draw("legy", 28, 8),
  draw("hyp", 36, 8),
  pop("ring", 50),
  pop("s1", 40),
  pop("s2", 50),
  pop("s3", 66),
].join(" ");

const U = 14;
const O = { x: 96, y: 92 }; // screen position of the center (1, 2)
const at = (x: number, y: number) => ({ x: O.x + (x - 1) * U, y: O.y - (y - 2) * U });
const Pt = at(4, 6);
const Q = at(4, 2);
const origin = at(0, 0);
const lab = { stroke: "none" } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* grid and axes */}
        <g stroke={C.line} strokeWidth={1}>
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={`x${i}`} x1={at(i, 0).x} y1={at(0, -3).y} x2={at(i, 0).x} y2={at(0, 7).y} />
          ))}
          {[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
            <line key={`y${j}`} x1={at(-4, 0).x} y1={at(0, j).y} x2={at(6, 0).x} y2={at(0, j).y} />
          ))}
        </g>
        <g stroke={C.muted} strokeWidth={1.5}>
          <line x1={at(-4, 0).x} y1={origin.y} x2={at(6, 0).x} y2={origin.y} />
          <line x1={origin.x} y1={at(0, -3).y} x2={origin.x} y2={at(0, 7).y} />
        </g>

        {/* the circle (r = 5) */}
        <circle className={cls("ring")} cx={O.x} cy={O.y} r={5 * U} fill="none" stroke={C.ink} strokeWidth={2.5} />

        {/* the 3-4-5 triangle from the center to the point */}
        <line className={cls("legx")} x1={O.x} y1={O.y} x2={Q.x} y2={Q.y} pathLength={100} stroke={C.muted} strokeWidth={2.5} />
        <line className={cls("legy")} x1={Q.x} y1={Q.y} x2={Pt.x} y2={Pt.y} pathLength={100} stroke={C.muted} strokeWidth={2.5} />
        <line className={cls("hyp")} x1={O.x} y1={O.y} x2={Pt.x} y2={Pt.y} pathLength={100} stroke={C.primary} strokeWidth={3} />
        <g className={cls("pts")}>
          <circle cx={O.x} cy={O.y} r={4.5} fill={C.primary} />
          <circle cx={Pt.x} cy={Pt.y} r={4.5} fill={C.ink} />
          <text x={O.x - 8} y={O.y + 18} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(1, 2)</text>
          <text x={Pt.x + 8} y={Pt.y - 4} fontSize={12} fontWeight={700} fill={C.ink} {...lab}>(4, 6)</text>
        </g>
        <g className={cls("s1")} fontSize={12} fontWeight={700} fill={C.muted} {...lab}>
          <text x={(O.x + Q.x) / 2} y={O.y + 15} textAnchor="middle">3</text>
          <text x={Q.x + 7} y={(Q.y + Pt.y) / 2 + 4}>4</text>
          <text x={(O.x + Pt.x) / 2 - 8} y={(O.y + Pt.y) / 2 + 2} textAnchor="end" fill={C.primaryText}>r</text>
        </g>

        {/* the work */}
        <g className={cls("s2")} fill={C.ink} {...lab}>
          <text x={196} y={72} fontSize={14} fontWeight={700}>r² = 3² + 4²</text>
          <text x={196} y={92} fontSize={14} fontWeight={700}>= 25</text>
        </g>
        <g className={cls("s3")} fill={C.primary} {...lab}>
          <text x={196} y={130} fontSize={13} fontWeight={700}>(x − 1)² + (y − 2)²</text>
          <text x={196} y={148} fontSize={13} fontWeight={700}>= 25</text>
        </g>
      </g>
    </Svg>
  );
}
