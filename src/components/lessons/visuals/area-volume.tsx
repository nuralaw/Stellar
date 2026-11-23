import { C, Css, Svg, Tex } from "./kit";

// Area and volume: the radius sweeps out the base (its area), then the base lifts through the height and
// stacks into the solid (its volume). Drawn to scale, 16 units per unit of length: diameter 6, height 5.
export const alt = "A cylinder with diameter 6 and height 5. Halving 6 gives radius 3, the radius sweeps a base of area 9π, and the base stacks up 5 layers high: volume 45π.";

const css = `
.v-area-volume-a { animation: 10s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-area-volume-scene { animation-name: v-area-volume-scene; }
@keyframes v-area-volume-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the diameter shrinks to the radius, 6 becomes 3 */
.v-area-volume-half { transform-box: fill-box; transform-origin: right center; transform: scaleX(0); animation-name: v-area-volume-half; }
@keyframes v-area-volume-half { 0%, 11% { transform: scaleX(1) } 19%, 100% { transform: scaleX(0) } }
.v-area-volume-rad { stroke: ${C.primary}; animation-name: v-area-volume-rad; }
@keyframes v-area-volume-rad {
  0%, 13% { stroke: ${C.ink}; transform: rotate(0deg) }
  19%, 27% { stroke: ${C.primary}; transform: rotate(0deg) }
  41%, 100% { stroke: ${C.primary}; transform: rotate(360deg) }
}
.v-area-volume-dot { transform-box: fill-box; transform-origin: center; animation-name: v-area-volume-dot; }
@keyframes v-area-volume-dot { 0%, 13% { transform: scale(0) } 17% { transform: scale(1.6) } 21%, 100% { transform: scale(1) } }
.v-area-volume-d { opacity: 0; animation-name: v-area-volume-d; }
@keyframes v-area-volume-d { 0%, 11% { opacity: 1 } 16%, 100% { opacity: 0 } }
.v-area-volume-r { animation-name: v-area-volume-r; }
@keyframes v-area-volume-r { 0%, 14% { opacity: 0 } 20%, 100% { opacity: 1 } }

/* Beat 2: the radius sweeps around and paints the base: that is the area */
.v-area-volume-pie { stroke-dasharray: 100; animation-name: v-area-volume-pie; }
@keyframes v-area-volume-pie { 0%, 27% { stroke-dashoffset: 100 } 41%, 100% { stroke-dashoffset: 0 } }

/* Beat 3: the base lifts through the height and leaves the solid behind, one layer per unit */
.v-area-volume-top { animation-name: v-area-volume-top; }
@keyframes v-area-volume-top { 0%, 50% { transform: translateY(80px) } 67%, 100% { transform: translateY(0) } }
.v-area-volume-body { transform-box: view-box; transform-origin: 104px 138px; animation-name: v-area-volume-body; }
@keyframes v-area-volume-body { 0%, 50% { transform: scaleY(0) } 67%, 100% { transform: scaleY(1) } }
.v-area-volume-foot { animation-name: v-area-volume-foot; }
@keyframes v-area-volume-foot { 0%, 45% { opacity: 0 } 46%, 100% { opacity: 1 } }
.v-area-volume-s1 { animation-name: v-area-volume-s1; }
@keyframes v-area-volume-s1 { 0%, 55.3% { opacity: 0 } 57%, 100% { opacity: 1 } }
.v-area-volume-s2 { animation-name: v-area-volume-s2; }
@keyframes v-area-volume-s2 { 0%, 57.5% { opacity: 0 } 59.2%, 100% { opacity: 1 } }
.v-area-volume-s3 { animation-name: v-area-volume-s3; }
@keyframes v-area-volume-s3 { 0%, 59.5% { opacity: 0 } 61.2%, 100% { opacity: 1 } }
.v-area-volume-s4 { animation-name: v-area-volume-s4; }
@keyframes v-area-volume-s4 { 0%, 61.7% { opacity: 0 } 63.4%, 100% { opacity: 1 } }
.v-area-volume-hl { stroke-dasharray: 100; animation-name: v-area-volume-hl; }
@keyframes v-area-volume-hl { 0%, 50% { stroke-dashoffset: 100 } 67%, 100% { stroke-dashoffset: 0 } }
.v-area-volume-ht { fill: ${C.primaryText}; animation-name: v-area-volume-ht; }
@keyframes v-area-volume-ht { 0%, 50% { fill: ${C.ink} } 56%, 100% { fill: ${C.primaryText} } }

/* The work, one line per beat */
.v-area-volume-t1 { animation-name: v-area-volume-t1; }
@keyframes v-area-volume-t1 { 0%, 15% { opacity: 0; transform: translateX(-8px) } 22%, 100% { opacity: 1; transform: translateX(0) } }
.v-area-volume-t2 { animation-name: v-area-volume-t2; }
@keyframes v-area-volume-t2 { 0%, 32% { opacity: 0; transform: translateX(-8px) } 39%, 100% { opacity: 1; transform: translateX(0) } }
.v-area-volume-t3 { animation-name: v-area-volume-t3; }
@keyframes v-area-volume-t3 { 0%, 60% { opacity: 0; transform: translateX(-8px) } 67%, 100% { opacity: 1; transform: translateX(0) } }
.v-area-volume-p1 { opacity: 0; animation-name: v-area-volume-p1; }
@keyframes v-area-volume-p1 { 0%, 15% { opacity: 1 } 19%, 100% { opacity: 0 } }
.v-area-volume-p2 { opacity: 0; animation-name: v-area-volume-p2; }
@keyframes v-area-volume-p2 { 0%, 32% { opacity: 1 } 36%, 100% { opacity: 0 } }
.v-area-volume-p3 { opacity: 0; animation-name: v-area-volume-p3; }
@keyframes v-area-volume-p3 { 0%, 60% { opacity: 1 } 64%, 100% { opacity: 0 } }
.v-area-volume-ans { animation-name: v-area-volume-ans; }
@keyframes v-area-volume-ans { 0%, 70% { opacity: 0 } 75%, 100% { opacity: 1 } }
`;

