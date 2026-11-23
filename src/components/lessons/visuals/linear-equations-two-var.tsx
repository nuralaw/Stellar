import { C, Css, Svg, Tex } from "./kit";

// Linear equations in two variables: get y alone, then read the line off the equation.
// 2x + 3y = 12 becomes y = −(2/3)x + 4: the line crosses the y-axis at 4 and goes right 3, down 2.
export const alt = "2x + 3y = 12 is rewritten as y = −(2/3)x + 4. Its line crosses the y-axis at 4 and drops 2 for every 3 to the right: slope −2/3.";

const css = `
.v-linear-equations-two-var-a { animation: 10s ease-in-out infinite; }

/* The whole scene fades in and out, so the reset is never seen. */
.v-linear-equations-two-var-scene { animation-name: v-linear-equations-two-var-scene; }
@keyframes v-linear-equations-two-var-scene { 0% { opacity: 0 } 4%, 92% { opacity: 1 } 98%, 100% { opacity: 0 } }

/* Beat 1: get y alone. The standard form steps aside, y = −(2/3)x + 4 arrives. */
.v-linear-equations-two-var-eq1 { animation-name: v-linear-equations-two-var-eq1; }
@keyframes v-linear-equations-two-var-eq1 { 0%, 9% { transform: translateX(105px) } 17%, 100% { transform: none } }
.v-linear-equations-two-var-eq1i { animation-name: v-linear-equations-two-var-eq1i; }
@keyframes v-linear-equations-two-var-eq1i { 0%, 10% { opacity: 1 } 18%, 100% { opacity: 0 } }
.v-linear-equations-two-var-eq1m { animation-name: v-linear-equations-two-var-eq1m; }
@keyframes v-linear-equations-two-var-eq1m { 0%, 10% { opacity: 0 } 18%, 100% { opacity: 1 } }
.v-linear-equations-two-var-arrow { stroke-dasharray: 100 200; animation-name: v-linear-equations-two-var-arrow; }
@keyframes v-linear-equations-two-var-arrow {
  0%, 11% { stroke-dashoffset: 101; opacity: 0 }
  12% { stroke-dashoffset: 101; opacity: 1 }
  18%, 100% { stroke-dashoffset: 0; opacity: 1 }
}
.v-linear-equations-two-var-get { animation-name: v-linear-equations-two-var-get; }
@keyframes v-linear-equations-two-var-get { 0%, 14% { opacity: 0 } 19%, 100% { opacity: 1 } }
.v-linear-equations-two-var-eq2 { animation-name: v-linear-equations-two-var-eq2; }
@keyframes v-linear-equations-two-var-eq2 { 0%, 19% { opacity: 0; transform: translateX(-8px) } 26%, 100% { opacity: 1; transform: none } }

/* Beat 2: the 4 is the y-intercept */
.v-linear-equations-two-var-hbi { animation-name: v-linear-equations-two-var-hbi; }
@keyframes v-linear-equations-two-var-hbi { 0%, 30% { opacity: 1 } 33%, 100% { opacity: 0 } }
.v-linear-equations-two-var-hb { animation-name: v-linear-equations-two-var-hb; }
@keyframes v-linear-equations-two-var-hb { 0%, 30% { opacity: 0 } 33%, 100% { opacity: 1 } }
.v-linear-equations-two-var-dot { transform-box: fill-box; transform-origin: center; animation-name: v-linear-equations-two-var-dot; }
@keyframes v-linear-equations-two-var-dot { 0%, 30% { transform: scale(0) } 34% { transform: scale(1.6) } 37%, 100% { transform: scale(1) } }
.v-linear-equations-two-var-capb { animation-name: v-linear-equations-two-var-capb; }
@keyframes v-linear-equations-two-var-capb { 0%, 32% { opacity: 0; transform: translateX(6px) } 38%, 100% { opacity: 1; transform: none } }

/* Beat 3: −2/3 is the slope: right 3 (the denominator), down 2 (the numerator) */
.v-linear-equations-two-var-hni { animation-name: v-linear-equations-two-var-hni; }
@keyframes v-linear-equations-two-var-hni { 0%, 46% { opacity: 1 } 54%, 100% { opacity: 0 } }
.v-linear-equations-two-var-hn { animation-name: v-linear-equations-two-var-hn; }
@keyframes v-linear-equations-two-var-hn { 0%, 46% { opacity: 0 } 54%, 100% { opacity: 1 } }
.v-linear-equations-two-var-step1 { stroke-dasharray: 100 200; animation-name: v-linear-equations-two-var-step1; }
@keyframes v-linear-equations-two-var-step1 {
  0%, 44% { stroke-dashoffset: 101; opacity: 0 }
  45% { stroke-dashoffset: 101; opacity: 1 }
  57%, 100% { stroke-dashoffset: 0; opacity: 1 }
}
.v-linear-equations-two-var-tri { animation-name: v-linear-equations-two-var-tri; }
@keyframes v-linear-equations-two-var-tri { 0%, 55% { opacity: 0 } 61%, 100% { opacity: 1 } }
.v-linear-equations-two-var-run { animation-name: v-linear-equations-two-var-run; }
@keyframes v-linear-equations-two-var-run { 0%, 49% { opacity: 0 } 53%, 100% { opacity: 1 } }
.v-linear-equations-two-var-drop { animation-name: v-linear-equations-two-var-drop; }
@keyframes v-linear-equations-two-var-drop { 0%, 54% { opacity: 0 } 58%, 100% { opacity: 1 } }
.v-linear-equations-two-var-capm { animation-name: v-linear-equations-two-var-capm; }
@keyframes v-linear-equations-two-var-capm { 0%, 56% { opacity: 0; transform: translateX(-6px) } 62%, 100% { opacity: 1; transform: none } }
.v-linear-equations-two-var-step2 { stroke-dasharray: 100 200; animation-name: v-linear-equations-two-var-step2; }
@keyframes v-linear-equations-two-var-step2 {
  0%, 56% { stroke-dashoffset: 101; opacity: 0 }
  57% { stroke-dashoffset: 101; opacity: 0.45 }
  65%, 100% { stroke-dashoffset: 0; opacity: 0.45 }
}

/* Beat 4: the line */
.v-linear-equations-two-var-line { stroke-dasharray: 100 200; animation-name: v-linear-equations-two-var-line; }
@keyframes v-linear-equations-two-var-line {
  0%, 63% { stroke-dashoffset: 101; opacity: 0 }
  64% { stroke-dashoffset: 101; opacity: 1 }
  75%, 100% { stroke-dashoffset: 0; opacity: 1 }
}
`;

