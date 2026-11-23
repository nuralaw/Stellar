import { C, Css, Svg, Tex } from "./kit";

// Ratios and rates: turn the words into a fraction with units, multiply, and the unwanted unit cancels.
export const alt = "\"15 L in 3 min, ? L in 8 min\" turns into 15 L over 3 min, times 8 min. The minutes cross out and 40 L is left.";

const css = `
.v-ratios-rates-a { animation: 10s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-ratios-rates-scene { animation-name: v-ratios-rates-scene; }
@keyframes v-ratios-rates-scene { 0% { opacity: 0 } 4%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* Line 1, "15 L in 3 min", stacks into a fraction: "in" becomes the bar. */
.v-ratios-rates-numX { animation-name: v-ratios-rates-numX; }
@keyframes v-ratios-rates-numX { 0%, 16% { transform: translateX(-42.5px) } 22%, 100% { transform: none } }
.v-ratios-rates-numY { animation-name: v-ratios-rates-numY; }
@keyframes v-ratios-rates-numY { 0%, 15% { transform: translateY(26px) } 20%, 100% { transform: none } }
.v-ratios-rates-denX { animation-name: v-ratios-rates-denX; }
@keyframes v-ratios-rates-denX { 0%, 16% { transform: translateX(35.2px) } 22%, 100% { transform: none } }
.v-ratios-rates-denY { animation-name: v-ratios-rates-denY; }
@keyframes v-ratios-rates-denY { 0%, 15% { transform: translateY(-5px) } 20%, 100% { transform: none } }
.v-ratios-rates-in1 { opacity: 0; animation-name: v-ratios-rates-in1; }
@keyframes v-ratios-rates-in1 { 0%, 14% { opacity: 1 } 18%, 100% { opacity: 0 } }
.v-ratios-rates-bar { transform-box: fill-box; transform-origin: center; animation-name: v-ratios-rates-bar; }
@keyframes v-ratios-rates-bar { 0%, 18% { transform: scaleX(0) } 24%, 100% { transform: none } }

/* The fraction steps left; line 2, "? L in 8 min", becomes "× 8 min = ? L". */
.v-ratios-rates-frac { animation-name: v-ratios-rates-frac; }
@keyframes v-ratios-rates-frac { 0%, 26% { transform: translate(96px, -13px) } 33%, 100% { transform: none } }
.v-ratios-rates-in2 { opacity: 0; animation-name: v-ratios-rates-in2; }
@keyframes v-ratios-rates-in2 { 0%, 25% { opacity: 1 } 28%, 100% { opacity: 0 } }
.v-ratios-rates-eightX { animation-name: v-ratios-rates-eightX; }
@keyframes v-ratios-rates-eightX { 0%, 28% { transform: translateX(40.6px) } 34%, 100% { transform: none } }
.v-ratios-rates-eightY { animation-name: v-ratios-rates-eightY; }
@keyframes v-ratios-rates-eightY { 0%, 27% { transform: translateY(30px) } 32%, 100% { transform: none } }
.v-ratios-rates-times { animation-name: v-ratios-rates-times; }
@keyframes v-ratios-rates-times { 0%, 30% { opacity: 0 } 34%, 100% { opacity: 1 } }
.v-ratios-rates-askX { animation-name: v-ratios-rates-askX; }
@keyframes v-ratios-rates-askX { 0%, 31% { transform: translateX(-137.1px) } 38%, 100% { transform: none } }
.v-ratios-rates-askY { animation-name: v-ratios-rates-askY; }
@keyframes v-ratios-rates-askY { 0%, 34% { transform: translateY(30px) } 39%, 100% { transform: none } }
.v-ratios-rates-eq { animation-name: v-ratios-rates-eq; }
@keyframes v-ratios-rates-eq { 0%, 35% { opacity: 0 } 39%, 100% { opacity: 1 } }

/* The two "min" light up, get crossed out and go quiet. */
.v-ratios-rates-chip { opacity: 0; animation-name: v-ratios-rates-chip; }
@keyframes v-ratios-rates-chip { 0%, 41% { opacity: 0 } 43%, 50% { opacity: 1 } 53%, 100% { opacity: 0 } }
.v-ratios-rates-min { fill: ${C.muted}; animation-name: v-ratios-rates-min; }
@keyframes v-ratios-rates-min { 0%, 41% { fill: ${C.ink} } 43%, 50% { fill: ${C.primaryText} } 53%, 100% { fill: ${C.muted} } }
.v-ratios-rates-s1 { stroke-dasharray: 100; animation-name: v-ratios-rates-s1; }
@keyframes v-ratios-rates-s1 {
  0%, 43% { stroke-dashoffset: 100; opacity: 0 }
  44% { stroke-dashoffset: 100; opacity: 1 }
  48%, 100% { stroke-dashoffset: 0; opacity: 1 }
}
.v-ratios-rates-s2 { stroke-dasharray: 100; animation-name: v-ratios-rates-s2; }
@keyframes v-ratios-rates-s2 {
  0%, 45% { stroke-dashoffset: 100; opacity: 0 }
  46% { stroke-dashoffset: 100; opacity: 1 }
  50%, 100% { stroke-dashoffset: 0; opacity: 1 }
}
.v-ratios-rates-tag1 { animation-name: v-ratios-rates-tag1; }
@keyframes v-ratios-rates-tag1 { 0%, 50% { opacity: 0; transform: translateY(4px) } 54%, 100% { opacity: 1; transform: none } }

/* "?" turns into 40 and locks in: liters are what is left. */
.v-ratios-rates-pill { fill: ${C.goodSoft}; stroke: ${C.good}; animation-name: v-ratios-rates-pill; }
@keyframes v-ratios-rates-pill {
  0%, 36% { opacity: 0; fill: ${C.fill}; stroke: ${C.line} }
  40%, 61% { opacity: 1; fill: ${C.fill}; stroke: ${C.line} }
  65%, 100% { opacity: 1; fill: ${C.goodSoft}; stroke: ${C.good} }
}
.v-ratios-rates-q { opacity: 0; animation-name: v-ratios-rates-q; }
@keyframes v-ratios-rates-q { 0%, 58% { opacity: 1; transform: none } 61%, 100% { opacity: 0; transform: translateY(-6px) } }
.v-ratios-rates-ans { animation-name: v-ratios-rates-ans; }
@keyframes v-ratios-rates-ans { 0%, 59% { opacity: 0; transform: translateY(6px) } 62%, 100% { opacity: 1; transform: none } }
.v-ratios-rates-pop { transform-box: fill-box; transform-origin: center; animation-name: v-ratios-rates-pop; }
@keyframes v-ratios-rates-pop { 0%, 61% { transform: scale(1) } 63.5% { transform: scale(1.07) } 66%, 100% { transform: scale(1) } }
.v-ratios-rates-keep { fill: ${C.good}; animation-name: v-ratios-rates-keep; }
@keyframes v-ratios-rates-keep { 0%, 61% { fill: ${C.ink} } 65%, 100% { fill: ${C.good} } }
.v-ratios-rates-tag2 { animation-name: v-ratios-rates-tag2; }
@keyframes v-ratios-rates-tag2 { 0%, 63% { opacity: 0; transform: translateY(4px) } 67%, 100% { opacity: 1; transform: none } }
`;

