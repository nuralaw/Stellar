import type { ReactNode } from "react";
import { C, Css, Svg } from "./kit";

// One-variable data: one extreme value drags the mean (the balance point) along; the median (the middle value) stays.
export const alt = "Values 2, 4, 6, 8, 10 balance on a beam at 6. The 10 becomes 20 and rolls out: the mean follows from 6 to 8, the median stays 6.";

/** x of a value on the beam: 14.4 canvas units per 1, so every distance is to scale. */
const X = (v: number) => 30 + (v - 2) * 14.4;
const Y = 89; // centers of the value balls
const R = 12.5;
const BEAM = 104;
const MID = X(6); // the median, and the mean before the change

const css = `
.v-one-var-data-a { animation: 10s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-one-var-data-scene { animation-name: v-one-var-data-scene; }
@keyframes v-one-var-data-scene { 0% { opacity: 0 } 4%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* Set up: the two markers arrive */
.v-one-var-data-med { animation-name: v-one-var-data-med; }
@keyframes v-one-var-data-med { 0%, 4% { opacity: 0; transform: translateY(-6px) } 8%, 100% { opacity: 1; transform: none } }
.v-one-var-data-mean { animation-name: v-one-var-data-mean; }
@keyframes v-one-var-data-mean { 0%, 8% { opacity: 0; transform: translateY(6px) } 12%, 100% { opacity: 1; transform: none } }

/* The key move: 10 becomes 20 and rolls out to where 20 belongs */
.v-one-var-data-ball { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-one-var-data-ball; }
@keyframes v-one-var-data-ball { 0%, 22% { fill: ${C.fill}; stroke: ${C.muted} } 25%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-one-var-data-pop { transform-box: fill-box; transform-origin: center; animation-name: v-one-var-data-pop; }
@keyframes v-one-var-data-pop { 0%, 22% { transform: scale(1) } 24.5% { transform: scale(1.2) } 28%, 100% { transform: scale(1) } }
.v-one-var-data-old { opacity: 0; animation-name: v-one-var-data-old; }
@keyframes v-one-var-data-old { 0%, 23.5% { opacity: 1 } 24.5%, 100% { opacity: 0 } }
.v-one-var-data-new { animation-name: v-one-var-data-new; }
@keyframes v-one-var-data-new { 0%, 24% { opacity: 0 } 25%, 100% { opacity: 1 } }
.v-one-var-data-go { transform: translateX(144px); animation-name: v-one-var-data-go; }
@keyframes v-one-var-data-go { 0%, 28% { transform: translateX(0) } 44%, 100% { transform: translateX(144px) } }
.v-one-var-data-trail { stroke-dasharray: 100; animation-name: v-one-var-data-trail; }
@keyframes v-one-var-data-trail { 0%, 28% { stroke-dashoffset: 100 } 44%, 100% { stroke-dashoffset: 0 } }
.v-one-var-data-was { animation-name: v-one-var-data-was; }
@keyframes v-one-var-data-was { 0%, 28% { opacity: 0 } 33%, 100% { opacity: 1 } }
.v-one-var-data-tip { animation-name: v-one-var-data-tip; }
@keyframes v-one-var-data-tip { 0%, 34% { opacity: 0 } 39%, 100% { opacity: 1 } }

/* The beam tips toward the far value, then levels once the mean has moved under the new balance point */
.v-one-var-data-beam { transform-box: view-box; transform-origin: ${MID}px ${BEAM}px; animation-name: v-one-var-data-beam; }
@keyframes v-one-var-data-beam { 0%, 31% { transform: rotate(0deg) } 46%, 50% { transform: rotate(4deg) } 63%, 100% { transform: rotate(0deg) } }
.v-one-var-data-tri { fill: ${C.primary}; stroke: ${C.primary}; animation-name: v-one-var-data-tri; }
@keyframes v-one-var-data-tri { 0%, 46% { fill: ${C.ink}; stroke: ${C.ink} } 50%, 100% { fill: ${C.primary}; stroke: ${C.primary} } }
.v-one-var-data-pull { transform: translateX(28.8px); animation-name: v-one-var-data-pull; }
@keyframes v-one-var-data-pull { 0%, 50% { transform: translateX(0) } 63%, 100% { transform: translateX(28.8px) } }
.v-one-var-data-left { animation-name: v-one-var-data-left; }
@keyframes v-one-var-data-left { 0%, 50% { opacity: 0 } 55%, 100% { opacity: 1 } }
.v-one-var-data-m6 { opacity: 0; animation-name: v-one-var-data-m6; }
@keyframes v-one-var-data-m6 { 0%, 50% { opacity: 1 } 54%, 100% { opacity: 0 } }

/* The result: mean 6 → 8, median 6 → 6 */
.v-one-var-data-m8 { animation-name: v-one-var-data-m8; }
@keyframes v-one-var-data-m8 { 0%, 63% { opacity: 0; transform: translateX(-5px) } 68%, 100% { opacity: 1; transform: none } }
.v-one-var-data-d6 { fill: ${C.muted}; animation-name: v-one-var-data-d6; }
@keyframes v-one-var-data-d6 { 0%, 72% { fill: ${C.ink} } 76%, 100% { fill: ${C.muted} } }
.v-one-var-data-d66 { animation-name: v-one-var-data-d66; }
@keyframes v-one-var-data-d66 { 0%, 72% { opacity: 0; transform: translateX(-5px) } 77%, 100% { opacity: 1; transform: none } }
.v-one-var-data-tap { animation-name: v-one-var-data-tap; }
@keyframes v-one-var-data-tap { 0%, 70% { transform: translateY(0) } 73% { transform: translateY(3px) } 77%, 100% { transform: translateY(0) } }
`;

