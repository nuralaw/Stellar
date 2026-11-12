import { C, Css, Svg } from "./kit";

// Scoring: each section is scored 200–800; the two add up to a total of 400–1600. Here 650 + 700 = 1350.
export const alt = "Each section is scored from 200 to 800. Reading and Writing 650 plus Math 700 gives a total of 1350, on a scale of 400 to 1600.";

// Bars: 200 at x = 16, 800 at x = 196 (0.3 px per point). 650 → 135 px, 700 → 150 px.
const css = `
.v-digital-sat-format--score-a { animation: 9s ease-in-out infinite; }
.v-digital-sat-format--score-scene { animation-name: v-digital-sat-format--score-scene; }
@keyframes v-digital-sat-format--score-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

.v-digital-sat-format--score-b1 { transform-box: fill-box; transform-origin: left center; animation-name: v-digital-sat-format--score-b1; }
@keyframes v-digital-sat-format--score-b1 { 0%, 8% { transform: scaleX(0) } 26%, 100% { transform: scaleX(1) } }
.v-digital-sat-format--score-n1 { animation-name: v-digital-sat-format--score-n1; }
@keyframes v-digital-sat-format--score-n1 { 0%, 24% { opacity: 0; transform: translateX(-6px) } 30%, 100% { opacity: 1; transform: none } }

.v-digital-sat-format--score-b2 { transform-box: fill-box; transform-origin: left center; animation-name: v-digital-sat-format--score-b2; }
@keyframes v-digital-sat-format--score-b2 { 0%, 34% { transform: scaleX(0) } 52%, 100% { transform: scaleX(1) } }
.v-digital-sat-format--score-n2 { animation-name: v-digital-sat-format--score-n2; }
@keyframes v-digital-sat-format--score-n2 { 0%, 50% { opacity: 0; transform: translateX(-6px) } 56%, 100% { opacity: 1; transform: none } }

.v-digital-sat-format--score-rule { stroke-dasharray: 100; animation-name: v-digital-sat-format--score-rule; }
@keyframes v-digital-sat-format--score-rule { 0%, 58% { stroke-dashoffset: 100 } 64%, 100% { stroke-dashoffset: 0 } }
.v-digital-sat-format--score-sum { transform-box: fill-box; transform-origin: center; animation-name: v-digital-sat-format--score-sum; }
@keyframes v-digital-sat-format--score-sum { 0%, 64% { opacity: 0; transform: scale(0.7) } 69% { opacity: 1; transform: scale(1.12) } 73%, 100% { opacity: 1; transform: none } }
.v-digital-sat-format--score-tot { animation-name: v-digital-sat-format--score-tot; }
@keyframes v-digital-sat-format--score-tot { 0%, 72% { opacity: 0 } 78%, 100% { opacity: 1 } }
`;

function Bar({ y, name, w, cls }: { y: number; name: string; w: number; cls: string }) {
  return (
    <g>
      <text x={16} y={y - 8} fontSize={12} fontWeight={700} fill={C.ink}>
        {name}
      </text>
      <rect x={16} y={y} width={180} height={12} rx={6} fill={C.fill} stroke={C.line} strokeWidth={1} />
      <rect className={cls} x={16} y={y} width={w} height={12} rx={6} fill={C.ink} />
      <text x={16} y={y + 27} fontSize={11} fill={C.muted}>
        200
      </text>
      <text x={196} y={y + 27} textAnchor="end" fontSize={11} fill={C.muted}>
        800
      </text>
    </g>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-digital-sat-format--score-a v-digital-sat-format--score-scene">
        <Bar y={38} name="Reading and Writing" w={135} cls="v-digital-sat-format--score-a v-digital-sat-format--score-b1" />
        <Bar y={96} name="Math" w={150} cls="v-digital-sat-format--score-a v-digital-sat-format--score-b2" />

        {/* The sum on the right */}
        <text className="v-digital-sat-format--score-a v-digital-sat-format--score-n1" x={300} y={51} textAnchor="end" fontSize={20} fontWeight={700} fill={C.ink}>
          650
        </text>
        <text className="v-digital-sat-format--score-a v-digital-sat-format--score-n2" x={300} y={109} textAnchor="end" fontSize={20} fontWeight={700} fill={C.ink}>
          + 700
        </text>
        <line className="v-digital-sat-format--score-a v-digital-sat-format--score-rule" x1={232} y1={120} x2={302} y2={120} pathLength={100} stroke={C.ink} strokeWidth={2} />
        <text className="v-digital-sat-format--score-a v-digital-sat-format--score-sum" x={300} y={147} textAnchor="end" fontSize={24} fontWeight={700} fill={C.primary}>
          1350
        </text>

        {/* The total scale */}
        <text className="v-digital-sat-format--score-a v-digital-sat-format--score-tot" x={16} y={160} fontSize={12} fontWeight={600} fill={C.muted}>
          Total: 400 to 1600
        </text>
      </g>
    </Svg>
  );
}
