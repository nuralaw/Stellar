import { C, Css, Svg, Tex } from "./kit";

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
  { y: 28, l: String.raw`3x+2`, r: String.raw`x+8`, t: 4 },
  { y: 66, l: String.raw`2x+2`, r: "8", t: 24 },
  { y: 104, l: String.raw`2x`, r: "6", t: 44 },
] as const;
const MOVES = [
  { y: 49, m: String.raw`-x`, t: 16 },
  { y: 87, m: String.raw`-2`, t: 36 },
  { y: 125, m: String.raw`\div 2`, t: 56 },
] as const;

export default function Visual() {
  return (
    <Svg label={alt}>
      <Css>{css}</Css>
      {ROWS.map((r) => (
        <g key={r.y} className={`${a} ${fc(r.t)}`}>
          <Tex x={150} y={r.y - 6} size={19} anchor="end" width={100} color={C.ink}>
            {r.l}
          </Tex>
          <text x={160} y={r.y} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.muted}>
            =
          </text>
          <Tex x={170} y={r.y - 6} size={19} anchor="start" width={100} color={C.ink}>
            {r.r}
          </Tex>
        </g>
      ))}
      {MOVES.map((m) => (
        <g key={m.y} className={`${a} ${fc(m.t)}`}>
          <Tex x={150} y={m.y - 3} size={16} anchor="end" width={50} color={C.primaryText}>
            {m.m}
          </Tex>
          <Tex x={170} y={m.y - 3} size={16} anchor="start" width={50} color={C.primaryText}>
            {m.m}
          </Tex>
        </g>
      ))}
      <g className={`${a} ${fc(64)}`}>
        <rect x={110} y={130} width={100} height={30} rx={8} fill={C.goodSoft} stroke={C.good} strokeWidth={1.5} />
        <Tex x={160} y={145} size={21} width={100} color={C.good}>
          {String.raw`x=3`}
        </Tex>
      </g>
    </Svg>
  );
}
