import { C, Css, Svg } from "./kit";

// Nonlinear equations and systems: substitute to turn a parabola-and-line system into one equation;
// its solutions are the x-values where the two graphs cross.
export const alt = "The system y = x² and y = x + 2 becomes one equation, x² = x + 2. Its solutions, x = −1 and x = 2, are where the line crosses the parabola.";

const css = `
.v-nonlinear-equations-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-nonlinear-equations-scene { animation-name: v-nonlinear-equations-scene; }
@keyframes v-nonlinear-equations-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: y = x² and its parabola (accent while it is drawn) */
.v-nonlinear-equations-par { stroke-dasharray: 100; animation-name: v-nonlinear-equations-par; }
@keyframes v-nonlinear-equations-par {
  0%, 5% { stroke-dashoffset: 100; opacity: 0; stroke: ${C.primary} }
  6% { stroke-dashoffset: 100; opacity: 1; stroke: ${C.primary} }
  18%, 20% { stroke-dashoffset: 0; opacity: 1; stroke: ${C.primary} }
  25%, 100% { stroke-dashoffset: 0; opacity: 1; stroke: ${C.ink} }
}
.v-nonlinear-equations-ya { opacity: 0; animation-name: v-nonlinear-equations-ya; }
@keyframes v-nonlinear-equations-ya {
  0%, 4% { opacity: 0; transform: translateX(-6px); fill: ${C.primary} }
  9%, 20% { opacity: 1; transform: none; fill: ${C.primary} }
  25%, 37% { opacity: 1; transform: none; fill: ${C.ink} }
  41%, 100% { opacity: 0; transform: none; fill: ${C.ink} }
}

/* Beat 2: y = x + 2 and its line */
.v-nonlinear-equations-lin { stroke-dasharray: 100; animation-name: v-nonlinear-equations-lin; }
@keyframes v-nonlinear-equations-lin {
  0%, 20% { stroke-dashoffset: 100; opacity: 0; stroke: ${C.primary} }
  21% { stroke-dashoffset: 100; opacity: 1; stroke: ${C.primary} }
  31%, 33% { stroke-dashoffset: 0; opacity: 1; stroke: ${C.primary} }
  38%, 100% { stroke-dashoffset: 0; opacity: 1; stroke: ${C.ink} }
}
.v-nonlinear-equations-rb { animation-name: v-nonlinear-equations-rb; }
@keyframes v-nonlinear-equations-rb {
  0%, 19% { opacity: 0; transform: translateX(-6px); fill: ${C.primary} }
  24%, 33% { opacity: 1; transform: none; fill: ${C.primary} }
  38%, 100% { opacity: 1; transform: none; fill: ${C.ink} }
}
/* The y of the second equation stays accented: it is what gets replaced. */
.v-nonlinear-equations-yb { opacity: 0; animation-name: v-nonlinear-equations-yb; }
@keyframes v-nonlinear-equations-yb {
  0%, 19% { opacity: 0; transform: translateX(-6px) }
  24%, 37% { opacity: 1; transform: none }
  41%, 100% { opacity: 0; transform: translateY(8px) }
}

/* Beat 3: substitute. x² leaves the first equation and takes the place of y in the second. */
.v-nonlinear-equations-x2 { animation-name: v-nonlinear-equations-x2; }
@keyframes v-nonlinear-equations-x2 {
  0%, 4% { opacity: 0; transform: translate(30px, -30px); fill: ${C.primary} }
  9%, 20% { opacity: 1; transform: translate(36px, -30px); fill: ${C.primary} }
  25%, 33% { opacity: 1; transform: translate(36px, -30px); fill: ${C.ink} }
  37%, 40% { opacity: 1; transform: translate(36px, -30px); fill: ${C.primary} }
  49%, 52% { opacity: 1; transform: none; fill: ${C.primary} }
  57%, 100% { opacity: 1; transform: none; fill: ${C.ink} }
}

/* Beat 4: the crossings are the solutions */
.v-nonlinear-equations-dot { transform-box: fill-box; transform-origin: center; }
.v-nonlinear-equations-d1 { animation-name: v-nonlinear-equations-d1; }
@keyframes v-nonlinear-equations-d1 { 0%, 54% { transform: scale(0) } 57% { transform: scale(1.5) } 60%, 100% { transform: scale(1) } }
.v-nonlinear-equations-d2 { animation-name: v-nonlinear-equations-d2; }
@keyframes v-nonlinear-equations-d2 { 0%, 62% { transform: scale(0) } 65% { transform: scale(1.5) } 68%, 100% { transform: scale(1) } }
.v-nonlinear-equations-ring { opacity: 0; transform-box: fill-box; transform-origin: center; }
.v-nonlinear-equations-r1 { animation-name: v-nonlinear-equations-r1; }
@keyframes v-nonlinear-equations-r1 { 0%, 55% { opacity: 0; transform: scale(1) } 57% { opacity: 0.8; transform: scale(1.2) } 65%, 100% { opacity: 0; transform: scale(3) } }
.v-nonlinear-equations-r2 { animation-name: v-nonlinear-equations-r2; }
@keyframes v-nonlinear-equations-r2 { 0%, 63% { opacity: 0; transform: scale(1) } 65% { opacity: 0.8; transform: scale(1.2) } 73%, 100% { opacity: 0; transform: scale(3) } }

.v-nonlinear-equations-drop { stroke-dasharray: 100; }
.v-nonlinear-equations-p1 { animation-name: v-nonlinear-equations-p1; }
@keyframes v-nonlinear-equations-p1 { 0%, 56% { stroke-dashoffset: 100; opacity: 0 } 57% { stroke-dashoffset: 100; opacity: 1 } 61%, 100% { stroke-dashoffset: 0; opacity: 1 } }
.v-nonlinear-equations-p2 { animation-name: v-nonlinear-equations-p2; }
@keyframes v-nonlinear-equations-p2 { 0%, 64% { stroke-dashoffset: 100; opacity: 0 } 65% { stroke-dashoffset: 100; opacity: 1 } 71%, 100% { stroke-dashoffset: 0; opacity: 1 } }

.v-nonlinear-equations-t1 { animation-name: v-nonlinear-equations-t1; }
@keyframes v-nonlinear-equations-t1 { 0%, 60% { opacity: 0; transform: translateY(-5px) } 64%, 100% { opacity: 1; transform: none } }
.v-nonlinear-equations-t2 { animation-name: v-nonlinear-equations-t2; }
@keyframes v-nonlinear-equations-t2 { 0%, 70% { opacity: 0; transform: translateY(-5px) } 74%, 100% { opacity: 1; transform: none } }

.v-nonlinear-equations-ans { transform-box: fill-box; transform-origin: center; }
.v-nonlinear-equations-a1 { animation-name: v-nonlinear-equations-a1; }
@keyframes v-nonlinear-equations-a1 { 0%, 60% { opacity: 0; transform: scale(0.8) } 64% { opacity: 1; transform: scale(1.06) } 66%, 100% { opacity: 1; transform: none } }
.v-nonlinear-equations-a2 { animation-name: v-nonlinear-equations-a2; }
@keyframes v-nonlinear-equations-a2 { 0%, 70% { opacity: 0; transform: scale(0.8) } 74% { opacity: 1; transform: scale(1.06) } 76%, 100% { opacity: 1; transform: none } }
`;

