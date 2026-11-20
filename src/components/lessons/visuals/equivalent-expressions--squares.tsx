import { C, Css, Svg } from "./kit";

// Difference of squares: x² with a 2 × 2 corner cut out can be rearranged into a rectangle (x + 2) by (x − 2).
export const alt =
  "A square of side x with a 2 by 2 corner cut out. The bottom strip turns and moves to the right side, making a rectangle x + 2 wide and x − 2 tall. So x² − 2² = (x + 2)(x − 2).";

const P = "v-equivalent-expressions--squares-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const css = `
.v-equivalent-expressions--squares-a { animation: 9s ease-in-out infinite; }
${[4, 56, 68, 80].map(fade).join("\n")}
.v-equivalent-expressions--squares-hole { opacity: 0; animation-name: v-equivalent-expressions--squares-hole; }
@keyframes v-equivalent-expressions--squares-hole { 0%, 4% { opacity: 0 } 9%, 28% { opacity: 1 } 36%, 100% { opacity: 0 } }
.v-equivalent-expressions--squares-move { transform-box: fill-box; transform-origin: center; animation-name: v-equivalent-expressions--squares-move; }
@keyframes v-equivalent-expressions--squares-move {
  0%, 4% { transform: translate(-60px, 36px) rotate(90deg); opacity: 0 }
  9%, 30% { transform: translate(-60px, 36px) rotate(90deg); opacity: 1 }
  54%, 90% { transform: none; opacity: 1 }
  97%, 100% { transform: none; opacity: 0 }
}
`;
const a = `${P}a`;
const hole = `${P}hole`;
const move = `${P}move`;

// x = 72 px, 2 = 24 px. The big top piece is x by (x − 2) = 72 × 48 at (60, 44). The strip is (x − 2) by 2 = 48 × 24:
// it starts under the top piece at (60, 92) and ends turned upright at (132, 44), 24 × 48.
export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Top piece */}
      <g className={`${a} ${fc(4)}`}>
        <rect x={60} y={44} width={72} height={48} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      </g>

      {/* The whole square's sides, before the cut (only at the start) */}
      <g className={`${a} ${hole}`}>
        <text x={96} y={36} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.muted}>
          x
        </text>
        <text x={52} y={84} textAnchor="end" fontSize={13} fontWeight={700} fill={C.muted}>
          x
        </text>
      </g>

      {/* The corner that was cut out (only at the start) */}
      <g className={`${a} ${hole}`}>
        <rect x={108} y={92} width={24} height={24} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={120} y={109} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muted}>
          2²
        </text>
      </g>

      {/* The strip: starts below, ends upright on the right */}
      <g className={`${a} ${move}`}>
        <rect x={132} y={44} width={24} height={48} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
      </g>

      {/* Side lengths */}
      <g className={`${a} ${fc(56)}`}>
        <text x={108} y={36} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
          x + 2
        </text>
        <text x={52} y={72} textAnchor="end" fontSize={13} fontWeight={700} fill={C.primaryText}>
          x − 2
        </text>
      </g>

      {/* The result */}
      <g className={`${a} ${fc(4)}`}>
        <text x={176} y={68} fontSize={15} fontWeight={600} fill={C.muted}>
          x² − 2²
        </text>
      </g>
      <g className={`${a} ${fc(80)}`}>
        <text x={176} y={94} fontSize={14} fontWeight={700} fill={C.good}>
          = (x + 2)(x − 2)
        </text>
      </g>
    </Svg>
  );
}
