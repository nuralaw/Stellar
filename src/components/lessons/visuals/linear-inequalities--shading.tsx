import { C, Css, Svg } from "./kit";

// Reading a shaded graph: dashed line for < and >, solid line for ≤ and ≥; shade above for y >, below for y <.
export const alt =
  "Left: y > x − 1 is a dashed line with the region above it shaded. Right: y ≤ −x + 3 is a solid line with the region below it shaded. Dashed means the line is not included. Solid means it is.";

const P = "v-linear-inequalities--shading-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-linear-inequalities--shading-a { animation: 9s ease-in-out infinite; }
${[4, 14, 26, 50, 60, 72].map(fade).join("\n")}
`;
const a = `${P}a`;

// Each panel is 140 × 96, left edge x0, top 34. Center (x0 + 70, 82); unit 14 px: grid (x, y) -> (cx + 14x, 82 - 14y).
const cx = (x0: number) => x0 + 70;
const X = (x0: number, x: number) => cx(x0) + 14 * x;
const Y = (y: number) => 82 - 14 * y;

export default function Visual() {
  const L = 16;
  const R = 164;
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Left: y > x − 1, dashed, shade above */}
      <g className={`${a} ${fc(4)}`}>
        <rect x={L} y={34} width={140} height={96} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={L + 70} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
          y &gt; x − 1
        </text>
      </g>
      <g className={`${a} ${fc(14)}`}>
        <polygon
          points={`${X(L, -2.4)},${Y(-3.4)} ${X(L, -5)},${Y(-3.4)} ${X(L, -5)},${Y(3.4)} ${X(L, 4.4)},${Y(3.4)}`}
          fill={C.soft}
          stroke="none"
        />
        <path d={`M${X(L, 0)} ${Y(3.4)} V${Y(-3.4)} M${X(L, -5)} ${Y(0)} H${X(L, 5)}`} fill="none" stroke={C.muted} strokeWidth={1} />
        <line x1={X(L, -2.4)} y1={Y(-3.4)} x2={X(L, 4.4)} y2={Y(3.4)} stroke={C.primary} strokeWidth={2.5} strokeDasharray="6 5" />
      </g>
      <g className={`${a} ${fc(26)}`}>
        <text x={L + 70} y={146} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          dashed: not included
        </text>
        <text x={L + 70} y={162} textAnchor="middle" fontSize={12} fill={C.muted}>
          shade above
        </text>
      </g>

      {/* Right: y ≤ −x + 3, solid, shade below */}
      <g className={`${a} ${fc(50)}`}>
        <rect x={R} y={34} width={140} height={96} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={R + 70} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.ink}>
          y ≤ −x + 3
        </text>
      </g>
      <g className={`${a} ${fc(60)}`}>
        <polygon
          points={`${X(R, -0.4)},${Y(3.4)} ${X(R, -5)},${Y(3.4)} ${X(R, -5)},${Y(-3.4)} ${X(R, 5)},${Y(-3.4)} ${X(R, 5)},${Y(-2)}`}
          fill={C.soft}
          stroke="none"
        />
        <path d={`M${X(R, 0)} ${Y(3.4)} V${Y(-3.4)} M${X(R, -5)} ${Y(0)} H${X(R, 5)}`} fill="none" stroke={C.muted} strokeWidth={1} />
        <line x1={X(R, -0.4)} y1={Y(3.4)} x2={X(R, 5)} y2={Y(-2)} stroke={C.primary} strokeWidth={2.5} />
      </g>
      <g className={`${a} ${fc(72)}`}>
        <text x={R + 70} y={146} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          solid: included
        </text>
        <text x={R + 70} y={162} textAnchor="middle" fontSize={12} fill={C.muted}>
          shade below
        </text>
      </g>
    </Svg>
  );
}