const num = { y: Y + 5, textAnchor: "middle", fontSize: 14, fontWeight: 700, stroke: "none" } as const;
const name = { fontSize: 12, fontWeight: 500, fill: C.muted, textAnchor: "end" } as const;
const val = { fontSize: 18, fontWeight: 700 } as const;

/** A value sitting on the beam. The circle takes fill/stroke from its parent group. */
function Ball({ v, fill = C.ink, children }: { v: number; fill?: string; children?: ReactNode }) {
  return (
    <>
      <circle cx={X(v)} cy={Y} r={R} strokeWidth={1.5} />
      <text x={X(v)} {...num} fill={fill}>
        {children ?? v}
      </text>
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-one-var-data-a v-one-var-data-scene">
        {/* The beam (a number line, to scale) with the five values on it */}
        <g className="v-one-var-data-a v-one-var-data-beam">
          <g stroke={C.muted} strokeWidth={1.5}>
            {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((v) => (
              <line key={v} x1={X(v)} y1={BEAM + 2} x2={X(v)} y2={BEAM + 6.5} />
            ))}
          </g>
          <line x1={17.5} y1={BEAM} x2={302.5} y2={BEAM} stroke={C.ink} strokeWidth={3} />
          <g fill={C.fill} stroke={C.muted}>
            {[2, 4, 6, 8].map((v) => (
              <Ball key={v} v={v} />
            ))}
          </g>

          {/* Where the 10 was, and the path it took */}
          <line className="v-one-var-data-a v-one-var-data-trail" x1={X(10)} y1={Y} x2={X(20)} y2={Y} pathLength={100} stroke={C.primary} strokeWidth={1.5} opacity={0.55} />
          <g className="v-one-var-data-a v-one-var-data-was" fill={C.bg} stroke={C.muted} strokeDasharray="3 3">
            <Ball v={10} fill={C.muted} />
          </g>

          {/* The value that changes: 10 → 20 */}
          <g className="v-one-var-data-a v-one-var-data-go">
            <path className="v-one-var-data-a v-one-var-data-tip" d={`M ${X(10) - 22} ${Y - 4.5} l 4.5 4.5 l -4.5 4.5`} fill="none" stroke={C.primary} strokeWidth={1.5} opacity={0.55} />
            <g className="v-one-var-data-a v-one-var-data-pop">
              <circle className="v-one-var-data-a v-one-var-data-ball" cx={X(10)} cy={Y} r={R} strokeWidth={1.5} />
              <text className="v-one-var-data-a v-one-var-data-old" x={X(10)} {...num} fill={C.ink}>
                10
              </text>
              <text className="v-one-var-data-a v-one-var-data-new" x={X(10)} {...num} fill={C.ink}>
                20
              </text>
            </g>
          </g>
        </g>

        {/* Median: the middle value. It never moves. */}
        <g className="v-one-var-data-a v-one-var-data-med">
          <path className="v-one-var-data-a v-one-var-data-tap" d={`M ${MID} 72 l -9 -15 h 18 z`} fill={C.ink} stroke={C.ink} strokeWidth={1.5} />
          <text x={MID + 12} y={48} {...name}>
            median
          </text>
          <text className="v-one-var-data-a v-one-var-data-d6" x={MID + 18} y={48} {...val}>
            6
          </text>
          <text className="v-one-var-data-a v-one-var-data-d66" x={MID + 34} y={48} {...val} fill={C.ink}>
            <tspan fill={C.muted} fontWeight={500}>
              →{" "}
            </tspan>
            6
          </text>
        </g>

        {/* Mean: the balance point. It follows the far value. */}
        <g className="v-one-var-data-a v-one-var-data-mean">
          <path className="v-one-var-data-a v-one-var-data-left" d={`M ${MID} 107 l -9 15 h 18 z`} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
          <g className="v-one-var-data-a v-one-var-data-pull">
            <path className="v-one-var-data-a v-one-var-data-tri" d={`M ${MID} 107 l -9 15 h 18 z`} strokeWidth={1.5} />
            <text x={MID + 7} y={145} {...name}>
              mean
            </text>
            <text className="v-one-var-data-a v-one-var-data-m6" x={MID + 13} y={145} {...val} fill={C.ink}>
              6
            </text>
            <text className="v-one-var-data-a v-one-var-data-m8" x={MID + 13} y={145} {...val} fill={C.primaryText}>
              <tspan fill={C.muted}>6</tspan>
              <tspan fill={C.muted} fontWeight={500}>
                {" "}
                →{" "}
              </tspan>
              8
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
