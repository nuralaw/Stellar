import { C, Css, Svg } from "./kit";

// Desmos: type a system exactly as written, the two lines draw themselves, the crossing is the answer.
export const alt = "3x + 2y = 12 and x − y = −1 are typed into Desmos; the two lines are drawn and cross at the solution (2, 3).";

const css = `
.v-desmos-a { animation: 9s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-desmos-scene { animation-name: v-desmos-scene; }
@keyframes v-desmos-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* "Typing": a cover slides off each equation, left to right */
.v-desmos-cover { transform-box: fill-box; transform-origin: right center; transform: scaleX(0); }
.v-desmos-type1 { animation-name: v-desmos-type1; }
@keyframes v-desmos-type1 { 0%, 7% { transform: scaleX(1) } 20%, 100% { transform: scaleX(0) } }
.v-desmos-type2 { animation-name: v-desmos-type2; }
@keyframes v-desmos-type2 { 0%, 36% { transform: scaleX(1) } 48%, 100% { transform: scaleX(0) } }

/* The caret rides the edge of the cover, then disappears */
.v-desmos-caret { opacity: 0; }
.v-desmos-caret1 { animation-name: v-desmos-caret1; }
@keyframes v-desmos-caret1 {
  0%, 7% { transform: translateX(0); opacity: 1 }
  20% { transform: translateX(93px); opacity: 1 }
  22%, 100% { transform: translateX(93px); opacity: 0 }
}
.v-desmos-caret2 { animation-name: v-desmos-caret2; }
@keyframes v-desmos-caret2 {
  0%, 34% { transform: translateX(0); opacity: 0 }
  36% { transform: translateX(0); opacity: 1 }
  48% { transform: translateX(93px); opacity: 1 }
  50%, 100% { transform: translateX(93px); opacity: 0 }
}

/* Each line draws right after its equation is typed */
.v-desmos-line { stroke-dasharray: 100; }
.v-desmos-draw1 { animation-name: v-desmos-draw1; }
@keyframes v-desmos-draw1 { 0%, 21% { stroke-dashoffset: 100 } 34%, 100% { stroke-dashoffset: 0 } }
.v-desmos-draw2 { animation-name: v-desmos-draw2; }
@keyframes v-desmos-draw2 { 0%, 49% { stroke-dashoffset: 100 } 62%, 100% { stroke-dashoffset: 0 } }

/* The crossing pops, then its coordinates slide in */
.v-desmos-dot { transform-box: fill-box; transform-origin: center; animation-name: v-desmos-dot; }
@keyframes v-desmos-dot { 0%, 64% { transform: scale(0) } 68% { transform: scale(1.7) } 72%, 100% { transform: scale(1) } }
.v-desmos-ans { animation-name: v-desmos-ans; }
@keyframes v-desmos-ans { 0%, 70% { opacity: 0; transform: translateX(-8px) } 77%, 100% { opacity: 1; transform: none } }
.v-desmos-guide { animation-name: v-desmos-note; }
.v-desmos-note { animation-name: v-desmos-note; }
@keyframes v-desmos-note { 0%, 74% { opacity: 0 } 81%, 100% { opacity: 1 } }
`;

// Graph: 1 unit = 20px, origin at (180, 140). Window: x from −1 to 6, y from −1 to 6.
const X0 = 180;
const Y0 = 140;
const U = 20;
const px = (x: number) => X0 + x * U;
const py = (y: number) => Y0 - y * U;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-desmos-a v-desmos-scene">
        {/* The expression list: two typed equations */}
        <rect x={20} y={40} width={120} height={72} rx={8} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <line x1={20} y1={76} x2={140} y2={76} stroke={C.line} strokeWidth={1.5} />
        <circle cx={34} cy={58} r={5} fill={C.primary} />
        <circle cx={34} cy={94} r={5} fill={C.ink} />
        <text x={47} y={63} fontSize={14} fontWeight={600} fill={C.ink}>
          3x + 2y = 12
        </text>
        <text x={47} y={99} fontSize={14} fontWeight={600} fill={C.ink}>
          x − y = −1
        </text>
        <rect className="v-desmos-a v-desmos-cover v-desmos-type1" x={44} y={46} width={93} height={24} fill={C.fill} />
        <rect className="v-desmos-a v-desmos-cover v-desmos-type2" x={44} y={82} width={93} height={24} fill={C.fill} />
        <line className="v-desmos-a v-desmos-caret v-desmos-caret1" x1={45} y1={50} x2={45} y2={66} stroke={C.primary} strokeWidth={1.5} />
        <line className="v-desmos-a v-desmos-caret v-desmos-caret2" x1={45} y1={86} x2={45} y2={102} stroke={C.primary} strokeWidth={1.5} />

        <text className="v-desmos-a v-desmos-note" x={80} y={136} textAnchor="middle" fontSize={12} fill={C.muted}>
          crossing = solution
        </text>

        {/* The graph */}
        <g stroke={C.line} strokeWidth={1}>
          {[-1, 0, 1, 2, 3, 4, 5, 6].map((n) => (
            <line key={`x${n}`} x1={px(n)} y1={py(6)} x2={px(n)} y2={py(-1)} />
          ))}
          {[-1, 0, 1, 2, 3, 4, 5, 6].map((n) => (
            <line key={`y${n}`} x1={px(-1)} y1={py(n)} x2={px(6)} y2={py(n)} />
          ))}
        </g>
        <g stroke={C.muted} strokeWidth={1.5}>
          <line x1={px(-1)} y1={py(0)} x2={px(6)} y2={py(0)} />
          <line x1={px(0)} y1={py(6)} x2={px(0)} y2={py(-1)} />
        </g>

        {/* Guides from the crossing down to x = 2 and across to y = 3 */}
        <g className="v-desmos-a v-desmos-guide">
          <g stroke={C.good} strokeWidth={1.5} strokeDasharray="3 4">
            <line x1={px(2)} y1={py(3)} x2={px(2)} y2={py(0)} />
            <line x1={px(2)} y1={py(3)} x2={px(0)} y2={py(3)} />
          </g>
          <text x={px(2)} y={py(0) + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.ink}>
            2
          </text>
          <text x={px(0) - 6} y={py(3) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.ink}>
            3
          </text>
        </g>

        {/* 3x + 2y = 12: through (0, 6) and (4, 0), ends at y = −1 */}
        <line
          className="v-desmos-a v-desmos-line v-desmos-draw1"
          x1={px(0)}
          y1={py(6)}
          x2={px(14 / 3)}
          y2={py(-1)}
          pathLength={100}
          stroke={C.primary}
          strokeWidth={2.5}
        />
        {/* x − y = −1: y = x + 1, from (−1, 0) to (5, 6) */}
        <line
          className="v-desmos-a v-desmos-line v-desmos-draw2"
          x1={px(-1)}
          y1={py(0)}
          x2={px(5)}
          y2={py(6)}
          pathLength={100}
          stroke={C.ink}
          strokeWidth={2.5}
        />

        {/* The crossing (2, 3) */}
        <circle className="v-desmos-a v-desmos-dot" cx={px(2)} cy={py(3)} r={5.5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />
        <g className="v-desmos-a v-desmos-ans">
          <rect x={238} y={67} width={54} height={26} rx={13} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={265} y={85} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
            (2, 3)
          </text>
        </g>
      </g>
    </Svg>
  );
}
