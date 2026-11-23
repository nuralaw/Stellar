import { C, Css, Svg, Tex } from "./kit";

// y = x² − 6x + c. Raise c and the parabola lifts off the x-axis: c = 5 crosses twice, c = 9 touches once, c = 13 misses.
export const alt =
  "Parabolas y = x² − 6x + c. For c = 5 (b² − 4ac = 16) it crosses the x-axis twice. For c = 9 (0) it touches once. For c = 13 (−16) it misses the axis: no solutions.";

const P = "v-nonlinear-equations--discriminant-";
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
@keyframes ${n} { 0%, ${t}% { stroke-dashoffset: 100; opacity: 1 } ${t + 12}%, 90% { stroke-dashoffset: 0; opacity: 1 } 97%, 100% { stroke-dashoffset: 0; opacity: 0 } }`;
};
const css = `
.v-nonlinear-equations--discriminant-a { animation: 9s ease-in-out infinite; }
${[4, 20, 34, 50, 64, 80].map(fade).join("\n")}
${[8, 38, 68].map(draw).join("\n")}
`;
const a = `${P}a`;

// Each panel: 88 × 100 at (x0, 30). x-axis at panel y 66 (page y = 96). Horizontal unit 16 px, vertical unit 6 px, x = 3 at the panel center.
// y = (x − 3)² + (c − 9). Vertex below the axis by 4 (c = 5), on it (c = 9), above it by 4 (c = 13). Drawn for x from 1 to 5.
const AXIS = 88;
const PANELS = [
  { x0: 16, c: 5, vy: AXIS + 24, ends: AXIS, t: 4, dr: 8, lab: 20, cap: 34, text: "two solutions", disc: String.raw`b^2-4ac=16` },
  { x0: 116, c: 9, vy: AXIS, ends: AXIS - 24, t: 34, dr: 38, lab: 50, cap: 50, text: "one solution", disc: String.raw`b^2-4ac=0` },
  { x0: 216, c: 13, vy: AXIS - 24, ends: AXIS - 48, t: 64, dr: 68, lab: 80, cap: 80, text: "no solution", disc: String.raw`b^2-4ac=-16` },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      <Tex x={160} y={17} size={15} width={160} color={C.muted}>{String.raw`y=x^2-6x+c`}</Tex>
      {PANELS.map((p, i) => {
        const mid = p.x0 + 44;
        const left = mid - 32;
        const right = mid + 32;
        const ctrl = 2 * p.vy - p.ends;
        const gc = i === 2 ? C.muted : C.good;
        return (
          <g key={p.c}>
            <g className={`${a} ${fc(p.t)}`}>
              <rect x={p.x0} y={32} width={88} height={88} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
              <line x1={p.x0 + 6} y1={AXIS} x2={p.x0 + 82} y2={AXIS} stroke={C.muted} strokeWidth={1.5} />
            </g>
            <path className={`${a} ${dc(p.dr)}`} d={`M${left} ${p.ends} Q${mid} ${ctrl} ${right} ${p.ends}`} pathLength={100} fill="none" stroke={C.ink} strokeWidth={2.5} />
            <g className={`${a} ${fc(p.lab)}`}>
              {i === 0 && (
                <>
                  <circle cx={left} cy={AXIS} r={5} fill={gc} />
                  <circle cx={right} cy={AXIS} r={5} fill={gc} />
                </>
              )}
              {i === 1 && <circle cx={mid} cy={AXIS} r={5} fill={gc} />}
              <Tex x={mid} y={128} size={15} width={80}>{`c=${p.c}`}</Tex>
              <Tex x={mid} y={145} size={12} width={88}>{p.disc}</Tex>
              <text x={mid} y={164} textAnchor="middle" fontSize={12} fontWeight={600} fill={gc}>
                {p.text}
              </text>
            </g>
          </g>
        );
      })}
    </Svg>
  );
}
