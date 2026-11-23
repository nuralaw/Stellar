import { C, Css, Svg, Tex } from "./kit";

// Line graph: population (thousands) 2010: 40, 2012: 46, 2014: 48, 2016: 60. The steepest segment (2014-2016, rise 12 over run 2)
// has the greatest rate; the average rate 2012-2016 is the slope of the dashed chord: (60 - 46) / (2016 - 2012) = 3.5.
export const alt = "A line graph of population in thousands: 40, 46, 48 and 60 in 2010, 2012, 2014 and 2016. The steepest segment is 2014 to 2016. The dashed chord from 2012 to 2016 has slope 14 / 4 = 3.5.";

const P = "v-two-var-data--line-graph-";
const n = (k: string) => P + k;
const cls = (k: string) => `${n("a")} ${n(k)}`;

const px = (yr: number) => 44 + (yr - 2010) * 22.67;
const py = (v: number) => 132 - (v - 36) * 3.9;
const PTS: [number, number][] = [[2010, 40], [2012, 46], [2014, 48], [2016, 60]];

const fade = (k: string, t0: number, t1: number, t2?: number, t3?: number) =>
  t2 === undefined
    ? `.${n(k)} { animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t0}% { opacity: 0 } ${t1}%, 100% { opacity: 1 } }`
    : `.${n(k)} { opacity: 0; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t0}% { opacity: 0 } ${t1}%, ${t2}% { opacity: 1 } ${t3}%, 100% { opacity: 0 } }`;
const draw = (k: string, t: number, d: number) => `.${n(k)} { stroke-dasharray: 100; animation-name: ${n(k)}; }
@keyframes ${n(k)} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 0 } ${t + 0.5}% { stroke-dashoffset: 100; opacity: 1 } ${t + d}%, 100% { stroke-dashoffset: 0; opacity: 1 } }`;

const css = `
.${n("a")} { animation: 12s ease-in-out infinite; }
.${n("scene")} { animation-name: ${n("scene")}; }
@keyframes ${n("scene")} { 0% { opacity: 0 } 4%, 94% { opacity: 1 } 99%, 100% { opacity: 0 } }

${fade("d0", 4, 7)}
${draw("s1", 7, 6)}
${fade("d1", 12, 14)}
${draw("s2", 14, 6)}
${fade("d2", 19, 21)}
${draw("s3", 21, 6)}
${fade("d3", 26, 28)}

/* Step 2: the steepest segment, with its rise and run */
.${n("hot")} { stroke-dasharray: 100; animation-name: ${n("hot")}; }
@keyframes ${n("hot")} { 0%, 29% { opacity: 0; stroke-dashoffset: 100 } 29.5% { opacity: 1; stroke-dashoffset: 100 } 34%, 44% { opacity: 1; stroke-dashoffset: 0 } 48% { opacity: 0; stroke-dashoffset: 0 } 80% { opacity: 0; stroke-dashoffset: 100 } 80.5% { opacity: 1; stroke-dashoffset: 100 } 86%, 100% { opacity: 1; stroke-dashoffset: 0 } }
${fade("tri1", 33, 37, 45, 49)}

/* Step 3: the dashed chord 2012 to 2016 and its rise and run */
.${n("base")} { opacity: 0.35; animation-name: ${n("base")}; }
@keyframes ${n("base")} { 0%, 47% { opacity: 1 } 52%, 100% { opacity: 0.35 } }
${fade("chord", 50, 56)}
${fade("tri2", 58, 62)}

/* Step 4: the formula, then the answer on the chord */
${fade("fm", 66, 71)}
${fade("ans", 73, 78)}

/* Step 5: steep segment = big rate, high point = big value */
${fade("key", 83, 88)}
.${n("top")} { fill: ${C.good}; animation-name: ${n("top")}; }
@keyframes ${n("top")} { 0%, 80% { fill: ${C.ink} } 85%, 100% { fill: ${C.good} } }
`;

