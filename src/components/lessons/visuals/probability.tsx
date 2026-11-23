import { C, Css, Svg, Tex } from "./kit";

// Probability: the condition picks the group (the Bus column, 18 + 12 = 30), the cell that fits (18) goes on top.
export const alt = "A two-way table. For the chance a bus rider is in grade 9, the Bus column is the group: 18 + 12 = 30. 18 of them fit, so 18/30 = 3/5.";

const css = `
.v-probability-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-probability-scene { animation-name: v-probability-scene; }
@keyframes v-probability-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: "bus rider" picks the group, the Bus column. The other column fades back. */
.v-probability-w1 { animation-name: v-probability-w1; }
@keyframes v-probability-w1 { 0%, 11% { fill: ${C.ink} } 14%, 46% { fill: ${C.primaryText} } 50%, 100% { fill: ${C.ink} } }
.v-probability-fill { animation-name: v-probability-fill; }
@keyframes v-probability-fill { 0%, 12% { opacity: 0 } 18%, 100% { opacity: 1 } }
.v-probability-ring { stroke-dasharray: 100; animation-name: v-probability-ring; }
@keyframes v-probability-ring { 0%, 12% { stroke-dashoffset: 100 } 21%, 100% { stroke-dashoffset: 0 } }
.v-probability-head { fill: ${C.ink}; animation-name: v-probability-head; }
@keyframes v-probability-head { 0%, 12% { fill: ${C.muted} } 16%, 100% { fill: ${C.ink} } }
.v-probability-dim { opacity: .4; animation-name: v-probability-dim; }
@keyframes v-probability-dim { 0%, 12% { opacity: 1 } 20%, 100% { opacity: .4 } }

/* The group's size: 18 + 12 = 30 */
.v-probability-sum { stroke-dasharray: 100; animation-name: v-probability-sum; }
@keyframes v-probability-sum { 0%, 20% { stroke-dashoffset: 100 } 23%, 100% { stroke-dashoffset: 0 } }
.v-probability-total { animation-name: v-probability-total; }
@keyframes v-probability-total { 0%, 21% { opacity: 0; transform: translateY(-5px) } 25%, 100% { opacity: 1; transform: none } }

/* Beat 2: the group goes on the bottom of the fraction */
.v-probability-bar { stroke-dasharray: 100; animation-name: v-probability-bar; }
@keyframes v-probability-bar { 0%, 27% { stroke-dashoffset: 100 } 32%, 100% { stroke-dashoffset: 0 } }
.v-probability-den { transform-box: fill-box; transform-origin: center; animation-name: v-probability-den; }
@keyframes v-probability-den {
  0%, 30% { opacity: 0; transform: translate(-58px, 22.4px) scale(.68) }
  31% { opacity: 1; transform: translate(-58px, 22.4px) scale(.68) }
  40%, 100% { opacity: 1; transform: none }
}
.v-probability-lab2 { animation-name: v-probability-lab2; }
@keyframes v-probability-lab2 { 0%, 39% { opacity: 0 } 43%, 100% { opacity: 1 } }

/* Beat 3: "grade 9" picks the cell that fits; it goes on top */
.v-probability-w2 { animation-name: v-probability-w2; }
@keyframes v-probability-w2 { 0%, 47% { fill: ${C.ink} } 50%, 70% { fill: ${C.primaryText} } 74%, 100% { fill: ${C.ink} } }
.v-probability-row { fill: ${C.ink}; animation-name: v-probability-row; }
@keyframes v-probability-row { 0%, 48% { fill: ${C.muted} } 51%, 100% { fill: ${C.ink} } }
.v-probability-chip { transform-box: fill-box; transform-origin: center; animation-name: v-probability-chip; }
@keyframes v-probability-chip { 0%, 48% { transform: scale(0) } 52% { transform: scale(1.12) } 55%, 100% { transform: none } }
.v-probability-cell { fill: ${C.onPrimary}; animation-name: v-probability-cell; }
@keyframes v-probability-cell { 0%, 50% { fill: ${C.ink} } 52%, 100% { fill: ${C.onPrimary} } }
.v-probability-num { transform-box: fill-box; transform-origin: center; animation-name: v-probability-num; }
@keyframes v-probability-num {
  0%, 53% { opacity: 0; transform: translate(-58px, -.6px) scale(.68) }
  54% { opacity: 1; transform: translate(-58px, -.6px) scale(.68) }
  62%, 100% { opacity: 1; transform: none }
}
.v-probability-lab1 { animation-name: v-probability-lab1; }
@keyframes v-probability-lab1 { 0%, 61% { opacity: 0 } 65%, 100% { opacity: 1 } }

/* Beat 4: the answer */
.v-probability-res { transform-box: fill-box; transform-origin: center; animation-name: v-probability-res; }
@keyframes v-probability-res { 0%, 70% { opacity: 0; transform: scale(.6) } 74% { opacity: 1; transform: scale(1.1) } 77%, 100% { opacity: 1; transform: none } }
`;

