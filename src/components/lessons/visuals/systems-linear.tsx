import { C, Css, Svg, Tex } from "./kit";

// Systems: add the two equations so y cancels, solve, and the answer is the point where the two lines cross.
export const alt = "The lines x + y = 7 and 2x − y = 5 cross at (4, 3). Adding the equations cancels y: 3x = 12, so x = 4 and y = 3.";

const css = `
.v-systems-linear-a { animation: 9s ease-in-out infinite; }
.v-systems-linear-scene { animation-name: v-systems-linear-scene; }
@keyframes v-systems-linear-scene { 0% { opacity: 0 } 5%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

.v-systems-linear-l1 { stroke-dasharray: 100; animation-name: v-systems-linear-l1; }
@keyframes v-systems-linear-l1 { 0%, 6% { stroke-dashoffset: 100 } 20%, 100% { stroke-dashoffset: 0 } }
.v-systems-linear-l2 { stroke-dasharray: 100; animation-name: v-systems-linear-l2; }
@keyframes v-systems-linear-l2 { 0%, 16% { stroke-dashoffset: 100 } 30%, 100% { stroke-dashoffset: 0 } }

.v-systems-linear-rule { animation-name: v-systems-linear-rule; }
@keyframes v-systems-linear-rule { 0%, 32% { opacity: 0 } 37%, 100% { opacity: 1 } }
.v-systems-linear-yink { opacity: 0; animation-name: v-systems-linear-yink; }
@keyframes v-systems-linear-yink { 0%, 36% { opacity: 1 } 42%, 100% { opacity: 0 } }
.v-systems-linear-ymut { animation-name: v-systems-linear-ymut; }
@keyframes v-systems-linear-ymut { 0%, 36% { opacity: 0 } 42%, 100% { opacity: 1 } }
.v-systems-linear-cut { stroke-dasharray: 100; animation-name: v-systems-linear-cut; }
@keyframes v-systems-linear-cut { 0%, 36% { stroke-dashoffset: 100 } 42%, 100% { stroke-dashoffset: 0 } }

.v-systems-linear-sum { animation-name: v-systems-linear-sum; }
@keyframes v-systems-linear-sum {
  0%, 44% { opacity: 0; transform: translateY(-8px) }
  50%, 100% { opacity: 1; transform: none }
}
.v-systems-linear-ans { transform-box: fill-box; transform-origin: center; animation-name: v-systems-linear-ans; }
@keyframes v-systems-linear-ans {
  0%, 56% { opacity: 0; transform: scale(0.9) }
  62%, 100% { opacity: 1; transform: none }
}

.v-systems-linear-guide { animation-name: v-systems-linear-guide; }
@keyframes v-systems-linear-guide { 0%, 64% { opacity: 0 } 70%, 100% { opacity: 1 } }
.v-systems-linear-dot { transform-box: fill-box; transform-origin: center; animation-name: v-systems-linear-dot; }
@keyframes v-systems-linear-dot {
  0%, 62% { transform: scale(0) }
  66% { transform: scale(1.6) }
  70%, 100% { transform: scale(1) }
}
`;

// Graph: origin (28, 146), 18 units per 1. x from 0 to 7, y from 0 to 6.
const OX = 28;
const OY = 146;
const U = 18;
const px = (x: number) => OX + x * U;
const py = (y: number) => OY - y * U;

