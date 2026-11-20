import { C, Css, Svg } from "./kit";

// Read m and b from a graph or a table: b is the output at x = 0, m is the change in output per 1 step of x.
export const alt =
  "The line f(x) = 2x + 3 and its table. At x = 0 the output is 3, so b = 3. Each step of 1 in x adds 2 to the output, so m = 2.";

const P = "v-linear-functions--read-graph-";
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
.v-linear-functions--read-graph-a { animation: 9s ease-in-out infinite; }
${[4, 22, 40, 56, 72].map(fade).join("\n")}
${[8, 24, 34].map(draw).join("\n")}
`;
const a = `${P}a`;

// Grid unit 14 px, origin (32, 152). Point (x, y) -> (32 + 14x, 152 - 14y).
const px = (x: number) => 32 + 14 * x;
const py = (y: number) => 152 - 14 * y;
const TABLE_X = [0, 1, 2, 3];
const TABLE_Y = [3, 5, 7, 9];

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <g stroke={C.line} strokeWidth={1}>
        {[1, 2, 3, 4].map((k) => (
          <line key={`gx${k}`} x1={px(k)} y1={py(0)} x2={px(k)} y2={py(9)} />
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => (
          <line key={`gy${k}`} x1={px(0)} y1={py(k)} x2={px(4)} y2={py(k)} />
        ))}
      </g>
      <path d={`M${px(0)} ${py(9.6)} V${py(0)} H${px(4.4)}`} fill="none" stroke={C.muted} strokeWidth={1.5} />

      {/* The line f(x) = 2x + 3 */}
      <line className={`${a} ${dc(8)}`} x1={px(0)} y1={py(3)} x2={px(3.2)} y2={py(9.4)} pathLength={100} stroke={C.ink} strokeWidth={2.5} />

      {/* b: where the line meets the y-axis */}
      <circle className={`${a} ${fc(22)}`} cx={px(0)} cy={py(3)} r={5} fill={C.primary} />
      <text className={`${a} ${fc(22)}`} x={px(0) + 8} y={py(3) + 16} fontSize={12} fontWeight={700} fill={C.primaryText}>
        b = 3
      </text>

      {/* m: one step right, two up */}
      <path className={`${a} ${dc(34)}`} d={`M${px(1)} ${py(5)} H${px(2)} V${py(7)}`} pathLength={100} fill="none" stroke={C.primary} strokeWidth={2.5} />
      <text className={`${a} ${fc(40)}`} x={px(2) + 8} y={py(6) + 4} fontSize={12} fontWeight={700} fill={C.primaryText}>
        up 2
      </text>

      {/* The same line as a table */}
      <g className={`${a} ${fc(4)}`}>
        <text x={152} y={42} fontSize={12} fill={C.muted}>
          x
        </text>
        <text x={152} y={76} fontSize={12} fill={C.muted}>
          f(x)
        </text>
        {TABLE_X.map((x, i) => (
          <g key={x}>
            <text x={206 + 30 * i} y={42} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
              {x}
            </text>
            <text x={206 + 30 * i} y={76} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.ink}>
              {TABLE_Y[i]}
            </text>
          </g>
        ))}
        <line x1={150} y1={54} x2={298} y2={54} stroke={C.line} strokeWidth={1.5} />
      </g>
      <g className={`${a} ${fc(22)}`}>
        <rect x={192} y={58} width={28} height={26} rx={6} fill="none" stroke={C.primary} strokeWidth={2} />
      </g>
      <g className={`${a} ${fc(56)}`}>
        {[0, 1, 2].map((i) => (
          <text key={i} x={221 + 30 * i} y={96} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.primaryText}>
            +2
          </text>
        ))}
      </g>
      <g className={`${a} ${fc(72)}`}>
        <text x={152} y={134} fontSize={12} fill={C.muted}>
          f(x) = mx + b
        </text>
        <text x={152} y={156} fontSize={18} fontWeight={700} fill={C.good}>
          f(x) = 2x + 3
        </text>
      </g>
    </Svg>
  );
}