const SEG = (i: number) => `M${px(PTS[i][0])} ${py(PTS[i][1])} L${px(PTS[i + 1][0])} ${py(PTS[i + 1][1])}`;
const t11 = { fontSize: 11, fill: C.muted } as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g className={cls("scene")}>
        {/* Grid, axes and titles */}
        <g stroke={C.line} strokeWidth={1}>
          {[40, 50, 60].map((v) => (
            <line key={v} x1={px(2010)} y1={py(v)} x2={px(2016) + 4} y2={py(v)} />
          ))}
          {[2010, 2012, 2014, 2016].map((yr) => (
            <line key={yr} x1={px(yr)} y1={py(36)} x2={px(yr)} y2={py(62)} />
          ))}
        </g>
        <path d={`M${px(2010)} ${py(62)} V${py(36)} H${px(2016) + 4}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
        <g {...t11} textAnchor="middle">
          {[2010, 2012, 2014, 2016].map((yr) => (
            <text key={yr} x={px(yr)} y={147}>
              {yr}
            </text>
          ))}
          <text x={px(2013)} y={162} fontWeight={600}>
            year
          </text>
        </g>
        <g {...t11} textAnchor="end">
          {[40, 50, 60].map((v) => (
            <text key={v} x={px(2010) - 6} y={py(v) + 4}>
              {v}
            </text>
          ))}
        </g>
        <text x={px(2010)} y={20} {...t11} fontWeight={600}>
          population (thousands)
        </text>

        {/* The graph: four dots joined in order */}
        <g className={cls("base")} fill="none" stroke={C.ink} strokeWidth={2.5}>
          <path className={cls("s1")} d={SEG(0)} pathLength={100} />
          <path className={cls("s2")} d={SEG(1)} pathLength={100} />
          <path className={cls("s3")} d={SEG(2)} pathLength={100} />
        </g>

        {/* Step 2: steepest segment in the accent colour, with its triangle */}
        <path className={cls("hot")} d={SEG(2)} pathLength={100} fill="none" stroke={C.primary} strokeWidth={5} />
        <g className={cls("tri1")}>
          <path d={`M${px(2014)} ${py(48)} H${px(2016)} V${py(60)}`} fill="none" stroke={C.primary} strokeWidth={1.5} strokeDasharray="3 3" />
          <text x={(px(2014) + px(2016)) / 2} y={py(48) + 15} fontSize={11} fontWeight={700} fill={C.primaryText} textAnchor="middle">
            run 2
          </text>
          <text x={px(2016) + 8} y={(py(48) + py(60)) / 2 + 4} fontSize={11} fontWeight={700} fill={C.primaryText}>
            rise 12
          </text>
        </g>

        {/* Step 3: dashed chord 2012 to 2016 */}
        <g className={cls("chord")} fill="none" stroke={C.ink} strokeWidth={2.5} strokeDasharray="6 4">
          <path d={`M${px(2012)} ${py(46)} L${px(2016)} ${py(60)}`} />
        </g>
        <g className={cls("tri2")}>
          <path d={`M${px(2012)} ${py(46)} H${px(2016)} V${py(60)}`} fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" />
          <text x={(px(2012) + px(2016)) / 2} y={py(46) + 15} fontSize={11} fontWeight={700} fill={C.ink} textAnchor="middle">
            run 4
          </text>
          <text x={px(2016) + 8} y={(py(46) + py(60)) / 2 + 4} fontSize={11} fontWeight={700} fill={C.ink}>
            rise 14
          </text>
        </g>

        {/* Dots */}
        <g fill={C.ink}>
          <circle className={cls("d0")} cx={px(2010)} cy={py(40)} r={4} />
          <circle className={cls("d1")} cx={px(2012)} cy={py(46)} r={4} />
          <circle className={cls("d2")} cx={px(2014)} cy={py(48)} r={4} />
          <g className={cls("top")}>
            <circle className={cls("d3")} cx={px(2016)} cy={py(60)} r={5.5} />
          </g>
        </g>

        {/* Step 4: the formula and the answer on the chord */}
        <g className={cls("fm")}>
          <Tex x={px(2016) + 12} y={118} size={12} anchor="start" width={104}>{String.raw`\dfrac{60-46}{2016-2012}=3.5`}</Tex>
        </g>
        <g className={cls("ans")} fontSize={12} fontWeight={700} fill={C.primaryText} textAnchor="end">
          <text x={128} y={50}>
            3.5 thousand
          </text>
          <text x={128} y={63}>
            per year
          </text>
        </g>

        {/* Step 5: what the two marks mean */}
        <g className={cls("key")} fontSize={11} fontWeight={700}>
          <text x={px(2016) + 14} y={24} fill={C.primaryText}>
            steepest = big rate
          </text>
          <text x={px(2016) + 14} y={38} fill={C.good}>
            highest = big value
          </text>
        </g>
      </g>
    </Svg>
  );
}
