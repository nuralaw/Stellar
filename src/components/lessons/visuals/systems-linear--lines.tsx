import { C, Css, Svg } from "./kit";

// Two special systems: parallel lines (no solution) and the same line written twice (infinitely many).
export const alt =
  "Left: the lines x + y = 3 and x + y = 5 are parallel and never cross, so there is no solution. Right: x + y = 3 and 2x + 2y = 6 are the same line, so every point on it is a solution.";

const P = "v-systems-linear--lines-";
const fc = (t: number) => `${P}f${t}`;
const dc = (t: number) => `${P}d${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 10}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const css = `
.v-systems-linear--lines-a { animation: 9s ease-in-out infinite; }
${[4, 28, 52, 76].map(fade).join("\n")}
${[8, 20, 56, 68].map(draw).join("\n")}
`;
const a = `${P}a`;

// Each panel is 140 × 100 at (x0, 26). Grid unit 14 px, origin at panel (24, 84): point (x, y) -> (x0 + 24 + 14x, 26 + 84 - 14y).
const X = (x0: number, x: number) => x0 + 24 + 14 * x;
const Y = (y: number) => 110 - 14 * y;

function Panel({ x0, same }: { x0: number; same: boolean }) {
  const t1 = same ? 52 : 4;
  const l1 = same ? 56 : 8;
  const l2 = same ? 68 : 20;
  const cap = same ? 76 : 28;
  return (
    <g>
      <g className={`${a} ${fc(t1)}`}>
        <rect x={x0} y={26} width={140} height={100} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <path d={`M${X(x0, 0)} ${Y(5.6)} V${Y(0)} H${X(x0, 7.6)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      </g>
      {/* x + y = 3 : (0, 3) to (3, 0) */}
      <line
        className={`${a} ${dc(l1)}`}
        x1={X(x0, -0.5)}
        y1={Y(3.5)}
        x2={X(x0, 3.5)}
        y2={Y(-0.5)}
        pathLength={100}
        stroke={same ? C.muted : C.ink}
        strokeWidth={same ? 6 : 2.5}
      />
      {/* x + y = 5 (left) or 2x + 2y = 6, the same line (right) */}
      {same ? (
        <line className={`${a} ${dc(l2)}`} x1={X(x0, -0.5)} y1={Y(3.5)} x2={X(x0, 3.5)} y2={Y(-0.5)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      ) : (
        <line className={`${a} ${dc(l2)}`} x1={X(x0, -0.5)} y1={Y(5.5)} x2={X(x0, 5.5)} y2={Y(-0.5)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      )}
      <g className={`${a} ${fc(cap)}`}>
        <text x={x0 + 70} y={146} textAnchor="middle" fontSize={15} fontWeight={700} fill={same ? C.good : C.ink}>
          {same ? "Infinitely many" : "No solution"}
        </text>
        <text x={x0 + 70} y={162} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ink}>
          {same ? "x + y = 3, " : "x + y = 3, "}
          <tspan fill={C.primary}>{same ? "2x + 2y = 6" : "x + y = 5"}</tspan>
        </text>
      </g>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <Panel x0={16} same={false} />
      <Panel x0={164} same />
    </Svg>
  );
}
