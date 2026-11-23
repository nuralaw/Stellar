import { C, Css, Svg, Tex } from "./kit";

// Linear functions: the rule's two numbers are the line. The 1 lands on the y-axis (the start); the 2 becomes
// the climb for every 1 across (the slope). Same step each time, so the points make a straight line.
export const alt = "f(x) = 2x + 1 drawn on a grid: the line starts at 1 on the y-axis and climbs 2 for every 1 step right, through (1, 3) and (3, 7).";

// Grid: 18 units per cell, origin at (38, 162). The line is y = 2x + 1.
const U = 18;
const X = (n: number) => 38 + U * n;
const Y = (n: number) => 162 - U * n;

// The rule is centered on x = EQ; its digits sit at these centers (Geist 24/700), 8.5 above the baseline.
const EQ = 222;
const TWO = EQ + 8;
const ONE = EQ + 67;
const RULE_Y = 88;
const DIGIT_Y = RULE_Y;
// Flights: each small label starts on its digit in the rule (twice its size) and lands on the graph.
const TICK = X(0) - 12.5; // center of the "1" beside the y-axis
const FLY1 = { x: ONE - TICK, y: DIGIT_Y - Y(1) };
const FLY2 = { x: TWO - 7 - (X(1) + 12.5), y: DIGIT_Y - Y(2) };

/** Keyframes for stair step i (1–3), which starts at s% of the loop: 1 across, 2 up, then the new point. */
const step = (i: number, s: number) => `
.v-linear-functions-run${i} { stroke-dasharray: 100; animation-name: v-linear-functions-run${i}; }
@keyframes v-linear-functions-run${i} { 0%, ${s}% { stroke-dashoffset: 100 } ${s + 4}%, 100% { stroke-dashoffset: 0 } }
.v-linear-functions-rise${i} { stroke-dasharray: 100; animation-name: v-linear-functions-rise${i}; }
@keyframes v-linear-functions-rise${i} { 0%, ${s + 4}% { stroke-dashoffset: 100 } ${s + 9}%, 100% { stroke-dashoffset: 0 } }
.v-linear-functions-pt${i} { transform-box: fill-box; transform-origin: center; animation-name: v-linear-functions-pt${i}; }
@keyframes v-linear-functions-pt${i} { 0%, ${s + 9}% { transform: scale(0) } ${s + 10.5}% { transform: scale(1.5) } ${s + 12}%, 100% { transform: scale(1) } }
.v-linear-functions-tri${i} { animation-name: v-linear-functions-tri${i}; }
@keyframes v-linear-functions-tri${i} { 0%, ${s + 8}% { opacity: 0 } ${s + 12}%, 100% { opacity: 1 } }
`;

/** Keyframes for the "+2" of step i (2–3): it rises into place while its rise is drawn. */
const again = (i: number, s: number) => `
.v-linear-functions-up${i} { animation-name: v-linear-functions-up${i}; }
@keyframes v-linear-functions-up${i} { 0%, ${s}% { opacity: 0; transform: translateY(6px) } ${s + 4}%, 100% { opacity: 1; transform: none } }
`;

