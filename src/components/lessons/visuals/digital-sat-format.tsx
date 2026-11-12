import { C, Css, Svg } from "./kit";

// Digital SAT format: a strong module 1 routes you to the harder module 2, the only path to the top scores.
export const alt = "Module 1 of 27 questions is answered well, so the path leads to the harder module 2 with scores up to 800; the easier module 2 is capped.";

const css = `
.v-digital-sat-format-a { animation: 9s ease-in-out infinite; }

.v-digital-sat-format-scene { animation-name: v-digital-sat-format-scene; }
@keyframes v-digital-sat-format-scene { 0% { opacity: 0 } 6%, 91% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* Beat 1: module 1 gets answered */
.v-digital-sat-format-bar { transform-box: fill-box; transform-origin: left center; animation-name: v-digital-sat-format-bar; }
@keyframes v-digital-sat-format-bar { 0%, 8% { transform: scaleX(0) } 34%, 100% { transform: scaleX(1) } }

/* Beat 2: the route to the harder module draws */
.v-digital-sat-format-route { stroke-dasharray: 100; animation-name: v-digital-sat-format-route; }
@keyframes v-digital-sat-format-route { 0%, 36% { stroke-dashoffset: 100 } 50%, 100% { stroke-dashoffset: 0 } }

/* Beat 3: the harder module lights up, its reward appears */
.v-digital-sat-format-hard { fill: ${C.soft}; stroke: ${C.primary}; animation-name: v-digital-sat-format-hard; }
@keyframes v-digital-sat-format-hard { 0%, 50% { fill: ${C.fill}; stroke: ${C.line} } 55%, 100% { fill: ${C.soft}; stroke: ${C.primary} } }
.v-digital-sat-format-pop { transform-box: fill-box; transform-origin: center; animation-name: v-digital-sat-format-pop; }
@keyframes v-digital-sat-format-pop { 0%, 50% { transform: scale(1) } 54% { transform: scale(1.05) } 59%, 100% { transform: scale(1) } }
.v-digital-sat-format-top { animation-name: v-digital-sat-format-top; }
@keyframes v-digital-sat-format-top { 0%, 55% { opacity: 0; transform: translateY(4px) } 61%, 100% { opacity: 1; transform: none } }

/* Beat 4: the easier module is the capped one */
.v-digital-sat-format-easy { opacity: 0.78; animation-name: v-digital-sat-format-easy; }
@keyframes v-digital-sat-format-easy { 0%, 64% { opacity: 1 } 70%, 100% { opacity: 0.78 } }
.v-digital-sat-format-cap { animation-name: v-digital-sat-format-cap; }
@keyframes v-digital-sat-format-cap { 0%, 64% { opacity: 0; transform: translateY(4px) } 70%, 100% { opacity: 1; transform: none } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-digital-sat-format-a v-digital-sat-format-scene">
        {/* Module 1 */}
        <rect x={16} y={56} width={108} height={68} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
        <text x={70} y={79} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
          Module 1
        </text>
        <text x={70} y={95} textAnchor="middle" fontSize={11} fill={C.muted}>
          27 questions
        </text>
        <rect x={30} y={104} width={80} height={8} rx={4} fill={C.line} />
        <rect className="v-digital-sat-format-a v-digital-sat-format-bar" x={30} y={104} width={68} height={8} rx={4} fill={C.primary} />

        {/* Routes */}
        <path d="M124 90 C158 90 150 132 180 132" fill="none" stroke={C.line} strokeWidth={2} strokeDasharray="3 5" />
        <path
          className="v-digital-sat-format-a v-digital-sat-format-route"
          d="M124 90 C158 90 150 48 180 48"
          pathLength={100}
          fill="none"
          stroke={C.primary}
          strokeWidth={2.5}
        />

        {/* Harder module 2 */}
        <g className="v-digital-sat-format-a v-digital-sat-format-pop">
          <rect className="v-digital-sat-format-a v-digital-sat-format-hard" x={180} y={22} width={124} height={52} rx={10} strokeWidth={1.5} />
          <text x={242} y={44} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            Harder module 2
          </text>
          <text className="v-digital-sat-format-a v-digital-sat-format-top" x={242} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primary}>
            up to 800
          </text>
        </g>

        {/* Easier module 2 */}
        <g className="v-digital-sat-format-a v-digital-sat-format-easy">
          <rect x={180} y={106} width={124} height={52} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
          <text x={242} y={128} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.ink}>
            Easier module 2
          </text>
          <text className="v-digital-sat-format-a v-digital-sat-format-cap" x={242} y={146} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted}>
            score capped
          </text>
        </g>
      </g>
    </Svg>
  );
}
