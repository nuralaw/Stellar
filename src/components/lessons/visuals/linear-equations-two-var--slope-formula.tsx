import { C, Css, Svg, Tex } from "./kit";

// Slope from two points: rise over run. (1, 2) and (5, 8): rise 6, run 4, slope 3/2.
export const alt = "A line through the points (1, 2) and (5, 8). The run is 4 and the rise is 6, so the slope is 6/4 = 3/2.";

const P = "v-linear-equations-two-var--slope-formula-";
const fc = (t: number) => `${P}f${t}`;
const dc = (t: number) => `${P}d${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0 } ${t + 5}%, 90% { opacity: 1 } 97%, 100% { opacity: 0 } }`;
};
const draw = (t: number) => {
  const n = dc(t);
  return `.${n} { stroke-dasharray: 100; animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 10}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const css = `
.v-linear-equations-two-var--slope-formula-a { animation: 9s ease-in-out infinite; }
${[4, 22, 30, 38, 46, 60, 74].map(fade).join("\n")}
${[10, 30, 38].map(draw).join("\n")}
`;
const a = `${P}a`;

// Grid unit 16 px, origin (28, 150). Point (x, y) -> (28 + 16x, 150 - 16y).
const px = (x: number) => 28 + 16 * x;
const py = (y: number) => 150 - 16 * y;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {/* Axes and light grid */}
      <g stroke={C.line} strokeWidth={1}>
        {[1, 2, 3, 4, 5, 6, 7].map((k) => (
          <line key={`gx${k}`} x1={px(k)} y1={py(0)} x2={px(k)} y2={py(8)} />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
          <line key={`gy${k}`} x1={px(0)} y1={py(k)} x2={px(7)} y2={py(k)} />
        ))}
      </g>
      <path d={`M${px(0)} ${py(8.3)} V${py(0)} H${px(7.4)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />

      {/* The line through the two points (slope 3/2) */}
      <line className={`${a} ${dc(10)}`} x1={px(0.2)} y1={py(0.8)} x2={px(5.2)} y2={py(8.3)} pathLength={100} stroke={C.ink} strokeWidth={2} />

      {/* Points */}
      <g className={`${a} ${fc(4)}`}>
        <circle cx={px(1)} cy={py(2)} r={4.5} fill={C.primary} />
        <circle cx={px(5)} cy={py(8)} r={4.5} fill={C.primary} />
        <text x={px(1) + 8} y={py(2) + 14} fontSize={12} fontWeight={600} fill={C.ink}>
          (1, 2)
        </text>
        <text x={px(5) + 8} y={py(8) + 4} fontSize={12} fontWeight={600} fill={C.ink}>
          (5, 8)
        </text>
      </g>

      {/* Run, then rise */}
      <line className={`${a} ${dc(30)}`} x1={px(1)} y1={py(2)} x2={px(5)} y2={py(2)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      <line className={`${a} ${dc(38)}`} x1={px(5)} y1={py(2)} x2={px(5)} y2={py(8)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      <g className={`${a} ${fc(30)}`}>
        <text x={px(3)} y={py(2) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
          run 4
        </text>
      </g>
      <g className={`${a} ${fc(38)}`}>
        <text x={px(5) + 8} y={py(5) + 4} fontSize={12} fontWeight={700} fill={C.primaryText}>
          rise 6
        </text>
      </g>

      {/* The formula */}
      <g className={`${a} ${fc(22)}`}>
        <Tex x={166} y={26} size={16} anchor="start" width={150} color={C.muted}>
          {String.raw`\text{slope}=\dfrac{\text{rise}}{\text{run}}`}
        </Tex>
      </g>
      <g className={`${a} ${fc(46)}`}>
        <Tex x={166} y={66} size={17} anchor="start" width={150} color={C.ink}>
          {String.raw`=\dfrac{8-2}{5-1}`}
        </Tex>
      </g>
      <g className={`${a} ${fc(60)}`}>
        <Tex x={166} y={106} size={17} anchor="start" width={150} color={C.ink}>
          {String.raw`=\dfrac{6}{4}`}
        </Tex>
      </g>
      <g className={`${a} ${fc(74)}`}>
        <Tex x={166} y={148} size={20} anchor="start" width={150} color={C.good}>
          {String.raw`=\dfrac{3}{2}`}
        </Tex>
      </g>
    </Svg>
  );
}
