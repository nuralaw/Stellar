import { C, Css, Svg } from "./kit";

// Lines, angles, triangles: a line crossing two parallel lines makes eight angles but only two sizes.
// The 70° angle turns into its opposite, its neighbors are 110°, and the whole set slides to the other crossing.
export const alt = "A line crosses two parallel lines. A 70° angle equals its opposite, its neighbors are 110°, and the same four angles repeat at the second crossing.";

// Geometry (canvas units). The crossing line makes exactly 70° with the parallel lines.
const A = 70;
const rad = (d: number) => (d * Math.PI) / 180;
const Y1 = 58;
const Y2 = 124;
const DY = Y2 - Y1;
const DX = DY / Math.tan(rad(A)); // how far the line moves sideways between the two parallel lines
const P1 = { x: 114, y: Y1 };
const P2 = { x: P1.x - DX, y: Y2 };
const EXT = 36 / Math.tan(rad(A)); // the line runs 36 units past each crossing
const R = 19;
const n = (v: number) => v.toFixed(2);

/** Sector around (cx, cy) from angle a to angle b: degrees, counter-clockwise from "right", like on paper. */
function wedge(c: { x: number; y: number }, a: number, b: number) {
  const p = (t: number) => `${n(c.x + R * Math.cos(rad(t)))} ${n(c.y - R * Math.sin(rad(t)))}`;
  return `M${n(c.x)} ${n(c.y)}L${p(a)}A${R} ${R} 0 0 0 ${p(b)}Z`;
}

const css = `
.v-lines-angles-triangles-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-lines-angles-triangles-scene { animation-name: v-lines-angles-triangles-scene; }
@keyframes v-lines-angles-triangles-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Set up: the three lines draw themselves */
.v-lines-angles-triangles-par { stroke-dasharray: 100; animation-name: v-lines-angles-triangles-par; }
@keyframes v-lines-angles-triangles-par { 0%, 1% { stroke-dashoffset: 100 } 9%, 100% { stroke-dashoffset: 0 } }
.v-lines-angles-triangles-cut { stroke-dasharray: 100; animation-name: v-lines-angles-triangles-cut; }
@keyframes v-lines-angles-triangles-cut { 0%, 4% { stroke-dashoffset: 100 } 12%, 100% { stroke-dashoffset: 0 } }
.v-lines-angles-triangles-mark { animation-name: v-lines-angles-triangles-mark; }
@keyframes v-lines-angles-triangles-mark { 0%, 9% { opacity: 0 } 13%, 100% { opacity: 1 } }

/* Beat 1: the given 70° angle */
.v-lines-angles-triangles-o1 { transform-box: view-box; transform-origin: ${n(P1.x)}px ${n(P1.y)}px; }
.v-lines-angles-triangles-given { animation-name: v-lines-angles-triangles-given; }
@keyframes v-lines-angles-triangles-given { 0%, 12% { transform: scale(0) } 15.5% { transform: scale(1.2) } 18%, 100% { transform: scale(1) } }
.v-lines-angles-triangles-t1 { animation-name: v-lines-angles-triangles-t1; }
@keyframes v-lines-angles-triangles-t1 { 0%, 14% { opacity: 0 } 19%, 100% { opacity: 1 } }

/* Beat 2: it turns half a circle around the crossing: the opposite angle is equal */
.v-lines-angles-triangles-turn { animation-name: v-lines-angles-triangles-turn; }
@keyframes v-lines-angles-triangles-turn {
  0%, 20% { opacity: 0; transform: rotate(180deg) }
  21% { opacity: 1; transform: rotate(180deg) }
  31%, 100% { opacity: 1; transform: rotate(0deg) }
}
.v-lines-angles-triangles-in1 { animation-name: v-lines-angles-triangles-in1; }
@keyframes v-lines-angles-triangles-in1 { 0%, 29% { opacity: 0; transform: translateX(-8px) } 35%, 100% { opacity: 1; transform: none } }

/* Beat 3: the neighbors on the straight line are 110° */
.v-lines-angles-triangles-big { animation-name: v-lines-angles-triangles-big; }
@keyframes v-lines-angles-triangles-big { 0%, 36% { transform: scale(0) } 39.5% { transform: scale(1.15) } 42%, 100% { transform: scale(1) } }
.v-lines-angles-triangles-t2 { animation-name: v-lines-angles-triangles-t2; }
@keyframes v-lines-angles-triangles-t2 { 0%, 38% { opacity: 0 } 43%, 100% { opacity: 1 } }
.v-lines-angles-triangles-in2 { animation-name: v-lines-angles-triangles-in2; }
@keyframes v-lines-angles-triangles-in2 { 0%, 41% { opacity: 0; transform: translateX(-8px) } 47%, 100% { opacity: 1; transform: none } }

/* Beat 4: all four slide along the line to the second crossing */
.v-lines-angles-triangles-slide { animation-name: v-lines-angles-triangles-slide; }
@keyframes v-lines-angles-triangles-slide {
  0%, 48% { opacity: 0; transform: translate(${n(DX)}px, ${-DY}px) }
  49% { opacity: 1; transform: translate(${n(DX)}px, ${-DY}px) }
  65%, 100% { opacity: 1; transform: none }
}
.v-lines-angles-triangles-land { transform-box: view-box; transform-origin: ${n(P2.x)}px ${n(P2.y)}px; animation-name: v-lines-angles-triangles-land; }
@keyframes v-lines-angles-triangles-land { 0%, 64% { transform: scale(1) } 67% { transform: scale(1.14) } 70%, 100% { transform: scale(1) } }
.v-lines-angles-triangles-t3 { animation-name: v-lines-angles-triangles-t3; }
@keyframes v-lines-angles-triangles-t3 { 0%, 65% { opacity: 0 } 71%, 100% { opacity: 1 } }
`;

