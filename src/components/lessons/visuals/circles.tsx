import { C, Css, Svg } from "./kit";

// Circles: the equation's numbers become the circle's center and radius (signs flip, the right side is r²).
export const alt = "The equation (x − 3)² + (y + 1)² = 16 drawn as a circle: center (3, −1), radius 4.";

const css = `
.v-circles-a { animation: 8s ease-in-out infinite; }
.v-circles-eq { animation-name: v-circles-eq; }
@keyframes v-circles-eq { 0% { opacity: 0 } 6%, 100% { opacity: 1 } }

.v-circles-ring { stroke-dasharray: 100; animation-name: v-circles-ring; }
@keyframes v-circles-ring {
  0%, 6% { stroke-dashoffset: 100; opacity: 1 }
  28%, 90% { stroke-dashoffset: 0; opacity: 1 }
  97%, 100% { stroke-dashoffset: 0; opacity: 0 }
}

.v-circles-dot { transform-box: fill-box; transform-origin: center; animation-name: v-circles-dot; }
@keyframes v-circles-dot {
  0%, 30% { transform: scale(0); opacity: 1 }
  34% { transform: scale(1.6) }
  38%, 90% { transform: scale(1); opacity: 1 }
  97%, 100% { transform: scale(1); opacity: 0 }
}

.v-circles-hc { fill: ${C.primary}; animation-name: v-circles-hc; }
@keyframes v-circles-hc { 0%, 30% { fill: ${C.ink} } 34%, 90% { fill: ${C.primary} } 97%, 100% { fill: ${C.ink} } }
.v-circles-hr { fill: ${C.primary}; animation-name: v-circles-hr; }
@keyframes v-circles-hr { 0%, 50% { fill: ${C.ink} } 54%, 90% { fill: ${C.primary} } 97%, 100% { fill: ${C.ink} } }

.v-circles-in1 { animation-name: v-circles-in1; }
@keyframes v-circles-in1 {
  0%, 36% { opacity: 0; transform: translateX(-8px) }
  42%, 90% { opacity: 1; transform: none }
  97%, 100% { opacity: 0; transform: none }
}
.v-circles-in2 { animation-name: v-circles-in2; }
@keyframes v-circles-in2 {
  0%, 56% { opacity: 0; transform: translateX(-8px) }
  62%, 90% { opacity: 1; transform: none }
  97%, 100% { opacity: 0; transform: none }
}

.v-circles-rad { stroke-dasharray: 100; animation-name: v-circles-rad; }
@keyframes v-circles-rad {
  0%, 50% { stroke-dashoffset: 100; opacity: 1 }
  56%, 90% { stroke-dashoffset: 0; opacity: 1 }
  97%, 100% { stroke-dashoffset: 0; opacity: 0 }
}
.v-circles-sweep { transform-box: view-box; transform-origin: 100px 112px; animation-name: v-circles-sweep; }
@keyframes v-circles-sweep { 0%, 62% { transform: rotate(0deg) } 82%, 100% { transform: rotate(-360deg) } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* Grid behind the circle */}
      <g stroke={C.line} strokeWidth={1}>
        {[24, 44, 64, 84, 104, 124, 144, 164, 184].map((x) => (
          <line key={`x${x}`} x1={x} y1={52} x2={x} y2={172} />
        ))}
        {[52, 72, 92, 112, 132, 152, 172].map((y) => (
          <line key={`y${y}`} x1={24} y1={y} x2={184} y2={y} />
        ))}
      </g>

      {/* The equation */}
      <text className="v-circles-a v-circles-eq" x={160} y={32} textAnchor="middle" fontSize={17} fontWeight={600} fill={C.ink}>
        (x − <tspan className="v-circles-a v-circles-hc">3</tspan>)² + (y + <tspan className="v-circles-a v-circles-hc">1</tspan>)² ={" "}
        <tspan className="v-circles-a v-circles-hr">16</tspan>
      </text>

      {/* The circle, its center and a sweeping radius */}
      <circle className="v-circles-a v-circles-ring" cx={100} cy={112} r={46} pathLength={100} stroke={C.ink} strokeWidth={2.5} fill="none" />
      <g className="v-circles-a v-circles-sweep">
        <line className="v-circles-a v-circles-rad" x1={100} y1={112} x2={146} y2={112} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      </g>
      <circle className="v-circles-a v-circles-dot" cx={100} cy={112} r={4.5} fill={C.primary} />

      {/* What the numbers mean */}
      <g className="v-circles-a v-circles-in1">
        <text x={206} y={92} fontSize={12} fill={C.muted}>
          center
        </text>
        <text x={206} y={113} fontSize={18} fontWeight={700} fill={C.ink}>
          (3, −1)
        </text>
      </g>
      <g className="v-circles-a v-circles-in2">
        <text x={206} y={140} fontSize={12} fill={C.muted}>
          radius
        </text>
        <text x={206} y={161} fontSize={18} fontWeight={700} fill={C.ink}>
          √16 = 4
        </text>
      </g>
    </Svg>
  );
}