// Typeset equations in a column at x = EX, size 16. The y term is its own piece so it can grey out.
const EX = 192;
const FS = 18;
const EQ = { x: 0.578, y: 0.489, "2": 0.5, "+": 1.222, "-": 1.222 } as Record<string, number>;
const w = (t: string) => [...t].reduce((n, c) => n + (EQ[c] ?? 0.5), 0) * FS;
const YX1 = EX + w("x+");
const YX2 = EX + w("2x-");
const eq = (y: number, a: string, mid: string, end: string, color: string) => {
  const x1 = EX + w(a.replace(/[^0-9a-z]/g, ""));
  const midW = mid.includes("+") ? w("+y") : w("-y");
  return (
    <g>
      <Tex x={EX} y={y} size={FS} anchor="start" color={color} width={60}>
        {a}
      </Tex>
      <g className="v-systems-linear-a v-systems-linear-yink">
        <Tex x={x1} y={y} size={FS} anchor="start" width={60}>
          {mid}
        </Tex>
      </g>
      <g className="v-systems-linear-a v-systems-linear-ymut">
        <Tex x={x1} y={y} size={FS} anchor="start" color={C.muted} width={60}>
          {mid}
        </Tex>
      </g>
      <Tex x={x1 + midW} y={y} size={FS} anchor="start" color={color} width={60}>
        {end}
      </Tex>
    </g>
  );
};

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className="v-systems-linear-a v-systems-linear-scene">
        {/* Grid and axes */}
        <g stroke={C.line} strokeWidth={1}>
          {[1, 2, 3, 4, 5, 6, 7].map((x) => (
            <line key={`x${x}`} x1={px(x)} y1={py(0)} x2={px(x)} y2={py(6)} />
          ))}
          {[1, 2, 3, 4, 5, 6].map((y) => (
            <line key={`y${y}`} x1={px(0)} y1={py(y)} x2={px(7)} y2={py(y)} />
          ))}
        </g>
        <path d={`M${px(0)} ${py(6)} V${py(0)} H${px(7)}`} stroke={C.muted} strokeWidth={1.5} fill="none" />

        {/* The two lines: x + y = 7 and 2x − y = 5 */}
        <line className="v-systems-linear-a v-systems-linear-l1" x1={px(1)} y1={py(6)} x2={px(7)} y2={py(0)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
        <line className="v-systems-linear-a v-systems-linear-l2" x1={px(2.5)} y1={py(0)} x2={px(5.5)} y2={py(6)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />

        {/* The crossing point (4, 3) */}
        <g className="v-systems-linear-a v-systems-linear-guide">
          <path d={`M${px(4)} ${py(0)} V${py(3)} H${px(0)}`} stroke={C.good} strokeWidth={1.5} strokeDasharray="3 4" fill="none" />
          <text x={px(4)} y={py(0) + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.good}>
            4
          </text>
          <text x={px(0) - 6} y={py(3) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.good}>
            3
          </text>
        </g>
        <circle className="v-systems-linear-a v-systems-linear-dot" cx={px(4)} cy={py(3)} r={5} fill={C.good} stroke={C.bg} strokeWidth={1.5} />

        {/* The equations, added: the y terms are the ones that cancel */}
        {eq(53, String.raw`x`, String.raw`{}+y`, String.raw`{}=7`, C.ink)}
        {eq(77, String.raw`2x`, String.raw`{}-y`, String.raw`{}=5`, C.primaryText)}
        <line className="v-systems-linear-a v-systems-linear-cut" x1={YX1 - 1} y1={55} x2={YX1 + 11} y2={55} pathLength={100} stroke={C.muted} strokeWidth={1.5} />
        <line className="v-systems-linear-a v-systems-linear-cut" x1={YX2 - 1} y1={78} x2={YX2 + 11} y2={78} pathLength={100} stroke={C.muted} strokeWidth={1.5} />

        <g className="v-systems-linear-a v-systems-linear-rule">
          <Tex x={176} y={80} size={18} color={C.muted} width={20}>
            {String.raw`+`}
          </Tex>
          <line x1={182} y1={87} x2={294} y2={87} stroke={C.muted} strokeWidth={1.5} />
        </g>
        <g className="v-systems-linear-a v-systems-linear-sum">
          <Tex x={EX} y={108} size={19} anchor="start" width={100}>
            {String.raw`3x=12`}
          </Tex>
        </g>

        <g className="v-systems-linear-a v-systems-linear-ans">
          <rect x={185} y={121} width={106} height={26} rx={8} fill={C.goodSoft} />
          <Tex x={238} y={134} size={15} color={C.good} width={100}>
            {String.raw`x=4,\;y=3`}
          </Tex>
        </g>
      </g>
    </Svg>
  );
}
