import { C, Css, Svg } from "./kit";

// Inference from a sample: the sample's 62% lands on a number line, the margin of error (4) spreads both ways,
// and the range 58% to 66% is what is plausible for the whole population.
export const alt = "A sample's 62% lands on a number line; the margin of error of 4 spreads both ways, so 58% to 66% is plausible for all voters.";

// 14 units per 1%: 54 → 48, 58 → 104, 62 → 160, 66 → 216, 70 → 272.
const X = (p: number) => 160 + (p - 62) * 14;
const AXIS = 90;
const HALF = X(62) - X(58); // the margin of error in canvas units

const css = `
.v-inference-sample-a { animation: 8s ease-in-out infinite; }

/* The whole scene fades in at the start and out at the end, so the reset is never seen. */
.v-inference-sample-scene { animation-name: v-inference-sample-scene; }
@keyframes v-inference-sample-scene { 0% { opacity: 0 } 6%, 92% { opacity: 1 } 99%, 100% { opacity: 0 } }

/* Beat 1: the sample's 62% drops onto the line */
.v-inference-sample-dot { transform-box: fill-box; transform-origin: center; animation-name: v-inference-sample-dot; }
@keyframes v-inference-sample-dot {
  0%, 9% { transform: translateY(-36px) scale(0.6); opacity: 0 }
  13% { opacity: 1 }
  18% { transform: translateY(0) scale(1); opacity: 1 }
  21% { transform: translateY(0) scale(1.3) }
  25%, 100% { transform: translateY(0) scale(1); opacity: 1 }
}
.v-inference-sample-ping { transform-box: fill-box; transform-origin: center; opacity: 0; animation-name: v-inference-sample-ping; }
@keyframes v-inference-sample-ping {
  0%, 18% { transform: scale(0.5); opacity: 0 }
  19% { opacity: 0.6 }
  28%, 100% { transform: scale(2.2); opacity: 0 }
}
.v-inference-sample-est { fill: ${C.primaryText}; animation-name: v-inference-sample-est; }
@keyframes v-inference-sample-est { 0%, 14% { fill: ${C.ink} } 20%, 100% { fill: ${C.primaryText} } }

/* Beat 2: the margin of error spreads 4 to the left and 4 to the right */
.v-inference-sample-pm { fill: ${C.primaryText}; animation-name: v-inference-sample-pm; }
@keyframes v-inference-sample-pm { 0%, 28% { fill: ${C.ink} } 33%, 100% { fill: ${C.primaryText} } }
.v-inference-sample-band { transform-box: fill-box; transform-origin: center; animation-name: v-inference-sample-band; }
@keyframes v-inference-sample-band { 0%, 30% { transform: scaleX(0) } 50%, 100% { transform: scaleX(1) } }
.v-inference-sample-capL { transform-box: fill-box; transform-origin: center; animation-name: v-inference-sample-capL; }
@keyframes v-inference-sample-capL {
  0%, 30% { transform: translateX(${HALF}px) scaleY(0.6); opacity: 0 }
  31% { opacity: 1 }
  50% { transform: translateX(0) scaleY(1) }
  53% { transform: translateX(0) scaleY(1.3) }
  57%, 100% { transform: translateX(0) scaleY(1); opacity: 1 }
}
.v-inference-sample-capR { transform-box: fill-box; transform-origin: center; animation-name: v-inference-sample-capR; }
@keyframes v-inference-sample-capR {
  0%, 30% { transform: translateX(-${HALF}px) scaleY(0.6); opacity: 0 }
  31% { opacity: 1 }
  50% { transform: translateX(0) scaleY(1) }
  53% { transform: translateX(0) scaleY(1.3) }
  57%, 100% { transform: translateX(0) scaleY(1); opacity: 1 }
}
.v-inference-sample-stepL { animation-name: v-inference-sample-stepL; }
@keyframes v-inference-sample-stepL { 0%, 36% { opacity: 0; transform: translateX(12px) } 46%, 100% { opacity: 1; transform: none } }
.v-inference-sample-stepR { animation-name: v-inference-sample-stepR; }
@keyframes v-inference-sample-stepR { 0%, 36% { opacity: 0; transform: translateX(-12px) } 46%, 100% { opacity: 1; transform: none } }

/* Beat 3: the ends lock on 58 and 66, and the result appears */
.v-inference-sample-end { fill: ${C.primaryText}; transform-box: fill-box; transform-origin: center; animation-name: v-inference-sample-end; }
@keyframes v-inference-sample-end {
  0%, 50% { fill: ${C.muted}; transform: scale(1) }
  54% { fill: ${C.primaryText}; transform: scale(1.3) }
  59%, 100% { fill: ${C.primaryText}; transform: scale(1) }
}
.v-inference-sample-blank { opacity: 0; animation-name: v-inference-sample-blank; }
@keyframes v-inference-sample-blank { 0%, 61% { opacity: 1 } 65%, 100% { opacity: 0 } }
.v-inference-sample-chip { transform-box: fill-box; transform-origin: center; animation-name: v-inference-sample-chip; }
@keyframes v-inference-sample-chip {
  0%, 61% { opacity: 0; transform: scale(0.85) }
  66% { opacity: 1; transform: scale(1.06) }
  70%, 100% { opacity: 1; transform: scale(1) }
}
`;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-inference-sample-a v-inference-sample-scene">
        {/* What the sample says */}
        <text x={160} y={38} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.ink}>
          <tspan fontSize={12} fontWeight={500} fill={C.muted}>
            sample
          </tspan>
          <tspan className="v-inference-sample-a v-inference-sample-est" dx={7}>
            62%
          </tspan>
          <tspan className="v-inference-sample-a v-inference-sample-pm"> ± 4%</tspan>
        </text>

        {/* The number line */}
        <line x1={24} y1={AXIS} x2={296} y2={AXIS} stroke={C.muted} strokeWidth={1.5} />
        {[54, 58, 62, 66, 70].map((p) => (
          <line key={p} x1={X(p)} y1={AXIS - 5} x2={X(p)} y2={AXIS + 5} stroke={C.muted} strokeWidth={1.5} />
        ))}
        {[54, 62, 70].map((p) => (
          <text key={p} x={X(p)} y={AXIS + 29} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.muted}>
            {p}
          </text>
        ))}
        {[58, 66].map((p) => (
          <text key={p} className="v-inference-sample-a v-inference-sample-end" x={X(p)} y={AXIS + 29} textAnchor="middle" fontSize={12} fontWeight={600}>
            {p}
          </text>
        ))}

        {/* The margin of error: 4 each way from 62 */}
        <g className="v-inference-sample-a v-inference-sample-band">
          <rect x={X(58)} y={AXIS - 13} width={2 * HALF} height={26} rx={3} fill={C.soft} />
          <line x1={X(58)} y1={AXIS} x2={X(66)} y2={AXIS} stroke={C.primary} strokeWidth={3} strokeLinecap="butt" />
        </g>
        <line className="v-inference-sample-a v-inference-sample-capL" x1={X(58)} y1={AXIS - 13} x2={X(58)} y2={AXIS + 13} stroke={C.primary} strokeWidth={3} />
        <line className="v-inference-sample-a v-inference-sample-capR" x1={X(66)} y1={AXIS - 13} x2={X(66)} y2={AXIS + 13} stroke={C.primary} strokeWidth={3} />
        <text className="v-inference-sample-a v-inference-sample-stepL" x={X(60)} y={AXIS - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
          −4
        </text>
        <text className="v-inference-sample-a v-inference-sample-stepR" x={X(64)} y={AXIS - 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.primaryText}>
          +4
        </text>

        {/* The sample's estimate */}
        <circle className="v-inference-sample-a v-inference-sample-ping" cx={X(62)} cy={AXIS} r={7} fill="none" stroke={C.primary} strokeWidth={2} />
        <circle className="v-inference-sample-a v-inference-sample-dot" cx={X(62)} cy={AXIS} r={7} fill={C.primary} stroke={C.bg} strokeWidth={2.5} />

        {/* What it means for everyone: the blank fills with the range */}
        <text x={157} y={152} textAnchor="end" fontSize={12} fontWeight={500} fill={C.muted}>
          plausible for all voters
        </text>
        <rect className="v-inference-sample-a v-inference-sample-blank" x={164} y={134} width={124} height={26} rx={13} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" />
        <g className="v-inference-sample-a v-inference-sample-chip">
          <rect x={164} y={134} width={124} height={26} rx={13} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
          <text x={226} y={153} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.ink}>
            58% to 66%
          </text>
        </g>
      </g>
    </Svg>
  );
}
