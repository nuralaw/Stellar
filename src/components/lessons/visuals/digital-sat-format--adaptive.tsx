import { C, Css, Svg } from "./kit";

// Adaptive routing: few right answers in module 1 lead to the easier module 2 (score capped);
// more right answers lead to the harder module 2, the only path up to 800.
export const alt =
  "Module 1 decides module 2. Fewer right answers lead to the easier module 2, where the score is capped. More right answers lead to the harder module 2, which can reach 800.";

const css = `
.v-digital-sat-format--adaptive-a { animation: 10s ease-in-out infinite; }
.v-digital-sat-format--adaptive-scene { animation-name: v-digital-sat-format--adaptive-scene; }
@keyframes v-digital-sat-format--adaptive-scene { 0% { opacity: 0 } 5%, 93% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* Phase 1: only a few right */
.v-digital-sat-format--adaptive-d1 { fill: ${C.good}; animation-name: v-digital-sat-format--adaptive-d1; }
@keyframes v-digital-sat-format--adaptive-d1 { 0%, 7% { fill: ${C.line} } 12%, 100% { fill: ${C.good} } }
.v-digital-sat-format--adaptive-few { animation-name: v-digital-sat-format--adaptive-few; }
@keyframes v-digital-sat-format--adaptive-few { 0%, 12% { opacity: 0 } 17%, 100% { opacity: 1 } }
.v-digital-sat-format--adaptive-r1 { stroke-dasharray: 100; animation-name: v-digital-sat-format--adaptive-r1; }
@keyframes v-digital-sat-format--adaptive-r1 { 0%, 17% { stroke-dashoffset: 100 } 28%, 100% { stroke-dashoffset: 0 } }
.v-digital-sat-format--adaptive-f1 { transform-box: fill-box; transform-origin: left center; animation-name: v-digital-sat-format--adaptive-f1; }
@keyframes v-digital-sat-format--adaptive-f1 { 0%, 28% { transform: scaleX(0) } 38%, 100% { transform: scaleX(1) } }
.v-digital-sat-format--adaptive-cap { animation-name: v-digital-sat-format--adaptive-cap; }
@keyframes v-digital-sat-format--adaptive-cap { 0%, 38% { opacity: 0; transform: translateX(6px) } 43%, 100% { opacity: 1; transform: none } }

/* Phase 2: more right */
.v-digital-sat-format--adaptive-d2 { fill: ${C.good}; animation-name: v-digital-sat-format--adaptive-d2; }
@keyframes v-digital-sat-format--adaptive-d2 { 0%, 48% { fill: ${C.line} } 54%, 100% { fill: ${C.good} } }
.v-digital-sat-format--adaptive-more { animation-name: v-digital-sat-format--adaptive-more; }
@keyframes v-digital-sat-format--adaptive-more { 0%, 53% { opacity: 0 } 58%, 100% { opacity: 1 } }
.v-digital-sat-format--adaptive-r2 { stroke-dasharray: 100; animation-name: v-digital-sat-format--adaptive-r2; }
@keyframes v-digital-sat-format--adaptive-r2 { 0%, 58% { stroke-dashoffset: 100 } 69%, 100% { stroke-dashoffset: 0 } }
.v-digital-sat-format--adaptive-hard { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-digital-sat-format--adaptive-hard; }
@keyframes v-digital-sat-format--adaptive-hard { 0%, 68% { fill: ${C.fill}; stroke: ${C.line} } 73%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-digital-sat-format--adaptive-f2 { transform-box: fill-box; transform-origin: left center; animation-name: v-digital-sat-format--adaptive-f2; }
@keyframes v-digital-sat-format--adaptive-f2 { 0%, 70% { transform: scaleX(0) } 82%, 100% { transform: scaleX(1) } }
.v-digital-sat-format--adaptive-top { fill: ${C.primaryText}; animation-name: v-digital-sat-format--adaptive-top; }
@keyframes v-digital-sat-format--adaptive-top { 0%, 80% { fill: ${C.muted} } 84%, 100% { fill: ${C.primaryText} } }
`;

const DOTS = [33, 47, 61, 75];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-scene">
        {/* Module 1 and its answers: 7 of 8 right in the end */}
        <rect x={16} y={58} width={76} height={64} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={54} y={79} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
          Module 1
        </text>
        {DOTS.map((x, i) => (
          <circle
            key={`t${x}`}
            className={i < 3 ? "v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-d1" : "v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-d2"}
            cx={x}
            cy={93}
            r={4.5}
          />
        ))}
        {DOTS.map((x, i) =>
          i < 3 ? <circle key={`b${x}`} className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-d2" cx={x} cy={107} r={4.5} /> : <circle key={`b${x}`} cx={x} cy={107} r={4.5} fill={C.line} />,
        )}

        {/* Routes */}
        <path className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-r1" d="M92 100 C130 100 128 134 166 134" pathLength={100} fill="none" stroke={C.muted} strokeWidth={2.5} />
        <path className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-r2" d="M92 80 C130 80 128 46 166 46" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
        <text className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-more" x={94} y={40} fontSize={11} fontWeight={600} fill={C.primaryText}>
          more right
        </text>
        <text className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-few" x={94} y={149} fontSize={11} fontWeight={600} fill={C.muted}>
          fewer right
        </text>

        {/* Harder module 2: the score can reach 800 */}
        <rect className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-hard" x={166} y={18} width={138} height={56} rx={10} strokeWidth={1.5} />
        <text x={178} y={38} fontSize={13} fontWeight={700} fill={C.ink}>
          Harder module 2
        </text>
        <rect x={178} y={45} width={114} height={8} rx={4} fill={C.line} />
        <rect className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-f2" x={178} y={45} width={114} height={8} rx={4} fill={C.primary} />
        <text x={178} y={67} fontSize={11} fill={C.muted}>
          200
        </text>
        <text className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-top" x={292} y={67} textAnchor="end" fontSize={11} fontWeight={700}>
          800
        </text>

        {/* Easier module 2: the score stops short */}
        <rect x={166} y={106} width={138} height={56} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={178} y={126} fontSize={13} fontWeight={700} fill={C.ink}>
          Easier module 2
        </text>
        <rect x={178} y={133} width={114} height={8} rx={4} fill={C.line} />
        <rect className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-f1" x={178} y={133} width={70} height={8} rx={4} fill={C.muted} />
        <text x={178} y={155} fontSize={11} fill={C.muted}>
          200
        </text>
        <g className="v-digital-sat-format--adaptive-a v-digital-sat-format--adaptive-cap">
          <line x1={249} y1={128} x2={249} y2={146} stroke={C.ink} strokeWidth={2.5} />
          <text x={292} y={155} textAnchor="end" fontSize={11} fontWeight={600} fill={C.ink}>
            capped
          </text>
        </g>
      </g>
    </Svg>
  );
}