// y = −(2/3)x + 4 as four parts; each layer shows some parts and keeps the others as invisible spacers,
// so the layers line up exactly and a part can change colour on its own.
const EQ_SLOPE = String.raw`-\dfrac{2}{3}`;
const EQ_PARTS = [String.raw`y=`, EQ_SLOPE, String.raw`x+`, String.raw`4`];
const layer = (show: number[]) => EQ_PARTS.map((p, i) => (show.includes(i) ? p : String.raw`\phantom{${p}}`)).join("");

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>

      <g className="v-linear-equations-two-var-a v-linear-equations-two-var-scene">
        {/* The slope triangle of the first step (under the grid) */}
        <path className="v-linear-equations-two-var-a v-linear-equations-two-var-tri" d="M 92 66 H 155 V 108 Z" fill={C.soft} />

        {/* Grid: 1 unit = 21, origin at (92, 150) */}
        <g stroke={C.line} strokeWidth={1}>
          {[113, 134, 155, 176, 197, 218].map((x) => (
            <line key={`x${x}`} x1={x} y1={58} x2={x} y2={150} />
          ))}
          {[66, 87, 108, 129].map((y) => (
            <line key={`y${y}`} x1={92} y1={y} x2={229} y2={y} />
          ))}
        </g>
        <path d="M 92 55 V 150 H 233" fill="none" stroke={C.muted} strokeWidth={1.5} />

        {/* Slope steps from the y-intercept: right 3, down 2, twice */}
        <path className="v-linear-equations-two-var-a v-linear-equations-two-var-step2" d="M 155 108 H 218 V 150" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} opacity={0.45} />
        <path className="v-linear-equations-two-var-a v-linear-equations-two-var-step1" d="M 92 66 H 155 V 108" pathLength={100} fill="none" stroke={C.primary} strokeWidth={2} />
        <text className="v-linear-equations-two-var-a v-linear-equations-two-var-run" x={123.5} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
          3
        </text>
        <text className="v-linear-equations-two-var-a v-linear-equations-two-var-drop" x={165.5} y={81} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
          −2
        </text>

        {/* The line y = −(2/3)x + 4 */}
        <path className="v-linear-equations-two-var-a v-linear-equations-two-var-line" d="M 92 66 L 230.6 158.4" pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />

        {/* The y-intercept (0, 4) */}
        <g className="v-linear-equations-two-var-a v-linear-equations-two-var-dot" fill={C.primary}>
          <circle cx={92} cy={66} r={9} opacity={0.18} />
          <circle cx={92} cy={66} r={4.5} />
        </g>
        <g className="v-linear-equations-two-var-a v-linear-equations-two-var-capb">
          <text x={80} y={72} textAnchor="end" fontSize={17} fontWeight={700} fill={C.primaryText}>
            4
          </text>
          <text x={80} y={87} textAnchor="end" fontSize={11} fill={C.muted}>
            y-intercept
          </text>
        </g>

        {/* The slope */}
        <g className="v-linear-equations-two-var-a v-linear-equations-two-var-capm">
          <text x={246} y={93} fontSize={11} fill={C.muted}>
            slope
          </text>
          <Tex x={246} y={116} size={18} anchor="start" width={50} color={C.primaryText}>
            {EQ_SLOPE}
          </Tex>
        </g>

        {/* Standard form → slope-intercept form */}
        <g className="v-linear-equations-two-var-a v-linear-equations-two-var-eq1">
          <g className="v-linear-equations-two-var-a v-linear-equations-two-var-eq1i">
            <Tex x={55} y={33} size={15} width={100} color={C.ink}>
              {String.raw`2x+3y=12`}
            </Tex>
          </g>
          <g className="v-linear-equations-two-var-a v-linear-equations-two-var-eq1m">
            <Tex x={55} y={33} size={15} width={100} color={C.muted}>
              {String.raw`2x+3y=12`}
            </Tex>
          </g>
        </g>
        <path className="v-linear-equations-two-var-a v-linear-equations-two-var-arrow" d="M 104 33 H 158" pathLength={100} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g className="v-linear-equations-two-var-a v-linear-equations-two-var-get">
          <path d="M 153.5 29 L 158 33 L 153.5 37" fill="none" stroke={C.muted} strokeWidth={1.5} />
          <text x={131} y={26} textAnchor="middle" fontSize={11} fill={C.muted}>
            get y alone
          </text>
        </g>
        <g className="v-linear-equations-two-var-a v-linear-equations-two-var-eq2">
          <g>
            <Tex x={262} y={33} size={17} anchor="end" width={100} color={C.ink}>
              {layer([0, 2])}
            </Tex>
          </g>
          <g className="v-linear-equations-two-var-a v-linear-equations-two-var-hni">
            <Tex x={262} y={33} size={17} anchor="end" width={100} color={C.ink}>
              {layer([1])}
            </Tex>
          </g>
          <g className="v-linear-equations-two-var-a v-linear-equations-two-var-hn">
            <Tex x={262} y={33} size={17} anchor="end" width={100} color={C.primaryText}>
              {layer([1])}
            </Tex>
          </g>
          <g className="v-linear-equations-two-var-a v-linear-equations-two-var-hbi">
            <Tex x={262} y={33} size={17} anchor="end" width={100} color={C.ink}>
              {layer([3])}
            </Tex>
          </g>
          <g className="v-linear-equations-two-var-a v-linear-equations-two-var-hb">
            <Tex x={262} y={33} size={17} anchor="end" width={100} color={C.primaryText}>
              {layer([3])}
            </Tex>
          </g>
        </g>
      </g>
    </Svg>
  );
}
