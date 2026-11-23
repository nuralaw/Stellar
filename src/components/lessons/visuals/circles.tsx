import { C, Css, Svg, Tex } from "./kit";

// The equation is drawn as three layers of the same formula (phantoms keep every glyph in place): the plain parts in ink,
// and the center numbers and the right side twice: in ink, then in the accent once the beat reaches them.
const ph = (s: string) => String.raw`\phantom{${s}}`;
const EQ = {
  rest: String.raw`(x-` + ph("3") + String.raw`)^2+(y+` + ph("1") + String.raw`)^2=` + ph("16"),
  c: ph(String.raw`(x-`) + "3" + ph(String.raw`)^2+(y+`) + "1" + ph(String.raw`)^2=16`),
  r: ph(String.raw`(x-3)^2+(y+1)^2=`) + "16",
};

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

.v-circles-hc { animation-name: v-circles-hc; }
@keyframes v-circles-hc { 0%, 30% { opacity: 1 } 34%, 90% { opacity: 0 } 97%, 100% { opacity: 1 } }
.v-circles-hca { animation-name: v-circles-hca; }
@keyframes v-circles-hca { 0%, 30% { opacity: 0 } 34%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }
.v-circles-hr { animation-name: v-circles-hr; }
@keyframes v-circles-hr { 0%, 50% { opacity: 1 } 54%, 90% { opacity: 0 } 97%, 100% { opacity: 1 } }
.v-circles-hra { animation-name: v-circles-hra; }
@keyframes v-circles-hra { 0%, 50% { opacity: 0 } 54%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }

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
      <g className="v-circles-a v-circles-eq">
        <Tex x={160} y={30} size={18} width={220}>{EQ.rest}</Tex>
        <g className="v-circles-a v-circles-hc">
          <Tex x={160} y={30} size={18} width={220}>{EQ.c}</Tex>
        </g>
        <g className="v-circles-a v-circles-hca">
          <Tex x={160} y={30} size={18} width={220} color={C.primaryText}>{EQ.c}</Tex>
        </g>
        <g className="v-circles-a v-circles-hr">
          <Tex x={160} y={30} size={18} width={220}>{EQ.r}</Tex>
        </g>
        <g className="v-circles-a v-circles-hra">
          <Tex x={160} y={30} size={18} width={220} color={C.primaryText}>{EQ.r}</Tex>
        </g>
      </g>

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
        <Tex x={206} y={157} size={18} anchor="start" width={100}>{String.raw`\sqrt{16}=4`}</Tex>
      </g>
    </Svg>
  );
}