/** The Bus column with room for its total under the table (a rounded box, drawn clockwise from the top left). */
const COLUMN = "M145 48 H167 a10 10 0 0 1 10 10 V148 a10 10 0 0 1 -10 10 H145 a10 10 0 0 1 -10 -10 V58 a10 10 0 0 1 10 -10 Z";

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-probability-a v-probability-scene">
        {/* The question */}
        <text x={160} y={32} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ink}>
          Chance a <tspan className="v-probability-a v-probability-w1" fill={C.ink}>bus rider</tspan> is in <tspan className="v-probability-a v-probability-w2" fill={C.ink}>grade 9</tspan>?
        </text>

        {/* The two-way table */}
        <path d="M16 76 V62 a10 10 0 0 1 10 -10 H166 a10 10 0 0 1 10 10 V76 Z" fill={C.fill} />
        <rect x={16} y={52} width={160} height={78} rx={10} fill="none" stroke={C.line} strokeWidth={1.5} />
        <line x1={16} y1={103} x2={176} y2={103} stroke={C.line} strokeWidth={1.5} />

        {/* The group: the Bus column */}
        <path className="v-probability-a v-probability-fill" d={COLUMN} fill={C.soft} />
        <path className="v-probability-a v-probability-ring" d={COLUMN} pathLength={100} fill="none" stroke={C.primary} strokeWidth={1.5} />

        {/* The top of the fraction starts under the chip and slides out of it */}
        <text className="v-probability-a v-probability-num" x={214} y={98} textAnchor="middle" fontSize={22} fontWeight={700} fill={C.primaryText}>
          18
        </text>
        {/* The cell that fits */}
        <rect className="v-probability-a v-probability-chip" x={139} y={78.5} width={34} height={22} rx={11} fill={C.primary} />

        <text className="v-probability-a v-probability-row" x={26} y={94} fontSize={12} fontWeight={600}>
          Grade 9
        </text>
        <text x={26} y={121} fontSize={12} fontWeight={600} fill={C.muted}>
          Grade 10
        </text>
        <g textAnchor="middle" fontWeight={600}>
          <text className="v-probability-a v-probability-head" x={156} y={68} fontSize={12}>
            Bus
          </text>
          <text className="v-probability-a v-probability-cell" x={156} y={95} fontSize={15}>
            18
          </text>
          <text x={156} y={122} fontSize={15} fill={C.ink}>
            12
          </text>
          <g className="v-probability-a v-probability-dim">
            <text x={111} y={68} fontSize={12} fill={C.muted}>
              Car
            </text>
            <text x={111} y={95} fontSize={15} fill={C.ink}>
              6
            </text>
            <text x={111} y={122} fontSize={15} fill={C.ink}>
              14
            </text>
          </g>
        </g>
        <line className="v-probability-a v-probability-sum" x1={144} y1={130} x2={168} y2={130} pathLength={100} stroke={C.primary} strokeWidth={1.5} />
        <text className="v-probability-a v-probability-total" x={156} y={149} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
          30
        </text>

        {/* The fraction: fit over group */}
        <g textAnchor="middle">
          <text className="v-probability-a v-probability-lab1" x={214} y={72} fontSize={11} fontWeight={600} fill={C.muted}>
            fit
          </text>
          <text className="v-probability-a v-probability-den" x={214} y={129} fontSize={22} fontWeight={700} fill={C.ink}>
            30
          </text>
          <text className="v-probability-a v-probability-lab2" x={214} y={147} fontSize={11} fontWeight={600} fill={C.muted}>
            group
          </text>
        </g>
        <line className="v-probability-a v-probability-bar" x1={196} y1={106} x2={232} y2={106} pathLength={100} stroke={C.ink} strokeWidth={2} />

        {/* The answer */}
        <g className="v-probability-a v-probability-res">
          <text x={240} y={113} fontSize={20} fontWeight={700} fill={C.ink}>
            =
          </text>
          <rect x={256} y={86} width={48} height={40} rx={14} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <Tex x={280} y={106} size={16} width={48} color={C.good}>{String.raw`\dfrac{3}{5}`}</Tex>
        </g>
      </g>
    </Svg>
  );
}
