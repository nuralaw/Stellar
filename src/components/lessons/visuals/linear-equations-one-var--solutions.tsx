import { C, Css, Svg } from "./kit";

// Three kinds of answer: two lines that cross (one solution), parallel lines (none), the same line (infinitely many).
export const alt =
  "Each side of an equation drawn as a line. Lines that cross: one solution. Parallel lines: no solution. Two copies of the same line: infinitely many solutions.";

const P = "v-linear-equations-one-var--solutions-";
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
.v-linear-equations-one-var--solutions-a { animation: 8s ease-in-out infinite; }
${[6, 28, 50].map(fade).join("\n")}
${[10, 16, 32, 38, 54, 60].map(draw).join("\n")}
${[20, 42, 64].map(fade).join("\n")}
`;

const a = `${P}a`;
const PANELS = [
  { x: 16, t: 6, line: 10, cap: 20, eq: "x = 3", label: "one solution" },
  { x: 116, t: 28, line: 32, cap: 42, eq: "4 = 7", label: "no solution" },
  { x: 216, t: 50, line: 54, cap: 64, eq: "6 = 6", label: "every x works" },
] as const;

/** Lines inside a 88 × 96 panel whose top-left is (x, 22). */
const LINES = [
  [
    [10, 80, 78, 20],
    [10, 25, 78, 75],
  ],
  [
    [10, 76, 78, 36],
    [10, 54, 78, 14],
  ],
  [
    [10, 76, 78, 24],
    [10, 76, 78, 24],
  ],
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {PANELS.map((p, i) => {
        const [l1, l2] = LINES[i];
        const same = i === 2;
        return (
          <g key={p.x}>
            <g className={`${a} ${fc(p.t)}`}>
              <rect x={p.x} y={22} width={88} height={96} rx={10} fill={C.fill} stroke={C.line} strokeWidth={1.5} />
            </g>
            <line
              className={`${a} ${dc(p.line)}`}
              x1={p.x + l1[0]}
              y1={22 + l1[1]}
              x2={p.x + l1[2]}
              y2={22 + l1[3]}
              pathLength={100}
              stroke={same ? C.muted : C.ink}
              strokeWidth={same ? 6 : 2.5}
            />
            <line
              className={`${a} ${dc(p.line + 6)}`}
              x1={p.x + l2[0]}
              y1={22 + l2[1]}
              x2={p.x + l2[2]}
              y2={22 + l2[3]}
              pathLength={100}
              stroke={C.primary}
              strokeWidth={2.5}
            />
            {i === 0 && <circle className={`${a} ${fc(p.cap)}`} cx={p.x + 44} cy={72} r={5} fill={C.good} />}
            <g className={`${a} ${fc(p.cap)}`}>
              <text x={p.x + 44} y={142} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.ink}>
                {p.eq}
              </text>
              <text x={p.x + 44} y={160} textAnchor="middle" fontSize={12} fill={i === 0 ? C.good : C.muted} fontWeight={600}>
                {p.label}
              </text>
            </g>
          </g>
        );
      })}
    </Svg>
  );
}