/** The four angles around a crossing: two of 70° (accent) and two of 110° (neutral). */
function Four({ at }: { at: { x: number; y: number } }) {
  return (
    <>
      <path d={wedge(at, 0, A)} fill={C.primary} />
      <path d={wedge(at, 180, 180 + A)} fill={C.primary} />
      <path d={wedge(at, A, 180)} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
      <path d={wedge(at, 180 + A, 360)} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-lines-angles-triangles-a v-lines-angles-triangles-scene">
        {/* Angles at the first crossing (drawn under the lines) */}
        <g className="v-lines-angles-triangles-a v-lines-angles-triangles-o1 v-lines-angles-triangles-big">
          <path d={wedge(P1, A, 180)} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
          <path d={wedge(P1, 180 + A, 360)} fill={C.fill} stroke={C.muted} strokeWidth={1.5} />
        </g>
        <path className="v-lines-angles-triangles-a v-lines-angles-triangles-o1 v-lines-angles-triangles-given" d={wedge(P1, 0, A)} fill={C.primary} />
        <path className="v-lines-angles-triangles-a v-lines-angles-triangles-o1 v-lines-angles-triangles-turn" d={wedge(P1, 180, 180 + A)} fill={C.primary} />

        {/* The same four, sliding to the second crossing */}
        <g className="v-lines-angles-triangles-a v-lines-angles-triangles-slide">
          <g className="v-lines-angles-triangles-a v-lines-angles-triangles-land">
            <Four at={P2} />
          </g>
        </g>

        {/* Two parallel lines and the line that crosses them */}
        <g stroke={C.ink} strokeWidth={2.5} fill="none">
          <line className="v-lines-angles-triangles-a v-lines-angles-triangles-par" x1={20} y1={Y1} x2={190} y2={Y1} pathLength={100} />
          <line className="v-lines-angles-triangles-a v-lines-angles-triangles-par" x1={20} y1={Y2} x2={190} y2={Y2} pathLength={100} />
          <line
            className="v-lines-angles-triangles-a v-lines-angles-triangles-cut"
            x1={n(P2.x - EXT)}
            y1={Y2 + 36}
            x2={n(P1.x + EXT)}
            y2={Y1 - 36}
            pathLength={100}
          />
        </g>
        {/* Arrow marks: the two lines are parallel */}
        <g className="v-lines-angles-triangles-a v-lines-angles-triangles-mark" stroke={C.muted} strokeWidth={2} fill="none">
          <path d={`M167 ${Y1 - 4.5}l5.5 4.5l-5.5 4.5`} />
          <path d={`M167 ${Y2 - 4.5}l5.5 4.5l-5.5 4.5`} />
        </g>

        <text className="v-lines-angles-triangles-a v-lines-angles-triangles-mark" x={20} y={95} fontSize={11} fill={C.muted}>
          parallel
        </text>

        {/* Angle labels */}
        <text className="v-lines-angles-triangles-a v-lines-angles-triangles-t1" x={P1.x + R + 6} y={Y1 - 7} fontSize={12} fontWeight={700} fill={C.primary}>
          70°
        </text>
        <text className="v-lines-angles-triangles-a v-lines-angles-triangles-t2" x={P1.x - R - 6} y={Y1 - 7} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink}>
          110°
        </text>
        <g className="v-lines-angles-triangles-a v-lines-angles-triangles-t3" fontSize={12} fontWeight={700}>
          <text x={n(P2.x - R - 6)} y={Y2 + 17} textAnchor="end" fill={C.primary}>
            70°
          </text>
          <text x={n(P2.x + R + 6)} y={Y2 + 17} fill={C.ink}>
            110°
          </text>
        </g>

        {/* The two rules */}
        <g className="v-lines-angles-triangles-a v-lines-angles-triangles-in1">
          <text x={212} y={66} fontSize={12} fill={C.muted}>
            equal
          </text>
          <text x={212} y={87} fontSize={17} fontWeight={700} fill={C.primary}>
            70° = 70°
          </text>
        </g>
        <g className="v-lines-angles-triangles-a v-lines-angles-triangles-in2">
          <text x={212} y={114} fontSize={12} fill={C.muted}>
            add to 180°
          </text>
          <text x={212} y={135} fontSize={17} fontWeight={700} fill={C.ink}>
            <tspan fill={C.primary}>70°</tspan> + 110°
          </text>
        </g>
      </g>
    </Svg>
  );
}