// Cylinder geometry in canvas units.
const U = 16; // 1 unit of length
const CX = 104; // axis
const RX = 3 * U; // radius 3
const RY = 13; // how flat the circles look
const BASE = 138; // center of the base
const TOP = BASE - 5 * U; // center of the top face: height 5
const L = CX - RX;
const R = CX + RX;
const HX = 41; // the height marker
/** The front rim of a circle of the cylinder whose center is at height y. */
const rim = (y: number) => `M${L} ${y} A${RX} ${RY} 0 0 0 ${R} ${y}`;

/** One line of work: a small label, and the math that replaces a placeholder bar when its beat comes. */
function Work({ n, y, label, tex, ans, dx = 0 }: { n: number; y: number; label: string; tex: string; ans?: string; dx?: number }) {
  return (
    <>
      <text x={188} y={y} fontSize={12} fill={C.muted}>
        {label}
      </text>
      <rect className={`v-area-volume-a v-area-volume-p${n}`} x={188} y={y + 8} width={64} height={12} rx={6} fill={C.fill} />
      <g className={`v-area-volume-a v-area-volume-t${n}`}>
        <Tex x={188} y={y + 14} size={16} anchor="start" width={120}>
          {tex}
        </Tex>
        {ans && (
          <g className="v-area-volume-a v-area-volume-ans">
            <Tex x={188 + dx} y={y + 14} size={16} anchor="start" width={60} color={C.primaryText}>
              {ans}
            </Tex>
          </g>
        )}
      </g>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-area-volume-a v-area-volume-scene">
        {/* Where the solid will be */}
        <g fill="none" stroke={C.line} strokeWidth={1.5} strokeDasharray="3 4">
          <ellipse cx={CX} cy={TOP} rx={RX} ry={RY} />
          <line x1={L} y1={TOP} x2={L} y2={BASE} />
          <line x1={R} y1={TOP} x2={R} y2={BASE} />
        </g>

        {/* The height, 5: it fills in as the base lifts */}
        <g stroke={C.muted} strokeWidth={1.5}>
          <line x1={HX} y1={TOP} x2={HX} y2={BASE} />
          <line x1={HX - 4} y1={TOP} x2={HX + 4} y2={TOP} />
          <line x1={HX - 4} y1={BASE} x2={HX + 4} y2={BASE} />
        </g>
        <line className="v-area-volume-a v-area-volume-hl" x1={HX} y1={BASE} x2={HX} y2={TOP} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
        <text className="v-area-volume-a v-area-volume-ht" x={HX - 12} y={(TOP + BASE) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
          5
        </text>

        {/* The solid grows up from the base: 5 layers, one per unit of height */}
        <rect className="v-area-volume-a v-area-volume-body" x={L} y={TOP} width={2 * RX} height={BASE - TOP} fill={C.soft} />
        <path className="v-area-volume-a v-area-volume-foot" d={`${rim(BASE)} Z`} fill={C.soft} />
        <g fill="none" stroke={C.primary} strokeOpacity={0.4} strokeWidth={1.5}>
          {[1, 2, 3, 4].map((k) => (
            <path key={k} className={`v-area-volume-a v-area-volume-s${k}`} d={rim(BASE - k * U)} />
          ))}
        </g>
        <g className="v-area-volume-a v-area-volume-body" stroke={C.ink} strokeWidth={2.5}>
          <line x1={L} y1={TOP} x2={L} y2={BASE} />
          <line x1={R} y1={TOP} x2={R} y2={BASE} />
        </g>
        <path d={rim(BASE)} fill="none" stroke={C.ink} strokeWidth={2.5} />

        {/* The base: it starts at the bottom and ends as the top face */}
        <g className="v-area-volume-a v-area-volume-top">
          <ellipse cx={CX} cy={TOP} rx={RX} ry={RY} fill={C.bg} />
          {/* A circle seen at a slant: everything in here is squashed to the ellipse */}
          <g transform={`translate(${CX} ${TOP}) scale(1 ${RY / RX})`}>
            <circle
              className="v-area-volume-a v-area-volume-pie"
              r={RX / 2}
              fill="none"
              stroke={C.primary}
              strokeOpacity={0.22}
              strokeWidth={RX}
              strokeLinecap="butt"
              pathLength={100}
            />
            <line className="v-area-volume-a v-area-volume-rad" x1={0} y1={0} x2={RX} y2={0} stroke={C.primary} strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
          </g>
          <ellipse cx={CX} cy={TOP} rx={RX} ry={RY} fill="none" stroke={C.ink} strokeWidth={2.5} />
          <line className="v-area-volume-a v-area-volume-half" x1={L} y1={TOP} x2={CX} y2={TOP} stroke={C.ink} strokeWidth={2.5} />
          <circle className="v-area-volume-a v-area-volume-dot" cx={CX} cy={TOP} r={3} fill={C.primary} />
          <text className="v-area-volume-a v-area-volume-d" x={CX} y={TOP - 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            6
          </text>
          <text className="v-area-volume-a v-area-volume-r" x={CX + RX / 2} y={TOP - 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            3
          </text>
        </g>

        {/* The same steps as numbers */}
        <Work n={1} y={38} label="radius" tex={String.raw`6\div2=3`} />
        <Work n={2} y={84} label="base area" tex={String.raw`\pi\times3^2=9\pi`} />
        <Work n={3} y={130} label="volume" tex={String.raw`9\pi\times5=`} ans={String.raw`45\pi`} dx={62} />
      </g>
    </Svg>
  );
}