// Graph: 1 unit = 22, origin at (88, 149). Window: −3 ≤ x ≤ 3, 0 ≤ y ≤ 6.
const U = 22;
const px = (x: number) => 88 + U * x;
const py = (y: number) => 149 - U * y;
// y = x² from x = −A to A, as an exact quadratic Bézier (the control point is where the end tangents meet).
const A = 2.39;
const parabola = `M${px(-A)} ${py(A * A)} Q${px(0)} ${py(-A * A)} ${px(A)} ${py(A * A)}`;

/** A solution chip. */
function Answer({ x, text, name }: { x: number; text: string; name: string }) {
  return (
    <g className={`v-nonlinear-equations-a v-nonlinear-equations-ans ${name}`}>
      <rect x={x} y={94} width={56} height={26} rx={13} fill={C.soft} stroke={C.primary} strokeWidth={1.5} />
      <text x={x + 28} y={112} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
        {text}
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-nonlinear-equations-a v-nonlinear-equations-scene">
        {/* Grid and axes */}
        <g stroke={C.line} strokeWidth={1}>
          {[-3, -2, -1, 1, 2, 3].map((x) => (
            <line key={`x${x}`} x1={px(x)} y1={py(6)} x2={px(x)} y2={py(0)} />
          ))}
          {[1, 2, 3, 4, 5, 6].map((y) => (
            <line key={`y${y}`} x1={px(-3)} y1={py(y)} x2={px(3)} y2={py(y)} />
          ))}
        </g>
        <g stroke={C.muted} strokeWidth={1.5}>
          <line x1={px(-3)} y1={py(0)} x2={px(3)} y2={py(0)} />
          <line x1={px(0)} y1={py(6)} x2={px(0)} y2={py(0)} />
        </g>

        {/* y = x² and y = x + 2 */}
        <path className="v-nonlinear-equations-a v-nonlinear-equations-par" d={parabola} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
        <line className="v-nonlinear-equations-a v-nonlinear-equations-lin" x1={px(-2.55)} y1={py(-0.55)} x2={px(2.9)} y2={py(4.9)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

        {/* The crossings (−1, 1) and (2, 4), dropped to the x-axis */}
        <line className="v-nonlinear-equations-a v-nonlinear-equations-drop v-nonlinear-equations-p1" x1={px(-1)} y1={py(1)} x2={px(-1)} y2={py(0)} pathLength={100} stroke={C.primary} strokeWidth={1.5} />
        <line className="v-nonlinear-equations-a v-nonlinear-equations-drop v-nonlinear-equations-p2" x1={px(2)} y1={py(4)} x2={px(2)} y2={py(0)} pathLength={100} stroke={C.primary} strokeWidth={1.5} />
        <circle className="v-nonlinear-equations-a v-nonlinear-equations-ring v-nonlinear-equations-r1" cx={px(-1)} cy={py(1)} r={5.5} fill="none" stroke={C.primary} strokeWidth={1.5} />
        <circle className="v-nonlinear-equations-a v-nonlinear-equations-ring v-nonlinear-equations-r2" cx={px(2)} cy={py(4)} r={5.5} fill="none" stroke={C.primary} strokeWidth={1.5} />
        <circle className="v-nonlinear-equations-a v-nonlinear-equations-dot v-nonlinear-equations-d1" cx={px(-1)} cy={py(1)} r={5.5} fill={C.primary} stroke={C.bg} strokeWidth={2} />
        <circle className="v-nonlinear-equations-a v-nonlinear-equations-dot v-nonlinear-equations-d2" cx={px(2)} cy={py(4)} r={5.5} fill={C.primary} stroke={C.bg} strokeWidth={2} />
        <text className="v-nonlinear-equations-a v-nonlinear-equations-t1" x={px(-1)} y={163} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          −1
        </text>
        <text className="v-nonlinear-equations-a v-nonlinear-equations-t2" x={px(2)} y={163} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          2
        </text>

        {/* The system. Row 1: y = x². Row 2: y = x + 2, where x² then replaces y. */}
        <g fontSize={18} fontWeight={700} fill={C.ink}>
          <text className="v-nonlinear-equations-a v-nonlinear-equations-ya" x={231} y={44} textAnchor="end">
            y =
          </text>
          <text className="v-nonlinear-equations-a v-nonlinear-equations-yb" x={216} y={74} textAnchor="end" fill={C.primary}>
            y
          </text>
          <text className="v-nonlinear-equations-a v-nonlinear-equations-x2" x={216} y={74} textAnchor="end">
            x²
          </text>
          <text className="v-nonlinear-equations-a v-nonlinear-equations-rb" x={221} y={74}>
            = x + 2
          </text>
        </g>

        {/* The solutions */}
        <Answer x={178} text="x = −1" name="v-nonlinear-equations-a1" />
        <Answer x={242} text="x = 2" name="v-nonlinear-equations-a2" />
      </g>
    </Svg>
  );
}
