import { C, Css, Svg } from "./kit";

// Solving 3x + 2 = x + 8: the same move on both sides each time, until x stands alone.
export const alt = "The equation 3x + 2 = x + 8 solved in three steps. Subtract x from both sides, subtract 2 from both sides, divide both sides by 2. The result is x = 3.";

const P = "v-linear-equations-one-var--balance-";
const fc = (t: number) => `${P}f${t}`;
const fade = (t: number) => {
  const n = fc(t);
  return `.${n} { animation-name: ${n}; }
@keyframes ${n} { 0%, ${t}% { opacity: 0; transform: translateY(5px) } ${t + 5}%, 90% { opacity: 1; transform: none } 97%, 100% { opacity: 0; transform: none } }`;
};
const css = `
.v-linear-equations-one-var--balance-a { animation: 9s ease-in-out infinite; }
${[4, 16, 24, 36, 44, 56, 64].map(fade).join("\n")}
`;
const a = `${P}a`;

const ROWS = [
  { y: 28, l: "3x + 2", r: "x + 8", t: 4 },
  { y: 66, l: "2x + 2", r: "8", t: 24 },
  { y: 104, l: "2x", r: "6", t: 44 },
] as const;
const MOVES = [
  { y: 49, m: "− x", t: 16 },
  { y: 87, m: "− 2", t: 36 },
  { y: 125, m: "÷ 2", t: 56 },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {ROWS.map((r) => (
        <g key={r.y} className={`${a} ${fc(r.t)}`}>
          <text x={150} y={r.y} textAnchor="end" fontSize={18} fontWeight={700} fill={C.ink}>
            {r.l}
          </text>
          <text x={160} y={r.y} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.muted}>
            =
          </text>
          <text x={170} y={r.y} fontSize={18} fontWeight={700} fill={C.ink}>
            {r.r}
          </text>
        </g>
      ))}
      {MOVES.map((m) => (
        <g key={m.y} className={`${a} ${fc(m.t)}`}>
          <text x={150} y={m.y} textAnchor="end" fontSize={12} fontWeight={700} fill={C.primaryText}>
            {m.m}
          </text>
          <text x={170} y={m.y} fontSize={12} fontWeight={700} fill={C.primaryText}>
            {m.m}
          </text>
        </g>
      ))}
      <g className={`${a} ${fc(64)}`}>
        <rect x={110} y={130} width={100} height={30} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <text x={160} y={151} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.good}>
          x = 3
        </text>
      </g>
    </Svg>
  );
}