const css = `
.v-linear-functions-a { animation: 10s ease-in-out infinite; }

/* Everything that gets drawn fades out together, so the reset is never seen. */
.v-linear-functions-scene { animation-name: v-linear-functions-scene; }
@keyframes v-linear-functions-scene { 0%, 91% { opacity: 1 } 97%, 100% { opacity: 0 } }

/* Beat 1: the 1 leaves the rule and lands on the y-axis. That is where the line starts. */
.v-linear-functions-hb { animation-name: v-linear-functions-hb; }
@keyframes v-linear-functions-hb { 0%, 5% { opacity: 0 } 7%, 91% { opacity: 1 } 97%, 100% { opacity: 0 } }
.v-linear-functions-hbi { opacity: 0; animation-name: v-linear-functions-hbi; }
@keyframes v-linear-functions-hbi { 0%, 5% { opacity: 1 } 7%, 91% { opacity: 0 } 97%, 100% { opacity: 1 } }
.v-linear-functions-f1x { animation-name: v-linear-functions-f1x; }
@keyframes v-linear-functions-f1x {
  0%, 7% { transform: translateX(${FLY1.x}px); animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1) }
  15%, 100% { transform: none }
}
.v-linear-functions-f1y { transform-box: fill-box; transform-origin: center; animation-name: v-linear-functions-f1y; }
@keyframes v-linear-functions-f1y {
  0%, 7% { opacity: 0; transform: translateY(${FLY1.y}px) scale(2); animation-timing-function: cubic-bezier(0.1, 0.6, 0.3, 1) }
  10% { opacity: 1 }
  15%, 100% { opacity: 1; transform: none }
}
.v-linear-functions-pt0 { transform-box: fill-box; transform-origin: center; animation-name: v-linear-functions-pt0; }
@keyframes v-linear-functions-pt0 { 0%, 15% { transform: scale(0) } 17% { transform: scale(1.5) } 19%, 100% { transform: scale(1) } }
.v-linear-functions-cb { animation-name: v-linear-functions-cb; }
@keyframes v-linear-functions-cb { 0%, 17% { opacity: 0; transform: translateY(-4px) } 22%, 100% { opacity: 1; transform: none } }

/* Beat 2: the 2 leaves the rule and becomes the climb of every step */
.v-linear-functions-hm { animation-name: v-linear-functions-hm; }
@keyframes v-linear-functions-hm { 0%, 22% { opacity: 0 } 24%, 91% { opacity: 1 } 97%, 100% { opacity: 0 } }
.v-linear-functions-hmi { opacity: 0; animation-name: v-linear-functions-hmi; }
@keyframes v-linear-functions-hmi { 0%, 22% { opacity: 1 } 24%, 91% { opacity: 0 } 97%, 100% { opacity: 1 } }
.v-linear-functions-f2x { animation-name: v-linear-functions-f2x; }
@keyframes v-linear-functions-f2x {
  0%, 24% { transform: translateX(${FLY2.x}px); animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1) }
  32%, 100% { transform: none }
}
.v-linear-functions-f2y { transform-box: fill-box; transform-origin: center; animation-name: v-linear-functions-f2y; }
@keyframes v-linear-functions-f2y {
  0%, 24% { opacity: 0; transform: translateY(${FLY2.y}px) scale(2); animation-timing-function: cubic-bezier(0.1, 0.6, 0.3, 1) }
  27% { opacity: 1 }
  32%, 100% { opacity: 1; transform: none }
}
.v-linear-functions-cm { animation-name: v-linear-functions-cm; }
@keyframes v-linear-functions-cm { 0%, 34% { opacity: 0; transform: translateY(-4px) } 39%, 100% { opacity: 1; transform: none } }
${step(1, 25)}${step(2, 38)}${again(2, 44)}${step(3, 50)}${again(3, 56)}
/* Beat 3: same step every time, so the points make a straight line */
.v-linear-functions-line { stroke-dasharray: 100; animation-name: v-linear-functions-line; }
@keyframes v-linear-functions-line { 0%, 63% { stroke-dashoffset: 100 } 72%, 100% { stroke-dashoffset: 0 } }
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      {/* The three steps as equal triangles, under the grid lines */}
      <g className="v-linear-functions-a v-linear-functions-scene" fill={C.soft}>
        {[1, 2, 3].map((i) => (
          <path key={i} className={`v-linear-functions-a v-linear-functions-tri${i}`} d={`M${X(i - 1)} ${Y(2 * i - 1)} H${X(i)} V${Y(2 * i + 1)} Z`} />
        ))}
      </g>

      {/* Grid and axes */}
      <g stroke={C.line} strokeWidth={1}>
        {[1, 2, 3, 4, 5].map((n) => (
          <line key={`x${n}`} x1={X(n)} y1={Y(8)} x2={X(n)} y2={Y(0)} />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <line key={`y${n}`} x1={X(0)} y1={Y(n)} x2={X(5)} y2={Y(n)} />
        ))}
      </g>
      <path d={`M${X(0)} ${Y(8)} V${Y(0)} H${X(5)}`} stroke={C.muted} strokeWidth={1.5} fill="none" />

      {/* The rule: the 2 and the 1 turn orange (a crossfade of two typeset layers) */}
      <Tex x={EQ} y={RULE_Y} size={26} width={170}>{String.raw`f(x)=\phantom{2}x+\phantom{1}`}</Tex>
      <g className="v-linear-functions-a v-linear-functions-hmi">
        <Tex x={EQ} y={RULE_Y} size={26} width={170}>{String.raw`\phantom{f(x)=}2\phantom{x+1}`}</Tex>
      </g>
      <g className="v-linear-functions-a v-linear-functions-hm">
        <Tex x={EQ} y={RULE_Y} size={26} width={170} color={C.primaryText}>{String.raw`\phantom{f(x)=}2\phantom{x+1}`}</Tex>
      </g>
      <g className="v-linear-functions-a v-linear-functions-hbi">
        <Tex x={EQ} y={RULE_Y} size={26} width={170}>{String.raw`\phantom{f(x)=2x}\mathbin{\phantom{+}}1`}</Tex>
      </g>
      <g className="v-linear-functions-a v-linear-functions-hb">
        <Tex x={EQ} y={RULE_Y} size={26} width={170} color={C.primaryText}>{String.raw`\phantom{f(x)=2x}\mathbin{\phantom{+}}1`}</Tex>
      </g>

      <g className="v-linear-functions-a v-linear-functions-scene">
        {/* What the two numbers are called */}
        <g className="v-linear-functions-a v-linear-functions-cm">
          <line x1={TWO - 7} y1={104} x2={TWO + 7} y2={104} stroke={C.primary} strokeWidth={2} />
          <text x={TWO} y={120} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.muted}>
            slope
          </text>
        </g>
        <g className="v-linear-functions-a v-linear-functions-cb">
          <line x1={ONE - 6.5} y1={104} x2={ONE + 6.5} y2={104} stroke={C.primary} strokeWidth={2} />
          <text x={ONE} y={120} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.muted}>
            start
          </text>
        </g>

        {/* Stairs: 1 across, 2 up, three times */}
        <g stroke={C.primary} strokeWidth={2} fill="none">
          {[1, 2, 3].map((i) => (
            <g key={i}>
              <line className={`v-linear-functions-a v-linear-functions-run${i}`} x1={X(i - 1)} y1={Y(2 * i - 1)} x2={X(i)} y2={Y(2 * i - 1)} pathLength={100} />
              <line className={`v-linear-functions-a v-linear-functions-rise${i}`} x1={X(i)} y1={Y(2 * i - 1)} x2={X(i)} y2={Y(2 * i + 1)} pathLength={100} />
            </g>
          ))}
        </g>
        <g className="v-linear-functions-a v-linear-functions-f2x">
          <text className="v-linear-functions-a v-linear-functions-f2y" x={X(1) + 5} y={Y(2) + 4} fontSize={12} fontWeight={700} fill={C.primaryText}>
            +2
          </text>
        </g>
        {[2, 3].map((i) => (
          <text key={i} className={`v-linear-functions-a v-linear-functions-up${i}`} x={X(i) + 5} y={Y(2 * i) + 4} fontSize={12} fontWeight={700} fill={C.primaryText}>
            +2
          </text>
        ))}

        {/* The line through every point */}
        <line className="v-linear-functions-a v-linear-functions-line" x1={X(0)} y1={Y(1)} x2={X(3.45)} y2={Y(7.9)} pathLength={100} stroke={C.ink} strokeWidth={3} />

        {/* Points: the start on the y-axis, then one per step */}
        {[1, 2, 3].map((i) => (
          <circle key={i} className={`v-linear-functions-a v-linear-functions-pt${i}`} cx={X(i)} cy={Y(2 * i + 1)} r={4} fill={C.ink} stroke={C.bg} strokeWidth={1.5} />
        ))}
        <circle className="v-linear-functions-a v-linear-functions-pt0" cx={X(0)} cy={Y(1)} r={5} fill={C.primary} stroke={C.bg} strokeWidth={1.5} />
        <g className="v-linear-functions-a v-linear-functions-f1x">
          <text className="v-linear-functions-a v-linear-functions-f1y" x={X(0) - 9} y={Y(1) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            1
          </text>
        </g>
      </g>
    </Svg>
  );
}
