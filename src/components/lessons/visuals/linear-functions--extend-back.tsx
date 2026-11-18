import { C, Css, Svg } from "./kit";

// "$4 for the first km, $2 for each additional km": the line through (1, 4), (2, 6), (3, 8) reaches (0, 2), not (0, 4).
export const alt =
  "The taxi costs 4, 6 and 8 dollars for 1, 2 and 3 km. The line through these points, extended back to 0 km, meets the vertical axis at 2, not 4. So C(d) = 2d + 2.";

const P = "v-linear-functions--extend-back-";
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
.v-linear-functions--extend-back-a { animation: 9s ease-in-out infinite; }
${[4, 18, 32, 46, 60, 74].map(fade).join("\n")}
${[10, 46].map(draw).join("\n")}
`;
const a = `${P}a`;

// Grid unit 16 px, origin (40, 156). Point (d, cost) -> (40 + 16d, 156 - 16 cost).
const px = (x: number) => 40 + 16 * x;
const py = (y: number) => 156 - 16 * y;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g stroke={C.line} strokeWidth={1}>
        {[1, 2, 3, 4].map((k) => (
          <line key={`gx${k}`} x1={px(k)} y1={py(0)} x2={px(k)} y2={py(8.5)} />
        ))}
        {[2, 4, 6, 8].map((k) => (
          <line key={`gy${k}`} x1={px(0)} y1={py(k)} x2={px(4.3)} y2={py(k)} />
        ))}
      </g>
      <path d={`M${px(0)} ${py(8.7)} V${py(0)} H${px(4.6)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />
      <text x={px(4.6) + 4} y={py(0) + 4} fontSize={11} fill={C.muted}>
        km
      </text>

      {/* The three real prices */}
      <line className={`${a} ${dc(10)}`} x1={px(1)} y1={py(4)} x2={px(3.3)} y2={py(8.6)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />
      <g className={`${a} ${fc(4)}`}>
        {[1, 2, 3].map((d) => (
          <circle key={d} cx={px(d)} cy={py(2 * d + 2)} r={4.5} fill={C.ink} />
        ))}
        <text x={px(1) + 8} y={py(4) + 16} fontSize={12} fontWeight={600} fill={C.ink}>
          first km: 4
        </text>
      </g>

      {/* The line carried back to 0 km */}
      <line className={`${a} ${dc(46)}`} x1={px(1)} y1={py(4)} x2={px(0)} y2={py(2)} pathLength={100} stroke={C.primary} strokeWidth={2.5} />
      <g className={`${a} ${fc(60)}`}>
        <circle cx={px(0)} cy={py(2)} r={5} fill={C.primary} />
        <text x={px(0) + 8} y={py(2) + 16} fontSize={12} fontWeight={700} fill={C.primary}>
          (0, 2)
        </text>
      </g>

      {/* The algebra */}
      <g className={`${a} ${fc(18)}`}>
        <text x={160} y={46} fontSize={14} fontWeight={600} fill={C.ink}>
          C(d) = 4 + 2(d − 1)
        </text>
      </g>
      <g className={`${a} ${fc(32)}`}>
        <text x={160} y={76} fontSize={14} fontWeight={600} fill={C.ink}>
          = 4 + 2d − 2
        </text>
      </g>
      <g className={`${a} ${fc(46)}`}>
        <text x={160} y={106} fontSize={18} fontWeight={700} fill={C.primary}>
          = 2d + 2
        </text>
      </g>
      <g className={`${a} ${fc(74)}`}>
        <text x={160} y={138} fontSize={12} fill={C.muted}>
          b = 2 is the cost at 0 km,
        </text>
        <text x={160} y={154} fontSize={12} fill={C.muted}>
          not the first-km price.
        </text>
      </g>
    </Svg>
  );
}
