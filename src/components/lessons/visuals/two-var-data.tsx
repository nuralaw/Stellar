import { C, Css, Svg } from "./kit";

// Two-variable data: a line of best fit runs through the dots; put x into it to read the predicted y.
export const alt = "A line of best fit, y = 3x + 20, is drawn through scattered dots, then used to predict y = 38 at x = 6.";

// Plot: x from 0 to 10 (13 units each), y from 0 to 60 (2 units each). Origin at (36, 146).
const X = (x: number) => 36 + 13 * x;
const Y = (y: number) => 146 - 2 * y;

const DOTS: [number, number, number][] = [
  [1, 26, 1],
  [2, 22, 2],
  [3, 33, 3],
  [4, 28, 1],
  [5, 40, 2],
  [7, 37, 3],
  [7.6, 46, 1],
  [8.6, 42, 2],
  [9.4, 52, 3],
];

const css = `
.v-two-var-data-a { animation: 9s ease-in-out infinite; }

.v-two-var-data-scene { animation-name: v-two-var-data-scene; }
@keyframes v-two-var-data-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

.v-two-var-data-d { transform-box: fill-box; transform-origin: center; }
.v-two-var-data-d1 { animation-name: v-two-var-data-d1; }
.v-two-var-data-d2 { animation-name: v-two-var-data-d2; }
.v-two-var-data-d3 { animation-name: v-two-var-data-d3; }
@keyframes v-two-var-data-d1 { 0%, 6% { transform: scale(0) } 10% { transform: scale(1.4) } 13%, 100% { transform: scale(1) } }
@keyframes v-two-var-data-d2 { 0%, 10% { transform: scale(0) } 14% { transform: scale(1.4) } 17%, 100% { transform: scale(1) } }
@keyframes v-two-var-data-d3 { 0%, 14% { transform: scale(0) } 18% { transform: scale(1.4) } 21%, 100% { transform: scale(1) } }

.v-two-var-data-fit { stroke-dasharray: 100; animation-name: v-two-var-data-fit; }
@keyframes v-two-var-data-fit { 0%, 24% { stroke-dashoffset: 100 } 40%, 100% { stroke-dashoffset: 0 } }

.v-two-var-data-eq { animation-name: v-two-var-data-eq; }
@keyframes v-two-var-data-eq { 0%, 38% { opacity: 0; transform: translateX(-8px) } 45%, 100% { opacity: 1; transform: none } }

.v-two-var-data-up { stroke-dasharray: 100; animation-name: v-two-var-data-up; }
@keyframes v-two-var-data-up { 0%, 50% { stroke-dashoffset: 100 } 59%, 100% { stroke-dashoffset: 0 } }
.v-two-var-data-x6 { animation-name: v-two-var-data-x6; }
@keyframes v-two-var-data-x6 { 0%, 46% { opacity: 0 } 51%, 100% { opacity: 1 } }

.v-two-var-data-hit { transform-box: fill-box; transform-origin: center; animation-name: v-two-var-data-hit; }
@keyframes v-two-var-data-hit { 0%, 58% { transform: scale(0) } 62% { transform: scale(1.5) } 65%, 100% { transform: scale(1) } }

.v-two-var-data-over { stroke-dasharray: 100; animation-name: v-two-var-data-over; }
@keyframes v-two-var-data-over { 0%, 63% { stroke-dashoffset: 100 } 72%, 100% { stroke-dashoffset: 0 } }

.v-two-var-data-ans { animation-name: v-two-var-data-ans; }
@keyframes v-two-var-data-ans { 0%, 70% { opacity: 0; transform: translateY(4px) } 76%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-two-var-data-a v-two-var-data-scene">
        {/* Grid and axes */}
        <g stroke={C.line} strokeWidth={1}>
          {[2, 4, 6, 8, 10].map((x) => (
            <line key={`x${x}`} x1={X(x)} y1={Y(0)} x2={X(x)} y2={Y(60)} />
          ))}
          {[20, 40, 60].map((y) => (
            <line key={`y${y}`} x1={X(0)} y1={Y(y)} x2={X(10)} y2={Y(y)} />
          ))}
        </g>
        <path d={`M${X(0)} ${Y(60)} V${Y(0)} H${X(10)}`} stroke={C.muted} strokeWidth={1.5} fill="none" />

        {/* The data */}
        {DOTS.map(([x, y, g]) => (
          <circle key={`${x}`} className={`v-two-var-data-a v-two-var-data-d v-two-var-data-d${g}`} cx={X(x)} cy={Y(y)} r={3.2} fill={C.muted} />
        ))}

        {/* Line of best fit: through (0, 20) and (10, 50) */}
        <line className="v-two-var-data-a v-two-var-data-fit" x1={X(0)} y1={Y(20)} x2={X(10)} y2={Y(50)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

        {/* Predict at x = 6: up to the line, across to y = 38 */}
        <line className="v-two-var-data-a v-two-var-data-up" x1={X(6)} y1={Y(0)} x2={X(6)} y2={Y(38)} pathLength={100} stroke={C.primary} strokeWidth={2} />
        <line className="v-two-var-data-a v-two-var-data-over" x1={X(6)} y1={Y(38)} x2={X(0)} y2={Y(38)} pathLength={100} stroke={C.primary} strokeWidth={2} />
        <circle className="v-two-var-data-a v-two-var-data-hit" cx={X(6)} cy={Y(38)} r={4.5} fill={C.primary} />
        <text className="v-two-var-data-a v-two-var-data-x6" x={X(6)} y={161} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
          6
        </text>
        <text className="v-two-var-data-a v-two-var-data-ans" x={X(0) - 5} y={Y(38) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primary}>
          38
        </text>

        {/* The equation and the prediction */}
        <g className="v-two-var-data-a v-two-var-data-eq">
          <text x={186} y={56} fontSize={12} fill={C.muted}>
            line of best fit
          </text>
          <text x={186} y={77} fontSize={18} fontWeight={700} fill={C.ink}>
            y = 3x + 20
          </text>
        </g>
        <g className="v-two-var-data-a v-two-var-data-ans">
          <text x={186} y={112} fontSize={12} fill={C.muted}>
            predicted at x = 6
          </text>
          <text x={186} y={133} fontSize={18} fontWeight={700} fill={C.ink}>
            3(6) + 20 = <tspan fill={C.primary}>38</tspan>
          </text>
        </g>
      </g>
    </Svg>
  );
}
