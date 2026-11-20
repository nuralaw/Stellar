import { C, Css, Svg } from "./kit";

// Rhetorical synthesis: three true notes, one goal. Each note is tested against the goal;
// only the one that does the goal's job (says how) locks in.
export const alt =
  "Goal: explain how the lake formed. Three true notes are tested: its depth and its age are set aside; the note about melting glacier ice says how and locks in green.";

const css = `
.v-rhetorical-synthesis-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-rhetorical-synthesis-scene { animation-name: v-rhetorical-synthesis-scene; }
@keyframes v-rhetorical-synthesis-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the goal drops in */
.v-rhetorical-synthesis-goal { animation-name: v-rhetorical-synthesis-goal; }
@keyframes v-rhetorical-synthesis-goal { 0%, 8% { opacity: 0; transform: translateY(-6px) } 16%, 100% { opacity: 1; transform: none } }

/* Beats 2-3: a note is tested (accent outline), then set aside (text greys out) */
.v-rhetorical-synthesis-box1 { animation-name: v-rhetorical-synthesis-box1; }
@keyframes v-rhetorical-synthesis-box1 { 0%, 20% { stroke: ${C.line} } 25%, 34% { stroke: ${C.primary} } 39%, 100% { stroke: ${C.line} } }
.v-rhetorical-synthesis-txt1 { fill: ${C.muted}; animation-name: v-rhetorical-synthesis-txt1; }
@keyframes v-rhetorical-synthesis-txt1 { 0%, 34% { fill: ${C.ink} } 39%, 100% { fill: ${C.muted} } }
.v-rhetorical-synthesis-tag1 { animation-name: v-rhetorical-synthesis-tag1; }
@keyframes v-rhetorical-synthesis-tag1 { 0%, 26% { opacity: 0; transform: translateX(-6px) } 31%, 100% { opacity: 1; transform: none } }

.v-rhetorical-synthesis-box2 { animation-name: v-rhetorical-synthesis-box2; }
@keyframes v-rhetorical-synthesis-box2 { 0%, 39% { stroke: ${C.line} } 44%, 53% { stroke: ${C.primary} } 58%, 100% { stroke: ${C.line} } }
.v-rhetorical-synthesis-txt2 { fill: ${C.muted}; animation-name: v-rhetorical-synthesis-txt2; }
@keyframes v-rhetorical-synthesis-txt2 { 0%, 53% { fill: ${C.ink} } 58%, 100% { fill: ${C.muted} } }
.v-rhetorical-synthesis-tag2 { animation-name: v-rhetorical-synthesis-tag2; }
@keyframes v-rhetorical-synthesis-tag2 { 0%, 45% { opacity: 0; transform: translateX(-6px) } 50%, 100% { opacity: 1; transform: none } }

/* Beat 4: the third note matches the goal and locks in green */
.v-rhetorical-synthesis-box3 { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-rhetorical-synthesis-box3; }
@keyframes v-rhetorical-synthesis-box3 {
  0%, 58% { fill: ${C.fill}; stroke: ${C.line} }
  63%, 70% { fill: ${C.fill}; stroke: ${C.primary} }
  75%, 100% { fill: ${C.goodSoft}; stroke: ${C.good} }
}
.v-rhetorical-synthesis-tag3 { animation-name: v-rhetorical-synthesis-tag3; }
@keyframes v-rhetorical-synthesis-tag3 { 0%, 64% { opacity: 0; transform: translateX(-6px) } 69%, 100% { opacity: 1; transform: none } }
.v-rhetorical-synthesis-tagTxt3 { fill: ${C.good}; animation-name: v-rhetorical-synthesis-tagTxt3; }
@keyframes v-rhetorical-synthesis-tagTxt3 { 0%, 70% { fill: ${C.primaryText} } 75%, 100% { fill: ${C.good} } }
.v-rhetorical-synthesis-pop { transform-box: fill-box; transform-origin: center; animation-name: v-rhetorical-synthesis-pop; }
@keyframes v-rhetorical-synthesis-pop { 0%, 70% { transform: scale(1) } 75% { transform: scale(1.03) } 80%, 100% { transform: scale(1) } }
`;

const A = "v-rhetorical-synthesis-a";
const X = 24;
const RW = 272;
const RH = 28;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className={`${A} v-rhetorical-synthesis-scene`}>
        {/* The goal */}
        <g className={`${A} v-rhetorical-synthesis-goal`}>
          <text x={160} y={38} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
            <tspan fill={C.muted}>Goal: </tspan>explain{" "}
            <tspan fill={C.primaryText} fontWeight={700}>
              how
            </tspan>{" "}
            the lake formed
          </text>
        </g>

        {/* Note 1: depth */}
        <rect className={`${A} v-rhetorical-synthesis-box1`} x={X} y={54} width={RW} height={RH} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text className={`${A} v-rhetorical-synthesis-txt1`} x={X + 12} y={73} fontSize={13} fontWeight={600}>
          It is 40 meters deep.
        </text>
        <g className={`${A} v-rhetorical-synthesis-tag1`}>
          <text x={X + RW - 12} y={73} textAnchor="end" fontSize={12} fontWeight={600} fill={C.muted}>
            depth
          </text>
        </g>

        {/* Note 2: age */}
        <rect className={`${A} v-rhetorical-synthesis-box2`} x={X} y={88} width={RW} height={RH} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text className={`${A} v-rhetorical-synthesis-txt2`} x={X + 12} y={107} fontSize={13} fontWeight={600}>
          It is 12,000 years old.
        </text>
        <g className={`${A} v-rhetorical-synthesis-tag2`}>
          <text x={X + RW - 12} y={107} textAnchor="end" fontSize={12} fontWeight={600} fill={C.muted}>
            age
          </text>
        </g>

        {/* Note 3: how it formed */}
        <g className={`${A} v-rhetorical-synthesis-pop`}>
          <rect className={`${A} v-rhetorical-synthesis-box3`} x={X} y={122} width={RW} height={RH} rx={8} strokeWidth={1.5} />
          <text x={X + 12} y={141} fontSize={13} fontWeight={600} fill={C.ink}>
            Melting glacier ice formed it.
          </text>
          <g className={`${A} v-rhetorical-synthesis-tag3`}>
            <text className={`${A} v-rhetorical-synthesis-tagTxt3`} x={X + RW - 12} y={141} textAnchor="end" fontSize={12} fontWeight={700}>
              how ✓
            </text>
          </g>
        </g>
      </g>
    </Svg>
  );
}