const T = { fontSize: 20, fontWeight: 700, fill: C.ink } as const;
const OP = { fontSize: 20, fontWeight: 600, fill: C.muted, textAnchor: "middle" } as const;
const TAG = { fontSize: 12, fontWeight: 600, textAnchor: "middle" } as const;

/** A "min" that gets crossed out: soft highlight, the word, the strike. */
function Min({ x, y, strike }: { x: number; y: number; strike: string }) {
  return (
    <>
      <rect className="v-ratios-rates-a v-ratios-rates-chip" x={x - 3} y={y - 15} width={41.8} height={19} rx={5} fill={C.soft} />
      <text className="v-ratios-rates-a v-ratios-rates-min" x={x} y={y} {...T}>
        min
      </text>
      <line className={`v-ratios-rates-a ${strike}`} x1={x - 2.5} y1={y + 1.6} x2={x + 38.3} y2={y - 12.2} pathLength={100} stroke={C.primary} strokeWidth={2} />
    </>
  );
}

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-ratios-rates-a v-ratios-rates-scene">
        {/* The rate: 15 L over 3 min */}
        <g className="v-ratios-rates-a v-ratios-rates-frac">
          <g className="v-ratios-rates-a v-ratios-rates-numX">
            <g className="v-ratios-rates-a v-ratios-rates-numY">
              <text x={67} y={67} textAnchor="end" {...T}>
                15
              </text>
              <text className="v-ratios-rates-a v-ratios-rates-keep" x={71.6} y={67} {...T}>
                L
              </text>
            </g>
          </g>
          <text className="v-ratios-rates-a v-ratios-rates-in1" x={56.7} y={93} {...OP}>
            in
          </text>
          <rect className="v-ratios-rates-a v-ratios-rates-bar" x={33} y={75} width={62} height={2} rx={1} fill={C.ink} />
          <g className="v-ratios-rates-a v-ratios-rates-denX">
            <g className="v-ratios-rates-a v-ratios-rates-denY">
              <text x={50.3} y={98} textAnchor="end" {...T}>
                3
              </text>
              <Min x={54.9} y={98} strike="v-ratios-rates-s1" />
            </g>
          </g>
        </g>

        {/* × 8 min */}
        <text className="v-ratios-rates-a v-ratios-rates-in2" x={152.7} y={113} {...OP}>
          in
        </text>
        <g className="v-ratios-rates-a v-ratios-rates-times">
          <Tex x={111.3} y={77} size={20} width={24} color={C.muted}>{String.raw`\times`}</Tex>
        </g>
        <g className="v-ratios-rates-a v-ratios-rates-eightX">
          <g className="v-ratios-rates-a v-ratios-rates-eightY">
            <text x={140.9} y={83} textAnchor="end" {...T}>
              8
            </text>
            <Min x={145.5} y={83} strike="v-ratios-rates-s2" />
          </g>
        </g>
        <text className="v-ratios-rates-a v-ratios-rates-tag1" x={107} y={124} fill={C.primaryText} {...TAG}>
          minutes cancel
        </text>

        {/* = ? L, then 40 L */}
        <text className="v-ratios-rates-a v-ratios-rates-eq" x={199.8} y={83} {...OP}>
          =
        </text>
        <g className="v-ratios-rates-a v-ratios-rates-askX">
          <g className="v-ratios-rates-a v-ratios-rates-askY">
            <g className="v-ratios-rates-a v-ratios-rates-pop">
              <rect className="v-ratios-rates-a v-ratios-rates-pill" x={218.3} y={59} width={68} height={34} rx={11} strokeWidth={1.5} />
              <text className="v-ratios-rates-a v-ratios-rates-q" x={244.1} y={83} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.primaryText}>
                ?
              </text>
              <text className="v-ratios-rates-a v-ratios-rates-ans" x={257.7} y={83} textAnchor="end" {...T}>
                40
              </text>
              <text className="v-ratios-rates-a v-ratios-rates-keep" x={262.2} y={83} {...T}>
                L
              </text>
            </g>
          </g>
        </g>
        <text className="v-ratios-rates-a v-ratios-rates-tag2" x={252.3} y={124} fill={C.good} {...TAG}>
          liters stay
        </text>
      </g>
    </Svg>
  );
}
