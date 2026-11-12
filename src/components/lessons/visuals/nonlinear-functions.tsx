import { C, Css, Svg } from "./kit";

// Nonlinear functions: a ball flies along y = −5(x − 3)² + 45. The numbers in the equation are its highest
// point, the vertex (3, 45). Grid: 1 square = 1 unit of x (24 px) by 15 units of y (24 px).
export const alt = "A ball flies along the parabola y = −5(x − 3)² + 45. Its highest point is the vertex (3, 45): the peak is at x = 3 and the maximum height is 45.";

const css = `
.v-nonlinear-functions-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-nonlinear-functions-scene { animation-name: v-nonlinear-functions-scene; }
@keyframes v-nonlinear-functions-scene { 0% { opacity: 0 } 5%, 91% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* The ball: steady in x, quadratic in y, so it moves along the true parabola. */
.v-nonlinear-functions-bx { animation-name: v-nonlinear-functions-bx; }
@keyframes v-nonlinear-functions-bx {
  0%, 9% { transform: translateX(0); animation-timing-function: linear }
  37%, 100% { transform: translateX(144px) }
}
.v-nonlinear-functions-by { animation-name: v-nonlinear-functions-by; }
@keyframes v-nonlinear-functions-by {
  0%, 9% { transform: translateY(0); animation-timing-function: cubic-bezier(0.333, 0.667, 0.667, 1) }
  23% { transform: translateY(-72px); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 0.333) }
  37%, 100% { transform: translateY(0) }
}
.v-nonlinear-functions-ball { opacity: 0; transform-box: fill-box; transform-origin: center; animation-name: v-nonlinear-functions-ball; }
@keyframes v-nonlinear-functions-ball {
  0%, 5% { opacity: 0; transform: scale(0.4); fill: ${C.primary} }
  8% { opacity: 1; transform: scale(1) }
  23% { fill: ${C.primary} }
  24.5% { fill: ${C.ink} }
  37% { opacity: 1; transform: scale(1) }
  41%, 100% { opacity: 0; transform: scale(0.4); fill: ${C.ink} }
}

/* The curve is drawn right behind the ball (offsets follow the arc length). */
.v-nonlinear-functions-curve { stroke-dasharray: 100 200; animation-name: v-nonlinear-functions-curve; }
@keyframes v-nonlinear-functions-curve {
  0%, 9% { stroke-dashoffset: 100; animation-timing-function: linear }
  12.5% { stroke-dashoffset: 82.95; animation-timing-function: linear }
  16% { stroke-dashoffset: 69.4; animation-timing-function: linear }
  19.5% { stroke-dashoffset: 58.79; animation-timing-function: linear }
  23% { stroke-dashoffset: 50; animation-timing-function: linear }
  26.5% { stroke-dashoffset: 41.21; animation-timing-function: linear }
  30% { stroke-dashoffset: 30.6; animation-timing-function: linear }
  33.5% { stroke-dashoffset: 17.05; animation-timing-function: linear }
  37%, 100% { stroke-dashoffset: 0 }
}

/* The top of the flight gets marked */
.v-nonlinear-functions-peak { transform-box: fill-box; transform-origin: center; animation-name: v-nonlinear-functions-peak; }
@keyframes v-nonlinear-functions-peak { 0%, 22.5% { transform: scale(0) } 26% { transform: scale(1.5) } 30%, 100% { transform: scale(1) } }
.v-nonlinear-functions-ping { opacity: 0; transform-box: fill-box; transform-origin: center; animation-name: v-nonlinear-functions-ping; }
@keyframes v-nonlinear-functions-ping {
  0%, 23% { opacity: 0; transform: scale(1); animation-timing-function: ease-out }
  24% { opacity: 0.8; animation-timing-function: ease-out }
  35%, 100% { opacity: 0; transform: scale(3.6) }
}

/* x = 3: the 3 in the equation lights up, then a guide drops from the top to 3 on the x-axis */
.v-nonlinear-functions-gx { stroke-dasharray: 100 200; animation-name: v-nonlinear-functions-gx; }
@keyframes v-nonlinear-functions-gx { 0%, 43% { stroke-dashoffset: 100 } 49%, 100% { stroke-dashoffset: 0 } }
.v-nonlinear-functions-tx { animation-name: v-nonlinear-functions-tx; }
@keyframes v-nonlinear-functions-tx { 0%, 47% { opacity: 0; transform: translateY(-5px) } 51%, 100% { opacity: 1; transform: none } }
.v-nonlinear-functions-hx { fill: ${C.primary}; animation-name: v-nonlinear-functions-hx; }
@keyframes v-nonlinear-functions-hx { 0%, 41% { fill: ${C.ink} } 44%, 100% { fill: ${C.primary} } }
.v-nonlinear-functions-in1 { animation-name: v-nonlinear-functions-in1; }
@keyframes v-nonlinear-functions-in1 { 0%, 50% { opacity: 0; transform: translateX(-8px) } 56%, 100% { opacity: 1; transform: none } }

/* y = 45: the 45 lights up, then a guide runs from the top to 45 on the y-axis */
.v-nonlinear-functions-gy { stroke-dasharray: 100 200; animation-name: v-nonlinear-functions-gy; }
@keyframes v-nonlinear-functions-gy { 0%, 59% { stroke-dashoffset: 100 } 65%, 100% { stroke-dashoffset: 0 } }
.v-nonlinear-functions-ty { animation-name: v-nonlinear-functions-ty; }
@keyframes v-nonlinear-functions-ty { 0%, 63% { opacity: 0; transform: translateX(5px) } 67%, 100% { opacity: 1; transform: none } }
.v-nonlinear-functions-hy { fill: ${C.primary}; animation-name: v-nonlinear-functions-hy; }
@keyframes v-nonlinear-functions-hy { 0%, 57% { fill: ${C.ink} } 60%, 100% { fill: ${C.primary} } }
.v-nonlinear-functions-in2 { animation-name: v-nonlinear-functions-in2; }
@keyframes v-nonlinear-functions-in2 { 0%, 66% { opacity: 0; transform: translateX(-8px) } 72%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-nonlinear-functions-a v-nonlinear-functions-scene">
        {/* Grid and axes */}
        <g stroke={C.line} strokeWidth={1}>
          {[76, 100, 124, 148, 172, 196].map((x) => (
            <line key={`x${x}`} x1={x} y1={54} x2={x} y2={150} />
          ))}
          {[54, 78, 102, 126].map((y) => (
            <line key={`y${y}`} x1={52} y1={y} x2={196} y2={y} />
          ))}
        </g>
        <path d="M52 48 V150 H204" stroke={C.muted} strokeWidth={1.5} fill="none" />
        <text x={46} y={58} textAnchor="end" fontSize={11} fill={C.muted}>
          y
        </text>
        <text x={201} y={164} textAnchor="middle" fontSize={11} fill={C.muted}>
          x
        </text>

        {/* The equation */}
        <text x={160} y={31} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.ink}>
          y = −5(x − <tspan className="v-nonlinear-functions-a v-nonlinear-functions-hx">3</tspan>)² +{" "}
          <tspan className="v-nonlinear-functions-a v-nonlinear-functions-hy">45</tspan>
        </text>

        {/* Guides from the top to the axes */}
        <line className="v-nonlinear-functions-a v-nonlinear-functions-gx" x1={124} y1={78} x2={124} y2={150} pathLength={100} stroke={C.primary} strokeWidth={1.5} />
        <line className="v-nonlinear-functions-a v-nonlinear-functions-gy" x1={124} y1={78} x2={52} y2={78} pathLength={100} stroke={C.primary} strokeWidth={1.5} />
        <text className="v-nonlinear-functions-a v-nonlinear-functions-tx" x={124} y={164} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
          3
        </text>
        <text className="v-nonlinear-functions-a v-nonlinear-functions-ty" x={46} y={82} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primary}>
          45
        </text>

        {/* The flight: the curve, the ball, the marked top */}
        <path className="v-nonlinear-functions-a v-nonlinear-functions-curve" d="M52 150 Q124 6 196 150" pathLength={100} stroke={C.ink} strokeWidth={2.5} fill="none" />
        <circle className="v-nonlinear-functions-a v-nonlinear-functions-ping" cx={124} cy={78} r={5} stroke={C.primary} strokeWidth={1.5} fill="none" />
        <circle className="v-nonlinear-functions-a v-nonlinear-functions-peak" cx={124} cy={78} r={5.5} fill={C.primary} stroke={C.bg} strokeWidth={2} />
        <g className="v-nonlinear-functions-a v-nonlinear-functions-bx">
          <g className="v-nonlinear-functions-a v-nonlinear-functions-by">
            <circle className="v-nonlinear-functions-a v-nonlinear-functions-ball" cx={52} cy={150} r={6} fill={C.ink} stroke={C.bg} strokeWidth={2} />
          </g>
        </g>

        {/* What the numbers mean */}
        <g className="v-nonlinear-functions-a v-nonlinear-functions-in1">
          <text x={226} y={86} fontSize={12} fill={C.muted}>
            peak at
          </text>
          <text x={226} y={107} fontSize={18} fontWeight={700} fill={C.ink}>
            x = 3
          </text>
        </g>
        <g className="v-nonlinear-functions-a v-nonlinear-functions-in2">
          <text x={226} y={134} fontSize={12} fill={C.muted}>
            max height
          </text>
          <text x={226} y={155} fontSize={18} fontWeight={700} fill={C.ink}>
            y = 45
          </text>
        </g>
      </g>
    </Svg>
  );
}
